import { NextResponse } from 'next/server';
import { createClient } from '@/libs/supabase/server';
import { ComposeKudoSchema } from '@/validation/kudos-compose';
import { sanitizeKudoHtml } from '@/libs/html-sanitiser';

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'invalid_json' }, { status: 400 });
  }

  const parsed = ComposeKudoSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'validation_error', details: parsed.error.issues },
      { status: 400 }
    );
  }

  const { receiverId, danhHieu, contentHtml, hashtags, images, isAnonymous } = parsed.data;
  const safeHtml = sanitizeKudoHtml(contentHtml);

  const supabase = await createClient();

  const { data, error } = await supabase.rpc('create_kudo', {
    p_receiver_id: receiverId,
    p_danh_hieu: danhHieu,
    p_content_html: safeHtml,
    p_hashtag_slugs: hashtags,
    p_image_urls: images.map(img => ({ url: img.url, path: img.path, position: img.position })),
    p_is_anonymous: isAnonymous,
  });

  if (error) {
    const msg = error.message ?? '';
    if (msg.includes('rate_limited')) {
      return NextResponse.json({ error: 'rate_limited' }, { status: 429 });
    }
    if (msg.includes('duplicate')) {
      return NextResponse.json({ error: 'duplicate' }, { status: 409 });
    }
    if (msg.includes('invalid_receiver')) {
      return NextResponse.json({ error: 'invalid_receiver' }, { status: 422 });
    }
    return NextResponse.json({ error: 'server_error', details: msg }, { status: 500 });
  }

  const result = data as { id: string; created_at: string } | null;
  return NextResponse.json(
    { id: result?.id ?? '', created_at: result?.created_at ?? new Date().toISOString() },
    { status: 201 }
  );
}
