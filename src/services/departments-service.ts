import { createClient } from '@/libs/supabase/server';
import type { Department } from '@/types/kudos';

export async function fetchDepartments(): Promise<Department[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('departments')
    .select('id, name')
    .order('name', { ascending: true });
  if (error) throw error;
  return (data ?? []).map(row => ({ id: row.id, name: row.name }));
}
