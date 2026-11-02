import { render, screen } from "@testing-library/react";
import type { Post } from "@/interfaces/post";
import { getAllPosts } from "@/lib/api";
import NewsPage, { metadata } from "../page";

jest.mock("@/lib/api", () => ({
  getAllPosts: jest.fn(),
}));

const posts: Post[] = [
  {
    slug: "2026-05-15-newest",
    title: "Newest post",
    date: "2026-05-15",
    excerpt: "The newest excerpt.",
    coverImage: "/images/poster/newest.png",
    content: "",
    category: "news",
  },
  {
    slug: "2026-04-09-second",
    title: "Second post",
    date: "2026-04-09",
    excerpt: "Second.",
    content: "",
    category: "news",
  },
  {
    slug: "2026-03-12-third",
    title: "Third post",
    date: "2026-03-12",
    content: "",
    category: "news",
  },
];

/** Renders the async server component. */
async function renderNewsPage() {
  render(await NewsPage());
}

describe("News page", () => {
  beforeEach(() => {
    jest.mocked(getAllPosts).mockResolvedValue(posts);
  });

  test("loads the listed posts only", async () => {
    await renderNewsPage();
    expect(getAllPosts).toHaveBeenCalledWith();
  });

  test("has one h1 from the intro", async () => {
    await renderNewsPage();
    const h1s = screen.getAllByRole("heading", { level: 1 });
    expect(h1s).toHaveLength(1);
    expect(h1s[0]).toHaveTextContent("News.");
  });

  test("features the newest post as an h2, with the RSG-Belgium author by default", async () => {
    await renderNewsPage();
    const hero = screen.getByRole("heading", { level: 2, name: "Newest post" });
    expect(hero.querySelector("a")).toHaveAttribute("href", "/news/2026-05-15-newest");
    expect(screen.getByText("The newest excerpt.")).toBeInTheDocument();
    expect(screen.getAllByText("RSG-Belgium").length).toBeGreaterThan(0);
  });

  test("lists the other posts under More Stories as h3s", async () => {
    await renderNewsPage();
    expect(screen.getByRole("heading", { level: 2, name: "More Stories" })).toBeInTheDocument();
    expect(
      screen.getAllByRole("heading", { level: 3 }).map((heading) => heading.textContent),
    ).toEqual(["Second post", "Third post"]);
  });

  test("offers one keyboard-reachable link per post", async () => {
    await renderNewsPage();
    // The cover image link duplicates the title link and is hidden from keyboard and screen readers.
    expect(screen.getAllByRole("link").map((link) => link.getAttribute("href"))).toEqual([
      "/news/2026-05-15-newest",
      "/news/2026-04-09-second",
      "/news/2026-03-12-third",
    ]);
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  test("renders only the intro when there are no posts", async () => {
    jest.mocked(getAllPosts).mockResolvedValue([]);
    await renderNewsPage();
    expect(screen.getAllByRole("heading")).toHaveLength(1);
  });

  test("sets its title and canonical URL", () => {
    expect(metadata.title).toBe("News");
    expect(metadata.alternates?.canonical).toBe("/news");
  });
});
