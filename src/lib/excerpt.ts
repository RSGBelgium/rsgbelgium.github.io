/**
 * Plain-text excerpt generation.
 *
 * Derives a short summary from a post's markdown body, for posts that have
 * no `excerpt` in their front matter. The summary is used as the meta
 * description, in the RSS feed and in post previews.
 */

import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import { visit, EXIT } from "unist-util-visit";
import { toString } from "mdast-util-to-string";
import type { Paragraph } from "mdast";

/** Default excerpt length, in characters: about what search engines show of a description. */
export const EXCERPT_MAX_LENGTH = 160;

/** Shared markdown parser (parsing only, no HTML output). */
const markdownParser = unified().use(remarkParse).use(remarkGfm);

/**
 * Shortens text to at most `maxLength` characters, cutting at a word
 * boundary and ending with an ellipsis ("…") when anything was cut.
 *
 * @param text - Plain text with collapsed whitespace
 * @param maxLength - Maximum length of the result, ellipsis included
 * @returns The text unchanged when it fits, otherwise the shortened text
 */
export function truncateAtWord(text: string, maxLength: number = EXCERPT_MAX_LENGTH): string {
  if (text.length <= maxLength) return text;

  const cut = text.slice(0, maxLength - 1); // leave room for the ellipsis
  const lastSpace = cut.lastIndexOf(" ");
  // Cut at the last space, unless that would throw away most of the text (one very long word).
  const shortened = lastSpace > maxLength / 2 ? cut.slice(0, lastSpace) : cut;
  // Don't end on dangling punctuation such as "word,…" or "(…".
  return `${shortened.replace(/[\s,;:.!?(\-–—]+$/, "")}…`;
}

/**
 * Derives a plain-text summary from markdown.
 *
 * Takes the text of the first paragraphs (including those in block quotes
 * and lists), in document order. Headings, images, raw HTML, code, tables
 * and link definitions are left out; links and emphasis keep only their text.
 *
 * @param markdown - The markdown body (without front matter)
 * @param maxLength - Maximum length of the excerpt, ellipsis included (default: 160)
 * @returns The excerpt, or "" when the body has no paragraph text
 */
export function createExcerpt(markdown: string, maxLength: number = EXCERPT_MAX_LENGTH): string {
  const tree = markdownParser.parse(markdown);
  let text = "";

  visit(tree, "paragraph", (node: Paragraph) => {
    const paragraphText = toString(node, { includeImageAlt: false, includeHtml: false })
      .replace(/\s+/g, " ")
      .trim();
    if (paragraphText) text = text ? `${text} ${paragraphText}` : paragraphText;
    // Stop once there is enough text to fill the excerpt.
    if (text.length > maxLength) return EXIT;
  });

  return truncateAtWord(text, maxLength);
}
