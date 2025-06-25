/**
 * Homepage entry point for the RSG-Belgium website.
 *
 * Fetches and displays the hero section, featured news, and team spotlight.
 * Uses server components and async data fetching with the App Router.
 * Exports page-level metadata for SEO.
 */

import { getAllPosts, getAllMembers } from "@/lib/api"; // Import getAllMembers
import HeroSection from "@/components/HeroSection";
import FeaturedNews from "@/components/FeaturedNews";
import TeamSpotlight from "@/components/TeamSpotlight";
import Container from "@/app/_components/container"; // Keep container if sections don't have their own full-width bg
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'RSG-Belgium | Bioinformatics & Computational Biology Student Society', // Slight change for consistency
  description: 'Homepage of RSG-Belgium, the student society for computational biology and bioinformatics in Belgium. Discover news, events, meet our team, and learn how to get involved.',
  // Add more metadata like openGraph images if desired
};

/**
 * Fetches homepage data: latest news and spotlight team members.
 *
 * @returns An object with latestNews (array) and spotlightMembers (array)
 */
async function getHomepageData() {
  const allPosts = await getAllPosts(); // Already sorts by date desc in api.ts
  const latestNews = allPosts.slice(0, 3);

  const allMembers = await getAllMembers();
  // Sort members if necessary, e.g., by a specific order field or just take first few
  const spotlightMembers = allMembers.slice(0, 4); // Take first 4 members

  return { latestNews, spotlightMembers };
}

/**
 * The main homepage component.
 *
 * @returns The homepage layout with hero, news, and team sections.
 */
export default async function Index() {
  const { latestNews, spotlightMembers } = await getHomepageData();

  return (
    <main className="flex flex-col min-h-screen">
      <HeroSection
        headline="Welcome to RSG Belgium"
        introText="Your hub for bioinformatics and computational biology students in Belgium. We connect, share, and grow together through workshops, symposia, and networking events."
        ctaLabel="Learn More About Us"
        ctaLink="/about"
      />

      {/* These sections could be wrapped in <Container> if they don't have full-width backgrounds */}
      {/* Or Container can be used inside them as done in the component definitions */}
      <FeaturedNews posts={latestNews} />

      <TeamSpotlight members={spotlightMembers} />

      {/* You might want a footer component here eventually */}
      {/* <Footer /> */}
    </main>
  );
}
