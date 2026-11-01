/**
 * Tailwind CSS configuration for the RSG-Belgium website.
 *
 * Colours are semantic tokens (`bg-surface`, `text-foreground-muted`, ...)
 * backed by CSS variables in src/app/globals.css, which switch between the
 * light and the dark theme. See "Color Palette" in README.md.
 */
import type { Config } from "tailwindcss";

/**
 * Maps a colour token from src/app/globals.css to a Tailwind colour value.
 *
 * The variable holds bare RGB channels, so Tailwind can fill in
 * `<alpha-value>` and opacity modifiers such as `bg-highlight/50` work.
 *
 * @param name - Token name without the `--color-` prefix, e.g. "surface-muted"
 * @returns A colour value such as `rgb(var(--color-surface-muted) / <alpha-value>)`
 */
const token = (name: string) => `rgb(var(--color-${name}) / <alpha-value>)`;

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-inter)'],
        mono: ['var(--font-roboto-mono)'],
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        background: token("background"),
        surface: {
          DEFAULT: token("surface"),
          muted: token("surface-muted"),
        },
        border: token("border"),
        foreground: {
          DEFAULT: token("foreground"),
          muted: token("foreground-muted"),
        },
        primary: {
          DEFAULT: token("primary"),
          hover: token("primary-hover"),
          foreground: token("primary-foreground"),
        },
        link: token("link"),
        accent: {
          DEFAULT: token("accent"),
          strong: token("accent-strong"),
        },
        highlight: token("highlight"),
        hero: {
          start: token("hero-start"),
          end: token("hero-end"),
        },
        // Old fixed colours: removed once every component uses the tokens above.
        secondary: "#E385EC",
        white: "#FFFFFF",
        lightblue: "#D6E8FF",
      },
      // A bare `border` (and <hr>) uses the theme's border colour instead of gray-200.
      borderColor: {
        DEFAULT: token("border"),
      },
      spacing: {
        28: "7rem",
      },
      letterSpacing: {
        tighter: "-.04em",
      },
      fontSize: {
        "5xl": "2.5rem",
        "6xl": "2.75rem",
        "7xl": "4.5rem",
        "8xl": "6.25rem",
      },
      boxShadow: {
        sm: "0 5px 10px rgba(0, 0, 0, 0.12)",
        md: "0 8px 30px rgba(0, 0, 0, 0.12)",
      },
    },
  },
  plugins: [],
};
export default config;
