import React from 'react';
import { render, screen } from '@testing-library/react';
import AwardsSection from '@/components/homepage/AwardsSection';
import type { Award } from '@/types/homepage';
import vi from '@/i18n/dictionaries/vi';

jest.mock('next/link', () => {
  return ({ children, href, ...rest }: { children: React.ReactNode; href: string; [key: string]: unknown }) => (
    <a href={href} {...rest}>
      {children}
    </a>
  );
});

jest.mock('next/image', () => {
  return ({ priority: _priority, ...props }: Record<string, unknown>) => {
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    return <img {...props} />;
  };
});

const mockAwards: Award[] = [
  {
    id: '1',
    slug: 'best-engineer',
    title: 'Best Engineer',
    description: 'Outstanding engineer award.',
    imageUrl: '/images/best-engineer.png',
    category: 'individual',
  },
  {
    id: '2',
    slug: 'best-team',
    title: 'Best Team',
    description: 'Outstanding team award.',
    imageUrl: '/images/best-team.png',
    category: 'team',
  },
  {
    id: '3',
    slug: 'innovation',
    title: 'Innovation Award',
    description: 'Most innovative project.',
    imageUrl: '/images/innovation.png',
    category: 'project',
  },
];

describe('AwardsSection', () => {
  it('renders caption "Sun* annual awards 2025"', () => {
    render(<AwardsSection awards={mockAwards} dict={vi} />);
    expect(screen.getByText('Sun* annual awards 2025')).toBeInTheDocument();
  });

  it('renders title "Hệ thống giải thưởng"', () => {
    render(<AwardsSection awards={mockAwards} dict={vi} />);
    expect(screen.getByText('Hệ thống giải thưởng')).toBeInTheDocument();
  });

  it('renders correct number of award cards', () => {
    render(<AwardsSection awards={mockAwards} dict={vi} />);
    const links = screen.getAllByRole('link');
    expect(links).toHaveLength(mockAwards.length);
  });

  it('renders empty state when awards array is empty', () => {
    render(<AwardsSection awards={[]} dict={vi} />);
    expect(screen.getByTestId('awards-empty')).toBeInTheDocument();
    expect(screen.queryAllByRole('link')).toHaveLength(0);
  });
});
