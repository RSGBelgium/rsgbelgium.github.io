/**
 * Markdown-to-HTML conversion utility.
 *
 * Converts markdown content to HTML using unified, remark, and plugins.
 * Adds target="_blank" and rel="noopener noreferrer" to all external links
 * (inline and reference-style), gives every heading an id so in-page anchor links (e.g. `#tracks`) work,
 * and demotes `#` headings to `##`, because the page already has its `<h1>`.
 */

import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkHtml from "remark-html";
import { visit } from "unist-util-visit";
import { toString } from "mdast-util-to-string";
import GithubSlugger from "github-slugger";
import { isAbsoluteUrl } from "@/lib/urls";
import type { Definition, Heading, Link, LinkReference, Root } from "mdast";

/**
 * Sets HTML attributes that a markdown node's element will get in the output.
 *
 * @param node - The markdown node, e.g. a link or a heading
 * @param properties - Attribute names and values, e.g. `{ id: "tracks" }`
 */
function setHtmlAttributes(node: Heading | Link | LinkReference, properties: Record<string, string>) {
  node.data = node.data || {};
  node.data.hProperties = { ...node.data.hProperties, ...properties };
}

/**
 * Makes a link node open in a new tab, by setting the attributes its `<a>` will get.
 *
 * @param node - An inline (`[text](url)`) or reference-style (`[text][ref]`) link
 */
function openInNewTab(node: Link | LinkReference) {
  setHtmlAttributes(node, { target: "_blank", rel: "noopener noreferrer" });
}

/**
 * Remark plugin to add target="_blank" and rel="noopener noreferrer" to external links.
 *
 * Handles both inline links (`[text](https://...)`, autolinks) and
 * reference-style links (`[text][ref]` with `[ref]: https://...` defined
 * elsewhere in the document), whose URL lives on the matching definition.
 */
function remarkExternalLinks() {
  return (tree: Root) => {
    // Definition labels are case-insensitive: key them the same way mdast-util-to-hast does.
    const definitionUrls = new Map<string, string>();
    visit(tree, "definition", (node: Definition) => {
      const id = node.identifier.toUpperCase();
      // As in CommonMark, the first definition of a label wins.
      if (!definitionUrls.has(id)) definitionUrls.set(id, node.url);
    });

    visit(tree, "link", (node: Link) => {
      if (node.url && isAbsoluteUrl(node.url)) openInNewTab(node);
    });

    visit(tree, "linkReference", (node: LinkReference) => {
      const url = definitionUrls.get(node.identifier.toUpperCase());
      if (url && isAbsoluteUrl(url)) openInNewTab(node);
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
      if (id) setHtmlAttributes(node, { id });
    });
  };
}

/**
 * Remark plugin that turns every level-1 heading (`# Title`) into a level-2
 * heading (`## Title`).
 *
 * The page around the markdown already has the one `<h1>`: the post title
 * (src/app/_components/post-header.tsx) or the page's intro. A second `<h1>`
 * in the body would break the heading outline that screen-reader users
 * navigate by, and the route announcer could read the wrong title. Editors
 * are asked to start at `##` (guides/markdown.md); this is the safety net.
 * Only `#` headings are changed, so `##` and deeper keep their level.
 */
function remarkDemoteH1() {
  return (tree: Root) => {
    visit(tree, "heading", (node: Heading) => {
      if (node.depth === 1) node.depth = 2;
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
    .use(remarkDemoteH1)
    .use(remarkHeadingIds)
    .use(remarkExternalLinks)
    .use(remarkHtml, { sanitize: false })
    .process(markdown);
  return result.toString();
}
