/**
 * Post preview card component.
 *
 * Renders a summary card for a blog/news post, including title, cover image, date, excerpt, and author.
 */

import Link from "next/link";
import Avatar from "@/app/_components/avatar";
import CoverImage from "@/app/_components/cover-image";
import DateFormatter from "./date-formatter";
import { postPath } from "@/lib/urls";
import type { ImageSize } from "@/lib/image-size";
import { DEFAULT_AUTHOR } from "@/lib/constants";

type Props = {
  title: string;
  coverImage?: string;
  coverImageSize?: ImageSize;
  date: string;
  excerpt?: string;
  author?: {
    name: string;
    picture: string;
  };
  slug: string;
};

/**
 * Displays a preview card for a post, with image, title, date, excerpt, and author.
 *
 * @param title - The post title
 * @param coverImage - The main image for the post (optional)
 * @param coverImageSize - Width and height of the cover image (optional)
 * @param date - The publication date (ISO string)
 * @param excerpt - Short summary of the post (optional)
 * @param author - The author object (optional)
 * @param slug - The post slug for linking to the detail page
 */
export function PostPreview({
  title,
  coverImage,
  coverImageSize,
  date,
  excerpt,
  author,
  slug,
}: Props) {
  return (
    <div>
      {coverImage && (
        <div className="mb-5">
          <CoverImage slug={slug} title={title} src={coverImage} size={coverImageSize} />
        </div>
      )}
      <h3 className="text-3xl mb-3 leading-snug">
        <Link href={postPath(slug)} className="text-link hover:underline">
          {title}
        </Link>
      </h3>
      <div className="text-lg mb-4 text-foreground-muted">
        <DateFormatter dateString={date} />
      </div>
      {excerpt && <p className="text-lg leading-relaxed mb-4">{excerpt}</p>}
      <Avatar
        name={author?.name || DEFAULT_AUTHOR.name}
        picture={author?.picture || DEFAULT_AUTHOR.picture}
      />
    </div>
  );
}
