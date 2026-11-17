/**
 * Runs before every test file (see setupFilesAfterEnv in jest.config.js).
 *
 * Adds the DOM matchers of jest-dom, such as toBeInTheDocument() and
 * toHaveAttribute(). Importing it here also makes TypeScript aware of those
 * matchers in every test file.
 *
 * jsdom, the browser environment of the component and page tests, has no
 * TextEncoder/TextDecoder, which Node.js and browsers both have. Pages that
 * render markdown load image-size (src/lib/image-size.ts), which needs them,
 * so they are taken from Node.js.
 */
import "@testing-library/jest-dom";
import { TextDecoder, TextEncoder } from "node:util";

Object.assign(globalThis, {
  TextDecoder: globalThis.TextDecoder ?? TextDecoder,
  TextEncoder: globalThis.TextEncoder ?? TextEncoder,
});
