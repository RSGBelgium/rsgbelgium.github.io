# Markdown on the RSG-Belgium website

Posts and profiles are written in
[GitHub Flavored Markdown](https://github.github.com/gfm/) (GFM): standard
Markdown plus a few extras. If something renders correctly in a GitHub
comment or README, it will almost always render correctly here too. New to
Markdown? The [Markdown Guide](https://www.markdownguide.org/basic-syntax/)
explains the basics.

## What you can use

| Feature          | Write                                                 | Notes                                                                                                                                                                                                                           |
| ---------------- | ----------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Section headings | `## Programme`, `### Speakers`                        | Start at `##`. The post title is already the top-level heading (a `#` in the body is turned into `##` automatically). Don't skip levels (`##` then `###`, not `##` then `####`). See [Write for everyone](#write-for-everyone). |
| Bold, italic     | `**bold**`, `_italic_`                                |                                                                                                                                                                                                                                 |
| Strikethrough    | `~~cancelled~~`                                       | GFM                                                                                                                                                                                                                             |
| Links            | `[register for Beerformatics](https://forms.gle/...)` | External links open in a new tab automatically. The link text says where the link goes: no "here" or "click here".                                                                                                              |
| Automatic links  | `https://example.org` or `<https://example.org>`      | GFM: a bare URL becomes a link.                                                                                                                                                                                                 |
| Lists            | `- item` or `1. item`                                 | Indent by two spaces to nest.                                                                                                                                                                                                   |
| Task lists       | `- [ ] todo`, `- [x] done`                            | GFM                                                                                                                                                                                                                             |
| Tables           | see below                                             | GFM                                                                                                                                                                                                                             |
| Quotes           | `> text`                                              | Good for addresses or announcements.                                                                                                                                                                                            |
| Footnotes        | `text[^1]` ... `[^1]: note`                           | GFM                                                                                                                                                                                                                             |
| Horizontal rule  | `---` on its own line, with a blank line above        |                                                                                                                                                                                                                                 |
| Images           | `![alt text](/images/poster/file.jpg)`                | Centred automatically. See [Images and files](images-and-files.md).                                                                                                                                                             |
| Raw HTML         | `<br>`, `<iframe title="..." ...>`                    | Allowed, e.g. for embedded Google Maps. Use sparingly. Every `<iframe>` needs a `title`.                                                                                                                                        |

### Tables

```markdown
| Time  | Activity   |
| ----- | ---------- |
| 19:00 | Doors open |
| 19:30 | Talks      |
| 20:30 | Networking |
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

Google Maps "Embed a map" code can be pasted as-is, with one addition: a
`title` attribute is **required**, so screen reader users know what the frame
contains before they enter it. Name the place (and the city), and leave an
empty line before and after the frame:

```html
<iframe
  src="https://www.google.com/maps/embed?pb=..."
  title="Map of Zaal Couvreur, Leuven"
  width="600"
  height="450"
  style="border:0;"
  allowfullscreen=""
  loading="lazy"
  referrerpolicy="no-referrer-when-downgrade"
></iframe>
```

## Headings, anchors and in-page links

Every heading automatically gets an **id**, so you can link to it.

### Automatic ids

The id is generated from the heading text, the same way GitHub does it:
lowercase, spaces become `-`, and punctuation is removed.

| Heading                                           | Generated id                                 |
| ------------------------------------------------- | -------------------------------------------- |
| `## How to get there?`                            | `how-to-get-there`                           |
| `## Where and when?`                              | `where-and-when`                             |
| `### Data Exploration & Classical Bioinformatics` | `data-exploration--classical-bioinformatics` |
| a second `## Projects` on the same page           | `projects-1`                                 |

You cannot choose an id yourself: `## Tracks {#tracks}` (old Jekyll syntax)
shows up as literal text. If you reword a heading, its id changes too, so
update any links that point to it.

### Linking to a heading

```markdown
More information is provided [below](#how-to-get-there).
See the [tracks of the Biohackathon](/news/2025-09-01-interuniversity-hackathon#tracks).
```

After previewing, click each anchor link to check that it jumps to the right
place. A typo in the id just leaves you at the top of the page.

## Links to other pages of the site

Use a **relative** link that starts with `/` and has **no trailing slash**:

| Do                                                                           | Don't                                                                           |
| ---------------------------------------------------------------------------- | ------------------------------------------------------------------------------- |
| `[news](/news)`                                                              | `[news](/news/)`                                                                |
| `[workshops](/news/2025-09-23-biohackathon25-workshops)`                     | `[workshops](https://rsg-belgium.org/news/2025-09-23-biohackathon25-workshops)` |
| `[our team](/organization)`, `[contact us](/contact)`, `[Discord](/discord)` | `[Slack](http://www.rsg-belgium.iscbsc.org/slack/)` (old site)                  |

## Write for everyone

Some visitors use a screen reader, which reads the page aloud and lets them
jump from heading to heading or list all links. A few habits make posts work
for them, and for everyone else too.

| Do                                                                                                         | Don't                                                              | Why                                                                                                                                                                                                                        |
| ---------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Start body headings at `##`, and go one level deeper at a time (`##`, `###`, `####`)                       | `# Heading` in the body; `##` straight to `####`                   | The post title is the page's only `#` heading. Screen reader users navigate by heading level, so a skipped level looks like missing content. A `#` in the body is turned into `##` automatically, but write `##` yourself. |
| `[register for Beerformatics](https://forms.gle/...)`, `[download the programme (PDF)](/assets/pdf/x.pdf)` | `[click here](...)`, `[here](...)`, `[link](...)`, a bare long URL | Link text is often read on its own, in a list of all links on the page. "Here" says nothing about where it goes.                                                                                                           |
| `<iframe title="Map of Zaal Couvreur, Leuven" ...>`                                                        | `<iframe ...>` without `title`                                     | The title is the only name a screen reader can announce for the frame.                                                                                                                                                     |
| `![Poster for Beerformatics on 5 November 2026 in Ghent](/images/x.png)`                                   | `![](/images/x.png)`, `![full](...)`, `![image](...)`              | Alt text is read instead of the image. See [Images and files](images-and-files.md).                                                                                                                                        |
| `**bold**`, `_italic_`                                                                                     | Bold-looking text pasted from LinkedIn or Instagram                | See [Why no "fancy" Unicode letters?](#why-no-fancy-unicode-letters)                                                                                                                                                       |

## Not supported, do not use

The old site was built with Jekyll. Old posts contain syntax that does
**not** work here and shows up as literal text. Don't copy it.

| Don't use                           | Example                                                                                 | Use instead                                                                             |
| ----------------------------------- | --------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------- |
| Liquid tags and variables           | `{{ site.baseurl }}/images/x.png`, `{% include ... %}`                                  | A plain path: `/images/x.png`                                                           |
| kramdown attribute lists            | `![poster](/images/x.png){: .center}`, `{: .notice}`                                    | Nothing. Images are centred automatically.                                              |
| kramdown heading ids                | `## Tracks {#tracks}`                                                                   | `## Tracks`. Every heading gets an id automatically (here `tracks`).                    |
| Trailing slashes on internal links  | `/news/`, `/contact/`                                                                   | `/news`, `/contact`                                                                     |
| Absolute links to our own site      | `https://rsg-belgium.org/news/...`                                                      | `/news/...`                                                                             |
| Font Awesome icons                  | `<i class="fab fa-slack"></i>`                                                          | Plain text. Font Awesome isn't loaded, so the icon renders as nothing.                  |
| Unicode "fancy" bold/italic letters | Bold- or italic-looking text pasted from LinkedIn, Instagram or a "bold text generator" | `**Bold text**`, `_Italic_`                                                             |
| Placeholder alt text                | `![full](/images/x.png)`, `![](/images/x.png)`                                          | A description: `![Poster for Beerformatics on 5 November 2026 in Ghent](/images/x.png)` |

### Why no "fancy" Unicode letters?

LinkedIn and Instagram have no bold or italic, so posts there often use
"fancy" letters from a "bold text generator". They look bold, but they are
Unicode _mathematical symbols_, not letters. Screen readers read them symbol
by symbol as "mathematical bold capital B..." or skip them, search engines
and the browser's find-in-page don't match them, and some fonts can't display
them. When you copy a talk title or abstract from such a post, retype the
styled part as plain text and use Markdown `**bold**` and `_italic_` instead.

To check a piece of text, paste it into a plain-text editor (Notepad, or
TextEdit after Format → Make Plain Text). Real letters lose their bold
there; fancy letters still look bold.
