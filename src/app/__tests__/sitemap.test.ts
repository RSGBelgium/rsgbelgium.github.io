/**
 * @jest-environment node
 */

/**
 * Tests for sitemap.xml (src/app/sitemap.ts) and robots.txt (src/app/robots.ts).
 */

import type { GetAllPostsOptions } from "@/lib/api";
import { getAllPosts } from "@/lib/api";
import type { Post } from "@/interfaces/post";
import robots from "../robots";
import sitemap from "../sitemap";

jest.mock("@/lib/api", () => ({
  getAllPosts: jest.fn(),
}));

/** Posts as getAllPosts returns them: newest first; one is unlisted. */
const ALL_POSTS: Post[] = [
  {
    slug: "challenge_track1",
    title: "Track 1",
    date: "2026-06-01",
    content: "",
    category: "news",
    unlisted: true,
  },
  {
    slug: "2026-05-15-speakers",
    title: "Speakers",
    date: "2026-05-15",
    content: "",
    category: "news",
  },
  {
    slug: "2021-09-15-beerformatics",
    title: "Beerformatics",
    date: "2021-09-21T00:00:00.000Z",
    content: "",
    category: "news",
  },
  { slug: "undated", title: "Undated", date: "", content: "", category: "news" },
];

describe("sitemap", () => {
  beforeEach(() => {
    jest
      .mocked(getAllPosts)
      .mockImplementation(async ({ includeUnlisted = false }: GetAllPostsOptions = {}) =>
        ALL_POSTS.filter((post) => includeUnlisted || !post.unlisted),
      );
  });

  test("lists the homepage, the static pages and every listed post, as absolute URLs", async () => {
    const entries = await sitemap();
    expect(entries.map((entry) => entry.url)).toEqual([
      "https://rsg-belgium.org",
      "https://rsg-belgium.org/about",
      "https://rsg-belgium.org/news",
      "https://rsg-belgium.org/organization",
      "https://rsg-belgium.org/contact",
      "https://rsg-belgium.org/slack",
      "https://rsg-belgium.org/news/2026-05-15-speakers",
      "https://rsg-belgium.org/news/2021-09-15-beerformatics",
      "https://rsg-belgium.org/news/undated",
    ]);
  });

  test("leaves out unlisted posts", async () => {
    const entries = await sitemap();
    expect(entries.some((entry) => entry.url.includes("challenge_track1"))).toBe(false);
  });

  test("dates posts, the homepage and /news by the newest listed post", async () => {
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
