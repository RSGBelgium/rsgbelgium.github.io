/**
 * Next.js configuration for the RSG-Belgium website.
 *
 * The site is a fully static export (`next build` writes it to `out/`), which
 * GitHub Pages serves at https://rsg-belgium.org. In CI,
 * actions/configure-pages also injects these settings (plus an empty
 * basePath, because the site uses a custom domain); setting them here keeps
 * local builds identical to the deployed site.
 *
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  // Emit a static site to out/: no Node.js server at runtime.
  output: 'export',

  // `/about` is exported as `about.html`, which GitHub Pages serves at `/about`.
  trailingSlash: false,

  images: {
    // The default image optimizer needs a server, so serve images as they are.
    unoptimized: true,
  },
};

module.exports = nextConfig;
