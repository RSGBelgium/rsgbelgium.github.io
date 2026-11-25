/**
 * @jest-environment node
 */

/**
 * Tests for the content loader (src/lib/api.ts) against small fixture
 * folders written to a temporary directory, so they never depend on the real
 * content in content/, which changes with every new post or board member.
 */

import fs from "node:fs";
import os from "node:os";
import path from "node:path";

type Api = typeof import("@/lib/api");

/** Writes `files` (relative path -> contents) below `root`, creating folders as needed. */
function writeFiles(root: string, files: Record<string, string>) {
  for (const [relativePath, contents] of Object.entries(files)) {
    const file = path.join(root, relativePath);
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, contents);
  }
}

/** Builds a markdown file from front-matter lines and a body. */
const markdown = (frontMatter: string[], body = "") =>
  `---\n${frontMatter.join("\n")}\n---\n${body}`;

const NEWS_FIXTURES = {
  // Unquoted date-only value: YAML turns it into a Date object.
  "content/news/2021-09-21-unquoted.md": markdown(
    ["title: Unquoted date", "date: 2021-09-21"],
    "\nFirst paragraph of the post, with a [link](https://example.org).\n",
  ),
  // Quoted value with a time, later on the same day: stays a string. `.markdown` extension.
  "content/news/2021-09-21-quoted-time.markdown": markdown([
    'title: "Quoted date and time"',
    'date: "2021-09-21 18:00"',
  ]),
  "content/news/2021-09-22-newest.md": markdown(
    ['title: "Newest post"', 'date: "2021-09-22"', 'excerpt: "  Explicit excerpt.  "'],
    "\nThe body is not used for the excerpt.\n",
  ),
  "content/news/no-date.md": markdown(['title: "No date"']),
  "content/news/tie-b.md": markdown(['title: "Tie B"', 'date: "2020-01-01"']),
  "content/news/tie-a.md": markdown(['title: "Tie A"', 'date: "2020-01-01"']),
  "content/news/notes.txt": "Not a post.",
};

const MEMBER_FIXTURES = {
  "content/organization/zoe.md": markdown(
    [
      'name: "Zoe President"',
      'title: "President"',
      'image: "/images/team/zoe.png"',
      'linkedin: "https://www.linkedin.com/in/zoe"',
      'orcid: "https://orcid.org/0000-0000-0000-0001"',
      "order: 1",
    ],
    "\n  Bio of Zoe.  \n\n",
  ),
  // A numeric string is accepted as an order.
  "content/organization/adam.md": markdown(['name: "Adam Officer"', 'order: "2"']),
  "content/organization/bea.md": markdown(['name: "Bea Officer"', 'image: "bea.jpg"', "order: 3"]),
  "content/organization/carl.md": markdown([
    'name: "Carl Member"',
    'image: "https://example.org/carl.jpg"',
    'linkedin: "Carl Member | LinkedIn"',
    "order: 4",
  ]),
  // `order` is required and must be a whole number from 1: these profiles are skipped.
  "content/organization/anna.md": markdown(['name: "Anna Member"', 'image: ""', 'order: "first"']),
  "content/organization/dave.md": markdown(['name: "Dave Member"']),
  "content/organization/eve.md": markdown(['name: "Eve Member"', "order: 2.5"]),
  "content/organization/no-name.md": markdown(['title: "Board Member"']),
  "content/organization/broken.md": "---\nname: [unclosed\n---\n",
  "content/organization/README.txt": "Not a member.",
  "content/organization/alumni/old-member.md": markdown(['name: "Old Member"']),
};

/** A team whose orders are not 1 to n: a duplicate 1 and no 2. */
const MISNUMBERED_MEMBER_FIXTURES = {
  "content/organization/a.md": markdown(['name: "Member A"', "order: 1"]),
  "content/organization/b.md": markdown(['name: "Member B"', "order: 1"]),
  "content/organization/c.md": markdown(['name: "Member C"', "order: 3"]),
};

let fixtureRoot: string;
let emptyRoot: string;
let misnumberedRoot: string;
let warn: jest.SpyInstance;
let error: jest.SpyInstance;

/**
 * Loads a fresh copy of src/lib/api.ts that reads content from `root`.
 *
 * api.ts resolves content/news and content/organization against
 * process.cwd() when it is first loaded, hence the fresh module.
 */
async function loadApi(root: string): Promise<Api> {
  jest.resetModules();
  jest.spyOn(process, "cwd").mockReturnValue(root);
  return import("@/lib/api");
}

beforeAll(() => {
  fixtureRoot = fs.mkdtempSync(path.join(os.tmpdir(), "rsg-api-"));
  writeFiles(fixtureRoot, { ...NEWS_FIXTURES, ...MEMBER_FIXTURES });
  emptyRoot = fs.mkdtempSync(path.join(os.tmpdir(), "rsg-api-empty-"));
  misnumberedRoot = fs.mkdtempSync(path.join(os.tmpdir(), "rsg-api-misnumbered-"));
  writeFiles(misnumberedRoot, MISNUMBERED_MEMBER_FIXTURES);
});

afterAll(() => {
  fs.rmSync(fixtureRoot, { recursive: true, force: true });
  fs.rmSync(emptyRoot, { recursive: true, force: true });
  fs.rmSync(misnumberedRoot, { recursive: true, force: true });
});

beforeEach(() => {
  warn = jest.spyOn(console, "warn").mockImplementation(() => {});
  error = jest.spyOn(console, "error").mockImplementation(() => {});
});

afterEach(() => {
  jest.restoreAllMocks();
});

describe("posts", () => {
  let api: Api;

  beforeEach(async () => {
    api = await loadApi(fixtureRoot);
  });

  test("getPostSlugs lists .md and .markdown files", async () => {
    const slugs = await api.getPostSlugs();
    expect(slugs.sort()).toEqual([
      "2021-09-21-quoted-time",
      "2021-09-21-unquoted",
      "2021-09-22-newest",
      "no-date",
      "tie-a",
      "tie-b",
    ]);
  });

  test("getAllPosts sorts newest first, mixing Date and string dates, invalid dates last", async () => {
    const posts = await api.getAllPosts();
    expect(posts.map((post) => post.slug)).toEqual([
      "2021-09-22-newest",
      "2021-09-21-quoted-time", // "2021-09-21 18:00" is later than the date-only 2021-09-21
      "2021-09-21-unquoted",
      "tie-a", // same date as tie-b: ordered by slug
      "tie-b",
      "no-date",
    ]);
  });

  test("normalises a YAML Date to an ISO string and keeps string dates as written", async () => {
    const unquoted = await api.getPostBySlug("2021-09-21-unquoted");
    const quoted = await api.getPostBySlug("2021-09-21-quoted-time");
    const noDate = await api.getPostBySlug("no-date");

    expect(unquoted?.date).toBe("2021-09-21T00:00:00.000Z");
    expect(quoted?.date).toBe("2021-09-21 18:00");
    expect(noDate?.date).toBe("");
  });

  test("uses the trimmed front-matter excerpt, or falls back to the body text", async () => {
    const withExcerpt = await api.getPostBySlug("2021-09-22-newest");
    const withoutExcerpt = await api.getPostBySlug("2021-09-21-unquoted");
    const emptyBody = await api.getPostBySlug("no-date");

    expect(withExcerpt?.excerpt).toBe("Explicit excerpt.");
    expect(withoutExcerpt?.excerpt).toBe("First paragraph of the post, with a link.");
    expect(emptyBody?.excerpt).toBe("");
  });

  test("getPostBySlug returns null for a missing post", async () => {
    await expect(api.getPostBySlug("does-not-exist")).resolves.toBeNull();
    expect(error).toHaveBeenCalledWith("No file found for slug: does-not-exist");
  });

  test("returns no posts when content/news is missing", async () => {
    const emptyApi = await loadApi(emptyRoot);
    await expect(emptyApi.getAllPosts()).resolves.toEqual([]);
  });

  test("reads the size of a local cover image, and only of a local one", async () => {
    // The start of a PNG file: the signature and the IHDR chunk with width and height.
    const pngHeader = Buffer.alloc(33);
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]).copy(pngHeader);
    pngHeader.writeUInt32BE(13, 8);
    pngHeader.write("IHDR", 12, "latin1");
    pngHeader.writeUInt32BE(1131, 16);
    pngHeader.writeUInt32BE(1600, 20);

    const root = fs.mkdtempSync(path.join(os.tmpdir(), "rsg-api-cover-"));
    try {
      writeFiles(root, {
        "content/news/local.md": markdown([
          'title: "Local cover"',
          'coverImage: "/images/poster/cover.png"',
        ]),
        "content/news/missing.md": markdown([
          'title: "Missing cover"',
          'coverImage: "/images/poster/missing.png"',
        ]),
        "content/news/external.md": markdown([
          'title: "External cover"',
          'coverImage: "https://example.org/cover.png"',
        ]),
      });
      fs.mkdirSync(path.join(root, "public/images/poster"), { recursive: true });
      fs.writeFileSync(path.join(root, "public/images/poster/cover.png"), pngHeader);

      const coverApi = await loadApi(root);
      await expect(coverApi.getPostBySlug("local")).resolves.toMatchObject({
        coverImage: "/images/poster/cover.png",
        coverImageSize: { width: 1131, height: 1600 },
      });
      for (const slug of ["missing", "external"]) {
        expect(await coverApi.getPostBySlug(slug)).not.toHaveProperty("coverImageSize");
      }
    } finally {
      fs.rmSync(root, { recursive: true, force: true });
    }
  });
});

describe("getAllMembers", () => {
  let api: Api;

  beforeEach(async () => {
    api = await loadApi(fixtureRoot);
  });

  test("sorts by order alone, 1 first", async () => {
    const members = await api.getAllMembers();
    expect(members.map((member) => member.name)).toEqual([
      "Zoe President",
      "Adam Officer",
      "Bea Officer",
      "Carl Member",
    ]);
    expect(warn).not.toHaveBeenCalledWith(expect.stringContaining("must be 1 to"));
  });

  test("skips profiles without a whole-number order from 1", async () => {
    const slugs = (await api.getAllMembers()).map((member) => member.slug);

    for (const slug of ["anna", "dave", "eve"]) {
      expect(slugs).not.toContain(slug);
      expect(warn).toHaveBeenCalledWith(
        expect.stringContaining(`${slug}.md: skipping profile without a whole-number "order"`),
      );
    }
  });

  test("warns when the orders are not exactly 1 to n", async () => {
    const misnumberedApi = await loadApi(misnumberedRoot);
    const orders = (await misnumberedApi.getAllMembers()).map((member) => member.order);

    expect(orders).toEqual([1, 1, 3]);
    expect(warn).toHaveBeenCalledWith(
      expect.stringContaining('the "order" numbers must be 1 to 3, each used once (found 1, 1, 3)'),
    );
  });

  test("skips profiles without a name or with invalid front matter, and ignores other files", async () => {
    const members = await api.getAllMembers();
    const slugs = members.map((member) => member.slug);

    expect(slugs).not.toContain("no-name");
    expect(slugs).not.toContain("broken");
    expect(slugs).not.toContain("old-member"); // subfolders are ignored
    expect(warn).toHaveBeenCalledWith(
      expect.stringContaining('no-name.md: skipping profile without a "name"'),
    );
    expect(warn).toHaveBeenCalledWith(
      expect.stringContaining("broken.md: skipping profile that could not be read or parsed"),
      expect.anything(),
    );
  });

  test("resolves image paths: bare file names go to /images/team/, paths and URLs stay", async () => {
    const byName = Object.fromEntries(
      (await api.getAllMembers()).map((member) => [member.name, member]),
    );

    expect(byName["Bea Officer"].image).toBe("/images/team/bea.jpg");
    expect(byName["Zoe President"].image).toBe("/images/team/zoe.png");
    expect(byName["Carl Member"].image).toBe("https://example.org/carl.jpg");
    expect(byName["Adam Officer"].image).toBe("");
  });

  test("keeps http(s) profile URLs and drops anything else with a warning", async () => {
    const byName = Object.fromEntries(
      (await api.getAllMembers()).map((member) => [member.name, member]),
    );

    expect(byName["Zoe President"].linkedin).toBe("https://www.linkedin.com/in/zoe");
    expect(byName["Zoe President"].orcid).toBe("https://orcid.org/0000-0000-0000-0001");
    expect(byName["Carl Member"].linkedin).toBe("");
    expect(warn).toHaveBeenCalledWith(expect.stringContaining('carl.md: ignoring "linkedin"'));
  });

  test("parses numeric orders and trims the bio", async () => {
    const byName = Object.fromEntries(
      (await api.getAllMembers()).map((member) => [member.name, member]),
    );

    expect(byName["Zoe President"].order).toBe(1);
    expect(byName["Adam Officer"].order).toBe(2); // written as the string "2"
    expect(byName["Zoe President"].content).toBe("Bio of Zoe.");
    expect(byName["Bea Officer"].title).toBe("");
  });

  test("returns an empty list when content/organization is missing", async () => {
    const emptyApi = await loadApi(emptyRoot);
    await expect(emptyApi.getAllMembers()).resolves.toEqual([]);
    expect(error).toHaveBeenCalledWith("Error reading the members directory:", expect.anything());
  });
});
