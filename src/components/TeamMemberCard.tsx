/**
 * Team member profile card component.
 *
 * Renders a card with member photo, name, title, and social links.
 */

import Image from 'next/image';
import Link from 'next/link';

type TeamMemberCardProps = {
  name: string;
  title: string;
  image: string;
  linkedin?: string;
  orcid?: string;
};

/**
 * Displays a profile card for a team member.
 *
 * @param name - Member's name
 * @param title - Member's title/role
 * @param image - Member's photo URL
 * @param linkedin - LinkedIn profile URL (optional)
 * @param orcid - ORCID profile URL (optional)
 */
const TeamMemberCard: React.FC<TeamMemberCardProps> = ({ name, title, image, linkedin, orcid }) => {


  return (
    <div className="bg-white dark:bg-slate-900 shadow-lg rounded-lg p-6 text-center">
      <div className="relative w-32 h-32 mx-auto rounded-full overflow-hidden mb-4">
        <Image

          src={image} // Use the prop directly
          alt={name}
          fill={true} // Modern prop for layout="fill"
          style={{ objectFit: 'cover' }} // Modern prop for objectFit

        />
      </div>
      <h3 className="text-xl font-semibold mb-1">{name}</h3>
      <p className="text-gray-600 mb-3">{title}</p>
      <div className="flex justify-center space-x-4">
        {linkedin && (
          <Link href={linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-700 dark:text-lightblue dark:hover:text-white">
            LinkedIn
          </Link>
        )}
        {orcid && (
          <Link href={orcid} target="_blank" rel="noopener noreferrer" className="text-green-500 hover:text-green-700 dark:text-lightblue dark:hover:text-white">
            ORCID
          </Link>
        )}
      </div>
    </div>
  );
};

export default TeamMemberCard;
