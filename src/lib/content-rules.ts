/**
 * Content rules shared by the site and `npm run check:content`.
 *
 * The site's content loader (src/lib/api.ts) reads content/ with these
 * rules, and scripts/check-content.mjs checks content/ with the same ones,
 * so the two can't disagree about what is valid.
 *
 * The check runs on plain Node.js, which loads this TypeScript file directly
 * (type stripping). So this file must not import anything and may only use
 * TypeScript that can be erased: type annotations, but no enums or namespaces.
 */

/** Folder of the news posts, relative to the repository root. */
export const NEWS_DIR = "content/news";

/** Folder of the team member profiles, relative to the repository root. */
export const MEMBERS_DIR = "content/organization";

/** File extensions of markdown content files, in the order they are tried. */
export const MARKDOWN_EXTENSIONS = [".md", ".markdown"];

/**
 * Whether a file name is a markdown content file (`.md` or `.markdown`).
 *
 * @param file - A file name from a content directory
 */
export function isMarkdownFile(file: string): boolean {
  return MARKDOWN_EXTENSIONS.some((extension) => file.endsWith(extension));
}

/**
 * The slug of a content file: its name without the markdown extension.
 *
 * @param file - A file name such as "2026-05-15-some-post.md"
 * @returns e.g. "2026-05-15-some-post"
 */
export function slugFromFileName(file: string): string {
  return file.replace(/\.(md|markdown)$/, "");
}

/**
 * Whether a URL is an absolute http(s) URL, i.e. one that leaves the site.
 *
 * @param url - A URL or site path
 */
export function isAbsoluteUrl(url: string): boolean {
  return /^https?:\/\//.test(url);
}

/** URL folder of team photos: a bare file name in `image` means a file here. */
export const TEAM_IMAGE_PATH = "/images/team/";

/**
 * Resolve a member's `image` front-matter value to a URL path.
 *
 * @param image - The trimmed `image` value
 * @returns "" when there is no photo; site paths and URLs unchanged; a bare
 *   file name ("jane.jpg") in the team photo folder ("/images/team/jane.jpg")
 */
export function resolveMemberImage(image: string): string {
  if (!image) return "";
  if (image.startsWith("/") || isAbsoluteUrl(image)) return image;
  return `${TEAM_IMAGE_PATH}${image}`;
}

/**
 * Read a member's `order` from front matter: their position on the team
 * page, 1 being the first.
 *
 * @param value - The raw front-matter value (a number, or a numeric string)
 * @returns The order, or undefined when it is missing or not a whole number from 1
 */
export function parseMemberOrder(value: unknown): number | undefined {
  if (value === undefined || value === null || value === "") return undefined;
  const order = typeof value === "number" ? value : Number(value);
  return Number.isInteger(order) && order >= 1 ? order : undefined;
}

/**
 * Compare the members' `order` numbers with 1 to n, the numbering the team
 * page needs: every number used exactly once, without gaps.
 *
 * @param orders - The valid `order` values, in any sequence
 * @param count - n, the number of members (default: one per order)
 * @returns The numbers used more than once, and those from 1 to n not used
 */
export function checkMemberNumbering(
  orders: number[],
  count: number = orders.length,
): { duplicates: number[]; missing: number[] } {
  const seen = new Set<number>();
  const duplicates = new Set<number>();
  for (const order of orders) {
    if (seen.has(order)) duplicates.add(order);
    seen.add(order);
  }
  const missing = Array.from({ length: count }, (_, index) => index + 1).filter(
    (order) => !seen.has(order),
  );
  return { duplicates: [...duplicates].sort((a, b) => a - b), missing };
}
