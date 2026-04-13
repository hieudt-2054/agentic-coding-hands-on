import React from 'react';
import { render, screen } from '@testing-library/react';
import AwardCard from '@/components/homepage/AwardCard';
import type { Award } from '@/types/homepage';

jest.mock('next/link', () => {
  return ({ children, href, ...rest }: { children: React.ReactNode; href: string; [key: string]: unknown }) => (
    <a href={href} {...rest}>
      {children}
    </a>
  );
});

jest.mock('next/image', () => {
  return (props: Record<string, unknown>) => {
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    return <img {...props} />;
  };
});

const mockAward: Award = {
  id: '1',
  slug: 'best-engineer',
  title: 'Best Engineer',
  description: 'Awarded to the most outstanding engineer of the year.',
  imageUrl: '/images/best-engineer.png',
  category: 'individual',
};

describe('AwardCard', () => {
  it('renders image with correct src and alt', () => {
    render(<AwardCard award={mockAward} />);
    const img = screen.getByRole('img');
    expect(img).toHaveAttribute('src', mockAward.imageUrl);
    expect(img).toHaveAttribute('alt', mockAward.title);
  });

  it('renders title in gold', () => {
    render(<AwardCard award={mockAward} />);
    const title = screen.getByText('Best Engineer');
    expect(title).toBeInTheDocument();
    expect(title).toHaveStyle({ color: 'var(--color-text-gold)' });
  });

  it('renders description in white', () => {
    render(<AwardCard award={mockAward} />);
    const description = screen.getByText(mockAward.description);
    expect(description).toBeInTheDocument();
    expect(description).toHaveStyle({ color: 'var(--color-text-primary)' });
  });

  it('renders "Chi tiết →" text', () => {
    render(<AwardCard award={mockAward} />);
    expect(screen.getByText('Chi tiết →')).toBeInTheDocument();
  });

  it('wraps entire card in a Link with href containing slug', () => {
    render(<AwardCard award={mockAward} />);
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', `/awards#${mockAward.slug}`);
  });
});
