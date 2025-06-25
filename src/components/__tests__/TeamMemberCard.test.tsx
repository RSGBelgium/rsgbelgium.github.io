import React from 'react';
import { render, screen } from '@testing-library/react';
import TeamMemberCard from '../TeamMemberCard'; // Adjust path as necessary
// Mock next/image
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => {
    // eslint-disable-next-line @next/next/no-img-element
    return <img {...props} />;
  },
}));

describe('TeamMemberCard', () => {
  const defaultProps = {
    name: 'John Doe',
    title: 'Software Engineer',
    image: 'john-doe.jpg', // This will be prefixed with /assets/img/people/
  };

  test('renders member\'s name, title, and image', () => {
    render(<TeamMemberCard {...defaultProps} />);

    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Software Engineer')).toBeInTheDocument();

    const image = screen.getByAltText('John Doe');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', '/assets/img/people/john-doe.jpg');
  });

  test('renders LinkedIn link when provided', () => {
    const propsWithLinkedIn = { ...defaultProps, linkedin: 'https://linkedin.com/in/johndoe' };
    render(<TeamMemberCard {...propsWithLinkedIn} />);

    const linkedinLink = screen.getByRole('link', { name: /LinkedIn/i });
    expect(linkedinLink).toBeInTheDocument();
    expect(linkedinLink).toHaveAttribute('href', 'https://linkedin.com/in/johndoe');
  });

  test('does not render LinkedIn link when not provided', () => {
    render(<TeamMemberCard {...defaultProps} />);
    expect(screen.queryByRole('link', { name: /LinkedIn/i })).not.toBeInTheDocument();
  });

  test('renders ORCID link when provided', () => {
    const propsWithOrcid = { ...defaultProps, orcid: 'https://orcid.org/0000-0000-0000-0000' };
    render(<TeamMemberCard {...propsWithOrcid} />);

    const orcidLink = screen.getByRole('link', { name: /ORCID/i });
    expect(orcidLink).toBeInTheDocument();
    expect(orcidLink).toHaveAttribute('href', 'https://orcid.org/0000-0000-0000-0000');
  });

  test('does not render ORCID link when not provided', () => {
    render(<TeamMemberCard {...defaultProps} />);
    expect(screen.queryByRole('link', { name: /ORCID/i })).not.toBeInTheDocument();
  });

  test('uses next/image structure (mocked)', () => {
    // With the mock, we are essentially checking if the props are passed correctly to our img tag
    // A more sophisticated mock or snapshot test could verify specific next/image behavior if needed
    render(<TeamMemberCard {...defaultProps} image="test.png" />);
    const image = screen.getByAltText(defaultProps.name) as HTMLImageElement;
    expect(image.src).toContain('/assets/img/people/test.png');
    // next/image adds specific inline styles or wrapper divs that could be checked too,
    // but our current mock simplifies it to an <img> tag.
    // For example, next/image typically involves `layout="fill"` and `objectFit="cover"` as per component code.
    // These would translate to specific styles or attributes that are not directly on the <img> with the basic mock.
    // This test, with the current mock, primarily confirms the src and alt text.
  });
});
