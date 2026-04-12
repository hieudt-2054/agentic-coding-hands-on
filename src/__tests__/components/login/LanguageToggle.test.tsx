import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import LanguageToggle from '@/components/login/LanguageToggle';

describe('LanguageToggle', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('renders VN flag image and "VN" text', () => {
    render(<LanguageToggle />);
    expect(screen.getByAltText(/vietnam flag/i)).toBeInTheDocument();
    expect(screen.getByText('VN')).toBeInTheDocument();
  });

  it('opens dropdown when clicked', () => {
    render(<LanguageToggle />);
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole('button'));
    expect(screen.getByRole('listbox')).toBeInTheDocument();
  });

  it('closes dropdown on outside click', () => {
    render(<LanguageToggle />);
    fireEvent.click(screen.getByRole('button'));
    expect(screen.getByRole('listbox')).toBeInTheDocument();

    fireEvent.mouseDown(document.body);
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('chevron has aria-label indicating open/closed state', () => {
    render(<LanguageToggle />);
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('aria-expanded', 'false');
    fireEvent.click(button);
    expect(button).toHaveAttribute('aria-expanded', 'true');
  });

  it('selecting a language updates display and closes dropdown', () => {
    render(<LanguageToggle />);
    fireEvent.click(screen.getByRole('button'));
    fireEvent.click(screen.getByRole('option', { name: /english/i }));

    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    expect(screen.getByText('EN')).toBeInTheDocument();
  });

  it('selecting a language saves to localStorage', () => {
    render(<LanguageToggle />);
    fireEvent.click(screen.getByRole('button'));
    fireEvent.click(screen.getByRole('option', { name: /english/i }));

    expect(localStorage.getItem('lang')).toBe('en');
  });
});
