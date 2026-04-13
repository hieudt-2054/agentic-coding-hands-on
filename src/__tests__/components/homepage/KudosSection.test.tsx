import React from 'react';
import { render, screen } from '@testing-library/react';
import KudosSection from '@/components/homepage/KudosSection';
import type { KudosInfo } from '@/types/homepage';
import vi from '@/i18n/dictionaries/vi';

jest.mock('next/link', () => {
  return ({ children, href, ...rest }: { children: React.ReactNode; href: string; [key: string]: unknown }) => (
    <a href={href} {...rest}>
      {children}
    </a>
  );
});

const mockKudos: KudosInfo = {
  label: 'Phong trào ghi nhận',
  title: 'Sun* Kudos',
  description: 'A recognition program to celebrate outstanding contributions.',
  detailUrl: '/kudos/detail',
  decorationImageUrl: '/assets/homepage/images/kudos-decoration.png',
};

describe('KudosSection', () => {
  it('renders label "Phong trào ghi nhận"', () => {
    render(<KudosSection kudos={mockKudos} dict={vi} />);
    expect(screen.getByText('Phong trào ghi nhận')).toBeInTheDocument();
  });

  it('renders title "Sun* Kudos" in gold', () => {
    render(<KudosSection kudos={mockKudos} dict={vi} />);
    const title = screen.getByRole('heading', { level: 2 });
    expect(title).toHaveTextContent('Sun* Kudos');
    expect(title).toHaveStyle({ color: 'var(--color-text-gold)' });
  });

  it('renders description text', () => {
    render(<KudosSection kudos={mockKudos} dict={vi} />);
    expect(
      screen.getByText('A recognition program to celebrate outstanding contributions.')
    ).toBeInTheDocument();
  });

  it('renders "Chi tiết" button as a Link', () => {
    render(<KudosSection kudos={mockKudos} dict={vi} />);
    const link = screen.getByText('Chi tiết').closest('a');
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/kudos/detail');
  });

  it('renders "Chi tiết" button with fallback href when detailUrl is null', () => {
    render(<KudosSection kudos={{ ...mockKudos, detailUrl: null }} dict={vi} />);
    const link = screen.getByText('Chi tiết').closest('a');
    expect(link).toHaveAttribute('href', '#');
  });

  it('does not crash when kudos is null', () => {
    const { container } = render(<KudosSection kudos={null} dict={vi} />);
    expect(container.innerHTML).toBe('');
  });

  it('card has dark background', () => {
    render(<KudosSection kudos={mockKudos} dict={vi} />);
    const title = screen.getByRole('heading', { level: 2 });
    const card = title.closest('div');
    expect(card?.parentElement).toHaveStyle({
      backgroundColor: 'var(--color-card-bg)',
    });
  });
});
