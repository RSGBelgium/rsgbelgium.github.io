import { render, screen, within } from "@testing-library/react";
import type { Post } from "@/interfaces/post";
import FeaturedNews from "../FeaturedNews";
import { makePost } from "@/test-utils/fixtures";

/** The original path of an image rendered by next/image (Jest uses the default image loader). */
function originalSrc(image: HTMLElement): string | null {
  return new URL(image.getAttribute("src") ?? "", "http://localhost").searchParams.get("url");
}

const posts: Post[] = [
  makePost({
    slug: "news-1",
    title: "First news article",
    date: "2023-10-01",
    coverImage: "/images/poster/news1.jpg",
    excerpt: "This is the excerpt for the first news.",
  }),
  makePost({
    slug: "news-2",
    title: "Second news article",
    date: "2023-10-02",
    coverImage: "cover.jpg",
    excerpt: "Excerpt for the second article.",
  }),
  makePost({ slug: "news-3", title: "Third news article without image", date: "2023-10-03" }),
];

describe("FeaturedNews", () => {
  test("renders the section heading", () => {
    render(<FeaturedNews posts={posts} />);
    expect(screen.getByRole("heading", { level: 2, name: "Latest News" })).toBeInTheDocument();
  });

  test("renders one card per post with its title as the only link", () => {
    render(<FeaturedNews posts={posts} />);
    const cards = screen.getAllByRole("article");
    expect(cards).toHaveLength(posts.length);

    cards.forEach((card, index) => {
      const links = within(card).getAllByRole("link");
      expect(links).toHaveLength(1);
      expect(links[0]).toHaveAccessibleName(posts[index].title);
      expect(links[0]).toHaveAttribute("href", `/news/${posts[index].slug}`);
      expect(within(card).getByRole("heading", { level: 3 })).toHaveTextContent(posts[index].title);
    });
  });

  test("shows the formatted date and the excerpt", () => {
    render(<FeaturedNews posts={posts} />);
    expect(screen.getByText("October 1, 2023")).toHaveAttribute("dateTime", "2023-10-01");
    expect(screen.getByText(posts[0].excerpt!)).toBeInTheDocument();
  });

  test("hides the 'Read more' cue from screen readers", () => {
    render(<FeaturedNews posts={posts} />);
    const cues = screen.getAllByText(/Read more/);
    expect(cues).toHaveLength(posts.length);
    for (const cue of cues) {
      expect(cue.closest('[aria-hidden="true"]')).not.toBeNull();
      expect(cue.closest("a")).toBeNull();
    }
  });

  test("shows cover images as decorative images", () => {
    const { container } = render(<FeaturedNews posts={posts} />);
    // Decorative images (alt="") have no img role, so query the DOM directly.
    const images = container.querySelectorAll("img");
    // A bare file name ("cover.jpg") is not a site path: that card has no image.
    expect(images).toHaveLength(1);
    expect(images[0]).toHaveAttribute("alt", "");
    expect(originalSrc(images[0])).toBe("/images/poster/news1.jpg");
  });

  test("links to all news", () => {
    render(<FeaturedNews posts={posts} />);
    expect(screen.getByRole("link", { name: "View All News" })).toHaveAttribute("href", "/news");
  });

  test("renders nothing without posts", () => {
    const { container } = render(<FeaturedNews posts={[]} />);
    expect(container).toBeEmptyDOMElement();
  });
});
