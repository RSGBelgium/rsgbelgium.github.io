import { render } from "@testing-library/react";
import { TitleText, titlePieces } from "../title-text";

/** The texts of the nowrap spans in a rendered title. */
function unbreakable(container: HTMLElement): string[] {
  return [...container.querySelectorAll("span.whitespace-nowrap")].map((span) => span.textContent!);
}

describe("TitleText", () => {
  test("keeps hyphenated words and free-standing dashes with their word, text unchanged", () => {
    const title =
      "POSTPONED DUE TO COVID-19: Bioinformatics Student Symposium - 05/05/2020 - UCLouvain";
    const { container } = render(<TitleText text={title} />);
    expect(container.textContent).toBe(title);
    expect(unbreakable(container)).toEqual(["COVID-19:", "Symposium -", "05/05/2020 -"]);
  });

  test("leaves titles without hyphens as plain text", () => {
    const { container } = render(<TitleText text="Looking back and looking forward" />);
    expect(container.textContent).toBe("Looking back and looking forward");
    expect(container.querySelector("span")).toBeNull();
  });

  test("lets pieces that are too long for a phone screen break", () => {
    expect(titlePieces("The Interuniversity-Biohackathon 13-14 December")).toEqual([
      { text: "The", keepTogether: false },
      { text: "Interuniversity-Biohackathon", keepTogether: false },
      { text: "13-14", keepTogether: true },
      { text: "December", keepTogether: false },
    ]);
  });

  test("keeps a dash at the start of a title on its own", () => {
    expect(titlePieces("- Draft")).toEqual([
      { text: "-", keepTogether: false },
      { text: "Draft", keepTogether: false },
    ]);
  });
});
