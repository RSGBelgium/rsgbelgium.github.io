/**
 * Main site header and navigation component.
 *
 * Renders the top navigation bar, logo, and theme switcher for the site.
 * Includes responsive mobile menu support. The theme switcher sits in the
 * header bar itself, outside the menus, so it is visible on every screen
 * size and doesn't remount (and flash) each time the mobile menu opens.
 */

"use client"; // For useState to handle mobile menu toggle

import cn from "classnames";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import Button from "@/components/Button"; // Assuming Button component path
import { ThemeSwitcher } from "./theme-switcher"; // Import ThemeSwitcher
import { NAV_ITEMS, SLACK_PAGE } from "@/lib/navigation";

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
 * Classes for a nav link: the current section is filled with the primary
 * colour, the others get the same fill on hover.
 *
 * @param isCurrent - Whether the link is the current section
 */
function navLinkClasses(isCurrent: boolean): string {
  return cn(
    "rounded-md px-3 py-2 font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-strong",
    isCurrent
      ? "bg-primary text-primary-foreground"
      : "text-foreground hover:bg-primary hover:text-primary-foreground"
  );
}

/**
 * Displays the main site header with navigation and theme switcher.
 */
const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="bg-surface border-b border-border shadow-md sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo (one size smaller on the narrowest phones, to leave room for the theme switcher) */}
          <div className="flex-shrink-0">
            <Link href="/" className="text-xl min-[375px]:text-2xl font-bold text-link hover:text-accent-strong transition-colors">
              RSG-Belgium
            </Link>
          </div>

          <div className="flex items-center gap-2 md:gap-4">
            {/* Desktop Navigation */}
            <nav className="hidden md:flex md:items-center md:space-x-4">
              {NAV_ITEMS.map((item) => {
                const isCurrent = isCurrentSection(pathname, item.url);
                return (
                  <Link
                    key={item.title}
                    href={item.url}
                    aria-current={isCurrent ? "page" : undefined}
                    className={cn(navLinkClasses(isCurrent), "text-sm")}
                  >
                    {item.title}
                  </Link>
                );
              })}
              <Button href={SLACK_PAGE.url} variant="primary" size="sm">
                {SLACK_PAGE.title}
              </Button>
            </nav>

            {/* Theme switcher: once, in the bar, for every screen size */}
            <ThemeSwitcher />

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={toggleMobileMenu}
                type="button"
                className="inline-flex items-center justify-center p-2 rounded-md text-foreground-muted hover:text-foreground hover:bg-surface-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-accent-strong"
                aria-controls="mobile-menu"
                aria-expanded={isMobileMenuOpen}
              >
                <span className="sr-only">Open main menu</span>
                {/* Icon for hamburger menu */}
                {!isMobileMenuOpen ? (
                  <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
                  </svg>
                ) : (
                  <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden" id="mobile-menu">
          <nav className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t border-border">
            {NAV_ITEMS.map((item) => {
              const isCurrent = isCurrentSection(pathname, item.url);
              return (
                <Link
                  key={item.title}
                  href={item.url}
                  aria-current={isCurrent ? "page" : undefined}
                  className={cn(navLinkClasses(isCurrent), "block text-base")}
                  onClick={() => setIsMobileMenuOpen(false)} // Close menu on click
                >
                  {item.title}
                </Link>
              );
            })}
            <div className="pt-2">
              <Button href={SLACK_PAGE.url} variant="primary" size="sm" className="w-full text-center">
                {SLACK_PAGE.title}
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
