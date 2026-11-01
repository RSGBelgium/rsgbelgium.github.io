/**
 * Cover image component for posts and articles.
 *
 * Renders a responsive image with optional link to the post detail page.
 *
 * In a post preview the image links to the same post as the title next to
 * it. That duplicate link is kept for mouse and touch users only: it is
 * hidden from screen readers and skipped by the Tab key, and the image has
 * empty alt text, so keyboard and screen-reader users meet one link per
 * post, the title.
 */

import cn from "classnames";
import Link from "next/link";
import Image from "next/image";
import { postPath } from "@/lib/urls";

type Props = {
  title: string;
  src?: string;
  slug?: string;
};

/**
 * Displays a cover image for a post, optionally wrapped in a link.
 *
 * @param title - The title of the post (used for the alt text when the image is not a link)
 * @param src - The image source URL (optional; nothing is rendered without it)
 * @param slug - Optional post slug for linking to the post detail page
 */
const CoverImage = ({ title, src, slug }: Props) => {
  // If no src is provided, don't render the image
  if (!src) {
    return null;
  }

  const image = (
    <Image
      src={src}
      alt={slug ? "" : `Cover image for ${title}`}
      className={cn("shadow-sm w-full", {
        "hover:shadow-lg transition-shadow duration-200": slug,
      })}
      width={1300}
      height={630}
    />
  );

  return (
    <div className="sm:mx-0">
      {slug ? (
        <Link href={postPath(slug)} aria-hidden="true" tabIndex={-1}>
          {image}
        </Link>
      ) : (
        image
      )}
    </div>
  );
};

export default CoverImage;
