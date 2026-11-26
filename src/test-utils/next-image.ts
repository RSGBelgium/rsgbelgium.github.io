/**
 * Test helper for images rendered by next/image.
 */

/**
 * The original path of an image rendered by next/image.
 *
 * Jest uses the default image loader, which turns "/images/a.webp" into
 * "/_next/image?url=%2Fimages%2Fa.webp&w=...&q=75", and leaves SVGs as they
 * are.
 *
 * @param image - The rendered <img>
 * @returns e.g. "/images/a.webp"
 */
export function originalSrc(image: Element): string {
  const url = new URL(image.getAttribute("src") ?? "", "http://localhost");
  return url.searchParams.get("url") ?? url.pathname;
}
