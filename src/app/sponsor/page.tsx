/**
 * Sponsor page for RSG-Belgium.
 *
 * Presents our sponsorship proposals, one card per event, and how to get in
 * touch. Each proposal is a PDF in public/assets/pdf/, published as its
 * authors designed it; the facts on its card come from it, so update the two
 * together. The homepage (src/components/SponsorCallout.tsx) and the footer
 * link here; the header doesn't.
 *
 * Each card has one link, its PDF, stretched over the whole card
 * (`link-card` in globals.css, as on the Contact page). It is a plain `<a>`,
 * not next/link: a PDF is a file, not a page of the site. Its text says that
 * it is a PDF and how big it is; the size is read from the file when the
 * site is built.
 */

import type { Metadata } from "next";
import Container from "@/app/_components/container";
import { EYEBROW, PageHeader, SECTION_HEADING } from "@/app/_components/page-header";
import { breakBeforeAt } from "@/components/ContactChannels";
import { formatFileSize, readPublicFileSize } from "@/lib/file-size";
import { pageAlternates } from "@/lib/metadata";
import { SPONSOR_PAGE } from "@/lib/navigation";
import { CONTACT_EMAIL } from "@/lib/social";

export const metadata: Metadata = {
  title: "Sponsor Our Events",
  description:
    "Sponsor the XAI x Bio Symposium or our Beerformatics series and meet bioinformatics and computational biology students and young researchers in Belgium.",
  alternates: pageAlternates(SPONSOR_PAGE.url),
};

/** An event that sponsors can support, and its sponsorship proposal. */
type Proposal = {
  /** The kind of event, shown above its name. */
  kind: string;
  /** The event's name: the card's heading. */
  name: string;
  /** A sentence or two about the event. */
  summary: string;
  /** Key facts for sponsors, e.g. { term: "Audience", details: "..." }. */
  facts: { term: string; details: string }[];
  /** URL path of the proposal, a PDF in public/assets/pdf/. */
  pdf: string;
  /**
   * Text of the link to the PDF, followed by "(PDF, <size>)". It names the
   * event, so it is clear on its own.
   */
  linkText: string;
};

/**
 * The proposals, in the order shown. Beerformatics is a recurring series:
 * its card describes the series, not the edition a proposal is for, so it
 * stays true after that evening.
 */
const PROPOSALS: Proposal[] = [
  {
    kind: "Symposium",
    name: "XAI x Bio Symposium",
    summary:
      "A symposium on explainable artificial intelligence in biology, organized with research groups from KU Leuven, VUB, ULB, UAntwerp, VIB and Ghent University, and with partner student groups in France and Luxembourg.",
    facts: [
      {
        term: "When and where",
        details: "April 2027 in Leuven (final date to be confirmed), in person and in English",
      },
      {
        term: "Audience",
        details:
          "50 to 100 master's students, PhD candidates and postdocs in bioinformatics, computational biology, AI and the life sciences",
      },
      {
        term: "Program",
        details:
          "Selected student talks (half the program), invited early-career researchers, a poster session and networking reception, and Best Talk and Best Poster awards",
      },
      {
        term: "Packages",
        details:
          "Gold €1,000, Silver €500, Bronze €250, catering €250 to €500, or refreshments in kind",
      },
      { term: "Sponsorship deadline", details: "February 2027" },
    ],
    pdf: "/assets/pdf/2027-xai-bio-symposium-sponsorship-proposal.pdf",
    linkText: "XAI x Bio sponsorship proposal",
  },
  {
    kind: "Event series",
    name: "Beerformatics",
    summary:
      "Our recurring series of short research talks and cold beer, where students and young researchers hear what's new in bioinformatics and meet each other.",
    facts: [
      {
        term: "Audience",
        details:
          "Master's students, PhD students, postdocs and early-career researchers. Our three spring 2026 editions, in Leuven, Brussels and Antwerp, were all full: 50 seats and a waiting list every time.",
      },
      {
        term: "What you get",
        details:
          "Your logo on our slides, posters and social channels, a shout-out and a booth at the event, and relaxed contact with future interns, hires and collaborators",
      },
      {
        term: "What we ask",
        details:
          "Support in kind, which goes straight into the event: beers, snacks or goodies for the attendees, a discount on drinks, the venue or supplies, or prizes and merchandise. Even a small gesture makes a real difference.",
      },
    ],
    pdf: "/assets/pdf/2026-11-25-beerformatics-sponsorship-proposal.pdf",
    linkText: "Beerformatics sponsorship proposal",
  },
];

/**
 * Renders the Sponsor page: the page header, a card per proposal and the
 * e-mail address to write to.
 */
export default function SponsorPage() {
  return (
    <Container>
      <PageHeader
        title="Sponsor Our Events"
        description="Put your organization in front of the next generation of bioinformatics talent. Our events bring together master's students, PhD students and postdocs from universities across Belgium, and your support goes straight into them."
      />
      <div className="pb-16 md:pb-24">
        <ul className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {PROPOSALS.map((proposal) => (
            <li
              key={proposal.pdf}
              className="link-card flex flex-col rounded-lg border border-border bg-surface p-6 shadow-md transition-shadow hover:shadow-lg md:p-8"
            >
              <p className={EYEBROW}>{proposal.kind}</p>
              <h2 className={`${SECTION_HEADING} mt-1`}>{proposal.name}</h2>
              <p className="mt-3 text-lg leading-relaxed">{proposal.summary}</p>
              <dl className="mt-6 space-y-4">
                {proposal.facts.map(({ term, details }) => (
                  <div key={term}>
                    <dt className="font-semibold">{term}</dt>
                    <dd className="text-foreground-muted">{details}</dd>
                  </div>
                ))}
              </dl>
              {/* mt-auto keeps the links of both cards on one line when they sit side by side. */}
              <p className="mt-auto pt-6">
                <a
                  href={proposal.pdf}
                  className="link-card-link font-medium text-link hover:underline after:rounded-lg"
                >
                  {`${proposal.linkText} (PDF, ${formatFileSize(readPublicFileSize(proposal.pdf))})`}
                </a>
              </p>
            </li>
          ))}
        </ul>

        <div className="mt-12 rounded-lg border border-border bg-surface p-6 md:p-8">
          <h2 className={`${SECTION_HEADING} mb-3`}>Get in Touch</h2>
          <p className="text-lg leading-relaxed">
            To sponsor one of our events, or with any question about the proposals, e-mail us at{" "}
            {/* The inline-block moves the address and its full stop to the next line whole,
                instead of breaking the address after "rsg-"; on the narrowest phones it
                breaks before its "@". The link is underlined like the links in posts. */}
            <span className="inline-block [overflow-wrap:anywhere]">
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="text-link underline underline-offset-2 transition-colors hover:text-accent-strong"
              >
                {breakBeforeAt(CONTACT_EMAIL)}
              </a>
              .
            </span>
          </p>
        </div>
      </div>
    </Container>
  );
}
