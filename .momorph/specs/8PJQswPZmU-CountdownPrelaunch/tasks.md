# Tasks: Countdown - Prelaunch Page

**Frame**: `8PJQswPZmU-CountdownPrelaunch`
**Prerequisites**: plan.md (required), spec.md (required), design-style.md (required)
**Created**: 2026-04-13

---

## Task Format

```
- [x] T### [P?] [Story?] Description | file/path
```

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this belongs to (US1–US2)
- **|**: File path(s) affected by this task

---

## Phase 1: Setup (CSS Tokens)

**Purpose**: Prelaunch-specific design tokens ready in globals.css. No middleware change needed (see plan).

- [x] T001 Add prelaunch CSS tokens to globals.css: `--color-prelaunch-gradient`, `--text-prelaunch-heading-size: 36px`, `--text-prelaunch-digit-size: 73.7px`, `--text-prelaunch-label-size: 36px`, `--spacing-prelaunch-unit-gap: 60px`, `--spacing-prelaunch-digit-gap: 21px`, `--radius-prelaunch-digit: 12px`, `--border-prelaunch-digit: 0.75px solid #FFEA9E`. Add responsive overrides (mobile: unit-gap 24px, digit-size ~55px, label-size 24px; tablet: unit-gap 40px). Add `@supports not (backdrop-filter)` fallback for glass digit box | `src/app/globals.css`

**Checkpoint**: CSS tokens in place — component work can begin.

---

## Phase 2: User Story 1 — View Countdown Timer (Priority: P1)

**Goal**: Prelaunch page renders with live countdown, glass-morphism digit boxes, keyvisual background.

**Independent Test**: Render `/prelaunch` with seeded event_config. Verify heading, 3 countdown units (Days/Hours/Minutes) with glass digit boxes, correct remaining time.

### Tests (US1) — Write FIRST, confirm FAIL

- [x] T002 [P] [US1] Write failing test for GlassDigitBox: renders a single digit character inside a styled box, box has glass-morphism styles (border-radius 12px, border color #FFEA9E), digit uses Digital Numbers font | `src/__tests__/components/prelaunch/GlassDigitBox.test.tsx`
- [x] T003 [P] [US1] Write failing test for PrelaunchCountdown: renders heading "Sự kiện sẽ bắt đầu sau", renders 6 GlassDigitBoxes (2 per unit), renders labels "DAYS", "HOURS", "MINUTES". Mock `@/hooks/use-countdown` to return controlled values. Verify digit splitting: value 5 → boxes show "0" and "5" | `src/__tests__/components/prelaunch/PrelaunchCountdown.test.tsx`

### Implementation (US1) — Make tests PASS

- [x] T004 [P] [US1] Implement GlassDigitBox component: Props `{ digit: string }`. Container 77x123px, flex items-center justify-center. Background `linear-gradient(180deg, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0.05) 100%)`, border `--border-prelaunch-digit`, border-radius `--radius-prelaunch-digit`, backdrop-filter blur(25px). Digit text: `--font-digital-numbers`, `--text-prelaunch-digit-size`, white, centered | `src/components/prelaunch/GlassDigitBox.tsx`
- [x] T005 [P] [US1] Implement PrelaunchCountdown component (`'use client'`): Props `{ targetDatetime: string }`. Uses `use-countdown` hook. Renders heading "Sự kiện sẽ bắt đầu sau" (Montserrat `--text-prelaunch-heading-size`/700, white, centered). Renders 3 units in flex-row with `--spacing-prelaunch-unit-gap`. Each unit: 2 GlassDigitBoxes (gap `--spacing-prelaunch-digit-gap`) + label (DAYS/HOURS/MINUTES, `--text-prelaunch-label-size`/700, white). Digit splitting: `String(value).padStart(2, '0')` → split into 2 chars | `src/components/prelaunch/PrelaunchCountdown.tsx`
- [x] T006 [US1] Implement prelaunch page Server Component: calls `fetchEventConfig()` with try/catch (null on error). Renders full-screen layout: keyvisual background (`next/image`, fill, priority, `/assets/homepage/images/keyvisual.png`), gradient overlay (`--color-prelaunch-gradient`), centered content wrapper (min-h-screen, flex items-center justify-center, z-10). Passes `targetDatetime` to `<PrelaunchCountdown>`. If no eventConfig: render fallback "Coming soon" text | `src/app/prelaunch/page.tsx`
- [x] T007 [US1] Run all US1 tests — confirm all PASS. Visually verify prelaunch page in browser (requires Supabase running with seed data) | `src/__tests__/components/prelaunch/`

**Checkpoint**: US1 complete — prelaunch page with live countdown and glass-morphism digit boxes.

---

## Phase 3: User Story 2 — Countdown Reaches Zero / Redirect (Priority: P2)

**Goal**: When countdown expires, redirect user to Homepage (authenticated) or Login (unauthenticated).

**Independent Test**: Mock `use-countdown` to return `isExpired: true`. Mock Supabase `getUser()`. Verify `router.push('/')` or `router.push('/auth/login')`.

- [x] T008 [US2] Add redirect tests to PrelaunchCountdown test file: when `isExpired=true` and user is authenticated → `router.push('/')` called; when `isExpired=true` and user is NOT authenticated → `router.push('/auth/login')` called. Mock `@/hooks/use-countdown`, `next/navigation` useRouter, `@/libs/supabase/client` createClient | `src/__tests__/components/prelaunch/PrelaunchCountdown.test.tsx`
- [x] T009 [US2] Add redirect logic to PrelaunchCountdown: import `useRouter` from `next/navigation` and `createClient` from `@/libs/supabase/client`. Add `useEffect` watching `isExpired`: when true, call `createClient().auth.getUser()`, then `router.push(user ? '/' : '/auth/login')` | `src/components/prelaunch/PrelaunchCountdown.tsx`
- [x] T010 [US2] Run US2 tests — confirm all PASS | `src/__tests__/components/prelaunch/`

**Checkpoint**: US1 + US2 complete — countdown with auto-redirect on expiry.

---

## Phase 4: Polish & Cross-Cutting Concerns

**Purpose**: Responsive, accessibility, performance, visual verification.

- [x] T011 [P] Add `aria-live="polite"` and `aria-label="Countdown timer"` to the countdown container in PrelaunchCountdown. Add `alt=""` and `aria-hidden="true"` on decorative keyvisual background image | `src/components/prelaunch/PrelaunchCountdown.tsx`, `src/app/prelaunch/page.tsx`
- [x] T012 [P] Verify responsive behavior: test at 375px (mobile), 768px (tablet), 1512px (desktop). Confirm digit boxes scale down, gaps reduce, labels remain legible. Adjust responsive CSS tokens if needed | `src/app/globals.css`
- [x] T013 Run full test suite (`npx jest --forceExit`) — confirm no regressions across all 91+ existing tests + new prelaunch tests | All test files

**Checkpoint**: Feature complete — responsive, accessible, all tests green.

---

## Dependencies & Execution Order

### Phase Dependencies

```
Phase 1 (Setup) → Phase 2 (US1: Countdown) → Phase 3 (US2: Redirect) → Phase 4 (Polish)
```

- **Phase 1**: No dependencies — start immediately
- **Phase 2**: Depends on Phase 1 (CSS tokens)
- **Phase 3**: Depends on Phase 2 (PrelaunchCountdown component exists)
- **Phase 4**: Depends on Phase 2 + 3

### Parallel Opportunities

**Within Phase 2:**
- T002 + T003 (both tests) can run in parallel
- T004 + T005 (GlassDigitBox + PrelaunchCountdown) can run in parallel after their tests

### Reused Infrastructure (no tasks needed)

| Existing Asset | Used By |
|---------------|---------|
| `src/hooks/use-countdown.ts` | PrelaunchCountdown — countdown logic |
| `src/services/homepage-service.ts` → `fetchEventConfig()` | prelaunch/page.tsx — data fetching |
| `public/assets/homepage/images/keyvisual.png` | prelaunch/page.tsx — background |
| `--font-digital-numbers` (globals.css) | GlassDigitBox — digit font |
| `--color-bg-page` (globals.css) | prelaunch/page.tsx — page background |
| `event_config` Supabase table + seed data | fetchEventConfig() — countdown target |

---

## Implementation Strategy

### MVP First (Recommended)

1. Complete Phase 1 (Setup) + Phase 2 (US1: Countdown Display)
2. **STOP and VALIDATE**: Verify countdown renders with glass-morphism at `/prelaunch`
3. This delivers the core prelaunch experience

### Incremental Delivery

1. Phase 1 (CSS tokens) → immediate
2. Phase 2 (US1: Countdown) → Test → Commit
3. Phase 3 (US2: Redirect) → Test → Commit
4. Phase 4 (Polish) → Test → Final commit

### Commit Strategy

- `style(prelaunch): add CSS tokens for prelaunch page`
- `feat(prelaunch): implement countdown page with glass-morphism digits`
- `feat(prelaunch): add auto-redirect on countdown expiry`
- `docs(screenflow): discover Countdown - Prelaunch screen`

---

## Summary

| Metric | Count |
|--------|-------|
| **Total tasks** | 13 |
| **Phase 1 (Setup)** | 1 task |
| **Phase 2 (US1 — Countdown)** | 6 tasks |
| **Phase 3 (US2 — Redirect)** | 3 tasks |
| **Phase 4 (Polish)** | 3 tasks |
| **Parallel opportunities** | 6 tasks marked [P] |
| **MVP scope** | Phases 1-2 (7 tasks) |
| **New files** | 5 (3 components + 2 tests) |
| **Modified files** | 1 (globals.css) |

---

## Notes

- Middleware does NOT need updating — `/prelaunch` is already accessible as a public route
- All heavy infrastructure (Supabase, service, hook, fonts, keyvisual) is reused from Homepage SAA
- The unique element is the glass-morphism digit box (gradient bg with baked-in opacity + gold border + backdrop-blur)
- Mark tasks complete as you go: `[x]`
