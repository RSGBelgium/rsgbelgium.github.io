/**
 * Root layout for the RSG-Belgium website.
 *
 * - Sets up global fonts and CSS.
 * - Provides site-wide metadata for SEO and social sharing.
 * - Wraps the app in a ThemeProvider for dark/light mode support.
 * - Renders the main page structure including header, footer, and children.
 *
 * This file follows Next.js App Router conventions for layouts.
 */
import type { Metadata, Viewport } from "next";
import { Inter, Roboto_Mono } from "next/font/google";
// import cn from "classnames"; // cn might not be needed if body class is simple
import { ThemeProvider } from "./providers"; // Import the new ThemeProvider
import Header from '@/app/_components/header'; // Corrected path
import Footer from '@/app/_components/footer'; // Corrected path
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/constants";
import { FEED_ALTERNATE_TYPES } from "@/lib/metadata";

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

/** Brand blue: browser UI theme colour, Safari pinned-tab and Windows tile colour. */
const THEME_COLOR = "#004AAD";

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
    siteName: SITE_NAME,
    locale: "en_US",
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
    other: [{ rel: "mask-icon", url: "/favicon/safari-pinned-tab.svg", color: THEME_COLOR }],
  },
  manifest: "/favicon/site.webmanifest",
  other: {
    "msapplication-TileColor": THEME_COLOR,
    "msapplication-config": "/favicon/browserconfig.xml",
  },
};

/**
 * Site-wide viewport settings: the browser UI (address bar) colour.
 */
export const viewport: Viewport = {
  themeColor: THEME_COLOR,
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
      {/* Removed cn() from body, can be added back if complex conditional classes are needed */}
      <body className="dark:bg-slate-900 dark:text-slate-400">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="min-h-screen flex flex-col">
            {/* The old ThemeSwitcher rendering is removed. The new one will be in Header or elsewhere. */}
            <Header />
            <main className="flex-grow"> {/* Removed container classes, pages/components will manage their own */}
              {children}
            </main>
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
