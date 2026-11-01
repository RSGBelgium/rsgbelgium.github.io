/**
 * robots.txt for search engines, exported as out/robots.txt.
 *
 * Allows crawling of the whole site and points crawlers to the sitemap.
 */

import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/constants";

/** Generate the file once at build time: required for metadata routes with `output: 'export'`. */
export const dynamic = "force-static";

/**
 * Builds the robots.txt rules.
 *
 * @returns Allow-all rules plus the sitemap URL and preferred host
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
