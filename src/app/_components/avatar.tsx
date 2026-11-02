/**
 * User avatar display component.
 *
 * Renders a circular avatar image (or the initials) next to the user's name.
 * The name is always shown as text next to the picture, so the picture is
 * decorative (`alt=""`): screen readers read the name once, not twice.
 */

import MemberAvatar from "@/components/MemberAvatar";

type Props = {
  name?: string;
  picture?: string;
};

/**
 * Renders a user avatar with optional image and name.
 *
 * @param name - The user's name (shown next to the picture, and the fallback initials)
 * @param picture - The URL of the user's avatar image
 */
const Avatar = ({ name = "Anonymous", picture }: Props) => {
  return (
    <div className="flex items-center">
      <MemberAvatar name={name} image={picture} size="sm" decorative className="mr-4" />
      <div className="text-xl font-bold">{name}</div>
    </div>
  );
};

export default Avatar;
