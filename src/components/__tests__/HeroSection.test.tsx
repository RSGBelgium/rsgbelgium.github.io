import { render, screen } from "@testing-library/react";
import HeroSection from "../HeroSection";

const props = {
  headline: "Welcome to RSG Belgium",
  introText: "Your hub for bioinformatics students.",
  ctaLabel: "Learn More About Us",
  ctaLink: "/about",
};

describe("HeroSection", () => {
  test("renders the headline as the page's h1", () => {
    render(<HeroSection {...props} />);
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(props.headline);
  });

  test("renders the intro text and the call-to-action link", () => {
    render(<HeroSection {...props} />);
    expect(screen.getByText(props.introText)).toBeInTheDocument();
    const cta = screen.getByRole("link", { name: props.ctaLabel });
    expect(cta).toHaveAttribute("href", props.ctaLink);
    expect(cta).toHaveClass("button-inverse");
  });

  test("shows the logo, with a variant for the dark theme", () => {
    render(<HeroSection {...props} />);
    const logos = screen.getAllByRole("img", { name: "RSG Belgium Logo" });
    expect(logos).toHaveLength(2);
    expect(logos[0]).toHaveClass("dark:hidden");
    expect(logos[1]).toHaveClass("hidden", "dark:block");
  });
});
