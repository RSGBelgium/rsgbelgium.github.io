import { render, screen } from "@testing-library/react";
import MemberAvatar, { getInitials } from "../MemberAvatar";

describe("getInitials", () => {
  test.each([
    ["Abane Louis Ashu", "AA"],
    ["  jane   doe ", "JD"],
    ["Plato", "P"],
    ["Željko Ivanović", "ŽI"],
    ["", ""],
  ])("%j -> %j", (name, initials) => {
    expect(getInitials(name)).toBe(initials);
  });
});

describe("MemberAvatar", () => {
  test("announces the photo with the member's name", () => {
    render(<MemberAvatar name="Jane Doe" image="/images/team/jane.jpg" />);
    expect(screen.getByRole("img", { name: "Jane Doe" })).toBeInTheDocument();
  });

  test("announces the initials as an image with the member's name", () => {
    render(<MemberAvatar name="Jane Doe" />);
    expect(screen.getByRole("img", { name: "Jane Doe" })).toHaveTextContent("JD");
  });

  test("hides a decorative avatar from screen readers", () => {
    render(<MemberAvatar name="Jane Doe" decorative />);
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
    expect(screen.getByText("JD")).toHaveAttribute("aria-hidden", "true");
  });
});
