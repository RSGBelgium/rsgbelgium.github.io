/**
 * Splits a team member's markdown bio for the team cards on /organization.
 *
 * A card shows the bio's first block (usually its first paragraph) and puts
 * the rest behind a "Read more" toggle, so that one long bio doesn't make
 * its whole row of cards several times taller than the others.
 */

import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import type { RootContent } from "mdast";

/** Shared markdown parser (parsing only, no HTML output). */
const markdownParser = unified().use(remarkParse).use(remarkGfm);

/** A bio in two parts, both markdown. */
export type SplitBio = {
  /** The first block, always shown. */
  lead: string;
  /** Everything after it, shown on request; "" when the bio is a single block. */
  more: string;
};

/**
 * Splits a markdown bio after its first block (paragraph, list, quote, ...).
 *
 * Link definitions (`[label]: https://...`) aren't shown and may stand
 * anywhere, so they don't count as blocks; both parts get all of them, so
 * reference-style links work in either part.
 *
 * @param markdown - The bio, without front matter
 * @returns The first block and the rest
 */
export function splitBio(markdown: string): SplitBio {
  const tree = markdownParser.parse(markdown);
  const source = (node: RootContent) =>
    markdown.slice(node.position?.start.offset, node.position?.end.offset);

  const blocks = tree.children.filter((node) => node.type !== "definition");
  if (blocks.length < 2) return { lead: markdown.trim(), more: "" };

  const definitions = tree.children.filter((node) => node.type === "definition").map(source);
  const join = (nodes: RootContent[]) => [...nodes.map(source), ...definitions].join("\n\n");
  return { lead: join(blocks.slice(0, 1)), more: join(blocks.slice(1)) };
}
