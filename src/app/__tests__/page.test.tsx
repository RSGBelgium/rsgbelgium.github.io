import { render, screen, within } from "@testing-library/react";
import type { Member } from "@/interfaces/member";
import type { Post } from "@/interfaces/post";
import { getAllMembers, getAllPosts } from "@/lib/api";
import Index, { metadata } from "../page";
import { makeMember, makePost } from "@/test-utils/fixtures";

jest.mock("@/lib/api", () => ({
  getAllPosts: jest.fn(),
  getAllMembers: jest.fn(),
}));

const posts: Post[] = [1, 2, 3, 4].map((n) =>
  makePost({
    slug: `post-${n}`,
    title: `Post ${n}`,
    date: `2026-0${5 - n}-01`, // newest first, as getAllPosts returns them
    excerpt: `Excerpt ${n}`,
  }),
);

const members: Member[] = [1, 2, 3, 4, 5].map((n) =>
  makeMember({ slug: `member-${n}`, order: n, name: `Member ${n}`, title: `Role ${n}` }),
);

/** Renders the async server component. */
async function renderHomepage() {
  render(await Index());
}

describe("Homepage", () => {
  beforeEach(() => {
    jest.mocked(getAllPosts).mockResolvedValue(posts);
    jest.mocked(getAllMembers).mockResolvedValue(members);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("loads the posts and the members", async () => {
    await renderHomepage();
    expect(getAllPosts).toHaveBeenCalledTimes(1);
    expect(getAllMembers).toHaveBeenCalledTimes(1);
  });

  test("has exactly one h1: the hero headline", async () => {
    await renderHomepage();
    const h1s = screen.getAllByRole("heading", { level: 1 });
    expect(h1s).toHaveLength(1);
    expect(h1s[0]).toHaveTextContent("Welcome to RSG Belgium");
    expect(screen.getByRole("link", { name: "Learn More About Us" })).toHaveAttribute(
      "href",
      "/about",
    );
  });

  test("features the three newest posts", async () => {
    await renderHomepage();
    const cards = screen.getAllByRole("article");
    expect(cards.map((card) => within(card).getByRole("link").textContent)).toEqual([
      "Post 1",
      "Post 2",
      "Post 3",
    ]);
  });

  test("spotlights the first four members", async () => {
    await renderHomepage();
    const team = screen
      .getByRole("heading", { level: 2, name: "Meet the Team" })
      .closest("section")!;
    expect(
      within(team)
        .getAllByRole("heading", { level: 3 })
        .map((h) => h.textContent),
    ).toEqual(["Member 1", "Member 2", "Member 3", "Member 4"]);
  });

  test("hides the news and team sections when there is no content", async () => {
    jest.mocked(getAllPosts).mockResolvedValue([]);
    jest.mocked(getAllMembers).mockResolvedValue([]);
    await renderHomepage();
    expect(screen.queryByRole("heading", { name: "Latest News" })).not.toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "Meet the Team" })).not.toBeInTheDocument();
  });

  test("sets its canonical URL", () => {
    expect(metadata.alternates?.canonical).toBe("/");
  });
});
