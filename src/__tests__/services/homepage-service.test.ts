/**
 * @jest-environment node
 */
import { fetchAwards, fetchKudos, fetchEventConfig } from '@/services/homepage-service';

jest.mock('@/libs/supabase/server', () => ({
  createClient: jest.fn(),
}));

import { createClient } from '@/libs/supabase/server';

const mockCreateClient = createClient as jest.MockedFunction<typeof createClient>;

describe('homepage-service', () => {
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

  describe('fetchAwards', () => {
    it('returns Award[] with correct camelCase mapping from snake_case DB columns', async () => {
      const dbRows = [
        {
          id: '1',
          slug: 'best-design',
          title: 'Best Design',
          description: 'Awarded for best design',
          image_url: 'https://example.com/img1.png',
          category: 'design',
        },
        {
          id: '2',
          slug: 'best-code',
          title: 'Best Code',
          description: 'Awarded for best code',
          image_url: 'https://example.com/img2.png',
          category: 'engineering',
        },
      ];

      const mockOrder = jest.fn().mockResolvedValue({ data: dbRows, error: null });
      const mockEq = jest.fn().mockReturnValue({ order: mockOrder });
      const mockSelect = jest.fn().mockReturnValue({ eq: mockEq });
      mockSupabase.from.mockReturnValue({ select: mockSelect });

      const result = await fetchAwards();

      expect(mockSupabase.from).toHaveBeenCalledWith('awards');
      expect(result).toEqual([
        {
          id: '1',
          slug: 'best-design',
          title: 'Best Design',
          description: 'Awarded for best design',
          imageUrl: 'https://example.com/img1.png',
          category: 'design',
        },
        {
          id: '2',
          slug: 'best-code',
          title: 'Best Code',
          description: 'Awarded for best code',
          imageUrl: 'https://example.com/img2.png',
          category: 'engineering',
        },
      ]);
    });

    it('returns empty array on error', async () => {
      const mockOrder = jest.fn().mockResolvedValue({
        data: null,
        error: { message: 'DB error' },
      });
      const mockEq = jest.fn().mockReturnValue({ order: mockOrder });
      const mockSelect = jest.fn().mockReturnValue({ eq: mockEq });
      mockSupabase.from.mockReturnValue({ select: mockSelect });

      await expect(fetchAwards()).rejects.toEqual({ message: 'DB error' });
    });
  });

  describe('fetchKudos', () => {
    it('returns KudosInfo with correct camelCase mapping from snake_case DB columns', async () => {
      const dbRow = {
        label: 'Kudos',
        title: 'Great Work',
        description: 'You did amazing',
        detail_url: 'https://example.com/kudos',
        decoration_image_url: 'https://example.com/decor.png',
      };

      const mockSingle = jest.fn().mockResolvedValue({ data: dbRow, error: null });
      const mockLimit = jest.fn().mockReturnValue({ single: mockSingle });
      const mockEq = jest.fn().mockReturnValue({ limit: mockLimit });
      const mockSelect = jest.fn().mockReturnValue({ eq: mockEq });
      mockSupabase.from.mockReturnValue({ select: mockSelect });

      const result = await fetchKudos();

      expect(mockSupabase.from).toHaveBeenCalledWith('kudos_info');
      expect(result).toEqual({
        label: 'Kudos',
        title: 'Great Work',
        description: 'You did amazing',
        detailUrl: 'https://example.com/kudos',
        decorationImageUrl: 'https://example.com/decor.png',
      });
    });

    it('returns null on error', async () => {
      const mockSingle = jest.fn().mockResolvedValue({
        data: null,
        error: { message: 'Not found' },
      });
      const mockLimit = jest.fn().mockReturnValue({ single: mockSingle });
      const mockEq = jest.fn().mockReturnValue({ limit: mockLimit });
      const mockSelect = jest.fn().mockReturnValue({ eq: mockEq });
      mockSupabase.from.mockReturnValue({ select: mockSelect });

      const result = await fetchKudos();

      expect(result).toBeNull();
    });

    it('returns null when no data is returned', async () => {
      const mockSingle = jest.fn().mockResolvedValue({
        data: null,
        error: { message: 'No rows found', code: 'PGRST116' },
      });
      const mockLimit = jest.fn().mockReturnValue({ single: mockSingle });
      const mockEq = jest.fn().mockReturnValue({ limit: mockLimit });
      const mockSelect = jest.fn().mockReturnValue({ eq: mockEq });
      mockSupabase.from.mockReturnValue({ select: mockSelect });

      const result = await fetchKudos();

      expect(result).toBeNull();
    });
  });

  describe('fetchEventConfig', () => {
    it('returns EventConfig with correct camelCase mapping from snake_case DB columns', async () => {
      const dbRow = {
        target_datetime: '2026-05-01T18:00:00Z',
        time_display: '18:00 - 21:00',
        venue: 'Grand Hall',
        stream_note: 'Live on YouTube',
        double_heart_active: true,
        highlight_limit: 7,
      };

      const mockSingle = jest.fn().mockResolvedValue({ data: dbRow, error: null });
      const mockLimit = jest.fn().mockReturnValue({ single: mockSingle });
      const mockEq = jest.fn().mockReturnValue({ limit: mockLimit });
      const mockSelect = jest.fn().mockReturnValue({ eq: mockEq });
      mockSupabase.from.mockReturnValue({ select: mockSelect });

      const result = await fetchEventConfig();

      expect(mockSupabase.from).toHaveBeenCalledWith('event_config');
      expect(result).toEqual({
        targetDatetime: '2026-05-01T18:00:00Z',
        time: '18:00 - 21:00',
        venue: 'Grand Hall',
        streamNote: 'Live on YouTube',
        doubleHeartActive: true,
        highlightLimit: 7,
      });
    });

    it('returns null on error', async () => {
      const mockSingle = jest.fn().mockResolvedValue({
        data: null,
        error: { message: 'DB error' },
      });
      const mockLimit = jest.fn().mockReturnValue({ single: mockSingle });
      const mockEq = jest.fn().mockReturnValue({ limit: mockLimit });
      const mockSelect = jest.fn().mockReturnValue({ eq: mockEq });
      mockSupabase.from.mockReturnValue({ select: mockSelect });

      const result = await fetchEventConfig();

      expect(result).toBeNull();
    });
  });
});
