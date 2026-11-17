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
    { label: "LinkedIn", url: linkedin, className: "text-blue-500 hover:text-blue-700" },
    { label: "ORCID", url: orcid, className: "text-green-500 hover:text-green-700" },
  ].filter((link) => link.url);

  return (
    <div className="bg-white dark:bg-slate-900 shadow-lg rounded-lg p-6 text-center">
      <MemberAvatar name={name} image={image} className="mx-auto mb-4" />
      <h3 className="text-xl font-semibold mb-1">{name}</h3>
      {title && <p className="text-gray-600 dark:text-slate-400 mb-1">{title}</p>}
      {details && <p className="text-sm text-gray-500 dark:text-slate-400 mb-3">{details}</p>}
      {bioHtml && (
        <div
          className="text-left text-sm leading-relaxed text-gray-700 dark:text-slate-300 space-y-3 my-4"
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
              className={`${link.className} dark:text-lightblue dark:hover:text-white`}
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
