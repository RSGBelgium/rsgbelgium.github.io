/**
 * Section for displaying additional post previews ("More Stories").
 *
 * Renders a grid of PostPreview cards for a list of posts.
 */

import { Post } from "@/interfaces/post";
import { SECTION_HEADING } from "./page-header";
import { PostPreview } from "./post-preview";

type Props = {
  posts: Post[];
};

/**
 * Displays a section of additional post previews.
 *
 * @param posts - Array of post objects to preview
 */
export function MoreStories({ posts }: Props) {
  return (
    <section>
      <h2 className={`${SECTION_HEADING} mb-6 md:mb-8`}>More Stories</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-10 md:gap-y-12 pb-16 md:pb-24">
        {posts.map((post) => (
          <PostPreview
            key={post.slug}
            title={post.title}
            coverImage={post.coverImage}
            coverImageSize={post.coverImageSize}
            date={post.date}
            author={post.author}
            slug={post.slug}
            excerpt={post.excerpt}
          />
        ))}
      </div>
    </section>
  );
}
