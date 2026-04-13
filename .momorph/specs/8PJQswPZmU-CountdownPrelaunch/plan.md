# Implementation Plan: Countdown - Prelaunch Page

**Frame**: `8PJQswPZmU-CountdownPrelaunch`
**Date**: 2026-04-13
**Spec**: `specs/8PJQswPZmU-CountdownPrelaunch/spec.md`

---

## Summary

Implement the Countdown - Prelaunch Page (`/prelaunch`) — a standalone holding page shown before the SAA 2025 event launches. Displays a live countdown timer (Days / Hours / Minutes) with glass-morphism digit boxes over the keyvisual background.

This is a **lightweight feature** that heavily reuses existing infrastructure from the Homepage SAA implementation: `event_config` Supabase table, `fetchEventConfig()` service, `use-countdown` hook, keyvisual background image, and Digital Numbers font. The only new visual element is the **glass-morphism digit box** styling.

**Approach**: Read the countdown target from the existing `event_config` Supabase table via `fetchEventConfig()`. No new database tables or migrations needed.

---

## Technical Context

**Language/Framework**: TypeScript / Next.js 15 (App Router)
**Primary Dependencies**: React 19, TailwindCSS v4, `next/image`, Supabase (via existing service)
**Database**: Reuses existing `event_config` table (no changes)
**Testing**: Jest 29, `@testing-library/react`
**State Management**: Local React state (`useState`, `useEffect`) for countdown — reuses `use-countdown` hook
**API Style**: Supabase direct query via existing `fetchEventConfig()`

---

## Constitution Compliance Check

*GATE: Must pass before implementation can begin*

- [x] Follows project coding conventions (kebab-case modules, PascalCase components, 2-space indent, single quotes)
- [x] Uses approved libraries and patterns (Next.js App Router, React 19, TailwindCSS v4, Supabase)
- [x] Adheres to folder structure guidelines (`src/components/prelaunch/`, `src/app/prelaunch/`)
- [x] Meets security requirements (public route — no auth needed; no secrets in client code)
- [x] Follows testing standards (TDD — tests before implementation)

**Violations**: Same as Homepage SAA — inline styles with CSS variables instead of Tailwind v4 utilities (Constitution II). Established codebase pattern; see Homepage SAA plan violation table for justification.

---

## Architecture Decisions

### Frontend Approach

- **Component Structure**: Feature-based — prelaunch-specific components in `src/components/prelaunch/`.
- **Data Fetching**: `src/app/prelaunch/page.tsx` is a **Server Component** that calls `fetchEventConfig()` and passes `targetDatetime` to the client countdown component.
- **Client Component**: `PrelaunchCountdown` is `'use client'` — uses the existing `use-countdown` hook + handles redirect logic when countdown expires.
- **Key reuse**:
  - `src/hooks/use-countdown.ts` — countdown logic (already implemented)
  - `src/services/homepage-service.ts` → `fetchEventConfig()` — Supabase query (already implemented)
  - `/assets/homepage/images/keyvisual.png` — background image (already downloaded)
  - `--font-digital-numbers` — font (already in globals.css)
  - `--color-bg-page: #00101A` — page background (already in globals.css)

### Unique Visual Element: Glass-Morphism Digit Box

The prelaunch countdown uses a distinct digit box style not shared with the Homepage SAA:

**IMPORTANT — Opacity handling**: The Figma data shows `opacity: 0.5` on the background Rectangle only — NOT on the digit text. Do NOT apply `opacity` to the container (it would make the text translucent). Instead, bake the opacity into the gradient alpha values:

```css
.prelaunch-digit-box {
  position: relative;
  width: 77px;
  height: 123px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 0.75px solid #FFEA9E;
  border-radius: 12px;
  /* Opacity baked into gradient alpha: original white (100%) * 0.5 = rgba(255,255,255,0.5) */
  background: linear-gradient(180deg, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0.05) 100%);
  backdrop-filter: blur(25px);
}
```

**Digit splitting**: Each countdown value (e.g., `5`) must be zero-padded to 2 digits (`"05"`) then split into individual characters, each rendered in its own GlassDigitBox. E.g., Days=5 → `["0", "5"]` → 2 boxes.

### Middleware — No Changes Needed

The current middleware only protects exact `/` path via `pathname === route || pathname.startsWith(route + '/')`. For `/prelaunch`, neither condition matches (`'/prelaunch' === '/'` is false, `'/prelaunch'.startsWith('//')` is false). So `/prelaunch` is already accessible as a public route without any middleware changes.

### Redirect on Countdown Expiry (US2)

When `isExpired` is true, the `PrelaunchCountdown` client component calls `router.push()`:
- Check Supabase auth state client-side via `createClient()` → `getUser()`
- If authenticated → redirect to `/`
- If not authenticated → redirect to `/auth/login`

---

## Project Structure

### Source Code — New Files

| File | Purpose | Type |
|------|---------|------|
| `src/app/prelaunch/page.tsx` | Prelaunch Server Component — fetches event config, renders background + countdown | Server Component |
| `src/components/prelaunch/PrelaunchCountdown.tsx` | Client countdown with glass-morphism digit boxes + expiry redirect | Client Component (`'use client'`) |
| `src/components/prelaunch/GlassDigitBox.tsx` | Single glass-morphism digit box (77x123px) | Presentational |

### Source Code — Modified Files

| File | What Changes |
|------|-------------|
| `src/app/globals.css` | Add prelaunch-specific CSS tokens (gradient, digit box, spacing) + responsive overrides + `@supports` backdrop-filter fallback |

### Source Code — Unchanged (reused as-is)

| File | Why reused |
|------|-----------|
| `src/hooks/use-countdown.ts` | Countdown logic — same hook, same behavior |
| `src/services/homepage-service.ts` | `fetchEventConfig()` — same query, same table |
| `src/libs/supabase/client.ts` | Browser client — for checking auth state on redirect |
| `public/assets/homepage/images/keyvisual.png` | Same background image |

### Test Files

| File | Tests for |
|------|----------|
| `src/__tests__/components/prelaunch/PrelaunchCountdown.test.tsx` | Renders heading, 3 digit pairs, labels; handles expiry |
| `src/__tests__/components/prelaunch/GlassDigitBox.test.tsx` | Renders digit with glass-morphism styling |

### Dependencies

No new `package.json` dependencies required.

---

## Implementation Strategy

### Phase 1: Setup — CSS Tokens + Middleware

**Goal**: CSS tokens ready, route accessible.

1. **Add prelaunch CSS tokens** to `src/app/globals.css`:
   - `--color-prelaunch-gradient: linear-gradient(18deg, #00101A 15.48%, rgba(0,18,29,0.46) 52.13%, rgba(0,19,32,0) 63.41%)`
   - `--text-prelaunch-heading-size: 36px`
   - `--text-prelaunch-digit-size: 73.7px`
   - `--text-prelaunch-label-size: 36px`
   - `--spacing-prelaunch-unit-gap: 60px`
   - `--spacing-prelaunch-digit-gap: 21px`
   - `--radius-prelaunch-digit: 12px`
   - `--border-prelaunch-digit: 0.75px solid #FFEA9E`
   - Responsive overrides: mobile digit scale-down, gap adjustments
2. ~~Update `src/middleware.ts`~~ — **Not needed** (see Architecture Decisions: `/prelaunch` is already not protected by the current middleware logic).

### Phase 2: Core Features — US1 (Countdown Display)

**Goal**: Prelaunch page renders with working countdown and glass-morphism digit boxes.

**TDD order**:

1. `GlassDigitBox.test.tsx` → `GlassDigitBox.tsx`
   - Renders a single digit (zero-padded) inside a glass-morphism styled box
   - Props: `{ digit: string }` (e.g., "0", "5")
   - Box: 77x123px, border 0.75px solid #FFEA9E, border-radius 12px, gradient bg (opacity baked into alpha — see Architecture Decisions), backdrop-filter blur(25px)
   - Digit: Digital Numbers font ~73.7px, white, centered
2. `PrelaunchCountdown.test.tsx` → `PrelaunchCountdown.tsx`
   - `'use client'` component
   - Props: `{ targetDatetime: string }`
   - Uses `use-countdown` hook
   - Renders heading "Sự kiện sẽ bắt đầu sau" (36px/700 white centered)
   - Renders 3 units (Days/Hours/Minutes) each with 2 `GlassDigitBox` + label
   - Gap between units: 60px; between digits: 21px; between digit row and label: 21px
3. `src/app/prelaunch/page.tsx`
   - Server Component
   - Calls `fetchEventConfig()` with try/catch
   - Renders: keyvisual background (absolute, fill, priority) + gradient overlay + centered content
   - Passes `targetDatetime` to `<PrelaunchCountdown>`
   - If no event config: render fallback "Coming soon" text

### Phase 3: Extended Features — US2 (Expiry Redirect)

**Goal**: When countdown reaches zero, redirect to appropriate page.

1. In `PrelaunchCountdown.tsx`, add redirect logic. Required imports:
   - `useRouter` from `next/navigation`
   - `createClient` from `@/libs/supabase/client` (browser client for auth check)
   ```typescript
   const router = useRouter();

   useEffect(() => {
     if (!isExpired) return;
     const checkAuthAndRedirect = async () => {
       const supabase = createClient();
       const { data: { user } } = await supabase.auth.getUser();
       router.push(user ? '/' : '/auth/login');
     };
     checkAuthAndRedirect();
   }, [isExpired, router]);
   ```
2. Add test for redirect behavior (mock `use-countdown` to return `isExpired: true`, mock router)

### Phase 4: Polish

1. Responsive CSS: mobile digit boxes scale to ~60x95px, labels 24px, unit gap 24px
2. Accessibility: `aria-live="polite"` on countdown container
3. Verify backdrop-filter works in target browsers; add fallback for unsupported browsers:
   ```css
   @supports not (backdrop-filter: blur(1px)) {
     .prelaunch-digit-box { background: rgba(255,255,255,0.15); }
   }
   ```
4. Visual verification in browser at mobile/tablet/desktop

---

## Risk Assessment

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| `backdrop-filter` not supported | Low | Medium | CSS `@supports` fallback with slightly opaque background |
| Digital Numbers font not loaded | Medium | Low | Fallback to `Courier New, monospace` (already configured) |
| Middleware change affects other routes | Low | High | Only add `/prelaunch` to exclusion list; existing routes unchanged |

### Estimated Complexity

- **Frontend**: Low (3 new files, 1 reused hook, 1 reused service)
- **Backend**: None (reuses existing `event_config` table)
- **Testing**: Low (2 test files)

---

## Integration Testing Strategy

### Mocking Strategy

| Dependency Type | Strategy | Rationale |
|-----------------|----------|-----------|
| `use-countdown` | Mock to control `isExpired` + values | Test redirect behavior |
| `next/navigation` | Mock `useRouter().push` | Test redirect destinations |
| `@/libs/supabase/client` | Mock `getUser()` | Test auth-based redirect |
| `fetchEventConfig()` | Real (it queries real Supabase) | Integration test |

### Coverage Goals

| Area | Target | Priority |
|------|--------|----------|
| GlassDigitBox | 90%+ | High |
| PrelaunchCountdown | 80%+ | High |
| Redirect logic | Key paths | Medium |

---

## Dependencies & Prerequisites

### Required Before Start

- [x] `constitution.md` reviewed
- [x] `spec.md` approved
- [x] `design-style.md` complete
- [x] `event_config` table exists (from Homepage SAA)
- [x] `fetchEventConfig()` service exists
- [x] `use-countdown` hook exists
- [x] Keyvisual background image available
- [x] Digital Numbers font loaded in globals.css

### External Dependencies

- None — everything needed is already in the codebase.

---

## Next Steps

After plan approval:

1. **Run** `/momorph.tasks` to generate task breakdown
2. **Begin** implementation — estimated 10-15 tasks total
3. This feature can be completed in a single session

---

## Notes

- This is a **very lightweight feature** — the heavy lifting (Supabase, service, hook, fonts, keyvisual) was done in the Homepage SAA implementation.
- The `/prelaunch` route is PUBLIC — middleware must not redirect unauthenticated users away from it.
- The redirect on countdown expiry is a nice-to-have (P2). The MVP (P1) is just the countdown display.
- If the user prefers hardcoded datetime instead of Supabase, simply replace the `fetchEventConfig()` call with a constant. The plan supports both approaches.
