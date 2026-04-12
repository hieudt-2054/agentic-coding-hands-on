import { NextResponse, type NextRequest } from 'next/server';
import { createClient } from '@/libs/supabase/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');

  if (!code) {
    return NextResponse.redirect(
      new URL('/auth/login?error=auth_error', request.url)
    );
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    return NextResponse.redirect(
      new URL('/auth/login?error=auth_error', request.url)
    );
  }

  return NextResponse.redirect(new URL('/', request.url));
}
