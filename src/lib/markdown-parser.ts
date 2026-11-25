/**
 * The markdown dialect of the site's content: CommonMark with GitHub's
 * extensions (tables, strikethrough, autolinks, ...).
 *
 * Everything that reads markdown from content/ starts from this one
 * definition, so that a post's HTML, its excerpt and a member's bio split
 * all see the same document.
 */

import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";

/**
 * Markdown parser (parsing only, no HTML output). `markdownParser.parse(text)`
 * returns the syntax tree; `markdownParser()` returns a new processor with
 * the same setup, to add more plugins to. It is frozen, so adding plugins
 * to it directly throws instead of changing it for everyone.
 */
export const markdownParser = unified().use(remarkParse).use(remarkGfm).freeze();
