/**
 * @jest-environment node
 */
import { fetchUserStats } from '@/services/user-stats-service';

jest.mock('@/libs/supabase/server', () => ({
  createClient: jest.fn(),
}));

import { createClient } from '@/libs/supabase/server';

const mockCreateClient = createClient as jest.MockedFunction<typeof createClient>;

describe('fetchUserStats', () => {
  afterEach(() => jest.clearAllMocks());

  it('aggregates profile + secret_box counts + event_config into UserStats', async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const from = jest.fn((table: string): any => {
      if (table === 'profiles') {
        return {
          select: jest.fn().mockReturnThis(),
          eq: jest.fn().mockReturnThis(),
          maybeSingle: jest.fn().mockResolvedValue({
            data: {
              kudos_received_count: 10,
              kudos_sent_count: 6,
              hearts_received_count: 42,
            },
            error: null,
          }),
        };
      }
      if (table === 'secret_boxes') {
        return {
          select: jest.fn().mockReturnThis(),
          eq: jest.fn().mockResolvedValue({
            data: [{ status: 'opened' }, { status: 'unopened' }, { status: 'unopened' }],
            error: null,
          }),
        };
      }
      // event_config
      return {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        maybeSingle: jest.fn().mockResolvedValue({
          data: { double_heart_active: true },
          error: null,
        }),
      };
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    mockCreateClient.mockResolvedValue({ from } as any);

    const stats = await fetchUserStats('user-1');

    expect(stats).toEqual({
      kudosReceived: 10,
      kudosSent: 6,
      heartsReceived: 42,
      secretBoxOpened: 1,
      secretBoxUnopened: 2,
      doubleHeartActive: true,
    });
  });

  it('returns null when profile not found', async () => {
    const from = jest.fn(() => ({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      maybeSingle: jest.fn().mockResolvedValue({ data: null, error: null }),
    }));
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    mockCreateClient.mockResolvedValue({ from } as any);

    const stats = await fetchUserStats('missing');
    expect(stats).toBeNull();
  });
});
