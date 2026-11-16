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
import { DEFAULT_AUTHOR } from "@/lib/constants";
import { BASE_OPEN_GRAPH, DEFAULT_OG_IMAGE, pageAlternates, postDescription } from "@/lib/metadata";
import { parseDate } from "@/lib/dates";
import { postPath } from "@/lib/urls";

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

  const path = postPath(post.slug);
  const description = postDescription(post);
  // `article:published_time` is an ISO 8601 timestamp.
  const publishedTime = parseDate(post.date)?.toISOString();

  return {
    title: post.title,
    description,
    alternates: pageAlternates(path),
    openGraph: {
      type: "article",
      title: post.title,
      description,
      url: path,
      ...BASE_OPEN_GRAPH,
      ...(publishedTime && { publishedTime }),
      images: post.coverImage
        ? [{ url: post.coverImage, alt: `Cover image for ${post.title}` }]
        : [DEFAULT_OG_IMAGE],
    },
  };
}

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
