import { render, screen } from "@testing-library/react";
import AboutPage, { metadata } from "../page";

describe("About page", () => {
  test("has one h1 from the page header", () => {
    render(<AboutPage />);
    const h1s = screen.getAllByRole("heading", { level: 1 });
    expect(h1s).toHaveLength(1);
    // The page title, without the blog template's full stop.
    expect(h1s[0].textContent).toBe("About");
  });

  test("has a section for the welcome, mission, values, events and joining", () => {
    render(<AboutPage />);
    expect(
      screen.getAllByRole("heading", { level: 2 }).map((heading) => heading.textContent),
    ).toEqual([
      "Welcome to RSG Belgium!",
      "Our Mission",
      "Our Values",
      "Our Events",
      "Interested in Joining Us?",
    ]);
    expect(screen.getByText(/ISCB Student Council's Regional Student Groups/)).toBeInTheDocument();
    expect(screen.getByText("Symposia:")).toBeInTheDocument();
  });

  test("links to the Slack page", () => {
    render(<AboutPage />);
    expect(screen.getByRole("link", { name: "Join us on Slack" })).toHaveAttribute(
      "href",
      "/slack",
    );
  });

  test("sets its title and canonical URL", () => {
    expect(metadata.title).toBe("About Us: Our Mission, Values and Events");
    expect(metadata.alternates?.canonical).toBe("/about");
  });
});
