/**
 * @jest-environment node
 */

/**
 * Tests for the markdown pipeline (src/lib/markdownToHtml.ts): heading ids,
 * `#` headings demoted to `##`, and external links that open in a new tab.
 */

import markdownToHtml from "@/lib/markdownToHtml";

const NEW_TAB = 'target="_blank" rel="noopener noreferrer"';

describe("heading ids", () => {
  test("gives headings a GitHub-style slug of their text", async () => {
    const html = await markdownToHtml("## How to get there?\n\n### Day 1: *Talks* & `code`");
    expect(html).toContain('<h2 id="how-to-get-there">How to get there?</h2>');
    expect(html).toContain('<h3 id="day-1-talks--code">');
  });

  test("numbers repeated headings", async () => {
    const html = await markdownToHtml(["## Programme", "## Programme", "## Venue"].join("\n\n"));
    const ids = [...html.matchAll(/id="([^"]+)"/g)].map((match) => match[1]);
    expect(ids).toEqual(["programme", "programme-1", "venue"]);
  });

  test("does not support kramdown {#id} heading ids: they stay visible", async () => {
    // Old Jekyll syntax; scripts/check-content.mjs reports it before a build.
    const html = await markdownToHtml("## Tracks {#tracks}");
    expect(html).toContain("Tracks {#tracks}</h2>");
    expect(html).not.toContain('id="tracks"');
  });
});

describe("remarkDemoteH1", () => {
  test("turns # headings into ## and keeps deeper levels", async () => {
    const html = await markdownToHtml("# Title\n\n## Section\n\n### Subsection");
    expect(html).not.toContain("<h1");
    expect(html).toContain('<h2 id="title">Title</h2>');
    expect(html).toContain('<h2 id="section">Section</h2>');
    expect(html).toContain('<h3 id="subsection">Subsection</h3>');
  });
});

describe("external links", () => {
  test("open inline and autolinked http(s) URLs in a new tab", async () => {
    const html = await markdownToHtml(
      "[Register](https://example.org/register), <https://example.org/a> and https://example.org/b",
    );
    expect(html).toContain(`<a href="https://example.org/register" ${NEW_TAB}>Register</a>`);
    expect(html).toContain(`<a href="https://example.org/a" ${NEW_TAB}>`);
    expect(html).toContain(`<a href="https://example.org/b" ${NEW_TAB}>`);
  });

  test("open reference-style links to external URLs in a new tab, labels case-insensitive", async () => {
    const html = await markdownToHtml(
      [
        "Read the [programme][Prog] and the [news][news].",
        "",
        "[prog]: https://example.org/programme",
        "[news]: /news",
      ].join("\n"),
    );
    expect(html).toContain(`<a href="https://example.org/programme" ${NEW_TAB}>programme</a>`);
    expect(html).toContain('<a href="/news">news</a>');
  });

  test("keep internal, anchor and mailto links in the same tab", async () => {
    const html = await markdownToHtml(
      "[News](/news), [tracks](#tracks) and [mail](mailto:board@example.org)",
    );
    expect(html).toContain('<a href="/news">News</a>');
    expect(html).toContain('<a href="#tracks">tracks</a>');
    expect(html).toContain('<a href="mailto:board@example.org">mail</a>');
    expect(html).not.toContain("_blank");
  });
});

test("passes raw HTML such as embedded maps through unchanged", async () => {
  const iframe =
    '<iframe src="https://www.openstreetmap.org/export/embed.html" title="Map of the venue"></iframe>';
  const html = await markdownToHtml(iframe);
  expect(html).toContain(iframe);
});

test("supports GitHub Flavored Markdown tables", async () => {
  const html = await markdownToHtml("| Day | Event |\n|-----|-------|\n| Mon | Talk |");
  expect(html).toContain("<table>");
  expect(html).toContain("<td>Talk</td>");
});
