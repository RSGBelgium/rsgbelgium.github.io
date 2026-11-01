/**
 * Contact page for RSG-Belgium.
 *
 * Lists the ways to reach RSG-Belgium (e-mail, GitHub, Slack, LinkedIn) as
 * cards. The channels come from src/lib/social.ts, the same list as the
 * footer's, so the two never disagree.
 */

import { Metadata } from 'next';
import Container from '@/app/_components/container';
import { ContactChannelLink, ContactIcon } from '@/components/ContactChannels';
import { pageAlternates } from '@/lib/metadata';
import { CONTACT_CHANNELS } from '@/lib/social';

export const metadata: Metadata = {
  title: 'Contact Us',
  description: 'Get in touch with RSG-Belgium by e-mail, on Slack, LinkedIn or GitHub.',
  alternates: pageAlternates('/contact'),
};

/**
 * Renders the Contact page: a heading, a short welcome and one card per channel.
 *
 * Each card has one link (the channel's descriptive link text). The link's
 * `after:` pseudo-element is stretched over the whole card, so the entire
 * card is clickable without nesting the heading and description inside the
 * link; the card shows the focus ring when the link is focused.
 */
export default function ContactPage() {
  return (
    <Container>
      <div className="py-12 md:py-20">
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-4 text-foreground">
          Get in Touch
        </h1>
        <p className="text-lg text-foreground-muted text-center mb-10 max-w-xl mx-auto">
          Have a question, an idea for an event, or want to collaborate? We&apos;d love to hear
          from you. Pick whichever channel suits you best.
        </p>

        <ul className="grid gap-6 sm:grid-cols-2 max-w-3xl mx-auto">
          {CONTACT_CHANNELS.map((channel) => (
            <li
              key={channel.id}
              className="relative flex gap-4 rounded-lg border border-border bg-surface p-6 shadow-md transition-shadow hover:shadow-lg has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-accent-strong has-[:focus-visible]:ring-offset-2 has-[:focus-visible]:ring-offset-background"
            >
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-highlight text-link">
                <ContactIcon id={channel.id} className="h-6 w-6" />
              </span>
              <div className="min-w-0">
                <h2 className="text-lg font-semibold text-foreground">{channel.label}</h2>
                <p className="mt-1 text-sm text-foreground-muted">{channel.description}</p>
                <ContactChannelLink
                  channel={channel}
                  className="mt-3 inline-block break-words font-medium text-link hover:underline focus:outline-none focus-visible:underline after:absolute after:inset-0 after:rounded-lg"
                >
                  {channel.linkText}
                </ContactChannelLink>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </Container>
  );
}
