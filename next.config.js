/**
 * Next.js configuration for the RSG-Belgium website.
 *
 * The site is a fully static export (`next build` writes it to `out/`), which
 * GitHub Pages serves at https://rsg-belgium.org. This file is the only
 * place these settings live: CI builds with it exactly as a local build
 * does (the deploy workflow doesn't let actions/configure-pages rewrite it),
 * and no basePath is needed because the site has its own domain.
 *
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  // Emit a static site to out/: no Node.js server at runtime.
  output: "export",

  // `/about` is exported as `about.html`, which GitHub Pages serves at `/about`.
  trailingSlash: false,

  images: {
    // The default image optimizer needs a server, so serve images as they are.
    unoptimized: true,
  },
};

module.exports = nextConfig;
