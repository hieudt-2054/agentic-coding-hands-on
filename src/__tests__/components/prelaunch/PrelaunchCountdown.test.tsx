import React from 'react';
import { render, screen } from '@testing-library/react';
import PrelaunchCountdown from '@/components/prelaunch/PrelaunchCountdown';

// Mock use-countdown
jest.mock('@/hooks/use-countdown', () => ({
  useCountdown: jest.fn(),
}));

// Mock next/navigation
const mockPush = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
}));

// Mock supabase client
jest.mock('@/libs/supabase/client', () => ({
  createClient: jest.fn(),
}));

import { useCountdown } from '@/hooks/use-countdown';
import { createClient } from '@/libs/supabase/client';

const mockUseCountdown = useCountdown as jest.MockedFunction<typeof useCountdown>;
const mockCreateClient = createClient as jest.MockedFunction<typeof createClient>;

describe('PrelaunchCountdown', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseCountdown.mockReturnValue({ days: 5, hours: 12, minutes: 30, isExpired: false });
    mockCreateClient.mockReturnValue({
      auth: { getUser: jest.fn().mockResolvedValue({ data: { user: null } }) },
    } as any);
  });

  it('renders heading text', () => {
    render(<PrelaunchCountdown targetDatetime="2025-12-05T18:30:00+07:00" />);
    expect(screen.getByText('Sự kiện sẽ bắt đầu sau')).toBeInTheDocument();
  });

  it('renders 6 digit boxes (2 per unit)', () => {
    render(<PrelaunchCountdown targetDatetime="2025-12-05T18:30:00+07:00" />);
    // Days=05 → "0","5", Hours=12 → "1","2", Minutes=30 → "3","0"
    expect(screen.getByText('DAYS')).toBeInTheDocument();
    expect(screen.getByText('HOURS')).toBeInTheDocument();
    expect(screen.getByText('MINUTES')).toBeInTheDocument();
  });

  it('splits single digit values with zero padding', () => {
    mockUseCountdown.mockReturnValue({ days: 3, hours: 0, minutes: 9, isExpired: false });
    render(<PrelaunchCountdown targetDatetime="2025-12-05T18:30:00+07:00" />);
    // Days=03 → boxes show "0" and "3"
    const allZeros = screen.getAllByText('0');
    expect(allZeros.length).toBeGreaterThanOrEqual(3); // at least 3 zeros: days-tens, hours-tens, hours-ones, minutes-tens
  });

  it('renders all zeros when expired', () => {
    mockUseCountdown.mockReturnValue({ days: 0, hours: 0, minutes: 0, isExpired: true });
    render(<PrelaunchCountdown targetDatetime="2025-12-05T18:30:00+07:00" />);
    const allZeros = screen.getAllByText('0');
    expect(allZeros.length).toBe(6); // all 6 digit boxes show "0"
  });

  it('redirects to / when expired and user is authenticated', async () => {
    mockUseCountdown.mockReturnValue({ days: 0, hours: 0, minutes: 0, isExpired: true });
    mockCreateClient.mockReturnValue({
      auth: { getUser: jest.fn().mockResolvedValue({ data: { user: { id: '123' } } }) },
    } as any);

    render(<PrelaunchCountdown targetDatetime="2025-12-05T18:30:00+07:00" />);

    await new Promise((r) => setTimeout(r, 50));
    expect(mockPush).toHaveBeenCalledWith('/');
  });

  it('redirects to /auth/login when expired and user is NOT authenticated', async () => {
    mockUseCountdown.mockReturnValue({ days: 0, hours: 0, minutes: 0, isExpired: true });
    mockCreateClient.mockReturnValue({
      auth: { getUser: jest.fn().mockResolvedValue({ data: { user: null } }) },
    } as any);

    render(<PrelaunchCountdown targetDatetime="2025-12-05T18:30:00+07:00" />);

    await new Promise((r) => setTimeout(r, 50));
    expect(mockPush).toHaveBeenCalledWith('/auth/login');
  });
});
