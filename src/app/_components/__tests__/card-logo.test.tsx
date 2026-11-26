import { render } from "@testing-library/react";
import CardLogo from "../card-logo";

describe("CardLogo", () => {
  test("shows the RSG-Belgium logo as a decorative image, on our posters' gradient", () => {
    const { container } = render(<CardLogo />);
    expect(container.firstElementChild).toHaveClass(
      "bg-gradient-to-r",
      "from-poster-start",
      "to-poster-end",
    );
    const logo = container.querySelector("img");
    expect(logo).toHaveAttribute("src", "/images/logo/rsgBe.svg");
    expect(logo).toHaveAttribute("alt", "");
  });

  test("takes the shape it is given, like the image it replaces", () => {
    const { container } = render(<CardLogo className="w-full aspect-video" />);
    expect(container.firstElementChild).toHaveClass("w-full", "aspect-video");
  });

  test("keeps the logo whole and centred: three quarters of the tile's height, at most 12rem", () => {
    const { container } = render(<CardLogo className="h-48" />);
    expect(container.querySelector("img")).toHaveClass(
      "absolute",
      "left-1/2",
      "top-1/2",
      "-translate-x-1/2",
      "-translate-y-1/2",
      "h-3/4",
      "max-h-48",
      "w-auto",
    );
  });
});
