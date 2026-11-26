/**
 * Hero/featured post component.
 *
 * Renders a prominent, large-format post preview for the homepage or section highlight.
 * The title is an `<h2>`: it sits directly below the page's `<h1>`, at the
 * same level as the "More Stories" heading that follows. Like the other
 * previews, its picture (the post's card image, see cardImageOf) is cropped
 * (16:9, 2:1 from `md`), so a tall poster doesn't fill the screen; without
 * one, it shows the RSG-Belgium logo.
 */

import Avatar from "@/app/_components/avatar";
import CoverImage from "@/app/_components/cover-image";
import { type Author } from "@/interfaces/author";
import type { CardImage } from "@/lib/card-image";
import Link from "next/link";
import { TitleText } from "./title-text";
import { postPath } from "@/lib/urls";

type Props = {
  title: string;
  image?: CardImage;
  date: string;
  excerpt?: string;
  author: Author;
  slug: string;
};

/**
 * Displays a large-format, featured post preview with image, title, date, excerpt, and author.
 *
 * @param title - The post title
 * @param image - The post's card image, from cardImageOf (optional: without it, the logo)
 * @param date - The publication date (ISO string)
 * @param excerpt - Short summary of the post (optional)
 * @param author - The author object
 * @param slug - The post slug for linking to the detail page
 */
export function HeroPost({ title, image, date, excerpt, author, slug }: Props) {
  return (
    <section className="mb-12 md:mb-16">
      <div className="mb-6 md:mb-8">
        <CoverImage
          title={title}
          src={image?.src}
          size={image?.size}
          slug={slug}
          crop="aspect-video md:aspect-[2/1]"
        />
      </div>
      <div className="md:grid md:grid-cols-2 md:gap-x-8">
        <h2 className="mb-4 text-2xl md:text-4xl font-semibold tracking-tight leading-tight text-balance">
          <Link href={postPath(slug)} className="text-link hover:underline">
            <TitleText text={title} />
          </Link>
        </h2>
        <div>
          {excerpt && <p className="text-lg leading-relaxed mb-4">{excerpt}</p>}
          <Avatar name={author.name} picture={author.picture} date={date} />
        </div>
      </div>
    </section>
  );
}
