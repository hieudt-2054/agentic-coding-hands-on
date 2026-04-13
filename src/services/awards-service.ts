import { createClient } from '@/libs/supabase/server';
import type { AwardFull } from '@/types/awards';

export async function fetchAwardsFull(): Promise<AwardFull[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('awards')
    .select('id, slug, title, description, image_url, category, quantity, unit_type, prize_value')
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
    quantity: row.quantity,
    unitType: row.unit_type,
    prizeValue: row.prize_value,
  }));
}
