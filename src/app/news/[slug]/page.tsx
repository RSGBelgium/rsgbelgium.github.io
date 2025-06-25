/**
 * Dynamic news post page for RSG-Belgium.
 *
 * Displays a single news post based on the provided slug parameter.
 */

import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllPosts, getPostBySlug } from "@/lib/api";
import markdownToHtml from "@/lib/markdownToHtml";
import Alert from "@/app/_components/alert";
import Container from "@/app/_components/container";
import { PostBody } from "@/app/_components/post-body";
import PostHeader from "@/app/_components/post-header";
import { DEFAULT_AUTHOR } from "@/lib/constants";

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
      <Alert preview={post.preview} />
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
 * @param params - Promise resolving to route parameters containing the post slug.
 * @returns Metadata for the post or a not found title.
 */
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const post = await getPostBySlug(resolvedParams.slug);

  if (!post) {
    return {
      title: "Not Found",
    };
  }

  return {
    title: `${post.title} | RSG Belgium`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      ...(post.coverImage && {
        images: [
          {
            url: post.coverImage,
          },
        ],
      }),
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
      ...(post.coverImage && {
        images: [post.coverImage],
      }),
    },
  };
}

/**
 * Generates static parameters for all news posts for static site generation.
 *
 * @returns Array of objects containing slugs for all posts.
 */
export async function generateStaticParams() {
  const posts = await getAllPosts();

  return posts.map((post) => ({
    slug: post.slug,
  }));
}
