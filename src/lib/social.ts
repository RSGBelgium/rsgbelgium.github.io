/**
 * RSG-Belgium's contact channels: e-mail, GitHub, Slack and LinkedIn.
 *
 * The single source of truth for the footer ("Connect With Us") and the
 * Contact page, so a channel is added, changed or removed in one place.
 * Their icons are in src/components/ContactChannels.tsx.
 *
 * RSG-Belgium has no Twitter/X or Facebook account: don't add them back.
 */

import { SLACK_PAGE } from "./navigation";

/** The society's e-mail address, also used by the Slack invitation request. */
export const CONTACT_EMAIL = "iscb.rsg.belgium@gmail.com";

/** Identifies a channel; it also selects the channel's icon. */
export type ContactChannelId = "email" | "github" | "slack" | "linkedin";

/** One way to reach RSG-Belgium. */
export type ContactChannel = {
  id: ContactChannelId;
  /** Short name, shown in the footer and as the heading on the Contact page, e.g. "GitHub". */
  label: string;
  /** A `mailto:` address, an internal path ("/slack") or an external https URL. */
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
    id: "slack",
    label: "Slack",
    href: SLACK_PAGE.url,
    linkText: "Request an invitation",
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
