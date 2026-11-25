/**
 * Team spotlight section component.
 *
 * Renders a grid of featured team members with their avatar and board role.
 */

import React from "react";
import { Member } from "@/interfaces/member";
import Button from "./Button"; // Reusable button
import Container from "@/app/_components/container";
import MemberAvatar from "./MemberAvatar";

interface TeamSpotlightProps {
  members: Member[];
}

/**
 * Displays a section highlighting featured team members.
 *
 * @param members - Array of team member objects to spotlight
 */
const TeamSpotlight: React.FC<TeamSpotlightProps> = ({ members }) => {
  if (!members || members.length === 0) {
    return null; // Or some placeholder
  }

  return (
    <section className="py-12 md:py-20">
      <Container>
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-foreground">
          Meet the Team
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10">
          {members.map((member) => (
            <div
              key={member.slug}
              className="text-center bg-surface border border-border p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              {/* Decorative: the name is the heading right below it. */}
              <MemberAvatar
                name={member.name}
                image={member.image}
                decorative
                className="mx-auto mb-4 border-2 border-accent"
              />
              <h3 className="text-xl font-semibold mb-1 text-foreground">{member.name}</h3>
              {member.title && <p className="text-foreground-muted">{member.title}</p>}
            </div>
          ))}
        </div>
        <div className="text-center mt-12">
          <Button href="/organization" variant="secondary">
            View Full Team
          </Button>
        </div>
      </Container>
    </section>
  );
};

export default TeamSpotlight;
