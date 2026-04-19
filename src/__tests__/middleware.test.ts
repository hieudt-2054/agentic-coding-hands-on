/**
 * @jest-environment node
 */
import { NextRequest } from 'next/server';

jest.mock('@/libs/supabase/middleware', () => ({
  createClient: jest.fn(),
}));

import { middleware } from '@/middleware';
import { createClient } from '@/libs/supabase/middleware';

const mockCreateClient = createClient as jest.MockedFunction<typeof createClient>;

function makeRequest(url: string): NextRequest {
  return new NextRequest(new Request(url));
}

describe('middleware', () => {
  afterEach(() => jest.clearAllMocks());

  it('redirects unauthenticated /kudos to /auth/login', async () => {
    mockCreateClient.mockReturnValue({
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      supabase: { auth: { getUser: jest.fn().mockResolvedValue({ data: { user: null } }) } } as any,
      supabaseResponse: new Response(null, { status: 200 }),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any);

    const res = await middleware(makeRequest('http://localhost:3000/kudos'));
    expect(res.headers.get('location')).toBe('http://localhost:3000/auth/login');
  });

  it('redirects unauthenticated /users/{id} to /auth/login', async () => {
    mockCreateClient.mockReturnValue({
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      supabase: { auth: { getUser: jest.fn().mockResolvedValue({ data: { user: null } }) } } as any,
      supabaseResponse: new Response(null, { status: 200 }),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any);

    const res = await middleware(makeRequest('http://localhost:3000/users/abc'));
    expect(res.headers.get('location')).toBe('http://localhost:3000/auth/login');
  });

  it('falls through for authenticated /kudos', async () => {
    const response = new Response(null, { status: 200 });
    mockCreateClient.mockReturnValue({
      supabase: {
        auth: {
          getUser: jest.fn().mockResolvedValue({ data: { user: { id: 'u1' } } }),
        },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any,
      supabaseResponse: response,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any);

    const res = await middleware(makeRequest('http://localhost:3000/kudos'));
    expect(res).toBe(response);
  });
});
