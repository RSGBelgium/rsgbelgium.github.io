#!/usr/bin/env node
/**
 * Optimises the images in public/ at the source: `npm run optimize:images`.
 *
 * The site is a static export with `images: { unoptimized: true }`
 * (next.config.js): nothing resizes or converts images when the site is
 * built, so visitors download the files exactly as they are in public/.
 * Run this script after adding images, before committing them:
 *
 * 1. Photos and posters (.jpg, .jpeg, .png and .webp files in
 *    public/images/) are turned upright from their EXIF orientation,
 *    scaled down (never up) to at most 1600 px on the long side (team
 *    photos 600 px, the RSG-Belgium logo avatar 256 px), stripped of
 *    metadata (camera details, GPS location) and saved as WebP:
 *    `poster.png` becomes `poster.webp`. The original is deleted, and every
 *    link to it in content/, src/, guides/, README.md and the text files
 *    in public/ is updated (exact path, upper/lower case included).
 *    A post's `coverImage` is also its link-preview image, and not every
 *    social network shows WebP previews: cover images are saved as JPEG.
 * 2. SVGs in public/images/ that embed bitmaps (photos pasted into a
 *    drawing, e.g. an Inkscape poster) are rendered to WebP the same way.
 *    Plain drawings such as logos stay SVG.
 * 3. The favicons in public/favicon/ (PNGs, favicon.ico with 16, 32 and
 *    48 px icons, and the single-colour Safari pinned-tab icon) are
 *    generated from public/favicon/favicon.svg.
 *
 * Images that are already WebP (JPEG for covers), small enough and free of
 * metadata are left alone, and generated files are only written when their
 * content changes: running the script twice changes nothing the second
 * time. PDFs, calendar files and src/app/opengraph-image.png (the default
 * link-preview image, a PNG on purpose) are not touched.
 *
 * Usage: node scripts/optimize-images.mjs [--dry-run]
 *   --dry-run  print what would change, without changing any file
 */

import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";
import {
  escapeRegExp,
  formatBytes,
  listFiles,
  listSourceFiles,
  PUBLIC_DIR,
  SITE_SOURCES,
  urlPathPattern,
} from "./lib/public-files.mjs";
import { MEMBERS_DIR, NEWS_DIR, TEAM_IMAGE_PATH } from "../src/lib/content-rules.ts";
import { readFrontMatter } from "./lib/content-files.mjs";

const dryRun = process.argv.includes("--dry-run");
const root = path.join(import.meta.dirname, "..");
const publicDir = path.join(root, PUBLIC_DIR);

/** Longest side, in pixels, of photos and posters. */
const MAX_SIZE = 1600;

/** Team photos: shown at most 128 px wide, 256 px on high-density screens. */
const TEAM_PHOTO_MAX_SIZE = 600;

/** The RSG-Belgium logo used as the 48 px author avatar on news posts. */
const LOGO_AVATAR = { stem: "images/team/rsg-logo", maxSize: 256 };

/**
 * WebP settings: quality 80 keeps text on posters crisp at a fraction of
 * the PNG size; effort 6 is the slowest, smallest encoding; smart
 * subsampling keeps thin red and blue lines and text sharp.
 */
const WEBP = { quality: 80, effort: 6, smartSubsample: true };

/** JPEG settings for cover images: mozjpeg (progressive, optimised tables). */
const JPEG = { quality: 80, mozjpeg: true };

/** Images this script optimises, by extension (any upper/lower case). */
const RASTER = /\.(jpe?g|png|webp)$/i;

/** An SVG that embeds a bitmap: `<image href="data:image/...">` or `xlink:href`. */
const EMBEDDED_BITMAP = /<image\b[^>]*\bhref\s*=\s*["']\s*data:image\//i;

/**
 * Text files whose links to images are updated when an image is renamed: the
 * site's own sources, plus the guides and the README, which show example paths.
 */
const LINK_SOURCES = [...SITE_SOURCES, { dir: "guides", pattern: /\.md$/ }, { file: "README.md" }];

/** The favicon drawing that all favicons are generated from (relative to public/). */
const FAVICON_SOURCE = "favicon/favicon.svg";

/**
 * Favicon PNGs generated from {@link FAVICON_SOURCE}: size in pixels,
 * empty margin as a fraction of the size, and an optional background.
 */
const FAVICON_PNGS = [
  { file: "favicon/favicon-16x16.png", size: 16 },
  { file: "favicon/favicon-32x32.png", size: 32 },
  { file: "favicon/android-chrome-192x192.png", size: 192 }, // web manifest
  { file: "favicon/android-chrome-512x512.png", size: 512 }, // web manifest
  { file: "favicon/mstile-150x150.png", size: 270, margin: 0.2 }, // Windows tile, on the tile colour
  { file: "favicon/apple-touch-icon.png", size: 180, margin: 0.1, background: "#ffffff" }, // iOS shows transparency as black
];

/** Icon sizes in favicon.ico, for browsers and tools that only read .ico files. */
const ICO = { file: "favicon/favicon.ico", sizes: [16, 32, 48] };

/** The Safari pinned-tab icon: a single-colour copy of {@link FAVICON_SOURCE}. */
const MASK_ICON = "favicon/safari-pinned-tab.svg";

/** @typedef {{ file: string, target: string, before: number, after: number, pixelsBefore: string, pixelsAfter: string, action: string }} Change */

/** The changes made (or, with --dry-run, that would be made), for the summary table. */
const changes = /** @type {Change[]} */ ([]);
/** Problems that need a person, e.g. two files that would get the same name. */
const problems = [];
let unchanged = 0;

/** Writes a file unless --dry-run. */
function writeFile(file, data) {
  if (!dryRun) fs.writeFileSync(path.join(publicDir, file), data);
}

/**
 * The URL paths of all posts' `coverImage`s, e.g. "/images/poster/a.jpg".
 *
 * @returns {Set<string>}
 */
function findCoverImages() {
  const covers = new Set();
  for (const { data } of readFrontMatter(root, NEWS_DIR)) {
    const { coverImage } = data;
    if (typeof coverImage === "string" && coverImage.startsWith("/"))
      covers.add(coverImage.replace(/[?#].*$/, ""));
  }
  return covers;
}

/**
 * The largest size, in pixels, for an image.
 *
 * @param {string} file - Path relative to public/
 */
function maxSizeFor(file) {
  const stem = file.replace(/\.[^./]+$/, "");
  if (stem === LOGO_AVATAR.stem) return LOGO_AVATAR.maxSize;
  if (file.startsWith("images/team/")) return TEAM_PHOTO_MAX_SIZE;
  return MAX_SIZE;
}

/** "1200×800" from sharp metadata or output info. */
const pixels = ({ width, height }) => `${width}×${height}`;

/**
 * Converts one image (raster, or SVG with embedded bitmaps) if needed.
 *
 * @param {string} file - Path relative to public/, e.g. "images/team/anis.JPG"
 * @param {Set<string>} covers - URL paths of cover images (saved as JPEG)
 * @returns {Promise<Change | null>} null when the image is already optimised
 */
async function optimizeImage(file, covers) {
  const input = path.join(publicDir, file);
  const isSvg = /\.svg$/i.test(file);
  const format = covers.has(`/${file}`) ? "jpeg" : "webp";
  const target = file.replace(/\.[^./]+$/, format === "jpeg" ? ".jpg" : ".webp");
  const maxSize = maxSizeFor(file);
  const before = fs.statSync(input).size;

  const metadata = await sharp(input).metadata();
  // EXIF orientations 5-8 swap width and height.
  const upright =
    (metadata.orientation ?? 1) >= 5
      ? { width: metadata.height, height: metadata.width }
      : { width: metadata.width, height: metadata.height };
  const tooLarge = Math.max(upright.width, upright.height) > maxSize;
  const hasMetadata = Boolean(metadata.exif || metadata.icc || metadata.xmp || metadata.iptc);
  if (!isSvg && target === file && metadata.format === format && !tooLarge && !hasMetadata) {
    return null; // Already optimised.
  }
  if (target !== file && fs.existsSync(path.join(publicDir, target))) {
    problems.push(
      `public/${file}: public/${target} already exists → keep one of the two, delete the other and update its links, then run this script again.`,
    );
    return null;
  }

  // SVGs: render at twice the final size, then scale down, for smooth edges.
  const inputOptions = isSvg
    ? {
        density: Math.max(
          1,
          Math.round((72 * 2 * maxSize) / Math.max(upright.width, upright.height)),
        ),
        unlimited: true, // large embedded bitmaps
      }
    : {};
  // Decode once to upright, scaled-down sRGB pixels; encode from those.
  const { data, info } = await sharp(input, inputOptions)
    .autoOrient()
    .resize({ width: maxSize, height: maxSize, fit: "inside", withoutEnlargement: true })
    .toColourspace("srgb")
    .raw({ depth: "uchar" })
    .toBuffer({ resolveWithObject: true });
  const decoded = () => sharp(data, { raw: info });
  const opaque = info.channels < 4 || (await decoded().stats()).isOpaque;

  let output;
  if (format === "jpeg") {
    output = await decoded().flatten({ background: "#ffffff" }).jpeg(JPEG).toBuffer();
  } else {
    const image = () => (opaque && info.channels === 4 ? decoded().removeAlpha() : decoded());
    output = await image().webp(WEBP).toBuffer();
    // Flat graphics (few colours) can be smaller without loss than with it.
    if (output.length >= before) {
      const lossless = await image().webp({ lossless: true, effort: WEBP.effort }).toBuffer();
      if (lossless.length < output.length) output = lossless;
    }
  }

  writeFile(target, output);
  if (target !== file && !dryRun) fs.rmSync(input);
  return {
    file,
    target,
    before,
    after: output.length,
    pixelsBefore: isSvg ? "SVG" : pixels(upright),
    pixelsAfter: pixels(info),
    action: target === file ? "optimised" : isSvg ? "rendered" : "converted",
  };
}

/**
 * Renders the favicon drawing as a square PNG.
 *
 * @param {Buffer} svg - The favicon SVG
 * @param {{ size: number, margin?: number, background?: string }} options
 */
async function renderIcon(svg, { size, margin = 0, background }) {
  const inner = Math.round(size * (1 - 2 * margin));
  const { width, height } = await sharp(svg).metadata();
  const density = Math.max(1, (72 * 2 * inner) / Math.max(width, height));
  const transparent = { r: 0, g: 0, b: 0, alpha: 0 };
  const start = Math.floor((size - inner) / 2);
  let image = sharp(svg, { density })
    .resize(inner, inner, { fit: "contain", background: transparent })
    .extend({
      top: start,
      left: start,
      bottom: size - inner - start,
      right: size - inner - start,
      background: transparent,
    });
  if (background) image = sharp(await image.png().toBuffer()).flatten({ background });
  return image.png({ compressionLevel: 9, palette: true }).toBuffer();
}

/**
 * Packs PNG images into an .ico file. Since Windows Vista, ICO entries
 * may be PNG data; every current browser reads them.
 * Format: a 6-byte header, a 16-byte directory entry per image, then the images.
 *
 * @param {{ size: number, png: Buffer }[]} images
 */
function encodeIco(images) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // type: icon
  header.writeUInt16LE(images.length, 4);
  let offset = header.length + 16 * images.length;
  const entries = images.map(({ size, png }) => {
    const entry = Buffer.alloc(16);
    entry.writeUInt8(size >= 256 ? 0 : size, 0); // width (0 means 256)
    entry.writeUInt8(size >= 256 ? 0 : size, 1); // height
    entry.writeUInt8(0, 2); // colours in the palette: none
    entry.writeUInt8(0, 3); // reserved
    entry.writeUInt16LE(1, 4); // colour planes
    entry.writeUInt16LE(32, 6); // bits per pixel
    entry.writeUInt32LE(png.length, 8);
    entry.writeUInt32LE(offset, 12);
    offset += png.length;
    return entry;
  });
  return Buffer.concat([header, ...entries, ...images.map(({ png }) => png)]);
}

/**
 * The single-colour Safari pinned-tab icon: the favicon drawing without
 * editor metadata, with every colour replaced by black (Safari only uses
 * the shape and fills it with the `color` set in src/app/layout.tsx).
 *
 * @param {string} svg - The favicon SVG
 */
function toMaskIcon(svg) {
  return `${svg
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/<metadata[\s\S]*?<\/metadata>/g, "")
    .replace(/<sodipodi:namedview[\s\S]*?\/>/g, "")
    .replace(/<style[\s\S]*?<\/style>/g, "")
    .replace(/#(?:[0-9a-f]{6}|[0-9a-f]{3})\b/gi, "#000000")
    .replace(/\n\s*\n+/g, "\n")
    .trim()}\n`;
}

/**
 * Writes a generated favicon file when its content differs from the file on disk.
 *
 * @param {string} file - Path relative to public/
 * @param {Buffer} data
 * @param {string} pixelsAfter - e.g. "32×32"
 */
async function updateGenerated(file, data, pixelsAfter) {
  const absolute = path.join(publicDir, file);
  const existing = fs.existsSync(absolute) ? fs.readFileSync(absolute) : null;
  if (existing && existing.equals(data)) {
    unchanged++;
    return;
  }
  writeFile(file, data);
  changes.push({
    file,
    target: file,
    before: existing?.length ?? 0,
    after: data.length,
    pixelsBefore: existing ? "" : "(new)",
    pixelsAfter,
    action: "generated",
  });
}

/** Generates the favicons from {@link FAVICON_SOURCE}. */
async function generateFavicons() {
  const sourcePath = path.join(publicDir, FAVICON_SOURCE);
  if (!fs.existsSync(sourcePath)) {
    problems.push(`public/${FAVICON_SOURCE} is missing: the favicons are generated from it.`);
    return;
  }
  const svg = fs.readFileSync(sourcePath);
  for (const icon of FAVICON_PNGS) {
    await updateGenerated(icon.file, await renderIcon(svg, icon), `${icon.size}×${icon.size}`);
  }
  const icons = [];
  for (const size of ICO.sizes) icons.push({ size, png: await renderIcon(svg, { size }) });
  await updateGenerated(ICO.file, encodeIco(icons), ICO.sizes.join("+"));
  await updateGenerated(MASK_ICON, Buffer.from(toMaskIcon(svg.toString("utf8"))), "SVG");
}

/**
 * Updates every link to a renamed image, in the files of {@link LINK_SOURCES}.
 *
 * @param {Map<string, string>} renames - Old URL path -> new URL path
 * @returns {string[]} the files that were changed
 */
function updateLinks(renames) {
  const files = listSourceFiles(root, LINK_SOURCES);

  const changed = [];
  for (const file of files) {
    const absolute = path.join(root, file);
    const text = fs.readFileSync(absolute, "utf8");
    let updated = text;
    for (const [from, to] of renames) {
      updated = updated.replace(urlPathPattern(from), to);
      // Member photos may be given by file name only: image: "anis.JPG".
      if (file.startsWith(`${MEMBERS_DIR}/`) && from.startsWith(TEAM_IMAGE_PATH)) {
        const name = from.slice(TEAM_IMAGE_PATH.length);
        updated = updated.replace(
          new RegExp(`^(image:\\s*["']?)${escapeRegExp(name)}(?=["']?\\s*(?:#.*)?$)`, "m"),
          `$1${to.slice(TEAM_IMAGE_PATH.length)}`,
        );
      }
    }
    if (updated !== text) {
      if (!dryRun) fs.writeFileSync(absolute, updated);
      changed.push(file);
    }
  }
  return changed;
}

/** Prints the changes as a table. */
function printTable() {
  const rows = changes.map((change) => [
    change.action,
    change.target === change.file
      ? change.file
      : `${change.file} → ${path.posix.extname(change.target)}`,
    change.pixelsBefore && change.pixelsBefore !== change.pixelsAfter
      ? `${change.pixelsBefore} → ${change.pixelsAfter}`
      : change.pixelsAfter,
    `${change.before ? formatBytes(change.before) : "-"} → ${formatBytes(change.after)}`,
    change.before ? `${Math.round((100 * (change.after - change.before)) / change.before)}%` : "",
  ]);
  const header = ["Action", "File (in public/)", "Pixels", "Size", "Change"];
  const widths = header.map((title, column) =>
    Math.max(title.length, ...rows.map((row) => row[column].length)),
  );
  const line = (row) =>
    row
      .map((cell, column) =>
        column >= 3 ? cell.padStart(widths[column]) : cell.padEnd(widths[column]),
      )
      .join("  ")
      .trimEnd();
  console.log(line(header));
  for (const row of rows) console.log(line(row));
  const before = changes.reduce((sum, change) => sum + change.before, 0);
  const after = changes.reduce((sum, change) => sum + change.after, 0);
  console.log(
    `\n${changes.length} file${changes.length === 1 ? "" : "s"}: ${formatBytes(before)} → ${formatBytes(after)}.`,
  );
}

const covers = findCoverImages();
const candidates = listFiles(publicDir).filter(
  (file) =>
    file.startsWith("images/") &&
    (RASTER.test(file) ||
      (/\.svg$/i.test(file) &&
        EMBEDDED_BITMAP.test(fs.readFileSync(path.join(publicDir, file), "utf8")))),
);

const renames = new Map();
for (const file of candidates) {
  const change = await optimizeImage(file, covers);
  if (!change) {
    unchanged++;
    continue;
  }
  changes.push(change);
  if (change.target !== change.file) renames.set(`/${change.file}`, `/${change.target}`);
}
await generateFavicons();
const updatedFiles = updateLinks(renames);

const prefix = dryRun ? "[dry run, nothing written] " : "";
if (changes.length === 0) {
  console.log(`${prefix}All images are optimised: nothing to do (${unchanged} files checked).`);
} else {
  printTable();
  console.log(`${unchanged} file${unchanged === 1 ? " was" : "s were"} already optimised.`);
  if (updatedFiles.length > 0) {
    console.log(
      `\n${prefix}Updated the links in:\n${updatedFiles.map((file) => `  ${file}`).join("\n")}`,
    );
  }
  if (!dryRun) {
    console.log(
      "\nCheck the images, then commit them together with the deleted originals and updated links.",
    );
  }
}
for (const problem of problems) console.error(`error: ${problem}`);
if (problems.length > 0) process.exitCode = 1;
