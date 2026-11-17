/**
 * Date formatting utility component.
 *
 * Renders a date string in a human-readable, localized format for display.
 */

"use client";

import { parseDate } from "@/lib/dates";

/**
 * Formats and displays a date string as a readable date.
 *
 * @param dateString - The ISO date string to format
 */
export default function DateFormatter({ dateString }: { dateString: string }) {
  const date = parseDate(dateString);

  if (!date) {
    return null;
  }

  return (
    <time dateTime={dateString}>
      {date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        timeZone: "UTC",
      })}
    </time>
  );
}
