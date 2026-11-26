import { act, fireEvent, render, screen, within } from "@testing-library/react";
import { usePathname } from "next/navigation";
import Header from "../header";

jest.mock("next/navigation", () => ({
  usePathname: jest.fn(),
}));

/** The mobile menu toggle, found by its current accessible name. */
const toggle = (name: "Open main menu" | "Close main menu") => screen.getByRole("button", { name });

/** The mobile menu container; it is always in the DOM. */
const mobileMenu = () => document.getElementById("mobile-menu")!;

describe("Header", () => {
  beforeEach(() => {
    jest.mocked(usePathname).mockReturnValue("/news/2026-05-15-some-post");
  });

  test("links the site name to the homepage", () => {
    render(<Header />);
    expect(screen.getByRole("link", { name: "RSG-Belgium" })).toHaveAttribute("href", "/");
  });

  test("marks the current section in the navigation", () => {
    render(<Header />);
    const desktopNav = screen.getAllByRole("navigation", { name: "Main" })[0];
    const news = within(desktopNav).getByRole("link", { name: "News" });
    expect(news).toHaveAttribute("aria-current", "page");
    expect(within(desktopNav).getByRole("link", { name: "About" })).not.toHaveAttribute(
      "aria-current",
    );
    expect(within(desktopNav).getByRole("link", { name: "Join Discord" })).toHaveAttribute(
      "href",
      "/discord",
    );
  });

  test("renders the theme switcher once", () => {
    render(<Header />);
    expect(screen.getAllByRole("group", { name: "Colour theme" })).toHaveLength(1);
  });

  test("leaves out the Sponsor page: the desktop bar has no room for it", () => {
    const { container } = render(<Header />);
    expect(container.querySelector('a[href="/sponsor"]')).toBeNull();
  });

  describe("mobile menu", () => {
    test("is a closed disclosure that stays in the DOM", () => {
      render(<Header />);
      const button = toggle("Open main menu");
      expect(button).toHaveAttribute("aria-expanded", "false");
      expect(button).toHaveAttribute("aria-controls", "mobile-menu");
      expect(mobileMenu()).toBeInTheDocument();
      expect(mobileMenu()).not.toBeVisible();
    });

    test("opens and closes with the toggle, updating aria-expanded and the label", () => {
      render(<Header />);
      fireEvent.click(toggle("Open main menu"));
      expect(toggle("Close main menu")).toHaveAttribute("aria-expanded", "true");
      expect(mobileMenu()).toBeVisible();

      fireEvent.click(toggle("Close main menu"));
      expect(toggle("Open main menu")).toHaveAttribute("aria-expanded", "false");
      expect(mobileMenu()).not.toBeVisible();
    });

    test("closes on Escape and puts focus back on the toggle", () => {
      render(<Header />);
      fireEvent.click(toggle("Open main menu"));
      within(mobileMenu()).getByRole("link", { name: "About" }).focus();

      fireEvent.keyDown(document, { key: "Escape" });

      expect(mobileMenu()).not.toBeVisible();
      expect(toggle("Open main menu")).toHaveFocus();
    });

    test("ignores other keys", () => {
      render(<Header />);
      fireEvent.click(toggle("Open main menu"));
      fireEvent.keyDown(document, { key: "Enter" });
      expect(mobileMenu()).toBeVisible();
    });

    test("closes when a link in it is clicked", () => {
      render(<Header />);
      fireEvent.click(toggle("Open main menu"));
      const about = within(mobileMenu()).getByRole("link", { name: "About" });
      about.addEventListener("click", (event) => event.preventDefault());
      fireEvent.click(about);
      expect(mobileMenu()).not.toBeVisible();
    });

    test("closes when the page changes", () => {
      const { rerender } = render(<Header />);
      fireEvent.click(toggle("Open main menu"));
      expect(mobileMenu()).toBeVisible();

      jest.mocked(usePathname).mockReturnValue("/about");
      act(() => rerender(<Header />));
      expect(mobileMenu()).not.toBeVisible();
    });
  });
});
