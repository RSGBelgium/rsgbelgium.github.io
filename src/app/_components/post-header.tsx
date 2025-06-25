/**
 * Blog/news post header component.
 *
 * Renders the title, author avatar, cover image, and publication date for a post.
 */

'use client';

import { Author } from "@/interfaces/author";
import Avatar from "@/app/_components/avatar";
import CoverImage from "@/app/_components/cover-image";
import DateFormatter from "./date-formatter";

type Props = {
  title: string;
  coverImage: string;
  date: string;
  author?: Author;
};

/**
 * Displays the header for a blog/news post, including title, author, image, and date.
 *
 * @param title - The post title
 * @param coverImage - The main image for the post
 * @param date - The publication date (ISO string)
 * @param author - The author object (optional)
 */
export default function PostHeader({ title, coverImage, date, author }: Props) {
  const defaultAuthor = {
    name: "RSG-Belgium",
    picture: "/images/team/rsg-logo.png"
  };

  const displayAuthor = author || defaultAuthor;

  return (
    <>
      <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold tracking-tighter leading-tight md:leading-none mb-12 text-center md:text-left">
        {title}
      </h1>
      <div className="hidden md:block md:mb-12">
        <Avatar name={displayAuthor.name} picture={displayAuthor.picture} />
      </div>
      {coverImage && (
        <div className="mb-8 md:mb-16 sm:mx-0">
          <CoverImage title={title} src={coverImage} />
        </div>
      )}
      <div className="max-w-2xl mx-auto">
        <div className="block md:hidden mb-6">
          <Avatar name={displayAuthor.name} picture={displayAuthor.picture} />
        </div>
        <div className="mb-6 text-lg">
          <DateFormatter dateString={date} />
        </div>
      </div>
    </>
  );
}
