import { render, screen } from "@testing-library/react";
import SponsorCallout from "../SponsorCallout";

describe("SponsorCallout", () => {
  test("invites organizations to sponsor the symposium or Beerformatics", () => {
    render(<SponsorCallout />);
    expect(
      screen.getByRole("heading", { level: 2, name: "Sponsor Our Events" }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/support the XAI x Bio Symposium or our Beerformatics series/),
    ).toBeInTheDocument();
  });

  test("links to the Sponsor page with a primary button", () => {
    render(<SponsorCallout />);
    const link = screen.getByRole("link", { name: "Become a Sponsor" });
    expect(link).toHaveAttribute("href", "/sponsor");
    expect(link).toHaveClass("button-primary");
  });

  test("names no dates, so it doesn't go out of date", () => {
    const { container } = render(<SponsorCallout />);
    expect(container.textContent).not.toMatch(/\d/);
  });
});
