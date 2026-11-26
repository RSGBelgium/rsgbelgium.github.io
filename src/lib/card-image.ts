/**
 * The picture on a news post's card: on the homepage's Latest News and on /news.
 *
 * A post's `cardImage` is shown on its card only, never on the post's own
 * page nor in link previews, so a poster can stay where it is in the post
 * and still be on the card. Without one, the card shows the `coverImage`
 * (which is also at the top of the post), and without either, the
 * RSG-Belgium logo (CardLogo), so every card has a picture.
 */

import type { Post } from "@/interfaces/post";
import type { ImageSize } from "@/lib/image-size";

/** An image on a card: its URL path and, when the loader could read it, its size. */
export type CardImage = { src: string; size?: ImageSize };

/** The logo shown on the card of a post without a card or cover image. */
export const CARD_LOGO = "/images/logo/rsgBe.svg";

/**
 * Picks the image for a post's card.
 *
 * Only site paths ("/images/...") count: `npm run check:content` rejects
 * any other value, and a card is better off with the logo than with a
 * broken image.
 *
 * @param post - The post, with its card and cover image as loaded
 * @returns The `cardImage`, else the `coverImage`, with its size; undefined
 *   when the post has neither (its card shows the logo)
 */
export function cardImageOf(
  post: Pick<Post, "cardImage" | "cardImageSize" | "coverImage" | "coverImageSize">,
): CardImage | undefined {
  if (post.cardImage?.startsWith("/")) return { src: post.cardImage, size: post.cardImageSize };
  if (post.coverImage?.startsWith("/")) return { src: post.coverImage, size: post.coverImageSize };
  return undefined;
}
