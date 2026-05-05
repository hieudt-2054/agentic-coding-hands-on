# Research: Viết Kudo (Compose Kudo Modal)

**Frame**: `ihQ26W78P2-viet-kudo`
**Date**: 2026-04-20
**Spec**: `specs/ihQ26W78P2-viet-kudo/spec.md`
**Parent**: `specs/MaZUn5xHXZ-sun-kudos-live-board/` (already implemented)

---

## Purpose

Capture codebase findings that shape the Viết Kudo implementation plan. Because the **Live Board feature is already shipped**, the modal must reuse its schema, services, hooks, tokens, and providers rather than reinvent them.

---

## Stack Snapshot (unchanged since Live Board)

| Concern         | Installed                                          |
| --------------- | -------------------------------------------------- |
| Framework       | Next.js **15.5.9** (App Router, Turbopack dev)      |
| React           | **19.1.4** (Server Components default)              |
| Styling         | Tailwind **v4**                                    |
| Data            | `@supabase/ssr` 0.8.x + `@supabase/supabase-js` 2.90.x |
| Cache / Queries | `@tanstack/react-query` ^5.62 (installed by Live Board) |
| Runtime         | Cloudflare Workers via `@opennextjs/cloudflare`     |
| Testing         | Jest 29 + jsdom + Testing Library, real-Supabase integration |

No new framework-level deps are needed for this feature. The contenteditable wrapper is DIY (TR-002 locked-in).

---

## Codebase Analysis

### What already exists from the Live Board

#### Directory reality

```
src/
├── app/
│   ├── globals.css                 — /* Design Tokens — Sun* Kudos (MaZUn5xHXZ) */ block lives here
│   ├── kudos/
│   │   ├── page.tsx                — Live Board (Server Component)
│   │   ├── compose/page.tsx        — STUB "Coming soon" (replace with full-page fallback)
│   │   ├── search/page.tsx         — stub
│   │   └── [id]/page.tsx           — stub
│   ├── users/[id]/page.tsx         — stub (profile)
│   └── layout.tsx                  — wraps QueryProvider + ToastProvider
├── components/
│   └── kudos/                      — ~32 components already shipped
├── hooks/                          — 9 `use-*` hooks already shipped
├── libs/
│   └── supabase/{client,server,middleware}.ts
├── providers/
│   ├── QueryProvider.tsx
│   └── ToastProvider.tsx
├── services/
│   ├── kudos-service.ts            — server reads
│   ├── kudos-client.ts             — browser reads for feed/highlights
│   ├── gifts-client.ts             — RPC wrappers (pattern to copy for create_kudo)
│   ├── hashtags-service.ts
│   ├── taxonomies-client.ts        — browser variants of hashtag / dept
│   └── user-stats-client.ts
└── types/kudos.ts                  — most DTOs already defined
supabase/
├── migrations/
│   ├── 20260420120000_create_kudos_tables.sql  — the 9 Kudos tables + RPCs + Realtime
│   ├── 20260420121000_extend_event_config.sql
│   ├── 20260420130000_auto_create_profile.sql  — auth.users → profile trigger
│   └── 20260420140000_attach_demo_data.sql     — dev-only demo seed trigger
└── seeds/dev/kudos-seed.sql
public/assets/kudos/
├── icons/                          — pen, search, chevron-*, send, heart, link, open-gift, pan-zoom, star (8 reused)
├── images/                         — kv-kudos.svg, spotlight-aurora.svg, avatar-placeholder.svg
└── logos/kudos-logo.svg
```

#### Existing patterns to copy

| Pattern                                            | Live Board example                          | Viết Kudo re-use                                                   |
| -------------------------------------------------- | ------------------------------------------- | ------------------------------------------------------------------ |
| Server Component page + `createClient(...)` for initial reads | `src/app/kudos/page.tsx`          | `/kudos/compose` full-page fallback mirrors same pattern           |
| Server/client split for services                   | `kudos-service.ts` (server) + `kudos-client.ts` (browser) | `kudos-compose-service.ts` (reads) + `kudos-compose-client.ts` (RPC) |
| RPC wrapper with typed error message parsing       | `gifts-client.ts` `toggleKudoHeart`         | `createKudo()` wrapper around new `create_kudo` RPC                |
| TanStack Query hook naming                         | `useHeartKudo` `useInfiniteQuery` etc.      | `useCreateKudo`, `useReceiverSearch`, `useMentionSearch`, `useImageUpload` |
| Toast notifications                                | `ToastProvider` + `useToast`                | Success (`Đã gửi Kudo! 🎉`), error mapping per spec table         |
| i18n key appending (vi + en)                       | 37 `kudos.*` keys in `src/i18n/dictionaries/{vi,en}.ts` | Append `kudos.compose.*` keys (helpers + err table)         |
| Section-scoped error isolation                     | `SectionErrorBoundary` (Live Board)         | Wrap the compose form in a similar boundary                        |
| Zod validation                                     | not yet installed — see challenge below     | Need to add `zod` for this feature                                  |

#### Reusable atoms/molecules

| Component                         | Path                                                    | Re-use for modal                                       |
| --------------------------------- | ------------------------------------------------------- | ------------------------------------------------------ |
| `<Icon name=… size=… />`          | `src/components/kudos/Icon.tsx`                         | Extend `KudosIconName` union with: `bold`, `italic`, `strikethrough`, `number-list`, `quote`, `plus`, `close`, `close-tiny` |
| `<HashtagChip />`                 | `src/components/kudos/HashtagChip.tsx`                  | Already renders a red bold chip — we'll add a `removable` variant for the Tag Group |
| `<SunnerSearchInput />`           | `src/components/kudos/SunnerSearchInput.tsx` (Spotlight) | Receiver autocomplete reuses the pill-style input base |
| `<HoaThiBadge /> <DanhHieuBadge />`| Live Board                                              | Rendered inside receiver autocomplete results row      |
| `<Toast />` + `useToast`          | `src/providers/ToastProvider.tsx`                       | Success + error toasts                                 |
| `RetryButton`                     | `src/components/kudos/RetryButton.tsx`                  | Inline retry on submit failure                         |
| `SectionErrorBoundary`            | `src/components/kudos/SectionErrorBoundary.tsx`         | Wrap compose root                                      |

#### Reusable hooks

| Hook                        | Re-use                                                                 |
| --------------------------- | ---------------------------------------------------------------------- |
| `use-copy-to-clipboard.ts`  | Not re-used directly, but the `toast` + clipboard fallback pattern is  |
| TanStack Query factory      | The `useInfiniteQuery` / `useQuery` patterns transfer directly         |

#### Reusable DB + schema

The Live Board schema is already in place. Changes for this feature **extend** the existing `kudos` table (columns) + add one join table:

- `alter table public.kudos add column danh_hieu text not null default ''`
- `alter table public.kudos add column is_anonymous boolean not null default false`
- `alter table public.kudos add column content_html text`
- `create table public.kudo_mentions (kudo_id uuid, mentioned_user_id uuid)`

A dev tip: existing seed (`kudos-seed.sql`) and attach-demo trigger both INSERT into `public.kudos` with the old column set. Those need back-filling (`danh_hieu = '…'`, default `is_anonymous = false`, `content_html = content`).

#### Existing validation/error infra

- No shared Zod install. We need to add it.
- No existing "validation schema factory" — we'll introduce `src/validation/kudos-compose.ts` that exports the schema for both client + server.
- No existing `DOMPurify` or HTML sanitiser. We'll add one (`isomorphic-dompurify` or hand-roll a small allowlist whitelist on Cloudflare Workers — see challenge).

---

## Reusable Components Summary

### Components to Leverage

| Component / Module                | Path                                                | Usage in Feature                                               |
| --------------------------------- | --------------------------------------------------- | -------------------------------------------------------------- |
| `<Icon />`                        | `src/components/kudos/Icon.tsx`                      | All 14+ icon slots in the modal                                |
| `<HashtagChip />`                 | `src/components/kudos/HashtagChip.tsx`               | Rendered as a selected chip (extend with `removable` prop)     |
| `<ToastProvider />`               | `src/providers/ToastProvider.tsx`                    | Success toast + error toasts                                   |
| `<SectionErrorBoundary />`        | `src/components/kudos/SectionErrorBoundary.tsx`      | Wrap compose form body                                         |
| `<RetryButton />`                 | `src/components/kudos/RetryButton.tsx`               | Retry submit or image upload                                    |
| `AppHeader` / `AppFooter`         | `src/components/layout/*`                            | Render behind the modal (Live Board layout wraps it)           |

### Hooks to Leverage

| Hook                        | Path                                 | Usage                                                     |
| --------------------------- | ------------------------------------ | --------------------------------------------------------- |
| `useTranslation()`          | `src/i18n/use-translation.ts`         | Labels, placeholders, error strings                        |
| `useToast()`                | `src/providers/ToastProvider.tsx`     | Success + error                                            |
| TanStack Query primitives   | `@tanstack/react-query`               | `useQuery`, `useMutation`, `useInfiniteQuery`, invalidations |

### Services to Leverage

| Service                         | Path                                       | Usage                                             |
| ------------------------------- | ------------------------------------------ | ------------------------------------------------- |
| `hashtags-service.ts`           | `src/services/hashtags-service.ts` (server) | Not directly re-used; the `+ Hashtag` dropdown uses `taxonomies-client.ts` `fetchHashtagsClient` already shipped for Live Board filters |
| `taxonomies-client.ts`          | `src/services/taxonomies-client.ts`         | `fetchHashtagsClient()` reused for the add-hashtag dropdown |
| Supabase `createClient`         | `src/libs/supabase/{client,server}.ts`      | Both variants (SSR read for fallback page, browser for mutations) |

---

## Integration Points

### APIs to connect

| Data operation                            | Server / Client | Implementation                                                                | Status       |
| ----------------------------------------- | --------------- | ----------------------------------------------------------------------------- | ------------ |
| Receiver autocomplete (debounced `q`)     | Client hook     | `useReceiverSearch(q)` → Supabase PostgREST `from('profiles').select().ilike().limit(10)` ordered by `kudos_received_count desc` | New          |
| Resolve receiver by id (for `?to=` prefill)| Server (initial render) + client | `fetchProfileById(id)` — used in full-page fallback + `useEffect` mount in intercepted modal | New          |
| Hashtag dropdown list                     | Client hook     | `fetchHashtagsClient()` — **already shipped** by Live Board                   | Reuse        |
| Mention popover (debounced `q` after `@`) | Client hook     | `useMentionSearch(q)` — same shape as receiver search (shared service)         | New (shared) |
| Image upload (per file)                   | Client hook     | `useKudoImageUpload()` → `POST /api/kudos/images/upload` (multipart) → Supabase Storage bucket `kudos-images` | New          |
| Image delete (on remove / cleanup)        | Client hook     | `DELETE /api/kudos/images/:path` → Supabase Storage remove                     | New          |
| Create kudo                               | Client hook     | `useCreateKudo()` → `supabase.rpc('create_kudo', {...})`                       | New          |

### Database entities (new migration `20260421100000_viet_kudo_schema.sql`)

| Entity                   | Status | Change                                                                       |
| ------------------------ | ------ | ---------------------------------------------------------------------------- |
| `public.kudos`            | Exists | Add `danh_hieu text not null default ''`, `is_anonymous boolean default false`, `content_html text` (back-fill from existing `content`) |
| `public.kudo_mentions`    | New    | `(kudo_id uuid fk → kudos, mentioned_user_id uuid fk → profiles, created_at)`; PK `(kudo_id, mentioned_user_id)` |
| `public.kudos` CHECK      | Update | `CHECK (length(danh_hieu) BETWEEN 1 AND 60)` — apply on NEW rows only (dev seed stays `''` since back-fill happens before the constraint adds on ALTER) |
| `public.create_kudo` RPC  | New    | `SECURITY DEFINER` function wrapping INSERT + joins (see spec TR-007)         |
| `public.search_profiles`  | New    | `security invoker` function used by `/api/profiles/search` for `ILIKE` query, respects RLS — or raw PostgREST, whichever is simpler |
| Storage bucket `kudos-images` | New | Created via migration `select storage.create_bucket(...)` + RLS policies     |
| Realtime `on_kudo_insert` trigger | Exists | No change — still fires on new kudos; will receive anonymous ones too (receiver_name is hashed safe) |

### Anonymous data flow

The spec (FR-007) requires `sender_id` never leaves the server for anonymous kudos. Implementation:

- Keep `sender_id` on `kudos` for FK + trigger correctness.
- **Add an RLS-visible view `public.kudo_feed_v`** that masks `sender_id` → `null` when `is_anonymous = true`, with `display_name` derived from `profiles.display_name` only when not anonymous.
- Existing `fetchKudosFeed` / `fetchKudosHighlights` switch their SELECT from `public.kudos` to `public.kudo_feed_v`. This is a **backward-compat hazard** — the Live Board services will need an update.

Alternative: keep services selecting `public.kudos` but `.select('... sender:profiles!kudos_sender_id_fkey(…)')` becomes conditional. The view approach is cleaner and centralises the privacy rule in the DB.

### External services

| Service              | Purpose                                        |
| -------------------- | ---------------------------------------------- |
| Supabase Storage     | `kudos-images` bucket for uploads              |
| Supabase Auth        | Already wired — `auth.uid()` drives everything |
| Supabase Realtime    | No new channel — `kudos_live` reused from Live Board |

---

## Potential Challenges

### Technical Challenges

| Challenge                                                 | Impact | Proposed Solution                                                                                                                                                                |
| --------------------------------------------------------- | ------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Contenteditable DIY across browsers                       | High   | Use `document.execCommand('bold'|'italic'|'strikeThrough'|'createLink')` for the big 4, DOM surgery for `<ol><li>` + `<blockquote>` + `<span data-mention-id>`. Encapsulate in `src/components/kudos/editor/*` so the API stays stable if we migrate to Tiptap later. Unit-test with `@testing-library/user-event` on all 3 engines via `happy-dom` or real browsers if available. |
| HTML sanitisation on Cloudflare Workers                   | Med    | Cloudflare Workers runtime does NOT ship a full `DOMParser`. Options: (a) add `isomorphic-dompurify` (pulls `jsdom` — too heavy for Workers) OR (b) write a tiny regex/allowlist sanitiser specific to our 7 allowed tags + `data-mention-id` attr. **Recommend (b)** — it's ~30 LOC and avoids the 200 KB DOMPurify bundle. |
| Parallel + intercepting routes on Next.js 15 App Router   | Med    | Pattern: `app/kudos/@modal/default.tsx` + `app/kudos/@modal/compose/page.tsx` + `app/kudos/layout.tsx` declares the slot. Direct URL (`/kudos/compose`) hits `app/kudos/compose/page.tsx` (already stubbed) — we'll replace its body with the same `<ComposeKudoForm />` component but wrapped in a full-page scaffold. Next 15 supports this via intercepting route segments `(.)`, `(..)`, etc. We need `app/kudos/@modal/(.)compose/page.tsx` to intercept the child `/compose` route. |
| Image upload via Next.js route + Cloudflare size limits    | Med    | Cloudflare Worker request body defaults to 100 MB for the paid plan. Client enforces 5 MB per image BEFORE upload; server double-checks and short-circuits with 413 if exceeded. Use `@supabase/storage-js` via the server Supabase client to avoid exposing the service key. |
| Mention popover caret positioning                         | Med    | Use a small utility `getCaretClientRect()` that inspects the current `Range` (from `window.getSelection().getRangeAt(0).getClientRects()`). Hide popover on blur or Escape. |
| Orphan images on cancel                                   | Low    | Client calls `DELETE /api/kudos/images/:path` on remove/close. Backend cron (daily) sweeps `kudos-images/*` with no matching `kudo_images.url` older than 24 h. Document as an acceptable eventual-consistency window. |
| Existing Live Board services must switch SELECT to `kudo_feed_v` view | Med | Plan a migration step: create view first, update the 3 services (`kudos-service.ts`, `kudos-client.ts`, `spotlight-client.ts`), re-run unit + integration tests before layering on compose work. This is a **backward-compat change** for the Live Board — test coverage prevents regressions. |
| Zod not installed                                          | Low    | Add `zod` (~12 KB gzipped). Justify in plan's Violations table.             |
| Counter + character limits in contenteditable             | Low    | `editor.innerText.length` is good enough; don't use `innerHTML.length`.    |

### Integration Challenges

| Challenge                                                              | Impact | Proposed Solution                                                   |
| ---------------------------------------------------------------------- | ------ | ------------------------------------------------------------------- |
| Live Board still needs to render old (non-`content_html`) kudos correctly | Med    | Service layer falls back: `content_html ?? content` on reads. Existing feed cards already render plain text; we render HTML only when `content_html` is not null (new kudos).        |
| Existing dev seed will break `length(danh_hieu) BETWEEN 1 AND 60` CHECK | Low    | Migration order: 1) add column with default, 2) back-fill existing rows, 3) add CHECK constraint. |
| Mention notifications / bell badge                                     | Low    | Out of scope — separate notification feature. But ensure `kudo_mentions` row is populated correctly so it's ready when that feature lands. |
| Feed cache invalidation                                                | Low    | Already handled by the existing `useKudosRealtime` subscription — create_kudo INSERT fires trigger → `live_kudo_events` → channel broadcast → Live Board invalidates. Modal additionally invalidates locally for instant feedback. |
| `anonymous` viewer rendering on Live Board                             | Med    | The Live Board `KudoHeader` and sidebar recipients need to handle `sender === null` — display "Ẩn danh" avatar + label + disable click-to-profile. Small patch to `KudoHeader.tsx` + `KudoCard.tsx`. |

---

## Recommendations

### Architecture Recommendations

1. **Follow the Live Board architecture pattern** verbatim — server services for reads (full-page fallback), browser client for mutations (intercepted modal), TanStack Query for cache coherency, Supabase RPC for atomic writes.
2. **Introduce the modal via Next.js parallel + intercepting routes** — this is the canonical App Router approach; it gives us deep-linkability + shareable URL + hard-refresh fallback in one architecture.
3. **Consolidate privacy in a DB view (`kudo_feed_v`)** — do NOT scatter `is_anonymous` branching across ~8 selects. One view, `SELECT`-only, masks `sender_id + display_name` at the database boundary.
4. **Keep the rich-text editor vendor-agnostic** — colocate under `src/components/kudos/editor/` with a small public surface (`<KudoEditor value onChange onMention />`). A Tiptap migration later becomes a drop-in replacement.
5. **Sanitise HTML server-side** — never trust client HTML. Our tiny allowlist sanitiser runs inside the `/api/kudos` route handler before the `create_kudo` RPC call.

### Implementation Recommendations

1. **Start with the Foundation** — DB migration + view + RPC + services + editor library + validation schema. Deliver nothing UI-facing in Phase 1.
2. **Vertical slice through US1** (happy-path compose + submit) before layering on images, mentions, anonymous — this produces the fastest demo.
3. **Leverage the existing `kudos-seed.sql` + attach-demo trigger** — add back-fill statements so dev boxes post-`db reset` already have valid `danh_hieu` + `content_html` values.

### Testing Recommendations

1. **Contract tests on the DB RPC** — integration tests using real Supabase verify rate-limit, duplicate guard, self-heart guard, anonymous privacy (via view) work atomically.
2. **Unit tests for the rich-text command wrapper** — selection ranges + execCommand results are browser-specific; lock behaviour with Testing Library + `user-event`.
3. **Unit tests for HTML sanitiser allowlist** — key security surface; should fuzz against XSS vectors (`<script>`, `javascript:`, `<iframe>`, inline `style`, `<img onerror>`).
4. **Integration test for orphan image GC** — upload, remove, confirm Storage row is deleted.

---

## Files to Review Before Implementation

### Must Read

- [x] `specs/MaZUn5xHXZ-sun-kudos-live-board/plan.md` — architecture reference
- [x] `specs/MaZUn5xHXZ-sun-kudos-live-board/research.md` — reused patterns
- [x] `supabase/migrations/20260420120000_create_kudos_tables.sql` — schema to extend
- [x] `src/services/gifts-client.ts` — RPC wrapper pattern
- [x] `src/components/kudos/DropdownFilter.tsx` — listbox + keyboard pattern for `+ Hashtag` dropdown
- [x] `src/components/kudos/SunnerSearchInput.tsx` — input-with-icon pattern
- [ ] Next.js docs on parallel + intercepting routes (to confirm `@modal` + `(.)` syntax)
- [ ] Supabase Storage JS docs for multipart upload signed URL

### Recommended

- [x] `specs/MaZUn5xHXZ-sun-kudos-live-board/design-style.md` — token registry
- [x] `src/app/globals.css` — existing token block to extend
- [x] `src/__tests__/integration/kudos-service.integration.test.ts` — integration test pattern

---

## Open Questions (research-level — in addition to spec's locked-in Q-list)

- [ ] **RN1 — Zod install**: Spec requires Zod at client + server. Confirm we can add `zod` (~12 KB) as a runtime dep. **Recommend: yes.**
- [ ] **RN2 — HTML sanitiser**: Hand-roll allowlist vs pull `isomorphic-dompurify`. Spec recommends hand-roll (≈30 LOC, no Workers-incompatible deps).
- [ ] **RN3 — Cloudflare Workers + Supabase Storage upload**: Confirm `@supabase/storage-js` works inside Cloudflare Workers' streaming request body. (Has been tested in community; should be fine.)
- [ ] **RN4 — Anonymous view on existing services**: Migrating 3 services from `public.kudos` → `public.kudo_feed_v` is a mechanical refactor but touches Live Board. Agree to land it in the same PR to avoid a regression window.
- [ ] **RN5 — DB column back-fill strategy**: Add `content_html = content` for existing rows. Verify none of the existing rows contain characters that would need escaping (quick sanity check `select count(*) from kudos where content ~ '[<>&]'`).

---

## Notes

- This feature is the **first write-path** in Kudos. Everything so far (Live Board) was read-only. Expect a disproportionate amount of validation + security work per LOC compared to the Live Board features.
- The DB migration order matters — create the view BEFORE updating the services that reference it, but AFTER adding the new columns. Test the migration in isolation on a fresh `supabase db reset`.
- Mobile UX is a genuine risk — the modal is dense. Bottom-sheet pattern on mobile (per design-style.md) means the textarea gets the least screen real estate. Plan to QA on real iPhones, not just devtools responsive mode.
