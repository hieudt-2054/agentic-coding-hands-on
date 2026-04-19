import { createClient } from '@/libs/supabase/client';
import type { HeartToggleResult, OpenGiftResult } from '@/types/kudos';

export async function toggleKudoHeart(kudoId: string): Promise<HeartToggleResult> {
  const supabase = createClient();
  const { data, error } = await supabase.rpc('toggle_kudo_heart', { p_kudo_id: kudoId });
  if (error) {
    const message = error.message;
    const code = (error as { code?: string }).code;
    if (message?.includes('rate_limited')) throw new Error('rate_limited');
    if (message?.includes('cannot_heart_own_kudo')) throw new Error('cannot_heart_own_kudo');
    throw new Error(`toggle_kudo_heart_failed:${code ?? 'unknown'}`);
  }
  if (!data || typeof data !== 'object') {
    throw new Error('toggle_kudo_heart_bad_response');
  }
  const payload = data as { liked: boolean; count: number };
  return { liked: payload.liked, count: payload.count };
}

export async function openSecretBox(boxId: string): Promise<OpenGiftResult> {
  const supabase = createClient();
  const { data, error } = await supabase.rpc('open_secret_box', { p_box_id: boxId });
  if (error) {
    if (error.message?.includes('box_already_opened')) throw new Error('box_already_opened');
    if (error.message?.includes('not_box_owner')) throw new Error('not_box_owner');
    throw new Error(`open_secret_box_failed:${(error as { code?: string }).code ?? 'unknown'}`);
  }
  const payload = data as { gift_description: string; stats: { opened: number; unopened: number } };
  return { giftDescription: payload.gift_description, stats: payload.stats };
}
