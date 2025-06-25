/**
 * Hero/featured post component.
 *
 * Renders a prominent, large-format post preview for the homepage or section highlight.
 */

import Avatar from "@/app/_components/avatar";
import CoverImage from "@/app/_components/cover-image";
import { type Author } from "@/interfaces/author";
import Link from "next/link";
import DateFormatter from "./date-formatter";

type Props = {
  title: string;
  coverImage: string;
  date: string;
  excerpt: string;
  author: Author;
  slug: string;
};

/**
 * Displays a large-format, featured post preview with image, title, date, excerpt, and author.
 *
 * @param title - The post title
 * @param coverImage - The main image for the post
 * @param date - The publication date (ISO string)
 * @param excerpt - Short summary of the post
 * @param author - The author object
 * @param slug - The post slug for linking to the detail page
 */
export function HeroPost({
  title,
  coverImage,
  date,
  excerpt,
  author,
  slug,
}: Props) {
  return (
    <section>
      <div className="mb-8 md:mb-16">
        <CoverImage title={title} src={coverImage} slug={slug} />
      </div>
      <div className="md:grid md:grid-cols-2 md:gap-x-16 lg:gap-x-8 mb-20 md:mb-28">
        <div>
          <h3 className="mb-4 text-4xl lg:text-5xl leading-tight">
            <Link href={`/news/${slug}`} className="text-primary hover:underline hover:text-secondary dark:text-lightblue dark:hover:text-white">
              {title}
            </Link>
          </h3>
          <div className="mb-4 md:mb-0 text-lg">
            <DateFormatter dateString={date} />
          </div>
        </div>
        <div>
          <p className="text-lg leading-relaxed mb-4">{excerpt}</p>
          <Avatar name={author.name} picture={author.picture} />
        </div>
      </div>
    </section>
  );
}
