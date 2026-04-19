# Research: Sun* Kudos - Live Board

**Frame**: `MaZUn5xHXZ-sun-kudos-live-board`
**Date**: 2026-04-20
**Spec**: `specs/MaZUn5xHXZ-sun-kudos-live-board/spec.md`

---

## Purpose

Codebase findings that inform the Kudos Live Board implementation plan. This captures existing patterns we MUST follow and integration points we MUST respect, plus where we need to extend the codebase.

---

## Stack Snapshot (from `package.json` + constitution)

| Concern           | Installed / Approved                                                                 |
| ----------------- | ------------------------------------------------------------------------------------ |
| Framework         | Next.js **15.5.9** (App Router, Turbopack dev)                                        |
| React             | **19.1.4** (server components default)                                                |
| Styling           | Tailwind **v4** (via `@tailwindcss/postcss`)                                          |
| Data              | **@supabase/ssr 0.8.x** + **@supabase/supabase-js 2.90.x**                            |
| Runtime target    | Cloudflare Workers via `@opennextjs/cloudflare` (build: `yarn deploy`)                |
| TypeScript        | 5.x strict                                                                            |
| Testing           | Jest 29 + `@testing-library/react` + jsdom; Supabase CLI for local DB                 |
| Package manager   | Yarn Classic 1.22.22                                                                  |

No data-fetching library (React Query / SWR) is installed — current screens fetch exclusively inside Server Components.

---

## Codebase Analysis

### Directory map

```
src/
├── app/
│   ├── auth/            — OAuth callback route
│   ├── awards/page.tsx  — Awards Information screen (server component)
│   ├── prelaunch/       — Countdown holding page
│   ├── globals.css      — all design tokens (per-screen :root blocks, not @theme yet)
│   ├── layout.tsx       — loads Montserrat + Montserrat Alternates via next/font/google
│   └── page.tsx         — Homepage SAA (server component)
├── components/
│   ├── awards/          — AwardsHeroKeyvisual, AwardDetailCard, AwardsLayout, AwardsSidebar, SidebarNavItem
│   ├── homepage/        — HeroSection, AwardsSection, KudosSection (reusable on Kudos page), CountdownTimer, CTAButtons, WidgetButton
│   ├── layout/          — AppHeader (client, with active-nav, mobile hamburger), AppFooter (server)
│   ├── login/           — LanguageToggle, LoginButton
│   └── prelaunch/       — PrelaunchCountdown, GlassDigitBox
├── hooks/
│   ├── use-countdown.ts
│   └── use-language.ts  — cookie-backed locale (reads localStorage → sets `lang` cookie)
├── i18n/
│   ├── dictionaries/{vi,en}.ts — flat key-value object; shared `Dictionary` type
│   ├── dictionaries.ts         — lookup by locale
│   ├── get-dictionary.ts       — reads `lang` cookie (server)
│   ├── use-translation.ts      — client hook
│   └── types.ts                — `Locale`, `DEFAULT_LOCALE`
├── libs/supabase/
│   ├── client.ts        — `createBrowserClient` for client components
│   ├── server.ts        — `createServerClient` with Next.js cookies adapter
│   └── middleware.ts    — request-scoped client for `middleware.ts`
├── middleware.ts        — routes-based auth guard: PROTECTED = ['/', '/awards']
├── services/            — *-service.ts per feature (server-side, async)
├── types/               — *.ts per feature
└── __tests__/           — mirrors src layout; jest.config maps @/* → src/*
supabase/
├── config.toml
├── migrations/*.sql     — two files: 20260413_create_homepage_tables + extend_awards
└── seeds/dev/homepage-seed.sql
public/assets/
├── awards/images/
├── homepage/{icons,images,fonts}/
└── login/{icons,images,logos}/
```

### Existing Patterns Identified

#### Component Patterns

| Pattern                               | Location                                                | Relevance to Kudos                                                                 |
| ------------------------------------- | ------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| Server-component page with parallel data loads | `src/app/page.tsx`, `src/app/awards/page.tsx`      | `app/kudos/page.tsx` should mirror this: parallel `fetchKudosHighlights`, `fetchKudosFeed`, `fetchUserStats`, etc. |
| `AppHeader` active nav key            | `src/components/layout/AppHeader.tsx`                    | Reuse verbatim; add `kudos` nav href `/kudos` (currently `#`)                       |
| `AppFooter` with dict                 | `src/components/layout/AppFooter.tsx`                    | Reuse verbatim                                                                     |
| Kudos section reused between screens  | `src/components/homepage/KudosSection.tsx`               | Reference pattern for section composition; NOT reused directly                     |
| Award card grid with hover states     | `src/components/homepage/AwardCard.tsx` + `.award-card` CSS hover rules | Same hover-pattern inspiration for the feed kudo cards                |
| Floating widget button                | `src/components/homepage/WidgetButton.tsx`               | Already rendered on Homepage; confirm whether it should also render on `/kudos`     |
| Atomic design language (flat per-feature folders) | all `src/components/<feature>/` folders       | Follow the same — new folder `src/components/kudos/`                               |
| `'use client'` only on interactive leaves | `AppHeader.tsx`, `LanguageToggle.tsx`                 | For the carousel, hearts, spotlight, feed loader — mark those client-only          |

#### API / Data Patterns

| Pattern                                                  | Location                                 | Relevance                                                          |
| -------------------------------------------------------- | ---------------------------------------- | ------------------------------------------------------------------ |
| `createClient` (server) for SSR reads                    | `src/libs/supabase/server.ts`            | Initial server render of Kudos page                                |
| `createClient` (browser) for mutations + Realtime        | `src/libs/supabase/client.ts`            | Heart toggle, open-gift, Realtime subscription                     |
| `createClient` (middleware) for session refresh          | `src/libs/supabase/middleware.ts`         | Required to refresh session on `/kudos` (protected route)          |
| Services defined once, typed DTOs mapped inline          | `src/services/homepage-service.ts`       | `kudos-service.ts` should follow the same shape                    |
| RLS-gated SELECT policy per table + service_role full    | `supabase/migrations/20260413000000_*.sql` | Mirror for new `kudos`, `hearts`, `secret_boxes`, `live_kudo_events` tables |
| Seeds in `supabase/seeds/dev/*.sql`                      | `supabase/seeds/dev/homepage-seed.sql`   | Add `kudos-seed.sql` for local development                         |

#### Testing Patterns

| Pattern                                                 | Location                                                                 | Relevance                                                                        |
| ------------------------------------------------------- | ------------------------------------------------------------------------ | -------------------------------------------------------------------------------- |
| Service tests mock `@/libs/supabase/*` at module level  | `src/__tests__/services/auth-service.test.ts`, `*-service.test.ts`       | Same approach for `kudos-service.test.ts`                                        |
| Integration tests hit **real** Supabase (constitution)  | `src/__tests__/integration/homepage-service.integration.test.ts`         | Add `kudos-service.integration.test.ts` — do NOT mock DB (constitution §III.5)   |
| Component tests with Testing Library + jsdom            | `src/__tests__/components/...`                                           | Cover KudoCard, HighlightCarousel, HeartsButton, SpotlightCanvas                 |
| Hook tests                                              | `src/__tests__/hooks/use-countdown.test.ts`                              | Pattern for `use-hearts.test.ts`, `use-realtime-kudos.test.ts`                   |

#### Design-token Pattern

- All tokens declared as plain CSS variables inside `:root { … }` blocks (per-screen) in `src/app/globals.css`.
- **Homepage + Awards tokens already cover the Kudos palette extensively** — no need to redefine:
  - `--color-text-gold: #FFEA9E`
  - `--color-btn-primary-bg: #FFEA9E`, `--color-btn-secondary-bg: rgba(255, 234, 158, 0.10)`, `--color-btn-secondary-border: #998C5F`
  - `--color-app-header-bg: rgba(16, 20, 23, 0.8)`
  - `--color-text-secondary: #DBD1C1`
  - `--text-section-title-size: 57px`, `--text-section-title-line-height: 64px`
  - `--text-nav-link-size: 14px`, `--text-nav-link-footer-size: 16px`
  - `--radius-kudos-card: 16px`, `--radius-btn-primary: 8px`
  - Spacing: `--spacing-page-px: 144px`, `--spacing-section-gap: 120px`
- Note: current style uses `:root` blocks (NOT Tailwind v4 `@theme`). The Kudos design-style.md recommended `@theme`, but the codebase is consistent on `:root`. **Keep `:root` for consistency** — add a new block "Design Tokens — Sun* Kudos (MaZUn5xHXZ)" to `globals.css`, defining only net-new tokens (`--color-card-cream`, `--color-panel`, `--color-heart-active`, etc.) and reuse existing ones for reuse overlap.

---

## Reusable Components

### Components to Leverage

| Component                                          | Path                                        | Usage in Kudos                                                     |
| -------------------------------------------------- | ------------------------------------------- | ------------------------------------------------------------------ |
| `AppHeader`                                        | `src/components/layout/AppHeader.tsx`       | Drop-in as page chrome; pass `activeNavKey="kudos"`                 |
| `AppFooter`                                        | `src/components/layout/AppFooter.tsx`       | Drop-in                                                            |
| `WidgetButton`                                     | `src/components/homepage/WidgetButton.tsx`  | Renders the floating "/" quick-action launcher (same as Homepage)  |
| `LanguageToggle`                                   | `src/components/login/LanguageToggle.tsx`   | Already rendered inside `AppHeader` — no direct use                |
| Design tokens listed above                         | `src/app/globals.css`                       | Reuse for page shell, header, hero CTAs, footer                    |

### Hooks to Leverage

| Hook                   | Path                                 | Usage                                                   |
| ---------------------- | ------------------------------------ | ------------------------------------------------------- |
| `useTranslation()`     | `src/i18n/use-translation.ts`        | Client-side i18n in interactive widgets                 |
| `useLanguage()`        | `src/hooks/use-language.ts`          | Not directly used; language flows via cookie + i18n     |

### Services to Leverage

No existing Kudos-related services. We will create `src/services/kudos-service.ts` and optionally split out `kudos-hearts-service.ts` and `gifts-service.ts` when they exceed ~200 LoC (constitution §V).

---

## Integration Points

### APIs to Connect

> Per constitution + `frontend.md`: business logic lives in services, route handlers stay thin. For Kudos most reads fit nicely in **Server Components calling services directly** (same as Homepage). Interactive widgets use the **Supabase browser client** through thin client-side hooks.

| Data operation                           | Server / Client   | Implementation                                                                  | Status                     |
| ---------------------------------------- | ----------------- | ------------------------------------------------------------------------------- | -------------------------- |
| Fetch highlight kudos (top N)            | Server → service  | `fetchKudosHighlights(filter)` → Supabase SELECT w/ JOIN on users/hashtags      | New                        |
| Fetch hashtags list                      | Server → service  | `fetchHashtags()`                                                                | New                        |
| Fetch departments list                   | Server → service  | `fetchDepartments()`                                                              | New                        |
| Fetch All-Kudos feed (paginated)         | Client hook       | `useKudosFeed(filter)` — paginated via Supabase `.range()` on the browser client | New                        |
| Fetch spotlight data (count + names)     | Server → service  | `fetchKudosSpotlight(filter)`                                                    | New                        |
| Fetch user stats                         | Server → service  | `fetchUserStats(userId)`                                                          | New                        |
| Fetch top gift recipients                | Server → service  | `fetchTopGiftRecipients()`                                                        | New                        |
| Toggle heart                             | Client hook       | `useHeartKudo(kudoId)` — Supabase UPSERT/DELETE via browser client; optimistic    | New                        |
| Open secret box                          | Client hook       | `openSecretBox(giftId)` — Supabase RPC (atomic update)                            | New                        |
| Live ticker                              | Client hook       | `useKudosRealtime()` — `supabase.channel('kudos_live').on('postgres_changes'…)`   | New                        |

### Database Entities (new migration)

File: `supabase/migrations/YYYYMMDDHHMMSS_create_kudos_tables.sql`

| Entity              | Table                  | Status | Notes                                                                               |
| ------------------- | ---------------------- | ------ | ----------------------------------------------------------------------------------- |
| Sunner profile      | `users` / `profiles`   | New?   | Supabase Auth provides `auth.users`; extend with `public.profiles` (id, display_name, avatar_url, department_id, hoa_thi_level, danh_hieu). Confirm in Q-new. |
| Department          | `departments`          | New    | `(id uuid pk, name text unique, created_at)` — feeds `B.1.2` filter                 |
| Hashtag             | `hashtags`             | New    | `(id uuid pk, slug text unique, label text, created_at)`                             |
| Kudo                | `kudos`                | New    | `(id, sender_id fk, receiver_id fk, content text, department_id fk, created_at, hearts_count int cached)` |
| Kudo ↔ Hashtag      | `kudo_hashtags`        | New    | `(kudo_id, hashtag_id)` join table                                                   |
| Kudo image          | `kudo_images`          | New    | `(id, kudo_id fk, url text, position smallint)` — PK + FK + check `position < 5`     |
| Heart               | `kudo_hearts`          | New    | `(user_id, kudo_id, value smallint check 1 or 2, created_at)` — PK `(user_id, kudo_id)` |
| Secret box / Gift   | `secret_boxes`         | New    | `(id, owner_id fk, status enum(opened,unopened), gift_description text, opened_at)`  |
| Live event (stream) | `live_kudo_events`     | New    | `(event_id uuid pk, kudo_id fk, receiver_id fk, occurred_at)` — Realtime broadcasts via `postgres_changes` |
| Event config extension | `event_config`      | Exists | Add columns `double_heart_active boolean default false`, `highlight_limit int default 5` |

Each new table must have RLS enabled + SELECT policy for `authenticated` + INSERT/UPDATE/DELETE policy that enforces ownership (sender can delete own kudo, user can add own heart, etc.).

### External Services

| Service                             | Purpose                             | Integration Method                                             |
| ----------------------------------- | ----------------------------------- | -------------------------------------------------------------- |
| **Supabase Auth (Google OAuth)**    | Already integrated — middleware redirects unauthenticated to `/auth/login` | No change |
| **Supabase Realtime**               | Live kudo ticker on Spotlight       | `supabase.channel('kudos_live').on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'live_kudo_events' }, handler).subscribe()` |
| **Supabase Storage** (optional)     | Kudo images                         | Store under `kudos/{id}/{index}.jpg`; signed URL for private bucket or public URL for public bucket |

---

## Potential Challenges

### Technical Challenges

| Challenge                                                    | Impact | Proposed Solution                                                                                                                                                                                      |
| ------------------------------------------------------------ | ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| No installed data-fetching / cache library                   | Med    | Two options: **(A) Add `@tanstack/react-query`** (needs constitution violation justification — justified because spec requires cache keys, infinite scroll, optimistic mutations, stale-while-revalidate); **(B)** hand-roll a minimal set of hooks using Supabase browser client + `useReducer`. **Recommend (A)** — smaller custom surface, fewer bugs, and project already has Yarn/TS infra to absorb it. |
| Heart concurrency / idempotency                              | Med    | Supabase RPC `toggle_kudo_heart(kudo_id)` in PL/pgSQL with `SECURITY DEFINER` — returns `{ liked, count }`; frontend applies optimistic state and reconciles                                             |
| Spotlight layout deterministic across clients                | Med    | Client-side seeded PRNG (see spec.md Q11) keyed on `user_id + kudos_received_count`; positions recomputed on data change; no server change needed                                                        |
| Infinite scroll & virtualization on Cloudflare-bundled RSC   | Low    | Use plain `IntersectionObserver` on a sentinel div; defer virtualization (`@tanstack/react-virtual`) until the feed loads >30 items (TR-008 threshold)                                                   |
| SVG-only icon pipeline (no lib)                              | Low    | Add `src/components/kudos/Icon.tsx` atom that maps `name` → `/assets/kudos/icons/<name>.svg` via `next/image`. (Project already uses `<Image>` for iconography — see `AppHeader.tsx` bell/avatar.)       |
| Carousel without external dep                                | Low    | Build a thin `src/components/kudos/HighlightCarousel.tsx` with scroll-snap + keyboard handlers. Avoid embla-carousel unless complexity grows — YAGNI                                                      |
| Cloudflare Workers runtime limits                            | Low    | Server components already run on Workers; no long-lived sockets — Realtime subscription is client-side only. OK.                                                                                        |
| `AppHeader` current href `#` for Kudos                       | Trivial | Update `NAV_LINKS` to use `/kudos`; add `activeNavKey="kudos"` on the new page                                                                                                                          |

### Integration Challenges

| Challenge                                                    | Impact | Proposed Solution                                                                                                 |
| ------------------------------------------------------------ | ------ | ----------------------------------------------------------------------------------------------------------------- |
| `middleware.ts` PROTECTED_ROUTES doesn't include `/kudos`    | Med    | Add `'/kudos'` to `PROTECTED_ROUTES` so unauthenticated users redirect to `/auth/login` (spec FR Auth required)   |
| Viết Kudo flow is a separate screen spec, not yet implemented | Med    | On `/kudos`, `A.1_Button ghi nhận` navigates to `/kudos/compose`. Plan stubs the route and treats it as "out of scope" per spec.  |
| View Kudo detail, Profile người khác, Gift Receive popup — not yet implemented | Med | Same — leave routes/modals as out-of-scope placeholders; wire links to `/kudos/{id}`, `/users/{id}`, and Gift popup component per spec Q13     |
| Date/number locale                                           | Low    | Use `Intl.DateTimeFormat` + `Intl.NumberFormat` with `locale === 'vi' ? 'vi-VN' : 'en-US'`. Awaits Q5 answer.      |
| Supabase RLS for live_kudo_events                            | Med    | Publish via Postgres trigger after new kudo insert → INSERT into `live_kudo_events`. Realtime broadcasts go through RLS, so SELECT policy on `live_kudo_events` must allow `authenticated`. |

---

## Recommendations

### Architecture Recommendations

1. **Mirror Homepage / Awards pattern**: `app/kudos/page.tsx` as a Server Component that calls services for the initial render; interactive subcomponents are client-side leaves with explicit `'use client'`. This preserves LCP (TR-010) and avoids duplicating fetch logic.
2. **Introduce `@tanstack/react-query` once** for this feature and all future interactive features (Viết Kudo, View Kudo, Profile). Document in plan.md violation table — rationale is the spec's cache-key / optimistic / infinite-scroll requirements (TR-002, TR-008). Install and wrap the page with `<QueryClientProvider>` via a new root `src/providers/QueryProvider.tsx`.
3. **Add the Icon atom** (`src/components/kudos/Icon.tsx`) early — all interactive icons on this screen will use it, and constitution + design-style.md both mandate Icon-component usage.
4. **Reuse existing tokens wherever possible**; only add the cream card + heart red + panel black tokens. Keep globals.css organized per-screen.
5. **Keep services pure** (no framework types, no request/response objects) — mirror `homepage-service.ts`. Route handlers not strictly required because Server Components call services directly; only introduce `src/app/api/kudos/hearts/route.ts` if RPC-less implementation demands it.
6. **Supabase RPCs for atomicity**: `toggle_kudo_heart` and `open_secret_box` RPCs return the post-operation state in a single round trip and sidestep race conditions. Much simpler than two round trips + transactions.

### Implementation Recommendations

1. **Start with US1 (P1)** — Browse + react + copy link. This is the MVP and exercises the full vertical slice: migration → service → server page → client KudoCard → hearts hook → realtime.
2. **Leverage** the existing token set in `globals.css`; only declare new Kudos-specific tokens to keep the change surface small.
3. **Avoid** building a feature-flag system or admin screens for `x2` days — those are admin-side work (already out of scope per spec).

### Testing Recommendations

1. **Contract tests for services** (unit) — mock Supabase, assert the SQL query shape and the DTO mapping.
2. **Integration tests against real Supabase** for `toggle_kudo_heart` RPC + heart-count reconciliation (constitution §III.5 forbids mocked DB).
3. **Component tests** for interactive leaves: `KudoCard`, `HeartsButton`, `HighlightCarousel`, `SpotlightCanvas`, `OpenGiftButton`.
4. **E2E** (future Playwright work; not in this repo yet) on the P1 happy path: login → navigate to `/kudos` → scroll feed → heart → copy link.

---

## Files to Review Before Implementation

### Must Read

- [x] `src/app/page.tsx` — Server-component page pattern (data fetch → compose components)
- [x] `src/app/awards/page.tsx` — Two-column layout with sidebar (similar to our Kudos feed + sidebar)
- [x] `src/components/layout/AppHeader.tsx` — active-nav pattern; needs `/kudos` href update
- [x] `src/components/homepage/KudosSection.tsx` — ambient brand/CSS-variable usage
- [x] `src/services/homepage-service.ts` — service shape + DTO mapping
- [x] `src/libs/supabase/{client,server,middleware}.ts` — factory functions for each context
- [x] `src/middleware.ts` — route protection list (needs `/kudos` addition)
- [x] `src/app/globals.css` — existing token blocks and reuse opportunities
- [x] `supabase/migrations/20260413000000_create_homepage_tables.sql` — RLS + triggers pattern
- [x] `supabase/seeds/dev/homepage-seed.sql` — seed shape
- [x] `src/__tests__/services/auth-service.test.ts` — Supabase-mocked service test
- [x] `src/__tests__/integration/homepage-service.integration.test.ts` — real-DB integration test

### Recommended

- [ ] `.momorph/guidelines/frontend.md` — URL navigation rules (no guessing URLs)
- [ ] `.momorph/guidelines/backend.md` — controller/service split guidance
- [x] `jest.config.ts`, `jest.setup.ts` — test env + module alias

---

## Open Questions (research-level, in addition to spec.md Q1–Q15)

- [ ] **RN1**: Should we add `@tanstack/react-query` as a new dependency? (Strongly recommended — documented as violation.)
- [ ] **RN2**: Is there an existing `profiles` table for Sunner data, or does the team plan to add one in this migration? (Currently only `auth.users` exists — `hoa_thi_level`, `danh_hieu`, `avatar_url`, `kudos_received_count` etc. need a home.)
- [ ] **RN3**: Confirm Supabase project has Realtime enabled for the `live_kudo_events` table. If not, migration must include `alter publication supabase_realtime add table live_kudo_events;`.
- [ ] **RN4**: Should `WidgetButton` render on `/kudos` as well as Homepage? It's mentioned in spec Navigation Flow but not in the Layout ASCII. Assume yes for consistency with Homepage.
- [ ] **RN5**: Do we have design for the `/kudos/compose` (Viết Kudo) trigger target? If not, the plan stubs a route `/kudos/compose` that renders an "Coming soon" page — confirm acceptable.

---

## Notes

- The codebase has excellent server-component discipline — the new screen should feel native to the existing shape rather than introducing new patterns.
- The constitution's TDD mandate means every task must start with a failing test before implementation. For Server Components this usually means unit-testing the service first, then wiring the component.
- The `middleware.ts` `PROTECTED_ROUTES` update is tiny but mandatory — forgetting it would make `/kudos` public and break the auth-required scenario in US1.
