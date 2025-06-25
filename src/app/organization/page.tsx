/**
 * Organization/team page for RSG-Belgium.
 *
 * Displays the team members, their roles, and structured data for SEO.
 */

import { Intro } from "@/app/_components/intro";
import Container from "@/app/_components/container";
import { getOrganizationData } from "@/lib/api";
import { Member as BaseMember } from "@/interfaces/member";
import { SITE_URL } from "@/lib/constants";
import markdownToHtml from "@/lib/markdownToHtml";

type Member = Omit<BaseMember, "content"> & { content?: string | null };

/**
 * Renders the Organization page with team members and their details.
 */
export default async function OrganizationPage() {
  const teamMembers = await getOrganizationData();

  // Process markdown content for each member
  const processedMembers: Member[] = await Promise.all(
    teamMembers.map(async (member) => ({
      ...member,
      content: member.content ? await markdownToHtml(member.content) : "",
    }))
  );

  return (
    <>
      {/* JSON-LD script tags will be rendered here and Next.js should place them in the <head> */}
      {processedMembers.map((member) => {
        const personJsonLd = {
          "@context": "https://schema.org",
          "@type": "Person",
          name: member.name,
          image: `${SITE_URL}${member.image}`,
          jobTitle: member.title,
          url: `${SITE_URL}/organization`,
          sameAs: [
            ...(member.linkedin ? [member.linkedin] : []),
            ...(member.orcid ? [member.orcid] : []),
          ].filter(Boolean),
        };
        return (
          <script
            key={`${member.slug}-ld-json`}
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
          />
        );
      })}
      {/* End of JSON-LD script tags */}
      <Container>
        <Intro
          title="Organization"
          description="Meet the team behind RSG-Belgium and learn about our organizational structure."
        />
        <h1 className="text-3xl md:text-5xl font-bold tracking-tighter leading-tight text-center my-8">
          Our Team
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {processedMembers.map((member) => (
            <div key={member.slug} className="bg-white rounded-lg shadow-lg overflow-hidden">
              <img
                src={member.image}
                alt={member.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h2 className="text-xl font-bold mb-2">{member.name}</h2>
                <p className="text-gray-600 mb-4">{member.title}</p>
                {member.content && (
                  <div
                    className="text-gray-700 mb-4 prose"
                    dangerouslySetInnerHTML={{ __html: member.content }}
                  />
                )}
                <div className="flex space-x-4">
                  {member.linkedin && (
                    <a
                      href={member.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800"
                    >
                      LinkedIn
                    </a>
                  )}
                  {member.orcid && (
                    <a
                      href={member.orcid}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-green-600 hover:text-green-800"
                    >
                      ORCID
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </>
  );
}

/**
 * Generates metadata for the Organization page.
 *
 * @returns Metadata object for the page.
 */
export async function generateMetadata() {
  // Note: JSON-LD scripts added directly in JSX won't be part of this metadata object.
  // For more complex scenarios, Next.js recommends using the metadata API for JSON-LD.
  // However, for this case, direct script injection is simpler as per instructions.
  return {
    title: "Our Team | RSG Belgium",
    description: "Meet the team behind RSG Belgium.",
  };
}
