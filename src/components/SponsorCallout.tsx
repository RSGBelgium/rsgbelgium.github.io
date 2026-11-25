/**
 * Homepage section that invites organizations to sponsor our events.
 *
 * A light blue panel (the `highlight` token, for info panels) with a short
 * pitch and a button to the Sponsor page (SPONSOR_PAGE in
 * src/lib/navigation.ts), which presents the sponsorship proposals. It names
 * the events but no dates, so it doesn't go out of date.
 */

import React from "react";
import Container from "@/app/_components/container";
import { SECTION_HEADING } from "@/app/_components/page-header";
import { SPONSOR_PAGE } from "@/lib/navigation";
import Button from "./Button";

/**
 * Displays the invitation to sponsor our events, with a link to the Sponsor page.
 */
const SponsorCallout: React.FC = () => {
  return (
    <section className="py-4">
      <Container>
        <div className="flex flex-col items-start gap-6 rounded-lg bg-highlight p-6 md:flex-row md:items-center md:justify-between md:p-10">
          <div className="max-w-2xl">
            <h2 className={`${SECTION_HEADING} mb-3 text-foreground`}>Sponsor Our Events</h2>
            <p className="text-lg leading-relaxed text-foreground">
              Put your organization in front of the next generation of bioinformatics talent in
              Belgium: support the XAI x Bio Symposium or our Beerformatics series.
            </p>
          </div>
          <Button href={SPONSOR_PAGE.url} size="lg" className="shrink-0">
            {SPONSOR_PAGE.title}
          </Button>
        </div>
      </Container>
    </section>
  );
};

export default SponsorCallout;
