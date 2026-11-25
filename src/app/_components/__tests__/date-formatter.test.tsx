import { render, screen } from "@testing-library/react";
import DateFormatter from "../date-formatter";

describe("DateFormatter", () => {
  test.each([
    ["2023-10-26T10:00:00Z", "October 26, 2023"],
    ["2021-09-21T00:00:00.000Z", "September 21, 2021"],
    // Date-only values are midnight UTC and are shown in UTC: no off-by-one day.
    ["2026-05-15", "May 15, 2026"],
    ["2022-03-01", "March 1, 2022"],
  ])("formats %s as %s in a <time> element", (dateString, text) => {
    render(<DateFormatter dateString={dateString} />);
    const time = screen.getByText(text);
    expect(time.tagName).toBe("TIME");
    expect(time).toHaveAttribute("dateTime", dateString);
  });

  test.each([["not-a-date"], [""]])("renders nothing for %j", (dateString) => {
    const { container } = render(<DateFormatter dateString={dateString} />);
    expect(container).toBeEmptyDOMElement();
  });

  test("renders nothing for a missing date", () => {
    // @ts-expect-error a post without a date reaches the component as undefined
    const { container } = render(<DateFormatter dateString={undefined} />);
    expect(container).toBeEmptyDOMElement();
  });
});
