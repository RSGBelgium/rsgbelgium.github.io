/**
 * Team member profile card component.
 *
 * Renders a card with the member's avatar, name, board role, affiliation,
 * bio and profile links. Empty fields are left out.
 */

import type { Member } from "@/interfaces/member";
import MemberAvatar from "./MemberAvatar";

type TeamMemberCardProps = Pick<Member, "name" | "title"> &
  Partial<Pick<Member, "image" | "affiliation" | "position" | "city" | "linkedin" | "orcid">> & {
    /** The member's bio, already converted from markdown to HTML. */
    bioHtml?: string;
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
  linkedin,
  orcid,
}) => {
  // e.g. "KU Leuven · PhD student · Brussels", skipping the parts that are empty.
  const details = [affiliation, position, city].filter(Boolean).join(" · ");
  const profileLinks = [
    { label: "LinkedIn", url: linkedin },
    { label: "ORCID", url: orcid },
  ].filter((link) => link.url);

  return (
    <div className="bg-surface border border-border shadow-lg rounded-lg p-6 text-center">
      <MemberAvatar name={name} image={image} className="mx-auto mb-4" />
      <h3 className="text-xl font-semibold mb-1">{name}</h3>
      {title && <p className="text-foreground-muted mb-1">{title}</p>}
      {details && <p className="text-sm text-foreground-muted mb-3">{details}</p>}
      {bioHtml && (
        <div
          className="text-left text-sm leading-relaxed text-foreground space-y-3 my-4"
          dangerouslySetInnerHTML={{ __html: bioHtml }}
        />
      )}
      {profileLinks.length > 0 && (
        <div className="flex justify-center space-x-4">
          {profileLinks.map((link) => (
            <a
              key={link.label}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${name} on ${link.label}`}
              className="text-link hover:underline"
            >
              {link.label}
            </a>
          ))}
        </div>
      )}
    </div>
  );
};

export default TeamMemberCard;
