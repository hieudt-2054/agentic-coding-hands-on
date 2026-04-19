/**
 * @jest-environment node
 */
import { fetchHashtags } from '@/services/hashtags-service';

jest.mock('@/libs/supabase/server', () => ({
  createClient: jest.fn(),
}));

import { createClient } from '@/libs/supabase/server';

const mockCreateClient = createClient as jest.MockedFunction<typeof createClient>;

describe('fetchHashtags', () => {
  afterEach(() => jest.clearAllMocks());

  it('returns Hashtag[] sorted by label', async () => {
    const rows = [
      { id: '1', slug: 'dedicated', label: '#Dedicated' },
      { id: '2', slug: 'inspring', label: '#Inspring' },
    ];
    const builder = {
      select: jest.fn().mockReturnThis(),
      order: jest.fn().mockResolvedValue({ data: rows, error: null }),
    };
    mockCreateClient.mockResolvedValue({
      from: jest.fn(() => builder),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any);

    const result = await fetchHashtags();

    expect(result).toEqual([
      { id: '1', slug: 'dedicated', label: '#Dedicated' },
      { id: '2', slug: 'inspring', label: '#Inspring' },
    ]);
    expect(builder.select).toHaveBeenCalledWith('id, slug, label');
    expect(builder.order).toHaveBeenCalledWith('label', { ascending: true });
  });

  it('throws on Supabase error', async () => {
    const builder = {
      select: jest.fn().mockReturnThis(),
      order: jest.fn().mockResolvedValue({ data: null, error: new Error('boom') }),
    };
    mockCreateClient.mockResolvedValue({
      from: jest.fn(() => builder),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any);

    await expect(fetchHashtags()).rejects.toThrow('boom');
  });
});
