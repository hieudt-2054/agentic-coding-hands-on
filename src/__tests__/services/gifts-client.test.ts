/**
 * @jest-environment node
 */
import { toggleKudoHeart, openSecretBox } from '@/services/gifts-client';

jest.mock('@/libs/supabase/client', () => ({
  createClient: jest.fn(),
}));

import { createClient } from '@/libs/supabase/client';

const mockBrowser = createClient as jest.MockedFunction<typeof createClient>;

describe('gifts-client (RPC wrappers)', () => {
  afterEach(() => jest.clearAllMocks());

  describe('toggleKudoHeart', () => {
    it('returns { liked, count } from the RPC payload', async () => {
      const rpc = jest.fn().mockResolvedValue({ data: { liked: true, count: 5 }, error: null });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      mockBrowser.mockReturnValue({ rpc } as any);

      const r = await toggleKudoHeart('kudo-1');

      expect(rpc).toHaveBeenCalledWith('toggle_kudo_heart', { p_kudo_id: 'kudo-1' });
      expect(r).toEqual({ liked: true, count: 5 });
    });

    it('surfaces rate_limited error', async () => {
      const rpc = jest.fn().mockResolvedValue({
        data: null,
        error: { message: 'rate_limited', code: 'P0001' },
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      mockBrowser.mockReturnValue({ rpc } as any);

      await expect(toggleKudoHeart('k1')).rejects.toThrow('rate_limited');
    });

    it('surfaces cannot_heart_own_kudo', async () => {
      const rpc = jest.fn().mockResolvedValue({
        data: null,
        error: { message: 'cannot_heart_own_kudo', code: 'P0001' },
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      mockBrowser.mockReturnValue({ rpc } as any);

      await expect(toggleKudoHeart('k1')).rejects.toThrow('cannot_heart_own_kudo');
    });
  });

  describe('openSecretBox', () => {
    it('returns giftDescription + stats', async () => {
      const rpc = jest.fn().mockResolvedValue({
        data: { gift_description: 'Sổ tay', stats: { opened: 2, unopened: 1 } },
        error: null,
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      mockBrowser.mockReturnValue({ rpc } as any);

      const r = await openSecretBox('box-1');
      expect(r).toEqual({ giftDescription: 'Sổ tay', stats: { opened: 2, unopened: 1 } });
    });

    it('surfaces box_already_opened', async () => {
      const rpc = jest.fn().mockResolvedValue({
        data: null,
        error: { message: 'box_already_opened', code: 'P0001' },
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      mockBrowser.mockReturnValue({ rpc } as any);

      await expect(openSecretBox('b1')).rejects.toThrow('box_already_opened');
    });
  });
});
