#!/usr/bin/env node
/**
 * Checks the website content before it is built: `npm run check:content`.
 *
 * News posts (content/news/*.md, *.markdown):
 * - the front matter parses; `title` is set; `date` is set, in quotes, as
 *   "YYYY-MM-DD" or "YYYY-MM-DD HH:mm", and a real date; `unlisted` is
 *   true/false; `coverImage` points to a file in public/;
 * - links and images to /images/... or /assets/... point to files in
 *   public/, links to /news/... to existing posts, and every other link
 *   starts with /, #, http(s)://, mailto: or tel:;
 * - no Liquid ({{ }}, {% %}) or kramdown ({: ...}) syntax from the old
 *   Jekyll site, no "fancy" mathematical Unicode letters (unreadable for
 *   screen readers), and every <iframe> has a title.
 *
 * Member profiles (content/organization/*.md):
 * - the front matter parses; `name` is set; `linkedin`/`orcid` are empty
 *   or https URLs; `image` is empty or a file in public/; `order` is a number;
 * - privacy: no e-mail addresses or phone numbers.
 *
 * Repository: no spreadsheets or data exports (.csv, .xlsx, ...) are
 * tracked by git, since they tend to contain personal data.
 *
 * Usage: node scripts/check-content.mjs [repository root]
 * Exits with code 1 when there is at least one error.
 */

import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { lineAt, Report } from "./lib/report.mjs";

const root = path.resolve(process.argv[2] ?? path.join(import.meta.dirname, ".."));
const NEWS_DIR = "content/news";
const MEMBERS_DIR = "content/organization";
const PUBLIC_DIR = "public";

const report = new Report("Content check");

/** Markdown files the site reads: `.md` and `.markdown`, directly in the folder. */
const isMarkdown = (file) => /\.(md|markdown)$/.test(file);

/**
 * Lists the files directly inside a content folder (subfolders are not read
 * by the site either), sorted by name.
 *
 * @param {string} dir - Folder relative to the root
 */
function listFiles(dir) {
  const absolute = path.join(root, dir);
  if (!fs.existsSync(absolute)) {
    report.error(dir, undefined, "folder not found.");
    return [];
  }
  return fs
    .readdirSync(absolute, { withFileTypes: true })
    .filter((entry) => entry.isFile() && !entry.name.startsWith("."))
    .map((entry) => entry.name)
    .sort();
}

/**
 * Splits a markdown file into its raw front matter and body, keeping track
 * of the line on which the body starts.
 *
 * @param {string} text - The whole file
 * @returns {{ frontMatter: string, body: string, bodyLine: number } | null}
 *   null when the file doesn't start with a `---` front-matter block
 */
function splitFrontMatter(text) {
  const match = text.match(/^---[ \t]*\r?\n([\s\S]*?)\r?\n---[ \t]*(?:\r?\n|$)/);
  if (!match) return null;
  return {
    frontMatter: match[1],
    body: text.slice(match[0].length),
    bodyLine: lineAt(text, match[0].length),
  };
}

/**
 * Parses a file's front matter with gray-matter (as src/lib/api.ts does).
 *
 * @param {string} file - Path for messages
 * @param {string} text - The whole file
 * @returns {{ data: Record<string, unknown>, frontMatter: string, body: string, bodyLine: number } | null}
 *   null (after reporting an error) when there is no valid front matter
 */
function parseFile(file, text) {
  const parts = splitFrontMatter(text);
  if (!parts) {
    report.error(file, 1, 'no front matter: the file must start with a block between two "---" lines.');
    return null;
  }
  try {
    // Passing options (even none) makes gray-matter parse the text instead of returning a cached result.
    const { data } = matter(text, {});
    return { data, ...parts };
  } catch (error) {
    const yamlLine = error?.mark?.line;
    report.error(
      file,
      yamlLine === undefined ? 1 : yamlLine + 2,
      `the front matter is not valid YAML: ${error.reason ?? error.message}. Check quotes and colons; quote any value that contains a ":".`,
    );
    return null;
  }
}

/**
 * Finds the line of a front-matter field and its raw (unparsed) value.
 *
 * @param {string} frontMatter - Raw front matter, without the `---` lines
 * @param {string} field - Field name
 * @returns {{ line: number, raw: string } | undefined} line in the file (front matter starts on line 2)
 */
function findField(frontMatter, field) {
  const lines = frontMatter.split(/\r?\n/);
  const index = lines.findIndex((line) => new RegExp(`^${field}\\s*:`).test(line));
  if (index === -1) return undefined;
  return { line: index + 2, raw: lines[index].replace(new RegExp(`^${field}\\s*:\\s*`), "") };
}

/**
 * Replaces code (fenced blocks and inline code spans) and HTML comments with
 * spaces, keeping line breaks, so examples in code and commented-out text
 * are not reported while line numbers stay correct.
 *
 * @param {string} text - Markdown
 */
function maskCodeAndComments(text) {
  const blank = (match) => match.replace(/[^\n]/g, " ");
  return text
    .replace(/^( {0,3})(`{3,}|~{3,})[^\n]*\n[\s\S]*?(?:^\1\2[^\n]*$|(?![\s\S]))/gm, blank)
    .replace(/<!--[\s\S]*?-->/g, blank)
    .replace(/(`+)(?!`)[^\n]*?[^`]\1(?!`)/g, blank);
}

/**
 * Whether a root-relative path (e.g. "/images/poster/a.png") is a file in public/.
 *
 * @param {string} urlPath - Path starting with "/", possibly with ?query or #hash
 */
function publicFileExists(urlPath) {
  const clean = decodeURIComponent(urlPath.replace(/[?#].*$/, ""));
  const file = path.join(root, PUBLIC_DIR, clean);
  return file.startsWith(path.join(root, PUBLIC_DIR) + path.sep) && fs.existsSync(file) && fs.statSync(file).isFile();
}

/** Link targets that need no further check. */
const SAFE_SCHEMES = /^(https?:\/\/|mailto:|tel:|#)/i;

/**
 * Collects the link and image targets in a markdown body: inline links and
 * images, reference definitions, and src/href attributes of raw HTML.
 *
 * @param {string} body - Masked markdown body
 * @returns {{ target: string, offset: number }[]}
 */
function findTargets(body) {
  const targets = [];
  const patterns = [
    /\]\(\s*<?([^\s)>]+)>?(?:\s+["'(][^)]*)?\)/g, // [text](target "title"), ![alt](target)
    /^ {0,3}\[[^\]\n]+\]:\s*<?([^\s>]+)>?/gm, // [label]: target
    /\s(?:src|href)\s*=\s*["']([^"']*)["']/gi, // <img src="...">, <a href="...">
  ];
  for (const pattern of patterns) {
    for (const match of body.matchAll(pattern)) {
      targets.push({ target: match[1], offset: match.index + match[0].indexOf(match[1]) });
    }
  }
  return targets;
}

/**
 * Checks one link or image target of a post.
 *
 * @param {string} file - Post path, for messages
 * @param {number} line - Line of the target
 * @param {string} target - The link target as written
 * @param {Set<string>} postSlugs - Slugs of all posts, to check /news/... links
 */
function checkTarget(file, line, target, postSlugs) {
  if (SAFE_SCHEMES.test(target)) return;

  if (!target.startsWith("/")) {
    report.error(
      file,
      line,
      `link "${target}" is neither an absolute URL nor a path starting with "/": it will be broken. ` +
        'Write internal links like "/news/<post>" or "/images/...", external ones with "https://".',
    );
    return;
  }

  if (/^\/(images|assets)\//.test(target)) {
    if (!publicFileExists(target)) {
      report.error(file, line, `"${target}" does not exist: add the file to public${target.replace(/[?#].*$/, "")} or fix the path (names are case-sensitive).`);
    }
    return;
  }

  const newsLink = target.match(/^\/news\/([^/?#]+)\/?(?:[?#].*)?$/);
  if (newsLink && !postSlugs.has(newsLink[1])) {
    report.error(file, line, `"${target}" links to a post that does not exist: content/news/${newsLink[1]}.md (or .markdown) is missing.`);
  }
}

/**
 * Checks the parts of a markdown body that are common to posts and members:
 * leftover Jekyll syntax, mathematical letters and iframe titles.
 *
 * @param {string} file - Path for messages
 * @param {string} body - The body (front matter removed)
 * @param {number} bodyLine - Line on which the body starts
 */
function checkMarkdownSyntax(file, body, bodyLine) {
  const masked = maskCodeAndComments(body);
  const at = (offset) => bodyLine + lineAt(masked, offset) - 1;

  for (const match of masked.matchAll(/\{\{[\s\S]*?\}\}|\{%[\s\S]*?%\}/g)) {
    report.error(file, at(match.index), `Liquid template syntax "${match[0].slice(0, 40)}" is shown as-is on the website: replace it with the actual value or link.`);
  }
  for (const match of masked.matchAll(/\{:[^}\n]*\}/g)) {
    report.error(file, at(match.index), `kramdown attribute "${match[0]}" is shown as-is on the website: remove it.`);
  }
  for (const match of masked.matchAll(/<iframe\b[^>]*>/gi)) {
    if (!/\stitle\s*=\s*["'][^"']*\S[^"']*["']/i.test(match[0])) {
      report.error(file, at(match.index), '<iframe> without a title: add title="..." describing what it shows, e.g. title="Map of the venue".');
    }
  }
  return masked;
}

/** Mathematical alphanumeric symbols (𝐁𝐨𝐥𝐝, 𝘪𝘵𝘢𝘭𝘪𝘤 "fonts"): screen readers can't read them. */
const MATH_ALPHANUMERIC = /[\u{1D400}-\u{1D7FF}]/gu;

/**
 * Reports "fancy" Unicode letters anywhere in a file.
 *
 * @param {string} file - Path for messages
 * @param {string} text - The whole file
 */
function checkMathLetters(file, text) {
  for (const match of text.matchAll(MATH_ALPHANUMERIC)) {
    report.error(file, lineAt(text, match.index), `"${match[0]}" is a mathematical symbol, not a letter: screen readers and search engines can't read it. Type plain text and use **bold** or *italic* instead.`);
    return; // One report per file is enough.
  }
}

/** "YYYY-MM-DD" or "YYYY-MM-DD HH:mm", as documented in guides/news-post.md. */
const DATE_FORMAT = /^(\d{4})-(\d{2})-(\d{2})(?: (\d{2}):(\d{2}))?$/;

/**
 * Whether a "YYYY-MM-DD[ HH:mm]" string is a real calendar date and time.
 *
 * @param {RegExpMatchArray} parts - Match of {@link DATE_FORMAT}
 */
function isRealDate([, year, month, day, hours = "00", minutes = "00"]) {
  const date = new Date(Date.UTC(+year, +month - 1, +day, +hours, +minutes));
  return (
    date.getUTCFullYear() === +year &&
    date.getUTCMonth() === +month - 1 &&
    date.getUTCDate() === +day &&
    date.getUTCHours() === +hours &&
    date.getUTCMinutes() === +minutes
  );
}

/**
 * Checks one news post.
 *
 * @param {string} name - File name in content/news
 * @param {Set<string>} postSlugs - Slugs of all posts
 */
function checkPost(name, postSlugs) {
  const file = `${NEWS_DIR}/${name}`;
  const text = fs.readFileSync(path.join(root, file), "utf8");
  checkMathLetters(file, text);
  const parsed = parseFile(file, text);
  if (!parsed) return;
  const { data, frontMatter, body, bodyLine } = parsed;

  if (typeof data.title !== "string" || !data.title.trim()) {
    report.error(file, findField(frontMatter, "title")?.line ?? 1, 'missing "title": add title: "Your post title" to the front matter.');
  }

  const dateField = findField(frontMatter, "date");
  if (!dateField || data.date === undefined || data.date === null || data.date === "") {
    report.error(file, dateField?.line ?? 1, 'missing "date": add date: "YYYY-MM-DD" (the publication date, in quotes) to the front matter.');
  } else {
    const quoted = dateField.raw.match(/^(["'])(.*)\1\s*(?:#.*)?$/);
    if (!quoted) {
      report.error(file, dateField.line, `the date must be in quotes, e.g. date: "${String(dateField.raw).replace(/\s*#.*$/, "").trim() || "2026-05-15"}". Without quotes YAML turns it into a different kind of value and posts end up in the wrong order.`);
    } else {
      const parts = quoted[2].match(DATE_FORMAT);
      if (!parts) {
        report.error(file, dateField.line, `date "${quoted[2]}" must be "YYYY-MM-DD" or "YYYY-MM-DD HH:mm" with leading zeros, e.g. "2026-05-04".`);
      } else if (!isRealDate(parts)) {
        report.error(file, dateField.line, `date "${quoted[2]}" is not a real date or time.`);
      }
    }
  }

  if (data.unlisted !== undefined && typeof data.unlisted !== "boolean") {
    report.error(file, findField(frontMatter, "unlisted")?.line, "unlisted must be true or false, without quotes.");
  }

  if (data.excerpt !== undefined && typeof data.excerpt !== "string") {
    report.error(file, findField(frontMatter, "excerpt")?.line, 'excerpt must be text in quotes, e.g. excerpt: "One or two sentences."');
  }

  if (data.coverImage !== undefined && data.coverImage !== "") {
    const line = findField(frontMatter, "coverImage")?.line;
    if (typeof data.coverImage !== "string" || !data.coverImage.startsWith("/")) {
      report.error(file, line, 'coverImage must be a path starting with "/images/", e.g. "/images/poster/2026-10-15-event.jpg".');
    } else {
      checkTarget(file, line, data.coverImage, postSlugs);
    }
  }

  const masked = checkMarkdownSyntax(file, body, bodyLine);
  for (const { target, offset } of findTargets(masked)) {
    checkTarget(file, bodyLine + lineAt(masked, offset) - 1, target, postSlugs);
  }
}

/** E-mail addresses. */
const EMAIL = /[A-Za-z0-9._%+-]+@[A-Za-z0-9-]+(?:\.[A-Za-z0-9-]+)*\.[A-Za-z]{2,}/g;

/**
 * Phone numbers: at least 9 digits, optionally starting with "+", separated
 * by spaces, dots, dashes, slashes or brackets ("+32 470 12 34 56",
 * "0470/12.34.56", "(02) 123 45 67"). Years such as "2026-2027" have fewer
 * digits; URLs (ORCID iDs) are removed before searching.
 */
const PHONE = /(?:\+|\b)\d(?:[ .\-/()]{0,2}\d){8,}\b/g;

/**
 * Checks one member profile.
 *
 * @param {string} name - File name in content/organization
 */
function checkMember(name) {
  const file = `${MEMBERS_DIR}/${name}`;
  const text = fs.readFileSync(path.join(root, file), "utf8");

  // Privacy first: this runs even if the front matter is broken.
  const withoutUrls = text.replace(/https?:\/\/\S+/g, (url) => url.replace(/[^\n]/g, " "));
  for (const match of withoutUrls.matchAll(EMAIL)) {
    report.error(file, lineAt(text, match.index), `contains an e-mail address ("${match[0]}"). Member profiles are public: don't publish personal contact details.`);
  }
  for (const match of withoutUrls.matchAll(PHONE)) {
    report.error(file, lineAt(text, match.index), `contains what looks like a phone number ("${match[0].trim()}"). Member profiles are public: don't publish personal contact details.`);
  }

  checkMathLetters(file, text);
  const parsed = parseFile(file, text);
  if (!parsed) return;
  const { data, frontMatter, body, bodyLine } = parsed;

  if (typeof data.name !== "string" || !data.name.trim()) {
    report.error(file, findField(frontMatter, "name")?.line ?? 1, 'missing "name": add name: "First Last" to the front matter. Profiles without a name are not shown.');
  }

  for (const field of ["linkedin", "orcid"]) {
    const value = data[field];
    if (value === undefined || value === null || value === "") continue;
    if (typeof value !== "string" || !/^https:\/\/\S+$/.test(value.trim())) {
      report.error(file, findField(frontMatter, field)?.line, `${field} must be empty ("") or a full https:// profile URL, not "${value}".`);
    }
  }

  const image = data.image;
  if (image !== undefined && image !== null && image !== "") {
    const line = findField(frontMatter, "image")?.line;
    if (typeof image !== "string" || /^https?:\/\//.test(image)) {
      report.error(file, line, 'image must be a file in public/images/team/ (e.g. "jane-doe.jpg"), or "" to show the initials.');
    } else {
      // Same rule as src/lib/api.ts: a bare file name is in /images/team/.
      const urlPath = image.startsWith("/") ? image : `/images/team/${image}`;
      if (!publicFileExists(urlPath)) {
        report.error(file, line, `image "${image}" does not exist: add public${urlPath} or fix the name (names are case-sensitive).`);
      }
    }
  }

  if (data.order !== undefined && data.order !== null && !Number.isFinite(Number(data.order))) {
    report.error(file, findField(frontMatter, "order")?.line, `order must be a number, e.g. order: 2, not "${data.order}".`);
  }

  checkMarkdownSyntax(file, body, bodyLine);
}

/** File types that are typically data exports (member lists, registrations). */
const DATA_EXPORT = /\.(csv|tsv|xlsx?|ods|numbers)$/i;

/**
 * Reports spreadsheets and data exports tracked by git (committed or
 * staged): they tend to contain personal data, and git keeps every
 * committed file in its history.
 */
function checkTrackedDataExports() {
  let tracked;
  try {
    tracked = execFileSync("git", ["ls-files", "-z"], { cwd: root, encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] });
  } catch {
    report.warn(".", undefined, "not a git repository (or git is not installed): skipped the check for committed spreadsheets.");
    return;
  }
  for (const file of tracked.split("\0").filter((f) => DATA_EXPORT.test(f))) {
    report.error(file, undefined, "spreadsheets and data exports must not be committed: they often contain personal data. Remove it with `git rm --cached` and keep it outside the repository.");
  }
}

const postFiles = listFiles(NEWS_DIR);
const posts = postFiles.filter(isMarkdown);
const postSlugs = new Set(posts.map((file) => file.replace(/\.(md|markdown)$/, "")));
for (const other of postFiles.filter((file) => !isMarkdown(file))) {
  report.warn(`${NEWS_DIR}/${other}`, undefined, "not a .md or .markdown file, so it is not published. Move it to public/ if it is an image or attachment.");
}
for (const name of posts) checkPost(name, postSlugs);

const members = listFiles(MEMBERS_DIR).filter(isMarkdown);
for (const name of members) checkMember(name);

checkTrackedDataExports();

report.finish(`${posts.length} posts and ${members.length} member profiles`);
