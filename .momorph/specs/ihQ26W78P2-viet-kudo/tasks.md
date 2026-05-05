# Tasks: Viết Kudo (Compose Kudo Modal)

**Frame**: `ihQ26W78P2-viet-kudo`
**Prerequisites**: `plan.md` (required), `spec.md` (required), `design-style.md` (required), `research.md`
**TDD**: Constitution §III mandates red-green-refactor — every `*.test.*` task MUST go red before the implementation task that follows.

---

## Task Format

```
- [ ] T### [P?] [Story?] Description with file path
```

- **[P]** — can run in parallel (different files, no dependency on incomplete tasks)
- **[Story]** — maps to user stories (US1..US6); omit for Setup / Foundation / Polish
- All tasks reference exact file paths from `plan.md`

---

## Phase 1: Setup

**Purpose**: Assets + dependencies + icon type extension — no feature work yet.

- [x] T001 Download 8 new icons (bold, italic, strikethrough, number-list, quote, plus, close, close-tiny) via `get_media_files` to `public/assets/kudos/icons/`
- [x] T002 Add `zod` ^3 dependency via `yarn add zod` and commit `package.json` + `yarn.lock`
- [x] T003 [P] Extend `KudosIconName` union with 8 new icon names in `src/components/kudos/Icon.tsx`
- [x] T004 [P] Append `/* Design Tokens — Viết Kudo (ihQ26W78P2) */` block with the 6 net-new tokens to `src/app/globals.css`
- [x] T005 [P] Append `kudos.compose.*` i18n keys (labels, helpers, 15 error strings, success toast) to `src/i18n/dictionaries/vi.ts`
- [x] T006 [P] Mirror the same keys in `src/i18n/dictionaries/en.ts`

**Checkpoint**: `yarn build` passes; icons render via `<Icon name="bold" />` without TS errors.

---

## Phase 2: Foundation (Blocking Prerequisites)

**Purpose**: DB schema + RPC + view + Storage bucket + Route Handler + validation + sanitiser + service refactor to `kudo_feed_v`.

**⚠️ CRITICAL**: No user-story work may begin until every task in this phase is green.

### TDD harness — write failing tests first

- [ ] T007 Write failing integration test suite (skeleton expecting RPC + view + storage) in `src/__tests__/integration/viet-kudo.integration.test.ts`
- [ ] T008 [P] Write failing unit test for Zod schema in `src/__tests__/validation/kudos-compose.test.ts` (3 valid + 10 invalid variants)
- [ ] T009 [P] Write failing unit test for HTML sanitiser in `src/__tests__/libs/html-sanitiser.test.ts` (15 XSS vectors + 5 legitimate pass-throughs)
- [ ] T010 [P] Write failing unit test for `POST /api/kudos` Route Handler in `src/__tests__/app/api/kudos-route.test.ts` (Zod→400, rate-limit→429, duplicate→409, invalid-receiver→422, success→201)
- [ ] T011 [P] Write failing unit test for `createKudo()` client in `src/__tests__/services/kudos-compose-client.test.ts`
- [ ] T012 [P] Write failing unit test for `searchProfilesClient(q, { excludeSelf })` in `src/__tests__/services/profiles-client.test.ts`

### DB migration

- [x] T013 Create migration `supabase/migrations/20260421100000_viet_kudo_schema.sql` with ALTERs on `public.kudos` (danh_hieu, is_anonymous, content_html), back-fill existing rows, add CHECK constraints
- [x] T014 Append to the same migration: create `public.kudo_mentions` table + RLS policies + FK to `profiles`
- [x] T015 Append to the same migration: create `public.kudo_feed_v` view masking `sender_id` when `is_anonymous = true` + grant SELECT to `authenticated`
- [x] T016 Append to the same migration: create `public.create_kudo(p_receiver_id, p_danh_hieu, p_content_html, p_hashtag_slugs, p_image_urls, p_is_anonymous)` RPC as `SECURITY DEFINER` with 7-step body (auth + self + rate-limit + duplicate + tag-strip + INSERT + upserts) per plan
- [x] T017 Append to the same migration: create `kudos-images` Storage bucket + RLS policies (read: authenticated, insert: owner=auth.uid(), delete: owner=auth.uid())
- [x] T018 Append to the same migration: `GRANT EXECUTE ON FUNCTION public.create_kudo(...) TO authenticated;`
- [x] T019 Update dev seed `supabase/seeds/dev/kudos-seed.sql` — back-fill `danh_hieu` + `content_html` on every seed row
- [ ] T020 Run `supabase db reset --local` and confirm migration applies cleanly + seed passes new CHECK

### Shared types + validation + sanitiser

- [x] T021 [P] Create DTOs in `src/types/compose-kudo.ts` (`ComposeKudoForm`, `ComposeKudoResult`, `KudoImageUpload`)
- [x] T022 [P] Implement Zod schema factory in `src/validation/kudos-compose.ts` — T008 must go green
- [x] T023 [P] Implement `sanitizeKudoHtml(html: string): string` allowlist in `src/libs/html-sanitiser.ts` (~30 LOC) — T009 must go green

### Route Handler + clients

- [x] T024 Implement `POST /api/kudos` Route Handler in `src/app/api/kudos/route.ts` — Zod parse → sanitise → forward to RPC → map pg errors → T010 must go green
- [x] T025 [P] Implement `createKudo()` HTTP wrapper in `src/services/kudos-compose-client.ts` — T011 must go green
- [x] T026 [P] Implement `searchProfilesClient(q, { excludeSelf })` in `src/services/profiles-client.ts` — T012 must go green
- [x] T027 [P] Implement `fetchProfileById(id)` server helper in `src/services/kudos-compose-service.ts`

### Live Board refactor to `kudo_feed_v` (backward-compat risk — test coverage is the gate)

- [x] T028 [P] Update `src/types/kudos.ts` — `KudoCard.sender: SunnerRef | null`; add `danhHieu`, `contentHtml`, `isAnonymous` fields
- [x] T029 Switch `src/services/kudos-service.ts` SELECT source from `kudos` → `kudo_feed_v`; handle `sender === null`
- [x] T030 Switch `src/services/kudos-client.ts` SELECT source from `kudos` → `kudo_feed_v`; handle `sender === null`
- [x] T031 Audit `src/services/spotlight-client.ts` — update only if it joins to `kudos`; leave untouched otherwise
- [x] T032 Patch `src/components/kudos/KudoCard.tsx` — render "Ẩn danh" + generic avatar when `sender === null`; run `sanitizeKudoHtml()` on `content_html` before `dangerouslySetInnerHTML`
- [x] T033 Patch `src/components/kudos/KudoHeader.tsx` — same sender-null handling + disabled profile link
- [ ] T034 [P] Update `src/__tests__/services/kudos-service.test.ts` for new select shape + sender-null branch

### Foundation integration gate

- [ ] T035 Complete the integration test body in T007 — rate-limit (11 calls/hour → 429), duplicate (same content_html inside 60s → 409), anonymous masking (sender_id null via `kudo_feed_v`), storage upload RLS
- [ ] T036 Run `yarn test` + `SUPABASE_INTEGRATION=1 yarn test` + `yarn build` — full gate must be green before Phase 3

**Checkpoint**: Live Board still renders correctly on `yarn dev`; no UI change visible yet; DB + RPC + view + storage + validation + sanitiser + Route Handler all tested.

---

## Phase 3: Route Scaffolding + Shared Providers + Hooks

**Purpose**: Parallel + intercepting routes + form-state provider + reusable query hooks so US phases can mount real forms immediately.

### Routes

- [x] T037 Create `src/app/kudos/layout.tsx` declaring the `modal` parallel slot + rendering `{children} {modal}`
- [x] T038 [P] Create `src/app/kudos/@modal/default.tsx` returning `null`
- [x] T039 [P] Create `src/app/kudos/@modal/(.)compose/page.tsx` rendering `<ComposeKudoModal variant="intercepted" />`
- [x] T040 Replace `src/app/kudos/compose/page.tsx` with Server Component: event-state guard → auth guard → `?to=` resolve → `<ComposeKudoModal variant="fullpage" initialReceiver={profile} />`
- [x] T041 [P] Create stub `src/app/community-standards/page.tsx` ("Coming soon") so the toolbar link doesn't 404
- [ ] T042 [P] Write page-level smoke test verifying both route mounts in `src/__tests__/app/kudos-compose-page.test.tsx`

### Form-state provider + hooks (TDD)

- [ ] T043 [P] Write failing reducer tests for `ComposeKudoProvider` (setField, addHashtag, removeHashtag, addImage, markImageUploaded, removeImage, setSubmitting, setError, markDirty) in `src/__tests__/components/kudos/compose/ComposeKudoProvider.test.tsx`
- [x] T044 Implement `ComposeKudoProvider` in `src/components/kudos/compose/ComposeKudoProvider.tsx` — T043 goes green
- [ ] T045 [P] Write failing test for `use-receiver-search.ts` in `src/__tests__/hooks/use-receiver-search.test.ts`
- [x] T046 [P] Implement `src/hooks/use-receiver-search.ts` — 300ms debounce, limit 10, excludeSelf via `searchProfilesClient`
- [x] T047 [P] Implement `src/hooks/use-profile-by-id.ts` (query key `['profiles', id]`, 60s staleTime)
- [x] T048 [P] Implement `src/hooks/use-mention-search.ts` as thin re-export of receiver search with a different cache key
- [ ] T049 [P] Implement `src/hooks/use-compose-form-dirty.ts` deriving `isDirty` from reducer state
- [ ] T050 [P] Write failing test for `use-create-kudo.ts` in `src/__tests__/hooks/use-create-kudo.test.ts`
- [x] T051 Implement `src/hooks/use-create-kudo.ts` — `useMutation` → `POST /api/kudos` → invalidate `['kudos-feed']`, `['kudos-highlights']`, `['kudos-spotlight']`, `['user-stats']`

**Checkpoint**: `/kudos/compose` opens a stub modal; provider + hooks unit-tested; Live Board unaffected.

---

## Phase 4: User Story 1 — Happy-path compose + submit (Priority: P1) 🎯 MVP

**Goal**: User can fill receiver + danh hiệu + plain-text content + 1 hashtag and hit Gửi; Live Board feed updates within 3s.

**Independent Test**: From `/kudos`, click "Ghi nhận" → fill all required fields → click "Gửi" → modal closes + success toast + new kudo at top of All-Kudos feed on another browser session.

### Field atoms + molecules (TDD — test file first, then component)

- [x] T052 [P] [US1] Write `ModalBackdrop.test.tsx` then implement `src/components/kudos/compose/ModalBackdrop.tsx` (fixed inset + click-to-close prop)
- [x] T053 [P] [US1] Write `ModalTitle.test.tsx` then implement `src/components/kudos/compose/ModalTitle.tsx`
- [x] T054 [P] [US1] Implement `src/components/kudos/compose/CharCounter.tsx` (shown at threshold, red on overflow)
- [x] T055 [P] [US1] Write `ReceiverAutocomplete.test.tsx` then implement `src/components/kudos/compose/ReceiverAutocomplete.tsx` — debounce + dropdown + keyboard nav + chip state when `?to=` prefilled
- [x] T056 [P] [US1] Implement `src/components/kudos/compose/DanhHieuInput.tsx` — input + 2-line helper + counter at ≥50
- [x] T057 [P] [US1] Write `HashtagPicker.test.tsx` then implement `src/components/kudos/compose/HashtagPicker.tsx` — popover over `fetchHashtagsClient()` + new-slug regex validate
- [x] T058 [P] [US1] Implement `src/components/kudos/compose/RemovableHashtagChip.tsx` (variant of existing `HashtagChip` with × remove)
- [x] T059 [US1] Write `HashtagField.test.tsx` then implement `src/components/kudos/compose/HashtagField.tsx` — chip group + + Hashtag button (hides at 5/5)
- [x] T060 [P] [US1] Implement `src/components/kudos/compose/SubmitTooltip.tsx` listing missing required fields (FR-008)
- [x] T061 [P] [US1] Implement `src/components/kudos/compose/FooterActions.tsx` — Hủy + Gửi row; Gửi hosts `<SubmitTooltip />`

### Modal shell + submit wiring

- [ ] T062 [US1] Write `ComposeKudoModal.test.tsx` failing assertions (mounts + focus lands on receiver + backdrop click closes)
- [x] T063 [US1] Implement `src/components/kudos/compose/ComposeKudoModal.tsx` — portal + backdrop + card + sections + provider wrapper; use temporary `<textarea>` placeholder for content (rich-text lands in Phase 5)
- [x] T064 [US1] Replace the Phase-3 stub content in `@modal/(.)compose/page.tsx` + `compose/page.tsx` with `<ComposeKudoModal variant="intercepted|fullpage" />`
- [x] T065 [US1] Implement FR-013 focus trap inside `ComposeKudoModal` + Esc close (no dirty-confirm yet — that's Phase 8 / US5)
- [x] T066 [US1] Wire submit → `useCreateKudo` → on success: invalidate queries + close + `useToast("kudos.compose.success")`; on error: inline banner with retry
- [ ] T067 [US1] Add `src/components/kudos/compose/skeletons/ComposeSkeleton.tsx` for the full-page fallback `?to=` resolve

### US1 integration gate

- [ ] T068 [US1] Write `src/__tests__/components/kudos/compose/ComposeKudoModal.test.tsx` component test (happy path render + submit)
- [ ] T069 [US1] Extend `viet-kudo.integration.test.ts` with a real-Supabase happy-path scenario: create kudo → `kudo_feed_v` row visible + `live_kudo_events` row inserted

**Checkpoint**: Plain-text kudo can be sent; Live Board feed updates in real time; Esc + backdrop close (no dirty-confirm yet).

---

## Phase 5: User Story 2 — Rich-text editor + mentions (Priority: P2)

**Goal**: User can apply 6 formats via toolbar or keyboard and insert `@mentions`; formatting round-trips through `kudo_feed_v` into the Live Board card.

**Independent Test**: Open modal, type content with bold/italic/mention, submit → feed card renders the exact same formatting + clickable mention chip.

### Editor primitives (TDD)

- [ ] T070 [P] [US2] Write `editor/commands.test.ts` then implement `src/components/kudos/compose/editor/commands.ts` (bold, italic, strike, link, numbered-list, blockquote, mention-insert)
- [ ] T071 [P] [US2] Write `editor/serialize.test.ts` then implement `src/components/kudos/compose/editor/serialize.ts` (`toPlainText`, `extractMentionIds`, `stripTags`)
- [ ] T072 [P] [US2] Implement `src/components/kudos/compose/editor/sanitise.ts` — client-side hint re-exporting `sanitizeKudoHtml` from `libs/html-sanitiser`
- [ ] T073 [P] [US2] Write `FormatButton.test.tsx` then implement `src/components/kudos/compose/editor/FormatButton.tsx` (aria-pressed per format state)
- [ ] T074 [US2] Write `EditorToolbar.test.tsx` then implement `src/components/kudos/compose/editor/EditorToolbar.tsx` (6 buttons + right-aligned community link)
- [ ] T075 [P] [US2] Implement `src/components/kudos/compose/editor/CommunityStandardsLink.tsx` (red link, target=_blank, `href=/community-standards`)
- [ ] T076 [US2] Write `MentionPopover.test.tsx` then implement `src/components/kudos/compose/editor/MentionPopover.tsx` — caret-anchored via `getCaretClientRect()`, up to 5 suggestions, Esc closes
- [ ] T077 [US2] Write `KudoEditor.test.tsx` then implement `src/components/kudos/compose/editor/KudoEditor.tsx` — controlled contenteditable + toolbar + mention popover orchestration

### Wire into modal + shortcuts

- [ ] T078 [US2] Replace temporary `<textarea>` in `ComposeKudoModal.tsx` with `<KudoEditor />`; pipe `onChange` → reducer
- [ ] T079 [US2] Register keyboard shortcuts inside `KudoEditor` (`Ctrl/Cmd+B / +I / +Shift+X / +Shift+7 / +K / +Shift+9`) with preventDefault; plus `Ctrl/Cmd+Enter` submit when form valid
- [ ] T080 [US2] Extend integration test: mention `@Chức` → `kudo_mentions` row inserted + `content_html` contains `<span data-mention-id>`; bold/italic round-trips render in KudoCard

**Checkpoint**: Rich formatting + mentions survive round-trip through the feed; XSS vectors blocked at Route Handler boundary.

---

## Phase 6: User Story 3 — Image attachments (Priority: P2)

**Goal**: User can attach up to 5 images (≤5 MB each) with per-file progress; orphan blobs are cleaned on remove/cancel.

**Independent Test**: Upload 3 → remove 1 → submit → feed card shows 2 images + Storage bucket contains exactly 2 objects.

### Upload/delete route handlers (TDD)

- [ ] T081 [P] [US3] Write failing test for `POST /api/kudos/images/upload` in `src/__tests__/app/api/kudos-images-upload.test.ts` (multipart parse + MIME + 5 MB + 413 over-limit)
- [ ] T082 [US3] Implement `src/app/api/kudos/images/upload/route.ts` — multipart → MIME check → size check → service-role Storage upload → `{ url, path }`
- [ ] T083 [P] [US3] Write failing test for `DELETE /api/kudos/images/[path]` in `src/__tests__/app/api/kudos-images-delete.test.ts` (owner check + 404 + 403)
- [ ] T084 [US3] Implement `src/app/api/kudos/images/[path]/route.ts` — owner check + Storage remove
- [ ] T085 [P] [US3] Write failing test for `kudo-images-client.ts` + implement `src/services/kudo-images-client.ts` wrappers

### Hooks + UI

- [ ] T086 [P] [US3] Write failing test for `use-kudo-image-upload.ts` + implement `src/hooks/use-kudo-image-upload.ts` (per-file `useMutation` with AbortController)
- [ ] T087 [P] [US3] Implement `src/hooks/use-kudo-image-delete.ts`
- [ ] T088 [P] [US3] Implement `src/components/kudos/compose/ImageThumb.tsx` (80×80, inner frame, × remove)
- [ ] T089 [US3] Implement `src/components/kudos/compose/ImageUploader.tsx` — grid + progress rings + + Image button (hide at 5/5)
- [ ] T090 [US3] Wire uploader into `ComposeKudoModal` + reducer; cleanup orphan blobs on thumb × and on dirty-discard
- [ ] T091 [US3] Document daily GC SQL (pg_cron or documented manual) in `supabase/migrations/20260421100000_viet_kudo_schema.sql` footer or separate follow-up migration

### US3 integration gate

- [ ] T092 [US3] Extend integration test: upload 3 → remove 1 → submit → `kudo_images` has 2 rows + Storage has 2 objects + orders preserved

**Checkpoint**: Images attach, preview, remove, upload, and get cleaned on cancel.

---

## Phase 7: User Story 4 — Anonymous mode (Priority: P2)

**Goal**: Checked "ẩn danh" → every viewer (incl. admins) sees "Ẩn danh" on the new kudo; DB row retains sender_id for triggers.

**Independent Test**: Tick checkbox → submit → in a second browser session as a different user (including an admin), the kudo card shows "Ẩn danh" avatar + label.

- [ ] T093 [P] [US4] Write `AnonymousCheckbox.test.tsx` then implement `src/components/kudos/compose/AnonymousCheckbox.tsx`
- [ ] T094 [US4] Wire checkbox → reducer → `createKudo({ isAnonymous })`; add hint "(sẽ hiển thị là Ẩn danh)" below when checked
- [ ] T095 [US4] Polish `KudoHeader.tsx` / `KudoCard.tsx` anonymous rendering — "Ẩn danh" label + `/assets/kudos/images/avatar-placeholder.svg` + disabled click-to-profile
- [ ] T096 [US4] Extend integration test: anonymous kudo seen from a second account AND an admin account → both get `sender: null` via `kudo_feed_v`; `live_kudo_events` still fires (receiver_name safe)

**Checkpoint**: Privacy invariant holds at DB + API + UI layers.

---

## Phase 8: User Story 5 — Dirty-close confirm dialog (Priority: P1 polish)

**Goal**: Miss-clicks never lose work; intentional discard fully clears form + orphan images.

**Independent Test**: Touch any field → Esc / backdrop / Hủy → confirm dialog appears with default focus on "Tiếp tục viết"; Bỏ discards + removes orphan images.

- [ ] T097 [P] [US5] Write `DirtyCloseDialog.test.tsx` then implement `src/components/kudos/compose/DirtyCloseDialog.tsx` — nested `role="alertdialog"`, 400×200 cream card per design-style
- [ ] T098 [US5] Replace plain Esc/backdrop/Hủy close with dirty-check wrapper that opens `DirtyCloseDialog` when `isDirty === true`
- [ ] T099 [US5] On "Bỏ": run orphan-image delete loop + reducer reset + close modal
- [ ] T100 [US5] On "Tiếp tục viết": close sub-dialog only, restore focus to last-active form field
- [ ] T101 [US5] Component test: dirty form + backdrop click → dialog opens; Bỏ → orphan images deleted; Tiếp tục viết → no data lost

**Checkpoint**: Safe cancel UX complete.

---

## Phase 9: User Story 6 — Deep link + prefill (Priority: P3)

**Goal**: `/kudos/compose?to={uid}` pre-fills the receiver (either route variant); invalid id → toast + empty receiver.

**Independent Test**: Navigate to `/kudos/compose?to={validUid}` → receiver chip pre-filled. Navigate to `…?to={invalidUid}` → empty + toast "Không tìm thấy người nhận này".

- [ ] T102 [P] [US6] Full-page fallback `?to=` already resolved server-side in T040 — verify + add error-boundary toast when `fetchProfileById` returns null
- [ ] T103 [US6] Intercepted modal — read `?to=` via `useSearchParams` in a `useEffect`, call `use-profile-by-id`, set receiver via provider on success; toast on null
- [ ] T104 [US6] Handle × on pre-filled chip → clear receiver + allow search again (FR-012)
- [ ] T105 [US6] Extend integration/smoke test: valid id prefills; invalid id shows toast; deleted user triggers same toast

**Checkpoint**: All 6 user stories shippable.

---

## Phase 10: Polish & Cross-Cutting Concerns

- [ ] T106 [P] Apply mobile bottom-sheet CSS per `design-style.md` — media-query rules inside the Viết Kudo tokens block in `src/app/globals.css`
- [ ] T107 [P] Gate all animations by `@media (prefers-reduced-motion: reduce)` (open/close, toolbar hover, submit spinner)
- [ ] T108 [P] Run axe-core audit on the modal via `jest-axe` (if shipped) or document as follow-up in the PR description
- [ ] T109 [P] Update `.momorph/contexts/SCREENFLOW.md` — mark Viết Kudo `implemented` + log date
- [ ] T110 [P] Ensure all new files ≤ 200 LOC per Constitution §V; split if any component exceeds
- [ ] T111 [P] Verify `yarn lint` + `yarn build` clean; fix warnings
- [ ] T112 Run `/momorph.commit` to create conventional commits grouped per logical phase (e.g., `feat(kudos): add compose modal schema + rpc`, `feat(kudos/compose): happy-path vertical slice`, …)

**Checkpoint**: Feature shipped; Live Board regression-free; all tests green.

---

## Dependencies & Execution Order

### Phase-level

- **Phase 1 (Setup)** — no deps, starts immediately
- **Phase 2 (Foundation)** — depends on Phase 1; BLOCKS Phases 3–9
- **Phase 3 (Routes + Providers)** — depends on Phase 2; BLOCKS Phases 4–9
- **Phase 4 (US1 MVP)** — depends on Phase 3; unblocks shipping the MVP
- **Phase 5 (US2 rich-text)** — depends on Phase 4 (replaces temporary textarea)
- **Phase 6 (US3 images)** — depends on Phase 4; independent of Phase 5
- **Phase 7 (US4 anonymous)** — depends on Phase 2 (view exists) + Phase 4 (checkbox mounts into modal)
- **Phase 8 (US5 dirty-close)** — depends on Phase 4; CAN run parallel with US3 + US4 if staffed
- **Phase 9 (US6 deep-link)** — depends on Phase 4 (full-page route already set up in Phase 3)
- **Phase 10 (Polish)** — depends on all stories you intend to ship

### Within a phase

- Tests MUST fail before their paired implementation starts (Constitution §III).
- `[P]` tasks in the same phase target different files and can run concurrently.
- Components depend on their atoms; molecules depend on their atoms; organisms depend on their molecules.

### Critical path to MVP

```
T001 → T002 → (T003,T004,T005,T006)
     → T007..T012 (failing tests)
     → T013..T020 (migration + seed + db reset)
     → T021..T027 (types + validation + sanitiser + route handler + clients)
     → T028..T034 (Live Board refactor to kudo_feed_v)
     → T035..T036 (Foundation gate)
     → T037..T051 (routes + providers + hooks)
     → T052..T069 (US1 vertical slice)
     → MVP shippable
```

### Parallel opportunities

- Phase 1: T003 + T004 + T005 + T006 — 4-way parallel after T001/T002
- Phase 2: T008–T012 failing tests all in parallel; T021 + T022 + T023 (types/zod/sanitiser) parallel after migration; T025 + T026 + T027 (clients) parallel after Route Handler
- Phase 4: T052–T060 — 9 atoms/molecules in parallel
- Phase 6 + 7 + 8 — can run in parallel after Phase 4 completes

---

## Implementation Strategy

### MVP First (Recommended)

1. Complete Phase 1 → 2 → 3 → 4. Ship. Validate in prod behind a feature flag if desired.
2. Layer on Phase 5 (rich-text) — the "feel premium" unlock.
3. Layer on Phases 6, 7, 8 in priority order; these are independent and can ship separately.
4. Phase 9 + 10 last.

### Test-first workflow (per task pair)

1. Write the test file; run → confirm red.
2. Implement the minimum code to go green.
3. Refactor for clarity while keeping green.
4. Commit.

### Foundation phase is NOT optional

Anonymous masking, rate-limit, duplicate guard, HTML sanitiser, and the Live Board switch to `kudo_feed_v` are all in Phase 2. Skipping any risks an XSS or privacy-leak incident.

---

## Notes

- Task count: **112**. MVP scope: **T001 – T069** (69 tasks) delivers the P1 vertical slice.
- Per-story parallelism: Phases 6, 7, and 8 are independent after Phase 4 — a team of 3 can parallelise.
- Open questions from plan RN2–RN6 must be resolved before starting Phase 2 (HTML sanitiser approach, Workers Storage SDK, view-migration PR scope, seed back-fill, event-state helper reuse).
- Commit cadence: group by phase (one `feat(kudos/compose):` commit per phase or logical sub-unit, plus a leading `chore(deps): add zod` and a trailing `chore(db): migrate kudos_feed_v + create_kudo`).
