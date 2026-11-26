/**
 * Reads the size of the site's own downloads (PDFs) while it is built, for
 * link texts such as "Sponsorship proposal (PDF, 972 KB)".
 *
 * A link to a file says what visitors get before they open it: its type and
 * size. Reading the size from the file itself keeps the text right when the
 * file is replaced.
 */

import { statSync } from "fs";
import { join } from "path";

/** The folder served at the site's root: "/assets/pdf/a.pdf" is public/assets/pdf/a.pdf. */
const PUBLIC_DIR = join(process.cwd(), "public");

/** Formats megabytes with at most one decimal: "1.2", "12". */
const MEGABYTES = new Intl.NumberFormat("en", { maximumFractionDigits: 1 });

/**
 * Reads the size of a file in public/.
 *
 * @param urlPath - The file's URL path, e.g. "/assets/pdf/2027-xai-bio-symposium-sponsorship-proposal.pdf"
 * @returns The size in bytes
 * @throws If there is no such file, so the build fails instead of publishing a broken link
 */
export function readPublicFileSize(urlPath: string): number {
  return statSync(join(PUBLIC_DIR, urlPath)).size;
}

/**
 * Formats a file size for a link text, in decimal units (1 KB = 1000 bytes)
 * as macOS shows them.
 *
 * @param bytes - The size in bytes
 * @returns e.g. "512 bytes", "972 KB" or "1.2 MB"
 */
export function formatFileSize(bytes: number): string {
  if (bytes < 1000) return `${bytes} bytes`;
  const kilobytes = Math.round(bytes / 1000);
  if (kilobytes < 1000) return `${kilobytes} KB`;
  return `${MEGABYTES.format(bytes / 1_000_000)} MB`;
}
