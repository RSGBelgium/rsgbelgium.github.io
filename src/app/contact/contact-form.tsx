/**
 * Main contact form component for RSG-Belgium.
 *
 * Provides a form for users to send messages, with validation and feedback.
 * Also lists alternative contact methods.
 */

"use client";

import React from 'react';
import Container from '@/app/_components/container';
import Link from 'next/link';

/**
 * Renders the contact form and handles submission, validation, and feedback.
 */
export default function ContactForm() {
  return (
    <div>
      <Container>
        <div className="py-12 md:py-20">
          <h1 className="text-3xl md:text-4xl font-bold text-center mb-4 text-foreground">
            Get in Touch
          </h1>
          <p className="text-lg text-foreground-muted text-center mb-10 max-w-xl mx-auto">
            Have a question, suggestion, or want to collaborate? We'd love to hear from you!<br />
            <span className="font-semibold">This site is now static. Please contact us directly via email or social media below.</span>
          </p>

          <div className="max-w-lg mx-auto bg-surface border border-border p-8 rounded-lg shadow-md text-center">
            <p className="mb-4 text-lg">Email: <a href="mailto:iscb.rsg.belgium@gmail.com" className="text-link hover:underline">iscb.rsg.belgium@gmail.com</a></p>
            <p className="mb-4 text-lg">Twitter: <a href="https://twitter.com/rsgbelgium" target="_blank" rel="noopener noreferrer" className="text-link hover:underline">@rsgbelgium</a></p>
            <p className="mb-4 text-lg">Facebook: <a href="https://www.facebook.com/RSGBelgium" target="_blank" rel="noopener noreferrer" className="text-link hover:underline">RSGBelgium</a></p>
            <p className="mb-4 text-lg">Or join our <Link href="/slack" className="text-link hover:underline">Slack channel</Link>.</p>
          </div>
        </div>
      </Container>
    </div>
  );
}