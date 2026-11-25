/**
 * Homepage entry point for the RSG-Belgium website.
 *
 * Fetches and displays the hero section, featured news, an invitation to
 * sponsor our events, and team spotlight.
 * Uses server components and async data fetching with the App Router.
 * Exports page-level metadata for SEO.
 */

import { getAllPosts, getAllMembers } from "@/lib/api";
import HeroSection from "@/components/HeroSection";
import FeaturedNews from "@/components/FeaturedNews";
import SponsorCallout from "@/components/SponsorCallout";
import TeamSpotlight from "@/components/TeamSpotlight";
import { Metadata } from "next";
import { pageAlternates } from "@/lib/metadata";

// The title is the layout's default title; the share image is the site-wide default.
export const metadata: Metadata = {
  description:
    "Homepage of RSG-Belgium, the student society for computational biology and bioinformatics in Belgium. Discover news, events, meet our team, and learn how to get involved.",
  alternates: pageAlternates("/"),
};

/**
 * Fetches homepage data: latest news and spotlight team members.
 *
 * @returns An object with latestNews (array) and spotlightMembers (array)
 */
async function getHomepageData() {
  const allPosts = await getAllPosts(); // Already sorts by date desc in api.ts
  const latestNews = allPosts.slice(0, 3);

  // Already sorted by `order` (president and officers first), then by name.
  const allMembers = await getAllMembers();
  const spotlightMembers = allMembers.slice(0, 4);

  return { latestNews, spotlightMembers };
}

/**
 * The main homepage component.
 *
 * @returns The homepage layout with hero, news, sponsor, and team sections.
 */
export default async function Index() {
  const { latestNews, spotlightMembers } = await getHomepageData();

  return (
    // A fragment, not <main>: the root layout already wraps every page in the <main> landmark.
    <>
      <HeroSection
        headline="Welcome to RSG Belgium"
        introText="Your hub for bioinformatics and computational biology students in Belgium. We connect, share, and grow together through workshops, symposia, and networking events."
        ctaLabel="Learn More About Us"
        ctaLink="/about"
      />

      {/* These sections could be wrapped in <Container> if they don't have full-width backgrounds */}
      {/* Or Container can be used inside them as done in the component definitions */}
      <FeaturedNews posts={latestNews} />

      {/* After the news, which are mostly event announcements: the events to sponsor. */}
      <SponsorCallout />

      <TeamSpotlight members={spotlightMembers} />
    </>
  );
}
