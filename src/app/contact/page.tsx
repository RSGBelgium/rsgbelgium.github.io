/**
 * Contact page for RSG-Belgium.
 *
 * Lists the ways to reach RSG-Belgium (e-mail, GitHub, Slack, LinkedIn) as
 * cards. The channels come from src/lib/social.ts, the same list as the
 * footer's, so the two never disagree.
 */

import { Metadata } from "next";
import Container from "@/app/_components/container";
import { PageHeader } from "@/app/_components/page-header";
import { ContactChannelLink, ContactIcon } from "@/components/ContactChannels";
import { pageAlternates } from "@/lib/metadata";
import { CONTACT_CHANNELS } from "@/lib/social";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Get in touch with RSG-Belgium by e-mail, on Slack, LinkedIn or GitHub.",
  alternates: pageAlternates("/contact"),
};

/**
 * Renders the Contact page: the page header (title and a short welcome) and
 * one card per channel.
 *
 * Each card has one link (the channel's descriptive link text). The link's
 * `after:` pseudo-element is stretched over the whole card, so the entire
 * card is clickable without nesting the heading and description inside the
 * link (`link-card` in globals.css); the card shows the focus outline when
 * the link is focused.
 */
export default function ContactPage() {
  return (
    <Container>
      <PageHeader
        title="Get in Touch"
        description="Have a question, an idea for an event, or want to collaborate? We'd love to hear from you. Pick whichever channel suits you best."
      />
      <div className="pb-16 md:pb-24">
        {/* grid-cols-1 (minmax(0, 1fr)) and overflow-wrap:anywhere on the link let a long link,
            such as the e-mail address, wrap on narrow phones instead of widening the page. */}
        <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {CONTACT_CHANNELS.map((channel) => (
            <li
              key={channel.id}
              className="link-card flex gap-4 rounded-lg border border-border bg-surface p-6 shadow-md transition-shadow hover:shadow-lg"
            >
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-highlight text-link">
                <ContactIcon id={channel.id} className="h-6 w-6" />
              </span>
              <div className="min-w-0">
                <h2 className="text-lg font-semibold text-foreground">{channel.label}</h2>
                <p className="mt-1 text-sm text-foreground-muted">{channel.description}</p>
                <ContactChannelLink
                  channel={channel}
                  className="link-card-link mt-3 inline-block [overflow-wrap:anywhere] font-medium text-link hover:underline after:rounded-lg"
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
