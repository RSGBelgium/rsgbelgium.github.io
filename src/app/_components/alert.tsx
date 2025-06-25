/**
 * Site-wide alert/banner component for preview mode or general announcements.
 *
 * Displays a preview mode warning or a welcome message at the top of the site.
 */

import Container from "@/app/_components/container";
import cn from "classnames";

type Props = {
  preview?: boolean;
};

/**
 * Renders an alert banner at the top of the page.
 *
 * @param preview - If true, shows a preview mode warning; otherwise, shows a welcome message.
 */
const Alert = ({ preview }: Props) => {
  return (
    <div
      className={cn("border-b dark:bg-slate-800", {
        "bg-neutral-800 border-neutral-800 text-white": preview,
        "bg-neutral-50 border-neutral-200": !preview,
      })}
    >
      <Container>
        <div className="py-2 text-center text-sm">
          {preview ? (
            <>
              This page is a preview.{" "}
              <a
                href="/api/exit-preview"
                className="underline hover:text-teal-300 duration-200 transition-colors"
              >
                Click here
              </a>{" "}
              to exit preview mode.
            </>
          ) : (
            <>
              Welcome to RSG-Belgium.{" "}
              <a
                href="https://github.com/rsg-belgium/website"
                className="underline hover:text-blue-600 duration-200 transition-colors"
              >
                View source on GitHub
              </a>
              .
            </>
          )}
        </div>
      </Container>
    </div>
  );
};

export default Alert;
