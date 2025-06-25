/**
 * Cover image component for posts and articles.
 *
 * Renders a responsive image with optional link to the post detail page.
 */

import cn from "classnames";
import Link from "next/link";
import Image from "next/image";

type Props = {
  title: string;
  src: string;
  slug?: string;
};

/**
 * Displays a cover image for a post, optionally wrapped in a link.
 *
 * @param title - The title of the post (used for alt text and aria-label)
 * @param src - The image source URL
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
      alt={`Cover Image for ${title}`}
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
        <Link href={`/news/${slug}`} aria-label={title}>
          {image}
        </Link>
      ) : (
        image
      )}
    </div>
  );
};

export default CoverImage;
