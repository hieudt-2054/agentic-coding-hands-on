/**
 * @jest-environment node
 */
import { signInWithGoogle } from '@/services/auth-service';

// Mock Supabase browser client
jest.mock('@/libs/supabase/client', () => ({
  createClient: jest.fn(),
}));

import { createClient } from '@/libs/supabase/client';

const mockCreateClient = createClient as jest.MockedFunction<typeof createClient>;

const ORIGINAL_ENV = process.env;

describe('signInWithGoogle', () => {
  beforeEach(() => {
    process.env = { ...ORIGINAL_ENV, NEXT_PUBLIC_SITE_URL: 'http://localhost:3000' };
  });

  afterEach(() => {
    process.env = ORIGINAL_ENV;
    jest.clearAllMocks();
  });

  it('calls supabase.auth.signInWithOAuth with google provider', async () => {
    const mockSignIn = jest.fn().mockResolvedValue({ data: {}, error: null });
    mockCreateClient.mockReturnValue({
      auth: { signInWithOAuth: mockSignIn },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
} as any);

    await signInWithGoogle();

    expect(mockSignIn).toHaveBeenCalledWith(
      expect.objectContaining({ provider: 'google' })
    );
  });

  it('passes redirectTo using NEXT_PUBLIC_SITE_URL env variable', async () => {
    const mockSignIn = jest.fn().mockResolvedValue({ data: {}, error: null });
    mockCreateClient.mockReturnValue({
      auth: { signInWithOAuth: mockSignIn },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
} as any);

    await signInWithGoogle();

    expect(mockSignIn).toHaveBeenCalledWith(
      expect.objectContaining({
        options: expect.objectContaining({
          redirectTo: 'http://localhost:3000/auth/callback',
        }),
      })
    );
  });
});
