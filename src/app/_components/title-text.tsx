/**
 * A post title, with line breaks only where they read well.
 *
 * Browsers may break a line after any hyphen and before a free-standing
 * dash, which splits "COVID-19" into "COVID-" and "19", and starts lines
 * with "- 05/05/2020". TitleText keeps short hyphenated words ("COVID-19:",
 * "13-14") on one line, and keeps a free-standing dash on the line of the
 * word before it ("Symposium -"). The text itself is unchanged: the pieces
 * are only wrapped in `white-space: nowrap` spans.
 */

import { Fragment } from "react";

/**
 * Pieces longer than this many characters may still break, so that an
 * unbreakable piece never makes a title wider than a phone screen.
 */
const MAX_UNBREAKABLE = 16;

/** A dash standing on its own between two words, e.g. "Symposium - 2020". */
const FREE_DASH = /^[-–—]$/;

/** A hyphen between two letters or digits, e.g. "COVID-19" or "13-14". */
const INNER_HYPHEN = /[\p{L}\p{N}]-[\p{L}\p{N}]/u;

/**
 * Splits a title into the pieces that should stay on one line.
 *
 * @param title - The title text
 * @returns The pieces, in order; joined with single spaces they give the title back
 *   (runs of spaces are collapsed, as HTML does anyway)
 */
export function titlePieces(title: string): { text: string; keepTogether: boolean }[] {
  const pieces: { text: string; keepTogether: boolean }[] = [];
  for (const word of title.split(/\s+/).filter(Boolean)) {
    const previous = pieces[pieces.length - 1];
    if (FREE_DASH.test(word) && previous) {
      previous.text += ` ${word}`;
      previous.keepTogether = true;
    } else {
      pieces.push({ text: word, keepTogether: INNER_HYPHEN.test(word) });
    }
  }
  return pieces.map(({ text, keepTogether }) => ({
    text,
    keepTogether: keepTogether && text.length <= MAX_UNBREAKABLE,
  }));
}

/**
 * Renders a title with nowrap spans around the pieces that should stay on one line.
 *
 * @param text - The title text
 */
export function TitleText({ text }: { text: string }) {
  return (
    <>
      {titlePieces(text).map((piece, index) => (
        <Fragment key={index}>
          {index > 0 && " "}
          {piece.keepTogether ? (
            <span className="whitespace-nowrap">{piece.text}</span>
          ) : (
            piece.text
          )}
        </Fragment>
      ))}
    </>
  );
}
