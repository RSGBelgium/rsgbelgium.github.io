/**
 * Global site constants.
 *
 * Contains the site name, canonical URL, default description and default author info.
 */

export const SITE_NAME = "RSG-Belgium";

/** Canonical origin of the live site (GitHub Pages custom domain), without a trailing slash. */
export const SITE_URL = "https://rsg-belgium.org";

/** Default meta description, for pages that don't set their own. */
export const SITE_DESCRIPTION =
  "The official website for RSG-Belgium, a community of researchers and students in bioinformatics and computational biology.";

/**
 * The author of every post that doesn't name its own. The picture is the
 * RSG-Belgium mark on a white square (the 180 px Apple touch icon, generated
 * from public/favicon/favicon.svg): unlike the full logo, it still reads in
 * the 48 px round avatar, and stays white in the dark theme.
 */
export const DEFAULT_AUTHOR = {
  name: "RSG-Belgium",
  picture: "/favicon/apple-touch-icon.png",
};
