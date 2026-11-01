/**
 * XML sitemap for search engines, exported as out/sitemap.xml.
 *
 * Lists the main pages and every listed news post, with absolute URLs on
 * the live domain. Unlisted posts are left out on purpose.
 */

import type { MetadataRoute } from "next";
import { getAllPosts } from "@/lib/api";
import { SITE_URL } from "@/lib/constants";

/** Generate the file once at build time: required for metadata routes with `output: 'export'`. */
export const dynamic = "force-static";

/** Pages written in code (src/app), as paths. */
const STATIC_PAGES = ["/about", "/news", "/organization", "/contact", "/slack"];

/**
 * Parses a post date into a Date.
 *
 * @param date - The post's front-matter date string
 * @returns The Date, or undefined when the date is missing or invalid
 */
function toDate(date: string): Date | undefined {
  const parsed = new Date(date);
  return Number.isNaN(parsed.getTime()) ? undefined : parsed;
}

/**
 * Builds the sitemap entries.
 *
 * Posts get their publication date as `lastModified`. The homepage and the
 * news page change whenever a post is added, so they get the newest post's
 * date; the other pages have no reliable date and get none.
 *
 * @returns The sitemap entries, homepage first
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getAllPosts(); // listed posts only, newest first
  const newestPostDate = posts.length > 0 ? toDate(posts[0].date) : undefined;

  const pages: MetadataRoute.Sitemap = [
    { url: SITE_URL, lastModified: newestPostDate },
    ...STATIC_PAGES.map((path) => ({
      url: `${SITE_URL}${path}`,
      lastModified: path === "/news" ? newestPostDate : undefined,
    })),
  ];

  const postEntries: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${SITE_URL}/news/${post.slug}`,
    lastModified: toDate(post.date),
  }));

  return [...pages, ...postEntries];
}
