/**
 * Date formatting utility component.
 *
 * Renders a date string in a human-readable, localized format for display.
 */

'use client';

/**
 * Formats and displays a date string as a readable date.
 *
 * @param dateString - The ISO date string to format
 */
export default function DateFormatter({ dateString }: { dateString: string }) {
  if (!dateString) return null;

  const date = new Date(dateString);

  if (isNaN(date.getTime())) {
    return null;
  }

  return (
    <time dateTime={dateString}>
      {date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        timeZone: 'UTC'
      })}
    </time>
  );
}
