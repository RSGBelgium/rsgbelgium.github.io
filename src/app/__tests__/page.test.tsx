import React from 'react';
import { render, screen, act } from '@testing-library/react';
import IndexPage from '../page'; // Adjust path to your homepage component
import * as api from '@/lib/api'; // To mock getAllPosts and getAllMembers
import '@testing-library/jest-dom';

// Mock API functions
jest.mock('@/lib/api', () => ({
  getAllPosts: jest.fn(),
  getAllMembers: jest.fn(),
}));

// Mock child components
jest.mock('@/components/HeroSection', () => {
  return ({ headline }: { headline: string }) => <div data-testid="hero-section">{headline}</div>;
});
jest.mock('@/components/FeaturedNews', () => {
  // Ensure posts prop is typed if needed by your actual component or its mock usage
  return ({ posts }: { posts: any[] }) => <div data-testid="featured-news">Featured News ({posts.length} posts)</div>;
});
jest.mock('@/components/TeamSpotlight', () => {
  return ({ members }: { members: any[] }) => <div data-testid="team-spotlight">Team Spotlight ({members.length} members)</div>;
});

const mockPostsData = [
  { slug: 'post1', title: 'Post 1', date: '2023-01-01', category: 'Tech', excerpt: 'e1', coverImage: 'ci1', author: {name: 'A1', picture: 'p1'}, ogImage: {url: 'og1'}, content: 'c1' },
  { slug: 'post2', title: 'Post 2', date: '2023-01-02', category: 'Science', excerpt: 'e2', coverImage: 'ci2', author: {name: 'A2', picture: 'p2'}, ogImage: {url: 'og2'}, content: 'c2' },
  { slug: 'post3', title: 'Post 3', date: '2023-01-03', category: 'Tech', excerpt: 'e3', coverImage: 'ci3', author: {name: 'A3', picture: 'p3'}, ogImage: {url: 'og3'}, content: 'c3' },
  { slug: 'post4', title: 'Post 4', date: '2023-01-04', category: 'Other', excerpt: 'e4', coverImage: 'ci4', author: {name: 'A4', picture: 'p4'}, ogImage: {url: 'og4'}, content: 'c4' },
];

const mockMembersData = [
  { slug: 'member1', name: 'Member 1', title: 'Title 1', image: 'img1.jpg' },
  { slug: 'member2', name: 'Member 2', title: 'Title 2', image: 'img2.jpg' },
  { slug: 'member3', name: 'Member 3', title: 'Title 3', image: 'img3.jpg' },
  { slug: 'member4', name: 'Member 4', title: 'Title 4', image: 'img4.jpg' },
  { slug: 'member5', name: 'Member 5', title: 'Title 5', image: 'img5.jpg' },
];

describe('IndexPage (Homepage)', () => {
  beforeEach(() => {
    // Setup mock return values for API calls
    (api.getAllPosts as jest.Mock).mockReturnValue(mockPostsData);
    (api.getAllMembers as jest.Mock).mockReturnValue(mockMembersData);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('fetches initial data for news and team members', async () => {
    // IndexPage is an async component, so we need to handle the promise
    await act(async () => {
      render(<IndexPage />);
    });
    expect(api.getAllPosts).toHaveBeenCalledTimes(1);
    expect(api.getAllMembers).toHaveBeenCalledTimes(1);
  });

  test('renders HeroSection with correct props', async () => {
    await act(async () => {
      render(<IndexPage />);
    });
    const heroSection = screen.getByTestId('hero-section');
    expect(heroSection).toBeInTheDocument();
    expect(heroSection).toHaveTextContent('Welcome to RSG Belgium'); // Based on props in IndexPage
  });

  test('renders FeaturedNews with the latest 3 posts', async () => {
     await act(async () => {
      render(<IndexPage />);
    });
    const featuredNews = screen.getByTestId('featured-news');
    expect(featuredNews).toBeInTheDocument();
    expect(featuredNews).toHaveTextContent('Featured News (3 posts)'); // Sliced to 3 in IndexPage
  });

  test('renders TeamSpotlight with the first 4 members', async () => {
    await act(async () => {
      render(<IndexPage />);
    });
    const teamSpotlight = screen.getByTestId('team-spotlight');
    expect(teamSpotlight).toBeInTheDocument();
    expect(teamSpotlight).toHaveTextContent('Team Spotlight (4 members)'); // Sliced to 4 in IndexPage
  });
});
