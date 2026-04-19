import { createClient } from '@/libs/supabase/server';
import type { UserStats } from '@/types/kudos';

export async function fetchUserStats(userId: string): Promise<UserStats | null> {
  const supabase = await createClient();

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('kudos_received_count, kudos_sent_count, hearts_received_count')
    .eq('id', userId)
    .maybeSingle();
  if (profileError) throw profileError;
  if (!profile) return null;

  const { data: boxes, error: boxesError } = await supabase
    .from('secret_boxes')
    .select('status')
    .eq('owner_id', userId);
  if (boxesError) throw boxesError;

  const opened = (boxes ?? []).filter(b => b.status === 'opened').length;
  const unopened = (boxes ?? []).filter(b => b.status === 'unopened').length;

  const { data: eventConfig } = await supabase
    .from('event_config')
    .select('double_heart_active')
    .eq('is_active', true)
    .limit(1)
    .maybeSingle();

  return {
    kudosReceived: profile.kudos_received_count ?? 0,
    kudosSent: profile.kudos_sent_count ?? 0,
    heartsReceived: profile.hearts_received_count ?? 0,
    secretBoxOpened: opened,
    secretBoxUnopened: unopened,
    doubleHeartActive: eventConfig?.double_heart_active ?? false,
  };
}
