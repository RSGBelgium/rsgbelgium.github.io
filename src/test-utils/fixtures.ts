/**
 * Test fixtures: news posts and team members with neutral defaults, so a
 * test only writes the fields it is about.
 */

import type { Member } from "@/interfaces/member";
import type { Post } from "@/interfaces/post";

/**
 * A news post as the content loader returns it.
 *
 * @param fields - The fields the test needs; `slug` is required. Defaults:
 *   the slug as title, no date, an empty body, category "news".
 */
export function makePost(fields: Partial<Post> & Pick<Post, "slug">): Post {
  return { title: fields.slug, date: "", content: "", category: "news", ...fields };
}

/**
 * A team member as the content loader returns it.
 *
 * @param fields - The fields the test needs; `slug` and `order` are required.
 *   Defaults: the slug as name, no board role, no photo.
 */
export function makeMember(fields: Partial<Member> & Pick<Member, "slug" | "order">): Member {
  return { name: fields.slug, title: "", image: "", ...fields };
}
