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
 * Remark plugin that gives every heading an `id` attribute: a GitHub-style
 * slug of its text, e.g. "How to get there?" becomes "how-to-get-there".
 * Repeated headings get a numeric suffix ("-1", "-2", ...).
 */
function remarkHeadingIds() {
  return (tree: Root) => {
    // One slugger per document, so that duplicate headings get unique ids.
    const slugger = new GithubSlugger();

    visit(tree, "heading", (node: Heading) => {
      const id = slugger.slug(toString(node, { includeHtml: false }));
      if (!id) return;
      node.data = node.data || {};
      node.data.hProperties = node.data.hProperties || {};
      node.data.hProperties.id = id;
    });
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
