import React from 'react';
import { render, screen, act } from '@testing-library/react';
import OrganizationPage from '../page'; // Adjust path as necessary
import * as api from '@/lib/api'; // Import to mock getAllMembers
import { Member } from '@/interfaces/member';

// Mock the getAllMembers function
jest.mock('@/lib/api', () => ({
  ...jest.requireActual('@/lib/api'),
  getAllMembers: jest.fn(),
}));

// Mock TeamMemberCard to simplify testing and focus on OrganizationPage logic
jest.mock('@/components/TeamMemberCard', () => ({
  __esModule: true,
  default: ({ name, title, image, linkedin, orcid }: any) => (
    <div data-testid="team-member-card">
      <h3>{name}</h3>
      <p>{title}</p>
      <img src={`/assets/img/people/${image}`} alt={name} />
      {linkedin && <a href={linkedin}>LinkedIn</a>}
      {orcid && <a href={orcid}>ORCID</a>}
    </div>
  ),
}));

const mockMembers: Member[] = [
  {
    slug: 'member-1',
    name: 'Alice Wonderland',
    title: 'Chief Storyteller',
    image: 'alice.jpg',
    linkedin: 'https://linkedin.com/in/alicew',
    orcid: 'https://orcid.org/0000-0001-0000-0001',
    content: 'Loves to tell stories.',
  },
  {
    slug: 'member-2',
    name: 'Bob The Builder',
    title: 'Lead Architect',
    image: 'bob.jpg',
    linkedin: 'https://linkedin.com/in/bobtheb',
    // no orcid
    content: 'Can he fix it? Yes, he can!',
  },
];

const SITE_URL = "https://www.rsg-belgium.org";

describe('OrganizationPage', () => {
  beforeEach(() => {
    (api.getAllMembers as jest.Mock).mockReturnValue(mockMembers);
  });

  test('renders a card for each team member', async () => {
    // OrganizationPage is an async component
    await act(async () => {
      render(<OrganizationPage />);
    });

    const memberCards = screen.getAllByTestId('team-member-card');
    expect(memberCards).toHaveLength(mockMembers.length);

    // Check if names are present (simple check that data is passed to mocked cards)
    expect(screen.getByText('Alice Wonderland')).toBeInTheDocument();
    expect(screen.getByText('Bob The Builder')).toBeInTheDocument();
  });

  test('generates JSON-LD script tags for each member', async () => {
    await act(async () => {
      render(<OrganizationPage />);
    });

    const scripts = document.head.querySelectorAll('script[type="application/ld+json"]');
    expect(scripts.length).toBe(mockMembers.length);

    scripts.forEach((script, index) => {
      const member = mockMembers[index];
      const jsonLd = JSON.parse(script.innerHTML);

      expect(jsonLd['@context']).toBe('https://schema.org');
      expect(jsonLd['@type']).toBe('Person');
      expect(jsonLd.name).toBe(member.name);
      expect(jsonLd.image).toBe(`${SITE_URL}/assets/img/people/${member.image}`);
      expect(jsonLd.jobTitle).toBe(member.title);
      expect(jsonLd.url).toBe(`${SITE_URL}/organization`);

      const expectedSameAs = [];
      if (member.linkedin) expectedSameAs.push(member.linkedin);
      if (member.orcid) expectedSameAs.push(member.orcid);
      expect(jsonLd.sameAs).toEqual(expectedSameAs);
    });
  });

  test('renders page title', async () => {
     await act(async () => {
      render(<OrganizationPage />);
    });
    expect(screen.getByRole('heading', { name: /Our Team/i, level: 1 })).toBeInTheDocument();
  });

  test('handles case with no team members', async () => {
    (api.getAllMembers as jest.Mock).mockReturnValue([]);
    await act(async () => {
      render(<OrganizationPage />);
    });

    expect(screen.getByText(/No team member information available./i)).toBeInTheDocument();
    const scripts = document.head.querySelectorAll('script[type="application/ld+json"]');
    expect(scripts.length).toBe(0); // No JSON-LD scripts if no members
  });
});
