/**
 * Markdown-to-HTML conversion utility.
 *
 * Converts markdown content to HTML using unified, remark, and plugins.
 * Adds target="_blank" and rel="noopener noreferrer" to all external links
 * (inline and reference-style), gives every heading an id so in-page anchor links (e.g. `#tracks`) work,
 * demotes `#` headings to `##`, because the page already has its `<h1>`,
 * and lets images load lazily, with their width and height when they are local files.
 */

import { join, sep } from "path";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkHtml from "remark-html";
import { visit } from "unist-util-visit";
import { toString } from "mdast-util-to-string";
import GithubSlugger from "github-slugger";
import { isAbsoluteUrl } from "@/lib/urls";
import { imageSizeFromFile } from "image-size/fromFile";
import type {
  Definition,
  Heading,
  Html,
  Image,
  ImageReference,
  Link,
  LinkReference,
  Root,
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

/** The folder served at the site's root: "/images/a.webp" is public/images/a.webp. */
const PUBLIC_DIR = join(process.cwd(), "public");

/** Images whose width and height are read: raster files in /images/ (not SVGs, which may have no fixed size). */
const LOCAL_RASTER_IMAGE = /^\/images\/[^?#]+\.(avif|gif|jpe?g|png|webp)(?:[?#].*)?$/i;

/** An `<img>` tag in raw HTML. */
const IMG_TAG = /<img\b[^>]*>/gi;

/** Width and height of an image, in pixels. */
type ImageSize = { width: number; height: number };

/**
 * Reads the size of a local image (only the file's first bytes) while the
 * site is built.
 *
 * @param src - The image URL as written in the post, e.g. "/images/poster/a.webp"
 * @returns The size as displayed (EXIF rotation applied), or undefined for
 *   other URLs and for files that can't be read (`npm run check:content`
 *   reports missing files)
 */
async function readImageSize(src: string): Promise<ImageSize | undefined> {
  if (!LOCAL_RASTER_IMAGE.test(src)) return undefined;
  let file: string;
  try {
    file = join(PUBLIC_DIR, decodeURIComponent(src.replace(/[?#].*$/, "")));
  } catch {
    return undefined; // Malformed %-escape.
  }
  if (!file.startsWith(PUBLIC_DIR + sep)) return undefined; // "/images/../../x"
  try {
    const { width, height, orientation = 1 } = await imageSizeFromFile(file);
    if (!width || !height) return undefined;
    // EXIF orientations 5-8 rotate the photo by 90°: width and height swap.
    return orientation >= 5 ? { width: height, height: width } : { width, height };
  } catch {
    return undefined;
  }
}

/**
 * Attributes for every image in a post. Post images are usually below the
 * fold: `loading="lazy"` fetches them only when the reader scrolls near
 * them, and `decoding="async"` decodes them without blocking the page.
 */
const IMAGE_LOADING = { loading: "lazy", decoding: "async" } as const;

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
    .use(remarkImageAttributes)
    .use(remarkHtml, { sanitize: false })
    .process(markdown);
  return result.toString();
}
