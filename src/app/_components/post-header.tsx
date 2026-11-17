/**
 * Blog/news post header component.
 *
 * Renders the title, author avatar, cover image, and publication date for a post.
 */

"use client";

import { Author } from "@/interfaces/author";
import type { ImageSize } from "@/lib/image-size";
import { DEFAULT_AUTHOR } from "@/lib/constants";
import Avatar from "@/app/_components/avatar";
import CoverImage from "@/app/_components/cover-image";
import { TitleText } from "./title-text";

type Props = {
  title: string;
  coverImage?: string;
  coverImageSize?: ImageSize;
  date: string;
  author?: Author;
};

/**
 * Displays the header for a blog/news post, including title, author, image, and date.
 *
 * The title and the byline (author and date) sit in the same centred column
 * as the post's body (PostBody, max-w-2xl), so they share its left edge.
 * The title is 30px on phones, 36px from `sm` and 40px from `lg`, and its
 * lines are balanced, so long titles don't leave a single word on the last
 * line, and TitleText keeps "COVID-19" and "Symposium -" from breaking apart.
 *
 * @param title - The post title
 * @param coverImage - The main image for the post (optional)
 * @param coverImageSize - Width and height of the cover image (optional)
 * @param date - The publication date (ISO string)
 * @param author - The author object (optional)
 */
export default function PostHeader({ title, coverImage, coverImageSize, date, author }: Props) {
  const displayAuthor = author || DEFAULT_AUTHOR;

  return (
    <>
      {/* pt-10 md:pt-16: the same space under the sticky header as PageHeader gives the other pages. */}
      <div className="max-w-2xl mx-auto pt-10 md:pt-16 mb-8 md:mb-12">
        <h1 className="mb-6 text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-tight text-balance break-words">
          <TitleText text={title} />
        </h1>
        <Avatar name={displayAuthor.name} picture={displayAuthor.picture} date={date} />
      </div>
      {coverImage && (
        <div className="mb-8 md:mb-16 sm:mx-0">
          <CoverImage title={title} src={coverImage} size={coverImageSize} />
        </div>
      )}
    </>
  );
}
