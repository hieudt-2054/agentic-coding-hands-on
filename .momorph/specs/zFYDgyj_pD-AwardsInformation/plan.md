# Implementation Plan: Awards Information (Hệ thống giải thưởng SAA 2025)

**Frame**: `zFYDgyj_pD-AwardsInformation`
**Date**: 2026-04-13
**Spec**: `specs/zFYDgyj_pD-AwardsInformation/spec.md`

---

## Summary

Implement the Awards Information page (`/awards`) — a detail view of all 6 SAA 2025 award categories. Features a two-column layout with sticky sidebar navigation (scroll spy), stacked award detail cards (image LEFT + content RIGHT), hash anchor support for deep-linking from Homepage, and a reused Sun* Kudos promotional section.

**Key work items**:
1. **Database migration** — extend `awards` table with 3 new columns (`quantity`, `unit_type`, `prize_value`)
2. **Extended service** — update `fetchAwards()` to return new fields + create `fetchAwardsFull()` variant
3. **New page + components** — 2-column layout, sidebar with scroll spy, award detail cards, hero keyvisual
4. **Middleware update** — add `/awards` to protected routes
5. **Reuse** — KudosSection, AppHeader, AppFooter from Homepage SAA

---

## Technical Context

**Language/Framework**: TypeScript / Next.js 15 (App Router)
**Primary Dependencies**: React 19, TailwindCSS v4, `next/image`, `next/link`, Supabase
**Database**: Extend existing `awards` table (add 3 columns) — migration required
**Testing**: Jest 29, `@testing-library/react`
**State Management**: Server-fetched data (awards, kudos) + client-side scroll spy state (`IntersectionObserver`)
**Route**: `/awards` — protected route (authenticated only)

---

## Constitution Compliance Check

- [x] Follows project coding conventions (kebab-case modules, PascalCase components, 2-space indent, single quotes)
- [x] Uses approved libraries and patterns (Next.js App Router, React 19, TailwindCSS v4, Supabase)
- [x] Adheres to folder structure guidelines (`src/components/awards/`, `src/app/awards/`)
- [x] Meets security requirements (protected route via middleware, RLS on tables)
- [x] Follows testing standards (TDD)

**Violations**: Same as Homepage SAA — inline styles with CSS variables instead of Tailwind utilities (Constitution II). Established codebase pattern; see Homepage SAA plan for justification.

---

## Database Changes

### Migration: Extend `awards` table

Add 3 new columns to the existing `awards` table:

```sql
-- supabase/migrations/20260413100000_extend_awards_table.sql

ALTER TABLE public.awards
  ADD COLUMN quantity integer NOT NULL DEFAULT 1,
  ADD COLUMN unit_type text NOT NULL DEFAULT 'Cá nhân',
  ADD COLUMN prize_value text NOT NULL DEFAULT '';
  
COMMENT ON COLUMN public.awards.quantity IS 'Number of awards in this category';
COMMENT ON COLUMN public.awards.unit_type IS 'Unit type: Đơn vị, Tập thể, or Cá nhân';
COMMENT ON COLUMN public.awards.prize_value IS 'Prize value text (e.g. 7.000.000 VNĐ)';
```

### Update seed data

```sql
-- Update existing seed rows with award details
UPDATE public.awards SET quantity = 10, unit_type = 'Đơn vị', prize_value = '7.000.000 VNĐ' WHERE slug = 'top-talent';
UPDATE public.awards SET quantity = 2, unit_type = 'Tập thể', prize_value = '15.000.000 VNĐ' WHERE slug = 'top-project';
UPDATE public.awards SET quantity = 3, unit_type = 'Cá nhân', prize_value = '7.000.000 VNĐ' WHERE slug = 'top-project-leader';
UPDATE public.awards SET quantity = 1, unit_type = 'Cá nhân', prize_value = '10.000.000 VNĐ' WHERE slug = 'best-manager';
UPDATE public.awards SET quantity = 1, unit_type = 'Cá nhân / Tập thể', prize_value = '5.000.000 (cá nhân) / 8.000.000 VNĐ (tập thể)' WHERE slug = 'signature-creator';
UPDATE public.awards SET quantity = 1, unit_type = 'Cá nhân', prize_value = '15.000.000 VNĐ' WHERE slug = 'mvp';
```

### Re-generate TypeScript types

After migration: `npx supabase gen types typescript --local > src/types/supabase.ts`

---

## Architecture Decisions

### Frontend Approach

- **Component Structure**: Feature-based — awards page components in `src/components/awards/`.
- **Page layout**: `src/app/awards/page.tsx` is a **Server Component** that fetches all data and passes to child components.
- **Two-column layout**: Flex-row with sticky sidebar (left, 200px) and scrollable content (right, flex:1). Gap: 238px (desktop).
- **Scroll spy**: `AwardsSidebar` is a **Client Component** (`'use client'`) that uses `IntersectionObserver` to track which award section is in the viewport and highlights the corresponding nav item.
- **Hash anchor**: On page load, read `window.location.hash` in the sidebar client component and scroll to the target section with `element.scrollIntoView({ behavior: 'smooth' })`. Each award card has `id={award.slug}` and `scroll-margin-top: 96px` (header height + breathing room).
- **Award detail card**: **Horizontal layout** (`flex-row`) — image (336x336px) on LEFT, content block on RIGHT. This is different from the Homepage vertical cards.
- **Reuse**: `KudosSection` component from Homepage SAA (already implemented). `AppHeader` and `AppFooter` from shared layout.

### Backend Approach

- **Extend existing service**: Add `fetchAwardsFull()` function in `homepage-service.ts` (or create `awards-service.ts`) that selects all fields including `quantity`, `unit_type`, `prize_value`.
- Keep existing `fetchAwards()` unchanged (Homepage still uses the slim version).
- **No new API routes** — Server Component calls service directly.

### Service Layer

```typescript
// New function in src/services/awards-service.ts
export interface AwardFull extends Award {
  quantity: number;
  unitType: string;
  prizeValue: string;
}

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
```

### Middleware Update

Add `/awards` to `PROTECTED_ROUTES` in `src/middleware.ts`:

```typescript
const PROTECTED_ROUTES = ['/', '/awards'];
```

This ensures unauthenticated users are redirected to `/auth/login`.

---

## Project Structure

### New Files

| File | Purpose | Type |
|------|---------|------|
| `supabase/migrations/20260413100000_extend_awards_table.sql` | Extend awards with quantity, unit_type, prize_value | SQL Migration |
| `src/types/awards.ts` | `AwardFull` interface (extends Award) | Types |
| `src/services/awards-service.ts` | `fetchAwardsFull()` — Supabase query with all fields | Service |
| `src/app/awards/page.tsx` | Awards Information page Server Component | Server Component |
| `src/components/awards/AwardsHeroKeyvisual.tsx` | Hero banner (1200x871 cover image) | Server Component |
| `src/components/awards/AwardsSectionTitle.tsx` | Section title ("Hệ thống giải thưởng SAA 2025") | Server Component |
| `src/components/awards/AwardsLayout.tsx` | Two-column flex-row container (sidebar + content) | Server Component |
| `src/components/awards/AwardsSidebar.tsx` | Sticky sidebar nav with scroll spy (IntersectionObserver) | Client Component (`'use client'`) |
| `src/components/awards/SidebarNavItem.tsx` | Individual sidebar nav item (active/normal/hover states) | Presentational |
| `src/components/awards/AwardDetailCard.tsx` | Horizontal award card: image LEFT + content RIGHT | Server Component |
| `src/components/awards/AwardMetaRow.tsx` | Metadata row: label + value (quantity, prize) | Presentational |

### Modified Files

| File | What Changes |
|------|-------------|
| `src/app/globals.css` | Add awards-page-specific CSS tokens (sidebar width, two-col gap, card stack gap) + responsive overrides + sidebar hover/active CSS |
| `src/middleware.ts` | Add `/awards` to `PROTECTED_ROUTES` array |
| `supabase/seeds/dev/homepage-seed.sql` | Add UPDATE statements for quantity/unit_type/prize_value seed data |
| `src/components/homepage/AwardCard.tsx` | Update href from `#${slug}` to `/awards#${slug}` — awards page is now live |
| `src/components/homepage/CTAButtons.tsx` | Update "ABOUT AWARDS" href from `#` to `/awards` |

### Unchanged (reused as-is)

| File | Why reused |
|------|-----------|
| `src/components/homepage/KudosSection.tsx` | Sun* Kudos promotional card — identical component |
| `src/components/layout/AppHeader.tsx` | Shared header (will show "Awards Information" as active nav) |
| `src/components/layout/AppFooter.tsx` | Shared footer |
| `src/services/homepage-service.ts` | `fetchKudos()` reused for Kudos section |
| `src/hooks/use-countdown.ts` | Not needed on this page |

### Test Files

| File | Tests for |
|------|----------|
| `src/__tests__/services/awards-service.test.ts` | fetchAwardsFull() mapping + error handling |
| `src/__tests__/components/awards/AwardDetailCard.test.tsx` | Horizontal layout, image, title, description, metadata |
| `src/__tests__/components/awards/AwardsSidebar.test.tsx` | Renders 6 nav items, active state, click handler |
| `src/__tests__/components/awards/SidebarNavItem.test.tsx` | Active/normal rendering, click callback |
| `src/__tests__/components/awards/AwardMetaRow.test.tsx` | Label + value rendering |

### Dependencies

No new `package.json` dependencies. `IntersectionObserver` is a native browser API.

---

## Implementation Strategy

### Phase 0: Database + Assets

**Goal**: Schema extended, seed data updated, hero keyvisual asset downloaded.

1. Create migration `20260413100000_extend_awards_table.sql` — ALTER TABLE add 3 columns
2. Update seed file with quantity/unit_type/prize_value for all 6 awards
3. Run `supabase db reset` to apply
4. Re-generate TypeScript types: `npx supabase gen types typescript --local > src/types/supabase.ts`
5. Download **Awards hero keyvisual** from Figma via `get_figma_image` (node `313:8437`) — this is a DIFFERENT image from the Homepage keyvisual (1200x871px SAA 2025 artwork) → save to `public/assets/awards/images/awards-hero.png`
6. Update middleware: add `/awards` to PROTECTED_ROUTES

### Phase 1: Foundation — Types, Service, CSS Tokens

**Goal**: Shared infrastructure ready.

1. Create `src/types/awards.ts` with `AwardFull` interface
2. Create `src/services/awards-service.ts` with `fetchAwardsFull()`
3. Add awards-page CSS tokens to `globals.css`:
   - `--spacing-sidebar-width: 200px`
   - `--spacing-two-col-gap: 238px`
   - `--spacing-card-stack-gap: 80px`
   - `--spacing-card-inner-gap: 24px`
   - `--spacing-meta-gap: 16px`
   - `--border-sidebar-active: 2px solid #FFEA9E`
   - Sidebar nav hover/active/focus CSS classes
   - Responsive overrides (mobile: single-col + horizontal chips; tablet: narrower gap)
4. TDD: Write service tests → confirm FAIL → implement → confirm PASS

### Phase 2: Core Features — US1 (Award Detail Cards)

**Goal**: Award cards render with full detail in horizontal layout.

**TDD order**:
1. `AwardMetaRow.test.tsx` → `AwardMetaRow.tsx` — label + value row
2. `AwardDetailCard.test.tsx` → `AwardDetailCard.tsx` — horizontal card (image left, content right with title, description, metadata rows). Props: `{ award: AwardFull }`. Has `id={award.slug}` for hash anchor + `scroll-margin-top: 96px`
3. `AwardsHeroKeyvisual.tsx` — hero banner (no test needed, layout only)
4. `AwardsSectionTitle.tsx` — section title (no test needed, layout only)
5. Wire `src/app/awards/page.tsx` as Server Component:
   - Call `fetchAwardsFull()` and `fetchKudos()` with try/catch (empty array/null on error)
   - Pass `activeNavKey="awards"` to `<AppHeader>`
   - Render hero + title + stacked cards (single column initially, no sidebar yet)
   - If `awards.length === 0`: render empty state "Chưa có dữ liệu giải thưởng"
   - Award descriptions render **full text** (NO truncation — unlike Homepage 2-line clamp)

### Phase 3: Core Features — US2 (Sidebar Navigation + Scroll Spy)

**Goal**: Sticky sidebar, click-to-scroll, scroll spy highlights active item, hash anchor on load.

**TDD order**:
1. `SidebarNavItem.test.tsx` → `SidebarNavItem.tsx` — renders label, active/normal states, onClick callback
2. `AwardsSidebar.test.tsx` → `AwardsSidebar.tsx` (`'use client'`) — renders 6 items, IntersectionObserver scroll spy, hash anchor on mount, click scrolls to section
3. `AwardsLayout.tsx` — two-column flex-row container wrapping sidebar + content
4. Update `page.tsx` with `<AwardsLayout>` containing sidebar + cards

**IntersectionObserver scroll spy approach**:
```typescript
useEffect(() => {
  const sections = slugs.map(slug => document.getElementById(slug));
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setActiveSlug(entry.target.id);
        }
      });
    },
    { rootMargin: '-96px 0px -60% 0px' }
  );
  sections.forEach(s => s && observer.observe(s));
  return () => observer.disconnect();
}, [slugs]);
```

### Phase 4: Extended Features — US3 (Kudos Section)

**Goal**: Sun* Kudos section at bottom of page.

1. Reuse existing `KudosSection` component from Homepage
2. Fetch kudos data via existing `fetchKudos()` service
3. Add to `page.tsx` below the awards layout

### Phase 5: Polish

1. Responsive CSS: mobile sidebar → horizontal scrollable chips, single-column cards, smaller images (240px)
2. Accessibility: `<nav aria-label="Danh mục giải thưởng">`, `aria-current="true"` on active sidebar item, focus rings
3. Performance: hero image `priority`, award images lazy-load
4. Hash anchor test: verify `#top-talent` scrolls correctly with header offset
5. AppHeader active state: `activeNavKey="awards"` already passed in page.tsx (Phase 2)
6. **Update Homepage links**: Change `AwardCard` href from `#${slug}` → `/awards#${slug}`, and `CTAButtons` "ABOUT AWARDS" href from `#` → `/awards`. Run Homepage tests to confirm no regressions

---

## Risk Assessment

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| IntersectionObserver scroll spy flickers between items | Medium | Medium | Tune `rootMargin` values; debounce state updates |
| Hash anchor scroll doesn't account for header | Low | High | Use `scroll-margin-top: 96px` on each card section |
| Migration breaks existing Homepage fetchAwards() | Low | High | New columns have defaults; existing query doesn't select them, so backward compatible |
| Large page (6410px) affects performance | Low | Medium | Lazy-load below-fold award images; only hero image is priority |
| Mobile sidebar chips overflow | Low | Low | `overflow-x: auto` with `white-space: nowrap` handles gracefully |

### Estimated Complexity

- **Frontend**: Medium (7 new components, 1 client component with IntersectionObserver, 2-column layout)
- **Backend**: Low (1 migration, 1 new service function, seed update)
- **Testing**: Medium (5 test files)

---

## Integration Testing Strategy

### Mocking Strategy

| Dependency Type | Strategy | Rationale |
|-----------------|----------|-----------|
| `@/libs/supabase/server` | `jest.mock` returning controlled data | Service unit tests |
| `IntersectionObserver` | Mock in test setup | Not available in jsdom |
| `next/navigation` | Mock `useRouter` | Test hash anchor handling |
| `window.location.hash` | Set directly in test | Test initial scroll |

### Coverage Goals

| Area | Target | Priority |
|------|--------|----------|
| AwardDetailCard | 90%+ | High |
| AwardsSidebar (scroll spy) | 80%+ | High |
| awards-service | 80%+ | High |
| SidebarNavItem + AwardMetaRow | 90%+ | Medium |

---

## Dependencies & Prerequisites

### Required Before Start

- [x] `constitution.md` reviewed
- [x] `spec.md` approved and reviewed
- [x] `design-style.md` complete and reviewed
- [x] `awards` table exists (from Homepage SAA)
- [x] `fetchKudos()` service exists (for Kudos section)
- [x] `KudosSection` component exists (reused)
- [x] `AppHeader` / `AppFooter` exist (reused)
- [ ] Local Supabase running for migration

---

## Next Steps

1. **Run** `/momorph.tasks` to generate task breakdown
2. **Begin** with Phase 0 (DB migration + middleware) → Phase 1 (foundation) → Phase 2-4 (features) → Phase 5 (polish)
3. Estimated ~25-30 tasks total

---

## Notes

- The `fetchAwards()` in `homepage-service.ts` is NOT modified — Homepage continues using the slim version. A new `fetchAwardsFull()` in a separate `awards-service.ts` handles the extended fields.
- Award detail cards use **horizontal layout** (`flex-row`: image LEFT, content RIGHT) — different from Homepage vertical cards. These are separate components, not shared.
- The `KudosSection` component is reused as-is from Homepage. It's already in `src/components/homepage/KudosSection.tsx`. The awards page imports it directly (cross-module import, acceptable at current project scale).
- Hash anchors from Homepage (`<AwardCard>` links to `#${slug}`) now point to real sections on this page. Update Homepage `AwardCard` href from `#${slug}` to `/awards#${slug}` once this page is live.
- The sidebar navigation uses `border-left: 2px solid #FFEA9E` for the active indicator (not underline — per design-style.md SidebarNavItem states).
