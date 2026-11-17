/**
 * @jest-environment node
 */

/**
 * Tests for the content rules shared by the site and the content check
 * (src/lib/content-rules.ts).
 */

import {
  checkMemberNumbering,
  isMarkdownFile,
  parseMemberOrder,
  resolveMemberImage,
  slugFromFileName,
} from "@/lib/content-rules";

test("markdown files are .md and .markdown; the slug is the name without it", () => {
  expect(isMarkdownFile("2026-05-15-post.md")).toBe(true);
  expect(isMarkdownFile("2018-10-01-first-hackathon.markdown")).toBe(true);
  expect(isMarkdownFile("notes.txt")).toBe(false);
  expect(slugFromFileName("2018-10-01-first-hackathon.markdown")).toBe(
    "2018-10-01-first-hackathon",
  );
});

test("resolveMemberImage puts bare file names in the team photo folder", () => {
  expect(resolveMemberImage("jane.webp")).toBe("/images/team/jane.webp");
  expect(resolveMemberImage("/images/team/anis.webp")).toBe("/images/team/anis.webp");
  expect(resolveMemberImage("https://example.org/jane.jpg")).toBe("https://example.org/jane.jpg");
  expect(resolveMemberImage("")).toBe("");
});

test.each([
  [1, 1],
  ["2", 2],
  [0, undefined],
  [2.5, undefined],
  ["first", undefined],
  ["", undefined],
  [undefined, undefined],
])("parseMemberOrder(%j) -> %j", (value, expected) => {
  expect(parseMemberOrder(value)).toBe(expected);
});

describe("checkMemberNumbering", () => {
  test("accepts 1 to n in any sequence", () => {
    expect(checkMemberNumbering([3, 1, 2])).toEqual({ duplicates: [], missing: [] });
  });

  test("reports numbers used twice and numbers left out", () => {
    expect(checkMemberNumbering([1, 1, 3])).toEqual({ duplicates: [1], missing: [2] });
  });

  test("counts profiles without a valid order towards n", () => {
    expect(checkMemberNumbering([1, 2], 3)).toEqual({ duplicates: [], missing: [3] });
  });
});
