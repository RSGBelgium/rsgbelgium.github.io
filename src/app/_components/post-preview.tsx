/**
 * Post preview card component.
 *
 * Renders a summary card for a blog/news post, including title, cover image, date, excerpt, and author.
 */

import Link from "next/link";
import { Post } from "@/interfaces/post";
import Avatar from "@/app/_components/avatar";
import CoverImage from "@/app/_components/cover-image";
import DateFormatter from "./date-formatter";

type Props = {
  title: string;
  coverImage: string;
  date: string;
  excerpt: string;
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
 * @param coverImage - The main image for the post
 * @param date - The publication date (ISO string)
 * @param excerpt - Short summary of the post
 * @param author - The author object (optional)
 * @param slug - The post slug for linking to the detail page
 */
export function PostPreview({
  title,
  coverImage,
  date,
  excerpt,
  author,
  slug,
}: Props) {
  const defaultAuthor = {
    name: "RSG-Belgium",
    picture: "/images/team/rsg-logo.png"
  };

  return (
    <div>
      {coverImage && (
        <div className="mb-5">
          <CoverImage slug={slug} title={title} src={coverImage} />
        </div>
      )}
      <h3 className="text-3xl mb-3 leading-snug">
        <Link href={`/news/${slug}`} className="text-primary hover:underline hover:text-secondary dark:text-lightblue dark:hover:text-white">
          {title}
        </Link>
      </h3>
      <div className="text-lg mb-4">
        <DateFormatter dateString={date} />
      </div>
      <p className="text-lg leading-relaxed mb-4">{excerpt}</p>
      <Avatar
        name={author?.name || defaultAuthor.name}
        picture={author?.picture || defaultAuthor.picture}
      />
    </div>
  );
}
