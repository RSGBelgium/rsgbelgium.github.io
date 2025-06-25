import React from 'react';
import { render, screen } from '@testing-library/react';
import FeaturedNews from '../FeaturedNews'; // Adjust path
import { Post } from '@/interfaces/post';
import '@testing-library/jest-dom';

// Mock DateFormatter
jest.mock('@/app/_components/date-formatter', () => {
  return ({ dateString }: { dateString: string }) => <span>{dateString}</span>;
});

// Mock Button component (if it's used for "View All News", which it is)
jest.mock('../Button', () => {
  return ({ href, children }: { href: string; children: React.ReactNode }) => (
    <a href={href}>{children}</a>
  );
});

// Mock next/link as it's used for individual post links
jest.mock('next/link', () => {
  return ({ href, children, ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement> & {children: React.ReactNode}) => {
    return <a href={href} {...props}>{children}</a>;
  };
});


const mockPosts: Post[] = [
  {
    slug: 'news-1',
    title: 'First News Article',
    date: '2023-10-01',
    coverImage: '/assets/news/news1.jpg', // Example path
    author: { name: 'Author A', picture: 'authorA.jpg' },
    excerpt: 'This is the excerpt for the first news.',
    ogImage: { url: 'og1.jpg' },
    content: 'Full content 1',
    category: 'Updates',
  },
  {
    slug: 'news-2',
    title: 'Second News Article',
    date: '2023-10-02',
    coverImage: 'news2.jpg', // Example relative path
    author: { name: 'Author B', picture: 'authorB.jpg' },
    excerpt: 'Excerpt for the second article.',
    ogImage: { url: 'og2.jpg' },
    content: 'Full content 2',
    category: 'Events',
  },
];

describe('FeaturedNews Component', () => {
  test('renders section title "Latest News"', () => {
    render(<FeaturedNews posts={mockPosts} />);
    expect(screen.getByRole('heading', { name: /Latest News/i, level: 2 })).toBeInTheDocument();
  });

  test('renders the correct number of news cards', () => {
    render(<FeaturedNews posts={mockPosts} />);
    // Each card has a title, which we can count
    const titles = mockPosts.map(post => screen.getByText(post.title));
    expect(titles.length).toBe(mockPosts.length);
  });

  test('each card displays title, date, and excerpt', () => {
    render(<FeaturedNews posts={mockPosts} />);
    mockPosts.forEach(post => {
      expect(screen.getByText(post.title)).toBeInTheDocument();
      expect(screen.getByText(post.date)).toBeInTheDocument(); // Mocked DateFormatter just shows the string
      expect(screen.getByText(post.excerpt)).toBeInTheDocument();

      // Check that the link to the full article is correct
      const postLink = screen.getByRole('link', { name: post.title });
      expect(postLink).toHaveAttribute('href', `/news/${post.slug}`);

      const readMoreLink = screen.getAllByRole('link', { name: /Read more →/i }).find(link => (link as HTMLAnchorElement).href.includes(`/news/${post.slug}`));
      expect(readMoreLink).toBeInTheDocument();

    });
  });

  test('renders "View All News" button/link', () => {
    render(<FeaturedNews posts={mockPosts} />);
    const viewAllLink = screen.getByRole('link', { name: /View All News/i });
    expect(viewAllLink).toBeInTheDocument();
    expect(viewAllLink).toHaveAttribute('href', '/news');
  });

  test('renders cover images with correct src', () => {
    render(<FeaturedNews posts={mockPosts} />);
    const firstImage = screen.getByAltText(mockPosts[0].title) as HTMLImageElement;
    expect(firstImage).toBeInTheDocument();
    expect(firstImage.src).toContain(mockPosts[0].coverImage); // Absolute path

    const secondImage = screen.getByAltText(mockPosts[1].title) as HTMLImageElement;
    expect(secondImage).toBeInTheDocument();
    // The component logic prepends /assets/blog/${post.slug}/ if not starting with /
    expect(secondImage.src).toContain(`/assets/blog/${mockPosts[1].slug}/${mockPosts[1].coverImage}`);
  });

  test('returns null if no posts are provided', () => {
    const { container } = render(<FeaturedNews posts={[]} />);
    expect(container.firstChild).toBeNull();
  });
});
