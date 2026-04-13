import React from 'react';
import { render, screen } from '@testing-library/react';
import AwardDetailCard from '@/components/awards/AwardDetailCard';
import type { AwardFull } from '@/types/awards';

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

const mockAward: AwardFull = {
  id: '1',
  slug: 'best-engineer',
  title: 'Best Engineer',
  description: 'Awarded to the most outstanding engineer of the year with exceptional contributions.',
  imageUrl: '/images/best-engineer.png',
  category: 'individual',
  quantity: 3,
  unitType: 'gi\u1ea3i',
  prizeValue: '10,000,000 VND',
};

describe('AwardDetailCard', () => {
  it('renders in flex-row layout', () => {
    const { container } = render(<AwardDetailCard award={mockAward} />);
    const card = container.firstElementChild as HTMLElement;
    expect(card.className).toContain('flex-row');
  });

  it('renders image with 336x336 dimensions', () => {
    render(<AwardDetailCard award={mockAward} />);
    const img = screen.getByRole('img');
    expect(img).toHaveAttribute('src', mockAward.imageUrl);
    expect(img).toHaveAttribute('width', '336');
    expect(img).toHaveAttribute('height', '336');
  });

  it('renders title in gold', () => {
    render(<AwardDetailCard award={mockAward} />);
    const title = screen.getByText('Best Engineer');
    expect(title).toHaveStyle({ color: 'var(--color-text-gold)' });
  });

  it('renders full description text without clamp', () => {
    render(<AwardDetailCard award={mockAward} />);
    const description = screen.getByText(mockAward.description);
    expect(description).toBeInTheDocument();
    expect(description).not.toHaveStyle({ WebkitLineClamp: '2' });
  });

  it('renders 2 AwardMetaRows', () => {
    render(<AwardDetailCard award={mockAward} />);
    expect(screen.getByText('S\u1ed1 l\u01b0\u1ee3ng gi\u1ea3i th\u01b0\u1edfng:')).toBeInTheDocument();
    expect(screen.getByText('03 gi\u1ea3i')).toBeInTheDocument();
    expect(screen.getByText('Gi\u00e1 tr\u1ecb gi\u1ea3i th\u01b0\u1edfng:')).toBeInTheDocument();
    expect(screen.getByText('10,000,000 VND')).toBeInTheDocument();
  });

  it('has id attribute matching slug', () => {
    const { container } = render(<AwardDetailCard award={mockAward} />);
    const card = container.firstElementChild as HTMLElement;
    expect(card).toHaveAttribute('id', 'best-engineer');
  });

  it('pads quantity to 2 digits', () => {
    const singleDigitAward = { ...mockAward, quantity: 1 };
    render(<AwardDetailCard award={singleDigitAward} />);
    expect(screen.getByText('01 gi\u1ea3i')).toBeInTheDocument();
  });
});
