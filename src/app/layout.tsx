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
import type { Metadata } from "next";
import { Inter, Roboto_Mono } from "next/font/google";
// import cn from "classnames"; // cn might not be needed if body class is simple
import { ThemeProvider } from "./providers"; // Import the new ThemeProvider
import Header from '@/app/_components/header'; // Corrected path
import Footer from '@/app/_components/footer'; // Corrected path
import { SITE_NAME } from "@/lib/constants";

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

/**
 * Global site metadata for SEO and social platforms.
 * Used by Next.js to populate <head> tags.
 */
export const metadata: Metadata = {
  title: SITE_NAME,
  description: 'The official website for RSG-Belgium, a community of researchers and students in bioinformatics and computational biology.',
  openGraph: {
    title: SITE_NAME,
    description: 'The official website for RSG-Belgium, a community of researchers and students in bioinformatics and computational biology.',
    url: 'https://rsg-belgium.be',
    siteName: SITE_NAME,
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE_NAME,
    description: 'The official website for RSG-Belgium, a community of researchers and students in bioinformatics and computational biology.',
  },
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
      <head>
        {/* Favicon links and other meta tags from original file can be kept */}
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/favicon/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon/favicon-16x16.png"
        />
        <link rel="manifest" href="/favicon/site.webmanifest" />
        <link
          rel="mask-icon"
          href="/favicon/safari-pinned-tab.svg"
          color="#000000"
        />
        <link rel="shortcut icon" href="/favicon/favicon.ico" />
        <meta name="msapplication-TileColor" content="#000000" />
        <meta
          name="msapplication-config"
          content="/favicon/browserconfig.xml"
        />
        <meta name="theme-color" content="#000" />
        <link rel="alternate" type="application/rss+xml" href="/feed.xml" />
      </head>
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
