/**
 * Post title heading component.
 *
 * Renders a large, prominent heading for a post or page.
 */

import { ReactNode } from "react";

type Props = {
  children?: ReactNode;
};

/**
 * Displays a large heading for a post or page.
 *
 * @param children - The heading content
 */
export function PostTitle({ children }: Props) {
  return (
    <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter leading-tight md:leading-none mb-12 text-center md:text-left">
      {children}
    </h1>
  );
}
