# Implementation Plan: Sun* Kudos - Live Board

**Frame**: `MaZUn5xHXZ-sun-kudos-live-board`
**Date**: 2026-04-20
**Spec**: `specs/MaZUn5xHXZ-sun-kudos-live-board/spec.md`
**Design style**: `specs/MaZUn5xHXZ-sun-kudos-live-board/design-style.md`
**Research**: `specs/MaZUn5xHXZ-sun-kudos-live-board/research.md`

---

## Summary

Build the **Sun* Kudos - Live Board** — the public landing page for the Kudos feature within SAA 2025 — on the existing Next.js 15 / React 19 / Supabase stack. The page composes four sections (hero, highlight carousel, interactive spotlight board, infinite-scroll all-kudos feed + user-stats sidebar) over a shared Header / Footer that are already implemented on Homepage and Awards.

Approach: render the page in a Server Component (same pattern as `app/awards/page.tsx`) that hydrates interactive leaves as Client Components. The DB layer adds eight Kudos tables + two RPC functions behind Postgres Row-Level Security; the realtime ticker consumes Supabase Realtime `postgres_changes` broadcasts; an optimistic heart mutation drives user-level heart balances. Introduce `@tanstack/react-query` to cover the spec's cache-key / infinite-scroll / optimistic-update requirements.

---

## Technical Context

**Language / Framework**: TypeScript 5.x strict, Next.js 15.5.9 (App Router), React 19.1.4
**Runtime**: Node dev via Turbopack; production on Cloudflare Workers via `@opennextjs/cloudflare`
**Primary Dependencies**: `@supabase/ssr` 0.8.x, `@supabase/supabase-js` 2.90.x, Tailwind v4, Jest 29 + Testing Library
**New Dependency** (this plan): `@tanstack/react-query` ^5 + `@tanstack/react-query-devtools` (dev-only) — see Violations
**Database**: Supabase Postgres with RLS + Supabase Realtime
**Testing**: Jest + jsdom for unit/component, Jest + node + real Supabase for integration, Playwright (future) for E2E
**State Management**: TanStack Query for server state, React hooks (`useState`/`useReducer`) for transient UI state, cookie + i18n dict for locale, Supabase session (no client store)
**API Style**: Server Components call services directly; mutations go through the Supabase browser client or Supabase RPC. No REST/GraphQL layer is introduced.

---

## Constitution Compliance Check

*GATE: Must pass before implementation can begin*

- [x] **Clean Architecture** — Route handlers thin (none are needed), business logic in `src/services/*-service.ts`, Supabase clients in `src/libs/supabase/`. Kebab-case for non-component modules, PascalCase for components.
- [x] **UI/UX Excellence** — Responsive at 3 breakpoints, CSS tokens defined in `globals.css` and consumed via Tailwind v4 + `var(--token)`. No hard-coded colors/spacing/typography in components. All URLs derived from SCREENFLOW.md or flagged as predicted (spec Q13). Assets under `public/assets/kudos/{icons|images|logos}/` in kebab-case.
- [x] **Test-First (NON-NEGOTIABLE)** — Every task phase writes failing tests first (service test → component test → integration test). Integration tests hit real Supabase (local CLI), never mock DB.
- [x] **Security by Design** — RLS on every new table; `SECURITY DEFINER` RPCs for heart toggle + gift open; middleware protects `/kudos`; no secrets in client; input validation via Zod at service boundary.
- [x] **Simplicity & YAGNI** — No speculative abstractions; reuse `AppHeader`, `AppFooter`, existing tokens, existing middleware pattern. Carousel built inline rather than pulled in as a library.

### Violations (requires PR-level justification)

| Violation                               | Justification                                                                                                  | Alternative Rejected                                                                                                                         |
| --------------------------------------- | -------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| New dep: `@tanstack/react-query` ^5     | Spec mandates cache keys, stale-time, background refetch, infinite scroll, optimistic mutations, and invalidations. Hand-rolling these is bug-prone and duplicates ~500 LOC in hooks. Library is industry-standard, first-class Next.js + React 19 support, tree-shakeable. | Hand-rolled hooks: rejected because it re-implements cache/stale/retry semantics we'd otherwise get for free and makes future screens harder to build consistently. SWR: considered but TanStack Query's optimistic update + infinite-query ergonomics fit the spec's heart flow and feed pagination better. |
| New dev dep: `@tanstack/react-query-devtools` | Local debugging only; stripped in prod via Next.js `NODE_ENV` gate.                                      | None — devtools are commonly paired with the library.                                                                                        |
| New dep: `@tanstack/react-virtual` ^3   | Spec TR-008 requires virtualization of the All-Kudos feed above 30 items. Library is ~3 KB gzipped, no external deps, widely used on Next.js + RSC.                                 | DIY virtualization: rejected because scroll position + variable-height rows on a shared container is non-trivial and not a differentiator.  |

No further new runtime deps. No new abstractions are introduced.

---

## Architecture Decisions

### Frontend Approach

- **Component Structure**: Feature folder `src/components/kudos/` with atoms/molecules/organisms colocated (same flat pattern as `components/homepage/`).
- **Rendering Strategy**: Page is a **Server Component**. Hero and section headers render server-side with no hydration cost. Interactive leaves (`HighlightCarousel`, `FilterDropdowns`, `KudoFeed`, `HeartsButton`, `CopyLinkButton`, `SpotlightCanvas`, `OpenGiftButton`) are Client Components with `'use client'`.
- **Styling Strategy**: CSS variables in `src/app/globals.css` (extend with a new per-screen block); consumed via Tailwind utilities (where mapped) and direct `var(--token)` in `style={{…}}` on dynamic spots. NO arbitrary-value Tailwind classes like `bg-[#FFEA9E]`.
- **Data Fetching**:
  - **Server side**: Server Components call services directly (same as `app/page.tsx`). For sections whose initial data we want on the hydrated Query cache, we pass the server-fetched data as `initialData` into the client-side `useQuery(key, fetcher, { initialData })`. This avoids the experimental `hydrate`/`dehydrate` flow and keeps the bundle free of `@tanstack/react-query-next-experimental`.
  - **Client side**: TanStack Query hooks wrap the Supabase browser client.
    - `useKudosFeed(filter)` — `useInfiniteQuery` keyed on `['kudos-feed', filter]`
    - `useKudoHighlights(filter)` — `useQuery` keyed on `['kudos-highlights', filter]`
    - `useUserStats()` — `useQuery`
    - `useHeartKudo(kudoId)` — `useMutation` with optimistic update
    - `useOpenSecretBox()` — `useMutation`
  - **Realtime**: `useKudosRealtime()` subscribes to Supabase `postgres_changes` on `live_kudo_events` and invalidates the `['kudos-feed']` + `['kudos-spotlight']` keys while pushing ticker events into local state.
- **i18n**: existing `useTranslation()` client hook + `getDictionary()` server helper. Add new keys under `kudos.*` to both `vi.ts` and `en.ts`.
- **Icon Component**: new `src/components/kudos/Icon.tsx` atom — `<Icon name="pen" size={24} />` → renders `/assets/kudos/icons/pen.svg` via `next/image`. All icons flow through this atom (no raw SVG/img in business components).

### Backend Approach

- **Data Access**: Supabase Postgres accessed via `@supabase/ssr` / `@supabase/supabase-js`. Business logic sits in `src/services/kudos-service.ts` (+ splits as needed). No separate repository layer.
- **API Design**: Purely Supabase — Server Components + browser mutations + RPC. No REST `/api/*` route handlers unless a specific reason arises.
- **Atomic operations via RPC** (`SECURITY DEFINER`, RLS-aware):
  - `toggle_kudo_heart(p_kudo_id uuid) → jsonb { liked bool, count int }`
  - `open_secret_box(p_box_id uuid) → jsonb { gift_description text, stats { opened_count, unopened_count } }`
- **Validation**: Zod schemas per service at the boundary between client-submitted args and Supabase parameters. DTO mappers (inline) keep camelCase types separate from snake_case rows.
- **Realtime**: Enable `live_kudo_events` in `supabase_realtime` publication. A Postgres trigger on `kudos` INSERT inserts a row into `live_kudo_events`.

### Integration Points

- **Existing Services**: `auth-service.ts` (Google OAuth) — not extended. `homepage-service.ts` / `awards-service.ts` — not extended except to add `doubleHeartActive` + `highlightLimit` columns to `fetchEventConfig`.
- **Shared Components**: `AppHeader`, `AppFooter`, `WidgetButton`, `LanguageToggle`. **`WidgetButton` WILL be rendered on `/kudos`** for consistency with Homepage (resolves research RN4).
- **Shared Tokens**: existing Homepage / Awards tokens in `globals.css` cover ~80% of the palette. New tokens added: `--color-card-cream`, `--color-panel`, `--color-heart-active`, `--color-heart-accent`, `--color-muted-gray`, `--color-border-gold` (if not already named identically), `--radius-card-feed`, `--radius-card-highlight`, `--radius-panel`, `--radius-pill`, `--radius-canvas`.
- **Middleware**: add `'/kudos'` to `PROTECTED_ROUTES` in `src/middleware.ts`.

### Data → Implementation Mapping (each spec API traced to an implementation surface)

| Spec API Endpoint                      | Implementation surface                                                                                             |
| -------------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| `GET /api/users/me`                    | **No service needed** — fulfilled directly via `supabase.auth.getUser()` in the server component; user id is injected into services that need it. |
| `GET /api/users/me/stats`              | `fetchUserStats(userId)` in `user-stats-service.ts` (reads from `profiles` + aggregate counts on `kudos`/`kudo_hearts`/`secret_boxes`) |
| `GET /api/kudos` (paginated feed)      | `fetchKudosFeed({ filter, cursor, limit })` in `kudos-service.ts` + client hook `useKudosFeed`                      |
| `GET /api/kudos/{id}`                  | `fetchKudoById(id)` in `kudos-service.ts` (used by View Kudo stub and hover preview)                                |
| `GET /api/kudos/highlights`            | `fetchKudosHighlights(filter)` in `kudos-service.ts` + client hook `useKudoHighlights`                              |
| `GET /api/kudos/hashtags`              | `fetchHashtags()` in `hashtags-service.ts`                                                                           |
| `GET /api/departments`                 | `fetchDepartments()` in `departments-service.ts`                                                                     |
| `GET /api/kudos/spotlight`             | `fetchKudosSpotlight(filter)` in `kudos-service.ts` — returns `{ totalCount, entries: SpotlightEntry[] }` (whole list; client filters)      |
| `GET /api/kudos/spotlight/search`      | **Client-side filter by default** — no API call when the spotlight entries array is fully loaded. Fallback: if the list is truncated (> 2000 entries), the hook falls back to `fetchSpotlightSearch(q)` in `kudos-service.ts`. |
| `kudos_live` (Supabase Realtime)       | `useKudosRealtime()` client hook subscribes via `supabase.channel('kudos_live').on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'live_kudo_events' }, …).subscribe()` |
| `POST /api/kudos/{id}/hearts`          | `toggle_kudo_heart` RPC → wrapped by `useHeartKudo` mutation                                                        |
| `GET /api/gifts/top-recipients`        | `fetchTopGiftRecipients()` in `gifts-service.ts` + `useQuery(['gifts-top-recipients'])`                             |
| `POST /api/gifts/open`                 | `open_secret_box` RPC → wrapped by `useOpenSecretBox` mutation                                                      |
| `GET /api/event-config`                | Extend existing `fetchEventConfig()` in `homepage-service.ts` with new columns                                      |

### Error Handling Matrix (TR-009)

| Error source                                  | Detection                                       | Action                                                                                                                  |
| --------------------------------------------- | ----------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| 401 on any server-side service call           | Middleware already redirects unauthenticated requests; service throws on expired token inside a page render → caught by a `notFound()` / `redirect()` branch | Redirect to `/auth/login`                                                                                                |
| 401 on client mutation / query                | QueryProvider global `onError` inspects Supabase `PostgrestError.code`/status | Redirect using `router.push('/auth/login')`                                                                              |
| 403 `event_not_launched`                       | `fetchEventConfig()` returns `launch_at > now()` OR service throws `P0003` from RPC | Server component returns `redirect('/prelaunch')`; client-side hook returns `{ error: 'prelaunch' }` and page performs `router.replace('/prelaunch')` |
| 403 RLS policy denial                         | Supabase returns `PGRST116` / custom `P0001`    | Show inline error in section + `<RetryButton />`; no redirect                                                            |
| 429 `rate_limited` from `toggle_kudo_heart`    | RPC error `P0001 rate_limited`                  | Show toast "Bạn đã vote quá nhanh, thử lại sau"; disable heart for 1 s; `aria-live` polite announcement                 |
| Network offline / 5xx on feed page fetch      | `useInfiniteQuery` `error`                      | Sentinel shows `<RetryButton />`                                                                                         |
| Realtime channel disconnect                   | `channel.on('system', { event: 'CHANNEL_ERROR' })` | `LiveTicker` hides ticker; Supabase client auto-reconnects with back-off                                                 |
| Heart POST fails mid-flight                    | `useMutation` `onError`                         | Revert optimistic cache; toast key `kudos.heart.error`                                                                   |
| Copy clipboard unavailable                    | `navigator.clipboard` undefined OR throws      | Fall back to `document.execCommand('copy')` on a hidden `<textarea>`; on both failing, toast key `kudos.card.copyFailed` |

---

## Project Structure

### Documentation (this feature)

```text
.momorph/specs/MaZUn5xHXZ-sun-kudos-live-board/
├── spec.md              ✅ exists
├── plan.md              ← this file
├── research.md          ✅ exists
├── design-style.md      ✅ exists
├── tasks.md             ← created by /momorph.tasks
├── testcase.md          ← created by /momorph.createtestcases (later)
└── assets/
    └── frame.png        ✅ exists
```

### Source Code — New Files

| File                                                                      | Purpose                                                          |
| ------------------------------------------------------------------------- | ---------------------------------------------------------------- |
| `src/app/kudos/page.tsx`                                                  | Sun* Kudos - Live Board page (Server Component)                  |
| `src/app/kudos/compose/page.tsx`                                          | **Stub** route for Viết Kudo — out of scope body                 |
| `src/app/kudos/search/page.tsx`                                           | **Stub** route for Tìm kiếm Sunner — out of scope body           |
| `src/app/kudos/[id]/page.tsx`                                             | **Stub** route for View Kudo detail — out of scope body          |
| `src/app/users/[id]/page.tsx`                                             | **Stub** route for Profile người khác — out of scope body        |
| `src/providers/QueryProvider.tsx`                                         | `QueryClientProvider` wrapper (client) to be mounted in a client boundary |
| `src/services/kudos-service.ts`                                           | All server-side Kudos reads (highlights, feed, spotlight, taxonomies) |
| `src/services/user-stats-service.ts`                                      | Personal stats reads                                              |
| `src/services/gifts-service.ts`                                           | Gifts / secret box reads + RPC wrappers                           |
| `src/services/hashtags-service.ts`                                        | Hashtag listing                                                  |
| `src/services/departments-service.ts`                                     | Department listing                                               |
| `src/hooks/use-kudos-feed.ts`                                             | `useInfiniteQuery` for All Kudos                                 |
| `src/hooks/use-kudo-highlights.ts`                                        | `useQuery` for Highlight carousel                                |
| `src/hooks/use-user-stats.ts`                                             | `useQuery` for stats panel                                       |
| `src/hooks/use-heart-kudo.ts`                                             | `useMutation` for heart toggle (calls RPC)                       |
| `src/hooks/use-open-secret-box.ts`                                        | `useMutation` for gift open                                      |
| `src/hooks/use-kudos-realtime.ts`                                         | Supabase Realtime subscription + TanStack invalidations          |
| `src/hooks/use-spotlight-positions.ts`                                    | Deterministic-seed client-side layout                            |
| `src/hooks/use-copy-to-clipboard.ts`                                      | Clipboard write + fallback + toast                               |
| `src/hooks/use-toast.ts` (or equivalent lightweight singleton)            | App-wide toast dispatch                                           |
| `src/components/kudos/Icon.tsx`                                           | Icon atom mapping name → SVG asset                                |
| `src/components/kudos/PillCTA.tsx`                                        | Hero pill button (A.1 + A.2 variants)                             |
| `src/components/kudos/KudosHero.tsx`                                      | A_KV Kudos hero organism                                          |
| `src/components/kudos/SectionTitle.tsx`                                   | Shared section heading (B.1, B.6, C.1)                            |
| `src/components/kudos/DropdownFilter.tsx`                                 | Hashtag / Department filter button + list                         |
| `src/components/kudos/HighlightCarousel.tsx`                              | B.2 carousel (prev/next, pagination, dims sides)                  |
| `src/components/kudos/KudoCard.tsx`                                       | Shared card with `variant="highlight" \| "feed"`                  |
| `src/components/kudos/KudoHeader.tsx`                                     | Sender → arrow → receiver row                                     |
| `src/components/kudos/HeartsButton.tsx`                                   | C.4.1 / B.4.4 hearts with ownership + optimistic state            |
| `src/components/kudos/CopyLinkButton.tsx`                                 | C.4.2                                                             |
| `src/components/kudos/ViewDetailLink.tsx`                                 | "Xem chi tiết" action                                             |
| `src/components/kudos/HashtagChip.tsx`                                    | Clickable `#tag` + `D.4` pill                                     |
| `src/components/kudos/ImageGallery.tsx`                                   | C.3.6 thumbs + lightbox (keyboard nav + focus trap)               |
| `src/components/kudos/ImageLightbox.tsx`                                  | Fullscreen viewer                                                 |
| `src/components/kudos/SpotlightCanvas.tsx`                                | B.7 canvas (pan/zoom, search, name cloud)                         |
| `src/components/kudos/SunnerSearchInput.tsx`                              | B.7.3                                                             |
| `src/components/kudos/PanZoomControls.tsx`                                | B.7.2                                                             |
| `src/components/kudos/LiveTicker.tsx`                                     | `aria-live` polite ticker                                         |
| `src/components/kudos/KudoFeed.tsx`                                       | C.2 infinite-scroll feed                                          |
| `src/components/kudos/StatsPanel.tsx`                                     | D.1                                                               |
| `src/components/kudos/StatRow.tsx`                                        | D.1.2 – D.1.7                                                      |
| `src/components/kudos/OpenGiftButton.tsx`                                 | D.1.8                                                             |
| `src/components/kudos/TopRecipientsPanel.tsx`                             | D.3                                                               |
| `src/components/kudos/HoaThiBadge.tsx`                                    | Star badge with tooltip                                           |
| `src/components/kudos/DanhHieuBadge.tsx`                                  | `New Hero / Rising Hero / Super Hero / Legend Hero` pill          |
| `src/components/kudos/Toast.tsx` + `src/providers/ToastProvider.tsx`       | Toast primitive + React-context provider + `useToast()` hook (no existing toast in repo) |
| `src/components/kudos/SectionErrorBoundary.tsx`                          | React 19 error boundary used per section to isolate failures (FR-019, TR-009)  |
| `src/components/kudos/RetryButton.tsx`                                   | Inline retry affordance used by sections + feed pagination failures            |
| `src/components/kudos/skeletons/KudoCardSkeleton.tsx`                    | Feed + highlight skeleton (3-5 placeholders)                                   |
| `src/components/kudos/skeletons/StatsPanelSkeleton.tsx`                  | Stats panel `—` placeholders                                                  |
| `src/components/kudos/skeletons/SpotlightSkeleton.tsx`                   | Spotlight canvas spinner state                                                 |
| `src/components/kudos/skeletons/TopRecipientsSkeleton.tsx`               | 10 skeleton rows                                                                |
| `src/types/kudos.ts`                                                     | All Kudos DTOs: `Kudo`, `KudoCard`, `SunnerRef`, `Highlight`, `SpotlightEntry`, `UserStats`, `Gift`, `LiveKudoEvent`, `Hashtag`, `Department` |
| `supabase/migrations/20260420120000_create_kudos_tables.sql`              | Schema for all 8 new tables + RLS + RPC `toggle_kudo_heart` + `open_secret_box` + Realtime publication |
| `supabase/migrations/20260420121000_extend_event_config.sql`              | Add `double_heart_active boolean`, `highlight_limit int`          |
| `supabase/seeds/dev/kudos-seed.sql`                                       | Development fixtures                                              |
| `public/assets/kudos/icons/{pen,search,chevron-down,chevron-left,chevron-right,send,heart,link,open-gift,pan-zoom,star,bell,widget}.svg` | Icon assets per Asset Registry in design-style.md |
| `public/assets/kudos/images/{kv-kudos.png,spotlight-aurora.png}`          | Decorative imagery                                                 |
| `public/assets/kudos/logos/kudos-logo.svg`                                | Hero brand wordmark                                                |
| **Tests (mirror structure)**:                                             |                                                                   |
| `src/__tests__/services/kudos-service.test.ts`                            | DTO / query shape                                                  |
| `src/__tests__/services/user-stats-service.test.ts`                       |                                                                   |
| `src/__tests__/services/gifts-service.test.ts`                            |                                                                   |
| `src/__tests__/hooks/use-kudos-feed.test.ts`                              |                                                                   |
| `src/__tests__/hooks/use-heart-kudo.test.ts`                              |                                                                   |
| `src/__tests__/hooks/use-kudos-realtime.test.ts`                          |                                                                   |
| `src/__tests__/hooks/use-spotlight-positions.test.ts`                     |                                                                   |
| `src/__tests__/components/kudos/KudoCard.test.tsx`                        |                                                                   |
| `src/__tests__/components/kudos/HeartsButton.test.tsx`                    |                                                                   |
| `src/__tests__/components/kudos/HighlightCarousel.test.tsx`               |                                                                   |
| `src/__tests__/components/kudos/DropdownFilter.test.tsx`                  |                                                                   |
| `src/__tests__/components/kudos/KudoFeed.test.tsx`                        |                                                                   |
| `src/__tests__/components/kudos/SpotlightCanvas.test.tsx`                 |                                                                   |
| `src/__tests__/components/kudos/ImageGallery.test.tsx`                    |                                                                   |
| `src/__tests__/components/kudos/OpenGiftButton.test.tsx`                  |                                                                   |
| `src/__tests__/components/kudos/CopyLinkButton.test.tsx`                  | Both clipboard branches                                            |
| `src/__tests__/components/kudos/ImageLightbox.test.tsx`                   | Focus trap, arrow nav, Esc                                         |
| `src/__tests__/components/kudos/SectionErrorBoundary.test.tsx`            | Section-scoped failure isolation                                   |
| `src/__tests__/middleware.test.ts`                                        | Route protection: `/kudos` → `/auth/login` for unauthenticated     |
| `src/__tests__/helpers/renderWithQuery.tsx`                               | Test helper — wraps RTL `render` with a per-test `QueryClientProvider` and `ToastProvider` |
| `src/__tests__/integration/kudos-service.integration.test.ts`             | Real-Supabase: CRUD kudo, toggle heart, open gift, feed paginate, rate-limit error, RLS ownership, Realtime INSERT broadcast |

### Source Code — Modified Files

| File                                     | Changes                                                                                                  |
| ---------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| `src/app/globals.css`                    | Add `:root` block "Design Tokens — Sun* Kudos (MaZUn5xHXZ)" with net-new tokens + hover/focus state classes |
| `src/app/layout.tsx`                     | Wrap `{children}` in `<QueryProvider>` (client boundary) so all pages get TanStack Query                   |
| `src/components/layout/AppHeader.tsx`    | Change Kudos nav link `href` from `'#'` to `'/kudos'`; same in `AppFooter.tsx`                             |
| `src/components/layout/AppFooter.tsx`    | Same Kudos href update                                                                                    |
| `src/middleware.ts`                      | Add `'/kudos'` to `PROTECTED_ROUTES`                                                                      |
| `src/i18n/dictionaries/vi.ts`            | Add `kudos.*` keys (see Implementation Strategy for list)                                                  |
| `src/i18n/dictionaries/en.ts`            | Mirror EN translations                                                                                    |
| `src/types/homepage.ts`                  | Extend `EventConfig` to include `doubleHeartActive` and `highlightLimit`                                   |
| `src/services/homepage-service.ts`       | Read + map new columns in `fetchEventConfig`                                                               |
| `jest.setup.ts`                          | (If needed) register a `QueryClient` + cleanup helper for component tests                                 |
| `package.json`                           | `"@tanstack/react-query": "^5"` + devDependency `"@tanstack/react-query-devtools": "^5"`                  |

### Dependencies to Add

| Package                                    | Version | Purpose                                                                              |
| ------------------------------------------ | ------- | ------------------------------------------------------------------------------------ |
| `@tanstack/react-query`                    | ^5      | Server-state cache, infinite queries, optimistic mutations                           |
| `@tanstack/react-query-devtools`           | ^5 (dev) | Dev-time inspector; tree-shaken in production                                        |
| `@tanstack/react-virtual`                  | ^3      | Virtualization of the All-Kudos feed after >30 items (TR-008). Tree-shakes to ~3 KB. |

(No other runtime deps required. No test-only helpers beyond what Jest + Testing Library already provide.)

---

## Implementation Strategy

### Spec → Plan Trace Matrix

| Spec item                                                | Plan phase(s)                                                               |
| -------------------------------------------------------- | --------------------------------------------------------------------------- |
| US1 (Browse + React + Copy) P1                           | Phase 3                                                                      |
| US2 (Compose + Realtime) P1                              | Phase 4                                                                      |
| US3 (Filter) P2                                          | Phase 5                                                                      |
| US4 (Spotlight) P2                                       | Phase 6                                                                      |
| US5 (Stats + Secret Box) P2                              | Phase 7                                                                      |
| US6 (Profile links) P3                                   | Phase 8                                                                      |
| FR-001 top N highlight                                   | Phase 1 (schema) + Phase 3                                                  |
| FR-002 arrow disable                                     | Phase 3                                                                      |
| FR-003 filter both sections + pagination reset           | Phase 5                                                                      |
| FR-004…FR-006 heart rules + x2                           | Phase 1 RPC + Phase 3                                                        |
| FR-007 copy link                                         | Phase 3                                                                      |
| FR-008 infinite scroll                                   | Phase 3                                                                      |
| FR-009 content / hashtag / image clamps                  | Phase 3 (KudoCard tests)                                                    |
| FR-010 hashtag chip → filter                             | Phase 5                                                                      |
| FR-011 spotlight counter from DB                         | Phase 1 (query) + Phase 6                                                   |
| FR-012 pan/zoom                                          | Phase 6                                                                      |
| FR-013 spotlight search ≤100 chars                       | Phase 6                                                                      |
| FR-014 Supabase Realtime                                 | Phase 1 (publication) + Phase 4                                             |
| FR-015 stats panel                                       | Phase 7                                                                      |
| FR-016 open gift disabled rules                          | Phase 7                                                                      |
| FR-017 profile nav                                       | Phase 8                                                                      |
| FR-017a Xem chi tiết → /kudos/{id}                       | Phase 3                                                                      |
| FR-017b image lightbox                                   | Phase 3                                                                      |
| FR-018 hoa thị tooltip                                   | Phase 7 (HoaThiBadge)                                                        |
| FR-019 empty states                                      | Phase 9 polish + each phase's empty-state wiring                             |
| FR-020 i18n                                              | Phase 2                                                                      |
| TR-001 stack                                             | Technical Context + entire plan                                              |
| TR-002 TanStack Query                                    | Violations + Phase 1                                                         |
| TR-003 heart idempotency                                 | Phase 1 RPC                                                                  |
| TR-004 heart debounce + rate limit                       | Phase 1 RPC (server) + Phase 3 (client)                                     |
| TR-005 clipboard fallback                                | Phase 3                                                                      |
| TR-006 Realtime event_id dedup                           | Phase 4                                                                      |
| TR-007 deterministic spotlight seed                      | Phase 6                                                                      |
| TR-008 virtualization >30                                | Phase 3 + dep `@tanstack/react-virtual`                                      |
| TR-009 401/403/429/5xx matrix                            | Error Handling Matrix (above) + Phase 9                                      |
| TR-010 LCP/INP perf                                      | Phase 9                                                                      |
| TR-011 hydration strategy                                | Architecture Decisions — `initialData` approach                              |
| TR-012 clean architecture                                | Compliance table                                                             |
| TR-013 asset paths                                       | Phase 0                                                                      |

### Phase 0: Asset Preparation

**Goal**: bring all Figma-referenced assets into the repo.

Actions:
1. Export each icon/image listed in `design-style.md` → Asset Registry via the Figma MCP tool `get_media_files` (or manual SVG export from Figma). Target paths:
   - `public/assets/kudos/icons/`
   - `public/assets/kudos/images/`
   - `public/assets/kudos/logos/`
2. Verify each asset: dimensions match the Figma source, kebab-case filename, SVG is optimized (no embedded metadata).
3. Add a short `public/assets/kudos/README.md` noting each asset's Figma node + purpose (search aid).

### Phase 1: Foundation & Data Layer (TDD: tests precede SQL + services)

**Goal**: DB schema + typed service layer + QueryProvider + shared layout hooks ready.

1. **Write failing integration test** `kudos-service.integration.test.ts` that expects to create a kudo, read highlights, toggle a heart, and paginate the feed against a freshly-migrated local Supabase.
2. **Create migration** `20260420120000_create_kudos_tables.sql`:
   - Tables: `profiles`, `departments`, `hashtags`, `kudos`, `kudo_hashtags`, `kudo_images`, `kudo_hearts`, `secret_boxes`, `live_kudo_events`.
   - Indexes on `(hearts_count desc)`, `(created_at desc)`, `(receiver_id)`, `(sender_id)`.
   - Triggers: auto-bump `kudos.hearts_count`; auto-insert into `live_kudo_events` after `kudos` INSERT.
   - RLS: SELECT for `authenticated`; INSERT/UPDATE/DELETE gated by ownership.
   - `alter publication supabase_realtime add table live_kudo_events;`
   - RPCs (`SECURITY DEFINER`, `set search_path = public, pg_temp`, validate `auth.uid()` inside body):
     - `toggle_kudo_heart(p_kudo_id uuid) returns jsonb` — checks sender-ownership (disable self-heart), reads `event_config.double_heart_active` to set `value` (1 or 2), **enforces rate limit** via advisory lock + inline check `select count(*) from kudo_hearts where user_id = auth.uid() and created_at > now() - interval '200 ms'` returning error `P0001 'rate_limited'` if exceeded (TR-004 server side; ~5 req/s).
     - `open_secret_box(p_box_id uuid) returns jsonb` — atomic update + returns `{ gift_description, stats: { opened, unopened } }`.
3. **Create migration** `20260420121000_extend_event_config.sql`:
   - Add `double_heart_active boolean not null default false`, `highlight_limit int not null default 5`.
4. **Create seed** `kudos-seed.sql` (6 departments, 20 hashtags, 50 kudos, 120 hearts, 5 secret boxes).
5. **Write failing unit test** `kudos-service.test.ts`, then implement `src/services/kudos-service.ts` with:
   - `fetchKudosHighlights(filter) → Highlight[]`
   - `fetchKudosSpotlight(filter) → { totalCount, entries }`
   - `fetchKudoById(id) → Kudo`
   - `fetchKudosFeed({ filter, cursor, limit })` (cursor-paginated via `.range()` or `created_at < cursor`)
6. Similarly for `hashtags-service.ts`, `departments-service.ts`, `user-stats-service.ts`, `gifts-service.ts`.
7. **Types** in `src/types/kudos.ts` — DTOs + narrow enums (`DanhHieu`, `HoaThiLevel`).
8. **QueryProvider** in `src/providers/QueryProvider.tsx` (client) with `staleTime: 60_000`, `refetchOnWindowFocus: true`, default retries = 1. Mount it inside `src/app/layout.tsx` so all pages benefit.
9. Run `yarn test` — all unit tests should now pass; integration test passes after `supabase db reset`.

**Gate**: all service unit tests green + integration test green.

### Phase 2: Page Shell + i18n + Middleware (TDD)

1. Update `src/middleware.ts` — add `'/kudos'`. Test: `middleware.test.ts` verifies unauthenticated `/kudos` → `/auth/login` redirect.
2. Update `AppHeader` / `AppFooter` Kudos href to `/kudos`. Tests update in `src/__tests__/components/layout/*.test.tsx`.
3. Add i18n keys (snippet below) and matching tests in `i18n/dictionaries/__tests__` if present.
4. Create `src/app/kudos/page.tsx` Server Component. Initial iteration renders `AppHeader activeNavKey="kudos"` + `KudosHero` + `SectionTitle` for each section + `AppFooter` + `WidgetButton`. No data wiring yet — just the shell.
5. Append a new `:root { … }` token block titled `/* Design Tokens — Sun* Kudos (MaZUn5xHXZ) */` **inside the existing `src/app/globals.css` file** (no new CSS file). Add matching `:root` overrides in the mobile / tablet `@media` blocks for any spacing tokens that differ from desktop.
6. Write a page-level snapshot test to lock the shell layout.

**Gate**: page renders with header, hero, section titles, and footer; passes shell test.

### Phase 3: User Story 1 (P1) — Browse + React + Copy Link

*Vertical slice covering `B_Highlight Kudos` + `C_All Kudos` + hearts + copy-link.*

Implements: FR-001, FR-002, FR-004, FR-005, FR-006, FR-007, FR-008, FR-009, FR-010, FR-017a, FR-017b, TR-003, TR-004, TR-005, TR-008.

1. **KudoCard atom** (`variant="highlight" | "feed"`) — write TL tests first for both variants: content clamp (3 vs 5 lines), hashtag overflow, image gallery max 5, hearts + copy-link slots, hover hoa thị tooltip slot.
2. **HashtagChip** — TL tests for `#tag` render and click → `onFilterChange(hashtag)`.
3. **HeartsButton** — TL tests for:
   - disabled-on-own-kudo with tooltip `kudos.heart.selfDisabled`;
   - optimistic increment → server reconcile;
   - revert + error toast on RPC failure (FR-006);
   - client debounce ≥ 400ms (TR-004) enforced via `lodash.debounce`-equivalent inside the hook;
   - `aria-pressed` + dynamic `aria-label`.
   Implementation uses `useHeartKudo` which wraps `supabase.rpc('toggle_kudo_heart', { p_kudo_id })` and applies an optimistic patch on `['kudos-feed']` + `['kudos-highlights']` + `['user-stats']` via `queryClient.setQueryData`.
4. **CopyLinkButton** — TL tests for both clipboard branches (`navigator.clipboard.writeText` + `document.execCommand('copy')` fallback) and error path (TR-005). Toast keys `kudos.card.copied` / `kudos.card.copyFailed`.
5. **ViewDetailLink** — `<Link href={`/kudos/${id}`}>` rendered inside card actions (FR-017a). TL test asserts anchor target.
6. **ImageGallery + ImageLightbox** (FR-017b) — TL tests for:
   - thumb click opens lightbox at correct index;
   - Escape closes;
   - backdrop click closes;
   - `←` / `→` navigate;
   - focus trap (check `document.activeElement` stays inside);
   - index indicator `i/5`;
   - `aria-label="Xem ảnh {i}/{total}"`.
7. **HighlightCarousel** — TL tests for prev/next disabled at ends, keyboard arrow nav (`←`/`→`, Home/End), pagination counter `current/total`, hides / "empty" copy on zero results, dim-and-scale non-active cards (opacity 0.5, scale 0.92).
8. **KudoFeed** — TL tests for:
   - `useInfiniteQuery` first page render;
   - `IntersectionObserver` sentinel loads next page when within 400px of bottom (FR-008);
   - retry button on page-fetch failure;
   - empty state copy;
   - virtualization switch-on at > 30 loaded items (TR-008) via `@tanstack/react-virtual` (dev dep; add in Phase 1 if committed).
9. Wire both sections into `app/kudos/page.tsx` Server Component: initial Highlight data fetched server-side, passed as `initialData` into the client component; feed initial page fetched client-side (avoids streaming a large payload from RSC).
10. **Toast host** mounted globally via a new `ToastProvider` (React context + `useToast` hook); include in the `QueryProvider` wrapper mounted in `src/app/layout.tsx`.

**Gate**: P1 ACs in spec pass manually; unit + component tests green; integration test still green; FR-008, FR-017a, FR-017b and TR-004 explicitly exercised in tests.

### Phase 4: User Story 2 (P1) — Compose + Realtime Ticker

1. Wire `A.1 Button ghi nhận` → `Link` to `/kudos/compose`. Stub page renders "Coming soon".
2. `use-kudos-realtime.ts` — subscribe on mount, tear down on unmount, accumulate last N events (ring buffer of 10), invalidate `['kudos-feed']` + `['kudos-spotlight']` on each new event. Tests mock Supabase channel.
3. `LiveTicker` — renders the ring buffer with `aria-live="polite"`; CSS fade-in animation respecting `prefers-reduced-motion`.
4. Manual E2E: compose a kudo via `supabase sql` → confirm ticker line appears within 3 seconds.

**Gate**: creating a new kudo from any session updates the ticker on another session within the SC-005 latency budget.

### Phase 5: User Story 3 (P2) — Hashtag / Department Filters

1. `DropdownFilter` — TL tests for open/close, keyboard selection (Arrow Up/Down/Enter/Esc), ARIA expanded state.
2. Wire filter state into a shared `filter` object passed down to `HighlightCarousel` and `KudoFeed`.
3. Filter param fan-out to `['kudos-highlights', filter]` and `['kudos-feed', filter]` keys.
4. Hashtag chip click inside any card sets the shared hashtag filter.
5. Tests for the "stale filter" edge case (currently selected filter value no longer exists).

**Gate**: selecting a hashtag or department refetches both sections with correct counts; filter chip click works both ways.

### Phase 6: User Story 4 (P2) — Spotlight Board

1. `use-spotlight-positions.ts` — deterministic seeded layout (`mulberry32` PRNG seeded by `user_id + kudos_received_count`). Unit tests confirm identical output for identical input and different output for different seeds.
2. `SpotlightCanvas` — renders names, handles pan (pointer events) + zoom (wheel + buttons), `prefers-reduced-motion` disables pan-tweening.
3. `SunnerSearchInput` — debounced client-side filter highlighting / dimming.
4. `PanZoomControls` — toggles mode, shows tooltip.
5. `LiveTicker` reused inside the canvas bottom-left.
6. Hover-tooltip on names and click-through to `/users/{id}` or `/kudos/{id}` per Q11 outcome.

**Gate**: canvas is interactive, names are deterministic, search dims/highlights; ticker continues to stream.

### Phase 7: User Story 5 (P2) — Stats Panel + Secret Box

1. `StatsPanel` + `StatRow` — data fed by `useUserStats()`.
2. `OpenGiftButton` — disabled when unopened == 0; calls `open_secret_box` RPC; on success invalidates `['user-stats']` + `['gifts-top-recipients']` and pushes a navigation/popup for Gift Receive (stub).
3. `TopRecipientsPanel` — data fed by `useQuery(['gifts-top-recipients'])`.
4. `HoaThiBadge` / `DanhHieuBadge` — tooltips render thresholds from the Data Requirements table; tests assert exact VN copy.
5. `x2` badge on `D.1.4` tied to `event_config.double_heart_active`.

**Gate**: P2 ACs pass; hovering hoa thị shows correct copy.

### Phase 8: User Story 6 (P3) — Profile Links + Preview

1. Wire sender/receiver clicks and spotlight-name clicks to `/users/{id}` (stub route).
2. Hover delay 500ms → profile preview tooltip card (using a shared `ProfilePreview` small component that renders against the Figma frame `721:5827`). Defer full profile preview until Profile spec lands; show minimal card with name + department + danh hiệu + hoa thị.

**Gate**: all navigation points land on the stub; hover preview appears.

### Phase 9: Polish

1. **Error boundaries per section** — wrap each section (`HighlightKudosSection`, `SpotlightSection`, `AllKudosSection`, `SidebarColumn`) in `<SectionErrorBoundary>` so a failure in one doesn't nuke the page.
2. **Skeletons + empty states** — wire the skeleton components added in the new-files table into each section's suspense / loading branch.
3. **Accessibility audit** — run `axe-core` via Playwright or `jest-axe`; manually walk tab order (per spec Accessibility section); run NVDA / VoiceOver smoke. Fix any violations.
4. **Analytics events** — add `src/libs/analytics.ts` with a minimal `trackEvent(name: string, props: Record<string, unknown>)` stub that `console.debug`s in dev and POSTs to `/api/analytics` (no-op on Cloudflare for now). Instrument the nine events listed in spec → Analytics Events Optional table.
5. **Performance pass**:
   - Measure with Next.js built-in `useReportWebVitals` (added in `app/layout.tsx`) logging `LCP`, `INP`, `CLS` to the console and to the analytics stub.
   - Run a Lighthouse desktop + Lighthouse mobile (Moto G4 4G) on the Cloudflare preview build; record p75 numbers.
   - If LCP > 2.5s, move Spotlight and All-Kudos hydration behind `next/dynamic({ ssr: false })` + intersection observer.
   - If INP > 200ms on heart click, inspect React commit phase; memoize `KudoCard`.
6. **Update `SCREENFLOW.md`** — flip `/kudos` status from `discovered` to `implemented`; extend the Discovery Log with the implementation date.
7. Run `yarn lint` + `yarn build` — no errors. Confirm the Cloudflare Worker bundle size grew by < 150 KB after TanStack Query and the new components (check `.next/analyze` or OpenNext bundle report).

---

### New i18n Keys (add to `vi.ts` + `en.ts`)

```ts
// Kudos - Live Board
'kudos.hero.slogan': 'Hệ thống ghi nhận và cảm ơn' | 'Recognition & Thanks Platform',
'kudos.hero.composePlaceholder': 'Hôm nay, bạn muốn gửi lời cảm ơn và ghi nhận đến ai?' | 'Who would you like to thank today?',
'kudos.hero.searchSunner': 'Tìm kiếm sunner' | 'Search Sunner',
'kudos.filter.hashtag': 'Hashtag' | 'Hashtag',
'kudos.filter.department': 'Phòng ban' | 'Department',
'kudos.section.event': 'Sun* Annual Awards 2025' | 'Sun* Annual Awards 2025',
'kudos.section.highlight': 'HIGHLIGHT KUDOS' | 'HIGHLIGHT KUDOS',
'kudos.section.spotlight': 'SPOTLIGHT BOARD' | 'SPOTLIGHT BOARD',
'kudos.section.all': 'ALL KUDOS' | 'ALL KUDOS',
'kudos.empty': 'Hiện tại chưa có Kudos nào.' | 'No kudos yet.',
'kudos.card.viewDetail': 'Xem chi tiết' | 'View detail',
'kudos.card.copyLink': 'Copy Link' | 'Copy Link',
'kudos.card.copied': 'Link copied — ready to share!' | 'Link copied — ready to share!',
'kudos.card.copyFailed': 'Không thể sao chép liên kết' | 'Couldn’t copy the link',
'kudos.heart.selfDisabled': 'Bạn không thể thả tim cho kudos của mình' | 'You can’t heart your own kudo',
'kudos.heart.error': 'Không thể lưu lượt thả tim, vui lòng thử lại' | 'Could not save the heart, please try again',
'kudos.stats.received': 'Số Kudos bạn nhận được:' | 'Kudos received:',
'kudos.stats.sent': 'Số Kudos bạn đã gửi:' | 'Kudos sent:',
'kudos.stats.hearts': 'Số tim bạn nhận được:' | 'Hearts received:',
'kudos.stats.boxOpened': 'Số Secret Box bạn đã mở:' | 'Secret boxes opened:',
'kudos.stats.boxUnopened': 'Số Secret Box chưa mở:' | 'Secret boxes unopened:',
'kudos.stats.openGift': 'Mở quà' | 'Open gift',
'kudos.stats.noGifts': 'Bạn chưa có hộp quà nào' | 'You have no unopened gifts',
'kudos.topRecipients.title': '10 SUNNER NHẬN QUÀ MỚI NHẤT' | 'LATEST 10 GIFT RECIPIENTS',
'kudos.topRecipients.empty': 'Chưa có dữ liệu' | 'No data yet',
'kudos.spotlight.counterSuffix': 'KUDOS' | 'KUDOS',
'kudos.spotlight.search': 'Tìm kiếm' | 'Search',
'kudos.spotlight.liveTicker': '{time} {name} đã nhận được một Kudos mới' | '{time} {name} just received a new Kudo',
'kudos.hoaThi.1': 'Sunner đã nhận được 10 Kudos và bắt đầu lan tỏa năng lượng ấm áp đến mọi người xung quanh.' | '…',
'kudos.hoaThi.2': 'Sunner đã nhận được 20 Kudos và chứng minh sức ảnh hưởng của mình qua những hành động lan tỏa tích cực mỗi ngày.' | '…',
'kudos.hoaThi.3': 'Sunner đã nhận được 50 Kudos và trở thành hình mẫu của sự công nhận, sẻ chia và lan tỏa tinh thần Sun*.' | '…',
'kudos.filter.stale': 'Bộ lọc đã được cập nhật' | 'Filter was updated',
'kudos.image.ariaLabel': 'Xem ảnh {i}/{total}' | 'View image {i}/{total}',
```

### Risk Assessment

| Risk                                                                                 | Probability | Impact | Mitigation                                                                                                                          |
| ------------------------------------------------------------------------------------ | ----------- | ------ | ----------------------------------------------------------------------------------------------------------------------------------- |
| `@tanstack/react-query` dep rejected by reviewer                                     | Low         | High   | Plan already provides justification; fallback plan uses hand-rolled hooks (see research.md "Potential Challenges").                 |
| Supabase Realtime events arrive out-of-order / duplicate                             | Med         | Med    | Dedup by `event_id` in `useKudosRealtime`; drop older-than-oldest-in-buffer events.                                                 |
| Heart concurrency causing stale count                                                | Med         | Med    | `toggle_kudo_heart` RPC is atomic (single row transaction); server-side reconcile on the feed-refresh window.                       |
| Spotlight layout overlaps on small viewports                                         | Med         | Low    | Responsive breakpoint downscales the canvas; names are not positioned off-screen because the seed scales to container dimensions.    |
| Missing design for `/kudos/compose`, `/kudos/{id}`, `/users/{id}`                    | High        | Low    | Each gets a minimal stub page with a "Coming soon" message routed behind the auth middleware; marks these as out of scope in spec.  |
| RLS mis-configuration leaks private kudos / lets non-owners delete                   | Low         | High   | Integration tests assert forbidden actions return RLS errors; code review includes explicit RLS-matrix review.                      |
| Tailwind v4 `@theme` vs existing `:root` blocks                                      | Low         | Low    | Stay with `:root` for consistency; document choice in design-style.md Notes.                                                        |
| Cloudflare Workers bundle size with TanStack Query                                   | Low         | Med    | TanStack Query tree-shakes well; dev-tools wrapped in `process.env.NODE_ENV === 'development'`.                                     |

### Estimated Complexity

- **Frontend**: **High** (14 new interactive components, carousel, canvas, optimistic mutations, realtime subscription, i18n, a11y).
- **Backend**: **Medium** (8 new tables, 2 RPCs, RLS, Realtime publication, trigger).
- **Testing**: **High** (TDD-first on every task, integration tests against real Supabase, component tests with Testing Library).

---

## Integration Testing Strategy

### Test Scope

- [x] **Component / Module interactions**: KudoCard ↔ HeartsButton ↔ `use-heart-kudo` ↔ Query cache; KudoFeed ↔ IntersectionObserver ↔ `useInfiniteQuery`; SpotlightCanvas ↔ `useKudosRealtime`.
- [x] **External dependencies**: Supabase Auth (session), Supabase Postgres (RLS, RPC), Supabase Realtime (channel), Google OAuth (redirect flow).
- [x] **Data layer**: kudos CRUD, hearts atomic toggle, secret-box open, feed pagination, hashtag / department filter, spotlight aggregation.
- [x] **User workflows**: Browse feed → heart → copy link; Compose trigger → (stub); Filter hashtag → see both sections refresh; Open unopened secret box → popup + stats refresh.

### Test Categories

| Category            | Applicable? | Key Scenarios                                                                                              |
| ------------------- | ----------- | ---------------------------------------------------------------------------------------------------------- |
| UI ↔ Logic          | Yes         | Form fields, dropdowns, carousel, hearts                                                                   |
| Service ↔ Service   | Yes         | `kudos-service` + `user-stats-service` (stats mutate after heart)                                           |
| App ↔ External API  | Yes         | Supabase Auth, Realtime                                                                                    |
| App ↔ Data Layer    | Yes         | CRUD, RPC, realtime stream end-to-end                                                                      |
| Cross-platform      | Yes         | Responsive at mobile / tablet / desktop breakpoints; reduced motion                                        |

### Test Environment

- **Environment type**: Local Supabase CLI (`supabase start`) for integration; jsdom for unit/component (per `jest.config.ts`).
- **Test data strategy**: `supabase/seeds/dev/kudos-seed.sql` applied once per suite via `supabase db reset`; between tests each suite runs setup/teardown SQL that `truncate public.kudos, public.kudo_hearts, public.live_kudo_events, public.secret_boxes restart identity cascade` — much faster than a full `db reset`.
- **Isolation approach**:
  - Integration: wrap each `it` in a transaction via a Supabase service-role client + `BEGIN` / `ROLLBACK` where possible; otherwise fall back to truncate-per-test on the affected tables only.
  - Component: a per-test fresh `QueryClient` (created inside `renderWithQuery`) with `retry: false`, `gcTime: 0`.
- **`/** @jest-environment node */` marker** MUST be set on integration test files (existing pattern in `auth-service.test.ts`). Service unit tests that only mock Supabase may stay on jsdom.

### Mocking Strategy

| Dependency Type               | Strategy | Rationale                                                                    |
| ----------------------------- | -------- | ---------------------------------------------------------------------------- |
| Supabase client (unit/component) | Mock  | Deterministic; allows asserting queries/RPC args                              |
| Supabase client (integration)    | Real  | Constitution §III.5 forbids mocked DB                                         |
| Clipboard API                    | Mock  | Simulate both present and absent                                              |
| `IntersectionObserver`           | Mock  | jsdom doesn't implement it — use a tiny test double                           |
| `window.matchMedia` for reduced motion | Mock | jsdom limitation                                                        |
| Supabase Realtime channel        | Mock in unit, real in integration | Channel contract tested in integration via a second client      |

### Test Scenarios Outline

1. **Happy Path**
   - [ ] Authenticated user loads `/kudos` — Highlight carousel renders top N, feed renders first page, stats render, spotlight counter > 0.
   - [ ] User hearts a kudo — count increments, heart turns red, `user-stats` refreshes.
   - [ ] User copies a link — clipboard receives `{baseUrl}/kudos/{id}`, toast shown.
   - [ ] User opens an unopened secret box — stats update, popup appears.
   - [ ] Another client inserts a kudo — ticker line appears within 3s.
2. **Error Handling**
   - [ ] 401 from any API call — redirect to `/auth/login`.
   - [ ] 403 when campaign not running — redirect to `/prelaunch`.
   - [ ] Heart POST fails — optimistic state reverts + error toast.
   - [ ] Feed next page fails — retry button.
3. **Edge Cases**
   - [ ] Feed is empty — "Hiện tại chưa có Kudos nào." shown.
   - [ ] Only 1 highlight kudo — carousel renders 1/1, arrows disabled.
   - [ ] Stale filter — toast, reset to "All".
   - [ ] Own kudo — heart disabled with tooltip.
   - [ ] Reduced motion — animations disabled; auto-pulse removed.

### Tooling & Framework

- **Test framework**: Jest 29 + `@testing-library/react` + `@testing-library/jest-dom` (unit / component), Jest + node + Supabase CLI (integration).
- **Supporting tools**: `supabase` CLI for ephemeral DB, `msw` only if we need to stub HTTP (not currently).
- **CI integration**: existing `yarn test` script; CI pipeline to run `supabase start` → `supabase db reset --linked=false` → `yarn test`.

### Coverage Goals

| Area                               | Target   | Priority |
| ---------------------------------- | -------- | -------- |
| Services                            | 90%+     | High     |
| Hooks (`use-*`)                    | 85%+     | High     |
| Components (interactive leaves)    | 80%+     | High     |
| Page composition (Server Component) | snapshot + 1 smoke test | Medium |
| RLS + RPC behavior                 | 100% of policies / RPC branches exercised | High |

---

## Dependencies & Prerequisites

### Required Before Start

- [x] `constitution.md` reviewed
- [x] `spec.md` reviewed (v2)
- [x] `design-style.md` reviewed (v2)
- [x] `research.md` completed
- [ ] **Blocking spec Qs answered**: Q1 (heart beneficiary), Q9 (rank-up leaderboard scope), Q12 (Realtime channel contract), Q13 (predicted URLs), Q14 (overlay specs).
- [ ] **Blocking research Qs answered**: RN1 (approve `@tanstack/react-query` + `@tanstack/react-virtual`), RN2 (profiles table ownership), RN3 (confirm Realtime enabled on the Supabase project; if not, migration must add `alter publication supabase_realtime add table live_kudo_events`).
- [ ] Design team confirms `WidgetButton` should also render on `/kudos` (plan assumes yes).

### External Dependencies

- Supabase Auth + DB + Realtime (already integrated)
- Supabase Storage (for kudo images — Viết Kudo spec owns bucket creation; this page consumes URLs)

---

## Next Steps

After plan approval:

1. Answer blocking clarifications (Q1, Q12, Q13, Q14, RN1, RN2).
2. **Run** `/momorph.tasks` to expand this plan into an ordered task list with dependencies.
3. **Review** `tasks.md` for parallelization opportunities (Phase 0 asset prep + Phase 1 migration can run in parallel).
4. **Begin** implementation following task order — TDD red-green-refactor per task.

---

## Notes

- This plan intentionally defers full implementation of peripheral screens (`/kudos/compose`, `/kudos/{id}`, `/users/{id}`) to keep scope focused; each is a stub route with auth guard and a "Coming soon" placeholder until those screens get their own specs.
- Choosing `:root`-block tokens instead of Tailwind v4 `@theme` preserves consistency with the existing codebase (Homepage, Awards, Prelaunch all use `:root` blocks). The design-style.md note about `@theme` is aspirational — we can migrate all screens to `@theme` in a later housekeeping pass if the team chooses.
- No REST API routes are introduced. If a later Viết Kudo spec requires a compose-specific route handler (e.g., for image uploads), that feature will add it; Kudos Live Board stays 100% Server Components + browser-Supabase.
- `SECURITY DEFINER` RPCs must carefully use `set search_path = public, pg_temp` and validate `auth.uid()` inside the function body to prevent RLS bypass — called out in the Phase 1 TDD tests.
