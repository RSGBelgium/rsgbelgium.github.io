/**
 * Theme switcher (light/system/dark) component.
 *
 * A compact segmented control with one icon button per theme. The active
 * option is filled with the primary colour and marked with aria-pressed;
 * each button has a text label for screen readers and a tooltip that shows
 * on hover and on keyboard focus.
 *
 * The visitor's choice is only known in the browser (next-themes keeps it in
 * localStorage), so no option is marked active until the component has
 * mounted. Apart from that the control renders exactly the same on the
 * server and in the browser: no hydration mismatch and no layout shift.
 */

"use client";

import cn from "classnames";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

/** A theme the visitor can pick: the value next-themes stores, its label and icon. */
type ThemeOption = {
  value: "light" | "system" | "dark";
  label: string;
  icon: React.ReactNode;
};

/** Shared attributes of the 20px outline icons; they are decorative (the label names the button). */
const iconProps = {
  className: "h-5 w-5",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.75,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": true,
  focusable: false,
} as const;

/** The options, in the order they are shown: light, follow the operating system, dark. */
const THEME_OPTIONS: ThemeOption[] = [
  {
    value: "light",
    label: "Light",
    // Sun
    icon: (
      <svg {...iconProps}>
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
      </svg>
    ),
  },
  {
    value: "system",
    label: "System",
    // Monitor
    icon: (
      <svg {...iconProps}>
        <rect x="3" y="4" width="18" height="12" rx="2" />
        <path d="M8 20h8M12 16v4" />
      </svg>
    ),
  },
  {
    value: "dark",
    label: "Dark",
    // Crescent moon
    icon: (
      <svg {...iconProps}>
        <path d="M20.5 14.5A8.5 8.5 0 0 1 9.5 3.5a8.5 8.5 0 1 0 11 11z" />
      </svg>
    ),
  },
];

/**
 * Displays a segmented control for choosing the light, system or dark theme.
 */
export function ThemeSwitcher() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  // useEffect only runs in the browser, after hydration: from then on the stored theme can be shown.
  useEffect(() => {
    setMounted(true);
  }, []);

  // Until mounted, no option is active, so the server and the first browser render match.
  const activeTheme = mounted ? theme : undefined;

  return (
    <div
      role="group"
      aria-label="Colour theme"
      className="inline-flex items-center gap-0.5 rounded-full border border-border bg-surface p-0.5"
    >
      {THEME_OPTIONS.map(({ value, label, icon }) => {
        const isActive = activeTheme === value;

        return (
          <button
            key={value}
            type="button"
            onClick={() => setTheme(value)}
            aria-pressed={isActive}
            className={cn(
              "group relative inline-flex h-8 w-8 items-center justify-center rounded-full transition-colors",
              isActive
                ? "bg-primary text-primary-foreground"
                : "text-foreground-muted hover:bg-surface-muted hover:text-foreground"
            )}
          >
            {icon}
            <span className="sr-only">{label}</span>
            {/* Visible label for sighted users; hidden from screen readers, which read the one above. */}
            <span
              aria-hidden="true"
              className="pointer-events-none absolute left-1/2 top-full z-10 mt-2 -translate-x-1/2 whitespace-nowrap rounded bg-foreground px-2 py-1 text-xs font-medium text-background opacity-0 shadow transition-opacity [@media(hover:hover)]:group-hover:opacity-100 group-focus-visible:opacity-100"
            >
              {label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
