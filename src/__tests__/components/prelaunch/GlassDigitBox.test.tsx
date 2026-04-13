import React from 'react';
import { render, screen } from '@testing-library/react';
import GlassDigitBox from '@/components/prelaunch/GlassDigitBox';

describe('GlassDigitBox', () => {
  it('renders the digit character', () => {
    render(<GlassDigitBox digit="5" />);
    expect(screen.getByText('5')).toBeInTheDocument();
  });

  it('renders zero digit', () => {
    render(<GlassDigitBox digit="0" />);
    expect(screen.getByText('0')).toBeInTheDocument();
  });

  it('has glass-morphism border radius', () => {
    const { container } = render(<GlassDigitBox digit="3" />);
    const box = container.firstChild as HTMLElement;
    expect(box.style.borderRadius).toBe('var(--radius-prelaunch-digit)');
  });

  it('has gold border', () => {
    const { container } = render(<GlassDigitBox digit="7" />);
    const box = container.firstChild as HTMLElement;
    // The border CSS variable is applied via the prelaunch-digit-box class
    // which gets its border from globals.css. jsdom cannot parse CSS variable
    // shorthands in inline styles, so we verify the class is present.
    expect(box.className).toContain('prelaunch-digit-box');
  });
});
