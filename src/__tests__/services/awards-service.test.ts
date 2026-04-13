/**
 * @jest-environment node
 */
import { fetchAwardsFull } from '@/services/awards-service';

jest.mock('@/libs/supabase/server', () => ({
  createClient: jest.fn(),
}));

import { createClient } from '@/libs/supabase/server';

const mockCreateClient = createClient as jest.MockedFunction<typeof createClient>;

describe('awards-service', () => {
  let mockSupabase: {
    from: jest.Mock;
  };

  beforeEach(() => {
    mockSupabase = {
      from: jest.fn(),
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    mockCreateClient.mockResolvedValue(mockSupabase as any);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('fetchAwardsFull', () => {
    it('returns AwardFull[] with correct camelCase mapping from snake_case DB columns', async () => {
      const dbRows = [
        {
          id: '1',
          slug: 'best-design',
          title: 'Best Design',
          description: 'Awarded for best design',
          image_url: 'https://example.com/img1.png',
          category: 'design',
          quantity: 1,
          unit_type: 'giải',
          prize_value: '10,000,000 VND',
        },
        {
          id: '2',
          slug: 'best-code',
          title: 'Best Code',
          description: 'Awarded for best code',
          image_url: 'https://example.com/img2.png',
          category: 'engineering',
          quantity: 3,
          unit_type: 'giải',
          prize_value: '5,000,000 VND',
        },
      ];

      const mockOrder = jest.fn().mockResolvedValue({ data: dbRows, error: null });
      const mockEq = jest.fn().mockReturnValue({ order: mockOrder });
      const mockSelect = jest.fn().mockReturnValue({ eq: mockEq });
      mockSupabase.from.mockReturnValue({ select: mockSelect });

      const result = await fetchAwardsFull();

      expect(mockSupabase.from).toHaveBeenCalledWith('awards');
      expect(result).toEqual([
        {
          id: '1',
          slug: 'best-design',
          title: 'Best Design',
          description: 'Awarded for best design',
          imageUrl: 'https://example.com/img1.png',
          category: 'design',
          quantity: 1,
          unitType: 'giải',
          prizeValue: '10,000,000 VND',
        },
        {
          id: '2',
          slug: 'best-code',
          title: 'Best Code',
          description: 'Awarded for best code',
          imageUrl: 'https://example.com/img2.png',
          category: 'engineering',
          quantity: 3,
          unitType: 'giải',
          prizeValue: '5,000,000 VND',
        },
      ]);
    });

    it('returns ordered by display_order', async () => {
      const dbRows = [
        {
          id: '1',
          slug: 'first',
          title: 'First',
          description: 'First award',
          image_url: 'https://example.com/img1.png',
          category: 'cat1',
          quantity: 1,
          unit_type: 'giải',
          prize_value: '1,000,000 VND',
        },
        {
          id: '2',
          slug: 'second',
          title: 'Second',
          description: 'Second award',
          image_url: 'https://example.com/img2.png',
          category: 'cat2',
          quantity: 2,
          unit_type: 'giải',
          prize_value: '2,000,000 VND',
        },
      ];

      const mockOrder = jest.fn().mockResolvedValue({ data: dbRows, error: null });
      const mockEq = jest.fn().mockReturnValue({ order: mockOrder });
      const mockSelect = jest.fn().mockReturnValue({ eq: mockEq });
      mockSupabase.from.mockReturnValue({ select: mockSelect });

      const result = await fetchAwardsFull();

      expect(mockOrder).toHaveBeenCalledWith('display_order', { ascending: true });
      expect(result[0].slug).toBe('first');
      expect(result[1].slug).toBe('second');
    });

    it('throws on error', async () => {
      const mockOrder = jest.fn().mockResolvedValue({
        data: null,
        error: { message: 'DB error' },
      });
      const mockEq = jest.fn().mockReturnValue({ order: mockOrder });
      const mockSelect = jest.fn().mockReturnValue({ eq: mockEq });
      mockSupabase.from.mockReturnValue({ select: mockSelect });

      await expect(fetchAwardsFull()).rejects.toEqual({ message: 'DB error' });
    });
  });
});
