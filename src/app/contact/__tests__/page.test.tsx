import { render, screen, within } from "@testing-library/react";
import { CONTACT_CHANNELS } from "@/lib/social";
import ContactPage, { metadata } from "../page";

describe("Contact page", () => {
  test("has one h1", () => {
    render(<ContactPage />);
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Get in Touch");
  });

  test("shows one card per contact channel: Email, GitHub, Slack and LinkedIn", () => {
    render(<ContactPage />);
    const cards = screen.getAllByRole("listitem");
    expect(cards).toHaveLength(4);
    expect(
      cards.map((card) => within(card).getByRole("heading", { level: 2 }).textContent),
    ).toEqual(["Email", "GitHub", "Slack", "LinkedIn"]);
  });

  test("gives every card exactly one descriptive link", () => {
    render(<ContactPage />);
    screen.getAllByRole("listitem").forEach((card, index) => {
      const channel = CONTACT_CHANNELS[index];
      const links = within(card).getAllByRole("link");
      expect(links).toHaveLength(1);
      expect(links[0]).toHaveAttribute("href", channel.href);
      expect(links[0]).toHaveTextContent(channel.linkText);
    });
  });

  test("marks the external links as opening in a new tab", () => {
    render(<ContactPage />);
    expect(
      screen.getByRole("link", { name: "github.com/RSGBelgium (opens in a new tab)" }),
    ).toHaveAttribute("target", "_blank");
    expect(screen.getByRole("link", { name: "Request an invitation" })).not.toHaveAttribute(
      "target",
    );
  });

  test("has no contact form and no Twitter or Facebook links", () => {
    const { container } = render(<ContactPage />);
    expect(container.querySelector("form")).toBeNull();
    expect(screen.queryByRole("textbox")).not.toBeInTheDocument();
    expect(container.innerHTML).not.toMatch(/twitter|facebook/i);
  });

  test("sets its title and canonical URL", () => {
    expect(metadata.title).toBe("Contact Us");
    expect(metadata.alternates?.canonical).toBe("/contact");
  });
});
