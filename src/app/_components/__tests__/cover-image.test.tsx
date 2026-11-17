import { render, screen } from "@testing-library/react";
import CoverImage from "../cover-image";

describe("CoverImage", () => {
  test("uses the image's own width and height, so its space is reserved before it loads", () => {
    render(
      <CoverImage
        title="BioHackathon"
        src="/images/poster/biohackathon.jpg"
        size={{ width: 1131, height: 1600 }}
      />,
    );
    const image = screen.getByRole("img", { name: "Cover image for BioHackathon" });
    expect(image).toHaveAttribute("width", "1131");
    expect(image).toHaveAttribute("height", "1600");
    // As wide as the column, with the height following the image's proportions.
    expect(image).toHaveClass("w-full", "h-auto");
    // Not preloaded: only the home page's logo is.
    expect(image).toHaveAttribute("loading", "lazy");
  });

  test("falls back to 1300 x 630 when the size is unknown", () => {
    render(<CoverImage title="External" src="https://example.org/cover.png" />);
    const image = screen.getByRole("img", { name: "Cover image for External" });
    expect(image).toHaveAttribute("width", "1300");
    expect(image).toHaveAttribute("height", "630");
  });

  test("links to the post with a decorative image, hidden from keyboard and screen readers", () => {
    const { container } = render(
      <CoverImage
        title="Post"
        src="/images/poster/a.webp"
        size={{ width: 1200, height: 1200 }}
        slug="2026-01-01-post"
      />,
    );
    const link = container.querySelector("a");
    expect(link).toHaveAttribute("href", "/news/2026-01-01-post");
    expect(link).toHaveAttribute("aria-hidden", "true");
    expect(link).toHaveAttribute("tabindex", "-1");
    expect(container.querySelector("img")).toHaveAttribute("alt", "");
  });

  test("crops the image to the given shape, keeping its top, for previews", () => {
    const { container } = render(
      <CoverImage
        title="Poster"
        src="/images/poster/a.webp"
        size={{ width: 1131, height: 1600 }}
        slug="2026-01-01-post"
        crop="aspect-video"
      />,
    );
    expect(container.querySelector("img")).toHaveClass(
      "w-full",
      "aspect-video",
      "object-cover",
      "object-top",
    );
  });

  test("shows the whole image when not cropped", () => {
    render(<CoverImage title="Poster" src="/images/poster/a.webp" />);
    expect(screen.getByRole("img")).not.toHaveClass("object-cover");
  });

  test("uncropped, is centred and neither wider than the image nor taller than 60% of the screen", () => {
    render(
      <CoverImage
        title="Poster"
        src="/images/poster/a.webp"
        size={{ width: 1131, height: 1600 }}
      />,
    );
    const image = screen.getByRole("img");
    expect(image).toHaveClass("block", "mx-auto");
    expect(image.style.maxWidth).toBe("min(1131px, 60svh * 1131 / 1600)");
  });

  test("cropped, has no maximum width: it fills its column", () => {
    const { container } = render(
      <CoverImage
        title="Poster"
        src="/images/poster/a.webp"
        size={{ width: 1131, height: 1600 }}
        slug="2026-01-01-post"
        crop="aspect-video"
      />,
    );
    expect(container.querySelector("img")?.style.maxWidth).toBe("");
  });

  test("renders nothing without an image", () => {
    const { container } = render(<CoverImage title="No image" />);
    expect(container).toBeEmptyDOMElement();
  });
});
