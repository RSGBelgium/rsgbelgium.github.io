#!/usr/bin/env node
/**
 * Checks the files in public/: `npm run check:assets`.
 *
 * Everything in public/ is copied into the published site, so every file
 * there adds to the download and to the clutter editors have to look at.
 *
 * - Unused files: every file must be referenced by its URL path (e.g.
 *   "/images/team/anis.webp", with exactly this upper/lower case) from
 *   the site's code in src/ (tests don't count: their paths are made up),
 *   a post or profile in content/, next.config.js, or a text file in
 *   public/ (the web manifest, browserconfig.xml). A member photo given by
 *   file name only (`image: "anis.webp"`) counts, and so does a quoted file
 *   name in src/ ("rsg-logo.webp"). Files that browsers request without a
 *   link are listed in IMPLICITLY_USED.
 * - Size budget (BUDGETS): raster images (WebP, JPEG, PNG, ICO, ...) at
 *   most 300 KB and SVGs at most 100 KB. After `npm run optimize:images`
 *   the largest image is well below that. PDFs and calendar files are
 *   exempt: they are print-quality downloads that nobody loads by accident.
 * - File names: no upper-case extensions (".JPG") and no spaces or other
 *   characters that have to be escaped in a URL.
 * - Broken references: every /images/..., /assets/... and /favicon/... path
 *   in src/, next.config.js and the text files in public/ is a file in
 *   public/ (links in content/ are checked by `npm run check:content`).
 *
 * Usage: node scripts/check-assets.mjs [--list] [repository root]
 *   --list  also print every file in public/ with its size and where it is used
 * Exits with code 1 when there is at least one error.
 */

import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import {
  createPublicFileExists,
  escapeRegExp,
  formatBytes,
  listFiles,
  PUBLIC_DIR,
  urlPathPattern,
} from "./lib/public-files.mjs";
import { lineAt, Report } from "./lib/report.mjs";

const args = process.argv.slice(2);
const listAll = args.includes("--list");
const root = path.resolve(
  args.find((arg) => !arg.startsWith("--")) ?? path.join(import.meta.dirname, ".."),
);

const KB = 1024;

/**
 * Size budgets per kind of file, checked in this order. Files that match
 * none (PDF, ICS, the web manifest, ...) have no budget.
 */
const BUDGETS = [
  {
    kind: "a raster image",
    pattern: /\.(avif|gif|ico|jpe?g|png|webp)$/i,
    maxBytes: 300 * KB,
    fix: "run `npm run optimize:images` (it resizes images and converts them to WebP), or export the image smaller",
  },
  {
    kind: "an SVG",
    pattern: /\.svg$/i,
    maxBytes: 100 * KB,
    fix: "an SVG this big usually embeds photos: run `npm run optimize:images` to turn it into a WebP, or simplify the drawing",
  },
];

/**
 * Files that are used without a link: browsers and other clients request
 * them at a fixed path by convention. Keep this list short; a file only
 * belongs here when nothing in the site can reference it.
 */
const IMPLICITLY_USED = [
  "favicon.ico", // requested by browsers when a page (or a PDF, or the feed) names no icon
  "apple-touch-icon.png", // requested by iOS when a page is added to the home screen
  ".well-known/", // standard locations such as /.well-known/security.txt (a folder)
];

/** Where public files are referenced from. Files are read only if their name matches `pattern`. */
const SOURCES = [
  { dir: "src", pattern: /\.(css|[cm]?[jt]sx?|json|txt)$/ },
  { dir: "content", pattern: /\.(md|markdown)$/ },
  { dir: PUBLIC_DIR, pattern: /\.(css|html|json|txt|webmanifest|xml)$/ },
  { file: "next.config.js" },
];

/** Test files: the paths in them are fixtures, not real uses. */
const IS_TEST = /(^|\/)__tests__\/|\.(test|spec)\.[cm]?[jt]sx?$/;

/** Folder of member profiles, whose `image` may be a bare file name in /images/team/. */
const MEMBERS_DIR = "content/organization";

/** Paths to public files in code and config: "/images/...", "/assets/...", "/favicon/...". */
const PUBLIC_PATH = /(?<![\w.~%/-])\/(?:images|assets|favicon)\/[^\s"'`()<>{}$\\,;]*/g;

/** Characters that have to be escaped in a URL, or that some systems handle badly. */
const UNSAFE_NAME = /[\s#?%"'<>\\^`{|}]/;

const report = new Report("Asset check");
const publicFileExists = createPublicFileExists(root);

/**
 * Reads the text files that can reference public files.
 *
 * @returns {{ file: string, text: string }[]} paths relative to the root
 */
function readSources() {
  const sources = [];
  for (const source of SOURCES) {
    if (source.file) {
      const absolute = path.join(root, source.file);
      if (fs.existsSync(absolute))
        sources.push({ file: source.file, text: fs.readFileSync(absolute, "utf8") });
      continue;
    }
    for (const relative of listFiles(path.join(root, source.dir))) {
      const file = `${source.dir}/${relative}`;
      if (!source.pattern.test(relative) || IS_TEST.test(file)) continue;
      sources.push({ file, text: fs.readFileSync(path.join(root, file), "utf8") });
    }
  }
  return sources;
}

/**
 * Member photos given as a bare file name (`image: "anis.webp"`), which the
 * site looks up in /images/team/ (src/lib/api.ts).
 *
 * @returns {Map<string, string>} URL path -> profile that uses it
 */
function memberPhotosByName() {
  const photos = new Map();
  for (const name of listFiles(path.join(root, MEMBERS_DIR))) {
    if (name.includes("/") || !/\.(md|markdown)$/.test(name)) continue;
    const file = `${MEMBERS_DIR}/${name}`;
    let image;
    try {
      image = matter(fs.readFileSync(path.join(root, file), "utf8"), {}).data.image;
    } catch {
      continue; // Broken front matter is reported by `npm run check:content`.
    }
    if (typeof image !== "string" || !image.trim()) continue;
    const value = image.trim();
    if (!value.startsWith("/") && !/^https?:\/\//.test(value))
      photos.set(`/images/team/${value}`, file);
  }
  return photos;
}

/**
 * Finds where a public file is used.
 *
 * @param {string} file - Path relative to public/, e.g. "images/team/anis.webp"
 * @param {{ file: string, text: string }[]} sources
 * @param {Map<string, string>} memberPhotos
 * @returns {string[]} where it is used, e.g. ["content/organization/anis-ismail.md"]; empty when unused
 */
function findUses(file, sources, memberPhotos) {
  const urlPath = `/${file}`;
  const pattern = urlPathPattern(urlPath);
  const uses = sources
    .filter((source) => source.text.search(pattern) !== -1)
    .map((source) => source.file);
  if (memberPhotos.has(urlPath)) uses.push(memberPhotos.get(urlPath));
  if (uses.length > 0) return uses;

  // A file name in quotes in the site's code, e.g. a constant that is joined with a folder.
  const quotedName = new RegExp(`(["'\`])${escapeRegExp(path.posix.basename(file))}\\1`);
  const byName = sources
    .filter((source) => source.file.startsWith("src/") && quotedName.test(source.text))
    .map((source) => `${source.file} (by file name)`);
  if (byName.length > 0) return byName;

  const implicit = IMPLICITLY_USED.find((entry) =>
    entry.endsWith("/") ? file.startsWith(entry) : file === entry,
  );
  return implicit ? ["(requested by browsers by convention)"] : [];
}

/**
 * Checks a file's name: lower-case extension, nothing that needs escaping in a URL.
 *
 * @param {string} file - Path relative to public/
 */
function checkName(file) {
  const where = `${PUBLIC_DIR}/${file}`;
  const extension = path.posix.extname(file);
  if (extension !== extension.toLowerCase()) {
    report.error(
      where,
      undefined,
      `upper-case file extension "${extension}" → rename it to "${path.posix.basename(file, extension)}${extension.toLowerCase()}" and update the links to it (\`npm run optimize:images\` does both for images). Links are case-sensitive on the live site.`,
    );
  }
  if (UNSAFE_NAME.test(file)) {
    report.error(
      where,
      undefined,
      "the name contains spaces or characters that have to be escaped in links → rename it using only lowercase letters, digits and hyphens, and update the links to it.",
    );
  }
}

/**
 * Checks a file against its size budget.
 *
 * @param {string} file - Path relative to public/
 * @param {number} size - Size in bytes
 */
function checkBudget(file, size) {
  const budget = BUDGETS.find((entry) => entry.pattern.test(file));
  if (budget && size > budget.maxBytes) {
    report.error(
      `${PUBLIC_DIR}/${file}`,
      undefined,
      `${formatBytes(size)} is over the ${formatBytes(budget.maxBytes)} budget for ${budget.kind} → ${budget.fix}.`,
    );
  }
}

/**
 * Reports paths to /images/, /assets/ or /favicon/ in code and config that
 * are not files in public/ (with exactly this upper/lower case).
 *
 * @param {{ file: string, text: string }[]} sources
 */
function checkReferences(sources) {
  for (const { file, text } of sources) {
    if (file.startsWith("content/")) continue; // Checked by `npm run check:content`.
    for (const match of text.matchAll(PUBLIC_PATH)) {
      const urlPath = match[0].replace(/[.:]+$/, ""); // End of a sentence in a comment.
      if (urlPath.endsWith("/") || publicFileExists(urlPath)) continue;
      report.error(
        file,
        lineAt(text, match.index),
        `"${urlPath}" is not a file in public/ → fix the path (names are case-sensitive) or add public${urlPath.replace(/[?#].*$/, "")}.`,
      );
    }
  }
}

const files = listFiles(path.join(root, PUBLIC_DIR));
const sources = readSources();
const memberPhotos = memberPhotosByName();

let totalBytes = 0;
let unusedBytes = 0;
const rows = [];
for (const file of files) {
  const size = fs.statSync(path.join(root, PUBLIC_DIR, file)).size;
  totalBytes += size;
  const uses = findUses(file, sources, memberPhotos);
  rows.push({ file, size, uses });

  if (uses.length === 0) {
    unusedBytes += size;
    report.error(
      `${PUBLIC_DIR}/${file}`,
      undefined,
      `not used: nothing in src/, content/ or the site's config links to /${file} → delete it (git keeps the old version), or link to it.`,
    );
  }
  checkName(file);
  checkBudget(file, size);
}
checkReferences(sources);

if (listAll) {
  const width = Math.max(...rows.map((row) => row.file.length), 4);
  console.log(`${"File".padEnd(width)}  ${"Size".padStart(9)}  Used in`);
  for (const { file, size, uses } of rows) {
    console.log(
      `${file.padEnd(width)}  ${formatBytes(size).padStart(9)}  ${uses.join(", ") || "UNUSED"}`,
    );
  }
  console.log(
    `\n${rows.length} files, ${formatBytes(totalBytes)}; unused: ${rows.filter((row) => row.uses.length === 0).length} files, ${formatBytes(unusedBytes)}.\n`,
  );
}

report.finish(`${files.length} files in public/ (${formatBytes(totalBytes)})`);
