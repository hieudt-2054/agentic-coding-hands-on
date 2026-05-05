import { createClient } from '@/libs/supabase/server';
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

export async function fetchProfileById(id: string): Promise<SunnerRef | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('profiles')
    .select(PROFILE_SELECT)
    .eq('id', id)
    .maybeSingle();

  if (error || !data) return null;
  return toSunnerRef(data as unknown as ProfileRow);
}
