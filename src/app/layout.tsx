/**
 * Root layout for the RSG-Belgium website.
 *
 * - Sets up global fonts and CSS.
 * - Provides site-wide metadata for SEO and social sharing.
 * - Wraps the app in a ThemeProvider for dark/light mode support.
 * - Renders the main page structure: a "Skip to main content" link, the
 *   header, the page's single <main> landmark around the children, and the footer.
 *
 * This file follows Next.js App Router conventions for layouts.
 */
import type { Metadata, Viewport } from "next";
import { Inter, Roboto_Mono } from "next/font/google";
// import cn from "classnames"; // cn might not be needed if body class is simple
import { ThemeProvider } from "./providers"; // Import the new ThemeProvider
import Header from '@/app/_components/header'; // Corrected path
import Footer from '@/app/_components/footer'; // Corrected path
import SkipLink from '@/app/_components/skip-link';
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/constants";
import { BASE_OPEN_GRAPH, FEED_ALTERNATE_TYPES } from "@/lib/metadata";

import "./globals.css"; // Ensure Tailwind/global styles are imported

// Font setup (already configured from previous steps)
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

const roboto_mono = Roboto_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-roboto-mono',
});

/** Id of the <main> landmark, the target of the "Skip to main content" link. */
const MAIN_CONTENT_ID = "main-content";

/** Brand blue: Safari pinned-tab and Windows tile colour. */
const BRAND_COLOR = "#004AAD";

/**
 * Global site metadata for SEO and social platforms.
 * Used by Next.js to populate <head> tags.
 *
 * - Pages set `title` to their own short title; the template appends the site name.
 * - `openGraph`/`twitter` deliberately have no title or description, so that
 *   each page's own title and description are used for link previews. The
 *   share image comes from src/app/opengraph-image.png.
 * - `alternates` only advertises the RSS feed here. Canonical URLs are set per
 *   page with pageAlternates(), so a page can never inherit "/" as its canonical.
 */
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} | Bioinformatics & Computational Biology Student Society`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  alternates: {
    types: FEED_ALTERNATE_TYPES,
  },
  openGraph: {
    ...BASE_OPEN_GRAPH,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
  },
  icons: {
    icon: [
      { url: "/favicon/favicon.ico", sizes: "any" },
      { url: "/favicon/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: [{ url: "/favicon/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
    other: [{ rel: "mask-icon", url: "/favicon/safari-pinned-tab.svg", color: BRAND_COLOR }],
  },
  manifest: "/favicon/site.webmanifest",
  other: {
    "msapplication-TileColor": BRAND_COLOR,
    "msapplication-config": "/favicon/browserconfig.xml",
  },
};

/**
 * Site-wide viewport settings: the browser UI (address bar) colour.
 *
 * The colours are the `surface` token of each theme (see globals.css), the
 * colour of the sticky header, so the address bar and the header look like
 * one bar. Meta tags can't read CSS variables, hence the literal values.
 * Browsers choose by the operating system's colour scheme: a visitor who
 * picks the other theme with the site's switcher keeps the OS-based colour.
 */
export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FFFFFF" },
    { media: "(prefers-color-scheme: dark)", color: "#1E293B" },
  ],
};

/**
 * The root layout component for the entire app.
 *
 * @param children - React children to render inside the layout
 * @returns The HTML structure for the app, including theme and layout wrappers
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${roboto_mono.variable}`} suppressHydrationWarning>
      {/* Page background and text colours come from the theme tokens in globals.css. */}
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="min-h-screen flex flex-col">
            {/* First focusable element: lets keyboard users jump past the header. */}
            <SkipLink targetId={MAIN_CONTENT_ID} />
            <Header />
            {/* The page's only <main>: pages render their content inside it, not another <main>.
                tabIndex={-1} lets the skip link move focus here; main itself shows no focus outline.
                scroll-mt-16 keeps the top of the content clear of the sticky header. */}
            <main id={MAIN_CONTENT_ID} tabIndex={-1} className="flex-grow scroll-mt-16 focus:outline-none">
              {children}
            </main>
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
