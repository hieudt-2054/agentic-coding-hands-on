/**
 * @jest-environment node
 */
import { GET } from '@/app/auth/callback/route';
import { NextRequest } from 'next/server';

// Mock Supabase server client
jest.mock('@/libs/supabase/server', () => ({
  createClient: jest.fn(),
}));

import { createClient } from '@/libs/supabase/server';

const mockCreateClient = createClient as jest.MockedFunction<typeof createClient>;

function makeRequest(url: string) {
  return new NextRequest(url);
}

describe('GET /auth/callback', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('redirects to / on successful code exchange', async () => {
    mockCreateClient.mockResolvedValue({
      auth: {
        exchangeCodeForSession: jest.fn().mockResolvedValue({ error: null }),
      },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
} as any);

    const request = makeRequest('http://localhost:3000/auth/callback?code=valid_code');
    const response = await GET(request);

    expect(response.status).toBe(307);
    expect(response.headers.get('location')).toBe('http://localhost:3000/');
  });

  it('redirects to /auth/login?error=auth_error on failed exchange', async () => {
    mockCreateClient.mockResolvedValue({
      auth: {
        exchangeCodeForSession: jest.fn().mockResolvedValue({
          error: { message: 'Exchange failed' },
        }),
      },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
} as any);

    const request = makeRequest('http://localhost:3000/auth/callback?code=bad_code');
    const response = await GET(request);

    expect(response.status).toBe(307);
    expect(response.headers.get('location')).toBe(
      'http://localhost:3000/auth/login?error=auth_error'
    );
  });

  it('redirects to /auth/login?error=auth_error if no code in query params', async () => {
    const request = makeRequest('http://localhost:3000/auth/callback');
    const response = await GET(request);

    expect(response.status).toBe(307);
    expect(response.headers.get('location')).toBe(
      'http://localhost:3000/auth/login?error=auth_error'
    );
  });
});
