/**
 * Post interface for news/blog posts.
 *
 * Represents a news or blog post loaded from markdown content.
 */

import { type Author } from "./author";
import { type ImageSize } from "@/lib/image-size";

/**
 * Represents a news or blog post.
 *
 * @property slug - Unique slug for the post
 * @property title - Post title
 * @property date - Publication date ("YYYY-MM-DD", "YYYY-MM-DD HH:mm" or ISO string)
 * @property coverImage - Path to cover image (optional)
 * @property coverImageSize - Width and height of the cover image, read from the file by the loader (local images only)
 * @property author - Author object (optional)
 * @property excerpt - Short plain-text summary used in previews, the RSS feed and SEO: the front-matter `excerpt`, or one generated from the body by the loader
 * @property ogImage - Open Graph image object (optional)
 * @property content - Markdown/HTML content for the post
 * @property category - Category of the post
 */
export type Post = {
  slug: string;
  title: string;
  date: string;
  coverImage?: string;
  coverImageSize?: ImageSize;
  author?: Author;
  excerpt?: string;
  ogImage?: {
    url: string;
  };
  content: string;
  category: string;
};
