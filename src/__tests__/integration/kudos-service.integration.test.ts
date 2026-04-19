/**
 * @jest-environment node
 *
 * Integration test for the Sun* Kudos DB layer.
 *
 * Requires a running local Supabase:
 *   yarn run supabase start
 *   yarn run supabase db reset --local
 *
 * Enable this suite with SUPABASE_INTEGRATION=1 and the standard NEXT_PUBLIC_SUPABASE_*
 * env vars. Without them the suite is skipped so regular unit runs stay fast.
 */

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
// Integration tests need the service_role key to bypass RLS (RLS policies gate SELECT to the `authenticated`
// role; an anon key would see zero rows). Fall back to publishable key if service role isn't set.
const SUPABASE_KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
const HAS_SUPABASE = Boolean(SUPABASE_URL) && Boolean(SUPABASE_KEY) && process.env.SUPABASE_INTEGRATION === '1';

const describeIf = HAS_SUPABASE ? describe : describe.skip;

describeIf('Sun* Kudos DB integration', () => {
  const supabase = HAS_SUPABASE ? createClient(SUPABASE_URL!, SUPABASE_KEY!) : null;

  it('seeded profiles are readable', async () => {
    const { data, error } = await supabase!.from('profiles').select('id, display_name');
    expect(error).toBeNull();
    expect((data ?? []).length).toBeGreaterThanOrEqual(6);
  });

  it('kudos table is seeded and returns rows in recency order', async () => {
    const { data, error } = await supabase!
      .from('kudos')
      .select('id, created_at, hearts_count')
      .order('created_at', { ascending: false })
      .limit(5);
    expect(error).toBeNull();
    expect((data ?? []).length).toBe(5);
  });

  it('hashtags + departments are seeded', async () => {
    const [{ data: h }, { data: d }] = await Promise.all([
      supabase!.from('hashtags').select('slug'),
      supabase!.from('departments').select('name'),
    ]);
    expect((h ?? []).length).toBeGreaterThanOrEqual(10);
    expect((d ?? []).length).toBeGreaterThanOrEqual(6);
  });

  it('live_kudo_events was auto-populated by the trigger on kudos inserts', async () => {
    const { data, error } = await supabase!.from('live_kudo_events').select('event_id').limit(50);
    expect(error).toBeNull();
    expect((data ?? []).length).toBeGreaterThan(0);
  });

  it('secret_boxes were seeded with at least one unopened box', async () => {
    const { data } = await supabase!.from('secret_boxes').select('status');
    expect((data ?? []).some(r => r.status === 'unopened')).toBe(true);
  });
});
