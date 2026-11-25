/**
 * Team member profile card component.
 *
 * Renders a card with the member's avatar, name, board role, affiliation,
 * bio and profile links. Empty fields are left out.
 *
 * A long bio is split (src/lib/bio.ts): the card shows its first paragraph,
 * and the rest is in a <details> element behind "Read more", so one long bio
 * doesn't stretch its whole row of cards. <details> works without
 * JavaScript, tells screen readers whether it is expanded, and the hidden
 * text is still in the page's HTML (and found by the browser's search).
 */

import type { Member } from "@/interfaces/member";
import ExternalLink from "./ExternalLink";
import MemberAvatar from "./MemberAvatar";

type TeamMemberCardProps = Pick<Member, "name" | "title"> &
  Partial<Pick<Member, "image" | "affiliation" | "position" | "city" | "linkedin" | "orcid">> & {
    /** The member's bio (its first paragraph, for a long bio), converted from markdown to HTML. */
    bioHtml?: string;
    /** The rest of a long bio, as HTML, shown behind "Read more". */
    bioMoreHtml?: string;
  };

/**
 * Displays a profile card for a team member.
 *
 * The member fields are documented on the Member interface
 * (src/interfaces/member.ts); without an `image`, their initials are shown.
 */
const TeamMemberCard: React.FC<TeamMemberCardProps> = ({
  name,
  title,
  image,
  affiliation,
  position,
  city,
  bioHtml,
  bioMoreHtml,
  linkedin,
  orcid,
}) => {
  // e.g. "KU Leuven · PhD student · Brussels", skipping the parts that are empty.
  const details = [affiliation, position, city].filter(Boolean).join(" · ");
  const profileLinks = [
    { label: "LinkedIn", url: linkedin },
    { label: "ORCID", url: orcid },
  ].filter((link): link is { label: string; url: string } => Boolean(link.url));

  return (
    <div className="flex flex-col bg-surface border border-border shadow-lg rounded-lg p-6 text-center">
      {/* Decorative: the name is the heading right below it. */}
      <MemberAvatar name={name} image={image} decorative className="mx-auto mb-4" />
      <h3 className="text-xl font-semibold mb-1">{name}</h3>
      {title && <p className="text-foreground-muted mb-1">{title}</p>}
      {details && <p className="text-sm text-foreground-muted mb-3">{details}</p>}
      {bioHtml && (
        <div
          className="text-left text-sm leading-relaxed text-foreground space-y-3 mt-4"
          dangerouslySetInnerHTML={{ __html: bioHtml }}
        />
      )}
      {bioMoreHtml && (
        <details className="group text-left text-sm leading-relaxed text-foreground">
          {/* inline-flex hides the default marker; the chevron shows the state instead. */}
          <summary className="touch-link gap-1 cursor-pointer font-medium [&::-webkit-details-marker]:hidden">
            <span className="group-open:hidden">Read more</span>
            <span className="hidden group-open:inline">Show less</span>
            <span className="sr-only"> of {name}&apos;s bio</span>
            <svg
              className="h-4 w-4 transition-transform group-open:rotate-180"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
              focusable="false"
            >
              <path
                fillRule="evenodd"
                d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 11.17l3.71-3.94a.75.75 0 1 1 1.08 1.04l-4.25 4.5a.75.75 0 0 1-1.08 0l-4.25-4.5a.75.75 0 0 1 .02-1.06z"
                clipRule="evenodd"
              />
            </svg>
          </summary>
          <div className="space-y-3 pb-2" dangerouslySetInnerHTML={{ __html: bioMoreHtml }} />
        </details>
      )}
      {profileLinks.length > 0 && (
        // mt-auto: the links sit at the bottom of the card, level with the other cards' in a row.
        <div className="flex justify-center space-x-4 mt-auto pt-4">
          {profileLinks.map((link) => (
            <ExternalLink key={link.label} href={link.url} className="touch-link px-2">
              {/* Read as "Jane Doe on LinkedIn": the card has several "LinkedIn"s. */}
              <span className="sr-only">{name} on </span>
              {link.label}
            </ExternalLink>
          ))}
        </div>
      )}
    </div>
  );
};

export default TeamMemberCard;
