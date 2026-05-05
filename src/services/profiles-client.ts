import { createClient } from '@/libs/supabase/client';
import type { SunnerRef } from '@/types/kudos';

type ProfileRow = {
  id: string;
  display_name: string;
  avatar_url: string | null;
  hoa_thi_level: number;
  danh_hieu: string;
  department: { name: string } | null;
};

const PROFILE_SELECT = 'id, display_name, avatar_url, hoa_thi_level, danh_hieu, department:departments(name)';

function toSunnerRef(row: ProfileRow): SunnerRef {
  return {
    id: row.id,
    displayName: row.display_name,
    avatarUrl: row.avatar_url,
    departmentName: row.department?.name ?? null,
    hoaThiLevel: Math.min(3, Math.max(0, row.hoa_thi_level ?? 0)) as SunnerRef['hoaThiLevel'],
    danhHieu: (row.danh_hieu ?? 'New Hero') as SunnerRef['danhHieu'],
  };
}

export async function searchProfilesClient(
  q: string,
  opts?: { excludeSelf?: boolean }
): Promise<SunnerRef[]> {
  const supabase = createClient();

  let uid: string | null = null;
  if (opts?.excludeSelf) {
    const { data } = await supabase.auth.getUser();
    uid = data.user?.id ?? null;
  }

  let query = supabase
    .from('profiles')
    .select(PROFILE_SELECT)
    .ilike('display_name', `%${q}%`)
    .order('kudos_received_count', { ascending: false })
    .order('display_name', { ascending: true })
    .limit(10);

  if (uid) {
    query = query.neq('id', uid);
  }

  const { data, error } = await query;
  if (error) throw error;
  return (data ?? []).map(row => toSunnerRef(row as unknown as ProfileRow));
}

export async function fetchProfileByIdClient(id: string): Promise<SunnerRef | null> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('profiles')
    .select(PROFILE_SELECT)
    .eq('id', id)
    .maybeSingle();

  if (error || !data) return null;
  return toSunnerRef(data as unknown as ProfileRow);
}
