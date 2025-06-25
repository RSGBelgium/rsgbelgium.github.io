import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import NewsPage from '../page'; // Adjust path as necessary
import * as api from '@/lib/api'; // Import to mock getAllPosts
import { Post } from '@/interfaces/post';

// Mock the getAllPosts function
jest.mock('@/lib/api', () => ({
  ...jest.requireActual('@/lib/api'), // Import and retain default exports
  getAllPosts: jest.fn(),
}));

const mockNewsArticles: Post[] = [
  {
    slug: 'article-1',
    title: 'Article 1',
    date: '2023-01-01',
    coverImage: 'image1.jpg',
    author: { name: 'Author 1', picture: 'author1.jpg' },
    excerpt: 'Excerpt 1',
    ogImage: { url: 'og1.jpg' },
    content: 'Content 1',
    category: 'Category A',
  },
  {
    slug: 'article-2',
    title: 'Article 2',
    date: '2023-01-02',
    coverImage: 'image2.jpg',
    author: { name: 'Author 2', picture: 'author2.jpg' },
    excerpt: 'Excerpt 2',
    ogImage: { url: 'og2.jpg' },
    content: 'Content 2',
    category: 'Category B',
  },
  {
    slug: 'article-3',
    title: 'Article 3',
    date: '2023-01-03',
    coverImage: 'image3.jpg',
    author: { name: 'Author 3', picture: 'author3.jpg' },
    excerpt: 'Excerpt 3',
    ogImage: { url: 'og3.jpg' },
    content: 'Content 3',
    category: 'Category A',
  },
];

describe('NewsPage', () => {
  beforeEach(() => {
    // Provide the mock implementation for getAllPosts
    (api.getAllPosts as jest.Mock).mockReturnValue(mockNewsArticles);
    // Reset a new mock for each test to ensure isolation (if needed for more complex scenarios)
    // jest.clearAllMocks(); // Usually good practice, but ensure mockReturnValue is set again if used
  });

  test('renders filter buttons for each unique category and a "Show All" button', async () => {
    // NewsPage is an async component, so we need to handle the promise it returns
    // We also need to wrap state updates in act
    await act(async () => {
      render(<NewsPage />);
    });

    expect(screen.getByRole('button', { name: /Show All/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Category A/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Category B/i })).toBeInTheDocument();
  });

  test('filters articles when a category button is clicked', async () => {
    await act(async () => {
      render(<NewsPage />);
    });

    // Initially, all articles should be somewhat visible (e.g. by title)
    // The first article is featured, others in "More Stories"
    expect(screen.getByText('Article 1')).toBeInTheDocument(); // Featured
    expect(screen.getByText('Article 2')).toBeInTheDocument(); // In MoreStories
    expect(screen.getByText('Article 3')).toBeInTheDocument(); // In MoreStories

    // Click on 'Category A'
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /Category A/i }));
    });

    expect(screen.getByText('Article 1')).toBeInTheDocument();
    expect(screen.queryByText('Article 2')).not.toBeInTheDocument();
    expect(screen.getByText('Article 3')).toBeInTheDocument();
  });

  test('shows all articles when "Show All" button is clicked after a filter', async () => {
    await act(async () => {
      render(<NewsPage />);
    });

    // Filter by Category B first
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /Category B/i }));
    });
    expect(screen.queryByText('Article 1')).not.toBeInTheDocument();
    expect(screen.getByText('Article 2')).toBeInTheDocument();
    expect(screen.queryByText('Article 3')).not.toBeInTheDocument();

    // Click on 'Show All'
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /Show All/i }));
    });

    expect(screen.getByText('Article 1')).toBeInTheDocument();
    expect(screen.getByText('Article 2')).toBeInTheDocument();
    expect(screen.getByText('Article 3')).toBeInTheDocument();
  });

   test('displays a message when no articles are found for a selected category', async () => {
    (api.getAllPosts as jest.Mock).mockReturnValue([mockNewsArticles[0]]); // Only one article in Category A
     await act(async () => {
      render(<NewsPage />);
    });

    // Click on 'Category B' which has no articles in this specific setup
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /Category B/i }));
    });

    expect(screen.getByText(/No articles found in the category: Category B/i)).toBeInTheDocument();
    expect(screen.queryByText('Article 1')).not.toBeInTheDocument();
  });
});
