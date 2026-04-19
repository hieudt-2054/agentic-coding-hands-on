import { createClient } from '@/libs/supabase/client';
import type { GiftRecipient, UserStats } from '@/types/kudos';

export async function fetchUserStatsClient(): Promise<UserStats | null> {
  const supabase = createClient();
  const { data: userData } = await supabase.auth.getUser();
  const userId = userData.user?.id;
  if (!userId) return null;

  const { data: profile } = await supabase
    .from('profiles')
    .select('kudos_received_count, kudos_sent_count, hearts_received_count')
    .eq('id', userId)
    .maybeSingle();
  if (!profile) return null;

  const { data: boxes } = await supabase
    .from('secret_boxes')
    .select('status')
    .eq('owner_id', userId);

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

type Row = {
  gift_description: string;
  opened_at: string | null;
  owner: { id: string; display_name: string; avatar_url: string | null } | null;
};

export async function fetchTopGiftRecipientsClient(limit = 10): Promise<GiftRecipient[]> {
  const supabase = createClient();
  const { data } = await supabase
    .from('secret_boxes')
    .select(`
      gift_description, opened_at,
      owner:profiles ( id, display_name, avatar_url )
    `)
    .eq('status', 'opened')
    .order('opened_at', { ascending: false })
    .limit(limit);

  return ((data ?? []) as unknown as Row[])
    .filter((row): row is Row & { owner: NonNullable<Row['owner']> } => row.owner !== null)
    .map(row => ({
      userId: row.owner.id,
      displayName: row.owner.display_name,
      avatarUrl: row.owner.avatar_url,
      giftDescription: row.gift_description,
      openedAt: row.opened_at ?? '',
    }));
}

export async function fetchUnopenedSecretBox(): Promise<string | null> {
  const supabase = createClient();
  const { data: userData } = await supabase.auth.getUser();
  const userId = userData.user?.id;
  if (!userId) return null;
  const { data } = await supabase
    .from('secret_boxes')
    .select('id')
    .eq('owner_id', userId)
    .eq('status', 'unopened')
    .order('created_at', { ascending: true })
    .limit(1)
    .maybeSingle();
  return data?.id ?? null;
}
