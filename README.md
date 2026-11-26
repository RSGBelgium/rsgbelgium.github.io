# RSG-Belgium Website

[![Deploy](https://github.com/RSGBelgium/rsgbelgium.github.io/actions/workflows/nextjs.yml/badge.svg)](https://github.com/RSGBelgium/rsgbelgium.github.io/actions/workflows/nextjs.yml)

The website of RSG-Belgium, the community of bioinformatics and computational biology students and young researchers in Belgium: **<https://rsg-belgium.org>**.

It is a static site built with [Next.js](https://nextjs.org) 15 (App Router, static export), React 19, TypeScript and Tailwind CSS 3. News posts and team profiles are Markdown files, and GitHub Actions publishes the site to GitHub Pages.

**Adding a news post or a team member?** Read the [content editing guides](guides/README.md). You don't need to know React or Next.js.

## Features

- Fully static site (`output: 'export'`), served by GitHub Pages: no server to maintain
- Content in Markdown with GitHub Flavored Markdown: tables, task lists, footnotes, automatic links
- Light and dark theme with WCAG AA colour tokens, and a theme switcher
- Accessible by design: one `<h1>` per page, a skip link, labelled navigation, descriptive links
- SEO: per-page titles and descriptions, canonical URLs, Open Graph images, `sitemap.xml`, `robots.txt` and an RSS feed (`/feed.xml`)
- Quality gate on every pull request: ESLint, Prettier, TypeScript, Jest, a content check and a check of the built site

## Color Palette

Colours are semantic **tokens** that switch between a light and a dark theme (a "neutral slate" palette with the brand blue and pink). They are CSS variables in `src/app/globals.css` (`:root` is the light theme, `.dark` the dark theme), turned into Tailwind colours in `tailwind.config.ts`. Every text/background pairing in the table passes WCAG AA.

| Token                         | Light                 | Dark                  | Use                                                                                                       |
| ----------------------------- | --------------------- | --------------------- | --------------------------------------------------------------------------------------------------------- |
| `background`                  | `#F8FAFC`             | `#0F172A`             | Page background                                                                                           |
| `surface`                     | `#FFFFFF`             | `#1E293B`             | Cards, header, footer                                                                                     |
| `surface-muted`               | `#F1F5F9`             | `#273449`             | Code blocks, table headers, quote panels                                                                  |
| `border`                      | `#E2E8F0`             | `#334155`             | Dividers, card borders (also the default colour of `border` and `<hr>`)                                   |
| `foreground`                  | `#0F172A`             | `#F1F5F9`             | Body text                                                                                                 |
| `foreground-muted`            | `#475569`             | `#94A3B8`             | Dates, captions, roles                                                                                    |
| `primary`                     | `#004AAD`             | `#2E6FD8`             | Buttons, the active nav item (brand blue)                                                                 |
| `primary-hover`               | `#003A8A`             | `#245DBF`             | Hover colour of primary buttons                                                                           |
| `primary-foreground`          | `#FFFFFF`             | `#FFFFFF`             | Text on primary and on the hero gradient                                                                  |
| `link`                        | `#004AAD`             | `#8FBBFF`             | Links                                                                                                     |
| `accent`                      | `#E385EC`             | `#E385EC`             | Brand pink, **decorative only**                                                                           |
| `accent-strong`               | `#9A2BA6`             | `#EFA8F5`             | Pink text, the keyboard focus outline                                                                     |
| `highlight`                   | `#D6E8FF`             | `#1E3A5F`             | Secondary buttons, info panels                                                                            |
| `hero-start` → `hero-end`     | `#004AAD` → `#9A2BA6` | `#0B2A5B` → `#4A1752` | Homepage hero gradient                                                                                    |
| `poster-start` → `poster-end` | `#FCE0E3` → `#FEEEAD` | `#FCE0E3` → `#FEEEAD` | Our event posters' gradient, behind the logo on news cards without a picture (the logo's lettering: 13:1) |

- **`accent` is decorative only** (gradients, borders, the ring around team avatars). As text on a light background it is 2.4:1 and fails WCAG; use `accent-strong` for pink text.
- **Use the tokens, not fixed colours.** Write `bg-surface text-foreground`, not `bg-white text-gray-900 dark:bg-slate-800 dark:text-white`. The tokens change with the theme, so components don't need `dark:` classes. Opacity modifiers work, e.g. `bg-highlight/50`.
- The class names follow the token names: `bg-background`, `bg-surface`, `bg-surface-muted`, `border-border`, `text-foreground`, `text-foreground-muted`, `bg-primary`, `hover:bg-primary-hover`, `text-primary-foreground`, `text-link`, `border-accent`, `text-accent-strong`, `bg-highlight`, `from-hero-start to-hero-end`, `from-poster-start to-poster-end`.
- Buttons: use `src/components/Button.tsx` with `variant="primary"`, `"secondary"`, `"outline"` or `"inverse"` (white, for the hero gradient). The variant colours are the `.button-*` classes in `globals.css`.
- The theme is set by [next-themes](https://github.com/pacocoursey/next-themes), which puts `class="dark"` on `<html>`; visitors choose Light, System or Dark with the switcher in the header. Only use `dark:` for what a token can't do, such as swapping an image.
- To change a colour, edit its value under both `:root` and `.dark` in `globals.css` (as RGB channels, e.g. `0 74 173`) and check the contrast: at least 4.5:1 for text, 3:1 for icons, control borders and the focus outline.

## Getting started

### Prerequisites

- [Node.js](https://nodejs.org) **26**, the current Active LTS release. The version is in [`.nvmrc`](.nvmrc): with [nvm](https://github.com/nvm-sh/nvm) or [fnm](https://github.com/Schniz/fnm), run `nvm use` or `fnm use` in the repository. npm comes with Node.js.
- [Git](https://git-scm.com).

### Installation

```bash
git clone https://github.com/RSGBelgium/rsgbelgium.github.io.git
cd rsgbelgium.github.io
npm ci          # install the exact versions from package-lock.json
npm run dev     # start the development server
```

Open <http://localhost:3000>. Pages reload when you save a file.

No environment variables or `.env` files are needed.

## Scripts

| Command                   | What it does                                                                                                                 |
| ------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| `npm run dev`             | Development server at <http://localhost:3000>, with hot reload.                                                              |
| `npm run build`           | Builds the static site into `out/` (`next build`).                                                                           |
| `npm run lint`            | ESLint with the Next.js core-web-vitals and TypeScript rules. Fails on any warning. `npm run lint:fix` fixes what it can.    |
| `npm run format`          | Formats the code with Prettier. `npm run format:check` only checks (CI runs this).                                           |
| `npm run typecheck`       | Type-checks the app and the tests (`tsc --noEmit`).                                                                          |
| `npm test`                | Runs the Jest tests. `npm run test:watch` re-runs them on save; `npm run test:ci` adds a coverage report in `coverage/`.     |
| `npm run check:content`   | Checks the posts and team profiles in `content/` (see below).                                                                |
| `npm run optimize:images` | Shrinks the images in `public/images/` and converts them to WebP, updating their links (see below).                          |
| `npm run check:assets`    | Checks the files in `public/`: no unused files, size budget, file names (see below).                                         |
| `npm run check:site`      | Checks the built site in `out/` with html-validate and linkinator (run `npm run build` first; see below).                    |
| `npm run ci`              | Everything CI runs, in the same order: lint, format check, type check, tests, content check, asset check, build, site check. |

To preview the exported site as GitHub Pages will serve it, run `npm run build` and then `npx serve@latest out`. (`next start` does not work with a static export.)

## Quality checks

Every check runs in CI on each pull request; run `npm run ci` to run them all locally before you push.

### Linting and formatting

- **ESLint** ([`eslint.config.mjs`](eslint.config.mjs)) uses `eslint-config-next`'s `next/core-web-vitals` and `next/typescript` presets. Warnings fail the check, so fix them or, if a rule really doesn't apply, disable it for that line with a comment that says why.
- **Prettier** ([`.prettierrc.json`](.prettierrc.json)): double quotes, semicolons, 100 characters per line. `content/` and `guides/templates/` are never reformatted ([`.prettierignore`](.prettierignore)), because reformatting Markdown can change how a post renders. Set your editor to format on save with Prettier, or run `npm run format` before committing.
- [`.editorconfig`](.editorconfig) sets UTF-8, LF line endings and two-space indentation in most editors.
- The commit that first applied Prettier to the whole repository is listed in [`.git-blame-ignore-revs`](.git-blame-ignore-revs). GitHub's blame view skips it; locally, run `git config blame.ignoreRevsFile .git-blame-ignore-revs` once.

### Tests

[Jest](https://jestjs.io) with [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/), set up with `next/jest` ([`jest.config.mjs`](jest.config.mjs)). Tests live next to the code in `__tests__/` folders.

- Components and pages render in jsdom. Async server components (the homepage, `/news`, `/organization`, news posts) are awaited and their result is rendered, with `@/lib/api` mocked.
- Server-side code (`src/lib/`, the RSS feed, the sitemap) runs in Node.js: those files start with a `@jest-environment node` comment. The content loader is tested against small fixture folders, never against the real `content/`.
- Prefer queries by role and accessible name (`getByRole("link", { name: "..." })`): they test what visitors and screen readers get.

### Content check

`npm run check:content` ([`scripts/check-content.mjs`](scripts/check-content.mjs)) reports problems in `content/` as `file:line` with a fix:

- **News posts:** valid front matter; `title` and `date` set; the date in quotes, as `"YYYY-MM-DD"` or `"YYYY-MM-DD HH:mm"`; `coverImage`, `cardImage` and every `/images/...` or `/assets/...` link or image exists in `public/`; `/news/...` links point to existing posts and other internal links to existing pages or files; no relative or mistyped links; no Liquid (`{{ }}`, `{% %}`) or kramdown (`{: }`, `{#id}`) syntax; no "fancy" Unicode letters; no raw `<h1>`; a `title` on every `<iframe>`; no link texts like "here" or "read more".
- **Team profiles:** `name` set; `linkedin`/`orcid` empty or `https://` URLs; `image` empty or an existing file; `order` set, and the profiles numbered 1 to n (each number once, no gaps).
- **Privacy:** no e-mail addresses or phone numbers in team profiles, and no spreadsheets or data exports (`.csv`, `.xlsx`, `.ods`, ...) tracked by git: board registries and registration exports contain personal data and must never be committed.

### Images and the asset check

The site is a static export with `images.unoptimized` ([`next.config.js`](next.config.js)): nothing resizes or converts images at build time, and visitors download the files in `public/` exactly as they are. Images are therefore optimised **at the source**, before they are committed:

- `npm run optimize:images` ([`scripts/optimize-images.mjs`](scripts/optimize-images.mjs), with [sharp](https://sharp.pixelplumbing.com)) turns the JPEG, PNG and WebP files in `public/images/` upright (EXIF), scales them down to at most 1600 px on the long side (team photos 600 px), strips their metadata (camera, GPS location) and saves them as WebP at quality 80. A post's `coverImage` is also its link preview, so cover images are saved as JPEG instead. SVGs that embed photos are rendered to WebP; plain drawings such as logos stay SVG. Converted originals are deleted and every link to them (in `content/`, `src/`, `guides/`, this README and `public/`) is updated. It also generates all favicons in `public/favicon/` from `public/favicon/favicon.svg`, including a 16/32/48 px `favicon.ico`. Optimised files are left alone: running it twice changes nothing the second time. `src/app/opengraph-image.png` (the default link preview) stays a PNG.
- `npm run check:assets` ([`scripts/check-assets.mjs`](scripts/check-assets.mjs)) fails on any file in `public/` that nothing links to (matched by URL path, with the exact upper/lower case; links in tests don't count), on raster images over **300 KB** and SVGs over **100 KB** (PDFs and calendar files are exempt), and on `/images/`, `/assets/` or `/favicon/` paths in the code that are not files. Before that, [ls-lint](https://ls-lint.org) ([`.ls-lint.yml`](.ls-lint.yml)) checks the file names: lower-case extensions of the allowed file types, and only letters, digits, `-` and `_` (no spaces). `npm run check:assets -- --list` prints every file with its size and where it is used. After optimisation the largest image is about 180 KB.
- In posts, every image gets `loading="lazy"` and `decoding="async"`, and local images also get their `width` and `height`, read from the file at build time ([`src/lib/image-size.ts`](src/lib/image-size.ts)), so pages don't jump while images load. Only the home page's logo is preloaded (`priority`).

### Site check

`npm run check:site` checks every page in `out/` after a build, with two libraries:

- [html-validate](https://html-validate.org) ([`.htmlvalidate.json`](.htmlvalidate.json)): exactly one `<h1>` and no skipped heading levels, one `<main>`, `alt` on every image, a `title` on every iframe, no duplicate ids.
- [linkinator](https://github.com/JustinBeckwith/linkinator) ([`linkinator.config.json`](linkinator.config.json)): every internal link, image and `#anchor` resolves. It serves `out/` itself; extensionless URLs such as `/news` are checked as `/news.html`, as GitHub Pages serves them. External links are not fetched.

The skip link coming first is a unit test (`src/app/__tests__/layout.test.tsx`); leftover template syntax and generic link texts are caught earlier, in the markdown, by the content check.

## CI/CD

GitHub Actions workflows live in [`.github/workflows/`](.github/workflows/).

**On every pull request**, [CI](.github/workflows/ci.yml) runs on Node.js from `.nvmrc`: `npm ci`, lint, format check, type check, tests with coverage, content check, asset check, build (with the Next.js build cache) and site check. The built site is attached to the run as the `site` artifact, so reviewers can download and look at it. A new push to the pull request cancels the outdated run. CI can also be started by hand from the Actions tab.

**On every push to `main`** (a merged pull request), [Deploy to GitHub Pages](.github/workflows/nextjs.yml) runs the same CI first. Only when it passes does it take the `site` artifact that CI built and checked, and publish exactly those files to GitHub Pages. One deployment runs at a time.

**Dependabot** ([`.github/dependabot.yml`](.github/dependabot.yml)) opens weekly pull requests for npm packages and GitHub Actions: minor and patch updates grouped into one pull request, major updates separately. Majors that need a planned migration (Next.js, eslint-config-next, ESLint, TypeScript, Tailwind CSS) are skipped.

Maintainers: in the repository settings, protect `main` with a rule that requires the "Lint, test, build and check" status check (from CI), so that nothing that fails it can be merged.

## Deployment

The site is deployed to GitHub Pages **only** by the [Deploy to GitHub Pages](.github/workflows/nextjs.yml) workflow, on every push to `main`. There is no manual deploy step and no deploy script.

- Repository settings → Pages → Source must be **GitHub Actions**. The custom domain `rsg-belgium.org` is set there too; the site needs no `basePath`.
- `next build` writes the static site to `out/` (`output: 'export'` in [`next.config.js`](next.config.js)). Everything is rendered at build time: there are no API routes or server-side features at runtime, and images are served as they are (`images.unoptimized`).
- A failed deployment can be re-run from the Actions tab, or started by hand with "Run workflow" on `main`.
- The old `gh-pages` branch (from the former `npm run deploy` with the `gh-pages` package) is no longer used. A maintainer can delete it.

## Project structure

```text
content/
  news/              News posts and event announcements (Markdown); the file name is the URL
  organization/      Team member profiles (Markdown), one file per person
guides/              Guides and templates for content editors: start here to add content
public/              Static files served as they are: images/, assets/ (PDFs, calendar files), favicon/
scripts/             check-content.mjs, check-assets.mjs, optimize-images.mjs and their shared helpers (lib/)
src/
  app/               Next.js App Router: pages, the root layout, feed.xml, sitemap and robots
    _components/     Components of the site's layout and posts (header, footer, post body, ...)
  components/        Reusable components (Button, HeroSection, TeamMemberCard, ...)
  interfaces/        TypeScript types for posts, members and authors
  lib/               Content loader (api.ts), Markdown to HTML, excerpts, contact channels, constants
.github/             CI and deploy workflows, Dependabot
```

Configuration lives in the root: `next.config.js`, `tailwind.config.ts`, `postcss.config.js`, `tsconfig.json`, `eslint.config.mjs`, `.prettierrc.json`, `jest.config.mjs` and `jest.setup.ts`. `out/`, `.next/`, `coverage/` and `node_modules/` are generated and git-ignored.

## Accessibility

Pages are written to work with a keyboard and a screen reader: semantic HTML, one `<h1>` per page, a "Skip to main content" link, a mobile menu that is a proper disclosure button, visible focus rings, decorative images hidden from screen readers and links that say where they go. The site check enforces the basics on every build; for bigger changes, also test with a keyboard and run an audit such as Lighthouse.

## Contributing

1. Create a branch from an up-to-date `main`. Nobody commits to `main` directly.
2. Make your change. Content editors: follow the [content editing guides](guides/README.md).
3. Run `npm run ci` (or at least `npm run check:content` for content-only changes). If you added images, run `npm run optimize:images` first.
4. Add files by name (`git add path/to/file`), not with `git add .`, so that you never commit unrelated or private files, and never commit personal data such as member lists or registration exports.
5. Push the branch and open a pull request. CI checks it, and another board member reviews it. Once it is merged, the site is deployed automatically.
