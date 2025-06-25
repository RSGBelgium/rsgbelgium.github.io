/**
 * Member interface for organization/team members.
 *
 * Represents a team or organization member loaded from markdown content.
 */

/**
 * Represents a team or organization member.
 *
 * @property name - Member's full name
 * @property title - Member's title or role
 * @property image - Path to member's photo
 * @property bio - Short biography (optional)
 * @property linkedin - LinkedIn profile URL (optional)
 * @property orcid - ORCID profile URL (optional)
 * @property slug - Unique slug for the member
 * @property content - Markdown/HTML content for the member (optional)
 */
export interface Member {
  name: string;
  title: string;
  image: string;
  bio?: string;
  linkedin?: string;
  orcid?: string;
  slug: string;
  content?: string;
}
