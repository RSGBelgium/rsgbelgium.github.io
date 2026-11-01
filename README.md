[![Build Status](https://img.shields.io/badge/build-passing-brightgreen)](https://github.com/rsg-belgium/website/actions)
[![Coverage Status](https://img.shields.io/badge/coverage-100%25-brightgreen)](https://codecov.io/gh/rsg-belgium/website)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

# RSG-Belgium Website

This is the official website for RSG-Belgium, built with Next.js and TypeScript.

## Features

- Static site generation for optimal performance
- Markdown-based content management with GitHub Flavored Markdown support
- Responsive design with Tailwind CSS
- TypeScript for type safety
- Modern React features with Next.js 13+
- Dark mode support
- SEO optimized
- Automated testing and linting

## Color Palette

Colours are semantic **tokens** that switch between a light and a dark theme (a "neutral slate" palette with the brand blue and pink). They are CSS variables in `src/app/globals.css` (`:root` is the light theme, `.dark` the dark theme), turned into Tailwind colours in `tailwind.config.ts`. Every text/background pairing in the table passes WCAG AA.

| Token | Light | Dark | Use |
|-------|-------|------|-----|
| `background` | `#F8FAFC` | `#0F172A` | Page background |
| `surface` | `#FFFFFF` | `#1E293B` | Cards, header, footer |
| `surface-muted` | `#F1F5F9` | `#273449` | Code blocks, table headers, quote panels |
| `border` | `#E2E8F0` | `#334155` | Dividers, card borders (also the default colour of `border` and `<hr>`) |
| `foreground` | `#0F172A` | `#F1F5F9` | Body text |
| `foreground-muted` | `#475569` | `#94A3B8` | Dates, captions, roles |
| `primary` | `#004AAD` | `#2E6FD8` | Buttons, the active nav item (brand blue) |
| `primary-hover` | `#003A8A` | `#245DBF` | Hover colour of primary buttons |
| `primary-foreground` | `#FFFFFF` | `#FFFFFF` | Text on primary and on the hero gradient |
| `link` | `#004AAD` | `#8FBBFF` | Links |
| `accent` | `#E385EC` | `#E385EC` | Brand pink, **decorative only** |
| `accent-strong` | `#9A2BA6` | `#EFA8F5` | Pink text, focus rings |
| `highlight` | `#D6E8FF` | `#1E3A5F` | Secondary buttons, info panels |
| `hero-start` → `hero-end` | `#004AAD` → `#9A2BA6` | `#0B2A5B` → `#4A1752` | Homepage hero gradient |

- **`accent` is decorative only** (gradients, borders, the ring around team avatars). As text on a light background it is 2.4:1 and fails WCAG; use `accent-strong` for pink text.
- **Use the tokens, not fixed colours.** Write `bg-surface text-foreground`, not `bg-white text-gray-900 dark:bg-slate-800 dark:text-white`. The tokens change with the theme, so components don't need `dark:` classes. Opacity modifiers work, e.g. `bg-highlight/50`.
- The class names follow the token names: `bg-background`, `bg-surface`, `bg-surface-muted`, `border-border`, `text-foreground`, `text-foreground-muted`, `bg-primary`, `hover:bg-primary-hover`, `text-primary-foreground`, `text-link`, `border-accent`, `text-accent-strong`, `bg-highlight`, `from-hero-start to-hero-end`.
- Buttons: use `src/components/Button.tsx` with `variant="primary"`, `"secondary"`, `"outline"` or `"inverse"` (white, for the hero gradient). The variant colours are the `.button-*` classes in `globals.css`.
- The theme is set by [next-themes](https://github.com/pacocoursey/next-themes), which puts `class="dark"` on `<html>`; visitors choose Light, System or Dark with the switcher in the header. Only use `dark:` for what a token can't do, such as swapping an image.
- To change a colour, edit its value under both `:root` and `.dark` in `globals.css` (as RGB channels, e.g. `0 74 173`) and check the contrast: at least 4.5:1 for text, 3:1 for icons, control borders and focus rings.

## Getting Started

### Prerequisites

- Node.js 18.17 or later
- npm 9.0 or later

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/rsg-belgium/website.git
   cd website
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
4. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Environment Setup

Create a `.env.local` file in the root directory with the following variables:
```env
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

## Content Management

Website content is managed through Markdown files. See [guides/README.md](guides/README.md) for a detailed guide for content editors.

- News articles: `content/news/`
- Team member profiles: `content/organization/`
- Static pages: `content/pages/`

### Markdown Features

Supports GitHub Flavored Markdown (GFM):
- Tables
- Task lists
- Strikethrough
- Autolinks
- Syntax highlighting

Example table:
```markdown
| Feature | Description |
|---------|-------------|
| Tables | Full support for GFM tables |
| Lists | Ordered and unordered lists |
| Code | Syntax highlighting for code blocks |
```

## Linting & Formatting

- Run `npm run lint` to check for lint errors (uses ESLint).
- Run `npm run format` to auto-format code (uses Prettier).
- Pre-commit hooks (optional): Set up with Husky to enforce code style.

## Testing

- Run `npm test` to execute all tests (uses Jest and React Testing Library).
- Add tests for all new features and components.
- Test coverage is tracked (see badge above).

## Accessibility

- Components are built with accessibility (a11y) in mind.
- Please use semantic HTML and ARIA attributes where appropriate.
- Run accessibility audits (e.g., Lighthouse) before major releases.

## Continuous Integration (CI/CD)

- GitHub Actions run linting, tests, and builds on every pull request and push to `main`.
- The site is automatically deployed when changes are merged to `main`.

## Project Structure & Editing Guidelines

### 1. Content Editing (for website content editors)
See [guides/README.md](guides/README.md) for a full guide.

- `content/news/` — Markdown files for news articles/events.
- `content/organization/` — Markdown files for organization/team members.
- `content/pages/` — Markdown files for static pages.

### 2. Source Files (for developers)
- `src/app/` — Main Next.js app directory (pages, layouts, API routes, etc.)
- `src/components/` — Reusable React components.
- `src/lib/` — Utility functions and API logic.
- `src/interfaces/` — TypeScript interfaces for data models.
- `public/` — Static assets (images, favicons, PDFs, etc.).

### 3. Do Not Edit (auto-generated, dependencies, or config)
- `.next/`, `node_modules/`, `.git/`, `.DS_Store` — Build output, dependencies, and system files.
- `package.json`, `package-lock.json` — Dependency management (edit only via npm/yarn).
- `tsconfig.json`, `tailwind.config.ts`, `postcss.config.js`, `jest.config.js`, `jest.setup.js` — Project configuration files.
- `next-env.d.ts` — Auto-generated by Next.js for TypeScript.
- `README.md` — Project documentation.

#### Summary Table

| Directory/File         | Purpose                | Editable by Content Editors? | Editable by Developers? | Do Not Edit? |
|-----------------------|------------------------|------------------------------|------------------------|--------------|
| content/              | Website content        | Yes                          | Yes                    | No           |
| src/                  | Source code            | No                           | Yes                    | No           |
| public/               | Static assets          | Maybe (images)               | Yes                    | No           |
| .next/, node_modules/ | Build/deps output      | No                           | No                     | Yes          |
| config files          | Project config         | No                           | Yes                    | No           |
| README.md             | Project docs           | No                           | Yes                    | No           |

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

For more information on content editing, see [guides/README.md](guides/README.md).

## Deployment: Static Export & GitHub Pages

This site uses Next.js static export (`output: 'export'` in `next.config.js`) for optimal performance and compatibility with GitHub Pages.

### How to Deploy

1. Build and export the site:
   ```bash
   npm run deploy
   ```
   This runs `next build` and publishes the static output in the `out/` directory to the `gh-pages` branch using `gh-pages`.

2. In your GitHub repository settings, set GitHub Pages to deploy from the `gh-pages` branch, `/ (root)` folder.

3. Wait a few minutes, then visit your site at `https://rsgbelgium.github.io/`.

**Notes:**
- Do not use API routes or server-only features; all data fetching must be static (e.g., from markdown files).
- The `export` script and `next export` are no longer needed or supported with this setup.
- If you need to preview the static site locally, run:
  ```bash
  npx serve out
  ```
