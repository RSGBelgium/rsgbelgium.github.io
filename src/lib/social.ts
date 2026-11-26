/**
 * RSG-Belgium's contact channels: e-mail, GitHub, Discord and LinkedIn.
 *
 * The single source of truth for the footer ("Connect With Us") and the
 * Contact page, so a channel is added, changed or removed in one place.
 * Their icons are in src/components/ContactChannels.tsx.
 *
 * RSG-Belgium has no Twitter/X or Facebook account: don't add them back.
 */

import { DISCORD_PAGE } from "./navigation";

/** The society's e-mail address. */
export const CONTACT_EMAIL = "rsg-belgium@iscbsc.org";

/**
 * The invite link to RSG-Belgium's Discord server, linked from the /discord
 * page (and /slack, which forwards there); the header, the footer and the
 * Contact page link to the /discord page. Discord invites stop working when
 * they expire; this one never does. If it is revoked, create a new one with
 * "Expire After: Never" and put it here.
 */
export const DISCORD_INVITE_URL = "https://discord.gg/bMva7Bq6jn";

/** Identifies a channel; it also selects the channel's icon. */
export type ContactChannelId = "email" | "github" | "discord" | "linkedin";

/** One way to reach RSG-Belgium. */
export type ContactChannel = {
  id: ContactChannelId;
  /** Short name, shown in the footer and as the heading on the Contact page, e.g. "GitHub". */
  label: string;
  /** A `mailto:` address, an internal path ("/discord") or an external https URL. */
  href: string;
  /** Text of the link on the Contact page; descriptive on its own, e.g. the e-mail address. */
  linkText: string;
  /** One sentence on the Contact page: what the channel is for. */
  description: string;
};

/** The contact channels, in the order they are shown. */
export const CONTACT_CHANNELS: readonly ContactChannel[] = [
  {
    id: "email",
    label: "Email",
    href: `mailto:${CONTACT_EMAIL}`,
    linkText: CONTACT_EMAIL,
    description:
      "Questions, ideas for an event, partnerships or anything else: write to the board.",
  },
  {
    id: "github",
    label: "GitHub",
    href: "https://github.com/RSGBelgium",
    linkText: "github.com/RSGBelgium",
    description:
      "The source code of this website. Spotted a mistake? Open an issue or a pull request.",
  },
  {
    id: "discord",
    label: "Discord",
    href: DISCORD_PAGE.url,
    linkText: "Join our Discord server",
    description: "Chat with fellow students and researchers, and hear about our events first.",
  },
  {
    id: "linkedin",
    label: "LinkedIn",
    href: "https://www.linkedin.com/company/rsg-belgium-iscb",
    linkText: "RSG-Belgium on LinkedIn",
    description: "Follow us for event announcements, speakers and news.",
  },
];
