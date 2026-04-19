import { createClient } from '@/libs/supabase/server';
import type { GiftRecipient } from '@/types/kudos';

export async function fetchTopGiftRecipients(limit = 10): Promise<GiftRecipient[]> {
  const supabase = await createClient();
  type Row = {
    id: string;
    gift_description: string;
    opened_at: string | null;
    owner: { id: string; display_name: string; avatar_url: string | null } | null;
  };

  const { data, error } = await supabase
    .from('secret_boxes')
    .select(`
      id, gift_description, opened_at,
      owner:profiles ( id, display_name, avatar_url )
    `)
    .eq('status', 'opened')
    .order('opened_at', { ascending: false })
    .limit(limit);

  if (error) throw error;

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

// Browser-side RPC wrappers for hearts + gifts live in src/services/gifts-client.ts.
// They are separated to keep next/headers out of the client bundle.
