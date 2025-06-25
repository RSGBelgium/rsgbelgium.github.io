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
import { existsSync } from "fs";

const postsDirectory = join(process.cwd(), "content/news");
const organizationDirectory = join(process.cwd(), "content/organization");
const membersDirectory = join(process.cwd(), "content/organization");

/**
 * Get all post slugs (filenames without extension) from the news content directory.
 */
export async function getPostSlugs(): Promise<string[]> {
  try {
    const files = await fs.readdir(postsDirectory);
    return files
      .filter(file => file.endsWith('.md') || file.endsWith('.markdown'))
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
    } as Post;
  } catch (error) {
    console.error(`Error reading post for slug ${slug}:`, error);
    return null;
  }
}

/**
 * Get all posts, sorted by date descending.
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
      .sort((post1: Post, post2: Post) => (post1.date > post2.date ? -1 : 1));
  } catch (error) {
    console.error('Error getting all posts:', error);
    return [];
  }
}

/**
 * Get all organization members from the organization content directory.
 *
 * @returns Array of Member objects
 */
export async function getOrganizationData(): Promise<Member[]> {
  try {
    const files = await fs.readdir(organizationDirectory);
    const members = await Promise.all(
      files
        .filter(file => file.endsWith('.md') || file.endsWith('.markdown'))
        .map(async (file: string) => {
          const fullPath = join(organizationDirectory, file);
          const fileContents = await fs.readFile(fullPath, "utf8");
          const { data, content } = matter(fileContents);

          // Ensure image path is correctly prefixed
          const imagePath = data.image.startsWith('/') ? data.image : `/images/team/${data.image}`;

          return {
            ...data,
            slug: file.replace(/\.(md|markdown)$/, ""),
            image: imagePath,
            content,
          } as Member;
        })
    );

    return members.sort((a: Member, b: Member) => a.name.localeCompare(b.name));
  } catch (error) {
    console.error('Error reading organization data:', error);
    return [];
  }
}

/**
 * Get all member slugs (filenames) from the organization content directory.
 */
export async function getMemberSlugs(): Promise<string[]> {
  try {
    const files = await fs.readdir(membersDirectory);
    return files.filter(file => file.endsWith('.md') || file.endsWith('.markdown'));
  } catch (error) {
    console.error('Error reading member slugs:', error);
    return [];
  }
}

/**
 * Get a single member by their slug (filename).
 *
 * @param slugWithExtension - The filename of the member markdown file
 * @returns The Member object or null if not found or invalid
 */
export async function getMemberBySlug(slugWithExtension: string): Promise<Member | null> {
  const slugForUrl = slugWithExtension.replace(/\.md(?:own)?$/, "");
  const fullPath = join(membersDirectory, slugWithExtension);

  try {
    const fileContents = await fs.readFile(fullPath, "utf8");
    const { data, content } = matter(fileContents);

    // Basic validation for essential member fields
    if (!data.name || !data.title || !data.image) {
      console.warn(`Warning: Member with slug '${slugForUrl}' (source file: ${slugWithExtension}) is missing essential front matter (name, title, or image). Skipping.`);
      return null;
    }

    // Ensure image path is correctly prefixed
    const imagePath = data.image.startsWith('/') ? data.image : `/images/team/${data.image}`;

    return {
      ...data,
      slug: slugForUrl,
      name: data.name,
      title: data.title,
      image: imagePath,
      linkedin: data.linkedin,
      orcid: data.orcid,
      content,
    } as Member;
  } catch (error) {
    console.error(`Error processing member with slug: ${slugForUrl} (source file: ${slugWithExtension})`, error);
    return null;
  }
}

/**
 * Get all members, sorted by name.
 *
 * @returns Array of Member objects
 */
export async function getAllMembers(): Promise<Member[]> {
  try {
    const slugs = await getMemberSlugs();
    const membersPromises = slugs.map((slug) => getMemberBySlug(slug));
    const members = await Promise.all(membersPromises);
    return members
      .filter((member): member is Member => member !== null)
      .sort((member1, member2) => member1.name.localeCompare(member2.name));
  } catch (error) {
    console.error('Error getting all members:', error);
    return [];
  }
}
