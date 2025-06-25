/**
 * Post body renderer for HTML content.
 *
 * Renders the main content of a post using markdown styles.
 */

import markdownStyles from "./markdown-styles.module.css";

type Props = {
  content: string;
};

/**
 * Displays the main body of a post, rendering HTML content with markdown styles.
 *
 * @param content - The HTML content to render
 */
export function PostBody({ content }: Props) {
  return (
    <div className="max-w-2xl mx-auto">
      <div
        className={markdownStyles["markdown"]}
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </div>
  );
}
