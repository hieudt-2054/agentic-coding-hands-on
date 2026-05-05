# Implementation Plan: Viết Kudo (Compose Kudo Modal)

**Frame**: `ihQ26W78P2-viet-kudo`
**Date**: 2026-04-20
**Spec**: `specs/ihQ26W78P2-viet-kudo/spec.md`
**Design style**: `specs/ihQ26W78P2-viet-kudo/design-style.md`
**Research**: `specs/ihQ26W78P2-viet-kudo/research.md`
**Parent feature**: `specs/MaZUn5xHXZ-sun-kudos-live-board/` (already implemented)

---

## Summary

Build the **Viết Kudo modal** — the first write-path in the Kudos feature — on top of the already-shipped Sun* Kudos Live Board stack (Next.js 15 App Router + Supabase + TanStack Query). The modal is opened from the Live Board hero via a Next.js **parallel + intercepting route** (`/kudos/@modal/compose`) with a full-page fallback at `/kudos/compose` for direct links + hard refreshes. The form collects receiver, danh hiệu, rich-text content (contenteditable DIY with 6 formats + `@mention`), 1–5 hashtags (auto-created on first use), up to 5 uploaded images, and an anonymous flag. Submit goes through a single `SECURITY DEFINER` Postgres RPC `create_kudo(...)` that atomically inserts the kudo + join rows, enforces a 10/hour rate-limit, and rejects duplicates. A new view `kudo_feed_v` centralises anonymous-sender masking for reads across the feature.

---

## Technical Context

**Language / Framework**: TypeScript 5.x strict, Next.js 15.5.9 (App Router), React 19.1.4
**Runtime**: Cloudflare Workers via `@opennextjs/cloudflare`
**Primary Dependencies**: `@supabase/ssr` 0.8.x, `@supabase/supabase-js` 2.90.x, `@tanstack/react-query` ^5.62, `@tanstack/react-virtual` ^3.11, Tailwind v4, Jest 29 + Testing Library
**New dependencies (this plan)**: `zod` ^3 (schema validation) — see Violations
**Database**: Supabase Postgres with RLS + Storage + Realtime
**Testing**: Jest + jsdom (unit / component), Jest + node + real Supabase (integration), Playwright (later)
**State management**: TanStack Query for server state, React Context + reducer for modal form state, cookie-driven i18n
**API style**: Next.js Route Handlers under `src/app/api/kudos/*` for (a) image upload/delete and (b) the **kudo create** endpoint (`POST /api/kudos`) — the latter exists solely to run HTML allowlist sanitisation on the Cloudflare Worker (spec TR-006) before forwarding to the Postgres RPC. Reads (`profiles.search`, `profiles.byId`, `kudos-hashtags`) go directly through Supabase PostgREST via the browser client (RLS-gated).

---

## Constitution Compliance Check

*GATE: Must pass before implementation can begin*

- [x] **I. Clean Architecture** — thin route handlers, business logic in `src/services/*`, Supabase clients in `src/libs/supabase/`, kebab-case non-component files, PascalCase components. DTOs (Zod schemas) describe shape only — no business logic inside.
- [x] **II. UI/UX Excellence** — responsive at 3 breakpoints, tokens registered in `src/app/globals.css`, consumed via Tailwind v4 utilities (no arbitrary `bg-[#…]` literals). URLs come from `SCREENFLOW.md` or are explicit stubs per spec. Assets kebab-case under `public/assets/kudos/icons/`.
- [x] **III. Test-First (NON-NEGOTIABLE)** — TDD cycle per task; integration tests hit real Supabase (no mocked DB). See Testing Strategy below.
- [x] **IV. Security by Design** — input validation via Zod at route handler + client; HTML sanitised server-side via an allowlist (rejects `<script>`, inline `style`, `on*` attrs, `javascript:` urls, etc.); RLS + `SECURITY DEFINER` RPC gate writes; Supabase service key never leaves the server; file size / MIME validated at edge; `sender_id` masked via `kudo_feed_v` view so anonymous kudos leak nothing.
- [x] **V. Simplicity & YAGNI** — contenteditable DIY (30 LOC + tests vs 40 KB Tiptap bundle); hand-roll HTML allowlist (≈ 30 LOC vs 200 KB DOMPurify); no new state-management library — context + reducer is enough.

### Violations (requires PR-level justification)

| Violation                  | Justification                                                                                                                               | Alternative rejected                                                                    |
| -------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------- |
| New dep: `zod` ^3          | Spec requires a single schema factory used by both client (instant feedback) + server (trust boundary). Zod is de-facto standard, tree-shakes well (~12 KB gzipped), no peer deps. The form has 7 fields with non-trivial constraints — hand-rolling parsers duplicates ~100 LOC and loses type inference. | `yup`: similar size, heavier API, weaker TS story. Hand-roll: loses type inference + compromises DRY between client + server. |

No other new runtime deps. No new abstractions introduced.

---

## Architecture Decisions

### Frontend Approach

- **Component structure**: feature folder `src/components/kudos/compose/` with a flat tree (atoms, molecules, organisms colocated, same pattern as Live Board).
- **Rendering strategy**: the modal runs as a **Client Component** wrapped in a portal. Two mount points:
  - **Intercepted** (`app/kudos/@modal/(.)compose/page.tsx`): rendered via Next.js parallel + intercepting route. Opened when user clicks a `<Link href="/kudos/compose">` from within `/kudos`. The Live Board behind the modal remains interactive under the backdrop.
  - **Full-page fallback** (`app/kudos/compose/page.tsx`): rendered when user hits `/kudos/compose` directly (hard refresh, paste URL, deep link from profile). Same form, but wrapped in a basic page scaffold with a dim background (no Live Board behind).
  Both mount points render the same `<ComposeKudoModal />` client component.
- **Styling strategy**: new `/* Design Tokens — Viết Kudo (ihQ26W78P2) */` block appended to `src/app/globals.css`. Only the ~6 genuinely new tokens (backdrop, community-link, required-star, input-bg, placeholder aliases) declared; everything else reuses Live Board tokens.
- **State management**:
  - Form state: React Context + reducer scoped to `<ComposeKudoProvider>` wrapping the form. Actions: `setField`, `addHashtag`, `removeHashtag`, `addImage`, `markImageUploaded`, `removeImage`, `setSubmitting`, `setError`, `markDirty`.
  - Server state: TanStack Query.
- **Data fetching hooks** (all under `src/hooks/`):
  - `use-receiver-search.ts` — `useQuery(['profiles-search', q], …)`, 300 ms debounce, cap 10
  - `use-profile-by-id.ts` — `useQuery(['profiles', id], …)` for `?to=` prefill
  - `use-mention-search.ts` — same function as receiver search (dedup the underlying cache key by role-tag) OR shared `use-profile-autocomplete.ts` with a `mode` param
  - `use-kudo-image-upload.ts` — `useMutation` per file → `POST /api/kudos/images/upload`
  - `use-kudo-image-delete.ts` — `useMutation` → `DELETE /api/kudos/images/{path}`
  - `use-create-kudo.ts` — `useMutation` → `supabase.rpc('create_kudo', {…})` → invalidates `['kudos-feed']`, `['kudos-highlights']`, `['kudos-spotlight']`, `['user-stats']`
- **Rich-text editor** (`src/components/kudos/compose/editor/`):
  - `KudoEditor.tsx` — controlled contenteditable `<div>` + toolbar + mention popover orchestration
  - `commands.ts` — `document.execCommand` wrappers for bold/italic/strikethrough/link; custom DOM surgery for `number-list`, `quote`, `mention-insert`
  - `serialize.ts` — extract plain-text (`element.innerText`), collect `[data-mention-id]` user ids
  - `sanitise.ts` (client-side pre-submit hint only; the trust boundary is the server) — same allowlist as `src/libs/html-sanitiser.ts`

### Backend Approach

- **Data access**: Supabase Postgres via `@supabase/ssr` (server) + `@supabase/supabase-js` (browser).
- **API design**:
  - `POST /api/kudos/images/upload` — Next.js Route Handler under `src/app/api/kudos/images/upload/route.ts`. Parses multipart, validates MIME + size, streams to Supabase Storage via the server-role client. Returns `{ url, path }`. (Route handler needed here because the browser client cannot easily attach auth + file together without leaking the storage signed URL response to the user-space JS.)
  - `DELETE /api/kudos/images/{path}` — Route Handler under `src/app/api/kudos/images/[path]/route.ts`. Owner check + Storage delete.
  - `POST /api/kudos` — **thin** Route Handler under `src/app/api/kudos/route.ts` (spec TR-006 + TR-012). Steps: (1) parse body with the shared Zod schema, (2) run `sanitizeKudoHtml()` (allowlist) over `content_html` — this is the Cloudflare-Worker-level sanitisation trust boundary, (3) forward to `supabase.rpc('create_kudo', {...sanitised})` using the request-scoped server client (propagates user's JWT so `auth.uid()` inside the RPC is correct), (4) map PG error codes → HTTP per error table. The RPC itself runs `SECURITY DEFINER` so RLS is also enforced inside the function (defence in depth).
  - `GET /api/profiles/search` — no Route Handler; the client calls `supabase.from('profiles').select('…').neq('id', session.uid()).ilike().limit(10).order(...)` directly. The `neq` clause enforces FR-002 ("exclude auth.uid() from results") at query time.
  - `GET /api/profiles/{id}` — same pattern: direct Supabase read with RLS.
- **Validation**: Zod schema factory `src/validation/kudos-compose.ts` exports `ComposeKudoSchema` used by (a) the client form (instant feedback), (b) the `POST /api/kudos` Route Handler (trust boundary), (c) the `POST /api/kudos/images/upload` Route Handler (file-meta validation), and (d) unit tests. The RPC is the final defence and re-checks invariants (auth.uid, receiver ≠ sender, lengths) that don't depend on HTML structure.
- **Atomic operations via RPC**:
  - `public.create_kudo(p_receiver_id uuid, p_danh_hieu text, p_content_html text, p_hashtag_slugs text[], p_image_urls jsonb, p_is_anonymous boolean) returns jsonb` — `SECURITY DEFINER`, `set search_path = public, pg_temp`. Validates auth + self-check + rate-limit + duplicate guard, then INSERT + upserts + joins. Returns `{ id, created_at }`.
- **Realtime**: no new channel. Existing `kudos_live` on `live_kudo_events` (Live Board) broadcasts the new kudo's event automatically via the existing trigger.
- **Anonymous privacy**: new view `public.kudo_feed_v` — read-only, RLS via `authenticated` — masks `sender_id = null` and `sender_display_name = 'Ẩn danh'` when `is_anonymous = true`. All existing feed/highlight/spotlight services switch their SELECT source from `public.kudos` to `public.kudo_feed_v` in the same PR.

### Integration Points

- **Existing services** touched:
  - `src/services/kudos-service.ts` (server reads) — select source → `kudo_feed_v`
  - `src/services/kudos-client.ts` (browser reads) — select source → `kudo_feed_v`
  - `src/services/spotlight-client.ts` — select source → `kudo_feed_v`
- **Shared components reused**:
  - `<Icon />`, `<HashtagChip />`, `<ToastProvider />`, `<SectionErrorBoundary />`, `<RetryButton />`
  - `AppHeader` / `AppFooter` (already render on `/kudos`; the modal sits on top)
- **Existing DB infra**:
  - `on_kudo_insert` trigger (fires for anonymous kudos too — `receiver_name` is safe)
  - `handle_new_auth_user` trigger (unchanged; dev demo still works)
  - `kudos` / `profiles` / `hashtags` / `kudo_hashtags` / `kudo_images` / `live_kudo_events` (schema preserved + extended)
- **Middleware**: no change. `/kudos/compose` already inherits `/kudos` protection from the existing `PROTECTED_ROUTES = ['/', '/awards', '/kudos', '/users']` entry (prefix match covers children).

---

## Project Structure

### Documentation (this feature)

```text
.momorph/specs/ihQ26W78P2-viet-kudo/
├── spec.md              ✅ exists (review-complete)
├── plan.md              ← this file
├── research.md          ✅ exists
├── design-style.md      ✅ exists
├── tasks.md             ← created by /momorph.tasks
└── assets/
    └── frame.png        ✅ exists
```

### Source Code — New Files

| File                                                              | Purpose                                                                               |
| ----------------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| **Routes**                                                        |                                                                                       |
| `src/app/kudos/layout.tsx`                                        | Declares the `modal` parallel slot + passes `{children, modal}`                       |
| `src/app/kudos/@modal/default.tsx`                                | Renders `null` when the modal slot is inactive                                        |
| `src/app/kudos/@modal/(.)compose/page.tsx`                        | Intercepted modal route — renders `<ComposeKudoModal variant="intercepted" />`        |
| `src/app/api/kudos/route.ts`                                      | POST create-kudo: Zod parse → allowlist-sanitise `content_html` → forward to `create_kudo` RPC → map PG errors to HTTP |
| `src/app/api/kudos/images/upload/route.ts`                        | POST multipart image upload to Supabase Storage                                       |
| `src/app/api/kudos/images/[path]/route.ts`                        | DELETE orphan image (owner-check)                                                     |
| **Providers + hooks**                                             |                                                                                       |
| `src/components/kudos/compose/ComposeKudoProvider.tsx`            | Form-state React Context + reducer                                                    |
| `src/hooks/use-create-kudo.ts`                                    | Mutation wrapping `POST /api/kudos` (Route Handler forwards to RPC — client never calls RPC directly so HTML always hits the server sanitiser) |
| `src/hooks/use-receiver-search.ts`                                | Debounced query for receiver autocomplete                                             |
| `src/hooks/use-profile-by-id.ts`                                  | Resolve one profile for `?to=` prefill                                                |
| `src/hooks/use-mention-search.ts`                                 | Debounced query for `@mention` popover (reuses receiver-search under the hood)        |
| `src/hooks/use-kudo-image-upload.ts`                              | Per-file upload mutation                                                              |
| `src/hooks/use-kudo-image-delete.ts`                              | Orphan image delete                                                                   |
| `src/hooks/use-compose-form-dirty.ts`                             | Track form dirtiness for confirm-on-close                                             |
| **Services / clients**                                            |                                                                                       |
| `src/services/kudos-compose-service.ts`                           | Server-side resolver used by full-page fallback (`fetchProfileById`, etc.)            |
| `src/services/kudos-compose-client.ts`                            | Browser HTTP wrapper `createKudo()` — POSTs to `/api/kudos` + maps 4xx/5xx to the error-code table |
| `src/services/profiles-client.ts`                                 | `searchProfilesClient(q, opts?)` — `opts.excludeSelf=true` (default) adds `neq('id', session.uid())`; used by both receiver + mention searches (FR-002) |
| `src/services/kudo-images-client.ts`                              | Thin client wrappers around `/api/kudos/images/*`                                     |
| **Types + validation**                                            |                                                                                       |
| `src/types/compose-kudo.ts`                                       | `ComposeKudoForm`, `ComposeKudoResult`, `KudoImageUpload`                              |
| `src/validation/kudos-compose.ts`                                 | Zod `ComposeKudoSchema` — shared between client + upload route + tests                |
| `src/libs/html-sanitiser.ts`                                      | Allowlist HTML sanitiser (≈ 30 LOC)                                                   |
| **Editor**                                                        |                                                                                       |
| `src/components/kudos/compose/editor/KudoEditor.tsx`              | Controlled contenteditable + toolbar + mention popover orchestration                  |
| `src/components/kudos/compose/editor/EditorToolbar.tsx`           | 6-button format toolbar + "Tiêu chuẩn cộng đồng" link                                 |
| `src/components/kudos/compose/editor/FormatButton.tsx`            | Individual toolbar atom with `aria-pressed`                                            |
| `src/components/kudos/compose/editor/MentionPopover.tsx`          | Caret-anchored popover showing up to 5 suggestions                                    |
| `src/components/kudos/compose/editor/commands.ts`                 | `execFormat(name)` wrappers                                                            |
| `src/components/kudos/compose/editor/serialize.ts`                | `toPlainText(html)`, `extractMentionIds(html)`, `stripTags(html)`                     |
| **Compose molecules**                                             |                                                                                       |
| `src/components/kudos/compose/ComposeKudoModal.tsx`               | The modal card + header + form shell + dirty-close handling                            |
| `src/components/kudos/compose/ModalBackdrop.tsx`                  | Fixed-inset dim layer with click-to-close                                              |
| `src/components/kudos/compose/ModalTitle.tsx`                     |                                                                                       |
| `src/components/kudos/compose/ReceiverAutocomplete.tsx`           | Input + dropdown + keyboard nav + prefill-from-URL handling                            |
| `src/components/kudos/compose/DanhHieuInput.tsx`                  | Text input + 2-line helper + counter (≥50 chars)                                       |
| `src/components/kudos/compose/HashtagField.tsx`                   | Chip group + `+ Hashtag` popover (autocomplete + new-slug creation)                    |
| `src/components/kudos/compose/HashtagPicker.tsx`                  | Popover listing hashtags matching `q`                                                  |
| `src/components/kudos/compose/RemovableHashtagChip.tsx`           | Chip variant with `×`                                                                  |
| `src/components/kudos/compose/ImageUploader.tsx`                  | Thumb grid + `+ Image` button + per-item progress ring                                  |
| `src/components/kudos/compose/ImageThumb.tsx`                     | 80×80 thumbnail with × remove                                                          |
| `src/components/kudos/compose/AnonymousCheckbox.tsx`              | Labeled toggle; toggle reveals a tiny "(will display as Ẩn danh)" hint                  |
| `src/components/kudos/compose/FooterActions.tsx`                  | Hủy + Gửi row; Gửi hosts `<SubmitTooltip />` listing missing fields on hover (FR-008) |
| `src/components/kudos/compose/SubmitTooltip.tsx`                  | Hover-/focus-triggered popover listing the still-missing required fields (FR-008)   |
| `src/components/kudos/compose/CharCounter.tsx`                    | Small counter shown when value ≥ threshold                                              |
| `src/components/kudos/compose/DirtyCloseDialog.tsx`               | Nested alertdialog for confirm-on-close                                                |
| `src/components/kudos/compose/CommunityStandardsLink.tsx`         | Red "Tiêu chuẩn cộng đồng" link in toolbar                                             |
| `src/components/kudos/compose/skeletons/ComposeSkeleton.tsx`      | Shown while server fallback fetches `?to=` profile                                    |
| **Community Standards stub**                                      |                                                                                       |
| `src/app/community-standards/page.tsx`                            | Stub page — renders "Coming soon" (content in a separate spec)                          |
| **DB migrations**                                                 |                                                                                       |
| `supabase/migrations/20260421100000_viet_kudo_schema.sql`         | `alter table kudos add columns`, back-fill, `add CHECK`, new `kudo_mentions`, `public.create_kudo` RPC, Storage bucket + policies, `kudo_feed_v` view |
| **Tests**                                                         |                                                                                       |
| `src/__tests__/services/kudos-compose-client.test.ts`             | `createKudo()` HTTP client — error-envelope mapping                                    |
| `src/__tests__/services/profiles-client.test.ts`                  | Receiver + mention search query shape + `excludeSelf` (neq filter)                    |
| `src/__tests__/services/kudo-images-client.test.ts`               | Upload + delete wrappers                                                                |
| `src/__tests__/validation/kudos-compose.test.ts`                  | Zod schema (valid + 10 invalid variants)                                                 |
| `src/__tests__/libs/html-sanitiser.test.ts`                       | Allowlist + 15 XSS vectors + 5 legitimate pass-throughs                                  |
| `src/__tests__/app/api/kudos-route.test.ts`                       | `POST /api/kudos` — Zod failure → 400, sanitise runs before RPC, rate-limit → 429, duplicate → 409, invalid-receiver → 422, success → 201 |
| `src/__tests__/hooks/use-create-kudo.test.ts`                     |                                                                                       |
| `src/__tests__/hooks/use-receiver-search.test.ts`                 |                                                                                       |
| `src/__tests__/hooks/use-kudo-image-upload.test.ts`               |                                                                                       |
| `src/__tests__/components/kudos/compose/ComposeKudoModal.test.tsx`|                                                                                       |
| `src/__tests__/components/kudos/compose/editor/KudoEditor.test.tsx` | execCommand wrapper + mention popover + plain-text serialise                         |
| `src/__tests__/components/kudos/compose/editor/EditorToolbar.test.tsx` |                                                                                  |
| `src/__tests__/components/kudos/compose/ReceiverAutocomplete.test.tsx` |                                                                                  |
| `src/__tests__/components/kudos/compose/HashtagField.test.tsx`    |                                                                                       |
| `src/__tests__/components/kudos/compose/ImageUploader.test.tsx`   |                                                                                       |
| `src/__tests__/components/kudos/compose/DirtyCloseDialog.test.tsx`|                                                                                       |
| `src/__tests__/app/kudos-compose-page.test.tsx`                   | Full-page fallback snapshot                                                             |
| `src/__tests__/integration/viet-kudo.integration.test.ts`         | Real-Supabase: create_kudo rate-limit + duplicate + anonymous masking + bucket upload + `kudo_feed_v` correctness |

### Source Code — Modified Files

| File                                                   | Changes                                                                                                 |
| ------------------------------------------------------ | ------------------------------------------------------------------------------------------------------- |
| `src/app/kudos/compose/page.tsx`                       | Replace stub body with `<ComposeKudoModal variant="fullpage" />` + server-side `?to=` resolve            |
| `src/app/globals.css`                                  | Append `/* Design Tokens — Viết Kudo (ihQ26W78P2) */` block with ~6 net-new tokens                       |
| `src/services/kudos-service.ts`                        | `from('kudos')` → `from('kudo_feed_v')`; handle `sender === null` in mapper                              |
| `src/services/kudos-client.ts`                         | Same SELECT source update                                                                               |
| `src/services/spotlight-client.ts`                     | `from('profiles')` for spotlight is unchanged; no anonymous concern there                               |
| `src/components/kudos/KudoCard.tsx`                    | Render "Ẩn danh" + generic avatar when `sender === null`; disable avatar link; run `content_html` through `sanitizeKudoHtml()` before `dangerouslySetInnerHTML` (defence-in-depth render guard) |
| `src/components/kudos/KudoHeader.tsx`                  | Same sender-null handling                                                                                |
| `src/components/kudos/Icon.tsx`                        | Extend `KudosIconName` union: `bold`, `italic`, `strikethrough`, `number-list`, `quote`, `plus`, `close`, `close-tiny` |
| `src/types/kudos.ts`                                   | `SunnerRef \| null` on `KudoCard.sender`; `KudoCard` adds `danhHieu`, `isAnonymous`, `contentHtml`       |
| `src/i18n/dictionaries/vi.ts`                          | Append `kudos.compose.*` keys — labels, placeholders, helper lines, 15 error strings, success toast, stub copy |
| `src/i18n/dictionaries/en.ts`                          | Mirror translations                                                                                     |
| `src/components/layout/AppHeader.tsx`                  | No change required                                                                                     |
| `package.json` / `yarn.lock`                           | Add `zod` ^3                                                                                            |
| `supabase/seeds/dev/kudos-seed.sql`                    | Back-fill `danh_hieu` (e.g. "Best teammate") + `content_html = content` + `is_anonymous = false` so seed passes new CHECK |
| `src/__tests__/services/kudos-service.test.ts`         | Update to match new `kudo_feed_v` select shape + sender-null branch                                     |

### Dependencies to add

| Package  | Version | Purpose                                                                    |
| -------- | ------- | -------------------------------------------------------------------------- |
| `zod`    | ^3      | Single-source-of-truth validation schema (client + route handler + tests) |

No dev-only additions.

---

## Implementation Strategy

### Spec → Plan Trace Matrix

| Spec item                                           | Plan phase(s)                            |
| --------------------------------------------------- | ---------------------------------------- |
| US1 Happy-path compose + submit (P1)                | Phase 2, 4                                |
| US2 Rich content: formatting + @mentions (P2)       | Phase 5                                   |
| US3 Image attachments (P2)                          | Phase 6                                   |
| US4 Anonymous mode (P2)                             | Phase 1 (view + service mapper) + Phase 7 UI toggle |
| US5 Cancel / close safely (P1)                      | Phase 4 (dirty tracking) + Phase 8 confirm dialog |
| US6 Deep link + prefill (P3)                        | Phase 9                                   |
| FR-001 client validation                             | Phase 1 (Zod) + Phase 4 (inline errors)   |
| FR-002 receiver autocomplete debounced + no paging   | Phase 3                                   |
| FR-003 rich-text formatting + 6 keyboard shortcuts + Ctrl+Enter submit | Phase 5                         |
| FR-004 `@mention` popover                           | Phase 5                                   |
| FR-005 hashtag auto-create on first use             | Phase 1 (RPC) + Phase 4 (hashtag field)   |
| FR-006 image upload ≤ 5                             | Phase 6                                   |
| FR-007 anonymous — mask sender everywhere           | Phase 1 (view) + Phase 7 (checkbox UI)    |
| FR-008 submit-disabled + hover tooltip listing missing fields | Phase 4 (+ `<SubmitTooltip />`)  |
| FR-009 success → invalidate queries                 | Phase 4                                   |
| FR-010 dirty-close confirm                          | Phase 8                                   |
| FR-011 backdrop / Esc / Hủy all honour confirm      | Phase 8                                   |
| FR-012 `?to=` prefill                               | Phase 9                                   |
| FR-013 focus trap                                   | Phase 4                                   |
| FR-014 realtime side-effect                         | Automatic via existing Live Board trigger |
| FR-015 image cleanup on cancel / remove             | Phase 6                                   |
| FR-016 character counters                           | Phase 4                                   |
| FR-017 dirty-close alertdialog styling               | Phase 8                                   |
| TR-001 stack                                        | entire plan                               |
| TR-002 contenteditable DIY                          | Phase 5                                   |
| TR-003 parallel + intercepting routes               | Phase 0 + Phase 2                         |
| TR-004 Storage bucket + RLS                         | Phase 1                                   |
| TR-005 mention token format                         | Phase 5                                   |
| TR-006 server HTML sanitiser (Cloudflare Worker)    | Phase 1 — `src/libs/html-sanitiser.ts` + `POST /api/kudos` route handler |
| TR-007 `create_kudo` RPC                            | Phase 1                                   |
| TR-008 duplicate guard                              | Phase 1 (inside RPC)                      |
| TR-009 5 MB cap at edge                             | Phase 6                                   |
| TR-010 Zod client + server                          | Phase 1                                   |
| TR-011 pre-fetch hashtags                           | Phase 2 (page-level hint)                 |
| TR-012 clean architecture (thin route handler)      | `POST /api/kudos/route.ts` stays ≤ ~40 LOC: parse → sanitise → RPC → map errors |
| Edge case: no session → redirect                     | Middleware + full-page fallback explicit `redirect('/auth/login?...')` |
| Edge case: pre-launch → `/prelaunch`                 | Phase 2 full-page fallback Server Component event-state guard |

### Phase 0 — Asset preparation

1. Add 8 new icons to `public/assets/kudos/icons/` — `bold.svg`, `italic.svg`, `strikethrough.svg`, `number-list.svg`, `quote.svg`, `plus.svg`, `close.svg`, `close-tiny.svg` (via `get_media_files` or manual export; follow existing kebab-case convention).
2. Extend the `KudosIconName` union in `src/components/kudos/Icon.tsx`.

### Phase 1 — Foundation: DB + validation + shared infra (TDD)

**Goal**: schema + RPC + view + storage bucket + validation schema + HTML sanitiser + Zod install, all tested before any UI work.

1. **Install `zod`**: `yarn add zod` + commit `package.json` + `yarn.lock`.
2. **Write failing integration test** `src/__tests__/integration/viet-kudo.integration.test.ts`: expects RPC success, rate-limit error after 11 calls/hour, duplicate guard error within 60 s, anonymous-sender-null through `kudo_feed_v`.
3. **Create migration** `supabase/migrations/20260421100000_viet_kudo_schema.sql`:
   - `ALTER TABLE public.kudos ADD COLUMN danh_hieu text NOT NULL DEFAULT '';`
   - `ALTER TABLE public.kudos ADD COLUMN is_anonymous boolean NOT NULL DEFAULT false;`
   - `ALTER TABLE public.kudos ADD COLUMN content_html text;`
   - Back-fill: `UPDATE public.kudos SET danh_hieu = 'Ghi nhận' WHERE danh_hieu = ''; UPDATE public.kudos SET content_html = content WHERE content_html IS NULL;`
   - `ALTER TABLE public.kudos ADD CONSTRAINT kudos_danh_hieu_length CHECK (length(danh_hieu) BETWEEN 1 AND 60);`
   - `ALTER TABLE public.kudos ADD CONSTRAINT kudos_content_html_notnull CHECK (content_html IS NOT NULL);`
   - New `public.kudo_mentions` table + RLS.
   - `CREATE VIEW public.kudo_feed_v AS SELECT k.id, k.receiver_id, k.created_at, k.hearts_count, k.department_id, k.content, k.content_html, k.danh_hieu, k.is_anonymous, CASE WHEN k.is_anonymous THEN NULL ELSE k.sender_id END AS sender_id FROM public.kudos k;` + grant SELECT to `authenticated`.
   - `CREATE OR REPLACE FUNCTION public.create_kudo(…) RETURNS jsonb …;` — `SECURITY DEFINER`, `set search_path = public, pg_temp`. Order of operations inside the function: (1) assert `auth.uid() IS NOT NULL` and `p_receiver_id <> auth.uid()`, (2) rate-limit (`count(*) > 10` in last hour ⇒ `raise_unique_violation 'rate_limited'`), (3) duplicate guard (`md5(p_content_html)` within 60s ⇒ `raise 'duplicate'`), (4) strip tags from `p_content_html` → plain-text `content` via `regexp_replace(…, '<[^>]+>', '', 'g')`, (5) INSERT kudo row with both `content` and `content_html` (Route Handler has already allowlist-sanitised `p_content_html`; the RPC is defence-in-depth but does NOT strip-again — that would be lossy for legitimate HTML), (6) upsert any new hashtag slugs into `public.hashtags` + insert join rows for `kudo_hashtags`, `kudo_images`, `kudo_mentions` (derive mention ids from `p_content_html` via regexp on `data-mention-id`), (7) return `jsonb_build_object('id', new_id, 'created_at', new_row.created_at)`.
   - Storage bucket: `INSERT INTO storage.buckets (id, name, public) VALUES ('kudos-images', 'kudos-images', true) ON CONFLICT DO NOTHING;`
   - Storage RLS policies:
     - `CREATE POLICY kudos_images_read ON storage.objects FOR SELECT TO authenticated USING (bucket_id = 'kudos-images');`
     - `CREATE POLICY kudos_images_insert_own ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'kudos-images' AND owner = auth.uid());`
     - `CREATE POLICY kudos_images_delete_own ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'kudos-images' AND owner = auth.uid());`
   - `GRANT EXECUTE ON FUNCTION public.create_kudo(uuid, text, text, text[], jsonb, boolean) TO authenticated;`
4. **Update dev seed** `supabase/seeds/dev/kudos-seed.sql` back-fill rows to satisfy the new NOT-NULL + CHECK (set `danh_hieu = 'Đồng đội đáng tin'` on every seed kudo, `content_html = content`).
5. **Run `supabase db reset --local`** — confirm no FK / CHECK failures.
6. **Write failing unit tests** + implement, in this order (each must go red before green):
   - `src/validation/kudos-compose.ts` (Zod schema factory) — 10 invalid variants + 3 valid.
   - `src/libs/html-sanitiser.ts` — pure `sanitizeKudoHtml(html: string): string` with the allowlist; tested against 15 XSS vectors (`<script>`, `<img onerror>`, `javascript:` in `href`, `<iframe>`, inline `style`, data-attrs outside `data-mention-id`, zero-width `<svg/onload>`, etc.) + 5 legitimate strings that MUST pass through unchanged.
   - `src/types/compose-kudo.ts` (DTOs).
   - `src/app/api/kudos/route.ts` (POST) — Zod parse → `sanitizeKudoHtml()` → `supabase.rpc('create_kudo', {...})` → map pg errors (`P0001 rate_limited` → 429, `P0001 duplicate` → 409, `P0001 invalid_receiver` → 422) to HTTP. Covered by a route handler test and the end-to-end integration test.
   - `src/services/kudos-compose-client.ts::createKudo()` — `fetch('/api/kudos', {...})` + JSON error envelope mapping per spec error table.
   - `src/services/profiles-client.ts::searchProfilesClient(q, { excludeSelf })` — `excludeSelf=true` applies `neq('id', session.uid())` (FR-002).
7. **Switch existing Live Board services** to `kudo_feed_v`:
   - `src/services/kudos-service.ts`, `src/services/kudos-client.ts` — update SELECT source + type mapper to handle `sender === null`.
   - Update `src/types/kudos.ts` — `KudoCard.sender: SunnerRef | null` + `danhHieu`, `contentHtml`, `isAnonymous`.
   - Patch `<KudoHeader>` and `<KudoCard>` to render "Ẩn danh" placeholder when sender is null.
   - Re-run all Live Board tests to confirm no regression.
8. **Run `yarn test` + `yarn build`** — full gate green.

**Checkpoint**: DB + RPC + view + storage + validation all tested; Live Board still ships; no UI change visible yet.

### Phase 2 — Route scaffolding (parallel + intercepting)

**Goal**: the route surface is ready so the modal can mount with an empty body in Phase 3.

1. Create `src/app/kudos/layout.tsx` declaring the `modal` parallel slot + rendering `{children} {modal}`.
2. Create `src/app/kudos/@modal/default.tsx` → `export default function ModalDefault() { return null; }`.
3. Create `src/app/kudos/@modal/(.)compose/page.tsx` → renders `<ComposeKudoModalStub variant="intercepted" />` (stub component for now).
4. Replace `src/app/kudos/compose/page.tsx` stub with a Server Component that:
   - **Event-state guard first**: call `fetchEventConfigServer()`; if event is not in `launched` state → `redirect('/prelaunch')` (mirrors the guard on `/kudos`). This covers the "campaign not yet launched" edge case on direct URL access.
   - **Auth guard**: `createClient()` + `auth.getUser()`; if no session → `redirect('/auth/login?redirect=/kudos/compose')`.
   - Reads `?to=` search param.
   - Calls `fetchProfileById(to)` if present, else `null`.
   - Renders `<ComposeKudoModalStub variant="fullpage" initialReceiver={profile} />`.
5. Write a page-level smoke test verifying both routes mount without errors (mock Supabase reads).

**Checkpoint**: `yarn dev` — clicking a `<Link href="/kudos/compose">` inside `/kudos` opens a stub modal; hitting `/kudos/compose` directly opens a stub page. No real form yet.

### Phase 3 — Providers + hooks

**Goal**: shared plumbing for the real form.

1. `ComposeKudoProvider` — React Context + reducer (write failing test for each action, then implement).
2. `use-receiver-search.ts` + `use-profile-by-id.ts` + underlying `searchProfilesClient`.
3. `use-mention-search.ts` (thin re-export of receiver search with a different cache key).
4. `use-compose-form-dirty.ts` — computes `isDirty` from the reducer state.

**Checkpoint**: hooks covered by unit tests that mock Supabase.

### Phase 4 — US1 + US5 vertical slice (P1) 🎯 MVP

**Goal**: end-to-end happy path + safe-close, no images/rich-text/anonymous yet.

0. Wire the `POST /api/kudos` route handler from Phase 1 into `use-create-kudo.ts` via `fetch()` (client never calls Supabase RPC directly).
1. Render structure (inside `<ComposeKudoModal>`):
   - `ModalBackdrop` (click → close)
   - `ModalCard`
     - `ModalTitle`
     - `ReceiverAutocomplete` (full behaviour: debounce + dropdown + keyboard + focus trap starter)
     - `DanhHieuInput` (+ helper lines + counter at ≥50)
     - A minimal `<textarea>` placeholder (rich-text comes in Phase 5 — use `<textarea>` temporarily so US1 ships)
     - `HashtagField` + `HashtagPicker` (auto-create new slug)
     - `FooterActions` (Hủy + Gửi)
2. Wire submit → `useCreateKudo` → invalidate queries → close + toast.
3. Implement FR-013 focus trap + Esc close (no dirty confirm yet).
4. Implement character counter component (`CharCounter`).
5. Integration test the happy path against real Supabase: create kudo, confirm Live Board `kudo_feed_v` row appears.

**Checkpoint**: a user can compose and send a plain-text kudo; Live Board updates in real time.

### Phase 5 — US2 rich-text editor + mentions (P2)

1. Build `editor/` — `KudoEditor`, `EditorToolbar`, `FormatButton`, `MentionPopover`, `commands.ts`, `serialize.ts`.
2. Replace the temporary `<textarea>` in the modal with `<KudoEditor>`.
3. Wire keyboard shortcuts inside `KudoEditor` (FR-003), each registered on the editor root's `keydown`:
   - `Ctrl/Cmd + B` → bold
   - `Ctrl/Cmd + I` → italic
   - `Ctrl/Cmd + Shift + X` → strikethrough
   - `Ctrl/Cmd + Shift + 7` → numbered list
   - `Ctrl/Cmd + K` → link prompt
   - `Ctrl/Cmd + Shift + 9` → blockquote
   - `Ctrl/Cmd + Enter` → submit (when form is valid)
   Shortcuts MUST `preventDefault` + skip when a modifier-free key or `input` outside the editor is active. Toolbar buttons reflect the same state via `aria-pressed`.
4. Wire HTML sanitiser: client-side `sanitise.ts` is a UX hint only; the Route Handler `POST /api/kudos` (Phase 1) is the trust boundary; the RPC is defence-in-depth (strips the plain `content` column, does not re-sanitise `content_html`).
5. Implement `@mention` popover (caret-anchored via `getCaretClientRect()`; Escape closes; Enter inserts).
6. Write unit tests for command wrapper (simulate selection ranges via `Range`), each keyboard shortcut, mention extraction, plain-text serialize, XSS payloads that bypass the client hint but are caught by the Route Handler in integration tests.

**Checkpoint**: rich content round-trips — created kudo renders with bold/italic/list/link/quote + mention chips in the Live Board card.

### Phase 6 — US3 image attachments (P2)

1. `POST /api/kudos/images/upload` route handler — multipart parse, MIME + 5 MB check, Supabase Storage upload.
2. `DELETE /api/kudos/images/{path}` route handler — owner check + storage delete.
3. `ImageUploader`, `ImageThumb`, upload hook, delete hook.
4. Orphan cleanup (FR-015): delete-on-remove, delete-on-cancel-with-dirty, daily GC cron (separate small migration adds a `pg_cron` job or at least documents the SQL).
5. Integration test: upload 3 images, remove 1, submit → `create_kudo` receives correct URL array, Storage contains exactly 2 files.

**Checkpoint**: images show up in the feed card; orphaned uploads get cleaned.

### Phase 7 — US4 anonymous mode (P2)

1. `AnonymousCheckbox` component.
2. Wire to reducer; pass through to `createKudo({ isAnonymous })`.
3. Update `<KudoHeader>` / `<KudoCard>` final polish: "Ẩn danh" label + generic avatar + disabled click-to-profile.
4. Integration test: anonymous kudo → Live Board + live ticker hide sender; admin (different user) also sees "Ẩn danh".

**Checkpoint**: privacy invariant holds in the DB + API + UI.

### Phase 8 — US5 dirty-close confirm dialog (P1 polish)

1. `DirtyCloseDialog` component (nested alertdialog).
2. Wire backdrop click + Esc + Hủy button to check `isDirty`.
3. Default focus on "Tiếp tục viết"; `[Bỏ]` discards form + orphan images.
4. Component tests for the confirm flow.

**Checkpoint**: miss-clicks no longer lose work; intentional discard cleans up everything.

### Phase 9 — US6 deep link + prefill (P3) + polish

1. `?to={userId}` prefill — server-side resolve on full-page fallback, client-side `useEffect` on intercepted modal.
2. Invalid-id handling: toast `Không tìm thấy người nhận này`.
3. Community Standards stub page `src/app/community-standards/page.tsx`.
4. Mobile bottom-sheet layout tests.
5. Axe-core accessibility audit on the modal (reuse `jest-axe` once the Live Board polish task T093 installs it; otherwise document as follow-up).
6. Update `SCREENFLOW.md` status: `discovered` → `implemented`, log implementation date.
7. Run `yarn lint` + `yarn build` — fix any warnings.

### Risk Assessment

| Risk                                                               | Probability | Impact | Mitigation                                                                                                        |
| ------------------------------------------------------------------ | ----------- | ------ | ----------------------------------------------------------------------------------------------------------------- |
| Contenteditable behaviour differs across browsers                  | High        | Med    | Encapsulate in `editor/commands.ts` + unit-test selection-range handling; QA on real Safari + Firefox + Chrome    |
| Hand-rolled HTML sanitiser misses an XSS vector                    | Med         | High   | Fuzz + golden-file tests with 15+ known XSS payloads; `POST /api/kudos` runs it on every request (trust boundary); render-time belt-and-braces — `KudoCard` runs `content_html` through the same sanitiser on read before `dangerouslySetInnerHTML` |
| Live Board regresses during `kudo_feed_v` migration                 | Med         | High   | Mandatory full test suite green between each service SELECT update; integration test verifying anonymous + non-anonymous both render |
| Cloudflare Workers can't handle 5 MB multipart uploads reliably    | Med         | Med    | Use Supabase Storage direct-upload via signed URL — bypass Workers for large bodies if needed (future optimisation; ship MVP via Workers first) |
| Next.js parallel + intercepting route subtleties (Next 15 RC)       | Med         | Med    | Follow canonical example `app/foo/@modal/(.)bar/page.tsx` + default.tsx + verify on latest Next 15.5.9             |
| Orphan image cleanup crons not supported on managed Supabase        | Low         | Low    | Fallback: lazy cleanup on next feed fetch (service-role scans `storage.objects` without a matching `kudo_images.url` older than 24h)     |
| Existing Live Board seed row's `danh_hieu = ''` fails new CHECK     | High        | Low    | Migration sets `danh_hieu = 'Ghi nhận'` back-fill BEFORE applying the CHECK                                        |
| Rate-limit + duplicate logic inside RPC makes testing flaky         | Low         | Med    | Use a parametrised RPC variant during integration tests that skips the rate check when called with service_role   |

### Estimated Complexity

- **Frontend**: **High** — modal with rich-text editor + mention popover + chip field + uploader + dirty-close + parallel routes.
- **Backend**: **Med** — one migration extending existing schema + one RPC + one view + Storage bucket + 2 route handlers.
- **Testing**: **High** — TDD across services, hooks, components, sanitiser fuzz, real-Supabase integration.

---

## Integration Testing Strategy

### Test Scope

- [x] **Component / Module**: `ComposeKudoModal` ↔ `useCreateKudo` ↔ Supabase RPC; `ImageUploader` ↔ Storage route handler; `KudoEditor` ↔ mention popover ↔ `useMentionSearch`.
- [x] **External dependencies**: Supabase Auth (session), Supabase RPC (`create_kudo`), Supabase Storage (`kudos-images` bucket).
- [x] **Data layer**: new `kudo_feed_v` view correctness, rate-limit + duplicate + anonymous masking, cascading inserts into `kudos` / `kudo_hashtags` / `kudo_images` / `kudo_mentions`.
- [x] **User workflows**: open modal → fill → submit → success → Live Board updates. Open modal → fill → cancel → orphan image cleaned. Open modal with `?to=` → receiver prefilled.

### Test Categories

| Category            | Applicable? | Key scenarios                                                                                 |
| ------------------- | ----------- | --------------------------------------------------------------------------------------------- |
| UI ↔ Logic          | Yes         | Form validation, receiver autocomplete, hashtag chips, image progress rings, dirty-close      |
| Service ↔ Service   | Yes         | `createKudo` triggers `on_kudo_insert` which populates `live_kudo_events`                     |
| App ↔ External API  | Yes         | Supabase RPC, Storage, Auth                                                                   |
| App ↔ Data layer    | Yes         | `kudo_feed_v` masking, rate-limit, duplicate guard, cascading deletes                         |
| Cross-platform      | Yes         | Mobile bottom-sheet vs desktop modal; Safari/Firefox contenteditable quirks                   |

### Test Environment

- **Environment type**: Local Supabase CLI (`supabase start`) with the new migration applied; jsdom for unit/component tests.
- **Test data strategy**: `supabase/seeds/dev/kudos-seed.sql` (back-filled); per-test cleanup via `TRUNCATE public.kudos, public.kudo_mentions, public.kudo_hashtags, public.kudo_images, public.kudo_hearts, public.live_kudo_events, public.secret_boxes RESTART IDENTITY CASCADE`.
- **Isolation approach**: Integration tests use a service-role Supabase client to set up state + invoke `create_kudo` as a specific user via `auth.admin.generate_link` or direct `auth.users` INSERT + JWT impersonation. Component tests use `renderWithQuery` + `MockSupabase` fixtures.

### Mocking Strategy

| Dependency                       | Strategy                          | Rationale                                                                  |
| -------------------------------- | --------------------------------- | -------------------------------------------------------------------------- |
| Supabase client (unit/component) | Mock                              | Deterministic; asserts query/RPC shape                                     |
| Supabase client (integration)    | Real                              | Constitution §III.5                                                        |
| Supabase Storage (unit)          | Mock — in-memory `{ url, path }` fixture | Storage latency irrelevant at unit level                              |
| Supabase Storage (integration)   | Real                              | RLS must be exercised                                                     |
| Clipboard (not used here)        | N/A                               | No copy interactions in this feature                                      |
| `IntersectionObserver`           | Mock                              | jsdom lacks native                                                        |
| `window.getSelection`            | jsdom has partial impl; augment with fake `Range` in `KudoEditor` tests | |

### Test scenarios outline

1. **Happy path**
   - [ ] Fill receiver, danh hiệu, content (5+ chars), 1 hashtag → submit → RPC returns 201 → Live Board feed contains the kudo.
   - [ ] Add mention `@Chức` → content_html contains `<span data-mention-id>`, kudo_mentions row created.
   - [ ] Upload 3 images → `kudos-images` bucket contains files → kudo_images references them with correct position.
   - [ ] Tick anonymous → `kudo_feed_v.sender_id` is NULL for this row → KudoCard renders "Ẩn danh".
   - [ ] `?to={userId}` → receiver field prefilled on mount.
2. **Error handling**
   - [ ] 11 kudos in an hour → RPC returns `P0001 rate_limited` → UI toast.
   - [ ] Duplicate content within 60s → `P0001 duplicate` → inline toast.
   - [ ] Image > 5 MB → upload route returns 413 → toast + thumb removed.
   - [ ] Content > 2000 chars → submit disabled, counter red.
   - [ ] 401 session expired during submit → redirect to `/auth/login?redirect=/kudos/compose`.
3. **Edge cases**
   - [ ] Close with dirty form → confirm dialog; Bỏ discards orphan images.
   - [ ] `?to=` points at a deleted user → toast "Không tìm thấy người nhận này" + empty receiver.
   - [ ] Hashtag slug already exists → upsert is idempotent.
   - [ ] New hashtag slug → `public.hashtags` row created.
   - [ ] Reduced motion → modal opens without animations.
   - [ ] Anonymous kudo seen by admin user → still "Ẩn danh".

### Tooling & framework

- **Test framework**: Jest 29 + `@testing-library/react` + `@testing-library/user-event` + `@testing-library/jest-dom` (unit/component); Jest + node + Supabase CLI (integration).
- **Supporting tools**: `supabase` CLI for ephemeral DB; `MessageChannel` polyfill if needed for streaming body tests.
- **CI integration**: existing `yarn test` + new `SUPABASE_INTEGRATION=1 yarn test` step; Supabase started by the workflow.

### Coverage goals

| Area                          | Target   | Priority |
| ----------------------------- | -------- | -------- |
| Zod schema + HTML sanitiser   | 100%     | High     |
| Services + hooks              | 85%+     | High     |
| Rich-text editor commands     | 90%+     | High     |
| Components                    | 80%+     | High     |
| Route handlers                | 90%+     | High     |
| Integration: `create_kudo` + `kudo_feed_v` + Storage flow | 100% of happy + rate-limit + duplicate + anonymous branches | High |

---

## Dependencies & Prerequisites

### Required before start

- [x] `constitution.md` reviewed
- [x] `spec.md` reviewed — all 11 clarification questions locked-in
- [x] `design-style.md` reviewed
- [x] `research.md` completed
- [ ] Research open questions resolved (RN1–RN5)
  - [x] RN1 (add zod) — approved via Violations table
  - [ ] RN2 — confirm hand-rolled sanitiser vs `isomorphic-dompurify` (plan assumes hand-roll; ~30 LOC pure-TS — no Workers-incompatible deps)
  - [ ] RN3 — `@supabase/storage-js` works on Cloudflare Workers runtime
  - [ ] RN4 — confirm we can land `kudo_feed_v` migration + service refactor in the same PR as Viết Kudo features
  - [ ] RN5 — verify dev seed content has no `<>&` characters that need escaping on back-fill
  - [ ] RN6 — confirm `src/app/kudos/page.tsx` already calls `fetchEventConfigServer()` for the pre-launch redirect so the fallback page can reuse the same helper (expected yes per Live Board implementation)
- [ ] Supabase Storage bucket `kudos-images` created by migration + policies tested locally
- [ ] Community Standards page exists as a stub before modal ships (so the toolbar link doesn't 404)

### External dependencies

- Supabase Auth + Postgres + Storage + Realtime (already integrated)
- Cloudflare Workers (already integrated via OpenNext) — must support streaming multipart

---

## Next Steps

After plan approval:

1. Resolve RN2 / RN3 / RN4 / RN5 (RN1 already approved here).
2. **Run** `/momorph.tasks` to break this plan into an ordered task list with dependencies.
3. **Review** `tasks.md` — Phase 0 (assets) + Phase 1 (DB + validation + service refactor) are the critical path.
4. **Begin** implementation: TDD red-green-refactor per task; keep `yarn test` + integration green at every commit.

---

## Notes

- This feature is **write-path first class** — more server-side validation / security surface per LOC than any previous Kudos work. Plan ~30% of effort on testing (fuzz + integration) rather than UI.
- `kudo_feed_v` is the most subtle change — it touches shipped code. Keep the PR reviewable: migration + service update + KudoCard sender-null handling + test updates are one cohesive diff.
- Rich-text editor will be revisited if product ever wants headings, tables, or inline images. The `editor/` directory is the seam where a Tiptap swap would land — keep the public API minimal so the refactor stays local.
- Storage bucket naming convention: `{feature}-{content}`; other features might add `profile-avatars`, `award-attachments`. Plan doesn't commit to that convention yet, but `kudos-images` follows it.
- The Community Standards page content is out of scope; only a stub route is part of this plan so the in-toolbar link doesn't 404.
