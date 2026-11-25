import { render, screen } from "@testing-library/react";
import type { Member } from "@/interfaces/member";
import { getAllMembers } from "@/lib/api";
import OrganizationPage, { metadata } from "../page";
import { makeMember } from "@/test-utils/fixtures";

jest.mock("@/lib/api", () => ({
  getAllMembers: jest.fn(),
}));

const members: Member[] = [
  makeMember({
    slug: "alice",
    order: 1,
    name: "Alice Wonderland",
    title: "President",
    image: "/images/team/alice.jpg",
    affiliation: "KU Leuven",
    linkedin: "https://www.linkedin.com/in/alice",
    orcid: "https://orcid.org/0000-0001-0000-0001",
    content: "Alice studies **genomics**.",
  }),
  makeMember({ slug: "bob", order: 2, name: "Bob </script> Builder" }),
];

/** Renders the async server component and returns its JSON-LD blocks, parsed. */
async function renderOrganizationPage() {
  const { container } = render(await OrganizationPage());
  const scripts = [...container.querySelectorAll('script[type="application/ld+json"]')];
  return { container, scripts, jsonLd: scripts.map((script) => JSON.parse(script.innerHTML)) };
}

describe("Organization page", () => {
  beforeEach(() => {
    jest.mocked(getAllMembers).mockResolvedValue(members);
  });

  test("has one h1 from the page header and the team as an h2", async () => {
    await renderOrganizationPage();
    const h1s = screen.getAllByRole("heading", { level: 1 });
    expect(h1s).toHaveLength(1);
    // The page title, without the blog template's full stop.
    expect(h1s[0].textContent).toBe("Organization");
    expect(screen.getByRole("heading", { level: 2, name: "Our Team" })).toBeInTheDocument();
  });

  test("renders a card per member, in the loader's order, with the bio as HTML", async () => {
    await renderOrganizationPage();
    expect(
      screen.getAllByRole("heading", { level: 3 }).map((heading) => heading.textContent),
    ).toEqual(["Alice Wonderland", "Bob </script> Builder"]);
    expect(screen.getByText("genomics").tagName).toBe("STRONG");
  });

  test("adds schema.org Person data for every member", async () => {
    const { jsonLd } = await renderOrganizationPage();
    expect(jsonLd).toHaveLength(2);

    expect(jsonLd[0]).toEqual({
      "@context": "https://schema.org",
      "@type": "Person",
      name: "Alice Wonderland",
      jobTitle: "President",
      image: "https://rsg-belgium.org/images/team/alice.jpg",
      affiliation: { "@type": "Organization", name: "KU Leuven" },
      memberOf: { "@type": "Organization", name: "RSG-Belgium", url: "https://rsg-belgium.org" },
      url: "https://rsg-belgium.org/organization",
      sameAs: ["https://www.linkedin.com/in/alice", "https://orcid.org/0000-0001-0000-0001"],
    });

    // Empty fields are left out.
    expect(jsonLd[1]).not.toHaveProperty("image");
    expect(jsonLd[1]).not.toHaveProperty("jobTitle");
    expect(jsonLd[1]).not.toHaveProperty("sameAs");
  });

  test("escapes < so a value can't close the script tag", async () => {
    const { scripts, jsonLd } = await renderOrganizationPage();
    expect(scripts[1].innerHTML).toContain("Bob \\u003c/script> Builder");
    expect(jsonLd[1].name).toBe("Bob </script> Builder");
  });

  test("says so when there are no members", async () => {
    jest.mocked(getAllMembers).mockResolvedValue([]);
    const { scripts } = await renderOrganizationPage();
    expect(screen.getByText("No team member information available.")).toBeInTheDocument();
    expect(scripts).toHaveLength(0);
  });

  test("sets its title and canonical URL", () => {
    expect(metadata.title).toBe("Our Team");
    expect(metadata.alternates?.canonical).toBe("/organization");
  });
});
