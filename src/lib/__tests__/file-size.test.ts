/**
 * @jest-environment node
 */

/**
 * Tests for the download size helpers (src/lib/file-size.ts).
 */

import { statSync } from "fs";
import { formatFileSize, readPublicFileSize } from "@/lib/file-size";

describe("formatFileSize", () => {
  test.each([
    [512, "512 bytes"],
    [999, "999 bytes"],
    [1000, "1 KB"],
    [271_171, "271 KB"],
    [971_658, "972 KB"],
    [999_499, "999 KB"],
    [999_500, "1 MB"],
    [1_234_567, "1.2 MB"],
    [12_000_000, "12 MB"],
  ])("%d bytes -> %s", (bytes, expected) => {
    expect(formatFileSize(bytes)).toBe(expected);
  });
});

describe("readPublicFileSize", () => {
  test("reads the size of a file in public/ from its URL path", () => {
    expect(readPublicFileSize("/favicon/favicon.ico")).toBe(
      statSync("public/favicon/favicon.ico").size,
    );
  });

  test("throws for a file that doesn't exist, so the build fails", () => {
    expect(() => readPublicFileSize("/assets/pdf/no-such-file.pdf")).toThrow(/ENOENT/);
  });
});
