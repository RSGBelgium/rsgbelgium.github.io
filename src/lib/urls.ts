/**
 * URL helpers shared by pages, components, feeds and the content loader.
 */

import { SITE_URL } from "./constants";

/**
 * Whether a URL is an absolute http(s) URL, i.e. one that leaves the site.
 *
 * @param url - A URL or site path
 */
export function isAbsoluteUrl(url: string): boolean {
  return /^https?:\/\//.test(url);
}

/**
 * Turns a site path into an absolute URL on the live site; absolute URLs are
 * returned unchanged.
 *
 * @param path - A site path starting with "/", e.g. "/news", or a full URL
 * @returns e.g. "https://rsg-belgium.org/news"
 */
export function absoluteUrl(path: string): string {
  return isAbsoluteUrl(path) ? path : `${SITE_URL}${path}`;
}

/**
 * Path of a news post page.
 *
 * @param slug - The post slug (its file name without extension)
 * @returns e.g. "/news/2026-05-15-sixth-beerformatics-speaker"
 */
export function postPath(slug: string): string {
  return `/news/${slug}`;
}
