/**
 * The site's page-width wrapper.
 *
 * Centres its content, at most 72rem (1152px) wide, with 1rem side padding
 * on phones, 1.5rem from `sm` and 2rem from `lg`. The header, every page and
 * the footer put their content in it, so everything starts at the same left
 * edge on every screen size. Full-width backgrounds (the header bar, the home
 * page hero, the footer) go on an element around the container.
 */

import cn from "classnames";

type Props = {
  children?: React.ReactNode;
  /** Extra classes, e.g. vertical padding; don't change the width or the side padding. */
  className?: string;
};

/**
 * Renders the centred, padded page-width wrapper.
 *
 * @param children - Content to display inside the container
 * @param className - Extra classes for the wrapper
 */
const Container = ({ children, className }: Props) => {
  return (
    <div className={cn("mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8", className)}>{children}</div>
  );
};

export default Container;
