import React from 'react';
import { render, screen } from '@testing-library/react';
import AboutPage from '../page'; // Adjust path
import '@testing-library/jest-dom';

// Mock Button component
jest.mock('@/components/Button', () => {
  return ({ href, children }: { href: string; children: React.ReactNode }) => (
    <a href={href}>{children}</a>
  );
});

// Mock Intro component (if it's complex or makes its own calls)
jest.mock('@/app/_components/intro', () => {
  return () => <div data-testid="intro-component">Intro Component Mock</div>;
});


describe('AboutPage', () => {
  test('renders main welcome heading', () => {
    render(<AboutPage />);
    expect(screen.getByRole('heading', { name: /Welcome to RSG Belgium!/i, level: 1 })).toBeInTheDocument();
  });

  test('renders "Our Mission" section', () => {
    render(<AboutPage />);
    expect(screen.getByRole('heading', { name: /Our Mission/i, level: 2 })).toBeInTheDocument();
    // Check for some text within the mission
    expect(screen.getByText(/to bring bioinformatics and computational biology students/i)).toBeInTheDocument();
  });

  test('renders "Our Values" section', () => {
    render(<AboutPage />);
    expect(screen.getByRole('heading', { name: /Our Values/i, level: 2 })).toBeInTheDocument();
    // Check for a value
    expect(screen.getByText(/Stimulate interaction and co-operativity/i)).toBeInTheDocument();
  });

  test('renders "Our Events" section', () => {
    render(<AboutPage />);
    expect(screen.getByRole('heading', { name: /Our Events/i, level: 2 })).toBeInTheDocument();
    // Check for an event type
    expect(screen.getByText(/Symposia:/i)).toBeInTheDocument();
  });

  test('renders the Call to Action (CTA) button to Slack', () => {
    render(<AboutPage />);
    const ctaButton = screen.getByRole('link', { name: /Join us on Slack/i });
    expect(ctaButton).toBeInTheDocument();
    expect(ctaButton).toHaveAttribute('href', '/slack');
  });

  test('renders the Intro component', () => {
    render(<AboutPage />);
    expect(screen.getByTestId('intro-component')).toBeInTheDocument();
  });
});
