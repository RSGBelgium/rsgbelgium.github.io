/**
 * Reading the markdown files in content/, shared by the scripts in scripts/.
 */

import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { isMarkdownFile } from "../../src/lib/content-rules.ts";
import { listFiles } from "./public-files.mjs";

/**
 * Reads the front matter of every markdown file directly inside a content
 * folder, the files the site publishes. A file whose front matter can't be
 * parsed is skipped: `npm run check:content` reports it.
 *
 * @param {string} root - Repository root
 * @param {string} dir - Content folder relative to the root, e.g. "content/news"
 * @returns {{ file: string, data: Record<string, unknown> }[]} file relative to the root
 */
export function readFrontMatter(root, dir) {
  return listFiles(path.join(root, dir)).flatMap((name) => {
    if (name.includes("/") || !isMarkdownFile(name)) return [];
    const file = `${dir}/${name}`;
    try {
      // The empty options object turns off gray-matter's cache, so a re-read sees edits.
      return [{ file, data: matter(fs.readFileSync(path.join(root, file), "utf8"), {}).data }];
    } catch {
      return [];
    }
  });
}
