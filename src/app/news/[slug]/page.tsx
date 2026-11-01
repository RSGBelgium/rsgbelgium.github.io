/**
 * Dynamic news post page for RSG-Belgium.
 *
 * Displays a single news post based on the provided slug parameter.
 */

import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPostBySlug, getPostSlugs } from "@/lib/api";
import markdownToHtml from "@/lib/markdownToHtml";
import Container from "@/app/_components/container";
import { PostBody } from "@/app/_components/post-body";
import PostHeader from "@/app/_components/post-header";
import { DEFAULT_AUTHOR, SITE_NAME } from "@/lib/constants";
import { DEFAULT_OG_IMAGE, pageAlternates } from "@/lib/metadata";

/**
 * Renders a single news post page based on the slug parameter.
 *
 * @param params - Promise resolving to route parameters containing the post slug.
 */
export default async function Post({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const post = await getPostBySlug(resolvedParams.slug);

  if (!post) {
    notFound();
  }

  const content = await markdownToHtml(post.content || "");

  return (
    <main>
      <Container>
        <article className="mb-32">
          <PostHeader
            title={post.title}
            coverImage={post.coverImage}
            date={post.date}
            author={post.author || DEFAULT_AUTHOR}
          />
          <PostBody content={content} />
        </article>
      </Container>
    </main>
  );
}

/**
 * Converts a post date to an ISO 8601 timestamp for `article:published_time`.
 *
 * @param date - The post's front-matter date string
 * @returns The ISO timestamp, or undefined when the date is missing or invalid
 */
function toIsoDate(date: string): string | undefined {
  const parsed = new Date(date);
  return Number.isNaN(parsed.getTime()) ? undefined : parsed.toISOString();
}

/**
 * Generates metadata for a single news post page.
 *
 * - The title goes through the root layout's template ("<post title> | RSG-Belgium").
 * - The description is the post's excerpt: the front-matter `excerpt`, or one
 *   generated from the body by the loader.
 * - Open Graph describes the post as an article. Because setting `openGraph`
 *   here replaces the layout's (including the default share image), the image
 *   is always given explicitly: the post's cover image, or the site default.
 *   Twitter/X cards copy title, description and image from Open Graph.
 *
 * @param params - Promise resolving to route parameters containing the post slug.
 * @returns Metadata for the post or a not found title.
 */
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const post = await getPostBySlug(resolvedParams.slug);

  if (!post) {
    return {
      title: "Page not found",
    };
  }

  const path = `/news/${post.slug}`;
  const description = post.excerpt || `${post.title}: news from ${SITE_NAME}.`;
  const publishedTime = toIsoDate(post.date);

  return {
    title: post.title,
    description,
    alternates: pageAlternates(path),
    openGraph: {
      type: "article",
      title: post.title,
      description,
      url: path,
      siteName: SITE_NAME,
      locale: "en_US",
      ...(publishedTime && { publishedTime }),
      images: post.coverImage
        ? [{ url: post.coverImage, alt: `Cover image for ${post.title}` }]
        : [DEFAULT_OG_IMAGE],
    },
  };
}

/**
 * Only the posts returned by generateStaticParams exist: any other slug is a 404.
 * Required for the static export, where nothing can be rendered on demand.
 */
export const dynamicParams = false;

/**
 * Generates static parameters for all news posts for static site generation.
 *
 * @returns Array of objects containing slugs for all posts.
 */
export async function generateStaticParams() {
  const slugs = await getPostSlugs();

  return slugs.map((slug) => ({
    slug,
  }));
}
