/**
 * A post's byline: the author's round avatar (or initials) next to their
 * name and, optionally, the post's date.
 *
 * The name is always shown as text next to the picture, so the picture is
 * decorative (`alt=""`): screen readers read the name once, not twice.
 */

import MemberAvatar from "@/components/MemberAvatar";
import DateFormatter from "./date-formatter";

type Props = {
  name?: string;
  picture?: string;
  /** The post's date (ISO string), shown under the name. */
  date?: string;
};

/**
 * Renders a user avatar with the user's name and an optional date.
 *
 * @param name - The user's name (shown next to the picture, and the fallback initials)
 * @param picture - The URL of the user's avatar image
 * @param date - Optional date to show under the name
 */
const Avatar = ({ name = "Anonymous", picture, date }: Props) => {
  return (
    <div className="flex items-center gap-3">
      <MemberAvatar name={name} image={picture} size="sm" decorative />
      <div className="leading-snug">
        <div className="font-semibold">{name}</div>
        {date && (
          <div className="text-sm text-foreground-muted">
            <DateFormatter dateString={date} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Avatar;
