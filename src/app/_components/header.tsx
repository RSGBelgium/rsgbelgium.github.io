/**
 * Main site header and navigation component.
 *
 * Renders the top navigation bar, logo, and theme switcher for the site.
 * Includes responsive mobile menu support. The theme switcher sits in the
 * header bar itself, outside the menus, so it is visible on every screen
 * size and doesn't remount (and flash) each time the mobile menu opens.
 *
 * The mobile menu is a disclosure: a toggle button with aria-expanded and
 * aria-controls, and a menu that always stays in the DOM (hidden while
 * closed), so aria-controls never points at a missing element. It closes
 * on Escape (focus goes back to the toggle), on a link click and on every
 * route change; the header lives in the root layout, so it is not
 * remounted when the page changes.
 */

"use client"; // For useState to handle mobile menu toggle

import cn from "classnames";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import Button from "@/components/Button"; // Assuming Button component path
import { ThemeSwitcher } from "./theme-switcher"; // Import ThemeSwitcher
import { NAV_ITEMS, SLACK_PAGE, type NavItem } from "@/lib/navigation";

/**
 * Whether a nav item belongs to the current page: its own URL or a page below
 * it, e.g. "/news/some-post" is part of "News".
 *
 * @param pathname - The current path, e.g. "/news/some-post"
 * @param url - The nav item's URL, e.g. "/news"
 */
function isCurrentSection(pathname: string, url: string): boolean {
  return pathname === url || pathname.startsWith(`${url}/`);
}

/**
 * A link in the main navigation, used by both the desktop bar and the mobile
 * menu. The current section is filled with the primary colour and marked
 * with `aria-current="page"`; the others get the same fill on hover.
 *
 * @param item - The page to link to
 * @param pathname - The current path, from usePathname()
 * @param className - Classes for this menu's layout, e.g. "text-sm"
 * @param onClick - Called when the link is followed (the mobile menu closes)
 */
function NavLink({
  item,
  pathname,
  className,
  onClick,
}: {
  item: NavItem;
  pathname: string;
  className?: string;
  onClick?: () => void;
}) {
  const isCurrent = isCurrentSection(pathname, item.url);
  return (
    <Link
      href={item.url}
      aria-current={isCurrent ? "page" : undefined}
      onClick={onClick}
      className={cn(
        "rounded-md px-3 py-2 font-medium transition-colors",
        isCurrent
          ? "bg-primary text-primary-foreground"
          : "text-foreground hover:bg-primary hover:text-primary-foreground",
        className,
      )}
    >
      {item.title}
    </Link>
  );
}

/**
 * Displays the main site header with navigation and theme switcher.
 */
const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((open) => !open);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  // Close the menu whenever the page changes (links, back/forward buttons).
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  // While the menu is open, Escape closes it and puts focus back on the toggle.
  useEffect(() => {
    if (!isMobileMenuOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setIsMobileMenuOpen(false);
      menuButtonRef.current?.focus();
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [isMobileMenuOpen]);

  return (
    <header className="bg-surface border-b border-border shadow-md sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo (one size smaller on the narrowest phones, to leave room for the theme switcher) */}
          <div className="flex-shrink-0">
            <Link
              href="/"
              className="rounded-md text-xl min-[375px]:text-2xl font-bold text-link hover:text-accent-strong transition-colors"
            >
              RSG-Belgium
            </Link>
          </div>

          <div className="flex items-center gap-2 md:gap-4">
            {/* Desktop Navigation */}
            <nav aria-label="Main" className="hidden md:flex md:items-center md:space-x-4">
              {NAV_ITEMS.map((item) => (
                <NavLink key={item.url} item={item} pathname={pathname} className="text-sm" />
              ))}
              <Button href={SLACK_PAGE.url} variant="primary" size="sm">
                {SLACK_PAGE.title}
              </Button>
            </nav>

            {/* Theme switcher: once, in the bar, for every screen size */}
            <ThemeSwitcher />

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center">
              <button
                ref={menuButtonRef}
                onClick={toggleMobileMenu}
                type="button"
                className="inline-flex h-11 w-11 items-center justify-center rounded-md text-foreground-muted hover:text-foreground hover:bg-surface-muted"
                aria-controls="mobile-menu"
                aria-expanded={isMobileMenuOpen}
              >
                <span className="sr-only">
                  {isMobileMenuOpen ? "Close main menu" : "Open main menu"}
                </span>
                {/* Icon for hamburger menu */}
                {!isMobileMenuOpen ? (
                  <svg
                    className="block h-6 w-6"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 6h16M4 12h16m-7 6h7"
                    />
                  </svg>
                ) : (
                  <svg
                    className="block h-6 w-6"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu: always rendered, so the toggle's aria-controls is valid; `hidden` while closed. */}
      <div className="md:hidden" id="mobile-menu" hidden={!isMobileMenuOpen}>
        <nav aria-label="Main" className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t border-border">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.url}
              item={item}
              pathname={pathname}
              className="block text-base"
              onClick={closeMobileMenu}
            />
          ))}
          <div className="pt-2">
            <Button
              href={SLACK_PAGE.url}
              variant="primary"
              size="md"
              className="block w-full text-center"
              onClick={closeMobileMenu}
            >
              {SLACK_PAGE.title}
            </Button>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;
