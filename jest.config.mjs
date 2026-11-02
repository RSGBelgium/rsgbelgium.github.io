/**
 * Jest configuration for the RSG-Belgium website.
 *
 * next/jest (https://nextjs.org/docs/app/guides/testing/jest) compiles tests
 * and sources with the Next.js SWC compiler, mocks CSS/image imports and
 * next/font, and loads next.config.js and .env files.
 *
 * Tests run in jsdom by default (components). Tests of server-side code
 * (src/lib, route handlers, the sitemap) opt into Node.js with a
 * `@jest-environment node` docblock at the top of the file.
 *
 * Run `npm test`, or `npm run test:ci` for a CI run with coverage.
 */

import fs from "node:fs";
import path from "node:path";
import nextJest from "next/jest.js";

const createJestConfig = nextJest({
  // Load next.config.js and .env files from the project root.
  dir: "./",
});

/** @type {import('jest').Config} */
const customJestConfig = {
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  moduleNameMapper: {
    // The "@/*" path alias from tsconfig.json, also for jest.mock("@/...") calls.
    "^@/(.*)$": "<rootDir>/src/$1",
  },
  // Never pick up tests or modules from build output.
  testPathIgnorePatterns: ["<rootDir>/out/", "<rootDir>/coverage/"],
  modulePathIgnorePatterns: ["<rootDir>/out/", "<rootDir>/.next/"],
  coverageProvider: "v8",
  // Type-only files (src/interfaces) have no code to cover.
  collectCoverageFrom: [
    "src/**/*.{ts,tsx}",
    "!src/**/__tests__/**",
    "!src/**/*.d.ts",
    "!src/interfaces/**",
  ],
};

/**
 * Names of the packages in node_modules that are published as ES modules
 * only (`"type": "module"`), such as unified, remark, micromark and
 * github-slugger, which src/lib/markdownToHtml.ts and src/lib/excerpt.ts use.
 *
 * Jest runs tests as CommonJS, and next/jest leaves node_modules
 * untransformed, so these packages would fail with "Cannot use import
 * statement outside a module". Detecting them (instead of keeping a list by
 * hand) keeps the tests working when a dependency update adds another
 * ESM-only package to the tree.
 *
 * @returns Package names, scoped ones included ("@scope/name")
 */
function findEsmOnlyPackages() {
  const nodeModules = path.join(import.meta.dirname, "node_modules");
  const names = [];
  for (const entry of fs.readdirSync(nodeModules)) {
    const packages = entry.startsWith("@")
      ? fs.readdirSync(path.join(nodeModules, entry)).map((name) => `${entry}/${name}`)
      : [entry];
    for (const name of packages) {
      try {
        const manifest = JSON.parse(
          fs.readFileSync(path.join(nodeModules, name, "package.json"), "utf8"),
        );
        if (manifest.type === "module") names.push(name);
      } catch {
        // Not a package (e.g. node_modules/.bin): skip it.
      }
    }
  }
  return names;
}

/** Escapes a package name for use in a regular expression. */
const escapeRegExp = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export default async function jestConfig() {
  // createJestConfig returns an async function, so that next/jest can load next.config.js.
  const config = await createJestConfig(customJestConfig)();

  // next/jest only allows *appending* transformIgnorePatterns, and its first
  // pattern ignores all of node_modules. Replace that pattern with one that
  // still ignores node_modules, except the ESM-only packages, which SWC then
  // compiles to CommonJS like the project's own code.
  const esmOnly = findEsmOnlyPackages().map(escapeRegExp).join("|");
  config.transformIgnorePatterns = [
    `/node_modules/(?!(${esmOnly})/)`,
    ...config.transformIgnorePatterns.filter((pattern) => !pattern.startsWith("/node_modules/")),
  ];

  return config;
}
