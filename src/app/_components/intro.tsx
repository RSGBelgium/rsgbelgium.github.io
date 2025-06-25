/**
 * Section intro/header component.
 *
 * Renders a prominent title and description for a page or section.
 */

import { SITE_NAME } from "@/lib/constants";

type IntroProps = {
  title?: string;
  description?: string;
};

/**
 * Displays a section or page introduction with a title and description.
 *
 * @param title - The main heading for the section (default: "News")
 * @param description - Supporting text (default: news/events for SITE_NAME)
 */
export function Intro({
  title = "News",
  description = `Stay updated with the latest news and events from ${SITE_NAME}.`
}: IntroProps) {
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
