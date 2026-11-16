import { render, screen } from "@testing-library/react";
import { notFound } from "next/navigation";
import type { Post } from "@/interfaces/post";
import { getPostBySlug, getPostSlugs } from "@/lib/api";
import PostPage, { dynamicParams, generateMetadata, generateStaticParams } from "../page";

jest.mock("@/lib/api", () => ({
  getPostBySlug: jest.fn(),
  getPostSlugs: jest.fn(),
}));

jest.mock("next/navigation", () => ({
  notFound: jest.fn(() => {
    throw new Error("NEXT_NOT_FOUND");
  }),
}));

const post: Post = {
  slug: "2026-05-15-speakers",
  title: "Meet the speakers",
  date: "2026-05-15",
  excerpt: "Three talks in Ghent.",
  content: "# Programme\n\nSee the [venue](https://example.org).",
  category: "news",
};

const params = (slug: string) => ({ params: Promise.resolve({ slug }) });

describe("News post page", () => {
  beforeEach(() => {
    jest
      .mocked(getPostBySlug)
      .mockImplementation(async (slug) => (slug === post.slug ? post : null));
  });

  test("renders the title as the only h1 and the markdown body below it", async () => {
    render(await PostPage(params(post.slug)));
    const h1s = screen.getAllByRole("heading", { level: 1 });
    expect(h1s).toHaveLength(1);
    expect(h1s[0]).toHaveTextContent("Meet the speakers");
    // The body's "# Programme" is demoted to h2.
    expect(screen.getByRole("heading", { level: 2, name: "Programme" })).toHaveAttribute(
      "id",
      "programme",
    );
    expect(screen.getByRole("link", { name: "venue" })).toHaveAttribute("target", "_blank");
    expect(screen.getByText("May 15, 2026")).toBeInTheDocument();
  });

  test("calls notFound() for an unknown slug", async () => {
    await expect(PostPage(params("missing"))).rejects.toThrow("NEXT_NOT_FOUND");
    expect(notFound).toHaveBeenCalled();
  });

  test("builds metadata from the post, with the default share image", async () => {
    const metadata = await generateMetadata(params(post.slug));
    expect(metadata.title).toBe("Meet the speakers");
    expect(metadata.description).toBe("Three talks in Ghent.");
    expect(metadata.alternates?.canonical).toBe("/news/2026-05-15-speakers");
    expect(metadata.openGraph).toMatchObject({
      type: "article",
      url: "/news/2026-05-15-speakers",
      publishedTime: "2026-05-15T00:00:00.000Z",
      images: [expect.objectContaining({ url: "/opengraph-image.png", width: 1200, height: 630 })],
    });
  });

  test("uses the cover image as share image when there is one", async () => {
    jest
      .mocked(getPostBySlug)
      .mockResolvedValue({ ...post, coverImage: "/images/poster/speakers.png", date: "" });
    const metadata = await generateMetadata(params(post.slug));
    expect(metadata.openGraph).toMatchObject({
      images: [{ url: "/images/poster/speakers.png", alt: "Cover image for Meet the speakers" }],
    });
    expect(metadata.openGraph).not.toHaveProperty("publishedTime");
  });

  test("titles unknown posts as not found", async () => {
    await expect(generateMetadata(params("missing"))).resolves.toEqual({ title: "Page not found" });
  });

  test("builds every post and nothing else", async () => {
    jest.mocked(getPostSlugs).mockResolvedValue(["2026-05-15-speakers", "challenge_track1"]);
    await expect(generateStaticParams()).resolves.toEqual([
      { slug: "2026-05-15-speakers" },
      { slug: "challenge_track1" },
    ]);
    expect(dynamicParams).toBe(false);
  });
});
