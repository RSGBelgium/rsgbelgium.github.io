/**
 * The site's pages, as linked from the header, the footer, the homepage and the sitemap.
 */

/** A page in the site navigation. */
export type NavItem = {
  title: string;
  url: string;
};

/** The main sections, in menu order. */
export const NAV_ITEMS: NavItem[] = [
  { title: "About", url: "/about" },
  { title: "News", url: "/news" },
  { title: "Organization", url: "/organization" },
  { title: "Contact", url: "/contact" },
];

/**
 * The Discord join page: a call-to-action button in the header; the footer and
 * the Contact page link to it as the "Discord" contact channel (src/lib/social.ts).
 */
export const DISCORD_PAGE: NavItem = { title: "Join Discord", url: "/discord" };

/** Every page in the navigation, in order: the main sections, then Discord. */
export const ALL_NAV_PAGES: NavItem[] = [...NAV_ITEMS, DISCORD_PAGE];

/**
 * The page for sponsors, with our sponsorship proposals. A section on the
 * homepage links to it, with this title as its button. It is not in the
 * header: the desktop bar only just fits at 768px.
 */
export const SPONSOR_PAGE: NavItem = { title: "Become a Sponsor", url: "/sponsor" };
