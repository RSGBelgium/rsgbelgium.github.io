import { render, screen, within } from "@testing-library/react";
import { statSync } from "fs";
import { formatFileSize } from "@/lib/file-size";
import { CONTACT_EMAIL } from "@/lib/social";
import SponsorPage, { metadata } from "../page";

/** The proposals' PDFs, in the order of the cards. */
const PDFS = [
  "/assets/pdf/2027-xai-bio-symposium-sponsorship-proposal.pdf",
  "/assets/pdf/2026-11-25-beerformatics-sponsorship-proposal.pdf",
];

/** The size of a PDF in public/ as the page shows it, read from the file itself. */
const sizeOf = (pdf: string) => formatFileSize(statSync(`public${pdf}`).size);

/** The card of a proposal, found by its heading. */
const card = (name: string) =>
  screen.getByRole("heading", { level: 2, name }).closest("li") as HTMLElement;

describe("Sponsor page", () => {
  test("has one h1, an h2 per proposal and one to get in touch", () => {
    render(<SponsorPage />);
    const h1s = screen.getAllByRole("heading", { level: 1 });
    expect(h1s).toHaveLength(1);
    expect(h1s[0].textContent).toBe("Sponsor Our Events");
    expect(
      screen.getAllByRole("heading", { level: 2 }).map((heading) => heading.textContent),
    ).toEqual(["XAI x Bio Symposium", "Beerformatics", "Get in Touch"]);
  });

  test("gives every proposal card exactly one link: its PDF, named with its type and size", () => {
    render(<SponsorPage />);
    const cards = screen.getAllByRole("listitem");
    expect(cards).toHaveLength(2);
    const links = cards.map((item) => {
      const itemLinks = within(item).getAllByRole("link");
      expect(itemLinks).toHaveLength(1);
      return itemLinks[0];
    });

    expect(links.map((link) => link.getAttribute("href"))).toEqual(PDFS);
    expect(links[0]).toHaveAccessibleName(
      `XAI x Bio sponsorship proposal (PDF, ${sizeOf(PDFS[0])})`,
    );
    expect(links[1]).toHaveAccessibleName(
      `Beerformatics sponsorship proposal (PDF, ${sizeOf(PDFS[1])})`,
    );
    // A PDF opens in the same tab, like any link to a file.
    links.forEach((link) => expect(link).not.toHaveAttribute("target"));
  });

  test("states the symposium's date, place, packages and deadline", () => {
    render(<SponsorPage />);
    const symposium = card("XAI x Bio Symposium");
    expect(symposium).toHaveTextContent("April 2027 in Leuven (final date to be confirmed)");
    expect(symposium).toHaveTextContent("Gold €1,000, Silver €500, Bronze €250");
    expect(symposium).toHaveTextContent("Sponsorship deadlineFebruary 2027");
  });

  test("describes Beerformatics as a recurring series, not by the date of one evening", () => {
    const { container } = render(<SponsorPage />);
    expect(card("Beerformatics")).toHaveTextContent("Our recurring series of short research talks");
    expect(container.textContent).not.toMatch(/25 November|November 2026/);
  });

  test("gives the e-mail address to write to, which breaks only before its @", () => {
    const { container } = render(<SponsorPage />);
    // Found by its href: jsdom, unlike browsers, puts a space at the aria-hidden <wbr> in its name.
    const link = container.querySelector(`a[href="mailto:${CONTACT_EMAIL}"]`);
    expect(link?.innerHTML).toBe(CONTACT_EMAIL.replace("@", '<wbr aria-hidden="true">@'));
    // Kept on one line with its full stop when it fits.
    expect(link?.parentElement).toHaveClass("inline-block");
    expect(link?.parentElement).toHaveTextContent(`${CONTACT_EMAIL}.`);
  });

  test("sets its title and canonical URL", () => {
    expect(metadata.title).toBe("Sponsor Our Events");
    expect(metadata.alternates?.canonical).toBe("/sponsor");
  });
});
