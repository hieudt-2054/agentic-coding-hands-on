/**
 * @jest-environment node
 */
import { fetchTopGiftRecipients } from '@/services/gifts-service';

jest.mock('@/libs/supabase/server', () => ({
  createClient: jest.fn(),
}));

import { createClient as createServerClient } from '@/libs/supabase/server';

const mockServer = createServerClient as jest.MockedFunction<typeof createServerClient>;

describe('gifts-service (server reads)', () => {
  afterEach(() => jest.clearAllMocks());

  describe('fetchTopGiftRecipients', () => {
    it('maps to GiftRecipient[] and filters rows without owner', async () => {
      const rows = [
        {
          id: 'b1',
          gift_description: 'Áo phông SAA',
          opened_at: '2026-04-19T10:00:00Z',
          owner: { id: 'u1', display_name: 'User One', avatar_url: null },
        },
        {
          id: 'b2',
          gift_description: 'Voucher',
          opened_at: '2026-04-18T12:00:00Z',
          owner: null,
        },
      ];
      const builder = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        order: jest.fn().mockReturnThis(),
        limit: jest.fn().mockResolvedValue({ data: rows, error: null }),
      };
      mockServer.mockResolvedValue({
        from: jest.fn(() => builder),
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any);

      const result = await fetchTopGiftRecipients(10);

      expect(result).toEqual([
        {
          userId: 'u1',
          displayName: 'User One',
          avatarUrl: null,
          giftDescription: 'Áo phông SAA',
          openedAt: '2026-04-19T10:00:00Z',
        },
      ]);
    });
  });
});
