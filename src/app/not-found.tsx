/**
 * Site-wide "page not found" (404) page.
 *
 * Next.js renders it for unknown URLs and when a page calls notFound(). The
 * static export writes it to out/404.html, which GitHub Pages serves for
 * every URL that has no file.
 */

import type { Metadata } from "next";
import Container from "@/app/_components/container";
import Button from "@/components/Button";

export const metadata: Metadata = {
  title: "Page not found",
};

/**
 * Renders a friendly 404 message with links back to the homepage and the news.
 */
export default function NotFound() {
  return (
    <Container>
      <div className="py-24 text-center">
        <p className="text-sm font-semibold uppercase tracking-wide text-accent-strong">
          Error 404
        </p>
        <h1 className="mt-2 text-4xl md:text-6xl font-bold tracking-tighter leading-tight">
          Page not found
        </h1>
        <p className="mt-6 text-lg leading-relaxed max-w-xl mx-auto">
          Sorry, we couldn&apos;t find this page. It may have been moved, or the link may be out of date.
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <Button href="/" variant="primary">
            Go to the homepage
          </Button>
          <Button href="/news" variant="secondary">
            Read the latest news
          </Button>
        </div>
      </div>
    </Container>
  );
}
