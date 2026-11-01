# Markdown on the RSG-Belgium website

Posts and profiles are written in
[GitHub Flavored Markdown](https://github.github.com/gfm/) (GFM): standard
Markdown plus a few extras. If something renders correctly in a GitHub
comment or README, it will almost always render correctly here too. New to
Markdown? The [Markdown Guide](https://www.markdownguide.org/basic-syntax/)
explains the basics.

## What you can use

| Feature | Write | Notes |
|---------|-------|-------|
| Section headings | `## Programme`, `### Speakers` | Start at `##`. The post title is already the top-level heading. Don't skip levels (`##` then `###`, not `##` then `####`). |
| Bold, italic | `**bold**`, `_italic_` | |
| Strikethrough | `~~cancelled~~` | GFM |
| Links | `[register here](https://forms.gle/...)` | External links open in a new tab automatically. |
| Automatic links | `https://example.org` or `<https://example.org>` | GFM: a bare URL becomes a link. |
| Lists | `- item` or `1. item` | Indent by two spaces to nest. |
| Task lists | `- [ ] todo`, `- [x] done` | GFM |
| Tables | see below | GFM |
| Quotes | `> text` | Good for addresses or announcements. |
| Footnotes | `text[^1]` ... `[^1]: note` | GFM |
| Horizontal rule | `---` on its own line, with a blank line above | |
| Images | `![alt text](/images/poster/file.jpg)` | Centred automatically. See [Images and files](images-and-files.md). |
| Raw HTML | `<br>`, `<iframe ...>` | Allowed, e.g. for embedded Google Maps. Use sparingly. |

### Tables

```markdown
| Time  | Activity          |
|-------|-------------------|
| 19:00 | Doors open        |
| 19:30 | Talks             |
| 20:30 | Networking        |
```

### Line breaks

A single line break in your file is ignored. The lines are joined into one
paragraph. Leave an **empty line** to start a new paragraph. To force a line
break inside a paragraph (for example in an address), end the line with `<br>`:

```markdown
Zaal Couvreur, Agora Learning Center<br>
Edward Van Evenstraat 4, 3000 Leuven
```

### Embedded maps

Google Maps "Embed a map" code can be pasted as-is. Add a `title` so screen
reader users know what the frame contains, and leave an empty line before
and after it:

```html
<iframe src="https://www.google.com/maps/embed?pb=..." title="Map of Zaal Couvreur, Leuven" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
```

## Headings, anchors and in-page links

Every heading automatically gets an **id**, so you can link to it.

### Automatic ids

The id is generated from the heading text, the same way GitHub does it:
lowercase, spaces become `-`, and punctuation is removed.

| Heading | Generated id |
|---------|--------------|
| `## How to get there?` | `how-to-get-there` |
| `## Where and when?` | `where-and-when` |
| `### Data Exploration & Classical Bioinformatics` | `data-exploration--classical-bioinformatics` |
| a second `## Projects` on the same page | `projects-1` |

### Explicit ids

To choose the id yourself (shorter, or stable if you later reword the
heading), add `{#your-id}` at the **end** of the heading:

```markdown
## About the Workshops {#event-overview}
```

This renders as "About the Workshops" with the id `event-overview`. An id
must start with a letter and may contain letters, digits, `-` and `_`.

### Linking to a heading

```markdown
More information is provided [below](#how-to-get-there).
See the [tracks of the Biohackathon](/news/2025-09-01-interuniversity-hackathon#tracks).
```

After previewing, click each anchor link to check that it jumps to the right
place. A typo in the id just leaves you at the top of the page.

## Links to other pages of the site

Use a **relative** link that starts with `/` and has **no trailing slash**:

| Do | Don't |
|----|-------|
| `[news](/news)` | `[news](/news/)` |
| `[workshops](/news/2025-09-23-biohackathon25-workshops)` | `[workshops](https://rsg-belgium.org/news/2025-09-23-biohackathon25-workshops)` |
| `[our team](/organization)`, `[contact us](/contact)`, `[Slack](/slack)` | `[Slack](http://www.rsg-belgium.iscbsc.org/slack/)` (old site) |

## Not supported, do not use

The old site was built with Jekyll. Old posts contain syntax that does
**not** work here and shows up as literal text. Don't copy it.

| Don't use | Example | Use instead |
|-----------|---------|-------------|
| Liquid tags and variables | `{{ site.baseurl }}/images/x.png`, `{% include ... %}` | A plain path: `/images/x.png` |
| kramdown attribute lists | `![poster](/images/x.png){: .center}`, `{: .notice}` | Nothing. Images are centred automatically. |
| Trailing slashes on internal links | `/news/`, `/contact/` | `/news`, `/contact` |
| Absolute links to our own site | `https://rsg-belgium.org/news/...` | `/news/...` |
| Font Awesome icons | `<i class="fab fa-slack"></i>` | Plain text. Font Awesome isn't loaded, so the icon renders as nothing. |
| Unicode "fancy" bold/italic letters | `𝗕𝗼𝗹𝗱 𝘁𝗲𝘅𝘁`, `𝘐𝘵𝘢𝘭𝘪𝘤` | `**Bold text**`, `_Italic_` |
| Placeholder alt text | `![full](/images/x.png)`, `![](/images/x.png)` | A description: `![Poster for Beerformatics on 5 November 2026 in Ghent](/images/x.png)` |

### Why no "fancy" Unicode letters?

Text such as 𝗕𝗼𝗹𝗱 is often pasted from LinkedIn or Instagram. It looks bold,
but it is made of mathematical symbols, not letters. Screen readers read it
letter by letter as "mathematical bold capital B..." or skip it, search
engines and the browser's find-in-page don't match it, and some fonts can't
display it. Use Markdown `**bold**` and `_italic_` instead.
