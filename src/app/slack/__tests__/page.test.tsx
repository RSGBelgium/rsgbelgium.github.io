import { render, screen } from "@testing-library/react";
import { DISCORD_INVITE_URL } from "@/lib/social";
import SlackPage, { metadata } from "../page";

describe("/slack page", () => {
  test("forwards to the Discord page at once, without JavaScript", () => {
    render(<SlackPage />);
    expect(document.querySelector('meta[http-equiv="refresh"]')).toHaveAttribute(
      "content",
      "0;url=/discord",
    );
  });

  test("invites visitors to join us on Discord directly", () => {
    render(<SlackPage />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Join us on Discord");
    expect(
      screen.getByRole("link", { name: "Join Our Discord Server (opens in a new tab)" }),
    ).toHaveAttribute("href", DISCORD_INVITE_URL);
  });

  test("says nothing about Slack", () => {
    const { container } = render(<SlackPage />);
    expect(container.textContent).not.toMatch(/slack|moved/i);
    expect(metadata.title).toBe("Join Us on Discord");
    expect(metadata.description).not.toMatch(/slack|moved/i);
  });

  test("gives the Discord page as its canonical URL", () => {
    expect(metadata.alternates?.canonical).toBe("/discord");
  });
});
