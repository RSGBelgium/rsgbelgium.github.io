/**
 * Main site footer component.
 *
 * Renders the footer with a short description, the "Quick Links" footer
 * navigation and the contact channels (src/lib/social.ts), plus the copyright.
 *
 * The section titles are <h2>s: the footer follows each page's content, so
 * they continue that page's heading outline instead of skipping levels.
 * Links are at least 44px tall.
 */

import Link from "next/link";
import Container from "@/app/_components/container";
import { ContactChannelLink, ContactIcon } from "@/components/ContactChannels";
import { CONTACT_CHANNELS } from "@/lib/social";
import { ALL_NAV_PAGES } from "@/lib/navigation";

/** Classes for every footer link: a `touch-link` (globals.css), small text, room for an icon. */
const FOOTER_LINK = "touch-link gap-3 text-sm";

/** Classes for the footer's section titles. */
const FOOTER_HEADING = "text-lg font-semibold text-foreground mb-3";

/**
 * Displays the main site footer with navigation, social links, and contact info.
 */
export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-surface text-foreground-muted border-t border-border">
      {/* The page-width wrapper alone sets the side padding, so the footer lines up with the page. */}
      <Container className="py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About Section */}
          <div className="mb-6 md:mb-0">
            <h2 className={FOOTER_HEADING}>RSG-Belgium</h2>
            <p className="text-sm leading-relaxed">
              Fostering a community of bioinformatics and computational biology students and young
              researchers in Belgium.
            </p>
          </div>

          {/* Navigation Links */}
          <nav aria-label="Footer" className="mb-6 md:mb-0">
            <h2 className={FOOTER_HEADING}>Quick Links</h2>
            <ul>
              {ALL_NAV_PAGES.map((item) => (
                <li key={item.title}>
                  <Link href={item.url} className={FOOTER_LINK}>
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Contact channels: icon plus visible label */}
          <div>
            <h2 className={FOOTER_HEADING}>Connect With Us</h2>
            <ul>
              {CONTACT_CHANNELS.map((channel) => (
                <li key={channel.id}>
                  <ContactChannelLink channel={channel} className={FOOTER_LINK}>
                    <ContactIcon id={channel.id} className="h-5 w-5 shrink-0" />
                    <span>{channel.label}</span>
                  </ContactChannelLink>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-8 border-t border-border text-center">
          <p className="text-sm">&copy; {currentYear} RSG-Belgium. All rights reserved.</p>
        </div>
      </Container>
    </footer>
  );
}

export default Footer;
