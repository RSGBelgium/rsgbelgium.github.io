/**
 * /slack: kept so that links to it (older news posts, bookmarks, other
 * websites) still work. It invites visitors to join us on Discord.
 *
 * The static export has no server redirects, and permanentRedirect() would
 * export an empty page that only redirects with JavaScript. So the page
 * forwards to the Discord page itself, at once and without JavaScript, with a
 * `<meta http-equiv="refresh">` (React puts it in the <head>); in case the
 * browser doesn't follow it, its button opens the Discord invite. Its
 * canonical URL is /discord; it is not in the navigation or the sitemap.
 */

import type { Metadata } from "next";
import Container from "@/app/_components/container";
import { PageHeader } from "@/app/_components/page-header";
import Button from "@/components/Button";
import { pageAlternates } from "@/lib/metadata";
import { DISCORD_PAGE } from "@/lib/navigation";
import { DISCORD_INVITE_URL } from "@/lib/social";

export const metadata: Metadata = {
  title: "Join Us on Discord",
  description: "Join the RSG-Belgium community on Discord directly.",
  alternates: pageAlternates(DISCORD_PAGE.url),
};

/**
 * Forwards to the Discord page, and invites visitors to join us on Discord.
 */
export default function SlackPage() {
  return (
    <Container>
      <meta httpEquiv="refresh" content={`0;url=${DISCORD_PAGE.url}`} />
      <PageHeader
        title="Join us on Discord"
        description="You can join the RSG-Belgium community on Discord directly."
      />
      <div className="pb-16 md:pb-24">
        <Button href={DISCORD_INVITE_URL} variant="primary">
          Join Our Discord Server
        </Button>
      </div>
    </Container>
  );
}
