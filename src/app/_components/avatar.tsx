/**
 * User avatar display component.
 *
 * Renders a circular avatar image (or the initials) next to the user's name.
 */

import MemberAvatar from "@/components/MemberAvatar";

type Props = {
  name?: string;
  picture?: string;
};

/**
 * Renders a user avatar with optional image and name.
 *
 * @param name - The user's name (used for alt text and the fallback initials)
 * @param picture - The URL of the user's avatar image
 */
const Avatar = ({ name = 'Anonymous', picture }: Props) => {
  return (
    <div className="flex items-center">
      <MemberAvatar name={name} image={picture} size="sm" className="mr-4" />
      <div className="text-xl font-bold">{name}</div>
    </div>
  );
};

export default Avatar;
