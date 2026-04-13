import React from 'react';
import { render, screen } from '@testing-library/react';
import CTAButtons from '@/components/homepage/CTAButtons';

jest.mock('next/link', () => {
  return ({ children, href, ...rest }: { children: React.ReactNode; href: string; [key: string]: unknown }) => (
    <a href={href} {...rest}>
      {children}
    </a>
  );
});

describe('CTAButtons', () => {
  it('renders "ABOUT AWARDS" button', () => {
    render(<CTAButtons />);
    expect(screen.getByText('ABOUT AWARDS')).toBeInTheDocument();
  });

  it('renders "ABOUT KUDOS" button', () => {
    render(<CTAButtons />);
    expect(screen.getByText('ABOUT KUDOS')).toBeInTheDocument();
  });

  it('renders both buttons as links', () => {
    render(<CTAButtons />);
    const links = screen.getAllByRole('link');
    expect(links).toHaveLength(2);
  });

  it('wraps "ABOUT AWARDS" in a Link', () => {
    render(<CTAButtons />);
    const aboutAwardsLink = screen.getByText('ABOUT AWARDS').closest('a');
    expect(aboutAwardsLink).toBeInTheDocument();
  });

  it('wraps "ABOUT KUDOS" in a Link', () => {
    render(<CTAButtons />);
    const aboutKudosLink = screen.getByText('ABOUT KUDOS').closest('a');
    expect(aboutKudosLink).toBeInTheDocument();
  });
});
