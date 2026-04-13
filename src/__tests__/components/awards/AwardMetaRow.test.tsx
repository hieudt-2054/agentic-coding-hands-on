import React from 'react';
import { render, screen } from '@testing-library/react';
import AwardMetaRow from '@/components/awards/AwardMetaRow';

describe('AwardMetaRow', () => {
  it('renders label text', () => {
    render(<AwardMetaRow label="Quantity:" value="03 prizes" />);
    expect(screen.getByText('Quantity:')).toBeInTheDocument();
  });

  it('renders value text', () => {
    render(<AwardMetaRow label="Prize value:" value="10,000,000 VND" />);
    expect(screen.getByText('10,000,000 VND')).toBeInTheDocument();
  });

  it('renders label in white and value in gold', () => {
    render(<AwardMetaRow label="Label" value="Value" />);
    const label = screen.getByText('Label');
    const value = screen.getByText('Value');
    expect(label).toHaveStyle({ color: 'var(--color-text-primary)' });
    expect(value).toHaveStyle({ color: 'var(--color-text-gold)' });
  });
});
