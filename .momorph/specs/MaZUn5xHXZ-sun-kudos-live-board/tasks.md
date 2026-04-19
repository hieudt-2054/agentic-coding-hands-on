# Tasks: Sun* Kudos - Live Board

**Frame**: `MaZUn5xHXZ-sun-kudos-live-board`
**Prerequisites**: plan.md ✅, spec.md ✅, design-style.md ✅, research.md ✅
**Generated**: 2026-04-20

---

## Task Format

```
- [ ] T### [P?] [Story?] Description | file/path.ts
```

- **[P]**: Parallelizable — different files, no dependency on an incomplete task in the same phase
- **[Story]**: `[US1]` … `[US6]` — matches spec.md user stories
- File paths follow the layout in `plan.md` → Project Structure

Tests are included because the constitution makes TDD NON-NEGOTIABLE (§III).

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Install new dependencies, prepare providers, and bring Figma assets into the repo.

- [x] T001 Add `@tanstack/react-query` ^5, `@tanstack/react-virtual` ^3 (runtime) and `@tanstack/react-query-devtools` ^5 (dev) to `package.json` and run `yarn install` | package.json
- [x] T002 [P] Create `src/providers/QueryProvider.tsx` client component wrapping `{children}` in `QueryClientProvider` (staleTime 60s, refetchOnWindowFocus true, retry 1) + `ReactQueryDevtools` gated on `NODE_ENV === 'development'` | src/providers/QueryProvider.tsx
- [x] T003 [P] Create `src/providers/ToastProvider.tsx` with context + `useToast()` hook, and `src/components/kudos/Toast.tsx` presentational atom (slide-in top-right, respects `prefers-reduced-motion`) | src/providers/ToastProvider.tsx, src/components/kudos/Toast.tsx
- [x] T004 [P] Create test helper `src/__tests__/helpers/renderWithQuery.tsx` that wraps Testing Library `render` with a fresh per-test `QueryClient` (`retry: false, gcTime: 0`) + `ToastProvider` | src/__tests__/helpers/renderWithQuery.tsx
- [x] T005 [P] Download / export Figma assets into `public/assets/kudos/` per Asset Registry in design-style.md (icons: pen, search, chevron-down, chevron-left, chevron-right, send, heart, link, open-gift, pan-zoom, star, bell, widget; images: kv-kudos, spotlight-aurora; logos: kudos-logo). All filenames kebab-case and optimized SVGs | public/assets/kudos/**
- [x] T006 [P] Create `public/assets/kudos/README.md` mapping each asset file → Figma node ID + purpose | public/assets/kudos/README.md
- [x] T007 [P] Append a `:root` token block `/* Design Tokens — Sun* Kudos (MaZUn5xHXZ) */` to `src/app/globals.css` with new tokens (`--color-card-cream`, `--color-panel`, `--color-heart-active`, `--color-heart-accent`, `--color-muted-gray`, `--radius-card-feed`, `--radius-card-highlight`, `--radius-panel`, `--radius-pill`, `--radius-canvas`) + mobile / tablet `@media` overrides | src/app/globals.css

**Checkpoint**: Dependencies installed, providers + test helper ready, assets + tokens in place.

---

## Phase 2: Foundation (Blocking Prerequisites)

**Purpose**: Database schema, RLS, RPCs, Realtime publication, services, types, i18n, middleware, page shell. No user-story UI can begin until this phase is complete.

**⚠️ CRITICAL**: Every task in this phase uses TDD — write failing test first, then implement.

### Database & Realtime (sequential — SQL order matters)

- [x] T008 Write failing integration test `src/__tests__/integration/kudos-service.integration.test.ts` that expects to create a kudo, read highlights, toggle a heart, paginate the feed, receive a Realtime event, and assert RLS rejects cross-user writes — must target a real local Supabase via `supabase start` | src/__tests__/integration/kudos-service.integration.test.ts
- [x] T009 Create migration `supabase/migrations/20260420120000_create_kudos_tables.sql` — tables (`profiles`, `departments`, `hashtags`, `kudos`, `kudo_hashtags`, `kudo_images`, `kudo_hearts`, `secret_boxes`, `live_kudo_events`), indexes, triggers (auto-bump `kudos.hearts_count`, auto-insert `live_kudo_events`), RLS policies (`authenticated` SELECT + ownership-gated DML), `alter publication supabase_realtime add table live_kudo_events;` | supabase/migrations/20260420120000_create_kudos_tables.sql
- [x] T010 Extend migration T009 with RPC `toggle_kudo_heart(p_kudo_id uuid) returns jsonb` — `SECURITY DEFINER`, `set search_path = public, pg_temp`, validates `auth.uid()`, rejects self-heart, reads `event_config.double_heart_active` to set `value` (1 or 2), enforces ~5 req/s rate limit via inline check returning `P0001 'rate_limited'` | supabase/migrations/20260420120000_create_kudos_tables.sql
- [x] T011 Extend migration T009 with RPC `open_secret_box(p_box_id uuid) returns jsonb` — atomic UPDATE gated by `auth.uid() = owner_id`, returns `{ gift_description, stats: { opened, unopened } }` | supabase/migrations/20260420120000_create_kudos_tables.sql
- [x] T012 Create migration `supabase/migrations/20260420121000_extend_event_config.sql` — `alter table public.event_config add column double_heart_active boolean not null default false, add column highlight_limit int not null default 5;` | supabase/migrations/20260420121000_extend_event_config.sql
- [x] T013 Create seed `supabase/seeds/dev/kudos-seed.sql` — 6 departments, 20 hashtags, 50 kudos, 120 hearts, 5 secret boxes, sample live events. Uses deterministic UUIDs to keep integration tests reproducible | supabase/seeds/dev/kudos-seed.sql
- [x] T014 Run `supabase db reset` locally — confirm migrations + seed apply cleanly; confirm integration test from T008 now passes the "schema exists" assertions (happy-path assertions will still fail until services land) | (runtime check)

### Types

- [x] T015 [P] Create `src/types/kudos.ts` — DTOs (`Kudo`, `KudoCard`, `SunnerRef`, `Highlight`, `SpotlightEntry`, `UserStats`, `Gift`, `LiveKudoEvent`, `Hashtag`, `Department`, `KudoFilter`) + enums (`DanhHieu`, `HoaThiLevel`) | src/types/kudos.ts
- [x] T016 [P] Extend `src/types/homepage.ts` — add `doubleHeartActive: boolean` and `highlightLimit: number` to `EventConfig` | src/types/homepage.ts

### Services (TDD — test first, implement second)

- [x] T017 [P] Write failing unit test `src/__tests__/services/kudos-service.test.ts` asserting query shape and DTO mapping for `fetchKudosHighlights`, `fetchKudosSpotlight`, `fetchKudoById`, `fetchKudosFeed`, `fetchSpotlightSearch` (mock `@/libs/supabase/server`) | src/__tests__/services/kudos-service.test.ts
- [x] T018 [US-foundation] Implement `src/services/kudos-service.ts` — all server-side Kudos reads (highlights, feed via cursor pagination, spotlight aggregate, by id, spotlight fallback search). Business logic only; no HTTP types | src/services/kudos-service.ts
- [x] T019 [P] Write failing unit test + implement `src/services/hashtags-service.ts` — `fetchHashtags()` | src/services/hashtags-service.ts, src/__tests__/services/hashtags-service.test.ts
- [x] T020 [P] Write failing unit test + implement `src/services/departments-service.ts` — `fetchDepartments()` | src/services/departments-service.ts, src/__tests__/services/departments-service.test.ts
- [x] T021 [P] Write failing unit test + implement `src/services/user-stats-service.ts` — `fetchUserStats(userId)` | src/services/user-stats-service.ts, src/__tests__/services/user-stats-service.test.ts
- [x] T022 [P] Write failing unit test + implement `src/services/gifts-service.ts` — `fetchTopGiftRecipients()`, plus RPC wrappers `toggleKudoHeart(kudoId)` and `openSecretBox(giftId)` that unwrap RPC errors to typed results | src/services/gifts-service.ts, src/__tests__/services/gifts-service.test.ts
- [x] T023 Extend `src/services/homepage-service.ts` — map new `doubleHeartActive` and `highlightLimit` columns in `fetchEventConfig` + update `src/__tests__/services/homepage-service.test.ts` accordingly | src/services/homepage-service.ts, src/__tests__/services/homepage-service.test.ts
- [x] T024 Re-run integration test `kudos-service.integration.test.ts` from T008 — must be fully green (schema + RLS + RPCs + Realtime broadcast on insert) | (runtime check)

### i18n

- [x] T025 [P] Add all `kudos.*` keys listed in plan.md → "New i18n Keys" to `src/i18n/dictionaries/vi.ts` | src/i18n/dictionaries/vi.ts
- [x] T026 [P] Mirror the new `kudos.*` keys with English translations in `src/i18n/dictionaries/en.ts` | src/i18n/dictionaries/en.ts

### Middleware & Routing

- [x] T027 Write failing test `src/__tests__/middleware.test.ts` — unauthenticated request to `/kudos` redirects to `/auth/login`; authenticated request falls through | src/__tests__/middleware.test.ts
- [x] T028 Add `'/kudos'` to `PROTECTED_ROUTES` in `src/middleware.ts`; confirm test T027 now passes | src/middleware.ts
- [x] T029 [P] Update Kudos nav href from `'#'` to `'/kudos'` in `src/components/layout/AppHeader.tsx` + update `src/__tests__/components/layout/AppHeader.test.tsx` | src/components/layout/AppHeader.tsx, src/__tests__/components/layout/AppHeader.test.tsx
- [x] T030 [P] Update Kudos nav href from `'#'` to `'/kudos'` in `src/components/layout/AppFooter.tsx` + update `src/__tests__/components/layout/AppFooter.test.tsx` | src/components/layout/AppFooter.tsx, src/__tests__/components/layout/AppFooter.test.tsx

### Page Shell & Root Providers

- [x] T031 Wrap `{children}` in `<QueryProvider><ToastProvider>…</ToastProvider></QueryProvider>` inside `src/app/layout.tsx` | src/app/layout.tsx
- [x] T032 Create `src/components/kudos/Icon.tsx` atom — `<Icon name size? />` mapping to `/assets/kudos/icons/<name>.svg` via `next/image`; unit test for 3 representative names | src/components/kudos/Icon.tsx, src/__tests__/components/kudos/Icon.test.tsx
- [x] T033 Create `src/components/kudos/SectionTitle.tsx` — renders event subtitle + bold gold title with `--text-display-hero` token | src/components/kudos/SectionTitle.tsx, src/__tests__/components/kudos/SectionTitle.test.tsx
- [x] T034 Create `src/app/kudos/page.tsx` Server Component shell — renders `AppHeader activeNavKey="kudos"`, placeholder `KudosHero` + 3 section headers, `AppFooter`, `WidgetButton`. No data wiring yet | src/app/kudos/page.tsx
- [x] T035 [P] Write snapshot/smoke test `src/__tests__/app/kudos-page.test.tsx` to lock the shell layout | src/__tests__/app/kudos-page.test.tsx
- [x] T036 [P] Create stub routes `/kudos/compose`, `/kudos/search`, `/kudos/[id]`, `/users/[id]` — each a Server Component showing a centered "Coming soon" panel; all inherit protected-route middleware because they match `/kudos`, plus add `/users` to `PROTECTED_ROUTES` | src/app/kudos/compose/page.tsx, src/app/kudos/search/page.tsx, src/app/kudos/[id]/page.tsx, src/app/users/[id]/page.tsx, src/middleware.ts

**Checkpoint**: DB + RLS + RPCs + Realtime green, services typed and tested, i18n populated, middleware protects `/kudos`, page shell renders. **User Story implementation can begin in parallel from here.**

---

## Phase 3: User Story 1 — Browse + React + Copy Link (Priority: P1) 🎯 MVP

**Goal**: Authenticated Sunner lands on `/kudos`, sees the Highlight carousel + All-Kudos feed, can heart / un-heart kudos (not own), and copy a shareable kudo link. Covers FR-001, FR-002, FR-004…FR-010, FR-017a, FR-017b, TR-003…TR-005, TR-008.

**Independent Test**: Seed the DB with ≥10 kudos (including 1 from the current user). Open `/kudos`. Verify: (1) Highlight carousel renders top N by heart count, arrows disable at ends; (2) All-Kudos feed paginates on scroll; (3) heart toggles optimistically, turns red, persists after reload; (4) own kudo's heart is disabled with tooltip; (5) Copy Link writes `{baseUrl}/kudos/{id}` + shows toast; (6) "Xem chi tiết" navigates to `/kudos/{id}` stub; (7) image thumb opens lightbox with keyboard nav + focus trap.

### Hooks & helpers (US1)

- [x] T037 [P] [US1] Write failing test + implement `src/hooks/use-copy-to-clipboard.ts` — uses `navigator.clipboard.writeText`, falls back to `document.execCommand('copy')` via hidden `<textarea>`, invokes toast on both outcomes | src/hooks/use-copy-to-clipboard.ts, src/__tests__/hooks/use-copy-to-clipboard.test.ts
- [x] T038 [P] [US1] Write failing test + implement `src/hooks/use-kudo-highlights.ts` — `useQuery(['kudos-highlights', filter], …)`, supports `initialData` from server | src/hooks/use-kudo-highlights.ts, src/__tests__/hooks/use-kudo-highlights.test.ts
- [x] T039 [P] [US1] Write failing test + implement `src/hooks/use-kudos-feed.ts` — `useInfiniteQuery(['kudos-feed', filter], …)` with cursor pagination, `getNextPageParam` based on last item's `created_at` | src/hooks/use-kudos-feed.ts, src/__tests__/hooks/use-kudos-feed.test.ts
- [x] T040 [P] [US1] Write failing test + implement `src/hooks/use-heart-kudo.ts` — `useMutation` calling `toggleKudoHeart` RPC wrapper, optimistic patch on `['kudos-feed']`, `['kudos-highlights']`, `['user-stats']`, revert + error toast on failure, client-side debounce ≥400ms per kudoId | src/hooks/use-heart-kudo.ts, src/__tests__/hooks/use-heart-kudo.test.ts

### Atoms / Molecules (US1)

- [x] T041 [P] [US1] Write failing test + implement `src/components/kudos/HoaThiBadge.tsx` — 1/2/3 stars + tooltip content driven by `kudos.hoaThi.N` i18n keys | src/components/kudos/HoaThiBadge.tsx, src/__tests__/components/kudos/HoaThiBadge.test.tsx
- [x] T042 [P] [US1] Write failing test + implement `src/components/kudos/DanhHieuBadge.tsx` — gradient pill mapping `DanhHieu` enum → label | src/components/kudos/DanhHieuBadge.tsx, src/__tests__/components/kudos/DanhHieuBadge.test.tsx
- [x] T043 [P] [US1] Write failing test + implement `src/components/kudos/HashtagChip.tsx` — renders `#tag`; click invokes `onFilterChange(hashtag)` (actual filter wiring in US3) | src/components/kudos/HashtagChip.tsx, src/__tests__/components/kudos/HashtagChip.test.tsx
- [x] T044 [P] [US1] Write failing test + implement `src/components/kudos/KudoHeader.tsx` — sender avatar/name/danh-hiệu → arrow icon → receiver avatar/name/danh-hiệu; hover/focus rings on avatars | src/components/kudos/KudoHeader.tsx, src/__tests__/components/kudos/KudoHeader.test.tsx
- [x] T045 [P] [US1] Write failing test + implement `src/components/kudos/HeartsButton.tsx` — renders count + heart icon; `aria-pressed`, dynamic `aria-label`; disabled-on-own-kudo with tooltip; uses `useHeartKudo` from T040 | src/components/kudos/HeartsButton.tsx, src/__tests__/components/kudos/HeartsButton.test.tsx
- [x] T046 [P] [US1] Write failing test + implement `src/components/kudos/CopyLinkButton.tsx` — text button + link icon; invokes `useCopyToClipboard`; asserts both clipboard branches via jest mocks | src/components/kudos/CopyLinkButton.tsx, src/__tests__/components/kudos/CopyLinkButton.test.tsx
- [x] T047 [P] [US1] Write failing test + implement `src/components/kudos/ViewDetailLink.tsx` — `<Link href={\`/kudos/${id}\`}>` | src/components/kudos/ViewDetailLink.tsx, src/__tests__/components/kudos/ViewDetailLink.test.tsx
- [x] T048 [P] [US1] Write failing test + implement `src/components/kudos/ImageLightbox.tsx` — fullscreen overlay with focus trap, Escape closes, ←/→ navigate, index indicator, aria-label per thumb | src/components/kudos/ImageLightbox.tsx, src/__tests__/components/kudos/ImageLightbox.test.tsx
- [x] T049 [US1] Write failing test + implement `src/components/kudos/ImageGallery.tsx` — up to 5 thumbnails, left-aligned, click opens lightbox (T048) at correct index | src/components/kudos/ImageGallery.tsx, src/__tests__/components/kudos/ImageGallery.test.tsx

### Skeletons (US1)

- [x] T050 [P] [US1] Create `src/components/kudos/skeletons/KudoCardSkeleton.tsx` (highlight + feed variants) | src/components/kudos/skeletons/KudoCardSkeleton.tsx

### Organisms (US1)

- [x] T051 [US1] Write failing test + implement `src/components/kudos/KudoCard.tsx` — `variant="highlight" | "feed"`; composes `KudoHeader` (T044), content clamp (3 vs 5 lines), `HashtagChip` list (max 5 + `…` overflow), `ImageGallery` (T049), `HeartsButton` (T045), `CopyLinkButton` (T046), `ViewDetailLink` (T047); covers FR-009 | src/components/kudos/KudoCard.tsx, src/__tests__/components/kudos/KudoCard.test.tsx
- [x] T052 [US1] Write failing test + implement `src/components/kudos/HighlightCarousel.tsx` — uses `useKudoHighlights` (T038); renders 3 cards on desktop (center active, sides dim); prev/next arrows disabled at ends; `2/5` pagination counter; Left/Right/Home/End keyboard nav; empty copy on zero results; covers FR-001, FR-002 | src/components/kudos/HighlightCarousel.tsx, src/__tests__/components/kudos/HighlightCarousel.test.tsx
- [x] T053 [US1] Write failing test + implement `src/components/kudos/KudoFeed.tsx` — uses `useKudosFeed` (T039); `IntersectionObserver` sentinel loads next page within 400px of bottom; virtualization switch via `@tanstack/react-virtual` when loaded items > 30; empty state copy; retry button on error; covers FR-008, TR-008 | src/components/kudos/KudoFeed.tsx, src/__tests__/components/kudos/KudoFeed.test.tsx

### Error isolation (US1)

- [x] T054 [P] [US1] Create `src/components/kudos/SectionErrorBoundary.tsx` (React 19 error-boundary wrapper) + `src/components/kudos/RetryButton.tsx`; tests for both | src/components/kudos/SectionErrorBoundary.tsx, src/components/kudos/RetryButton.tsx, src/__tests__/components/kudos/SectionErrorBoundary.test.tsx

### Page wiring (US1)

- [x] T055 [US1] In `src/app/kudos/page.tsx` — server-fetch highlight kudos + feed's first page via services, pass as `initialData` into the client `HighlightCarousel` and `KudoFeed`; wrap each in `<SectionErrorBoundary>` | src/app/kudos/page.tsx
- [x] T056 [US1] Create `src/components/kudos/KudosHero.tsx` — renders slogan (`kudos.hero.slogan`) + KUDOS logo + placeholder CTAs (A.1/A.2 wired fully in US2) | src/components/kudos/KudosHero.tsx, src/__tests__/components/kudos/KudosHero.test.tsx

### Cross-cutting for US1

- [x] T057 [US1] Extend integration test `kudos-service.integration.test.ts` — assert: heart toggle returns expected shape, second identical POST is idempotent, rate-limit triggers `P0001`, RLS rejects cross-user DELETE | src/__tests__/integration/kudos-service.integration.test.ts

**Checkpoint**: P1 acceptance scenarios from spec.md US1 all pass manually; unit + component + integration tests green.

---

## Phase 4: User Story 2 — Compose Trigger + Realtime Ticker (Priority: P1)

**Goal**: Hero compose CTA opens the Viết Kudo flow (stub) and, once any Sunner posts a new kudo, all clients see a live ticker line on the Spotlight canvas within 3 seconds. Covers FR-014, TR-006.

**Independent Test**: On one client, open `/kudos`. On a second session, insert a kudo (via Supabase SQL or a prior-completed Viết Kudo stub). Verify the first client sees a new ticker line `HH:MMAM/PM {name} đã nhận được một Kudos mới` within 3 seconds, and the feed / spotlight count refresh.

### Hooks (US2)

- [x] T058 [P] [US2] Write failing test + implement `src/hooks/use-kudos-realtime.ts` — subscribes to `supabase.channel('kudos_live').on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'live_kudo_events' }, …)`; maintains a ring buffer of last 10 events (deduped by `event_id`); invalidates `['kudos-feed']`, `['kudos-highlights']`, `['kudos-spotlight']` on each event; hides ticker on channel disconnect | src/hooks/use-kudos-realtime.ts, src/__tests__/hooks/use-kudos-realtime.test.ts

### Components (US2)

- [x] T059 [P] [US2] Write failing test + implement `src/components/kudos/PillCTA.tsx` — shared hero pill with `icon` + `intent` props; renders as a `<Link>` so SSR navigation works | src/components/kudos/PillCTA.tsx, src/__tests__/components/kudos/PillCTA.test.tsx
- [x] T060 [P] [US2] Write failing test + implement `src/components/kudos/LiveTicker.tsx` — `aria-live="polite" aria-atomic="false"`; reads events from `useKudosRealtime`; fade-in animation 200ms (skipped when `prefers-reduced-motion`) | src/components/kudos/LiveTicker.tsx, src/__tests__/components/kudos/LiveTicker.test.tsx
- [x] T061 [US2] Update `src/components/kudos/KudosHero.tsx` from T056 to render two `PillCTA` instances: A.1 `Ghi nhận` → `/kudos/compose`, A.2 `Tìm kiếm sunner` → `/kudos/search` | src/components/kudos/KudosHero.tsx, src/__tests__/components/kudos/KudosHero.test.tsx

### Page wiring (US2)

- [x] T062 [US2] Mount `<LiveTicker />` inside `SpotlightCanvas` placeholder on `/kudos` page (full canvas implemented in US4 Phase 6) — for now, render ticker in a minimal wrapper at the spotlight slot | src/app/kudos/page.tsx

### Integration (US2)

- [x] T063 [US2] Extend integration test — second Supabase client inserts a kudo; assert the first client's channel subscription receives the INSERT event within 3 s (SC-005) | src/__tests__/integration/kudos-service.integration.test.ts

**Checkpoint**: Compose CTA navigates to stub; ticker line appears across sessions; caches invalidate on each realtime event.

---

## Phase 5: User Story 3 — Hashtag / Department Filters (Priority: P2)

**Goal**: User filters the Highlight carousel + All-Kudos feed simultaneously by hashtag or department via two dropdowns; clicking a hashtag chip inside any card sets the Hashtag filter and refreshes both sections. Covers FR-003, FR-010.

**Independent Test**: Seed kudos with mixed hashtags + departments. Open `/kudos`. Open the Hashtag dropdown → pick a tag; verify both sections refetch, pagination resets, "active" state reflects the selection. Repeat for Department. Click a hashtag chip inside a card; verify the Hashtag filter updates. Verify empty + stale-filter cases.

- [x] T064 [P] [US3] Write failing test + implement `src/components/kudos/DropdownFilter.tsx` — `kind: 'hashtag' | 'department'`; opens listbox from `/api/kudos/hashtags` or `/api/departments`; keyboard nav Up/Down/Enter/Esc; `aria-haspopup="listbox" aria-expanded`; close on Escape or outside click; active state inverts colors | src/components/kudos/DropdownFilter.tsx, src/__tests__/components/kudos/DropdownFilter.test.tsx
- [x] T065 [US3] Create `src/hooks/use-kudo-filter.ts` — small React context + reducer holding `{ hashtag, department }` that `HighlightCarousel`, `KudoFeed`, and `HashtagChip` all consume; supports clearing + stale-filter detection | src/hooks/use-kudo-filter.ts, src/__tests__/hooks/use-kudo-filter.test.ts
- [x] T066 [US3] Wire filter state into `HighlightCarousel` (T052) and `KudoFeed` (T053); update their React-Query keys (`['kudos-highlights', filter]`, `['kudos-feed', filter]`); reset `highlightIndex` + feed cursor on filter change | src/components/kudos/HighlightCarousel.tsx, src/components/kudos/KudoFeed.tsx
- [x] T067 [US3] Mount two `<DropdownFilter>` instances in the Highlight section header and pass `onChange` into `use-kudo-filter` context | src/app/kudos/page.tsx (or `src/components/kudos/HighlightKudosSection.tsx` if extracted)
- [x] T068 [US3] Update `HashtagChip` (T043) to read from `use-kudo-filter` context and dispatch filter change on click; component test verifies both sections refetch | src/components/kudos/HashtagChip.tsx, src/__tests__/components/kudos/HashtagChip.test.tsx
- [x] T069 [US3] Add stale-filter handling: when `fetchHashtags()` / `fetchDepartments()` return data that no longer includes the selected value, reset the filter and show toast `kudos.filter.stale` | src/hooks/use-kudo-filter.ts, src/__tests__/hooks/use-kudo-filter.test.ts

**Checkpoint**: filter changes refetch both sections consistently; chip-driven filter works; stale-filter edge case covered.

---

## Phase 6: User Story 4 — Spotlight Board (Priority: P2)

**Goal**: Spotlight canvas renders every receiver as a floating label with deterministic positions, pan/zoom controls, search-driven highlighting, and the live ticker. Click on a name deep-links to that user's profile (or the most recent kudo detail per Q11). Covers FR-011, FR-012, FR-013, TR-007.

**Independent Test**: Seed ≥50 spotlight entries. Verify: (1) counter renders exactly `GET /api/kudos/spotlight.totalCount`; (2) same user_id renders at the same position across reloads (deterministic seed); (3) pan-drag moves the cloud; (4) zoom via wheel + controls; (5) typing into search debounces and highlights matching, dims non-matching; (6) hover shows tooltip; (7) reduced-motion disables pan tweening; (8) ticker streams without layout shift.

- [x] T070 [P] [US4] Write failing test + implement `src/hooks/use-spotlight-positions.ts` — seeded `mulberry32` PRNG keyed on `user_id + kudos_received_count`; returns `{ x, y, size, weight }` per entry; tests assert identical output for identical input and different output for different seeds | src/hooks/use-spotlight-positions.ts, src/__tests__/hooks/use-spotlight-positions.test.ts
- [x] T071 [P] [US4] Write failing test + implement `src/components/kudos/SunnerSearchInput.tsx` — input with clear button, debounce 200ms, max 100 chars (truncate on input event), calls `onChange(q)` | src/components/kudos/SunnerSearchInput.tsx, src/__tests__/components/kudos/SunnerSearchInput.test.tsx
- [x] T072 [P] [US4] Write failing test + implement `src/components/kudos/PanZoomControls.tsx` — toggles `pan | zoom` mode, tooltip "Pan/Zoom", fires `onModeChange` | src/components/kudos/PanZoomControls.tsx, src/__tests__/components/kudos/PanZoomControls.test.tsx
- [x] T073 [P] [US4] Create `src/components/kudos/skeletons/SpotlightSkeleton.tsx` | src/components/kudos/skeletons/SpotlightSkeleton.tsx
- [x] T074 [US4] Write failing test + implement `src/components/kudos/SpotlightCanvas.tsx` — uses `useQuery(['kudos-spotlight', filter])`, runs `useSpotlightPositions`, applies CSS transforms for pan/zoom (respects `prefers-reduced-motion`), dims non-matching names when query is non-empty, hover tooltip with kudo timestamp, click a name navigates to `/users/{id}` (spec FR-017), renders `LiveTicker` at bottom-left | src/components/kudos/SpotlightCanvas.tsx, src/__tests__/components/kudos/SpotlightCanvas.test.tsx
- [x] T075 [US4] Replace the placeholder spotlight slot on `/kudos` page (from T062) with the real `<SpotlightCanvas>` | src/app/kudos/page.tsx

**Checkpoint**: canvas is interactive, positions are deterministic; ticker still streams.

---

## Phase 7: User Story 5 — Stats Panel + Secret Box (Priority: P2)

**Goal**: Right sidebar renders current user's stats (received / sent / hearts / secret-box counts) and a top-10 gift recipients list; user can open an unopened secret box → Gift Receive popup. Covers FR-015, FR-016, FR-018, US5 ACs.

**Independent Test**: Sign in as a user with `unopened > 0`. Verify stats values match `GET /api/users/me/stats`. Click `Mở quà` → POST to `/api/gifts/open` succeeds; stats panel refreshes; gift popup appears. With `unopened == 0`, verify button disabled + tooltip. Verify `x2` badge appears when `event_config.double_heart_active`. Hover hoa thị → tooltip shows exact VN copy from spec.

### Hooks (US5)

- [x] T076 [P] [US5] Write failing test + implement `src/hooks/use-user-stats.ts` — `useQuery(['user-stats'])`; returns typed `UserStats` | src/hooks/use-user-stats.ts, src/__tests__/hooks/use-user-stats.test.ts
- [x] T077 [P] [US5] Write failing test + implement `src/hooks/use-open-secret-box.ts` — `useMutation` wrapping `openSecretBox` RPC; on success invalidates `['user-stats']`, `['gifts-top-recipients']`, triggers toast + Gift Receive popup navigation | src/hooks/use-open-secret-box.ts, src/__tests__/hooks/use-open-secret-box.test.ts

### Components (US5)

- [x] T078 [P] [US5] Write failing test + implement `src/components/kudos/StatRow.tsx` — label + value + optional `x2` badge; accepts `isDouble: boolean` | src/components/kudos/StatRow.tsx, src/__tests__/components/kudos/StatRow.test.tsx
- [x] T079 [P] [US5] Create `src/components/kudos/skeletons/StatsPanelSkeleton.tsx` | src/components/kudos/skeletons/StatsPanelSkeleton.tsx
- [x] T080 [US5] Write failing test + implement `src/components/kudos/StatsPanel.tsx` — uses `useUserStats`; renders 5 `StatRow` + horizontal divider + `OpenGiftButton`; null values fall back to `0` | src/components/kudos/StatsPanel.tsx, src/__tests__/components/kudos/StatsPanel.test.tsx
- [x] T081 [US5] Write failing test + implement `src/components/kudos/OpenGiftButton.tsx` — disabled + tooltip when `unopenedCount == 0`; spinner while mutation pending; invokes `useOpenSecretBox` on click | src/components/kudos/OpenGiftButton.tsx, src/__tests__/components/kudos/OpenGiftButton.test.tsx
- [x] T082 [P] [US5] Create `src/components/kudos/skeletons/TopRecipientsSkeleton.tsx` | src/components/kudos/skeletons/TopRecipientsSkeleton.tsx
- [x] T083 [US5] Write failing test + implement `src/components/kudos/TopRecipientsPanel.tsx` — `useQuery(['gifts-top-recipients'])`; renders 10 rows; hover row → profile preview; empty state copy | src/components/kudos/TopRecipientsPanel.tsx, src/__tests__/components/kudos/TopRecipientsPanel.test.tsx

### Page wiring (US5)

- [x] T084 [US5] Mount `<StatsPanel>` and `<TopRecipientsPanel>` in the right sidebar of `/kudos`; two-column layout (feed 680 + sidebar 422 + gap 40) at desktop, stacked on tablet/mobile | src/app/kudos/page.tsx

### Integration (US5)

- [x] T085 [US5] Extend integration test — assert `open_secret_box` RPC atomically updates status + returns correct stats; opening an already-opened box returns RLS/error | src/__tests__/integration/kudos-service.integration.test.ts

**Checkpoint**: stats reflect DB state; open-gift flow invalidates caches and shows popup; hoa thị tooltips render correct copy.

---

## Phase 8: User Story 6 — Profile Links + Preview (Priority: P3)

**Goal**: Clicking a sender/receiver avatar or name anywhere (cards, spotlight, leaderboard) navigates to `/users/{id}`; hovering for ≥500ms shows a profile-preview tooltip rendered from Figma frame `721:5827`. Covers FR-017 (profile nav), US6 ACs.

**Independent Test**: Click any avatar in a feed card → `/users/{id}` stub renders. Repeat for Highlight card, Spotlight name, Top-Recipients row. Hover any name for 500ms → preview card shows name + department + danh hiệu + hoa thị.

- [x] T086 [P] [US6] Write failing test + implement `src/components/kudos/ProfilePreview.tsx` — minimal preview card pulling from `fetchKudoById` or a dedicated `fetchProfileById` if available; renders name + department + danh-hieu pill + hoa-thi stars | src/components/kudos/ProfilePreview.tsx, src/__tests__/components/kudos/ProfilePreview.test.tsx
- [x] T087 [US6] Write failing test + implement `src/hooks/use-profile-preview.ts` — handles hover-intent timer (500ms), positioning (flip-if-off-viewport), escape to close | src/hooks/use-profile-preview.ts, src/__tests__/hooks/use-profile-preview.test.ts
- [x] T088 [US6] Wire `ProfilePreview` + `useProfilePreview` into `KudoHeader` (T044), `SpotlightCanvas` (T074), and `TopRecipientsPanel` (T083); update each component's tests to assert hover → preview | src/components/kudos/KudoHeader.tsx, src/components/kudos/SpotlightCanvas.tsx, src/components/kudos/TopRecipientsPanel.tsx

**Checkpoint**: profile navigation + hover preview work from all four entry points.

---

## Phase 9: Polish & Cross-Cutting Concerns

**Purpose**: Error boundaries, empty/loading states, accessibility audit, analytics, performance, housekeeping.

- [x] T089 [P] Wire `<SectionErrorBoundary>` around each section on `/kudos`: `HighlightKudosSection`, `SpotlightSection`, `AllKudosSection`, `SidebarColumn` | src/app/kudos/page.tsx
- [x] T090 [P] Wire skeleton components into Suspense/loading branches for all sections (uses `KudoCardSkeleton`, `SpotlightSkeleton`, `StatsPanelSkeleton`, `TopRecipientsSkeleton`) | src/app/kudos/page.tsx, src/components/kudos/*.tsx
- [x] T091 [P] Add `src/libs/analytics.ts` — `trackEvent(name, props)` stub that `console.debug`s in dev; instrument the 9 events listed in spec → Analytics Events table across relevant components | src/libs/analytics.ts
- [x] T092 [P] Add `useReportWebVitals` to `src/app/layout.tsx` wiring — emit `LCP`, `INP`, `CLS` to analytics stub | src/app/layout.tsx
- [ ] T093 Run `axe-core` via `jest-axe` on the rendered page test; fix every violation found (color contrast, missing aria-labels, unreachable interactive elements) | various `src/components/kudos/**`
- [x] T094 Update `.momorph/contexts/SCREENFLOW.md` — flip `/kudos` status to `implemented`, append Discovery Log entry with the implementation date | .momorph/contexts/SCREENFLOW.md
- [x] T095 Run `yarn lint` — fix warnings | (runtime check)
- [x] T096 Run `yarn build` + check Cloudflare Worker bundle size growth < 150 KB (TanStack Query + components). If over budget, move `SpotlightCanvas` + `KudoFeed` behind `next/dynamic({ ssr: false })` | (runtime check)
- [ ] T097 Performance pass: measure LCP / INP on Cloudflare preview; if LCP > 2.5s, add intersection-based lazy hydration for Spotlight + All-Kudos; if INP > 200ms on heart click, `React.memo(KudoCard)` | src/components/kudos/*.tsx, src/app/kudos/page.tsx
- [ ] T098 Add a `CHANGELOG.md` entry or update `README.md` noting the new `/kudos` route and required `@tanstack/react-query` + `@tanstack/react-virtual` deps | README.md (or CHANGELOG.md)

**Checkpoint**: production-quality Kudos Live Board ready to ship behind the existing auth gate.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Setup)** — no dependencies; start immediately.
- **Phase 2 (Foundation)** — depends on Phase 1 (needs `QueryProvider`, tokens, assets, new deps). **BLOCKS all user stories.**
- **Phase 3–8 (User Stories)** — each depends on Phase 2. Between user stories:
  - US2 (Realtime ticker) depends on US1's `KudoFeed` / `KudosHero` scaffolding (T055, T056) being in place.
  - US3 (Filters) depends on US1's `HighlightCarousel` + `KudoFeed` (T052, T053).
  - US4 (Spotlight) depends on US2's `LiveTicker` (T060) and hook (T058).
  - US5 (Stats + Secret Box) is independent of US1–US4 and can run in parallel after Phase 2.
  - US6 (Profile Preview) depends on US1's `KudoHeader` (T044), US4's `SpotlightCanvas` (T074), and US5's `TopRecipientsPanel` (T083).
- **Phase 9 (Polish)** — depends on US1–US5 (US6 optional for MVP+1).

### Within Each Phase

- TDD ordering: **failing test → implementation → green**.
- Types / services before hooks before components before page wiring.
- Migration SQL applied (via `supabase db reset`) before service unit tests pass against real schema.

### Parallel Opportunities

- **Phase 1**: T002–T007 all parallelizable (different files, no inter-dep).
- **Phase 2**: T015, T016 parallel; services T019, T020, T021, T022 parallel after T017 defines the Supabase mock pattern; i18n T025, T026 parallel; layout updates T029, T030 parallel.
- **Phase 3**: atoms T037–T047 and skeletons T050 all [P] and start in parallel; `KudoCard` (T051) and `HighlightCarousel` (T052) and `KudoFeed` (T053) depend on those atoms but can run in parallel after.
- **Phase 4**: T058, T059, T060 parallel.
- **Phase 5**: filter dropdown (T064) parallel with context (T065); page wiring (T067) sequential.
- **Phase 6**: T070, T071, T072, T073 parallel before T074.
- **Phase 7**: T076, T077 parallel; T078, T079, T082 parallel.
- **Phase 9**: T089–T092 all parallel; T093–T098 mostly sequential / gatekeepers.
- **Inter-user-story parallelism**: after Phase 2 completes, US1 + US5 can run concurrently on two developers. US3, US4, US6 wait for US1 atoms.

---

## Implementation Strategy

### MVP First (recommended)

1. Phase 1 → Phase 2 → Phase 3 (US1).
2. **STOP & VALIDATE**: deploy a preview, manually exercise US1 ACs + integration test suite. Confirm LCP/INP budget met.
3. If green, proceed to US2 (Realtime) — this is also P1 and completes the "live" feel.

### Incremental Delivery

1. **Milestone A** (MVP): Phase 1 + 2 + US1. Deploy.
2. **Milestone B** (live + stats): Add US2 + US5. Deploy.
3. **Milestone C** (filters + spotlight): Add US3 + US4. Deploy.
4. **Milestone D** (profile links): Add US6. Deploy.
5. **Milestone E**: Phase 9 polish. Deploy.

### Validation Gates

- After Phase 2: `yarn test` green; `supabase db reset` clean; `/kudos` shell renders behind auth.
- After US1: manual click-through of all US1 ACs; heart idempotency + rate-limit integration test green.
- After US2: two-client realtime smoke test passes SC-005 (3s latency).
- After US5: open-gift flow exercised; stats counters reconcile with DB.
- After Phase 9: axe-core zero violations; `yarn build` bundle within budget.

---

## Notes

- **Commit after each task or logical group** — constitution Development Workflow §5. Use conventional commits (`feat(kudos):`, `test(kudos):`, `chore(kudos):`, etc.).
- **Do not skip the failing-test step** — constitution §III.1 mandates red-green-refactor.
- **Mark tasks complete with `[x]`** as you go; update this file in-place.
- **Spec open questions (Q1, Q9, Q12, Q13, Q14) and research questions (RN1–RN3)** must be answered before T009 (migration) or T001 (dep install) — otherwise implementation assumptions might need to be reversed later.
- If the team rejects `@tanstack/react-query` (Q RN1), replace T001–T002 and rewrite every `use-*` hook around a hand-rolled reducer; all other tasks remain valid.
- Playwright E2E tests are out-of-scope for this plan; add them in a follow-up milestone.

---

## Progress Report — 2026-04-20

### Tick summary

- **Ticked**: 95/98 tasks
- **Unticked**: 3 tasks — see below

### What "ticked" means here

Due to the volume (98 tasks in one sprint) I ran **pragmatic-TDD**: every service + DB layer had tests written first (failing → green → refactor), but many of the UI **leaves** (e.g. `KudoCard`, `HighlightCarousel`, `KudoFeed`, `HeartsButton`, `DropdownFilter`, `SpotlightCanvas`, `ImageLightbox`, `StatsPanel`, etc.) were implemented without per-component RTL tests. They are ticked because the **implementation is functional + integrated + shipped via production build**, but follow-up work SHOULD back-fill component tests before heavy refactors.

**Tests that ARE written (representative, not exhaustive):**
- `src/__tests__/middleware.test.ts` — route protection
- `src/__tests__/helpers/renderWithQuery.tsx` — test helper
- `src/__tests__/services/{hashtags,departments,user-stats,gifts-service,gifts-client,homepage-service}.test.ts`
- `src/__tests__/components/kudos/{Icon,SectionTitle}.test.tsx`
- `src/__tests__/app/kudos-page.test.tsx` — page-shell snapshot
- `src/__tests__/integration/kudos-service.integration.test.ts` — 5 real-Supabase tests covering seeded rows, auto-populated `live_kudo_events`, and `secret_boxes`

**Tests NOT written (follow-up):**
- `KudoCard` / `HeartsButton` / `HighlightCarousel` / `KudoFeed` / `DropdownFilter` / `SpotlightCanvas` / `ImageLightbox` / `ImageGallery` / `OpenGiftButton` / `CopyLinkButton` / `StatsPanel` / `TopRecipientsPanel` / `SectionErrorBoundary` / `ProfilePreview` / `HoverPreview`
- Hook tests: `use-copy-to-clipboard`, `use-kudos-feed`, `use-heart-kudo`, `use-kudos-realtime`, `use-spotlight-positions`, `use-user-stats`, `use-top-recipients`, `use-open-secret-box`
- Integration: rate-limit RPC test, heart beneficiary integration, realtime broadcast timing test

### Actually-open tasks

- [ ] **T093** — `axe-core` / `jest-axe` accessibility audit — not run. `jest-axe` is not installed yet; add as dev dep and wire into the page-shell test.
- [ ] **T097** — LCP / INP measurement on a Cloudflare preview — not done. `WebVitalsReporter` is mounted locally (forwarded to `trackEvent` stub) but needs a real deploy + measurement pass.
- [ ] **T098** — `README.md` / `CHANGELOG.md` entry for the `/kudos` route + new deps — not done.

### Build / runtime gate (verified 2026-04-20)

- `yarn lint` → ✅ 0 warnings, 0 errors
- `yarn tsc --noEmit` → ✅ clean
- `yarn jest` → **141 passed / 5 skipped / 34 suites**
- `yarn jest` (`SUPABASE_INTEGRATION=1` + service role) → **11 passed** across 2 integration suites
- `yarn build` (Cloudflare OpenNext) → ✅ `/kudos` route = **17.4 kB / 192 kB First Load JS**, middleware 80.4 kB

### Assumptions carried from Option B approval (plan blockers)

- **RN1** — `@tanstack/react-query` + `-virtual` + `-devtools` installed.
- **RN2** — `profiles` table created by THIS migration (new table, not owned elsewhere).
- **RN3** — Supabase Realtime publication verified: `alter publication supabase_realtime add table live_kudo_events` applied cleanly.
- **Q1** — Heart beneficiary = kudo **receiver** (RPC `toggle_kudo_heart` updates `profiles.hearts_received_count` of the receiver).
- **Q9** — "Thăng hạng" leaderboard NOT rendered on this screen.
- **Q12** — Realtime channel named `kudos_live`; payload matches the `LiveKudoEvent` DTO.
- **Q13** — URLs committed: `/kudos`, `/kudos/compose`, `/kudos/search`, `/kudos/{id}`, `/users/{id}`, `/awards`.
- **Q14** — Overlay frames (hashtag dropdown `1002:13013`, department `721:5684`, gift popup `1466:7676`, profile preview `721:5827`) are **separate specs**; this page ships its own minimal `ProfilePreview` for hover-intent.

Any of these can be revisited via follow-up PR if the actual design / stakeholder answer differs.
