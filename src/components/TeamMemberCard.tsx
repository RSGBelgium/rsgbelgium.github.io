/**
 * Team member profile card component.
 *
 * Renders a card with the member's avatar, name, board role, affiliation,
 * bio and profile links. Empty fields are left out.
 */

import MemberAvatar from "./MemberAvatar";

type TeamMemberCardProps = {
  name: string;
  title: string;
  image?: string;
  affiliation?: string;
  position?: string;
  city?: string;
  bioHtml?: string;
  linkedin?: string;
  orcid?: string;
};

/**
 * Displays a profile card for a team member.
 *
 * @param name - Member's name
 * @param title - Member's board role, e.g. "President"
 * @param image - Member's photo URL; without one, their initials are shown
 * @param affiliation - University or institute (optional)
 * @param position - Academic position, e.g. "PhD student" (optional)
 * @param city - City the member is based in (optional)
 * @param bioHtml - The member's bio, already converted from markdown to HTML (optional)
 * @param linkedin - LinkedIn profile URL (optional)
 * @param orcid - ORCID profile URL (optional)
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
      {(linkedin || orcid) && (
        <div className="flex justify-center space-x-4">
          {linkedin && (
            <a
              href={linkedin}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${name} on LinkedIn`}
              className="text-blue-500 hover:text-blue-700 dark:text-lightblue dark:hover:text-white"
            >
              LinkedIn
            </a>
          )}
          {orcid && (
            <a
              href={orcid}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${name} on ORCID`}
              className="text-green-500 hover:text-green-700 dark:text-lightblue dark:hover:text-white"
            >
              ORCID
            </a>
          )}
        </div>
      )}
    </div>
  );
};

export default TeamMemberCard;
