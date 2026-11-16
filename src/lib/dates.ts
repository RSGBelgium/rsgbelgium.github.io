/**
 * Post date helpers.
 *
 * Every place that reads a post's date (sorting, the post page, the feed,
 * the sitemap and the date shown on cards) goes through these functions,
 * so a missing or invalid date is handled the same way everywhere.
 */

/**
 * Normalise a front-matter `date` value to a string.
 *
 * YAML turns unquoted date-only values (`date: 2021-09-21`) into a Date object,
 * while quoted values and values with a time (`date: 2017-10-02 19:10`) stay strings.
 *
 * @param value - The raw `date` value parsed by gray-matter
 * @returns An ISO string for Date values, the original string otherwise, or "" when missing
 */
export function normalizeFrontMatterDate(value: unknown): string {
  if (value instanceof Date) return value.toISOString();
  if (typeof value === "string") return value;
  return "";
}

/**
 * Parse a post date string.
 *
 * @param date - A post date, e.g. "2026-05-15", "2017-10-02 19:10" or an ISO string
 * @returns The Date, or undefined when the date is missing or invalid
 */
export function parseDate(date: string): Date | undefined {
  if (!date) return undefined;
  const parsed = new Date(date);
  return Number.isNaN(parsed.getTime()) ? undefined : parsed;
}
