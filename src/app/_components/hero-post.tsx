/**
 * Hero/featured post component.
 *
 * Renders a prominent, large-format post preview for the homepage or section highlight.
 * The title is an `<h2>`: it sits directly below the page's `<h1>`, at the
 * same level as the "More Stories" heading that follows.
 */

import Avatar from "@/app/_components/avatar";
import CoverImage from "@/app/_components/cover-image";
import { type Author } from "@/interfaces/author";
import Link from "next/link";
import DateFormatter from "./date-formatter";
import { postPath } from "@/lib/urls";

type Props = {
  title: string;
  coverImage?: string;
  date: string;
  excerpt?: string;
  author: Author;
  slug: string;
};

/**
 * Displays a large-format, featured post preview with image, title, date, excerpt, and author.
 *
 * @param title - The post title
 * @param coverImage - The main image for the post (optional)
 * @param date - The publication date (ISO string)
 * @param excerpt - Short summary of the post (optional)
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
      {coverImage && (
        <div className="mb-8 md:mb-16">
          <CoverImage title={title} src={coverImage} slug={slug} />
        </div>
      )}
      <div className="md:grid md:grid-cols-2 md:gap-x-16 lg:gap-x-8 mb-20 md:mb-28">
        <div>
          <h2 className="mb-4 text-4xl lg:text-5xl leading-tight">
            <Link href={postPath(slug)} className="text-link hover:underline">
              {title}
            </Link>
          </h2>
          <div className="mb-4 md:mb-0 text-lg text-foreground-muted">
            <DateFormatter dateString={date} />
          </div>
        </div>
        <div>
          {excerpt && <p className="text-lg leading-relaxed mb-4">{excerpt}</p>}
          <Avatar name={author.name} picture={author.picture} />
        </div>
      </div>
    </section>
  );
}
