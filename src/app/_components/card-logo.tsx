/**
 * The picture on the card of a news post that has no card or cover image.
 *
 * The RSG-Belgium logo, whole and centred, on the pink-to-yellow gradient of
 * our event posters (the `poster-*` colour tokens), so it sits naturally
 * among the poster cards and every card in a grid has a picture. Like a
 * poster, it looks the same in both themes: the logo's black lettering needs
 * the light background.
 *
 * The tile takes the place of an image, so the caller gives it the image's
 * shape (`h-48`, `aspect-video`, ...). The logo is three quarters of the
 * tile's height, at most 12rem, so on the large featured post on /news it
 * stays a logo rather than a wall. It is positioned absolutely, so its
 * height can be a percentage of any tile, however the tile gets its height.
 *
 * It is decorative (empty alt text): the card's title says what the post is
 * about.
 */

import cn from "classnames";
import Image from "next/image";
import { CARD_LOGO } from "@/lib/card-image";

/** The logo's proportions (its SVG viewBox is 1009.4 x 1033.4). */
const LOGO_SIZE = { width: 1009, height: 1033 };

type Props = {
  /** The tile's shape and effects, e.g. "h-48" or "w-full aspect-video". */
  className?: string;
};

/**
 * Renders the RSG-Belgium logo on our posters' gradient.
 *
 * @param className - The tile's shape and effects
 */
export default function CardLogo({ className }: Props) {
  return (
    <div className={cn("relative bg-gradient-to-r from-poster-start to-poster-end", className)}>
      <Image
        src={CARD_LOGO}
        alt=""
        width={LOGO_SIZE.width}
        height={LOGO_SIZE.height}
        className="absolute left-1/2 top-1/2 h-3/4 max-h-48 w-auto -translate-x-1/2 -translate-y-1/2"
      />
    </div>
  );
}
