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
 *
 * The image is as wide as its column and keeps its own proportions. Its
 * real size (`size`, read from the file by the loader) lets the browser
 * reserve the right space before it loads; without one (an external image),
 * a 1300 x 630 placeholder ratio is used.
 *
 * Previews pass `crop` instead: the image then fills a box of that shape
 * (object-cover), so a tall poster takes no more room than a wide photo and
 * the previews in a grid line up. The crop keeps the top of the image,
 * where a poster has its title. A post's own page shows the whole image.
 */

import cn from "classnames";
import Link from "next/link";
import Image from "next/image";
import { postPath } from "@/lib/urls";
import type { ImageSize } from "@/lib/image-size";

type Props = {
  title: string;
  src?: string;
  size?: ImageSize;
  slug?: string;
  /** Tailwind aspect-ratio classes, e.g. "aspect-video": crop the image to that shape. */
  crop?: string;
};

/** Proportions assumed for images whose size is unknown. */
const FALLBACK_SIZE: ImageSize = { width: 1300, height: 630 };

/**
 * Displays a cover image for a post, optionally wrapped in a link.
 *
 * @param title - The title of the post (used for the alt text when the image is not a link)
 * @param src - The image source URL (optional; nothing is rendered without it)
 * @param size - The image's width and height in pixels, when known
 * @param slug - Optional post slug for linking to the post detail page
 * @param crop - Optional aspect-ratio classes to crop the image to (for previews)
 */
const CoverImage = ({ title, src, size = FALLBACK_SIZE, slug, crop }: Props) => {
  // If no src is provided, don't render the image
  if (!src) {
    return null;
  }

  const image = (
    <Image
      src={src}
      alt={slug ? "" : `Cover image for ${title}`}
      className={cn("shadow-sm w-full h-auto", crop && ["object-cover object-top", crop], {
        "hover:shadow-lg transition-shadow duration-200": slug,
      })}
      width={size.width}
      height={size.height}
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
