/**
 * Main site footer component.
 *
 * Renders the footer with navigation links, social media, and contact info.
 * Includes copyright and optional legal links.
 */

import Link from 'next/link';
import Container from "@/app/_components/container";

// Re-define navItems here or import from a shared constants file if created
const navItems = [
  { title: "About", url: "/about" },
  { title: "News", url: "/news" },
  { title: "Organization", url: "/organization" },
  { title: "Contact", url: "/contact" },
  { title: "Join Slack", url: "/slack"}, // Added Slack as it's a prominent CTA
];

// Placeholder social media links - these should be updated with actual URLs
const socialLinks = [
  { name: 'Twitter', url: 'https://twitter.com/rsgbelgium', icon: 'fab fa-twitter' }, // Example icon class
  { name: 'Facebook', url: 'https://www.facebook.com/RSGBelgium', icon: 'fab fa-facebook' },
  // { name: 'GitHub', url: '#', icon: 'fab fa-github' }, // Add if RSG-Belgium has a GitHub
  { name: 'LinkedIn', url: 'https://www.linkedin.com/company/rsg-belgium/', icon: 'fab fa-linkedin' }, // Example: if a company page exists
];

/**
 * Displays the main site footer with navigation, social links, and contact info.
 */
export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-800 text-gray-300 border-t border-gray-700">
      <Container>
        <div className="py-12 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* About Section */}
            <div className="mb-6 md:mb-0">
              <h3 className="text-lg font-semibold text-white mb-3">RSG-Belgium</h3>
              <p className="text-sm leading-relaxed">
                Fostering a community of bioinformatics and computational biology students and young researchers in Belgium.
              </p>
            </div>

            {/* Navigation Links */}
            <div className="mb-6 md:mb-0">
              <h3 className="text-lg font-semibold text-white mb-3">Quick Links</h3>
              <ul className="space-y-2">
                {navItems.map((item) => (
                  <li key={item.title}>
                    <Link href={item.url} className="text-sm text-lightblue hover:text-white hover:underline transition-colors">
                      {item.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Social Media & Contact */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-3 dark:text-lightblue">Connect With Us</h3>
              {socialLinks.length > 0 && (
                <div className="flex space-x-4 mb-4">
                  {socialLinks.map((social) => (
                    <a
                      key={social.name}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-lightblue hover:text-white transition-colors"
                      aria-label={social.name}
                    >
                      {/* Placeholder for actual icons - using text for now */}
                      {/* In a real app, you'd use an icon library e.g. <i className={social.icon}></i> or SVG icons */}
                      <span className="text-xl">{social.name.charAt(0)}</span>
                    </a>
                  ))}
                </div>
              )}
              <p className="text-sm text-lightblue">
                Email: <a href="mailto:iscb.rsg.belgium@gmail.com" className="hover:text-white hover:underline text-lightblue">iscb.rsg.belgium@gmail.com</a>
              </p>
            </div>
          </div>

          <div className="mt-10 pt-8 border-t border-gray-700 text-center">
            <p className="text-sm">
              &copy; {currentYear} RSG-Belgium. All rights reserved.
            </p>
            {/* Optional: Link to a privacy policy or terms page if they exist */}
            {/* <p className="text-xs mt-1">
              <Link href="/privacy" className="hover:underline">Privacy Policy</Link>
            </p> */}
          </div>
        </div>
      </Container>
    </footer>
  );
}

export default Footer;
