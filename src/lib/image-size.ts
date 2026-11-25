/**
 * Reads the width and height of the site's own images while it is built.
 *
 * The site is a static export with unoptimized images, so next/image can't
 * look at the files. Knowing an image's real size lets the browser reserve
 * its space before it has loaded, so the page doesn't jump (layout shift).
 * image-size reads only the first bytes of a file.
 */

import { join, sep } from "path";
import { imageSizeFromFile } from "image-size/fromFile";

/** Width and height of an image, in pixels. */
export type ImageSize = { width: number; height: number };

/** The folder served at the site's root: "/images/a.webp" is public/images/a.webp. */
const PUBLIC_DIR = join(process.cwd(), "public");

/** Images whose size is read: raster files in /images/ (not SVGs, which may have no fixed size). */
const LOCAL_RASTER_IMAGE = /^\/images\/[^?#]+\.(avif|gif|jpe?g|png|webp)(?:[?#].*)?$/i;

/**
 * Reads the size of a local image.
 *
 * @param src - The image URL as written in a post, e.g. "/images/poster/a.webp"
 * @returns The size as displayed (EXIF rotation applied), or undefined for
 *   other URLs (external, SVG) and for files that can't be read
 *   (`npm run check:content` reports missing files)
 */
export async function readImageSize(src: string): Promise<ImageSize | undefined> {
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
