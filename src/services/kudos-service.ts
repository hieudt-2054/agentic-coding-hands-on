import { createClient } from '@/libs/supabase/server';
import type {
  DanhHieu,
  Highlight,
  HoaThiLevel,
  KudoCard,
  KudoFilter,
  KudoImage,
  KudosFeedPage,
  SpotlightData,
  SpotlightEntry,
  SunnerRef,
} from '@/types/kudos';

type ProfileRow = {
  id: string;
  display_name: string;
  avatar_url: string | null;
  hoa_thi_level: number;
  danh_hieu: string;
  department: { name: string } | null;
};

type KudoRow = {
  id: string;
  content: string;
  created_at: string;
  hearts_count: number;
  sender: ProfileRow | null;
  receiver: ProfileRow | null;
  department: { id: string; name: string } | null;
  kudo_hashtags: Array<{ hashtag: { id: string; slug: string; label: string } | null } | null>;
  kudo_images: Array<{ url: string; position: number } | null>;
  kudo_hearts: Array<{ user_id: string } | null>;
};

const PROFILE_SELECT = `
  id, display_name, avatar_url, hoa_thi_level, danh_hieu,
  department:departments ( name )
`;

const KUDO_SELECT = `
  id, content, created_at, hearts_count,
  sender:profiles!kudos_sender_id_fkey ( ${PROFILE_SELECT} ),
  receiver:profiles!kudos_receiver_id_fkey ( ${PROFILE_SELECT} ),
  department:departments ( id, name ),
  kudo_hashtags ( hashtag:hashtags ( id, slug, label ) ),
  kudo_images ( url, position ),
  kudo_hearts ( user_id )
`;

const EMPTY_SUNNER: SunnerRef = {
  id: 'unknown',
  displayName: 'Unknown',
  avatarUrl: null,
  departmentName: null,
  hoaThiLevel: 0,
  danhHieu: 'New Hero',
};

function toSunner(row: ProfileRow | null | undefined): SunnerRef {
  if (!row) return EMPTY_SUNNER;
  const level = Math.min(3, Math.max(0, row.hoa_thi_level ?? 0)) as HoaThiLevel;
  const danhHieu = (row.danh_hieu ?? 'New Hero') as DanhHieu;
  return {
    id: row.id,
    displayName: row.display_name,
    avatarUrl: row.avatar_url,
    departmentName: row.department?.name ?? null,
    hoaThiLevel: level,
    danhHieu,
  };
}

function toKudoCard(row: KudoRow, viewerId: string | null): KudoCard {
  const images: KudoImage[] = (row.kudo_images ?? [])
    .filter((i): i is { url: string; position: number } => !!i)
    .sort((a, b) => a.position - b.position)
    .map(i => ({ url: i.url, position: i.position }));

  const hashtags = (row.kudo_hashtags ?? [])
    .map(rel => rel?.hashtag)
    .filter((h): h is { id: string; slug: string; label: string } => !!h);

  const likedByMe = viewerId
    ? (row.kudo_hearts ?? []).some(h => h?.user_id === viewerId)
    : false;

  return {
    id: row.id,
    sender: toSunner(row.sender),
    receiver: toSunner(row.receiver),
    content: row.content,
    createdAt: row.created_at,
    heartsCount: row.hearts_count,
    likedByMe,
    hashtags,
    images,
    department: row.department ? { id: row.department.id, name: row.department.name } : null,
  };
}

async function getViewerId(supabase: Awaited<ReturnType<typeof createClient>>): Promise<string | null> {
  const { data } = await supabase.auth.getUser();
  return data.user?.id ?? null;
}

function applyFilter<T>(
  query: T extends { eq(...args: unknown[]): T } ? T : never,
  filter: KudoFilter
): T {
  let q = query as unknown as { eq(col: string, val: string): T };
  if (filter.department) q = q.eq('department_id', filter.department) as unknown as typeof q;
  return q as unknown as T;
}

export async function fetchKudosHighlights(filter: KudoFilter = {}): Promise<Highlight[]> {
  const supabase = await createClient();
  const viewerId = await getViewerId(supabase);

  const { data: limitRow } = await supabase
    .from('event_config')
    .select('highlight_limit')
    .eq('is_active', true)
    .limit(1)
    .maybeSingle();
  const limit = limitRow?.highlight_limit ?? 5;

  let query = supabase
    .from('kudos')
    .select(KUDO_SELECT)
    .order('hearts_count', { ascending: false })
    .limit(limit);

  query = applyFilter(query, filter);
  if (filter.hashtag) {
    const { data: hashRows } = await supabase
      .from('kudo_hashtags')
      .select('kudo_id, hashtag:hashtags(slug)')
      .eq('hashtag.slug', filter.hashtag);
    const kudoIds = (hashRows ?? []).map(r => r.kudo_id);
    if (kudoIds.length === 0) return [];
    query = query.in('id', kudoIds);
  }

  const { data, error } = await query;
  if (error) throw error;
  return (data ?? []).map(row => toKudoCard(row as unknown as KudoRow, viewerId));
}

export async function fetchKudosFeed(params: {
  filter?: KudoFilter;
  cursor?: string | null;
  limit?: number;
}): Promise<KudosFeedPage> {
  const { filter = {}, cursor = null, limit = 10 } = params;
  const supabase = await createClient();
  const viewerId = await getViewerId(supabase);

  let query = supabase
    .from('kudos')
    .select(KUDO_SELECT)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (cursor) query = query.lt('created_at', cursor);
  query = applyFilter(query, filter);
  if (filter.hashtag) {
    const { data: hashRows } = await supabase
      .from('kudo_hashtags')
      .select('kudo_id, hashtag:hashtags(slug)')
      .eq('hashtag.slug', filter.hashtag);
    const kudoIds = (hashRows ?? []).map(r => r.kudo_id);
    if (kudoIds.length === 0) return { items: [], nextCursor: null };
    query = query.in('id', kudoIds);
  }

  const { data, error } = await query;
  if (error) throw error;
  const items = (data ?? []).map(row => toKudoCard(row as unknown as KudoRow, viewerId));
  const nextCursor = items.length === limit ? items[items.length - 1].createdAt : null;

  return { items, nextCursor };
}

export async function fetchKudoById(id: string): Promise<KudoCard | null> {
  const supabase = await createClient();
  const viewerId = await getViewerId(supabase);

  const { data, error } = await supabase
    .from('kudos')
    .select(KUDO_SELECT)
    .eq('id', id)
    .maybeSingle();

  if (error || !data) return null;
  return toKudoCard(data as unknown as KudoRow, viewerId);
}

export async function fetchKudosSpotlight(): Promise<SpotlightData> {
  const supabase = await createClient();

  const { count } = await supabase
    .from('kudos')
    .select('id', { count: 'exact', head: true });

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
