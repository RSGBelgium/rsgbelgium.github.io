/**
 * Markdown-to-HTML conversion utility.
 *
 * Converts markdown content to HTML using unified, remark, and plugins.
 * Adds target="_blank" and rel="noopener noreferrer" to all external links.
 */

import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkHtml from "remark-html";
import { visit } from "unist-util-visit";

/**
 * Remark plugin to add target="_blank" and rel="noopener noreferrer" to external links.
 */
function remarkExternalLinks() {
  return (tree: any) => {
    visit(tree, 'link', (node: any) => {
      if (node.url && /^https?:\/\//.test(node.url)) {
        node.data = node.data || {};
        node.data.hProperties = node.data.hProperties || {};
        node.data.hProperties.target = '_blank';
        node.data.hProperties.rel = 'noopener noreferrer';
      }
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
    .use(remarkExternalLinks)
    .use(remarkHtml, { sanitize: false })
    .process(markdown);
  return result.toString();
}
