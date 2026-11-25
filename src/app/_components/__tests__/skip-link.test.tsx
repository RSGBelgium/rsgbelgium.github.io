import { render, screen } from "@testing-library/react";
import SkipLink from "../skip-link";

test("links to the main content and is only visible on focus", () => {
  render(<SkipLink targetId="main-content" />);
  const link = screen.getByRole("link", { name: "Skip to main content" });
  expect(link).toHaveAttribute("href", "#main-content");
  expect(link).toHaveClass("sr-only", "focus:not-sr-only");
});
