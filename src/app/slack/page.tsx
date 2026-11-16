/**
 * Slack invitation page for RSG-Belgium.
 *
 * Provides information and a call-to-action for joining the RSG-Belgium Slack channel.
 */

import React from "react";
import Container from "@/app/_components/container";
import Button from "@/components/Button"; // Path to the new Button component
import { Metadata } from "next";
import { PageHeader, SECTION_HEADING } from "@/app/_components/page-header";
import { pageAlternates } from "@/lib/metadata";
import { CONTACT_EMAIL } from "@/lib/social";

export const metadata: Metadata = {
  title: "Join Us on Slack",
  description:
    "Become a part of the RSG-Belgium community by joining our Slack channel. Request an invitation to discuss events, collaborate, and network with fellow bioinformaticians.",
  alternates: pageAlternates("/slack"),
};

/**
 * Renders the Slack invitation page with instructions and a mailto link.
 */
const SlackPage = () => {
  const mailtoLink = `mailto:${CONTACT_EMAIL}?Subject=RSG%20Slack%20Subscription&Body=I%20would%20like%20to%20join%20the%20RSG%20Belgium%20Slack%20channel%2E`;

  return (
    <Container>
      <PageHeader
        title="Slack"
        description="Join the RSG-Belgium Slack workspace to meet fellow students and researchers, hear about events first and get involved."
      />
      {/* A section heading under the page's <h1>, not a second page title. */}
      <div className="max-w-3xl pb-16 md:pb-24">
        <h2 className={`${SECTION_HEADING} mb-4`}>
          Join the RSG Belgium Slack Channel <span aria-hidden="true">💬</span>
        </h2>
        <p className="text-lg leading-relaxed mb-6">
          We have created a Slack channel where our members can get to know each other, discuss RSG
          events, collaborate, and get more involved in our organization. It&apos;s a great place to
          ask questions, share ideas, and connect with fellow bioinformatics and computational
          biology enthusiasts in Belgium.
        </p>
        <p className="text-lg leading-relaxed mb-8">
          Don&apos;t be shy, come say hello! To join, please send us an email request, and
          we&apos;ll send you an invitation.
        </p>
        <Button href={mailtoLink} size="lg" variant="primary">
          Request Invitation to Join Slack
        </Button>
      </div>
    </Container>
  );
};

export default SlackPage;
