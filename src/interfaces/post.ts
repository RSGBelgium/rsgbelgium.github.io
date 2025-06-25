/**
 * Post interface for news/blog posts.
 *
 * Represents a news or blog post loaded from markdown content.
 */

import { type Author } from "./author";

/**
 * Represents a news or blog post.
 *
 * @property slug - Unique slug for the post
 * @property title - Post title
 * @property date - Publication date (ISO string)
 * @property coverImage - Path to cover image
 * @property author - Author object (optional)
 * @property excerpt - Short summary of the post
 * @property ogImage - Open Graph image object (optional)
 * @property content - Markdown/HTML content for the post
 * @property preview - If true, this is a preview post (optional)
 * @property category - Category of the post
 */
export type Post = {
  slug: string;
  title: string;
  date: string;
  coverImage: string;
  author?: Author;
  excerpt: string;
  ogImage?: {
    url: string;
  };
  content: string;
  preview?: boolean;
  category: string;
};
