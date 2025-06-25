import React from 'react';
import { render, screen } from '@testing-library/react';
import HeroSection from '../HeroSection'; // Adjust path as necessary
import '@testing-library/jest-dom';

// Mock the Button component
jest.mock('../Button', () => {
  return ({ href, children, ...props }: { href: string; children: React.ReactNode} ) => (
    <a href={href} {...props}>{children}</a>
  );
});

describe('HeroSection Component', () => {
  const defaultProps = {
    headline: 'Test Headline',
    introText: 'This is a test introduction.',
    ctaLabel: 'Click Here',
    ctaLink: '/test-cta-link',
  };

  test('renders headline, intro text, and CTA button correctly', () => {
    render(<HeroSection {...defaultProps} />);

    // Check for headline
    expect(screen.getByText(defaultProps.headline)).toBeInTheDocument();
    // Check for intro text
    expect(screen.getByText(defaultProps.introText)).toBeInTheDocument();

    // Check for CTA button (mocked as an anchor tag)
    const ctaButton = screen.getByRole('link', { name: defaultProps.ctaLabel });
    expect(ctaButton).toBeInTheDocument();
    expect(ctaButton).toHaveAttribute('href', defaultProps.ctaLink);
  });

  test('headline is rendered as a prominent heading (h1)', () => {
    render(<HeroSection {...defaultProps} />);
    const headlineElement = screen.getByText(defaultProps.headline);
    // Check if it's an h1 or has a role that implies a high-level heading.
    // Depending on styling, it might be an h1 directly or a p/div styled as one.
    // For this component, the structure is h1.
    expect(headlineElement.tagName).toBe('H1');
  });
});
