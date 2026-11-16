/**
 * Round avatar for a person: a team member, or a post author.
 *
 * Shows the member's photo when there is one, otherwise their initials on a
 * brand-coloured circle, so profiles without a photo still look complete.
 */

import Image from "next/image";
import cn from "classnames";

/** Avatar sizes: wrapper size, initials font size and the rendered width in px. */
const SIZES = {
  sm: { box: "w-12 h-12", text: "text-lg", px: 48 },
  md: { box: "w-24 h-24", text: "text-3xl", px: 96 },
  lg: { box: "w-32 h-32", text: "text-4xl", px: 128 },
} as const;

type MemberAvatarProps = {
  name: string;
  image?: string;
  size?: keyof typeof SIZES;
  className?: string;
};

/**
 * Get the initials for a name: the first letter of the first and of the last word.
 *
 * @param name - Full name, e.g. "Abane Louis Ashu"
 * @returns Upper-case initials, e.g. "AA"; one letter for single-word names
 */
export function getInitials(name: string): string {
  const words = name.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return "";
  // Array.from splits by code point, so names starting with e.g. "Ž" keep their letter intact.
  const first = Array.from(words[0])[0];
  const last = words.length > 1 ? Array.from(words[words.length - 1])[0] : "";
  return `${first}${last}`.toUpperCase();
}

/**
 * Displays a member's photo, or their initials when they have no photo.
 *
 * @param name - Member's full name (alt text / accessible name, and source of the initials)
 * @param image - Path to the photo; empty or missing shows the initials
 * @param size - Avatar size (default: "lg", 8rem)
 * @param className - Extra classes for the round wrapper, e.g. margins or a border
 */
export default function MemberAvatar({ name, image, size = "lg", className }: MemberAvatarProps) {
  const { box, text, px } = SIZES[size];

  return (
    <div className={cn("relative shrink-0 rounded-full overflow-hidden", box, className)}>
      {image ? (
        <Image src={image} alt={name} fill sizes={`${px}px`} style={{ objectFit: "cover" }} />
      ) : (
        <div
          role="img"
          aria-label={name}
          className={cn("w-full h-full flex items-center justify-center bg-primary text-white font-bold select-none", text)}
        >
          {getInitials(name)}
        </div>
      )}
    </div>
  );
}
