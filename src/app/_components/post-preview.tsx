/**
 * Post preview card component.
 *
 * Renders a summary card for a blog/news post, including title, cover image, date, excerpt, and author.
 * The cover image is cropped to 16:9, so the previews in the grid line up
 * whatever the shape of the image.
 */

import Link from "next/link";
import Avatar from "@/app/_components/avatar";
import CoverImage from "@/app/_components/cover-image";
import { TitleText } from "./title-text";
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
        <div className="mb-4">
          <CoverImage
            slug={slug}
            title={title}
            src={coverImage}
            size={coverImageSize}
            crop="aspect-video"
          />
        </div>
      )}
      <h3 className="mb-2 text-xl md:text-2xl font-semibold leading-snug text-balance">
        <Link href={postPath(slug)} className="text-link hover:underline">
          <TitleText text={title} />
        </Link>
      </h3>
      {excerpt && <p className="mb-4 leading-relaxed">{excerpt}</p>}
      <Avatar
        name={author?.name || DEFAULT_AUTHOR.name}
        picture={author?.picture || DEFAULT_AUTHOR.picture}
        date={date}
      />
    </div>
  );
}
