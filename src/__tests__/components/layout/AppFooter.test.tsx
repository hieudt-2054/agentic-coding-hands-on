import React from 'react';
import { render, screen } from '@testing-library/react';
import AppFooter from '@/components/layout/AppFooter';
import vi from '@/i18n/dictionaries/vi';

jest.mock('next/image', () => {
  return ({ priority: _priority, loading: _loading, ...props }: Record<string, unknown>) => {
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    return <img {...props} />;
  };
});

jest.mock('next/link', () => {
  return ({ children, href, ...rest }: { children: React.ReactNode; href: string; [key: string]: unknown }) => (
    <a href={href} {...rest}>
      {children}
    </a>
  );
});

describe('AppFooter', () => {
  it('renders logo image', () => {
    render(<AppFooter dict={vi} />);
    const logo = screen.getAllByRole('img').find(
      (img) => /saa/i.test(img.getAttribute('alt') ?? '') || /logo/i.test(img.getAttribute('alt') ?? '')
    );
    expect(logo).toBeInTheDocument();
  });

  it('renders nav links', () => {
    render(<AppFooter dict={vi} />);
    expect(screen.getByText('About SAA 2025')).toBeInTheDocument();
    expect(screen.getByText('Awards Information')).toBeInTheDocument();
    expect(screen.getByText('Sun* Kudos')).toBeInTheDocument();
  });

  it('renders copyright text containing Sun* or SAA', () => {
    render(<AppFooter dict={vi} />);
    const copyright = screen.getByText(/Sun\*.*© 2025/i);
    expect(copyright).toBeInTheDocument();
  });

  it('footer has top border', () => {
    render(<AppFooter dict={vi} />);
    const footer = screen.getByRole('contentinfo');
    expect(footer).toHaveStyle({ borderTop: 'var(--border-footer-top)' });
  });
});
