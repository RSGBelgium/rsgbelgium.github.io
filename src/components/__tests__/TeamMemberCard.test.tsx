import { render, screen } from "@testing-library/react";
import TeamMemberCard from "../TeamMemberCard";

const props = {
  name: "Jane Doe",
  title: "President",
};

describe("TeamMemberCard", () => {
  test("renders the name as a heading and the board role", () => {
    render(<TeamMemberCard {...props} />);
    expect(screen.getByRole("heading", { level: 3, name: "Jane Doe" })).toBeInTheDocument();
    expect(screen.getByText("President")).toBeInTheDocument();
  });

  test("joins the affiliation, position and city that are set", () => {
    const { rerender } = render(
      <TeamMemberCard {...props} affiliation="KU Leuven" position="PhD student" city="Leuven" />,
    );
    expect(screen.getByText("KU Leuven · PhD student · Leuven")).toBeInTheDocument();

    rerender(<TeamMemberCard {...props} affiliation="KU Leuven" city="Leuven" />);
    expect(screen.getByText("KU Leuven · Leuven")).toBeInTheDocument();
  });

  test("shows the photo as a decorative image", () => {
    const { container } = render(<TeamMemberCard {...props} image="/images/team/jane.jpg" />);
    const image = container.querySelector("img");
    expect(image).toHaveAttribute("alt", "");
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
  });

  test("shows hidden initials without a photo", () => {
    render(<TeamMemberCard {...props} />);
    const initials = screen.getByText("JD");
    expect(initials).toHaveAttribute("aria-hidden", "true");
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
  });

  test("links to LinkedIn and ORCID in a new tab, saying so", () => {
    render(
      <TeamMemberCard
        {...props}
        linkedin="https://www.linkedin.com/in/janedoe"
        orcid="https://orcid.org/0000-0000-0000-0000"
      />,
    );

    const linkedin = screen.getByRole("link", {
      name: "Jane Doe on LinkedIn (opens in a new tab)",
    });
    expect(linkedin).toHaveAttribute("href", "https://www.linkedin.com/in/janedoe");
    expect(linkedin).toHaveAttribute("target", "_blank");
    expect(linkedin).toHaveAttribute("rel", "noopener noreferrer");

    const orcid = screen.getByRole("link", { name: "Jane Doe on ORCID (opens in a new tab)" });
    expect(orcid).toHaveAttribute("href", "https://orcid.org/0000-0000-0000-0000");
  });

  test("renders no profile links when there are none", () => {
    render(<TeamMemberCard {...props} />);
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
  });

  test("renders the bio HTML", () => {
    render(<TeamMemberCard {...props} bioHtml="<p>Jane studies <strong>genomics</strong>.</p>" />);
    expect(screen.getByText("genomics").tagName).toBe("STRONG");
  });
});
