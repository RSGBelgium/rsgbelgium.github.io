/**
 * Site-wide "page not found" (404) page.
 *
 * Next.js renders it for unknown URLs and when a page calls notFound(). The
 * static export writes it to out/404.html, which GitHub Pages serves for
 * every URL that has no file.
 */

import type { Metadata } from "next";
import Container from "@/app/_components/container";
import { PageHeader } from "@/app/_components/page-header";
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
      <PageHeader
        eyebrow="Error 404"
        title="Page not found"
        description="Sorry, we couldn't find this page. It may have been moved, or the link may be out of date."
      />
      <div className="flex flex-wrap gap-4 pb-16 md:pb-24">
        <Button href="/" variant="primary">
          Go to the homepage
        </Button>
        <Button href="/news" variant="secondary">
          Read the latest news
        </Button>
      </div>
    </Container>
  );
}
