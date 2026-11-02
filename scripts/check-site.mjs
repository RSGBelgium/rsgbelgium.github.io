#!/usr/bin/env node
/**
 * Checks the built site in out/ (run `npm run build` first): `npm run check:site`.
 *
 * Every HTML page:
 * - accessibility basics: exactly one <h1>; exactly one <main id="main-content">,
 *   not nested; the "Skip to main content" link is the first focusable
 *   element; no skipped heading levels (h2 -> h4); every <img> has alt
 *   (alt="" for decorative images); every <iframe> has a title; no generic
 *   link texts ("here", "read more"); no mathematical "fancy font" letters;
 * - no Liquid ({{ }}, {% %}) or kramdown ({: }, {#id}) syntax in the text;
 * - no Twitter/X or Facebook links in the header or footer;
 * - every internal link and resource (href, src, srcset, og:image/og:url;
 *   root-relative or on the site's own domain) resolves to a file in out/: "/about" to
 *   out/about.html, "/news/" to out/news/index.html, "/images/a.png" to the
 *   file itself; and every #anchor exists on the target page;
 * - no relative or mistyped link targets ("ttps://...", "assets/a.pdf").
 *
 * sitemap.xml and feed.xml: every URL on the site's domain resolves too.
 *
 * Usage: node scripts/check-site.mjs [output folder, default: out]
 * Exits with code 1 when there is at least one error.
 */

import fs from "node:fs";
import path from "node:path";
import { parse } from "node-html-parser";
import { Report } from "./lib/report.mjs";

const repoRoot = path.join(import.meta.dirname, "..");
const outDir = path.resolve(process.argv[2] ?? path.join(repoRoot, "out"));
// How out/ is named in messages: relative to the current folder when inside it.
const relativeOut = path.relative(process.cwd(), outDir);
const outName = relativeOut && !relativeOut.startsWith("..") ? relativeOut : outDir;

const report = new Report("Site check");

/**
 * The live site's origin, read from SITE_URL in src/lib/constants.ts, so
 * absolute links to the site itself (canonical URLs, sitemap) are checked too.
 */
function readSiteUrl() {
  try {
    const constants = fs.readFileSync(path.join(repoRoot, "src/lib/constants.ts"), "utf8");
    return constants.match(/SITE_URL\s*=\s*["']([^"']+)["']/)?.[1]?.replace(/\/$/, "");
  } catch {
    return undefined;
  }
}
const SITE_URL = readSiteUrl();

if (!fs.existsSync(outDir)) {
  console.error(`${outName} does not exist: run \`npm run build\` first.`);
  process.exit(1);
}

/** All files below `dir`, as paths relative to out/ with forward slashes. */
function listFiles(dir, prefix = "") {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const relative = `${prefix}${entry.name}`;
    return entry.isDirectory() ? listFiles(path.join(dir, entry.name), `${relative}/`) : [relative];
  });
}

const allFiles = new Set(listFiles(outDir));
const pages = [...allFiles]
  .filter((file) => file.endsWith(".html") && !file.startsWith("_next/"))
  .sort();

/** Parsed pages, by path relative to out/. */
const parsed = new Map();

/**
 * Parses an exported page once. Script, style and pre contents are kept as raw text.
 *
 * @param {string} page - Path relative to out/, e.g. "news/a-post.html"
 */
function load(page) {
  if (!parsed.has(page)) {
    const html = fs.readFileSync(path.join(outDir, page), "utf8");
    parsed.set(
      page,
      parse(html, { blockTextElements: { script: true, noscript: true, style: true, pre: true } }),
    );
  }
  return parsed.get(page);
}

/** Yields every node below `node` in document order. */
function* walk(node) {
  for (const child of node.childNodes) {
    yield child;
    if (child.nodeType === 1) yield* walk(child);
  }
}

/** Lower-case tag name of an element node. */
const tag = (element) => element.rawTagName?.toLowerCase();

/** Whether an element is reachable with the Tab key (roughly, by its markup). */
function isFocusable(element) {
  const tabindex = element.getAttribute("tabindex");
  if (tabindex !== undefined) return tabindex !== "-1";
  switch (tag(element)) {
    case "a":
      return element.getAttribute("href") !== undefined;
    case "input":
      return element.getAttribute("type") !== "hidden";
    case "button":
    case "select":
    case "textarea":
    case "iframe":
      return true;
    default:
      return false;
  }
}

/**
 * The visible text of an element, one string per text node: text outside
 * script, style, code and other elements that don't show their content as
 * text. Code is skipped, so posts can show template syntax as an example.
 */
function visibleTexts(element) {
  const skip = new Set(["script", "style", "noscript", "template", "pre", "code"]);
  const texts = [];
  const visit = (node) => {
    for (const child of node.childNodes) {
      if (child.nodeType === 3) texts.push(child.text);
      else if (child.nodeType === 1 && !skip.has(tag(child))) visit(child);
    }
  };
  visit(element);
  return texts;
}

/**
 * Maps a URL path to the file in out/ that GitHub Pages serves for it, or
 * undefined when there is none: "/" -> index.html, "/about" -> about.html,
 * "/news/" -> news/index.html, "/images/a.png" -> images/a.png.
 *
 * @param {string} urlPath - Path starting with "/", without query or hash
 */
function resolvePath(urlPath) {
  let decoded;
  try {
    decoded = decodeURIComponent(urlPath);
  } catch {
    return undefined;
  }
  const relative = decoded.replace(/^\/+/, "");
  const candidates =
    relative === "" || relative.endsWith("/")
      ? [`${relative}index.html`]
      : [relative, `${relative}.html`, `${relative}/index.html`];
  return candidates.find((candidate) => allFiles.has(candidate));
}

/**
 * Turns a link target into a path on the site, or undefined for links that
 * leave the site (other domains, mailto:, ...).
 *
 * @param {string} target - href/src value
 * @param {string} page - The page the link is on (for same-page anchors)
 * @returns {{ path: string, hash: string } | { error: string } | undefined}
 */
function internalTarget(target, page) {
  const value = target.trim();
  if (value === "" || /^(mailto:|tel:|data:|javascript:)/i.test(value)) return undefined;

  if (value.startsWith("#")) return { path: `/${page}`, hash: value.slice(1), samePage: true };

  let rest;
  if (
    SITE_URL &&
    (value === SITE_URL ||
      value.startsWith(`${SITE_URL}/`) ||
      value.startsWith(`${SITE_URL}#`) ||
      value.startsWith(`${SITE_URL}?`))
  ) {
    rest = value.slice(SITE_URL.length) || "/";
  } else if (value.startsWith("/") && !value.startsWith("//")) {
    rest = value;
  } else if (/^(https?:)?\/\//i.test(value)) {
    return undefined; // another site
  } else {
    return {
      error: `link target "${value}" is relative or has an unknown scheme: it resolves against the current page and is most likely broken. Use "/..." or "https://...".`,
    };
  }

  const hashIndex = rest.indexOf("#");
  const hash = hashIndex === -1 ? "" : rest.slice(hashIndex + 1);
  const withoutHash = hashIndex === -1 ? rest : rest.slice(0, hashIndex);
  return { path: withoutHash.replace(/\?.*$/, "") || "/", hash };
}

/** Ids (and <a name>s) on a page, to check #anchors. */
function idsOf(page) {
  const root = load(page);
  const ids = new Set();
  for (const element of root.querySelectorAll("[id], a[name]")) {
    ids.add(element.getAttribute("id") ?? element.getAttribute("name"));
  }
  return ids;
}

/**
 * Checks one link or resource target found on a page.
 *
 * @param {string} page - The page, relative to out/
 * @param {string} target - The href/src value
 * @param {string} description - What carries the link, for messages, e.g. '<a href>'
 */
function checkTarget(page, target, description) {
  const resolved = internalTarget(target, page);
  if (!resolved) return;
  if ("error" in resolved) {
    report.error(`${outName}/${page}`, undefined, `${description}: ${resolved.error}`);
    return;
  }

  const file = resolved.samePage ? page : resolvePath(resolved.path);
  if (!file) {
    report.error(
      `${outName}/${page}`,
      undefined,
      `${description} "${target}" points to a page or file that does not exist in ${outName}/.`,
    );
    return;
  }
  if (resolved.hash && file.endsWith(".html")) {
    let id = resolved.hash;
    try {
      id = decodeURIComponent(id);
    } catch {
      // keep the raw hash
    }
    if (!idsOf(file).has(id)) {
      report.error(
        `${outName}/${page}`,
        undefined,
        `${description} "${target}": there is no element with id="${id}" on ${file}.`,
      );
    }
  }
}

/** Link texts that say nothing about where the link goes. */
const GENERIC_LINK_TEXTS = new Set([
  "here",
  "click here",
  "read more",
  "more",
  "link",
  "this link",
]);

/** Leftover Jekyll syntax: Liquid tags/output and kramdown attribute lists or header ids. */
const LEFTOVER_SYNTAX = /\{\{|\{%|\{:|\{#[A-Za-z]/;

/**
 * Runs every check on one page.
 *
 * @param {string} page - Path relative to out/
 */
function checkPage(page) {
  const file = `${outName}/${page}`;
  const root = load(page);
  const body = root.querySelector("body");
  if (!body) {
    report.error(file, undefined, "no <body> element.");
    return;
  }

  // One <h1>.
  const h1Count = root.querySelectorAll("h1").length;
  if (h1Count !== 1)
    report.error(
      file,
      undefined,
      `has ${h1Count} <h1> elements; every page needs exactly one (its title).`,
    );

  // One <main id="main-content">, not nested.
  const mains = root.querySelectorAll("main");
  if (mains.length !== 1)
    report.error(
      file,
      undefined,
      `has ${mains.length} <main> elements; the root layout provides the only one.`,
    );
  if (root.querySelectorAll("main main").length > 0)
    report.error(file, undefined, "has a <main> inside <main>.");
  if (mains.length > 0 && mains[0].getAttribute("id") !== "main-content") {
    report.error(file, undefined, '<main> has no id="main-content", the target of the skip link.');
  }

  // Walk the page once, in document order.
  let firstFocusable;
  let previousLevel = 0;
  for (const node of walk(body)) {
    if (node.nodeType !== 1) continue;
    const name = tag(node);

    if (!firstFocusable && isFocusable(node)) firstFocusable = node;

    const heading = name?.match(/^h([1-6])$/);
    if (heading) {
      const level = Number(heading[1]);
      if (previousLevel && level > previousLevel + 1) {
        const text = node.text.trim().replace(/\s+/g, " ").slice(0, 60);
        report.error(
          file,
          undefined,
          `heading levels skip from <h${previousLevel}> to <h${level}> ("${text}"). In markdown, don't skip a level (## then ###).`,
        );
      }
      previousLevel = level;
    }

    if (name === "img" && node.getAttribute("alt") === undefined) {
      report.error(
        file,
        undefined,
        `<img src="${node.getAttribute("src")}"> has no alt attribute; use alt="" for decorative images.`,
      );
    }
    if (name === "iframe" && !node.getAttribute("title")?.trim()) {
      report.error(
        file,
        undefined,
        `<iframe src="${(node.getAttribute("src") ?? "").slice(0, 60)}"> has no title.`,
      );
    }
    if (name === "a") {
      const text = node.text.trim().replace(/\s+/g, " ").toLowerCase();
      if (GENERIC_LINK_TEXTS.has(text) && !node.getAttribute("aria-label")) {
        report.error(
          file,
          undefined,
          `link text "${text}" (to ${node.getAttribute("href")}) doesn't say where the link goes; describe the target instead.`,
        );
      }
    }

    // Internal links and resources.
    for (const attribute of ["href", "src"]) {
      const value = node.getAttribute(attribute);
      if (value !== undefined) checkTarget(page, value, `<${name} ${attribute}>`);
    }
    if (
      name === "meta" &&
      /^(og:image|og:url|twitter:image)$/.test(
        node.getAttribute("property") ?? node.getAttribute("name") ?? "",
      )
    ) {
      checkTarget(
        page,
        node.getAttribute("content") ?? "",
        `<meta ${node.getAttribute("property") ?? node.getAttribute("name")}>`,
      );
    }
    const srcset = node.getAttribute("srcset") ?? node.getAttribute("imagesrcset");
    if (srcset) {
      for (const candidate of srcset.split(",")) {
        const url = candidate.trim().split(/\s+/)[0];
        if (url) checkTarget(page, url, `<${name} srcset>`);
      }
    }
  }

  if (!(
    firstFocusable &&
    tag(firstFocusable) === "a" &&
    firstFocusable.getAttribute("href") === "#main-content"
  )) {
    const found = firstFocusable
      ? `<${tag(firstFocusable)} ${firstFocusable.getAttribute("href") ?? ""}>`.replace(" >", ">")
      : "nothing";
    report.error(
      file,
      undefined,
      `the first focusable element must be the "Skip to main content" link (href="#main-content"), found ${found}.`,
    );
  }

  // Leftover Jekyll syntax and "fancy" letters in the visible text.
  for (const text of visibleTexts(body)) {
    const snippet = () => text.trim().replace(/\s+/g, " ").slice(0, 80);
    if (LEFTOVER_SYNTAX.test(text)) {
      report.error(file, undefined, `the page shows template syntax: "${snippet()}".`);
    }
    if (/[\u{1D400}-\u{1D7FF}]/u.test(text)) {
      report.error(
        file,
        undefined,
        `the page shows mathematical "fancy font" letters, which screen readers can't read: "${snippet()}".`,
      );
    }
  }

  // RSG-Belgium has no Twitter/X or Facebook account.
  for (const region of root.querySelectorAll("header, footer")) {
    for (const link of region.querySelectorAll("a[href]")) {
      if (
        /^https?:\/\/(www\.)?(twitter\.com|x\.com|facebook\.com)\//i.test(link.getAttribute("href"))
      ) {
        report.error(
          file,
          undefined,
          `the site header/footer links to ${link.getAttribute("href")}; RSG-Belgium has no Twitter/X or Facebook account.`,
        );
      }
    }
  }
}

/**
 * Checks that the site's own URLs in an XML file (sitemap, feed) exist.
 *
 * @param {string} name - File name in out/
 * @param {RegExp} pattern - Captures one URL per match
 */
function checkXmlUrls(name, pattern) {
  const file = path.join(outDir, name);
  if (!fs.existsSync(file)) {
    report.error(`${outName}/${name}`, undefined, "is missing.");
    return 0;
  }
  const xml = fs.readFileSync(file, "utf8");
  let count = 0;
  for (const match of xml.matchAll(pattern)) {
    const url = match[1].replace(/&amp;/g, "&");
    if (!SITE_URL || !url.startsWith(SITE_URL)) continue;
    count++;
    const resolved = internalTarget(url, name);
    if (resolved && "path" in resolved && !resolvePath(resolved.path)) {
      report.error(`${outName}/${name}`, undefined, `${url} does not exist in ${outName}/.`);
    }
  }
  return count;
}

for (const page of pages) checkPage(page);
const sitemapUrls = checkXmlUrls("sitemap.xml", /<loc>([^<]+)<\/loc>/g);
const feedUrls = checkXmlUrls("feed.xml", /<link>([^<]+)<\/link>/g);

report.finish(
  `${pages.length} pages in ${outName}/, ${sitemapUrls} sitemap URLs and ${feedUrls} feed links`,
);
