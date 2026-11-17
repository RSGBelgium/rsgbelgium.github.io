/**
 * ESLint configuration (flat config) for the RSG-Belgium website.
 *
 * eslint-config-next 15 still ships eslintrc-style configs, so they are
 * loaded through FlatCompat, as the Next.js 15 docs describe:
 * - next/core-web-vitals: React, React Hooks, jsx-a11y and Next.js rules,
 *   with the rules that affect Core Web Vitals as errors;
 * - next/typescript: the typescript-eslint "recommended" rules.
 * eslint-config-prettier comes last: it turns off the stylistic rules that
 * Prettier takes care of (see .prettierrc.json), so the two never disagree.
 *
 * Run `npm run lint` (it fails on any warning, as CI does) or
 * `npm run lint:fix`.
 */

import { FlatCompat } from "@eslint/eslintrc";
import eslintConfigPrettier from "eslint-config-prettier/flat";

const compat = new FlatCompat({
  baseDirectory: import.meta.dirname,
});

const eslintConfig = [
  {
    // Build output, coverage reports and generated files are never linted.
    ignores: [".next/**", "out/**", "coverage/**", "next-env.d.ts"],
  },
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  eslintConfigPrettier,
];

export default eslintConfig;
