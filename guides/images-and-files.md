# Images and files

Images, PDFs and calendar files live in the `public/` folder. Everything in
`public/` is published as-is, and **the URL is the path without `public/`**:

| Put the file in | It is available at | Use it for |
|-----------------|--------------------|------------|
| `public/images/poster/` | `/images/poster/<file>` | Event posters, speaker line-ups, cover images |
| `public/images/photo_gallery/` | `/images/photo_gallery/<file>` | Event photos, wrap-up collages |
| `public/images/team/` | `/images/team/<file>` | Team member portraits |
| `public/images/logo/` | `/images/logo/<file>` | Logos (RSG-Belgium, event series, partner institutions) |
| `public/images/maps/` | `/images/maps/<file>` | Campus maps, directions |
| `public/assets/pdf/` | `/assets/pdf/<file>` | Printable flyers, programmes, brochures |
| `public/assets/ics/` | `/assets/ics/<file>` | Calendar invites ("add to calendar") |

Example: `public/images/poster/2026-10-15-beerformatics-ghent.jpg` is used in
a post as `/images/poster/2026-10-15-beerformatics-ghent.jpg`.

There are no other image folders. Paths from the old site such as
`/assets/img/...` or `/assets/pdf/poster/...` don't exist.

## File names

- Use **lowercase letters, digits and hyphens** only: no spaces, no
  accents, no capitals. Example: `2026-10-15-beerformatics-ghent.jpg`.
- Start event files with the event date (`YYYY-MM-DD-`) so they sort
  together and are easy to find.
- Paths are **case-sensitive** on the live site: `photo.JPG` and `photo.jpg`
  are different files. A wrong capital letter works on some laptops but
  breaks on the website.
- Don't rename or delete files that published posts already use. That
  breaks those posts.

## Size and format

| Kind | Format | Size |
|------|--------|------|
| Photos | JPEG (`.jpg`) or WebP (`.webp`) | Max 1600 px on the long side, ideally ≤ 500 KB |
| Posters, flyers, graphics with text | PNG, JPEG or WebP; SVG for logos | Max 1600 px on the long side, ideally ≤ 500 KB |
| Team portraits | JPEG or WebP, roughly square | About 600 × 600 px, ≤ 200 KB |
| PDFs | PDF | As small as practical (export "for web"/"smallest file size") |

Large images make the site slow, especially on phones. Resize them before
adding them. Free tools: [Squoosh](https://squoosh.app/) (in the browser),
Preview on macOS (Tools → Adjust Size), or the Photos app on Windows
(Resize image).

Don't add images you don't use, and don't add several copies of the same
image.

## Using images in a post

```markdown
![Poster for Beerformatics on 5 November 2026 in Ghent](/images/poster/2026-10-15-beerformatics-ghent.jpg)
```

Images are centred and scaled to the width of the text automatically.

To let readers open the full-size image or a PDF by clicking it, wrap the
image in a link:

```markdown
[![Poster for the RSG-Belgium Student Symposium on 4 December 2026](/images/poster/2026-12-04-student-symposium.png)](/assets/pdf/2026-12-04-student-symposium.pdf)
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
