/**
 * @jest-environment node
 */
import { fetchDepartments } from '@/services/departments-service';

jest.mock('@/libs/supabase/server', () => ({
  createClient: jest.fn(),
}));

import { createClient } from '@/libs/supabase/server';

const mockCreateClient = createClient as jest.MockedFunction<typeof createClient>;

describe('fetchDepartments', () => {
  afterEach(() => jest.clearAllMocks());

  it('returns Department[] sorted by name', async () => {
    const rows = [
      { id: '1', name: 'CECV1' },
      { id: '2', name: 'CECV2' },
    ];
    const builder = {
      select: jest.fn().mockReturnThis(),
      order: jest.fn().mockResolvedValue({ data: rows, error: null }),
    };
    mockCreateClient.mockResolvedValue({
      from: jest.fn(() => builder),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any);

    const result = await fetchDepartments();

    expect(result).toEqual(rows);
    expect(builder.order).toHaveBeenCalledWith('name', { ascending: true });
  });
});
