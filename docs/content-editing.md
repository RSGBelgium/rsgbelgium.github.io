# Content Editing Guide for RSG-Belgium Website

This guide is for content editors who want to add, update, or manage website content (news, team members, static pages) using Markdown files.

## Where to Edit Content

- **News articles:** `content/news/`
- **Team member profiles:** `content/organization/`
- **Static pages:** `content/pages/`

## Adding or Editing News Articles

1. **Create a new Markdown file** in `content/news/` (e.g., `2024-06-23-new-event.md`).
2. **Add frontmatter** at the top of the file:
   ```markdown
   ---
   title: "Event Title"
   date: "2024-06-23"
   excerpt: "A short summary of the event."
   coverImage: "/assets/blog/your-image.jpg"
   author: "Author Name"
   ---
   ```
3. **Write your article** in Markdown below the frontmatter.
4. **Save the file**. The site will automatically include it in the news section.

## Adding or Editing Team Members

1. **Create a new Markdown file** in `content/organization/` (e.g., `jane-doe.md`).
2. **Add frontmatter** at the top of the file:
   ```markdown
   ---
   name: "Jane Doe"
   title: "President"
   image: "/images/logo/institutions/jane.jpg"
   linkedin: "https://linkedin.com/in/janedoe"
   orcid: "https://orcid.org/0000-0002-1825-0097"
   ---
   ```
3. **Write a short bio** in Markdown below the frontmatter.
4. **Save the file**. The site will automatically update the team page.

## Adding or Editing Static Pages

1. **Create a new Markdown file** in `content/pages/` (e.g., `about.md`).
2. **Add frontmatter** at the top of the file:
   ```markdown
   ---
   title: "About RSG-Belgium"
   description: "Learn more about our mission and activities."
   ---
   ```
3. **Write your page content** in Markdown below the frontmatter.
4. **Save the file**. The site will update the corresponding static page.

## Best Practices

- **Use clear, descriptive titles** and keep frontmatter fields accurate.
- **Use relative paths** for images (e.g., `/assets/blog/your-image.jpg`).
- **Keep Markdown formatting clean** (use headings, lists, links, etc.).
- **Preview your changes locally** before pushing:
  1. Run `npm run dev`.
  2. Open [http://localhost:3000](http://localhost:3000) to see your changes.
- **Check for typos and broken links** before submitting content.

## Frontmatter Reference

| Field        | News Article | Team Member | Static Page | Description                       |
|--------------|:------------:|:-----------:|:-----------:|-----------------------------------|
| title        | ✓            |             | ✓           | Title of the content              |
| date         | ✓            |             |             | Date of the news article (YYYY-MM-DD) |
| excerpt      | ✓            |             |             | Short summary for news            |
| coverImage   | ✓            |             |             | Path to cover image               |
| author       | ✓            |             |             | Author name                       |
| name         |              | ✓           |             | Team member's full name           |
| image        |              | ✓           |             | Path to member's photo            |
| title        |              | ✓           |             | Member's role/title               |
| linkedin     |              | ✓           |             | LinkedIn profile URL (optional)   |
| orcid        |              | ✓           |             | ORCID profile URL (optional)      |
| description  |              |             | ✓           | Description for static page       |

## Tips

- For images, upload to `public/assets/` or `public/images/` and use the correct path in your Markdown.
- Use [Markdown Guide](https://www.markdownguide.org/basic-syntax/) for formatting help.
- If you need help, contact a developer or open an issue on GitHub.