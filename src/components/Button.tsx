/**
 * Reusable button/link component.
 *
 * Renders a styled button or link with variant and size options: a Next.js
 * link for a path on this site, an ExternalLink (a new tab, announced to
 * screen readers) for another website.
 * The variant colours are the `.button-*` classes in src/app/globals.css,
 * built from the theme tokens, so they work in light and dark mode.
 */

import cn from "classnames";
import Link from "next/link";
import React from "react";
import { isAbsoluteUrl } from "@/lib/urls";
import ExternalLink from "./ExternalLink";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  href?: string;
  children: React.ReactNode;
  /**
   * Colour variant (default: "primary"):
   * - primary: solid brand blue, for the main action
   * - secondary: light blue, for secondary actions
   * - outline: bordered, for use on the page background
   * - inverse: white outline, for the hero gradient and other coloured backgrounds
   */
  variant?: "primary" | "secondary" | "outline" | "inverse";
  size?: "sm" | "md" | "lg";
}

const Button: React.FC<ButtonProps> = ({
  href,
  children,
  className,
  variant = "primary",
  size = "md",
  ...props
}) => {
  // Keyboard focus uses the site-wide :focus-visible outline in globals.css.
  const baseStyles = "font-semibold rounded-md transition ease-in-out duration-150";

  const sizeStyles = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg",
  };

  const variantStyles = {
    primary: "button-primary",
    secondary: "button-secondary",
    outline: "button-outline",
    inverse: "button-inverse",
  };

  const combinedClassName = cn(baseStyles, sizeStyles[size], variantStyles[variant], className);

  if (href) {
    // As a link, the remaining props (onClick, aria-*, ...) go on the <a>.
    const linkProps = props as React.AnchorHTMLAttributes<HTMLAnchorElement>;

    if (isAbsoluteUrl(href)) {
      return (
        <ExternalLink href={href} className={combinedClassName} {...linkProps}>
          {children}
        </ExternalLink>
      );
    }

    return (
      <Link href={href} className={combinedClassName} {...linkProps}>
        {children}
      </Link>
    );
  }

  return (
    <button type="button" className={combinedClassName} {...props}>
      {children}
    </button>
  );
};

export default Button;
