/**
 * @jest-environment node
 */

import { cardImageOf } from "@/lib/card-image";

const CARD = "/images/poster/card.webp";
const COVER = "/images/poster/cover.jpg";

describe("cardImageOf", () => {
  test("prefers the card image, with its size", () => {
    expect(
      cardImageOf({
        cardImage: CARD,
        cardImageSize: { width: 1200, height: 1200 },
        coverImage: COVER,
        coverImageSize: { width: 1600, height: 800 },
      }),
    ).toEqual({ src: CARD, size: { width: 1200, height: 1200 } });
  });

  test("falls back to the cover image, with its size", () => {
    expect(
      cardImageOf({ coverImage: COVER, coverImageSize: { width: 1600, height: 800 } }),
    ).toEqual({ src: COVER, size: { width: 1600, height: 800 } });
  });

  test("has none for a post without images: its card shows the logo", () => {
    expect(cardImageOf({})).toBeUndefined();
  });

  test("only uses paths on the site", () => {
    expect(cardImageOf({ cardImage: "card.webp", coverImage: COVER })).toEqual({ src: COVER });
    expect(cardImageOf({ cardImage: "https://example.org/card.png" })).toBeUndefined();
    expect(cardImageOf({ cardImage: "", coverImage: "" })).toBeUndefined();
  });
});
