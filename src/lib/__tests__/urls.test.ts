/**
 * @jest-environment node
 */

/**
 * Tests for the shared URL helpers (src/lib/urls.ts).
 */

import { absoluteUrl, isAbsoluteUrl, postPath } from "@/lib/urls";

describe("isAbsoluteUrl", () => {
  test.each([
    ["https://github.com/RSGBelgium", true],
    ["http://example.org", true],
    ["/discord", false],
    ["#tracks", false],
    ["mailto:iscb.rsg.belgium@gmail.com", false],
    ["images/team/anis.webp", false],
  ])("%s -> %s", (url, expected) => {
    expect(isAbsoluteUrl(url)).toBe(expected);
  });
});

describe("absoluteUrl", () => {
  test("puts site paths on the live domain", () => {
    expect(absoluteUrl("/news")).toBe("https://rsg-belgium.org/news");
    expect(absoluteUrl("/images/team/anis.webp")).toBe(
      "https://rsg-belgium.org/images/team/anis.webp",
    );
  });

  test("returns absolute URLs unchanged", () => {
    expect(absoluteUrl("https://example.org/a.png")).toBe("https://example.org/a.png");
  });
});

test("postPath builds the URL path of a news post", () => {
  expect(postPath("2026-05-15-sixth-beerformatics-speaker")).toBe(
    "/news/2026-05-15-sixth-beerformatics-speaker",
  );
});
