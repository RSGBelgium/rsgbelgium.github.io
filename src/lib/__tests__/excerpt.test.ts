/**
 * @jest-environment node
 */

/**
 * Tests for the plain-text excerpt fallback (src/lib/excerpt.ts).
 */

import { createExcerpt, EXCERPT_MAX_LENGTH, truncateAtWord } from "@/lib/excerpt";

describe("truncateAtWord", () => {
  test("returns text that fits unchanged", () => {
    expect(truncateAtWord("Short text.", 20)).toBe("Short text.");
  });

  test("cuts at the last word boundary and adds an ellipsis", () => {
    const result = truncateAtWord("The quick brown fox jumps over the lazy dog", 24);
    expect(result).toBe("The quick brown fox…");
    expect(result.length).toBeLessThanOrEqual(24);
  });

  test("does not end on dangling punctuation", () => {
    expect(truncateAtWord("Talks, drinks, networking and more", 16)).toBe("Talks, drinks…");
  });

  test("cuts inside a single very long word", () => {
    expect(truncateAtWord("Supercalifragilisticexpialidocious", 10)).toBe("Supercali…");
  });

  test("defaults to 160 characters", () => {
    const result = truncateAtWord("word ".repeat(100).trim());
    expect(EXCERPT_MAX_LENGTH).toBe(160);
    expect(result.length).toBeLessThanOrEqual(160);
    expect(result.endsWith("…")).toBe(true);
  });
});

describe("createExcerpt", () => {
  test("joins the paragraph text and leaves out headings, images, HTML and code", () => {
    const markdown = [
      "## Programme",
      "",
      "![Poster of the event](/images/poster/example.png)",
      "",
      "Join us for **three talks** and a [networking drink](https://example.org).",
      "",
      "```",
      "console.log('not in the excerpt');",
      "```",
      "",
      '<iframe src="https://example.org/map" title="Map"></iframe>',
      "",
      "> Doors open at 18:00.",
      "",
      "- Free entry",
    ].join("\n");

    expect(createExcerpt(markdown)).toBe(
      "Join us for three talks and a networking drink. Doors open at 18:00. Free entry",
    );
  });

  test("collapses whitespace inside paragraphs", () => {
    expect(createExcerpt("First   line\nsecond\tline")).toBe("First line second line");
  });

  test("shortens long bodies to the maximum length", () => {
    const markdown = Array.from({ length: 5 }, (_, i) => `Paragraph ${i + 1} has a few words in it.`).join("\n\n");
    const excerpt = createExcerpt(markdown, 50);
    expect(excerpt.length).toBeLessThanOrEqual(50);
    expect(excerpt).toMatch(/^Paragraph 1 has a few words in it\. Paragraph 2.*…$/);
  });

  test("returns an empty string when there is no paragraph text", () => {
    expect(createExcerpt("## Only a heading\n\n![An image](/x.png)")).toBe("");
    expect(createExcerpt("")).toBe("");
  });
});
