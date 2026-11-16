/**
 * Main content API utility for posts and organization members.
 *
 * Provides functions to read, parse, and return content from markdown files in the content/ directory.
 * Handles posts (news) and organization members.
 */

import { Post } from "@/interfaces/post";
import fs from "fs/promises";
import matter from "gray-matter";
import { join } from "path";
import { Member } from "@/interfaces/member";
import { createExcerpt } from "@/lib/excerpt";
import { normalizeFrontMatterDate, parseDate } from "@/lib/dates";

const postsDirectory = join(process.cwd(), "content/news");
const membersDirectory = join(process.cwd(), "content/organization");

/**
 * Whether a file name is a markdown content file (`.md` or `.markdown`).
 *
 * @param file - A file name from a content directory
 */
function isMarkdownFile(file: string): boolean {
  return file.endsWith(".md") || file.endsWith(".markdown");
}

/**
 * Read an optional text field from front matter.
 *
 * @param value - The raw front-matter value
 * @returns The trimmed string, or "" when the field is missing, empty or not a string
 */
function optionalString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

/**
 * Convert a post date string to a timestamp for sorting.
 *
 * @param date - The post date string
 * @returns Milliseconds since the epoch, or 0 when the date is missing or invalid (sorts last)
 */
function getDateTimestamp(date: string): number {
  return parseDate(date)?.getTime() ?? 0;
}

/**
 * Get all post slugs (filenames without extension) from the news content directory.
 */
export async function getPostSlugs(): Promise<string[]> {
  try {
    const files = await fs.readdir(postsDirectory);
    return files
      .filter(isMarkdownFile)
      .map(file => file.replace(/\.(md|markdown)$/, ''));
  } catch (error) {
    console.error('Error reading post slugs:', error);
    return [];
  }
}

/**
 * Get a single post by its slug (filename without extension).
 *
 * @param slug - The post slug
 * @returns The Post object or null if not found
 */
export async function getPostBySlug(slug: string): Promise<Post | null> {
  try {
    // Try both .md and .markdown extensions
    const extensions = ['.md', '.markdown'];
    let fileContents = '';

    for (const ext of extensions) {
      const path = join(postsDirectory, `${slug}${ext}`);
      try {
        fileContents = await fs.readFile(path, "utf8");
        break;
      } catch (error: unknown) {
        // Continue to next extension if file not found
        if (error instanceof Error && 'code' in error && error.code === 'ENOENT') continue;
        throw error;
      }
    }

    if (!fileContents) {
      console.error(`No file found for slug: ${slug}`);
      return null;
    }

    const { data, content } = matter(fileContents);

    return {
      slug,
      content,
      ...data,
      date: normalizeFrontMatterDate(data.date),
      // An explicit front-matter excerpt wins; otherwise summarise the body.
      excerpt: optionalString(data.excerpt) || createExcerpt(content),
    } as Post;
  } catch (error) {
    console.error(`Error reading post for slug ${slug}:`, error);
    return null;
  }
}

/**
 * Get all posts, sorted by date descending (newest first).
 *
 * @returns Array of Post objects
 */
export async function getAllPosts(): Promise<Post[]> {
  try {
    const slugs = await getPostSlugs();
    const postsPromises = slugs.map((slug: string) => getPostBySlug(slug));
    const posts = await Promise.all(postsPromises);
    return posts
      .filter((post): post is Post => post !== null)
      .sort(
        (post1: Post, post2: Post) =>
          getDateTimestamp(post2.date) - getDateTimestamp(post1.date) ||
          post1.slug.localeCompare(post2.slug)
      );
  } catch (error) {
    console.error('Error getting all posts:', error);
    return [];
  }
}


/** Members whose profile has no `order` are listed after all ordered members. */
const UNORDERED = Number.POSITIVE_INFINITY;

/**
 * Read an optional profile URL (LinkedIn, ORCID) from front matter.
 *
 * Anything that isn't an absolute http(s) URL is dropped with a warning, so a
 * value like "Jane Doe | LinkedIn" never becomes a broken relative link.
 *
 * @param value - The raw front-matter value
 * @param field - Field name, for the warning
 * @param file - Source file name, for the warning
 * @returns The URL, or "" when missing or invalid
 */
function optionalUrl(value: unknown, field: string, file: string): string {
  const url = optionalString(value);
  if (url && !/^https?:\/\//.test(url)) {
    console.warn(`content/organization/${file}: ignoring "${field}" because it is not an http(s) URL: ${url}`);
    return "";
  }
  return url;
}

/**
 * Resolve a member's `image` front-matter value to a public path.
 *
 * @param value - The raw front-matter value
 * @returns "" when there is no photo; absolute paths and URLs unchanged;
 *   a bare file name ("jane.jpg") prefixed with "/images/team/"
 */
function resolveMemberImage(value: unknown): string {
  const image = optionalString(value);
  if (!image) return "";
  if (image.startsWith("/") || /^https?:\/\//.test(image)) return image;
  return `/images/team/${image}`;
}

/**
 * Read a member's optional `order` from front matter.
 *
 * @param value - The raw front-matter value (a number, or a numeric string)
 * @param file - Source file name, for the warning on invalid values
 * @returns The order, or undefined when missing or not a number
 */
function parseMemberOrder(value: unknown, file: string): number | undefined {
  if (value === undefined || value === null || value === "") return undefined;
  const order = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(order)) {
    console.warn(`content/organization/${file}: ignoring "order" because it is not a number: ${String(value)}`);
    return undefined;
  }
  return order;
}

/**
 * Parse and validate one member profile.
 *
 * Only `name` is required. Optional text fields default to "" so that
 * components can simply hide empty values.
 *
 * @param file - File name inside content/organization/ (used for the slug and warnings)
 * @param fileContents - The raw markdown file, front matter included
 * @returns The Member, or null (with a warning) when the profile is invalid
 */
function parseMember(file: string, fileContents: string): Member | null {
  const { data, content } = matter(fileContents);

  const name = optionalString(data.name);
  if (!name) {
    console.warn(`content/organization/${file}: skipping profile without a "name" in its front matter.`);
    return null;
  }

  return {
    slug: file.replace(/\.(md|markdown)$/, ""),
    name,
    title: optionalString(data.title),
    image: resolveMemberImage(data.image),
    affiliation: optionalString(data.affiliation),
    position: optionalString(data.position),
    city: optionalString(data.city),
    linkedin: optionalUrl(data.linkedin, "linkedin", file),
    orcid: optionalUrl(data.orcid, "orcid", file),
    order: parseMemberOrder(data.order, file),
    content: content.trim(),
  };
}

/**
 * Sort comparator for members: by `order` ascending (members without an
 * order last), then alphabetically by name.
 */
function compareMembers(a: Member, b: Member): number {
  const orderA = a.order ?? UNORDERED;
  const orderB = b.order ?? UNORDERED;
  if (orderA !== orderB) return orderA - orderB;
  return a.name.localeCompare(b.name);
}

/**
 * Get all team members from content/organization/, in display order.
 *
 * Every `.md`/`.markdown` file directly in that folder is one member
 * (subfolders are ignored). A profile that can't be read or has no `name` is
 * skipped with a warning instead of emptying the whole team list.
 *
 * Used by the /organization page and the homepage team spotlight.
 *
 * @returns Members sorted by `order` (missing last), then by name
 */
export async function getAllMembers(): Promise<Member[]> {
  let files: string[];
  try {
    files = await fs.readdir(membersDirectory);
  } catch (error) {
    console.error("Error reading the members directory:", error);
    return [];
  }

  const members = await Promise.all(
    files.filter(isMarkdownFile).map(async (file) => {
      try {
        const fileContents = await fs.readFile(join(membersDirectory, file), "utf8");
        return parseMember(file, fileContents);
      } catch (error) {
        console.warn(`content/organization/${file}: skipping profile that could not be read or parsed.`, error);
        return null;
      }
    })
  );

  return members
    .filter((member): member is Member => member !== null)
    .sort(compareMembers);
}
