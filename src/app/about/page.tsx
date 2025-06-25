/**
 * About page for RSG-Belgium.
 *
 * Provides information about the organization's mission, values, and events.
 * Includes a call-to-action for joining the community.
 */

import React from 'react';
import Container from '@/app/_components/container';
import Button from '@/components/Button'; // Path to the new Button component
import { Metadata } from 'next';
import { Intro } from '@/app/_components/intro'; // Assuming an Intro component exists

export const metadata: Metadata = {
  title: 'About RSG-Belgium | Our Mission, Values, and Events',
  description: 'Discover RSG-Belgium: our mission to unite bioinformatics students, our core values, and the variety of events like symposia, hackathons, and Beerformatics we organize.',
};

/**
 * Renders the About page with mission, values, events, and join CTA.
 */
const AboutPage = () => {
  return (
    <main>
      <Container>
        <Intro
          title="About"
          description="Learn more about RSG-Belgium and our mission to support the bioinformatics community."
        />
        <article className="prose lg:prose-xl max-w-none mx-auto py-8">
          <h1 className="text-4xl font-bold mb-6 text-center">Welcome to RSG Belgium!</h1>
          <p className="text-lg leading-relaxed">
            RSG Belgium is the Belgian branch of the ISCB Student Council's Regional Student Groups.
            We are a vibrant community dedicated to fostering collaboration and innovation among
            bioinformatics and computational biology students across Belgium.
          </p>

          <h2 className="text-3xl font-semibold mt-8 mb-4">Our Mission</h2>
          <p className="text-lg leading-relaxed">
            Our mission is to bring bioinformatics and computational biology students from different
            institutions together and offer them additional opportunities which can contribute to
            the development of their scientific career. We aim to stimulate interaction and
            co-operativity between students, connect them with international research, and provide
            insights into how their work can benefit industry. Ultimately, we hope to encourage
            projects that transcend traditional academic research boundaries.
          </p>

          <h2 className="text-3xl font-semibold mt-8 mb-4">Our Values</h2>
          <ul className="list-disc list-inside text-lg leading-relaxed space-y-2">
            <li>Stimulate interaction and co-operativity between students of different research institutions.</li>
            <li>Bring students in contact with research happening at an international level to allow them to visualize their work in a much larger scope.</li>
            <li>Provide concrete examples of how their work might benefit the industry.</li>
          </ul>
          <p className="text-lg leading-relaxed mt-2">
            In this way, we aim to stimulate the startup of projects that cross the traditional boundaries of academic research.
          </p>

          <h2 className="text-3xl font-semibold mt-8 mb-4">Our Events</h2>
          <p className="text-lg leading-relaxed">
            We organize a variety of events throughout the year to achieve our mission, including:
          </p>
          <ul className="list-disc list-inside text-lg leading-relaxed space-y-2">
            <li>
              <strong>Symposia:</strong> Our yearly symposia allow young researchers to present their work,
              either as a talk or as a poster, and to connect with other researchers.
            </li>
            <li>
              <strong>Hackathons:</strong> One-day competitions where bioinformaticians across Belgium
              join to tackle exciting challenges in teams.
            </li>
            <li>
              <strong>Beerformatics:</strong> Informal events with short talks by inspiring people in
              bioinformatics, designed to foster social networking.
            </li>
          </ul>

          <div className="mt-12 text-center">
            <h2 className="text-2xl font-semibold mb-4">Interested in Joining Us?</h2>
            <p className="text-lg mb-6">
              Connect with our community and stay updated on our activities!
            </p>
            <Button href="/slack" size="lg" variant="primary">
              Join us on Slack
            </Button>
            {/* You could add more CTAs here, e.g., a link to a /contact page if it exists */}
            {/* <Button href="/contact" size="lg" variant="secondary" className="ml-4">
              Contact Us
            </Button> */}
          </div>
        </article>
      </Container>
    </main>
  );
};

export default AboutPage;
