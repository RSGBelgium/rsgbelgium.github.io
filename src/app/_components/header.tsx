/**
 * Main site header and navigation component.
 *
 * Renders the top navigation bar, logo, and theme switcher for the site.
 * Includes responsive mobile menu support.
 */

"use client"; // For useState to handle mobile menu toggle

import Link from "next/link";
import { useState } from "react";
import Button from "@/components/Button"; // Assuming Button component path
import { ThemeSwitcher } from "./theme-switcher"; // Import ThemeSwitcher

const navItems = [
  { title: "About", url: "/about" },
  { title: "News", url: "/news" },
  { title: "Organization", url: "/organization" },
  { title: "Contact", url: "/contact" }, // Changed "Contact us" to "Contact" for brevity
];

/**
 * Displays the main site header with navigation and theme switcher.
 */
const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="bg-white dark:bg-slate-900 shadow-md sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="text-2xl font-bold text-primary hover:text-secondary dark:text-lightblue dark:hover:text-white">
              RSG-Belgium
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex md:items-center md:space-x-4">
            {navItems.map((item) => (
              <Link
                key={item.title}
                href={item.url}
                className="px-3 py-2 rounded-md text-sm font-medium text-secondary hover:bg-primary hover:text-white transition-colors dark:text-lightblue dark:hover:bg-secondary dark:hover:text-white"
              >
                {item.title}
              </Link>
            ))}
            <Button href="/slack" variant="primary" size="sm">
              Join Slack
            </Button>
            <ThemeSwitcher /> {/* Add ThemeSwitcher here */}
          </nav>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMobileMenu}
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
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

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden" id="mobile-menu">
          <nav className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t border-gray-200">
            {navItems.map((item) => (
              <Link
                key={item.title}
                href={item.url}
                className="block px-3 py-2 rounded-md text-base font-medium text-secondary hover:bg-primary hover:text-white transition-colors dark:text-lightblue dark:hover:bg-secondary dark:hover:text-white"
                onClick={() => setIsMobileMenuOpen(false)} // Close menu on click
              >
                {item.title}
              </Link>
            ))}
            <div className="pt-2">
              <Button href="/slack" variant="primary" size="sm" className="w-full text-center">
                Join Slack
              </Button>
            </div>
            <div className="pt-4 pb-2 px-2"> {/* Add ThemeSwitcher to mobile menu */}
              <ThemeSwitcher />
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
