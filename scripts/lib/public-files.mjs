/**
 * Helpers for the files in public/, shared by the scripts in scripts/.
 *
 * Everything in public/ is published as-is: public/images/a.png is served
 * at /images/a.png. Paths are compared with their exact upper/lower case,
 * because GitHub Pages (and CI) are case-sensitive even when the editor's
 * computer (macOS, Windows) is not: "/images/team/anis.jpg" does not find
 * public/images/team/anis.JPG on the live site.
 */

import fs from "node:fs";
import path from "node:path";

/** The folder that is published as the site's root, relative to the repository root. */
export const PUBLIC_DIR = "public";

/**
 * Files that operating systems drop into folders. They are ignored by git
 * (.gitignore) and never published on purpose, so the checks skip them.
 */
const OS_FILES = new Set([".DS_Store", "Thumbs.db", "desktop.ini"]);

/**
 * Lists every file below a folder, as paths relative to it with forward
 * slashes, sorted. Operating-system files ({@link OS_FILES}) are skipped.
 *
 * @param {string} dir - Absolute folder path
 * @returns {string[]} e.g. ["favicon/favicon.ico", "images/team/anis.webp"]
 */
export function listFiles(dir) {
  if (!fs.existsSync(dir)) return [];
  const visit = (current, prefix) =>
    fs.readdirSync(current, { withFileTypes: true }).flatMap((entry) => {
      if (OS_FILES.has(entry.name)) return [];
      const relative = `${prefix}${entry.name}`;
      if (entry.isDirectory()) return visit(path.join(current, entry.name), `${relative}/`);
      return entry.isFile() ? [relative] : [];
    });
  return visit(dir, "").sort();
}

/**
 * Where the site refers to files in public/: the code, the content, other
 * public files (web manifest, browserconfig) and the Next.js config. Files
 * in a folder are read only if their name matches `pattern`.
 *
 * @type {({ dir: string, pattern: RegExp } | { file: string })[]}
 */
export const SITE_SOURCES = [
  { dir: "src", pattern: /\.(css|[cm]?[jt]sx?|json|txt)$/ },
  { dir: "content", pattern: /\.(md|markdown)$/ },
  { dir: PUBLIC_DIR, pattern: /\.(css|html|json|txt|webmanifest|xml)$/ },
  { file: "next.config.js" },
];

/**
 * Lists the files of some sources (see {@link SITE_SOURCES}).
 *
 * @param {string} root - Repository root
 * @param {({ dir: string, pattern: RegExp } | { file: string })[]} sources - Folders and single files
 * @returns {string[]} Existing files, relative to the root, e.g. "src/app/layout.tsx"
 */
export function listSourceFiles(root, sources) {
  return sources.flatMap((source) => {
    if (source.file) return fs.existsSync(path.join(root, source.file)) ? [source.file] : [];
    return listFiles(path.join(root, source.dir))
      .filter((relative) => source.pattern.test(relative))
      .map((relative) => `${source.dir}/${relative}`);
  });
}

/**
 * Creates a function that tells whether a root-relative URL path (e.g.
 * "/images/poster/a.webp") is a file in public/, with exactly this
 * upper/lower case. Directory listings are cached.
 *
 * @param {string} root - Repository root
 * @returns {(urlPath: string) => boolean} accepts paths with a ?query or #hash, and %-encoded names
 */
export function createPublicFileExists(root) {
  /** Directory listings: folder path -> entries (exact names). */
  const listings = new Map();

  return function publicFileExists(urlPath) {
    let clean;
    try {
      clean = decodeURIComponent(urlPath.replace(/[?#].*$/, ""));
    } catch {
      return false;
    }
    let current = path.join(root, PUBLIC_DIR);
    for (const segment of clean.split("/").filter(Boolean)) {
      if (segment === "." || segment === "..") return false;
      if (!listings.has(current)) {
        listings.set(
          current,
          fs.existsSync(current) && fs.statSync(current).isDirectory()
            ? fs.readdirSync(current)
            : [],
        );
      }
      if (!listings.get(current).includes(segment)) return false;
      current = path.join(current, segment);
    }
    return fs.statSync(current).isFile();
  };
}

/** Escapes text for use in a regular expression. */
export const escapeRegExp = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/**
 * A regular expression that finds a root-relative URL path in text only as
 * a whole path: "/images/a.png" matches in `src="/images/a.png"`,
 * `](/images/a.png)` and `"/images/a.png?v=2"`, but not inside
 * "/images/a.png.bak", "/old/images/a.png" or "https://example.org/images/a.png".
 *
 * @param {string} urlPath - e.g. "/images/team/anis.JPG" (matched case-sensitively)
 * @returns {RegExp} global
 */
export function urlPathPattern(urlPath) {
  return new RegExp(`(?<![\\w.~%/-])${escapeRegExp(urlPath)}(?![\\w.~%/-])`, "g");
}

/**
 * Size in bytes as a short human-readable string: "980 B", "12.3 KB", "1.40 MB".
 *
 * @param {number} bytes
 */
export function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}
