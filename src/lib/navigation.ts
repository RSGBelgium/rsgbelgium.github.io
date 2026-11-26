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

/**
 * The page for sponsors, with our sponsorship proposals. The header and the
 * footer list it after the main sections, and a section on the homepage
 * invites sponsors to it.
 */
export const SPONSOR_PAGE: NavItem = { title: "Sponsorship", url: "/sponsor" };

export const MENU_ITEMS: NavItem[] = [...NAV_ITEMS, SPONSOR_PAGE];

/** Every page in the navigation, in order: the main sections, Discord, then the Sponsor page. */
export const ALL_NAV_PAGES: NavItem[] = [...NAV_ITEMS, DISCORD_PAGE, SPONSOR_PAGE];
