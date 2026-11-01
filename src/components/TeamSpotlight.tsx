/**
 * Team spotlight section component.
 *
 * Renders a grid of featured team members with their avatar and board role.
 */

import React from 'react';
import { Member } from '@/interfaces/member';
import Button from './Button'; // Reusable button
import MemberAvatar from './MemberAvatar';

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
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-800 dark:text-lightblue">
          Meet the Team
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10">
          {members.map((member) => (
            <div key={member.slug} className="text-center bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
              <MemberAvatar
                name={member.name}
                image={member.image}
                className="mx-auto mb-4 border-2 border-blue-500"
              />
              <h3 className="text-xl font-semibold mb-1 text-primary">{member.name}</h3>
              {member.title && <p className="text-primary">{member.title}</p>}
            </div>
          ))}
        </div>
        <div className="text-center mt-12">
          <Button href="/organization" variant="secondary">
            View Full Team
          </Button>
        </div>
      </div>
    </section>
  );
};

export default TeamSpotlight;
