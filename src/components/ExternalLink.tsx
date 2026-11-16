/**
 * Link to another website.
 *
 * Opens in a new tab, with `rel="noopener noreferrer"` so the other site
 * can't control this one, and ends with a visually hidden "(opens in a new
 * tab)" so screen-reader users know before they follow it. Used for every
 * external link rendered by a component (contact channels, profile links);
 * links inside markdown get the same attributes from src/lib/markdownToHtml.ts.
 */

import type { AnchorHTMLAttributes, ReactNode } from "react";

type ExternalLinkProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "target" | "rel"> & {
  href: string;
  /** The link's content; it must include text, which becomes its accessible name. */
  children: ReactNode;
};

/**
 * Renders a link that opens another website in a new tab.
 *
 * @param href - Absolute URL of the other website
 * @param children - The link's content
 */
export default function ExternalLink({ href, children, ...props }: ExternalLinkProps) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" {...props}>
      {children}
      <span className="sr-only"> (opens in a new tab)</span>
    </a>
  );
}
