import { render, screen } from "@testing-library/react";
import { CONTACT_EMAIL } from "@/lib/social";
import SlackPage, { metadata } from "../page";

describe("Slack page", () => {
  test("has one h1 from the intro and an h2 below it", () => {
    render(<SlackPage />);
    const h1s = screen.getAllByRole("heading", { level: 1 });
    expect(h1s).toHaveLength(1);
    expect(h1s[0]).toHaveTextContent("Slack.");
    expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent(
      "Join the RSG Belgium Slack Channel",
    );
  });

  test("hides the decorative emoji from screen readers", () => {
    render(<SlackPage />);
    expect(screen.getByText("💬")).toHaveAttribute("aria-hidden", "true");
    expect(screen.getByRole("heading", { level: 2 })).toHaveAccessibleName(
      "Join the RSG Belgium Slack Channel",
    );
  });

  test("explains how to join", () => {
    render(<SlackPage />);
    expect(
      screen.getByText(/We have created a Slack channel where our members/),
    ).toBeInTheDocument();
    expect(screen.getByText(/To join, please send us an email request/)).toBeInTheDocument();
  });

  test("links to a pre-filled invitation e-mail", () => {
    render(<SlackPage />);
    expect(screen.getByRole("link", { name: "Request Invitation to Join Slack" })).toHaveAttribute(
      "href",
      `mailto:${CONTACT_EMAIL}?Subject=RSG%20Slack%20Subscription&Body=I%20would%20like%20to%20join%20the%20RSG%20Belgium%20Slack%20channel%2E`,
    );
  });

  test("sets its title and canonical URL", () => {
    expect(metadata.title).toBe("Join Us on Slack");
    expect(metadata.alternates?.canonical).toBe("/slack");
  });
});
