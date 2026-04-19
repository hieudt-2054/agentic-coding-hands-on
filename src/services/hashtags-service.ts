import { createClient } from '@/libs/supabase/server';
import type { Hashtag } from '@/types/kudos';

export async function fetchHashtags(): Promise<Hashtag[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('hashtags')
    .select('id, slug, label')
    .order('label', { ascending: true });
  if (error) throw error;
  return (data ?? []).map(row => ({ id: row.id, slug: row.slug, label: row.label }));
}
