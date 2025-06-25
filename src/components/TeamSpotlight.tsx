/**
 * Team spotlight section component.
 *
 * Renders a grid of featured team members with photos and titles.
 */

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Member } from '@/interfaces/member'; // Assuming Member interface exists
import Button from './Button'; // Reusable button

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
              <div className="relative w-32 h-32 mx-auto rounded-full overflow-hidden mb-4 border-2 border-blue-500">
                <Image
                  src={member.image} // Use member.image directly
                  alt={member.name}
                  fill={true} // Modern prop for layout="fill"
                  style={{ objectFit: 'cover' }} // Modern prop for objectFit
                  className="rounded-full"
                />
              </div>
              <h3 className="text-xl font-semibold mb-1 text-primary">{member.name}</h3>
              <p className="text-primary">{member.title}</p>
              {/* Optionally, add LinkedIn/ORCID links if desired for spotlight, or keep it simple */}
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
