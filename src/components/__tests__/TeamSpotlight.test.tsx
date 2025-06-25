import React from 'react';
import { render, screen } from '@testing-library/react';
import TeamSpotlight from '../TeamSpotlight'; // Adjust path
import { Member } from '@/interfaces/member';
import '@testing-library/jest-dom';

// Mock next/image
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => {
    // eslint-disable-next-line @next/next/no-img-element
    return <img {...props} />;
  },
}));

// Mock Button component
jest.mock('../Button', () => {
  return ({ href, children }: { href: string; children: React.ReactNode }) => (
    <a href={href}>{children}</a>
  );
});

const mockMembers: Member[] = [
  {
    slug: 'member-alpha',
    name: 'Alpha Person',
    title: 'Lead Developer',
    image: 'alpha.jpg',
    linkedin: 'linkedin.com/alpha',
    orcid: 'orcid.org/alpha',
  },
  {
    slug: 'member-beta',
    name: 'Beta Tester',
    title: 'QA Specialist',
    image: 'beta.jpg',
    // No linkedin or orcid
  },
];

describe('TeamSpotlight Component', () => {
  test('renders section title "Meet the Team"', () => {
    render(<TeamSpotlight members={mockMembers} />);
    expect(screen.getByRole('heading', { name: /Meet the Team/i, level: 2 })).toBeInTheDocument();
  });

  test('renders the correct number of member cards', () => {
    render(<TeamSpotlight members={mockMembers} />);
    // Each card has a name, we can count these
    const names = mockMembers.map(member => screen.getByText(member.name));
    expect(names.length).toBe(mockMembers.length);
  });

  test('each card displays name, title, and image', () => {
    render(<TeamSpotlight members={mockMembers} />);
    mockMembers.forEach(member => {
      expect(screen.getByText(member.name)).toBeInTheDocument();
      expect(screen.getByText(member.title)).toBeInTheDocument();
      const image = screen.getByAltText(member.name) as HTMLImageElement;
      expect(image).toBeInTheDocument();
      expect(image.src).toContain(`/assets/img/people/${member.image}`);
    });
  });

  test('renders "View Full Team" button/link', () => {
    render(<TeamSpotlight members={mockMembers} />);
    const viewAllLink = screen.getByRole('link', { name: /View Full Team/i });
    expect(viewAllLink).toBeInTheDocument();
    expect(viewAllLink).toHaveAttribute('href', '/organization');
  });

  test('returns null if no members are provided', () => {
    const { container } = render(<TeamSpotlight members={[]} />);
    expect(container.firstChild).toBeNull();
  });
});
