import { createClient } from '@/libs/supabase/server';
import type { Award, KudosInfo, EventConfig } from '@/types/homepage';

export async function fetchAwards(): Promise<Award[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('awards')
    .select('id, slug, title, description, image_url, category')
    .eq('is_active', true)
    .order('display_order', { ascending: true });

  if (error) throw error;
  return (data ?? []).map(row => ({
    id: row.id,
    slug: row.slug,
    title: row.title,
    description: row.description,
    imageUrl: row.image_url,
    category: row.category,
  }));
}

export async function fetchKudos(): Promise<KudosInfo | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('kudos_info')
    .select('label, title, description, detail_url, decoration_image_url')
    .eq('is_active', true)
    .limit(1)
    .single();

  if (error) return null;
  return {
    label: data.label,
    title: data.title,
    description: data.description,
    detailUrl: data.detail_url,
    decorationImageUrl: data.decoration_image_url,
  };
}

export async function fetchEventConfig(): Promise<EventConfig | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('event_config')
    .select('target_datetime, time_display, venue, stream_note, double_heart_active, highlight_limit')
    .eq('is_active', true)
    .limit(1)
    .single();

  if (error) return null;
  return {
    targetDatetime: data.target_datetime,
    time: data.time_display,
    venue: data.venue,
    streamNote: data.stream_note,
    doubleHeartActive: data.double_heart_active ?? false,
    highlightLimit: data.highlight_limit ?? 5,
  };
}
