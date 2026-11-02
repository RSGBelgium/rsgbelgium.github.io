/**
 * @jest-environment node
 */

/**
 * Tests for scripts/check-assets.mjs (`npm run check:assets`): the script
 * runs on small throwaway repositories, as it runs on the real one.
 */

import { spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const SCRIPT = path.join(__dirname, "..", "check-assets.mjs");

/** Throwaway repositories created by the tests, removed afterwards. */
const roots: string[] = [];

/**
 * Creates a repository with the given files.
 *
 * @param files - Path relative to the repository -> contents (a string, or a size in bytes for a dummy binary file)
 * @returns The repository root
 */
function createRepo(files: Record<string, string | number>): string {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "check-assets-"));
  roots.push(root);
  for (const [file, contents] of Object.entries(files)) {
    const absolute = path.join(root, file);
    fs.mkdirSync(path.dirname(absolute), { recursive: true });
    fs.writeFileSync(absolute, typeof contents === "number" ? Buffer.alloc(contents, 1) : contents);
  }
  return root;
}

/** Runs the check on a repository; returns its exit code and output (stdout and stderr). */
function runCheck(root: string, ...options: string[]) {
  const result = spawnSync(process.execPath, [SCRIPT, ...options, root], {
    encoding: "utf8",
    env: { ...process.env, GITHUB_ACTIONS: "false" },
  });
  return { status: result.status, output: `${result.stdout}${result.stderr}` };
}

afterAll(() => {
  for (const root of roots) fs.rmSync(root, { recursive: true, force: true });
});

/** A post that uses one poster, and a layout that uses one icon. */
const CLEAN_REPO = {
  "content/news/2026-01-01-post.md":
    '---\ntitle: "Post"\ndate: "2026-01-01"\n---\n\n![Poster](/images/poster/2026-01-01-poster.webp)\n',
  "content/organization/jane-doe.md": '---\nname: "Jane Doe"\nimage: "jane-doe.webp"\n---\n',
  "src/app/layout.tsx": 'export const icons = [{ url: "/favicon/favicon.ico" }];\n',
  "src/lib/constants.ts": 'export const LOGO_FILE = "rsg-logo.webp";\n',
  "public/images/poster/2026-01-01-poster.webp": 200 * 1024,
  "public/images/team/jane-doe.webp": 20 * 1024,
  "public/images/team/rsg-logo.webp": 5 * 1024,
  "public/favicon/favicon.ico": 5 * 1024,
  "public/favicon/site.webmanifest": '{ "icons": [{ "src": "/favicon/icon-512.png" }] }\n',
  "public/favicon/icon-512.png": 10 * 1024,
};

describe("check-assets", () => {
  test("passes when every file is used and within its budget", () => {
    const root = createRepo({
      ...CLEAN_REPO,
      "src/app/layout.tsx":
        'export const icons = [{ url: "/favicon/favicon.ico" }];\nexport const manifest = "/favicon/site.webmanifest";\n',
    });
    const { status, output } = runCheck(root);
    expect(output).toContain("✔ Asset check: 6 files in public/");
    expect(status).toBe(0);
  });

  test("reports an unused, oversized photo with how to fix it", () => {
    const root = createRepo({
      ...CLEAN_REPO,
      "public/images/photo_gallery/big-photo.jpg": 1024 * 1024,
    });
    const { status, output } = runCheck(root);
    expect(status).toBe(1);
    expect(output).toContain(
      "public/images/photo_gallery/big-photo.jpg: error: not used: nothing in src/, content/ or the site's config links to /images/photo_gallery/big-photo.jpg",
    );
    expect(output).toContain(
      "public/images/photo_gallery/big-photo.jpg: error: 1.00 MB is over the 300.0 KB budget for a raster image → run `npm run optimize:images`",
    );
  });

  test("counts a reference only with the exact upper/lower case, and not from tests", () => {
    const root = createRepo({
      ...CLEAN_REPO,
      "content/news/2026-01-01-post.md":
        '---\ntitle: "Post"\ndate: "2026-01-01"\n---\n\n![Poster](/images/poster/2026-01-01-Poster.webp)\n',
      "src/components/__tests__/Poster.test.tsx":
        'const src = "/images/poster/2026-01-01-poster.webp";\n',
    });
    const { status, output } = runCheck(root);
    expect(status).toBe(1);
    expect(output).toContain("public/images/poster/2026-01-01-poster.webp: error: not used");
  });

  test("applies the SVG budget and exempts PDFs", () => {
    const root = createRepo({
      ...CLEAN_REPO,
      "content/news/2026-01-02-event.md":
        '---\ntitle: "Event"\ndate: "2026-01-02"\n---\n\n<img src="/images/poster/event.svg" alt="Poster">\n[Programme (PDF)](/assets/pdf/programme.pdf)\n',
      "public/images/poster/event.svg": 150 * 1024,
      "public/assets/pdf/programme.pdf": 2 * 1024 * 1024,
    });
    const { status, output } = runCheck(root);
    expect(status).toBe(1);
    expect(output).toContain(
      "public/images/poster/event.svg: error: 150.0 KB is over the 100.0 KB budget for an SVG",
    );
    expect(output).not.toContain("programme.pdf: error");
  });

  test("reports upper-case extensions and spaces in file names", () => {
    const root = createRepo({
      ...CLEAN_REPO,
      "content/news/2026-01-02-event.md":
        '---\ntitle: "Event"\ndate: "2026-01-02"\n---\n\n![A](/images/team/photo.JPG) ![B](/images/team/my%20photo.webp)\n',
      "public/images/team/photo.JPG": 1024,
      "public/images/team/my photo.webp": 1024,
    });
    const { status, output } = runCheck(root);
    expect(status).toBe(1);
    expect(output).toContain(
      'public/images/team/photo.JPG: error: upper-case file extension ".JPG" → rename it to "photo.jpg"',
    );
    expect(output).toContain(
      "public/images/team/my photo.webp: error: the name contains spaces or characters that have to be escaped",
    );
  });

  test("reports paths in the code that are not files in public/", () => {
    const root = createRepo({
      ...CLEAN_REPO,
      "src/lib/constants.ts":
        'export const LOGO_FILE = "rsg-logo.webp";\nexport const AUTHOR = { picture: "/images/team/rsg-logo.png" };\n',
    });
    const { status, output } = runCheck(root);
    expect(status).toBe(1);
    expect(output).toContain(
      'src/lib/constants.ts:2: error: "/images/team/rsg-logo.png" is not a file in public/',
    );
  });

  test("--list prints every file with its size and where it is used", () => {
    const root = createRepo(CLEAN_REPO);
    const { output } = runCheck(root, "--list");
    expect(output).toMatch(
      /images\/team\/jane-doe\.webp\s+20\.0 KB\s+content\/organization\/jane-doe\.md/,
    );
    expect(output).toMatch(
      /images\/team\/rsg-logo\.webp\s+5\.0 KB\s+src\/lib\/constants\.ts \(by file name\)/,
    );
    expect(output).toMatch(/favicon\/site\.webmanifest\s+\d+ B\s+UNUSED/);
  });
});
