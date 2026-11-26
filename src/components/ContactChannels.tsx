/**
 * Icons and links for RSG-Belgium's contact channels (src/lib/social.ts).
 *
 * - ContactIcon: an inline SVG per channel, no icon library. The brand marks
 *   (GitHub, LinkedIn, Discord) are the single-colour paths from Simple Icons
 *   (https://simpleicons.org, CC0); LinkedIn comes from Simple Icons 10.4.0,
 *   as later releases dropped it. They are filled with `currentColor`, so
 *   they follow the theme's text colour. The envelope is an outline icon in
 *   the style of the theme switcher's icons.
 * - ContactChannelLink: the right kind of link for a channel. Internal paths
 *   use next/link; external URLs open in a new tab and say so to screen
 *   readers; `mailto:` links stay in the same tab.
 * - breakBeforeAt: lets an e-mail address in a link break before its "@".
 *
 * Icons are decorative: always show them next to a visible text label.
 */

import Link from "next/link";
import type { ReactNode } from "react";
import { type ContactChannel, type ContactChannelId } from "@/lib/social";
import { isAbsoluteUrl } from "@/lib/urls";
import ExternalLink from "./ExternalLink";

/** Simple Icons paths (24 x 24 viewBox) for the brand marks. */
const BRAND_PATHS: Record<Exclude<ContactChannelId, "email">, string> = {
  github:
    "M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12",
  linkedin:
    "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z",
  discord:
    "M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z",
};

type ContactIconProps = {
  id: ContactChannelId;
  /** Size and colour classes (default: "h-5 w-5"); the icon uses the current text colour. */
  className?: string;
};

/**
 * Displays a channel's icon. Decorative: hidden from screen readers.
 *
 * @param id - The channel whose icon to show
 * @param className - Size classes, e.g. "h-6 w-6"
 */
export function ContactIcon({ id, className = "h-5 w-5" }: ContactIconProps) {
  const shared = {
    className,
    viewBox: "0 0 24 24",
    "aria-hidden": true,
    focusable: false,
  } as const;

  if (id === "email") {
    // Envelope, outlined like the theme switcher's icons.
    return (
      <svg
        {...shared}
        fill="none"
        stroke="currentColor"
        strokeWidth={1.75}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="m3.5 6.5 8.5 6.5 8.5-6.5" />
      </svg>
    );
  }

  return (
    <svg {...shared} fill="currentColor">
      <path d={BRAND_PATHS[id]} />
    </svg>
  );
}

/**
 * Lets a link text break before the "@" of an e-mail address, with `<wbr>`.
 *
 * The address can be wider than its line, e.g. in a Contact page card on
 * phones below 335px and in the two-column grid just above `sm` (640-677px).
 * It then breaks as "rsg-belgium" / "@iscbsc.org" instead of in the middle
 * of a word.
 * The `<wbr>` is aria-hidden: Chrome would otherwise put a space in the
 * link's accessible name ("rsg-belgium @iscbsc.org"). Copying the
 * address gives it whole.
 *
 * @param text - A link text; returned unchanged if it has no "@"
 */
export function breakBeforeAt(text: string): ReactNode {
  const at = text.indexOf("@");
  if (at === -1) return text;
  return (
    <>
      {text.slice(0, at)}
      <wbr aria-hidden="true" />
      {text.slice(at)}
    </>
  );
}

type ContactChannelLinkProps = {
  channel: ContactChannel;
  className?: string;
  children: ReactNode;
};

/**
 * Links to a contact channel with the attributes its kind of URL needs.
 *
 * External links are an ExternalLink: a new tab, and a visually hidden
 * "(opens in a new tab)" at the end of their accessible name.
 *
 * @param channel - The channel to link to
 * @param className - Classes for the link
 * @param children - The link's visible content (it must include text)
 */
export function ContactChannelLink({ channel, className, children }: ContactChannelLinkProps) {
  if (channel.href.startsWith("/")) {
    return (
      <Link href={channel.href} className={className}>
        {children}
      </Link>
    );
  }

  // External links open in a new tab; `mailto:` links and internal paths don't.
  if (isAbsoluteUrl(channel.href)) {
    return (
      <ExternalLink href={channel.href} className={className}>
        {children}
      </ExternalLink>
    );
  }

  return (
    <a href={channel.href} className={className}>
      {children}
    </a>
  );
}
