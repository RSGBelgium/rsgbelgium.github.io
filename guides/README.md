# Content editing guides

These guides are for anyone who adds or updates content on the RSG-Belgium
website (<https://rsg-belgium.org>): news posts, event announcements and
team profiles. You do not need to know React or Next.js. You only edit
Markdown files and add images to a folder.

Start from a template in [`templates/`](templates/). Don't copy an old post:
many older posts contain syntax that no longer works.

## Guides

| Guide | What it covers |
|-------|----------------|
| [News posts](news-post.md) | File naming, front matter (`title`, `date`, `excerpt`, ...) |
| [Markdown](markdown.md) | Supported syntax, headings and anchor links, and what **not** to use |
| [Images and files](images-and-files.md) | Where images, PDFs and calendar files go, naming, sizes, alt text |

## Templates

Copy a template, rename it and fill it in. The comments in each template explain
every section. Delete the comments when you are done.

| Template | Use it for | Copy it to |
|----------|-----------|------------|
| [event-announcement.md](templates/event-announcement.md) | Announcing an event (symposium, hackathon, Beerformatics, workshop) | `content/news/` |
| [speaker-announcement.md](templates/speaker-announcement.md) | "Meet the speakers" posts, e.g. for Beerformatics | `content/news/` |
| [event-wrapup.md](templates/event-wrapup.md) | A short report with photos after an event | `content/news/` |
| [general-news.md](templates/general-news.md) | Any other news (board changes, calls, partnerships) | `content/news/` |
| [member-profile.md](templates/member-profile.md) | A board or team member profile | `content/organization/` |

## Where content lives

| What | Folder | Shown at |
|------|--------|----------|
| News posts and event announcements | `content/news/` | `/news` and the homepage ("Latest News") |
| Team member profiles | `content/organization/` | `/organization` |
| Images, posters, photos | `public/images/...` | see [Images and files](images-and-files.md) |
| PDFs and calendar files | `public/assets/pdf/`, `public/assets/ics/` | see [Images and files](images-and-files.md) |

The homepage, About, Contact and Slack pages are written in code (`src/app/`).
Ask a developer if you need to change them.

## Adding a news post

1. **Pick a template** from [`templates/`](templates/) and copy it to
   `content/news/`.
2. **Name the file** `YYYY-MM-DD-short-slug.md`, for example
   `2026-10-15-beerformatics-ghent.md`:
   - use the publication date, lowercase letters, digits and hyphens only;
     no spaces;
   - keep the slug short and descriptive.
3. **Fill in the front matter** (the block between the `---` lines). See
   [News posts](news-post.md). Always quote the date: `date: "2026-10-15"`.
4. **Write the post** in Markdown. See [Markdown](markdown.md).
5. **Add images and files** to `public/` and link them. See
   [Images and files](images-and-files.md).
6. **Preview** it locally (see below), then open a pull request.

### The file name is the URL

The file name without its extension becomes the page address:
`content/news/2026-10-15-beerformatics-ghent.md` is published at
`https://rsg-belgium.org/news/2026-10-15-beerformatics-ghent`.

**Never rename, move or delete a published post.** People share these links,
and other posts link to them, so renaming one breaks those links. To
correct a published post, edit its content and keep the file name.

Posts are ordered by the `date` in their front matter, not by file name.

## Adding or updating a team member

1. Copy [`templates/member-profile.md`](templates/member-profile.md) to
   `content/organization/firstname-lastname.md`.
2. Add their portrait to `public/images/team/` (see
   [Images and files](images-and-files.md)).
3. Fill in `name`, `title` (their role) and `image`, plus `linkedin` and
   `orcid` if they have them, and write a short bio below the front matter.

Members are listed alphabetically by name on `/organization`. When someone
leaves the board, move their file to `content/organization/old/`. Files in
subfolders are not shown on the site.

## Previewing your changes

You need [Node.js](https://nodejs.org/) (version 18.18 or later) and the
repository on your computer.

```bash
npm ci        # first time only: installs dependencies
npm run dev   # starts a local preview server
```

Open <http://localhost:3000/news> and click your post, or go straight to
`http://localhost:3000/news/<your-file-name-without-extension>`. The page
reloads when you save the file.

Check that:

- the title, date and excerpt look right on `/news` and on the homepage;
- every image shows up and every link works, including `#anchor` links;
- nothing appears as raw code, such as `{{ ... }}`, `{: ... }` or `{#...}`.

Optionally, run `npx next build` to check that the whole site still builds.

## Publishing (branch, pull request, review)

Nobody commits directly to `main`. Every change goes through a pull request:

1. Update `main` and create a branch named after your change:
   ```bash
   git checkout main
   git pull
   git checkout -b content/beerformatics-ghent-announcement
   ```
2. Add your files and commit. Add files by name, not with `git add .`, so
   that you don't commit unrelated or private files:
   ```bash
   git add content/news/2026-10-15-beerformatics-ghent.md public/images/poster/2026-10-15-beerformatics-ghent.jpg
   git commit -m "Add Beerformatics Ghent announcement"
   git push -u origin content/beerformatics-ghent-announcement
   ```
3. Open a pull request on GitHub and ask another board member to review it.
4. When the pull request is merged into `main`, GitHub Actions rebuilds and
   publishes the site automatically. It is usually live within a few minutes.

Never commit personal data such as member lists, registration exports or
spreadsheets. Git keeps every committed file in its history, even after the
file is deleted, and everyone with access to the repository can see it.

If you get stuck, ask in the board Slack channel or open an issue on GitHub.
