import { render, screen } from "@testing-library/react";
import { breakBeforeAt, ContactChannelLink, ContactIcon } from "../ContactChannels";
import { CONTACT_CHANNELS } from "@/lib/social";

const channel = (id: string) => CONTACT_CHANNELS.find((c) => c.id === id)!;

describe("ContactChannelLink", () => {
  test("opens external channels in a new tab and says so", () => {
    render(<ContactChannelLink channel={channel("github")}>GitHub</ContactChannelLink>);
    const link = screen.getByRole("link", { name: "GitHub (opens in a new tab)" });
    expect(link).toHaveAttribute("href", "https://github.com/RSGBelgium");
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
  });

  test("keeps internal and mailto links in the same tab", () => {
    render(
      <>
        <ContactChannelLink channel={channel("discord")}>Discord</ContactChannelLink>
        <ContactChannelLink channel={channel("email")}>Email</ContactChannelLink>
      </>,
    );
    const discord = screen.getByRole("link", { name: "Discord" });
    const email = screen.getByRole("link", { name: "Email" });
    expect(discord).toHaveAttribute("href", "/discord");
    expect(email).toHaveAttribute("href", channel("email").href);
    expect(discord).not.toHaveAttribute("target");
    expect(email).not.toHaveAttribute("target");
  });
});

describe("breakBeforeAt", () => {
  test("puts a hidden line-break opportunity before the @ of an e-mail address", () => {
    const { container } = render(<p>{breakBeforeAt("rsg-belgium@iscbsc.org")}</p>);
    expect(container.querySelector("p")?.innerHTML).toBe(
      'rsg-belgium<wbr aria-hidden="true">@iscbsc.org',
    );
  });

  test("returns other text unchanged", () => {
    expect(breakBeforeAt("Join our Discord server")).toBe("Join our Discord server");
  });
});

describe("ContactIcon", () => {
  test.each(CONTACT_CHANNELS.map((c) => c.id))("renders a decorative %s icon", (id) => {
    const { container } = render(<ContactIcon id={id} />);
    const svg = container.querySelector("svg");
    expect(svg).toHaveAttribute("aria-hidden", "true");
    expect(svg).toHaveAttribute("focusable", "false");
  });
});
