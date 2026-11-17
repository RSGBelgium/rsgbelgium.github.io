/**
 * Tests for the root layout's structure (src/app/layout.tsx): the skip link
 * must be the first thing keyboard users reach, and lead to the page's <main>.
 */

import { isValidElement, type ReactNode } from "react";
import Header from "@/app/_components/header";
import SkipLink from "@/app/_components/skip-link";
import RootLayout from "../layout";

/** Every element in a React element tree, depth first, i.e. in document order. */
function elementsInOrder(node: ReactNode): React.ReactElement<Record<string, unknown>>[] {
  if (Array.isArray(node)) return node.flatMap(elementsInOrder);
  if (!isValidElement<Record<string, unknown>>(node)) return [];
  return [node, ...elementsInOrder(node.props.children as ReactNode)];
}

test("the skip link comes first, before the header, and leads to the only <main>", () => {
  const elements = elementsInOrder(RootLayout({ children: <p>Page content</p> }));
  const types = elements.map((element) => element.type);
  const skipLink = elements.find((element) => element.type === SkipLink);
  const mains = elements.filter((element) => element.type === "main");

  expect(skipLink).toBeDefined();
  expect(types.indexOf(SkipLink)).toBeLessThan(types.indexOf(Header));
  expect(mains).toHaveLength(1);
  expect(mains[0].props.id).toBe(skipLink?.props.targetId);
});
