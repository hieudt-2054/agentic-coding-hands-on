import { createClient } from '@/libs/supabase/client';

export async function signInWithGoogle(): Promise<void> {
  const supabase = createClient();
  const redirectTo = `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`;

  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo },
  });

  if (error) {
    throw new Error(error.message);
  }
}
