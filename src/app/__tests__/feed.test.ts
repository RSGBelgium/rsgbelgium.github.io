/**
 * @jest-environment node
 */

/**
 * Tests for the RSS feed route handler (src/app/feed.xml/route.ts).
 */

import type { GetAllPostsOptions } from "@/lib/api";
import { getAllPosts } from "@/lib/api";
import type { Post } from "@/interfaces/post";
import { GET } from "../feed.xml/route";

jest.mock("@/lib/api", () => ({
  getAllPosts: jest.fn(),
}));

/** Posts as getAllPosts returns them: newest first; one is unlisted. */
const ALL_POSTS: Post[] = [
  {
    slug: "2026-05-15-speakers",
    title: 'Meet the speakers: "Beer & <Bioinformatics>"',
    date: "2026-05-15",
    excerpt: "Talks & drinks <in Ghent>.",
    content: "",
    category: "news",
  },
  {
    slug: "challenge_track1",
    title: "Track 1",
    date: "2026-05-01",
    content: "",
    category: "news",
    unlisted: true,
  },
  {
    slug: "2017-10-02-symposium",
    title: "Student day",
    date: "2017-10-02 19:10",
    content: "",
    category: "news",
  },
  {
    slug: "undated",
    title: "No date",
    date: "",
    excerpt: "Undated.",
    content: "",
    category: "news",
  },
];

/**
 * Checks that every opening tag has a matching closing tag, in order, and
 * that no text contains a raw "<" or a bare "&". A minimal well-formedness
 * check for the hand-built XML, without an XML parser dependency.
 */
function expectWellFormed(xml: string) {
  const body = xml.replace(/^<\?xml[^>]*\?>\s*/, "");
  const stack: string[] = [];
  for (const [, closing, name, , selfClosing] of body.matchAll(
    /<(\/?)([\w:]+)((?:\s+[\w:]+="[^"]*")*)\s*(\/?)>/g,
  )) {
    if (selfClosing) continue;
    if (closing) expect(stack.pop()).toBe(name);
    else stack.push(name);
  }
  expect(stack).toEqual([]);
  const text = body.replace(/<[^>]+>/g, "");
  expect(text).not.toMatch(/[<>]/);
  expect(text).not.toMatch(/&(?!(amp|lt|gt|quot|apos);)/);
}

async function fetchFeed() {
  const response = await GET();
  return { response, xml: await response.text() };
}

describe("GET /feed.xml", () => {
  beforeEach(() => {
    // Behave like the real loader: unlisted posts only with includeUnlisted.
    jest
      .mocked(getAllPosts)
      .mockImplementation(async ({ includeUnlisted = false }: GetAllPostsOptions = {}) =>
        ALL_POSTS.filter((post) => includeUnlisted || !post.unlisted),
      );
  });

  test("responds with RSS", async () => {
    const { response, xml } = await fetchFeed();
    expect(response.headers.get("Content-Type")).toBe("application/rss+xml; charset=utf-8");
    expect(xml.startsWith('<?xml version="1.0" encoding="UTF-8"?>\n<rss version="2.0"')).toBe(true);
    expect(xml).toContain("<title>RSG-Belgium News</title>");
    expect(xml).toContain("<link>https://rsg-belgium.org/news</link>");
    expect(xml).toContain(
      '<atom:link href="https://rsg-belgium.org/feed.xml" rel="self" type="application/rss+xml"/>',
    );
  });

  test("is well-formed XML with escaped titles and descriptions", async () => {
    const { xml } = await fetchFeed();
    expectWellFormed(xml);
    expect(xml).toContain(
      "<title>Meet the speakers: &quot;Beer &amp; &lt;Bioinformatics&gt;&quot;</title>",
    );
    expect(xml).toContain("<description>Talks &amp; drinks &lt;in Ghent&gt;.</description>");
  });

  test("lists the listed posts, newest first, without unlisted posts", async () => {
    const { xml } = await fetchFeed();
    const links = [...xml.matchAll(/<item>\s*<title>[^<]*<\/title>\s*<link>([^<]+)<\/link>/g)].map(
      (m) => m[1],
    );
    expect(links).toEqual([
      "https://rsg-belgium.org/news/2026-05-15-speakers",
      "https://rsg-belgium.org/news/2017-10-02-symposium",
      "https://rsg-belgium.org/news/undated",
    ]);
    expect(xml).not.toContain("challenge_track1");
  });

  test("dates items in RFC 822 format and uses the newest post as lastBuildDate", async () => {
    const { xml } = await fetchFeed();
    expect(xml).toContain("<pubDate>Fri, 15 May 2026 00:00:00 GMT</pubDate>");
    expect(xml).toContain("<lastBuildDate>Fri, 15 May 2026 00:00:00 GMT</lastBuildDate>");
    // An undated post has no pubDate rather than an invalid one.
    const undated = xml.slice(xml.indexOf("<title>No date</title>"));
    expect(undated.slice(0, undated.indexOf("</item>"))).not.toContain("<pubDate>");
  });

  test("describes posts without an excerpt", async () => {
    const { xml } = await fetchFeed();
    expect(xml).toContain(
      "<description>Read &quot;Student day&quot; on the RSG-Belgium website.</description>",
    );
  });

  test("is still valid without posts", async () => {
    jest.mocked(getAllPosts).mockResolvedValue([]);
    const { xml } = await fetchFeed();
    expectWellFormed(xml);
    expect(xml).not.toContain("<item>");
    expect(xml).toMatch(
      /<lastBuildDate>\w{3}, \d{2} \w{3} \d{4} \d{2}:\d{2}:\d{2} GMT<\/lastBuildDate>/,
    );
  });
});
