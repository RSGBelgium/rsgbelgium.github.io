/**
 * @jest-environment node
 */

/**
 * Tests for RSG-Belgium's contact channels (src/lib/social.ts), shared by the
 * footer and the Contact page.
 */

import { CONTACT_CHANNELS, CONTACT_EMAIL } from "@/lib/social";

describe("CONTACT_CHANNELS", () => {
  test("lists exactly Email, GitHub, Discord and LinkedIn, in that order", () => {
    expect(CONTACT_CHANNELS.map((channel) => channel.id)).toEqual([
      "email",
      "github",
      "discord",
      "linkedin",
    ]);
    expect(CONTACT_CHANNELS.map((channel) => channel.label)).toEqual([
      "Email",
      "GitHub",
      "Discord",
      "LinkedIn",
    ]);
  });

  test("has no Twitter/X or Facebook channel", () => {
    for (const channel of CONTACT_CHANNELS) {
      expect(channel.href).not.toMatch(/twitter\.com|x\.com|facebook\.com/i);
      expect(channel.label).not.toMatch(/twitter|facebook/i);
    }
  });

  test("links each channel to the right kind of target", () => {
    const byId = Object.fromEntries(CONTACT_CHANNELS.map((channel) => [channel.id, channel]));

    expect(byId.email.href).toBe(`mailto:${CONTACT_EMAIL}`);
    expect(byId.email.linkText).toBe(CONTACT_EMAIL);
    expect(byId.discord.href).toBe("/discord");
    expect(byId.github.href).toBe("https://github.com/RSGBelgium");
    expect(byId.linkedin.href).toMatch(/^https:\/\/www\.linkedin\.com\//);
  });

  test("gives every channel a link text and a description", () => {
    for (const channel of CONTACT_CHANNELS) {
      expect(channel.linkText.trim()).not.toBe("");
      expect(channel.description.trim()).not.toBe("");
    }
  });
});
