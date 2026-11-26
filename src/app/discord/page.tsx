/**
 * Discord page for RSG-Belgium.
 *
 * Provides information and a call-to-action for joining the RSG-Belgium Discord
 * server. The header, the footer and the Contact page link here; the invite
 * itself is DISCORD_INVITE_URL in src/lib/social.ts, so a new invite link is
 * one change there.
 */

import React from "react";
import Container from "@/app/_components/container";
import Button from "@/components/Button"; // Path to the new Button component
import { Metadata } from "next";
import { PageHeader, SECTION_HEADING } from "@/app/_components/page-header";
import { pageAlternates } from "@/lib/metadata";
import { DISCORD_INVITE_URL } from "@/lib/social";

export const metadata: Metadata = {
  title: "Join Us on Discord",
  description:
    "Become a part of the RSG-Belgium community by joining our Discord server. Discuss events, collaborate, and network with fellow bioinformaticians.",
  alternates: pageAlternates("/discord"),
};

/**
 * Renders the Discord page with a short introduction and the invite link.
 */
const DiscordPage = () => {
  return (
    <Container>
      <PageHeader
        title="Discord"
        description="Join the RSG-Belgium Discord server to meet fellow students and researchers, hear about events first and get involved."
      />
      {/* A section heading under the page's <h1>, not a second page title. */}
      <div className="max-w-3xl pb-16 md:pb-24">
        <h2 className={`${SECTION_HEADING} mb-4`}>
          Join the RSG Belgium Discord Server <span aria-hidden="true">💬</span>
        </h2>
        <p className="text-lg leading-relaxed mb-6">
          We have created a Discord server where our members can get to know each other, discuss RSG
          events, collaborate, and get more involved in our organization. It&apos;s a great place to
          ask questions, share ideas, and connect with fellow bioinformatics and computational
          biology enthusiasts in Belgium.
        </p>
        <p className="text-lg leading-relaxed mb-8">
          Don&apos;t be shy, come say hello! Everyone is welcome: the invite below takes you
          straight to the server.
        </p>
        <Button href={DISCORD_INVITE_URL} size="lg" variant="primary">
          Join Our Discord Server
        </Button>
      </div>
    </Container>
  );
};

export default DiscordPage;
