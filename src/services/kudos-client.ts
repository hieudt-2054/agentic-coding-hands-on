import { createClient } from '@/libs/supabase/client';
import type {
  DanhHieu,
  Highlight,
  HoaThiLevel,
  KudoCard,
  KudoFilter,
  KudoImage,
  KudosFeedPage,
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
  return {
    id: row.id,
    displayName: row.display_name,
    avatarUrl: row.avatar_url,
    departmentName: row.department?.name ?? null,
    hoaThiLevel: level,
    danhHieu: (row.danh_hieu ?? 'New Hero') as DanhHieu,
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

  return {
    id: row.id,
    sender: toSunner(row.sender),
    receiver: toSunner(row.receiver),
    content: row.content,
    createdAt: row.created_at,
    heartsCount: row.hearts_count,
    likedByMe: viewerId ? (row.kudo_hearts ?? []).some(h => h?.user_id === viewerId) : false,
    hashtags,
    images,
    department: row.department ? { id: row.department.id, name: row.department.name } : null,
  };
}

async function resolveHashtagFilter(
  supabase: ReturnType<typeof createClient>,
  hashtagSlug: string | undefined
): Promise<string[] | null> {
  if (!hashtagSlug) return null;
  const { data: hashRows } = await supabase
    .from('kudo_hashtags')
    .select('kudo_id, hashtag:hashtags(slug)')
    .eq('hashtag.slug', hashtagSlug);
  return (hashRows ?? []).map(r => r.kudo_id);
}

async function getViewerId(supabase: ReturnType<typeof createClient>): Promise<string | null> {
  const { data } = await supabase.auth.getUser();
  return data.user?.id ?? null;
}

export async function fetchKudosHighlightsClient(filter: KudoFilter = {}): Promise<Highlight[]> {
  const supabase = createClient();
  const viewerId = await getViewerId(supabase);

  const { data: limitRow } = await supabase
    .from('event_config')
    .select('highlight_limit')
    .eq('is_active', true)
    .limit(1)
    .maybeSingle();
  const limit = limitRow?.highlight_limit ?? 5;

  const hashtagIds = await resolveHashtagFilter(supabase, filter.hashtag);
  if (hashtagIds !== null && hashtagIds.length === 0) return [];

  let query = supabase
    .from('kudos')
    .select(KUDO_SELECT)
    .order('hearts_count', { ascending: false })
    .limit(limit);
  if (filter.department) query = query.eq('department_id', filter.department);
  if (hashtagIds) query = query.in('id', hashtagIds);

  const { data, error } = await query;
  if (error) throw error;
  return (data ?? []).map(row => toKudoCard(row as unknown as KudoRow, viewerId));
}

export async function fetchKudosFeedClient(params: {
  filter?: KudoFilter;
  cursor?: string | null;
  limit?: number;
}): Promise<KudosFeedPage> {
  const { filter = {}, cursor = null, limit = 10 } = params;
  const supabase = createClient();
  const viewerId = await getViewerId(supabase);

  const hashtagIds = await resolveHashtagFilter(supabase, filter.hashtag);
  if (hashtagIds !== null && hashtagIds.length === 0) return { items: [], nextCursor: null };

  let query = supabase
    .from('kudos')
    .select(KUDO_SELECT)
    .order('created_at', { ascending: false })
    .limit(limit);
  if (cursor) query = query.lt('created_at', cursor);
  if (filter.department) query = query.eq('department_id', filter.department);
  if (hashtagIds) query = query.in('id', hashtagIds);

  const { data, error } = await query;
  if (error) throw error;
  const items = (data ?? []).map(row => toKudoCard(row as unknown as KudoRow, viewerId));
  const nextCursor = items.length === limit ? items[items.length - 1].createdAt : null;
  return { items, nextCursor };
}
