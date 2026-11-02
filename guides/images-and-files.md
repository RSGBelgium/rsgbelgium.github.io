# Images and files

Images, PDFs and calendar files live in the `public/` folder. Everything in
`public/` is published as-is, and **the URL is the path without `public/`**:

| Put the file in                | It is available at             | Use it for                                              |
| ------------------------------ | ------------------------------ | ------------------------------------------------------- |
| `public/images/poster/`        | `/images/poster/<file>`        | Event posters, speaker line-ups, cover images           |
| `public/images/photo_gallery/` | `/images/photo_gallery/<file>` | Event photos, wrap-up collages                          |
| `public/images/team/`          | `/images/team/<file>`          | Team member portraits                                   |
| `public/images/logo/`          | `/images/logo/<file>`          | Logos (RSG-Belgium, event series, partner institutions) |
| `public/images/maps/`          | `/images/maps/<file>`          | Campus maps, directions                                 |
| `public/assets/pdf/`           | `/assets/pdf/<file>`           | Printable flyers, programmes, brochures                 |
| `public/assets/ics/`           | `/assets/ics/<file>`           | Calendar invites ("add to calendar")                    |

Example: `public/images/poster/2026-10-15-beerformatics-ghent.webp` is used in
a post as `/images/poster/2026-10-15-beerformatics-ghent.webp`.

There are no other image folders. Paths from the old site such as
`/assets/img/...` or `/assets/pdf/poster/...` don't exist.

## File names

- Use **lowercase letters, digits and hyphens** only: no spaces, no
  accents, no capitals. Example: `2026-10-15-beerformatics-ghent.jpg`.
- Start event files with the event date (`YYYY-MM-DD-`) so they sort
  together and are easy to find.
- Paths are **case-sensitive** on the live site: `photo.JPG` and `photo.jpg`
  are different files. A wrong capital letter works on some laptops but
  breaks on the website. (`npm run optimize:images` turns `photo.JPG` into
  `photo.webp` and fixes the links for you.)
- Don't rename or delete files that published posts already use. That
  breaks those posts.

## Size and format

The website doesn't shrink images for you: visitors download every file
exactly as it is in `public/`. A photo straight from a phone is 3-5 MB; on
the website it should be 50-200 KB.

So add your images in any common format (JPEG, PNG or WebP; export posters
from Canva or Illustrator as PNG or JPEG), link them in your post, and then
run:

```bash
npm run optimize:images
```

It does everything for you:

- scales images down (never up) to at most **1600 px** on the long side,
  team portraits to **600 px**;
- turns photos upright and removes their metadata (camera details, GPS
  location);
- converts them to **WebP**: `poster.png` becomes `poster.webp`, the
  original is deleted, and the links in your posts are updated. A post's
  cover image (`coverImage`) becomes a **JPEG** instead, because not every
  social network shows WebP link previews;
- renders SVG posters that contain photos (e.g. from Inkscape) to WebP.
  Logos stay SVG.

Look at the result in the preview, then commit the new files and the
deleted originals. Running it again changes nothing, and
`npm run optimize:images -- --dry-run` only shows what it would do.

| Kind                                | Folder           | After `npm run optimize:images`                                          |
| ----------------------------------- | ---------------- | ------------------------------------------------------------------------ |
| Photos                              | `photo_gallery/` | WebP, at most 1600 px                                                    |
| Posters, flyers, graphics with text | `poster/`        | WebP, at most 1600 px (a cover image: JPEG)                              |
| Team portraits                      | `team/`          | WebP, at most 600 px. Roughly square, face centred (cropped to a circle) |
| Logos                               | `logo/`          | SVG, unchanged                                                           |
| PDFs                                | `assets/pdf/`    | Unchanged: export them "for web" or "smallest file size"                 |

### The asset check

`npm run check:assets` checks every file in `public/`. It runs on every pull
request too, and fails when:

- an image is too big: more than **300 KB** for a WebP, JPEG or PNG, or
  **100 KB** for an SVG. Run `npm run optimize:images`. PDFs and calendar
  files have no limit: they are downloads for printing.
- a file isn't used by any post, profile or page. Delete it (git keeps old
  versions) or link to it. When you take an image out of a post, or a member
  leaves the board, delete their image too.
- a file name has an upper-case extension (`.JPG`) or spaces.

Each problem is listed with the file and how to fix it.
`npm run check:assets -- --list` shows every file, its size and where it is
used.

## Using images in a post

```markdown
![Poster for Beerformatics on 5 November 2026 in Ghent](/images/poster/2026-10-15-beerformatics-ghent.webp)
```

Images are centred and scaled to the width of the text automatically. They
load as readers scroll down, and the page keeps their space free while they
load, so the text doesn't jump.

To let readers open the full-size image or a PDF by clicking it, wrap the
image in a link:

```markdown
[![Poster for the RSG-Belgium Student Symposium on 4 December 2026](/images/poster/2026-12-04-student-symposium.webp)](/assets/pdf/2026-12-04-student-symposium.pdf)
```

To use an image as the post's cover (shown at the top of the post, on its
card and in link previews), set it in the front matter instead. See
[News posts](news-post.md):

```yaml
coverImage: "/images/poster/2026-10-15-beerformatics-ghent.jpg"
```

## Always write alt text

The text in `![...]` is the image's **alt text**. Screen readers read it
aloud, and it's shown when the image fails to load. Every image needs one.

- Describe what the image shows or is for: "Poster for Beerformatics on
  5 November 2026 in Ghent", "Map of KU Leuven Campus Gasthuisberg showing
  the route to Aula O&N5", "Speakers presenting at Beerformatics Leuven,
  March 2026".
- If the image contains important text (date, place, speakers), make sure
  that information is also in the post text. Screen readers can't read
  posters.
- Don't write "image", "full", "photo.jpg" or leave it empty.
- Keep it to one sentence. Don't start with "Image of...".

If you use an HTML `<img>` tag, add an `alt` attribute:
`<img src="/images/logo/beerformatics_logo.svg" alt="Beerformatics logo" style="max-width:150px;">`.

## PDFs and calendar files

Link them like any other page:

```markdown
[Download the programme (PDF)](/assets/pdf/2026-11-05-beerformatics-programme.pdf)
[Add to your calendar](/assets/ics/2026-11-05-beerformatics.ics)
```

Say in the link text that it's a PDF or a calendar file, so people know
what they'll get.
