import { render, screen } from '@testing-library/react';
import DateFormatter from '../date-formatter'; // Adjust path as necessary

// Mock console.error to avoid polluting test output
let consoleErrorMock: jest.SpyInstance;

beforeEach(() => {
  consoleErrorMock = jest.spyOn(console, 'error').mockImplementation(() => {});
});

afterEach(() => {
  consoleErrorMock.mockRestore();
});

describe('DateFormatter', () => {
  // Test case 1: Valid ISO date
  it('renders formatted date for valid ISO string', () => {
    const validDateString = '2023-10-26T10:00:00Z';
    render(<DateFormatter dateString={validDateString} />);
    // Remember the format is "LLLL	d, yyyy" (tab between LLLL and d)
    // For '2023-10-26T10:00:00Z', 'date-fns' format "LLLL	d, yyyy" should give "October	26, 2023"
    const expectedText = 'October\t26, 2023';
    const timeElement = screen.getByText(expectedText);
    expect(timeElement).toBeInTheDocument();
    expect(timeElement.tagName).toBe('TIME');
    expect(timeElement).toHaveAttribute('dateTime', validDateString);
  });

  // Test case 2: Malformed date string
  it('renders "Invalid date" for malformed date string', () => {
    const invalidDateString = 'not-a-date';
    render(<DateFormatter dateString={invalidDateString} />);
    const timeElement = screen.getByText('Invalid date');
    expect(timeElement).toBeInTheDocument();
    expect(timeElement.tagName).toBe('TIME');
    expect(timeElement).toHaveAttribute('dateTime', invalidDateString);
    expect(consoleErrorMock).toHaveBeenCalledWith(`Invalid dateString received: ${invalidDateString}`);
  });

  // Test case 3: Non-ISO date string
  it('renders "Invalid date" for non-ISO date string', () => {
    const nonIsoDateString = 'October 26, 2023';
    render(<DateFormatter dateString={nonIsoDateString} />);
    const timeElement = screen.getByText('Invalid date');
    expect(timeElement).toBeInTheDocument();
    expect(timeElement.tagName).toBe('TIME');
    expect(timeElement).toHaveAttribute('dateTime', nonIsoDateString);
    // This specific case might also log an error depending on parseISO's strictness with the format.
    // The current implementation with isNaN(date.getTime()) should catch this.
    expect(consoleErrorMock).toHaveBeenCalledWith(`Invalid dateString received: ${nonIsoDateString}`);
  });

  // Test case 4: Empty date string
  it('renders nothing for empty date string', () => {
    const { container } = render(<DateFormatter dateString="" />);
    expect(container.firstChild).toBeNull();
  });

  // Test case 5: Null date string
  it('renders nothing for null date string', () => {
    // @ts-expect-error Testing null case for a prop that expects string
    const { container } = render(<DateFormatter dateString={null} />);
    expect(container.firstChild).toBeNull();
  });

  // Test case 6: Undefined date string
  it('renders nothing for undefined date string', () => {
    // @ts-expect-error Testing undefined case for a prop that expects string
    const { container } = render(<DateFormatter dateString={undefined} />);
    expect(container.firstChild).toBeNull();
  });

  // Test case 7: dateTime attribute with valid date (already covered in Test Case 1, but can be explicit)
  it('ensures dateTime attribute is set correctly for valid dates', () => {
    const validDateString = '2024-01-15T12:30:00Z';
    render(<DateFormatter dateString={validDateString} />);
    const expectedText = 'January\t15, 2024'; // January	15, 2024
    const timeElement = screen.getByText(expectedText);
    expect(timeElement).toHaveAttribute('dateTime', validDateString);
  });

  // Test case for dateTime attribute with invalid date (covered in Test Case 2 & 3)
  it('ensures dateTime attribute is set to original string for invalid dates', () => {
    const invalidDateString = 'completely-invalid';
    render(<DateFormatter dateString={invalidDateString} />);
    const timeElement = screen.getByText('Invalid date');
    expect(timeElement).toHaveAttribute('dateTime', invalidDateString);
  });

  // Test case for a different valid ISO date to ensure formatting is consistent
  it('renders correctly for another valid ISO string', () => {
    const anotherValidDate = '2022-03-01T00:00:00Z';
    render(<DateFormatter dateString={anotherValidDate} />);
    const expectedText = 'March\t1, 2022';
    const timeElement = screen.getByText(expectedText);
    expect(timeElement).toBeInTheDocument();
    expect(timeElement.tagName).toBe('TIME');
    expect(timeElement).toHaveAttribute('dateTime', anotherValidDate);
  });
});
