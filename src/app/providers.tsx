/**
 * Theme provider wrapper for the RSG-Belgium website.
 *
 * This file exports a ThemeProvider component that wraps the app with next-themes support.
 * It enables dark/light mode and system theme preference throughout the app.
 */

"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

/**
 * Provides theme context (dark/light/system) to the app using next-themes.
 *
 * @param children - React children to be wrapped with theme support
 * @param props - Additional props passed to next-themes ThemeProvider
 */
export function ThemeProvider({ children, ...props }: React.PropsWithChildren<any>) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
