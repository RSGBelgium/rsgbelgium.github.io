# News posts

A news post is a Markdown file in `content/news/`. It has two parts:

1. **Front matter**: settings between two `---` lines at the very top of the
   file, written in YAML.
2. **Body**: the post text in Markdown, below the front matter. See
   [Markdown](markdown.md).

```markdown
---
title: "Beerformatics - Ghent Edition"
date: "2026-10-15"
excerpt: "Three short talks on bioinformatics and AI, followed by networking and free drinks in Ghent on 5 November."
category: "news"
---

Beerformatics is coming to Ghent!
```

## File name

Name the file `YYYY-MM-DD-short-slug.md` (for example
`2026-10-15-beerformatics-ghent.md`), using lowercase letters, digits and
hyphens only. The file name without `.md` is the post's URL
(`/news/2026-10-15-beerformatics-ghent`), so **never rename a published
post**. See the [README](README.md#the-file-name-is-the-url).

Older posts end in `.markdown`. That still works, but use `.md` for new posts.

## Front matter reference

| Field | Required? | Example | What it does |
|-------|-----------|---------|--------------|
| `title` | **Required** | `"Meet the speakers: Beerformatics May 2026"` | Post heading, card title on `/news` and the homepage, and the browser tab/search result title. Always quote it, especially if it contains a `:`. |
| `date` | **Required** | `"2026-05-15"` or `"2026-05-15 18:30"` | Publication date. It is displayed under the title (as "May 15, 2026") and decides the order on `/news` and the homepage (newest first). **Always put it in quotes**, see below. |
| `excerpt` | Strongly recommended | `"Speakers at the May edition of Beerformatics 2026"` | One or two sentences shown on the post cards and used as the description for search engines, link previews (Slack, LinkedIn, ...) and the RSS feed. Without it, the website uses the first ~160 characters of the post text, which is rarely as good a summary. |
| `coverImage` | Optional | `"/images/poster/2026-10-15-beerformatics-ghent.jpg"` | Large image shown at the top of the post, on its card, and in link previews (without it, previews show the default RSG-Belgium image). Use a full path starting with `/images/`. Landscape images (about 2:1) work best. |
| `category` | Optional | `"news"` | Free-text label. It is not displayed on the site at the moment. Use `"news"`, or an event-specific value such as `"biohackathon2025"`. |

### Always quote the date

Write the date in quotes, in one of these two formats:

```yaml
date: "2026-05-15"         # date only
date: "2026-05-15 18:30"   # date and time (24h); only used for ordering
```

Without quotes, YAML turns `2026-05-15` into a different kind of value than
`2026-05-15 18:30`. This used to put posts in the wrong order. Use the date
you publish the post, not the date of the event. The event date belongs in
the post text.

Use `YYYY-MM-DD` with leading zeros (`"2026-05-04"`, not `"2026-5-4"`).

### Fields not to use

| Field | Why |
|-------|-----|
| `layout`, `toc`, `categories` | Leftovers from the old Jekyll site. They are ignored. Leave them out of new posts. (Existing posts still have them; that's harmless.) |
| `author` | Not supported as text. `author: "Jane Doe"` makes the post show "Anonymous". Leave it out: every post is shown as written by RSG-Belgium. |
| `preview`, `ogImage` | Not supported (template leftovers). Don't use them. Use `coverImage` for the link-preview image. |

## Body

- Don't repeat the title as a `#` heading. The title is already shown as the
  page heading. Start your sections at `##` and don't skip levels.
- Write link text that says where the link goes ("register for the
  symposium"), not "click here", and give every embedded map (`<iframe>`) a
  `title`. See [Write for everyone](markdown.md#write-for-everyone).
- Put the essentials (what, when, where, how to register) in the first few
  lines.
- See [Markdown](markdown.md) for what you can use and what is not
  supported, and [Images and files](images-and-files.md) for posters and
  photos.

## Checklist

- [ ] File is `content/news/YYYY-MM-DD-short-slug.md`, lowercase, no spaces
- [ ] `title` and `date` are set, and `date` is in quotes
- [ ] `excerpt` is set
- [ ] Every image has descriptive alt text and its file exists under `public/`
- [ ] Internal links start with `/` and have no trailing slash (`/news/...`, not `https://rsg-belgium.org/news/.../`)
- [ ] Body headings start at `##` and don't skip a level
- [ ] Link texts are descriptive (no "here"), and every `<iframe>` has a `title`
- [ ] No Liquid (`{{ }}`, `{% %}`), kramdown (`{: .class}`) or "fancy" Unicode bold text
- [ ] Checked for typos, and every link opens the right page
- [ ] Previewed with `npm run dev`
