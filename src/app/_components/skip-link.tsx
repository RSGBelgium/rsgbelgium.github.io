/**
 * "Skip to main content" link.
 *
 * The first focusable element on every page, so keyboard and screen-reader
 * users can jump past the header navigation. It is visually hidden until it
 * receives focus, then appears in the top-left corner above the sticky header.
 */

type Props = {
  /** Id of the element to jump to; it needs tabIndex={-1} so it can take focus. */
  targetId: string;
};

/**
 * Renders a visually hidden link that becomes visible on keyboard focus.
 *
 * A plain `<a>` rather than next/link: it only moves to an anchor on the
 * current page, and the browser then moves focus to the target as well.
 *
 * @param targetId - Id of the main content element, without "#"
 */
export default function SkipLink({ targetId }: Props) {
  return (
    <a
      href={`#${targetId}`}
      className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-md focus:border focus:border-border focus:bg-surface focus:px-4 focus:py-3 focus:font-semibold focus:text-link focus:shadow-md focus:outline-none focus:ring-2 focus:ring-accent-strong"
    >
      Skip to main content
    </a>
  );
}
