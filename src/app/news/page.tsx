/**
 * News listing page for RSG-Belgium.
 *
 * Displays the latest news, events, and announcements.
 */

import { Metadata } from 'next';
import Container from "@/app/_components/container";
import { Intro } from "@/app/_components/intro";
import { getAllPosts } from "@/lib/api";
import { MoreStories } from "@/app/_components/more-stories";
import { HeroPost } from "@/app/_components/hero-post";
import { DEFAULT_AUTHOR } from "@/lib/constants";

export const metadata: Metadata = {
  title: 'News | RSG Belgium',
  description: 'Stay updated with the latest news, events, and announcements from RSG Belgium.',
};

/**
 * Renders the News page with a list of posts and featured content.
 */
export default async function NewsPage() {
  const allPosts = await getAllPosts();
  const heroPost = allPosts[0];
  const morePosts = allPosts.slice(1);

  return (
    <main>
      <Container>
        <Intro />
        {heroPost && (
          <HeroPost
            title={heroPost.title}
            coverImage={heroPost.coverImage}
            date={heroPost.date}
            author={heroPost.author || DEFAULT_AUTHOR}
            slug={heroPost.slug}
            excerpt={heroPost.excerpt}
          />
        )}
        {morePosts.length > 0 && <MoreStories posts={morePosts} />}
      </Container>
    </main>
  );
}
