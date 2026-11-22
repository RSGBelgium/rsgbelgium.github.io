/**
 * @jest-environment node
 */

/**
 * Tests for sitemap.xml (src/app/sitemap.ts) and robots.txt (src/app/robots.ts).
 */

import { getAllPosts } from "@/lib/api";
import type { Post } from "@/interfaces/post";
import robots from "../robots";
import sitemap from "../sitemap";
import { makePost } from "@/test-utils/fixtures";

jest.mock("@/lib/api", () => ({
  getAllPosts: jest.fn(),
}));

/** Posts as getAllPosts returns them: newest first. */
const ALL_POSTS: Post[] = [
  makePost({ slug: "2026-05-15-speakers", title: "Speakers", date: "2026-05-15" }),
  makePost({
    slug: "2021-09-15-beerformatics",
    title: "Beerformatics",
    date: "2021-09-21T00:00:00.000Z",
  }),
  makePost({ slug: "undated", title: "Undated" }),
];

describe("sitemap", () => {
  beforeEach(() => {
    jest.mocked(getAllPosts).mockResolvedValue(ALL_POSTS);
  });

  test("lists the homepage, the static pages and every post, as absolute URLs", async () => {
    const entries = await sitemap();
    expect(entries.map((entry) => entry.url)).toEqual([
      "https://rsg-belgium.org",
      "https://rsg-belgium.org/about",
      "https://rsg-belgium.org/news",
      "https://rsg-belgium.org/organization",
      "https://rsg-belgium.org/contact",
      "https://rsg-belgium.org/discord",
      "https://rsg-belgium.org/news/2026-05-15-speakers",
      "https://rsg-belgium.org/news/2021-09-15-beerformatics",
      "https://rsg-belgium.org/news/undated",
    ]);
  });

  test("dates posts, the homepage and /news by the newest post", async () => {
    const byUrl = Object.fromEntries(
      (await sitemap()).map((entry) => [entry.url, entry.lastModified]),
    );
    const newest = new Date("2026-05-15");

    expect(byUrl["https://rsg-belgium.org"]).toEqual(newest);
    expect(byUrl["https://rsg-belgium.org/news"]).toEqual(newest);
    expect(byUrl["https://rsg-belgium.org/about"]).toBeUndefined();
    expect(byUrl["https://rsg-belgium.org/news/2021-09-15-beerformatics"]).toEqual(
      new Date("2021-09-21"),
    );
    expect(byUrl["https://rsg-belgium.org/news/undated"]).toBeUndefined();
  });

  test("has no dates without posts", async () => {
    jest.mocked(getAllPosts).mockResolvedValue([]);
    const entries = await sitemap();
    expect(entries).toHaveLength(6);
    expect(entries.every((entry) => entry.lastModified === undefined)).toBe(true);
  });
});

describe("robots", () => {
  test("allows everything and points to the sitemap", () => {
    expect(robots()).toEqual({
      rules: { userAgent: "*", allow: "/" },
      sitemap: "https://rsg-belgium.org/sitemap.xml",
      host: "https://rsg-belgium.org",
    });
  });
});
