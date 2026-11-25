/**
 * @jest-environment node
 */

/**
 * Tests for the shared post date helpers (src/lib/dates.ts).
 */

import { normalizeFrontMatterDate, parseDate } from "@/lib/dates";

describe("parseDate", () => {
  test("parses the date formats posts use", () => {
    expect(parseDate("2026-05-15")?.toISOString()).toBe("2026-05-15T00:00:00.000Z");
    expect(parseDate("2021-09-21T00:00:00.000Z")?.toISOString()).toBe("2021-09-21T00:00:00.000Z");
    expect(parseDate("2017-10-02 19:10")).toBeInstanceOf(Date);
  });

  test.each([[""], ["not a date"], ["2026-13-45"]])(
    "returns undefined for a missing or invalid date: %j",
    (date) => {
      expect(parseDate(date)).toBeUndefined();
    },
  );
});

describe("normalizeFrontMatterDate", () => {
  test("turns a YAML Date into an ISO string", () => {
    expect(normalizeFrontMatterDate(new Date("2021-09-21T00:00:00Z"))).toBe(
      "2021-09-21T00:00:00.000Z",
    );
  });

  test("keeps strings as written and turns anything else into an empty string", () => {
    expect(normalizeFrontMatterDate("2017-10-02 19:10")).toBe("2017-10-02 19:10");
    expect(normalizeFrontMatterDate(undefined)).toBe("");
    expect(normalizeFrontMatterDate(42)).toBe("");
  });
});
