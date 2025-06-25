import React from 'react';
import { render, screen } from '@testing-library/react';
import SlackPage from '../page'; // Adjust path
import '@testing-library/jest-dom';

// Mock Button component
jest.mock('@/components/Button', () => {
  return ({ href, children, ...props }: { href: string; children: React.ReactNode } & React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
    <a href={href} {...props}>{children}</a>
  );
});

// Mock Intro component
jest.mock('@/app/_components/intro', () => {
  return () => <div data-testid="intro-component">Intro Component Mock</div>;
});

describe('SlackPage', () => {
  test('renders the main heading', () => {
    render(<SlackPage />);
    expect(screen.getByRole('heading', { name: /Join the RSG Belgium Slack Channel/i, level: 1 })).toBeInTheDocument();
  });

  test('renders introductory text about the Slack channel', () => {
    render(<SlackPage />);
    expect(screen.getByText(/We have created a Slack channel where our members can get to know each other/i)).toBeInTheDocument();
    expect(screen.getByText(/To join, please send us an email request/i)).toBeInTheDocument();
  });

  test('renders the "Request Invitation to Join Slack" button with correct mailto link', () => {
    render(<SlackPage />);
    const joinButton = screen.getByRole('link', { name: /Request Invitation to Join Slack/i });
    expect(joinButton).toBeInTheDocument();
    expect(joinButton).toHaveAttribute('href', 'mailto:iscb.rsg.belgium@gmail.com?Subject=RSG%20Slack%20Subscription&Body=I%20would%20like%20to%20join%20the%20RSG%20Belgium%20Slack%20channel%2E');
  });

  test('renders the Intro component', () => {
    render(<SlackPage />);
    expect(screen.getByTestId('intro-component')).toBeInTheDocument();
  });
});
