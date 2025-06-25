/**
 * Featured news section component.
 *
 * Renders a grid of recent news posts with title, date, excerpt, and link.
 */

import React from 'react';
import Link from 'next/link';
import { Post } from '@/interfaces/post'; // Assuming Post interface exists
import Button from './Button'; // Reusable button
import DateFormatter from '@/app/_components/date-formatter'; // Date formatter

interface FeaturedNewsProps {
  posts: Post[];
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
    <section className="bg-white dark:bg-slate-900 py-16 md:py-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-800 dark:text-lightblue">
          Latest News
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <div key={post.slug} className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col">
              {post.coverImage && (
                <Link href={`/news/${post.slug}`} className="block">
                  {/* Simplified image display, next/image could be used here too */}
                  <img
                    src={post.coverImage.startsWith('/') ? post.coverImage : `/assets/blog/${post.slug}/${post.coverImage}`}
                    alt={post.title}
                    className="w-full h-48 object-cover hover:opacity-90 transition-opacity duration-200"
                  />
                </Link>
              )}
              <div className="p-6 flex-grow">
                <h3 className="text-xl font-semibold mb-2">
                  <Link href={`/news/${post.slug}`} className="hover:text-blue-600 transition-colors duration-200">
                    {post.title}
                  </Link>
                </h3>
                <div className="text-sm text-gray-500 mb-3">
                  <DateFormatter dateString={post.date} />
                </div>
                <p className="text-gray-700 leading-relaxed mb-4 text-sm">
                  {post.excerpt}
                </p>
              </div>
              <div className="p-6 pt-0">
                 <Link href={`/news/${post.slug}`} className="text-primary hover:text-secondary font-medium text-sm">
                    Read more &rarr;
                  </Link>
              </div>
            </div>
          ))}
        </div>
        <div className="text-center mt-12">
          <Button href="/news" variant="secondary">
            View All News
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedNews;
