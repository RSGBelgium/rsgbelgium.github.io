/**
 * Theme switcher (light/dark/system) component.
 *
 * Allows users to toggle between light, dark, and system themes using next-themes.
 * Handles hydration mismatch by delaying UI until mounted on the client.
 */

"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

// Optional: Import icons if you have them, e.g., from react-icons
// import { SunIcon, MoonIcon, ComputerDesktopIcon } from '@heroicons/react/24/outline';

/**
 * Displays a theme switcher UI for toggling between light, dark, and system themes.
 */
export function ThemeSwitcher() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme, resolvedTheme, themes } = useTheme();

  // useEffect only runs on the client, so now we can safely show the UI
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // Render a placeholder or null to avoid hydration mismatch for the switcher UI.
    // The actual theme class on <html> is handled by the ThemeProvider.
    // You can style this placeholder to match the button's size if needed.
    return <div style={{ width: '70px', height: '30px' }} />; // Example placeholder size
  }

  return (
    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
      {/*
        A more sophisticated UI might use icons or a dropdown.
        This is a basic example with buttons.
      */}
      <button
        onClick={() => setTheme("light")}
        disabled={theme === "light"}
        style={{ padding: '0.25rem 0.5rem', border: '1px solid #ccc', borderRadius: '4px', cursor: 'pointer' }}
      >
        {/* Optional: <SunIcon className="h-5 w-5" /> */}
        Light
      </button>
      <button
        onClick={() => setTheme("dark")}
        disabled={theme === "dark"}
        style={{ padding: '0.25rem 0.5rem', border: '1px solid #ccc', borderRadius: '4px', cursor: 'pointer' }}
      >
        {/* Optional: <MoonIcon className="h-5 w-5" /> */}
        Dark
      </button>
      <button
        onClick={() => setTheme("system")}
        disabled={theme === "system"}
        style={{ padding: '0.25rem 0.5rem', border: '1px solid #ccc', borderRadius: '4px', cursor: 'pointer' }}
      >
        {/* Optional: <ComputerDesktopIcon className="h-5 w-5" /> */}
        System
      </button>
      <small style={{ marginLeft: '0.5rem' }}>(Current: {resolvedTheme})</small>
    </div>
  );
}
