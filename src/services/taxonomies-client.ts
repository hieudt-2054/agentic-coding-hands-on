import { createClient } from '@/libs/supabase/client';
import type { Department, Hashtag } from '@/types/kudos';

export async function fetchHashtagsClient(): Promise<Hashtag[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('hashtags')
    .select('id, slug, label')
    .order('label', { ascending: true });
  if (error) throw error;
  return (data ?? []).map(r => ({ id: r.id, slug: r.slug, label: r.label }));
}

export async function fetchDepartmentsClient(): Promise<Department[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('departments')
    .select('id, name')
    .order('name', { ascending: true });
  if (error) throw error;
  return (data ?? []).map(r => ({ id: r.id, name: r.name }));
}
