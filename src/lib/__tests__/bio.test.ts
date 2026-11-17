import { splitBio } from "../bio";

describe("splitBio", () => {
  test("keeps a one-paragraph bio whole", () => {
    expect(splitBio("\nJane studies **genomics**.\n")).toEqual({
      lead: "Jane studies **genomics**.",
      more: "",
    });
  });

  test("splits after the first paragraph", () => {
    const bio = "First paragraph.\n\nSecond paragraph,\nstill second.\n\n- a list\n- of things\n";
    expect(splitBio(bio)).toEqual({
      lead: "First paragraph.",
      more: "Second paragraph,\nstill second.\n\n- a list\n- of things",
    });
  });

  test("gives both parts the link definitions", () => {
    const bio =
      "Works at [ULB][ulb].\n\nAlso at [ULB][ulb] on weekends.\n\n[ulb]: https://www.ulb.be\n";
    expect(splitBio(bio)).toEqual({
      lead: "Works at [ULB][ulb].\n\n[ulb]: https://www.ulb.be",
      more: "Also at [ULB][ulb] on weekends.\n\n[ulb]: https://www.ulb.be",
    });
  });

  test("returns empty parts for an empty bio", () => {
    expect(splitBio("")).toEqual({ lead: "", more: "" });
  });
});
