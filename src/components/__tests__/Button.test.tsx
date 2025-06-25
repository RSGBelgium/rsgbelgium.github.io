import React from 'react';
import { render, screen } from '@testing-library/react';
import Button from '../Button'; // Adjust path as necessary
import '@testing-library/jest-dom';

// Mock next/link for testing 'a' tag behavior
jest.mock('next/link', () => {
  return ({ href, children, ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement> & {children: React.ReactNode}) => {
    return <a href={href} {...props}>{children}</a>;
  };
});

describe('Button Component', () => {
  test('renders as a <button> by default', () => {
    render(<Button>Click Me</Button>);
    const buttonElement = screen.getByRole('button', { name: /Click Me/i });
    expect(buttonElement).toBeInTheDocument();
    expect(buttonElement.tagName).toBe('BUTTON');
  });

  test('renders as an <a> tag when href prop is provided', () => {
    const href = '/test-link';
    render(<Button href={href}>Link Button</Button>);
    const linkElement = screen.getByRole('link', { name: /Link Button/i });
    expect(linkElement).toBeInTheDocument();
    expect(linkElement.tagName).toBe('A');
    expect(linkElement).toHaveAttribute('href', href);
  });

  test('renders children correctly', () => {
    const buttonText = 'Submit Form';
    render(<Button>{buttonText}</Button>);
    expect(screen.getByText(buttonText)).toBeInTheDocument();
  });

  test('applies default variant and size classes', () => {
    render(<Button>Default</Button>);
    const buttonElement = screen.getByRole('button', { name: /Default/i });
    // Check for a subset of expected classes
    expect(buttonElement).toHaveClass('bg-blue-600'); // Primary variant
    expect(buttonElement).toHaveClass('px-4 py-2');   // md size
  });

  test('applies primary variant classes', () => {
    render(<Button variant="primary">Primary</Button>);
    expect(screen.getByRole('button', { name: /Primary/i })).toHaveClass('bg-blue-600 text-white hover:bg-blue-700');
  });

  test('applies secondary variant classes', () => {
    render(<Button variant="secondary">Secondary</Button>);
    expect(screen.getByRole('button', { name: /Secondary/i })).toHaveClass('bg-gray-600 text-white hover:bg-gray-700');
  });

  test('applies outline variant classes', () => {
    render(<Button variant="outline">Outline</Button>);
    expect(screen.getByRole('button', { name: /Outline/i })).toHaveClass('bg-transparent border-blue-600 text-blue-600 hover:bg-blue-50');
  });

  test('applies small size classes', () => {
    render(<Button size="sm">Small</Button>);
    expect(screen.getByRole('button', { name: /Small/i })).toHaveClass('px-3 py-1.5 text-sm');
  });

  test('applies large size classes', () => {
    render(<Button size="lg">Large</Button>);
    expect(screen.getByRole('button', { name: /Large/i })).toHaveClass('px-6 py-3 text-lg');
  });

  test('passes other standard button props', () => {
    render(<Button disabled>Disabled</Button>);
    expect(screen.getByRole('button', { name: /Disabled/i })).toBeDisabled();
  });

  test('merges custom className', () => {
    render(<Button className="custom-class">Custom</Button>);
    const buttonElement = screen.getByRole('button', { name: /Custom/i });
    expect(buttonElement).toHaveClass('custom-class');
    expect(buttonElement).toHaveClass('bg-blue-600'); // Default variant still applies
  });
});
