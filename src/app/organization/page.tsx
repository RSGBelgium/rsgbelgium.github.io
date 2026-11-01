/**
 * Organization/team page for RSG-Belgium.
 *
 * Displays the team members, their roles, and structured data for SEO.
 */

import type { Metadata } from "next";
import { Intro } from "@/app/_components/intro";
import Container from "@/app/_components/container";
import TeamMemberCard from "@/components/TeamMemberCard";
import { getAllMembers } from "@/lib/api";
import { Member } from "@/interfaces/member";
import { SITE_NAME, SITE_URL } from "@/lib/constants";
import markdownToHtml from "@/lib/markdownToHtml";
import { pageAlternates } from "@/lib/metadata";

export const metadata: Metadata = {
  title: "Our Team",
  description: "Meet the board of RSG-Belgium: the students and young researchers who organise our events.",
  alternates: pageAlternates("/organization"),
};

/**
 * Turns a site path into an absolute URL; absolute URLs are returned unchanged.
 *
 * @param path - A path such as "/images/team/anis.JPG", or a full URL
 */
function toAbsoluteUrl(path: string): string {
  return /^https?:\/\//.test(path) ? path : `${SITE_URL}${path}`;
}

/**
 * Builds the schema.org Person structured data for a member.
 *
 * Only fields that have a value are included; `image` is left out for
 * members without a photo (their initials avatar isn't a real image).
 *
 * @param member - The team member
 * @returns A JSON-LD object
 */
function personJsonLd(member: Member) {
  const sameAs = [member.linkedin, member.orcid].filter((url): url is string => Boolean(url));

  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: member.name,
    ...(member.title && { jobTitle: member.title }),
    ...(member.image && { image: toAbsoluteUrl(member.image) }),
    ...(member.affiliation && { affiliation: { "@type": "Organization", name: member.affiliation } }),
    memberOf: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
    url: `${SITE_URL}/organization`,
    ...(sameAs.length > 0 && { sameAs }),
  };
}

/**
 * Serialises JSON-LD for a `<script>` tag. `<` is escaped so that a value
 * containing "</script>" can't close the tag early.
 *
 * @param data - The JSON-LD object
 */
function serializeJsonLd(data: object): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

/**
 * Renders the Organization page with team members and their details.
 */
export default async function OrganizationPage() {
  const teamMembers = await getAllMembers();

  // Convert each member's markdown bio to HTML.
  const membersWithBio = await Promise.all(
    teamMembers.map(async (member) => ({
      member,
      bioHtml: member.content ? await markdownToHtml(member.content) : "",
    }))
  );

  return (
    <>
      {teamMembers.map((member) => (
        <script
          key={`${member.slug}-ld-json`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: serializeJsonLd(personJsonLd(member)) }}
        />
      ))}
      <Container>
        <Intro
          title="Organization"
          description="Meet the team behind RSG-Belgium and learn about our organizational structure."
        />
        <h2 className="text-3xl md:text-5xl font-bold tracking-tighter leading-tight text-center my-8">
          Our Team
        </h2>
        {membersWithBio.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {membersWithBio.map(({ member, bioHtml }) => (
              <TeamMemberCard
                key={member.slug}
                name={member.name}
                title={member.title}
                image={member.image}
                affiliation={member.affiliation}
                position={member.position}
                city={member.city}
                bioHtml={bioHtml}
                linkedin={member.linkedin}
                orcid={member.orcid}
              />
            ))}
          </div>
        ) : (
          <p className="text-center text-lg mb-16">No team member information available.</p>
        )}
      </Container>
    </>
  );
}

