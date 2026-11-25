/**
 * The title block at the top of a page: the page's `<h1>` and a short
 * description below it.
 *
 * Every page except the home page (which has its hero) and the news posts
 * (which have their own header) starts with it, so page titles look the same
 * everywhere: left-aligned on the page-width wrapper, 36px on phones and
 * 44px from `md`. Headings further down the page are `<h2>`s, styled with
 * SECTION_HEADING so they stay clearly smaller than the title.
 */

type PageHeaderProps = {
  title: string;
  description: string;
  /** A short label above the title, e.g. "Error 404". */
  eyebrow?: string;
};

/** Classes for a page's section headings (`<h2>`): 24px on phones, 30px from `md`. */
export const SECTION_HEADING = "text-2xl md:text-3xl font-bold tracking-tight leading-snug";

/** Classes for a short label above a title or heading, e.g. "Error 404": small pink capitals. */
export const EYEBROW = "text-sm font-semibold uppercase tracking-wide text-accent-strong";

/**
 * Displays a page's title (`<h1>`) and description.
 *
 * Both are required, so that every page states its own title instead of
 * silently inheriting another page's.
 *
 * @param title - The page's title, rendered as its only `<h1>`
 * @param description - One or two sentences about the page (a paragraph, not a heading)
 * @param eyebrow - Optional short label shown above the title
 */
export function PageHeader({ title, description, eyebrow }: PageHeaderProps) {
  return (
    <div className="pt-10 pb-8 md:pt-16 md:pb-12">
      {eyebrow && <p className={`${EYEBROW} mb-2`}>{eyebrow}</p>}
      <h1 className="text-4xl md:text-6xl font-bold tracking-tight leading-tight text-balance">
        {title}
      </h1>
      <p className="mt-4 max-w-3xl text-lg md:text-xl leading-relaxed text-foreground-muted">
        {description}
      </p>
    </div>
  );
}
