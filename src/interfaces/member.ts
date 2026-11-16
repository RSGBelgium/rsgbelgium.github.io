/**
 * Member interface for organization/team members.
 *
 * Represents a team or organization member loaded from markdown content.
 */

/**
 * Represents a team or organization member.
 *
 * Text fields that are empty in the profile's front matter are empty strings
 * (or absent) and are hidden when rendering.
 *
 * @property slug - Unique slug for the member (file name without extension)
 * @property name - Member's full name
 * @property title - Member's role on the board, e.g. "President"
 * @property image - Path to member's photo, or "" when there is none (an initials avatar is shown)
 * @property affiliation - University or institute (optional)
 * @property position - Academic position, e.g. "PhD student" (optional)
 * @property city - City the member is based in (optional)
 * @property linkedin - LinkedIn profile URL (optional)
 * @property orcid - ORCID profile URL (optional)
 * @property order - Position in team listings, lowest first (required in the front matter)
 * @property content - Markdown body of the profile, i.e. the member's bio (optional)
 */
export interface Member {
  slug: string;
  name: string;
  title: string;
  image: string;
  affiliation?: string;
  position?: string;
  city?: string;
  linkedin?: string;
  orcid?: string;
  order: number;
  content?: string;
}
