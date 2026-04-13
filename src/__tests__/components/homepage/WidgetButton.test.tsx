import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import WidgetButton from '@/components/homepage/WidgetButton';

describe('WidgetButton', () => {
  it('has fixed position styling', () => {
    render(<WidgetButton />);
    const button = screen.getByLabelText('Quick actions');
    expect(button).toHaveStyle({ position: 'fixed' });
  });

  it('contains pencil icon', () => {
    render(<WidgetButton />);
    const pencilIcon = screen.getByAltText(/pencil/i);
    expect(pencilIcon).toBeInTheDocument();
  });

  it('contains "/" text', () => {
    render(<WidgetButton />);
    expect(screen.getByText('/')).toBeInTheDocument();
  });

  it('contains SAA icon', () => {
    render(<WidgetButton />);
    const saaIcon = screen.getByAltText(/saa/i);
    expect(saaIcon).toBeInTheDocument();
  });

  it('has accessible aria-label', () => {
    render(<WidgetButton />);
    expect(screen.getByLabelText('Quick actions')).toBeInTheDocument();
  });

  it('onClick fires without error', () => {
    render(<WidgetButton />);
    expect(() => {
      fireEvent.click(screen.getByLabelText('Quick actions'));
    }).not.toThrow();
  });
});
