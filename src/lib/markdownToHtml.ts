/**
 * Markdown-to-HTML conversion utility.
 *
 * Converts markdown content to HTML using unified, remark, and plugins.
 * Adds target="_blank" and rel="noopener noreferrer" to all external links
 * (inline and reference-style), gives every heading an id so in-page anchor links (e.g. `#tracks`) work,
 * demotes `#` headings to `##`, because the page already has its `<h1>`,
 * lets images load lazily, with their width and height when they are local files,
 * and puts every table in a box that scrolls sideways when the table is wider than the text.
 */

import remarkHtml from "remark-html";
import { SKIP, visit } from "unist-util-visit";
import { toString } from "mdast-util-to-string";
import GithubSlugger from "github-slugger";
import { isAbsoluteUrl } from "@/lib/urls";
import { readImageSize } from "@/lib/image-size";
import { markdownParser } from "@/lib/markdown-parser";
import type {
  Definition,
  Heading,
  Html,
  Image,
  ImageReference,
  Link,
  LinkReference,
  Parent,
  Root,
  Table,
} from "mdast";

/**
 * Sets HTML attributes that a markdown node's element will get in the output.
 *
 * @param node - The markdown node, e.g. a link, an image or a heading
 * @param properties - Attribute names and values, e.g. `{ id: "tracks" }`
 */
function setHtmlAttributes(
  node: Heading | Link | LinkReference | Image | ImageReference,
  properties: Record<string, string | number>,
) {
  node.data = node.data || {};
  node.data.hProperties = { ...node.data.hProperties, ...properties };
}

/**
 * Finds the URL of every link/image definition (`[label]: https://...`), for
 * reference-style links and images (`[text][label]`, `![alt][label]`), whose
 * URL lives on the definition.
 *
 * @param tree - The markdown tree
 * @returns A lookup from a reference's `identifier` to the URL
 */
function collectDefinitionUrls(tree: Root): (identifier: string) => string | undefined {
  // Definition labels are case-insensitive: key them the same way mdast-util-to-hast does.
  const urls = new Map<string, string>();
  visit(tree, "definition", (node: Definition) => {
    const id = node.identifier.toUpperCase();
    // As in CommonMark, the first definition of a label wins.
    if (!urls.has(id)) urls.set(id, node.url);
  });
  return (identifier) => urls.get(identifier.toUpperCase());
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
    const definitionUrl = collectDefinitionUrls(tree);

    visit(tree, "link", (node: Link) => {
      if (node.url && isAbsoluteUrl(node.url)) openInNewTab(node);
    });

    visit(tree, "linkReference", (node: LinkReference) => {
      const url = definitionUrl(node.identifier);
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
 * Attributes for every image in a post. Post images are usually below the
 * fold: `loading="lazy"` fetches them only when the reader scrolls near
 * them, and `decoding="async"` decodes them without blocking the page.
 */
const IMAGE_LOADING = { loading: "lazy", decoding: "async" } as const;

/** An `<img>` tag in raw HTML. */
const IMG_TAG = /<img\b[^>]*>/gi;

/**
 * Adds the loading attributes, and the width and height of local images,
 * to the `<img>` tags in a raw HTML block. Attributes already written are kept.
 *
 * @param html - Raw HTML from the markdown
 */
async function addImgTagAttributes(html: string): Promise<string> {
  const tags = [...html.matchAll(IMG_TAG)];
  if (tags.length === 0) return html;

  const updated = await Promise.all(
    tags.map(async ([tag]) => {
      const attributes: string[] = [];
      if (!/\swidth\s*=/i.test(tag) && !/\sheight\s*=/i.test(tag)) {
        const src = tag.match(/\ssrc\s*=\s*["']([^"']*)["']/i)?.[1];
        const size = src ? await readImageSize(src) : undefined;
        if (size) attributes.push(`width="${size.width}"`, `height="${size.height}"`);
      }
      for (const [name, value] of Object.entries(IMAGE_LOADING)) {
        if (!new RegExp(`\\s${name}\\s*=`, "i").test(tag)) attributes.push(`${name}="${value}"`);
      }
      if (attributes.length === 0) return tag;
      return tag.replace(/\s*(\/?)>$/, (end, slash) =>
        slash ? ` ${attributes.join(" ")} />` : ` ${attributes.join(" ")}>`,
      );
    }),
  );
  let index = 0;
  return html.replace(IMG_TAG, () => updated[index++]);
}

/**
 * Remark plugin that lets images load lazily and, for local images, sets
 * their `width` and `height`.
 *
 * With the intrinsic size known, the browser reserves the image's space
 * before it has loaded, so the text below doesn't jump when it appears
 * (layout shift). The CSS (`max-width: 100%; height: auto`) still scales
 * images down to the column. Handles markdown images (`![alt](src)`),
 * reference-style images (`![alt][ref]`) and `<img>` tags in raw HTML.
 */
function remarkImageAttributes() {
  return async (tree: Root) => {
    const definitionUrl = collectDefinitionUrls(tree);

    const images: (Image | ImageReference)[] = [];
    visit(tree, ["image", "imageReference"], (node) => {
      images.push(node as Image | ImageReference);
    });
    const htmlBlocks: Html[] = [];
    visit(tree, "html", (node: Html) => {
      htmlBlocks.push(node);
    });

    await Promise.all([
      ...images.map(async (node) => {
        const url = node.type === "image" ? node.url : definitionUrl(node.identifier);
        const size = url ? await readImageSize(url) : undefined;
        setHtmlAttributes(node, { ...size, ...IMAGE_LOADING });
      }),
      ...htmlBlocks.map(async (node) => {
        node.value = await addImgTagAttributes(node.value);
      }),
    ]);
  };
}

/**
 * Class of the `<div>` around every table. It is styled in
 * src/app/_components/markdown-styles.module.css (`:global(.table-scroll)`).
 */
const TABLE_SCROLL_CLASS = "table-scroll";

/** The box around a table that remarkScrollableTables adds: a `<div class="table-scroll">`. */
interface TableScroll extends Parent {
  type: "tableScroll";
  children: [Table];
}

// Registers the box as an mdast node, so that it may stand wherever a table may.
declare module "mdast" {
  interface BlockContentMap {
    tableScroll: TableScroll;
  }
  interface RootContentMap {
    tableScroll: TableScroll;
  }
}

/**
 * Remark plugin that puts every table in a `<div class="table-scroll">`.
 *
 * A table is never narrower than its longest words, e.g. the variant
 * notations in the Track 3 challenge, so on a phone it can be much wider than
 * the screen. The div scrolls sideways instead, inside the text column, so the
 * page itself doesn't (WCAG 1.4.10). CSS alone can't make the table scroll
 * without `display: block` on it, and then the tables that are narrower than
 * the column no longer fill it.
 *
 * mdast-util-to-hast turns a node type it doesn't know, like this box, into a
 * `<div>` with the node's `hProperties`, around its children.
 */
function remarkScrollableTables() {
  return (tree: Root) => {
    visit(tree, "table", (node: Table, index, parent) => {
      if (!parent || index === undefined) return;
      const box: TableScroll = {
        type: "tableScroll",
        data: { hProperties: { className: [TABLE_SCROLL_CLASS] } },
        children: [node],
      };
      parent.children[index] = box;
      return SKIP;
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
  const result = await markdownParser()
    .use(remarkDemoteH1)
    .use(remarkHeadingIds)
    .use(remarkExternalLinks)
    .use(remarkImageAttributes)
    .use(remarkScrollableTables)
    .use(remarkHtml, { sanitize: false })
    .process(markdown);
  return result.toString();
}
