import React from 'react';
import { render, screen } from '@testing-library/react';
import CountdownUnit from '@/components/homepage/CountdownUnit';

describe('CountdownUnit', () => {
  it('renders zero-padded digit value', () => {
    render(<CountdownUnit value={5} label="Days" />);
    expect(screen.getByText('05')).toBeInTheDocument();
  });

  it('renders label text', () => {
    render(<CountdownUnit value={5} label="Days" />);
    expect(screen.getByText('Days')).toBeInTheDocument();
  });

  it('renders two-digit value without extra padding', () => {
    render(<CountdownUnit value={12} label="Hours" />);
    expect(screen.getByText('12')).toBeInTheDocument();
  });

  it('renders zero as "00"', () => {
    render(<CountdownUnit value={0} label="Minutes" />);
    expect(screen.getByText('00')).toBeInTheDocument();
  });
});
