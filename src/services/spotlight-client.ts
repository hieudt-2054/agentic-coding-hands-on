import { createClient } from '@/libs/supabase/client';
import type { SpotlightData, SpotlightEntry } from '@/types/kudos';

export async function fetchKudosSpotlightClient(): Promise<SpotlightData> {
  const supabase = createClient();

  const { count } = await supabase.from('kudos').select('id', { count: 'exact', head: true });

  const { data } = await supabase
    .from('profiles')
    .select('id, display_name, kudos_received_count, updated_at')
    .gt('kudos_received_count', 0)
    .order('kudos_received_count', { ascending: false })
    .limit(400);

  const entries: SpotlightEntry[] = (data ?? []).map(row => ({
    userId: row.id,
    displayName: row.display_name,
    kudosReceivedCount: row.kudos_received_count ?? 0,
    lastKudoAt: row.updated_at,
  }));

  return { totalCount: count ?? 0, entries };
}
