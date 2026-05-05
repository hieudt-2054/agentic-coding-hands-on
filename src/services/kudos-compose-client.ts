import type { ComposeKudoForm, ComposeKudoResult } from '@/types/compose-kudo';

export class KudosComposeError extends Error {
  constructor(
    public readonly code: string,
    message: string
  ) {
    super(message);
    this.name = 'KudosComposeError';
  }
}

export async function createKudo(form: ComposeKudoForm): Promise<ComposeKudoResult> {
  const response = await fetch('/api/kudos', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      receiverId: form.receiverId,
      danhHieu: form.danhHieu,
      contentHtml: form.contentHtml,
      hashtags: form.hashtags,
      images: form.images
        .filter(img => img.status === 'done' && img.url && img.path)
        .map(img => ({ url: img.url!, path: img.path!, position: img.position })),
      isAnonymous: form.isAnonymous,
    }),
  });

  if (response.ok) {
    const data = await response.json() as { id: string; created_at: string };
    return { id: data.id, createdAt: data.created_at };
  }

  let errorCode = 'network';
  try {
    const err = await response.json() as { error?: string };
    errorCode = err.error ?? 'network';
  } catch {
    // ignore parse errors
  }

  switch (response.status) {
    case 400:
      throw new KudosComposeError('validation_error', 'Dữ liệu không hợp lệ');
    case 409:
      throw new KudosComposeError('duplicate', 'Bạn đã gửi kudo này rồi');
    case 422:
      throw new KudosComposeError('invalid_receiver', 'Người nhận không hợp lệ');
    case 429:
      throw new KudosComposeError('rate_limited', 'Bạn gửi kudo quá nhiều, vui lòng thử lại sau');
    default:
      throw new KudosComposeError(errorCode, 'Có lỗi xảy ra, vui lòng thử lại');
  }
}
