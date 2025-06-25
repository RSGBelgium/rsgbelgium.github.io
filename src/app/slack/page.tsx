/**
 * Slack invitation page for RSG-Belgium.
 *
 * Provides information and a call-to-action for joining the RSG-Belgium Slack channel.
 */

import React from 'react';
import Container from '@/app/_components/container';
import Button from '@/components/Button'; // Path to the new Button component
import { Metadata } from 'next';
import { Intro } from '@/app/_components/intro'; // Assuming an Intro component exists

export const metadata: Metadata = {
  title: 'Join RSG-Belgium on Slack | Connect with the Community',
  description: 'Become a part of the RSG-Belgium community by joining our Slack channel. Request an invitation to discuss events, collaborate, and network with fellow bioinformaticians.',
};

/**
 * Renders the Slack invitation page with instructions and a mailto link.
 */
const SlackPage = () => {
  const mailtoLink = "mailto:iscb.rsg.belgium@gmail.com?Subject=RSG%20Slack%20Subscription&Body=I%20would%20like%20to%20join%20the%20RSG%20Belgium%20Slack%20channel%2E";

  return (
    <main>
      <Container>
        <Intro /> {/* Optional: Or a more specific header for the Slack page */}
        <div className="py-12 text-center">
          <h1 className="text-4xl font-bold mb-6">
            Join the RSG Belgium Slack Channel <span role="img" aria-label="speech bubble">💬</span>
          </h1>
          <p className="text-lg leading-relaxed mb-8 max-w-2xl mx-auto">
            We have created a Slack channel where our members can get to know each other,
            discuss RSG events, collaborate, and get more involved in our organization.
            It's a great place to ask questions, share ideas, and connect with fellow
            bioinformatics and computational biology enthusiasts in Belgium.
          </p>
          <p className="text-lg leading-relaxed mb-10 max-w-2xl mx-auto">
            Don't be shy, come say hello! To join, please send us an email request,
            and we'll send you an invitation.
          </p>
          <Button href={mailtoLink} size="lg" variant="primary">
            Request Invitation to Join Slack
          </Button>
        </div>
      </Container>
    </main>
  );
};

export default SlackPage;
