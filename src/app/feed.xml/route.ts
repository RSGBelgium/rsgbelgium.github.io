/**
 * RSS 2.0 feed of the news posts, exported as out/feed.xml.
 *
 * Feed readers subscribe to https://rsg-belgium.org/feed.xml; every page
 * links to it with `<link rel="alternate" type="application/rss+xml">`.
 * The XML is built by hand (no dependency) and lists every post, newest
 * first.
 */

import { getAllPosts } from "@/lib/api";
import { SITE_NAME } from "@/lib/constants";
import { RSS_FEED_PATH, postDescription } from "@/lib/metadata";
import { parseDate } from "@/lib/dates";
import { absoluteUrl, postPath } from "@/lib/urls";
import type { Post } from "@/interfaces/post";

/** Generate the file once at build time: required for route handlers with `output: 'export'`. */
export const dynamic = "force-static";

/** Characters that must be escaped in XML text and attribute values. */
const XML_ESCAPES: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&apos;",
};

/**
 * Escapes text for use in XML element content or attribute values.
 *
 * @param value - Raw text
 * @returns The text with `& < > " '` replaced by entities
 */
function escapeXml(value: string): string {
  return value.replace(/[&<>"']/g, (char) => XML_ESCAPES[char]);
}

/**
 * Renders one post as an RSS `<item>`.
 *
 * @param post - A listed news post
 * @returns The `<item>` XML
 */
function renderItem(post: Post): string {
  const url = absoluteUrl(postPath(post.slug));
  // RSS wants RFC 822 dates, e.g. "Fri, 15 May 2026 00:00:00 GMT".
  const pubDate = parseDate(post.date)?.toUTCString();
  const description = postDescription(post);

  return [
    "    <item>",
    `      <title>${escapeXml(post.title)}</title>`,
    `      <link>${escapeXml(url)}</link>`,
    `      <guid isPermaLink="true">${escapeXml(url)}</guid>`,
    ...(pubDate ? [`      <pubDate>${pubDate}</pubDate>`] : []),
    `      <description>${escapeXml(description)}</description>`,
    "    </item>",
  ].join("\n");
}

/**
 * Builds the RSS feed.
 *
 * `lastBuildDate` is the newest post's date (when the feed content last
 * changed), so rebuilding the site without new posts doesn't change the feed.
 *
 * @returns The feed as an `application/rss+xml` response
 */
export async function GET() {
  const posts = await getAllPosts(); // newest first
  const lastBuildDate = (posts.length > 0 && parseDate(posts[0].date)?.toUTCString()) || new Date().toUTCString();

  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">',
    "  <channel>",
    `    <title>${escapeXml(`${SITE_NAME} News`)}</title>`,
    `    <link>${escapeXml(absoluteUrl("/news"))}</link>`,
    `    <description>${escapeXml(`News, events and announcements from ${SITE_NAME}, the community of bioinformatics and computational biology students and young researchers in Belgium.`)}</description>`,
    "    <language>en</language>",
    `    <lastBuildDate>${lastBuildDate}</lastBuildDate>`,
    `    <atom:link href="${escapeXml(absoluteUrl(RSS_FEED_PATH))}" rel="self" type="application/rss+xml"/>`,
    ...posts.map(renderItem),
    "  </channel>",
    "</rss>",
    "",
  ].join("\n");

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
    },
  });
}
