/**
 * XML sitemap for search engines, exported as out/sitemap.xml.
 *
 * Lists the main pages (the navigation's, and the Sponsor page that the
 * homepage links to) and every news post, with absolute URLs on the live
 * domain.
 */

import type { MetadataRoute } from "next";
import { getAllPosts } from "@/lib/api";
import { SITE_URL } from "@/lib/constants";
import { parseDate } from "@/lib/dates";
import { absoluteUrl, postPath } from "@/lib/urls";
import { ALL_NAV_PAGES, SPONSOR_PAGE } from "@/lib/navigation";

/** Generate the file once at build time: required for metadata routes with `output: 'export'`. */
export const dynamic = "force-static";

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
  const posts = await getAllPosts(); // newest first
  const newestPostDate = posts.length > 0 ? parseDate(posts[0].date) : undefined;

  const pages: MetadataRoute.Sitemap = [
    { url: SITE_URL, lastModified: newestPostDate },
    ...[...ALL_NAV_PAGES, SPONSOR_PAGE].map(({ url }) => ({
      url: absoluteUrl(url),
      lastModified: url === "/news" ? newestPostDate : undefined,
    })),
  ];

  const postEntries: MetadataRoute.Sitemap = posts.map((post) => ({
    url: absoluteUrl(postPath(post.slug)),
    lastModified: parseDate(post.date),
  }));

  return [...pages, ...postEntries];
}
