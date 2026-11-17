/**
 * Section intro/header component.
 *
 * Renders a prominent title and description for a page or section.
 */

type IntroProps = {
  title: string;
  description: string;
};

/**
 * Displays a page introduction with the page's `<h1>` title and a short description.
 *
 * Both props are required, so that every page states its own title instead of
 * silently inheriting another page's.
 *
 * @param title - The main heading for the page (rendered as `<h1>`, followed by a period)
 * @param description - Supporting text shown next to the title
 */
export function Intro({ title, description }: IntroProps) {
  return (
    <section className="flex-col md:flex-row flex items-center md:justify-between mt-16 mb-16 md:mb-12">
      <h1 className="text-5xl md:text-8xl font-bold tracking-tighter leading-tight md:pr-8">
        {title}.
      </h1>
      <h4 className="text-center md:text-left text-lg mt-5 md:pl-8">
        {description}
      </h4>
    </section>
  );
}
