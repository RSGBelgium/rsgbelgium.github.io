/**
 * Markdown-to-HTML conversion utility.
 *
 * Converts markdown content to HTML using unified, remark, and plugins.
 * Adds target="_blank" and rel="noopener noreferrer" to all external links,
 * and gives every heading an id so in-page anchor links (e.g. `#tracks`) work.
 */

import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkHtml from "remark-html";
import { visit } from "unist-util-visit";
import { toString } from "mdast-util-to-string";
import GithubSlugger from "github-slugger";
import type { Heading, Link, Root } from "mdast";

/**
 * Matches an explicit heading id at the end of a heading's text, written in
 * kramdown "header ID" style: `## Tracks {#tracks}`. Captures the id.
 */
const EXPLICIT_HEADING_ID = /\s*\{#([A-Za-z][\w-]*)\}\s*$/;

/**
 * Remark plugin to add target="_blank" and rel="noopener noreferrer" to external links.
 */
function remarkExternalLinks() {
  return (tree: Root) => {
    visit(tree, "link", (node: Link) => {
      if (node.url && /^https?:\/\//.test(node.url)) {
        node.data = node.data || {};
        node.data.hProperties = node.data.hProperties || {};
        node.data.hProperties.target = "_blank";
        node.data.hProperties.rel = "noopener noreferrer";
      }
    });
  };
}

/**
 * Removes a trailing `{#id}` from a heading and returns the id, if present.
 *
 * Only the heading's last child is inspected, and only when it is a text node.
 *
 * @param node - The heading node to inspect (its text is mutated when an id is found)
 * @returns The explicit id, or undefined when the heading has none
 */
function extractExplicitHeadingId(node: Heading): string | undefined {
  const last = node.children[node.children.length - 1];
  if (!last || last.type !== "text") return undefined;

  const match = last.value.match(EXPLICIT_HEADING_ID);
  if (!match || match.index === undefined) return undefined;

  last.value = last.value.slice(0, match.index);
  if (last.value === "") node.children.pop();
  return match[1];
}

/**
 * Sets the `id` attribute that the heading will get in the generated HTML.
 *
 * @param node - The heading node
 * @param id - The id to set; empty ids are ignored
 */
function setHeadingId(node: Heading, id: string) {
  if (!id) return;
  node.data = node.data || {};
  node.data.hProperties = node.data.hProperties || {};
  node.data.hProperties.id = id;
}

/**
 * Remark plugin that gives every heading an `id` attribute.
 *
 * - An explicit id written as `## Title {#my-id}` is stripped from the
 *   heading text and used as-is.
 * - Every other heading gets a GitHub-style slug of its text, e.g.
 *   "How to get there?" becomes "how-to-get-there". Repeated headings get a
 *   numeric suffix ("-1", "-2", ...), and generated slugs never reuse an
 *   explicit id from the same document.
 */
function remarkHeadingIds() {
  return (tree: Root) => {
    // One slugger per document, so that duplicate headings get unique ids.
    const slugger = new GithubSlugger();
    const headingsWithoutId: Heading[] = [];

    // First pass: honour explicit ids and reserve them in the slugger.
    visit(tree, "heading", (node: Heading) => {
      const explicitId = extractExplicitHeadingId(node);
      if (explicitId) {
        slugger.slug(explicitId);
        setHeadingId(node, explicitId);
      } else {
        headingsWithoutId.push(node);
      }
    });

    // Second pass: generate slugs for the remaining headings, in document order.
    for (const node of headingsWithoutId) {
      setHeadingId(node, slugger.slug(toString(node, { includeHtml: false })));
    }
  };
}

/**
 * Converts a markdown string to HTML.
 *
 * @param markdown - The markdown content to convert
 * @returns The resulting HTML string
 */
export default async function markdownToHtml(markdown: string) {
  const result = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkHeadingIds)
    .use(remarkExternalLinks)
    .use(remarkHtml, { sanitize: false })
    .process(markdown);
  return result.toString();
}
