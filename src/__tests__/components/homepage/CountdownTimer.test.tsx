import React from 'react';
import { render, screen } from '@testing-library/react';
import CountdownTimer from '@/components/homepage/CountdownTimer';
import vi from '@/i18n/dictionaries/vi';

jest.mock('@/i18n/use-translation', () => ({
  useTranslation: () => ({ t: (key: string) => (vi as Record<string, string>)[key] || key, locale: 'vi' }),
}));

jest.mock('@/hooks/use-countdown', () => ({
  useCountdown: jest.fn(),
}));

import { useCountdown } from '@/hooks/use-countdown';

const mockUseCountdown = useCountdown as jest.MockedFunction<typeof useCountdown>;

describe('CountdownTimer', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders 3 CountdownUnits', () => {
    mockUseCountdown.mockReturnValue({
      days: 10,
      hours: 5,
      minutes: 30,
      isExpired: false,
    });

    render(<CountdownTimer targetDatetime="2026-12-31T00:00:00Z" />);
    expect(screen.getByText('10')).toBeInTheDocument();
    expect(screen.getByText('05')).toBeInTheDocument();
    expect(screen.getByText('30')).toBeInTheDocument();
  });

  it('shows "Coming soon" when not expired', () => {
    mockUseCountdown.mockReturnValue({
      days: 10,
      hours: 5,
      minutes: 30,
      isExpired: false,
    });

    render(<CountdownTimer targetDatetime="2026-12-31T00:00:00Z" />);
    expect(screen.getByText('Coming soon')).toBeInTheDocument();
  });

  it('hides "Coming soon" when expired', () => {
    mockUseCountdown.mockReturnValue({
      days: 0,
      hours: 0,
      minutes: 0,
      isExpired: true,
    });

    render(<CountdownTimer targetDatetime="2026-12-31T00:00:00Z" />);
    expect(screen.queryByText('Coming soon')).not.toBeInTheDocument();
  });

  it('renders day, hour, and minute labels', () => {
    mockUseCountdown.mockReturnValue({
      days: 1,
      hours: 2,
      minutes: 3,
      isExpired: false,
    });

    render(<CountdownTimer targetDatetime="2026-12-31T00:00:00Z" />);
    expect(screen.getByText('DAYS')).toBeInTheDocument();
    expect(screen.getByText('HOURS')).toBeInTheDocument();
    expect(screen.getByText('MINUTES')).toBeInTheDocument();
  });
});
