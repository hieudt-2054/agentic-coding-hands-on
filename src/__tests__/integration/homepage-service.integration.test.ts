/**
 * @jest-environment node
 *
 * Integration tests for homepage-service against real local Supabase.
 * Prerequisites: `supabase start` must be running with seed data (`supabase db reset`).
 *
 * These tests satisfy Constitution III.5: "Unit tests MUST NOT mock the database —
 * use real Supabase instances or test containers to prevent mock/prod divergence."
 *
 * Run separately: npx jest --forceExit src/__tests__/integration/
 */

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'http://127.0.0.1:54321';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || '';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SECRET_KEY || '';

// Skip integration tests if no local Supabase credentials available
const hasCredentials = SUPABASE_ANON_KEY.length > 0 && SUPABASE_SERVICE_KEY.length > 0;

const describeIfCredentials = hasCredentials ? describe : describe.skip;

describeIfCredentials('homepage-service integration (real Supabase)', () => {
  const serviceClient = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

  describe('awards table', () => {
    it('returns 6 seeded awards ordered by display_order', async () => {
      const { data, error } = await serviceClient
        .from('awards')
        .select('id, slug, title, description, image_url, category, display_order')
        .eq('is_active', true)
        .order('display_order', { ascending: true });

      expect(error).toBeNull();
      expect(data).toHaveLength(6);
      expect(data![0].slug).toBe('top-talent');
      expect(data![0].display_order).toBe(1);
      expect(data![5].slug).toBe('mvp');
      expect(data![5].display_order).toBe(6);
    });

    it('filters out is_active=false rows', async () => {
      // Deactivate one award
      await serviceClient
        .from('awards')
        .update({ is_active: false })
        .eq('slug', 'mvp');

      const { data } = await serviceClient
        .from('awards')
        .select('slug')
        .eq('is_active', true);

      expect(data).toHaveLength(5);
      expect(data!.find((a) => a.slug === 'mvp')).toBeUndefined();

      // Restore
      await serviceClient
        .from('awards')
        .update({ is_active: true })
        .eq('slug', 'mvp');
    });
  });

  describe('kudos_info table', () => {
    it('returns active kudos info with correct fields', async () => {
      const { data, error } = await serviceClient
        .from('kudos_info')
        .select('label, title, description, detail_url, decoration_image_url')
        .eq('is_active', true)
        .limit(1)
        .single();

      expect(error).toBeNull();
      expect(data!.title).toBe('Sun* Kudos');
      expect(data!.label).toBe('Phong trào ghi nhận');
      expect(data!.detail_url).toBeDefined();
    });

    it('returns null-like result when no active rows', async () => {
      await serviceClient
        .from('kudos_info')
        .update({ is_active: false })
        .eq('title', 'Sun* Kudos');

      const { data, error } = await serviceClient
        .from('kudos_info')
        .select('label')
        .eq('is_active', true)
        .limit(1)
        .single();

      // single() returns error when no rows found
      expect(data).toBeNull();
      expect(error).not.toBeNull();

      // Restore
      await serviceClient
        .from('kudos_info')
        .update({ is_active: true })
        .eq('title', 'Sun* Kudos');
    });
  });

  describe('event_config table', () => {
    it('returns active event config', async () => {
      const { data, error } = await serviceClient
        .from('event_config')
        .select('target_datetime, time_display, venue, stream_note')
        .eq('is_active', true)
        .limit(1)
        .single();

      expect(error).toBeNull();
      expect(data!.venue).toBe('Nhà hát Lớn Hà Nội');
      expect(data!.time_display).toBe('18h30');
      expect(data!.stream_note).toBe('Tường thuật trực tiếp tại website');
    });
  });

  describe('RLS enforcement', () => {
    it('anon client cannot read awards without authentication', async () => {
      const anonClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

      const { data } = await anonClient
        .from('awards')
        .select('slug');

      // RLS blocks anon — returns empty array (not error, just no rows)
      expect(data).toEqual([]);
    });
  });
});
