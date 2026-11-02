import { render, screen } from "@testing-library/react";
import type { Member } from "@/interfaces/member";
import TeamSpotlight from "../TeamSpotlight";

const members: Member[] = [
  {
    slug: "alpha",
    order: 1,
    name: "Alpha Person",
    title: "President",
    image: "/images/team/alpha.jpg",
  },
  { slug: "beta", order: 2, name: "Beta Tester", title: "", image: "" },
];

describe("TeamSpotlight", () => {
  test("renders the section heading", () => {
    render(<TeamSpotlight members={members} />);
    expect(screen.getByRole("heading", { level: 2, name: "Meet the Team" })).toBeInTheDocument();
  });

  test("renders each member's name and board role", () => {
    render(<TeamSpotlight members={members} />);
    expect(
      screen.getAllByRole("heading", { level: 3 }).map((heading) => heading.textContent),
    ).toEqual(["Alpha Person", "Beta Tester"]);
    expect(screen.getByText("President")).toBeInTheDocument();
  });

  test("shows decorative avatars: the photo, or the initials", () => {
    const { container } = render(<TeamSpotlight members={members} />);
    expect(container.querySelector("img")).toHaveAttribute("alt", "");
    expect(screen.getByText("BT")).toHaveAttribute("aria-hidden", "true");
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
  });

  test("links to the full team", () => {
    render(<TeamSpotlight members={members} />);
    expect(screen.getByRole("link", { name: "View Full Team" })).toHaveAttribute(
      "href",
      "/organization",
    );
  });

  test("renders nothing without members", () => {
    const { container } = render(<TeamSpotlight members={[]} />);
    expect(container).toBeEmptyDOMElement();
  });
});
