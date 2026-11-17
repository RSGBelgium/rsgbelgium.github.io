/**
 * Runs before every test file (see setupFilesAfterEnv in jest.config.js).
 *
 * Adds the DOM matchers of jest-dom, such as toBeInTheDocument() and
 * toHaveAttribute(). Importing it here also makes TypeScript aware of those
 * matchers in every test file.
 */
import "@testing-library/jest-dom";
