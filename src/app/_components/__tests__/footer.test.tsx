import { render, screen, within } from "@testing-library/react";
import Footer from "../footer";

describe("Footer", () => {
  test("has a labelled footer navigation", () => {
    render(<Footer />);
    const nav = screen.getByRole("navigation", { name: "Footer" });
    expect(
      within(nav)
        .getAllByRole("link")
        .map((link) => link.getAttribute("href")),
    ).toEqual(["/about", "/news", "/organization", "/contact"]);
  });

  test("links to the Discord page once, as a contact channel", () => {
    const { container } = render(<Footer />);
    const discordLinks = container.querySelectorAll('a[href="/discord"]');
    expect(discordLinks).toHaveLength(1);
    expect(discordLinks[0]).toHaveTextContent("Discord");
  });

  test("lists the four contact channels with icons and labels", () => {
    render(<Footer />);
    const connect = screen.getByRole("heading", {
      level: 2,
      name: "Connect With Us",
    }).parentElement!;
    const links = within(connect).getAllByRole("link");
    // The visible label, without the screen-reader-only "(opens in a new tab)".
    expect(links.map((link) => link.querySelector("span:not(.sr-only)")?.textContent)).toEqual([
      "Email",
      "GitHub",
      "Discord",
      "LinkedIn",
    ]);
    links.forEach((link) => expect(link.querySelector('svg[aria-hidden="true"]')).not.toBeNull());
    expect(screen.getByRole("link", { name: "LinkedIn (opens in a new tab)" })).toHaveAttribute(
      "target",
      "_blank",
    );
  });

  test("has no Twitter or Facebook links", () => {
    const { container } = render(<Footer />);
    expect(container.innerHTML).not.toMatch(/twitter|facebook/i);
  });

  test("uses h2 section titles, continuing the page's outline", () => {
    render(<Footer />);
    expect(screen.getAllByRole("heading").map((heading) => heading.tagName)).toEqual([
      "H2",
      "H2",
      "H2",
    ]);
  });

  test("shows the current year in the copyright", () => {
    render(<Footer />);
    expect(
      screen.getByText(new RegExp(`© ${new Date().getFullYear()} RSG-Belgium`)),
    ).toBeInTheDocument();
  });
});
