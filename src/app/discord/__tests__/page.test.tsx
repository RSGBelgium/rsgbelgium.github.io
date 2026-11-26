import { render, screen } from "@testing-library/react";
import { DISCORD_INVITE_URL } from "@/lib/social";
import DiscordPage, { metadata } from "../page";

describe("Discord page", () => {
  test("has one h1 from the page header and an h2 below it", () => {
    render(<DiscordPage />);
    const h1s = screen.getAllByRole("heading", { level: 1 });
    expect(h1s).toHaveLength(1);
    // The page title, without the blog template's full stop.
    expect(h1s[0].textContent).toBe("Discord");
    expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent(
      "Join the RSG Belgium Discord Server",
    );
  });

  test("hides the decorative emoji from screen readers", () => {
    render(<DiscordPage />);
    expect(screen.getByText("💬")).toHaveAttribute("aria-hidden", "true");
    expect(screen.getByRole("heading", { level: 2 })).toHaveAccessibleName(
      "Join the RSG Belgium Discord Server",
    );
  });

  test("explains how to join", () => {
    render(<DiscordPage />);
    expect(
      screen.getByText(/We have created a Discord server where our members/),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/the invite below takes you straight to the server/),
    ).toBeInTheDocument();
  });

  test("links to the invite, in a new tab", () => {
    render(<DiscordPage />);
    const invite = screen.getByRole("link", {
      name: "Join Our Discord Server (opens in a new tab)",
    });
    expect(invite).toHaveAttribute("href", DISCORD_INVITE_URL);
    expect(invite).toHaveAttribute("target", "_blank");
    expect(invite).toHaveClass("button-primary");
  });

  test("sets its title and canonical URL", () => {
    expect(metadata.title).toBe("Join Us on Discord");
    expect(metadata.alternates?.canonical).toBe("/discord");
  });
});
