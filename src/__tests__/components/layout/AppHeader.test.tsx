import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import AppHeader from '@/components/layout/AppHeader';

jest.mock('next/image', () => {
  return ({ priority: _priority, ...props }: Record<string, unknown>) => {
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

jest.mock('@/components/login/LanguageToggle', () => {
  return function MockLanguageToggle() {
    return <div data-testid="language-toggle">LanguageToggle</div>;
  };
});

describe('AppHeader', () => {
  it('renders logo image', () => {
    render(<AppHeader activeNavKey="about-saa" />);
    const logo = screen.getAllByRole('img').find(
      (img) => /saa/i.test(img.getAttribute('alt') ?? '') || /logo/i.test(img.getAttribute('alt') ?? '')
    );
    expect(logo).toBeInTheDocument();
  });

  it('renders 3 nav links', () => {
    render(<AppHeader activeNavKey="about-saa" />);
    expect(screen.getAllByText('About SAA 2025').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Awards Information').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Sun* Kudos').length).toBeGreaterThanOrEqual(1);
  });

  it('applies active gold style when activeNavKey matches', () => {
    render(<AppHeader activeNavKey="about-saa" />);
    const activeLinks = screen.getAllByText('About SAA 2025');
    const activeLink = activeLinks[0];
    expect(activeLink).toHaveStyle({ color: 'var(--color-text-gold)' });
  });

  it('renders bell button with correct aria-label', () => {
    render(<AppHeader activeNavKey="about-saa" />);
    const bellButton = screen.getByLabelText('Thông báo');
    expect(bellButton).toBeInTheDocument();
  });

  it('renders avatar button with correct aria-label', () => {
    render(<AppHeader activeNavKey="about-saa" />);
    const avatarButton = screen.getByLabelText('Tài khoản của bạn');
    expect(avatarButton).toBeInTheDocument();
  });

  it('renders LanguageToggle component', () => {
    render(<AppHeader activeNavKey="about-saa" />);
    expect(screen.getByTestId('language-toggle')).toBeInTheDocument();
  });

  it('bell button click does not throw', () => {
    render(<AppHeader activeNavKey="about-saa" />);
    expect(() => {
      fireEvent.click(screen.getByLabelText('Thông báo'));
    }).not.toThrow();
  });

  it('avatar button click does not throw', () => {
    render(<AppHeader activeNavKey="about-saa" />);
    expect(() => {
      fireEvent.click(screen.getByLabelText('Tài khoản của bạn'));
    }).not.toThrow();
  });
});
