import { fireEvent, render, screen } from "@testing-library/react";
import Button from "../Button";

describe("Button", () => {
  test('renders a <button type="button"> without href', () => {
    render(<Button>Click me</Button>);
    const button = screen.getByRole("button", { name: "Click me" });
    expect(button.tagName).toBe("BUTTON");
    expect(button).toHaveAttribute("type", "button");
  });

  test("renders a link with href", () => {
    render(<Button href="/slack">Join Slack</Button>);
    expect(screen.getByRole("link", { name: "Join Slack" })).toHaveAttribute("href", "/slack");
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  test("uses the primary variant and the medium size by default", () => {
    render(<Button>Default</Button>);
    const button = screen.getByRole("button", { name: "Default" });
    expect(button).toHaveClass("button-primary", "px-4", "py-2", "text-base");
  });

  test.each([
    ["primary", "button-primary"],
    ["secondary", "button-secondary"],
    ["outline", "button-outline"],
    ["inverse", "button-inverse"],
  ] as const)("variant %s uses the theme-aware .%s class", (variant, className) => {
    render(<Button variant={variant}>Variant</Button>);
    expect(screen.getByRole("button", { name: "Variant" })).toHaveClass(className);
  });

  test.each([
    ["sm", ["px-3", "py-1.5", "text-sm"]],
    ["lg", ["px-6", "py-3", "text-lg"]],
  ] as const)("size %s", (size, classes) => {
    render(<Button size={size}>Sized</Button>);
    expect(screen.getByRole("button", { name: "Sized" })).toHaveClass(...classes);
  });

  test("adds a custom className to the variant classes", () => {
    render(<Button className="w-full">Wide</Button>);
    expect(screen.getByRole("button", { name: "Wide" })).toHaveClass("w-full", "button-primary");
  });

  test("passes other props to the button", () => {
    const onClick = jest.fn();
    render(
      <Button disabled onClick={onClick}>
        Disabled
      </Button>,
    );
    const button = screen.getByRole("button", { name: "Disabled" });
    expect(button).toBeDisabled();
    fireEvent.click(button);
    expect(onClick).not.toHaveBeenCalled();
  });

  test("passes onClick to the link", () => {
    const onClick = jest.fn((event: React.MouseEvent) => event.preventDefault());
    render(
      <Button href="/slack" onClick={onClick}>
        Join Slack
      </Button>,
    );
    fireEvent.click(screen.getByRole("link", { name: "Join Slack" }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
