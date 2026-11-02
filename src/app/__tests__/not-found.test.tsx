import { render, screen } from "@testing-library/react";
import NotFound, { metadata } from "../not-found";

test("explains the 404 and links back to the homepage and the news", () => {
  render(<NotFound />);
  expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
  expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Page not found");
  expect(screen.getByRole("link", { name: "Go to the homepage" })).toHaveAttribute("href", "/");
  expect(screen.getByRole("link", { name: "Read the latest news" })).toHaveAttribute("href", "/news");
  expect(metadata.title).toBe("Page not found");
});
