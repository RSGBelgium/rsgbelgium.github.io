/**
 * Featured news section component.
 *
 * Renders a grid of recent news posts with picture, title, date, excerpt, and link.
 *
 * Each card has exactly one link, the post title, stretched over the whole
 * card (a "stretched link"): keyboard and screen-reader users meet one link
 * per post instead of three (image, title, "Read more"), while the whole
 * card is still clickable (`link-card` in globals.css). The card shows the
 * focus outline when the link is focused.
 */

import React from "react";
import cn from "classnames";
import Image from "next/image";
import Link from "next/link";
import { Post } from "@/interfaces/post"; // Assuming Post interface exists
import Button from "./Button"; // Reusable button
import CardLogo from "@/app/_components/card-logo";
import Container from "@/app/_components/container";
import DateFormatter from "@/app/_components/date-formatter"; // Date formatter
import { cardImageOf } from "@/lib/card-image";
import { postPath } from "@/lib/urls";

interface FeaturedNewsProps {
  posts: Post[];
}

/** A card picture fades a little when the card is hovered. */
const HOVER_FADE = "group-hover:opacity-90 transition-opacity duration-200";

/**
 * A card's picture, in a full-width, 12rem-tall box: the post's card image
 * (see cardImageOf) or, for a post without one, the RSG-Belgium logo.
 *
 * Decorative: the title says what the post is about. The image fills the
 * box (cropped with object-cover), so next/image's `fill` mode needs no
 * intrinsic size; `sizes` matches the grid columns. The crop keeps the top
 * of the image (object-top), where a poster has its title, as the previews
 * on /news do.
 *
 * @param post - The post on the card
 */
function CardPicture({ post }: { post: Post }) {
  const image = cardImageOf(post);
  if (!image) return <CardLogo className={cn("h-48", HOVER_FADE)} />;
  return (
    <div className="relative h-48">
      <Image
        src={image.src}
        alt=""
        fill
        sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
        className={cn("object-cover object-top", HOVER_FADE)}
      />
    </div>
  );
}

/**
 * Displays a section of featured news posts.
 *
 * @param posts - Array of news post objects to display
 */
const FeaturedNews: React.FC<FeaturedNewsProps> = ({ posts }) => {
  if (!posts || posts.length === 0) {
    return null; // Or some placeholder if no news
  }

  return (
    <section className="py-16 md:py-24">
      <Container>
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-foreground">
          Latest News
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <article
              key={post.slug}
              className="link-card group bg-surface border border-border rounded-lg shadow-lg overflow-hidden flex flex-col transition-shadow hover:shadow-xl"
            >
              <CardPicture post={post} />
              <div className="p-6 flex-grow">
                <h3 className="text-xl font-semibold mb-2">
                  {/* The card's only link: .link-card-link stretches it over the whole card. */}
                  <Link
                    href={postPath(post.slug)}
                    className="link-card-link text-link hover:underline"
                  >
                    {post.title}
                  </Link>
                </h3>
                <div className="text-sm text-foreground-muted mb-3">
                  <DateFormatter dateString={post.date} />
                </div>
                {post.excerpt && (
                  <p className="text-foreground leading-relaxed mb-4 text-sm">{post.excerpt}</p>
                )}
              </div>
              {/* A visual cue only: the title link above already leads to the post. */}
              <div className="p-6 pt-0" aria-hidden="true">
                <span className="text-link group-hover:underline font-medium text-sm">
                  Read more &rarr;
                </span>
              </div>
            </article>
          ))}
        </div>
        <div className="text-center mt-12">
          <Button href="/news" variant="secondary">
            View All News
          </Button>
        </div>
      </Container>
    </section>
  );
};

export default FeaturedNews;
