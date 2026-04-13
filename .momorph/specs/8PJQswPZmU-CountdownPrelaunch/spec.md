# Feature Specification: Countdown - Prelaunch Page

**Frame ID**: `8PJQswPZmU`
**Frame Name**: `Countdown - Prelaunch page`
**File Key**: `9ypp4enmFmdK3YAFJLIu6C`
**Created**: 2026-04-13
**Status**: Draft

---

## Overview

The Countdown - Prelaunch Page is a standalone holding page displayed before the Sun Annual Awards 2025 event officially launches. It shows a single, focused message: a live countdown timer (Days / Hours / Minutes) until the event start date, with a prominent "Sự kiện sẽ bắt đầu sau" (The event will begin in) heading.

The page uses the same dark keyvisual background as the Homepage SAA but with a slightly different gradient overlay. There is no header, footer, or navigation — this is a minimal page designed to build anticipation.

**When to show this page**: Before the campaign launch date. Once the launch date is reached (countdown hits zero), the application should redirect users to either the Login page or the Homepage SAA (depending on auth state).

Visual design reference: `.momorph/specs/8PJQswPZmU-CountdownPrelaunch/design-style.md`
Figma link: https://momorph.ai/files/9ypp4enmFmdK3YAFJLIu6C/screens/8PJQswPZmU

---

## User Scenarios & Testing *(mandatory)*

### User Story 1 - View Countdown Timer (Priority: P1)

A user visits the application before the event launch date and sees the Prelaunch page with a live countdown timer showing the remaining time (Days, Hours, Minutes) until the event begins.

**Why this priority**: This is the sole purpose of the page — creating anticipation for the upcoming event. Without the countdown, the page has no function.

**Independent Test**: Render the prelaunch page with a mocked event configuration (target datetime). Verify the countdown displays correct remaining time in Days/Hours/Minutes format with glass-morphism digit boxes.

**Acceptance Scenarios**:

1. **Given** a user visits the prelaunch URL (`/prelaunch`), **When** the page loads, **Then** the heading "Sự kiện sẽ bắt đầu sau" is displayed centered on screen, with a countdown timer showing Days / Hours / Minutes remaining.
2. **Given** the event datetime is in the future, **When** the countdown is displayed, **Then** each unit (Days, Hours, Minutes) shows the correct value inside glass-morphism digit boxes using the Digital Numbers font.
3. **Given** the countdown timer is running, **When** one minute passes, **Then** the Minutes value decrements by 1 (or Hours/Days adjust accordingly).
4. **Given** the event datetime is configured via `event_config` table, **When** the page loads, **Then** the countdown target is read from the database (active `event_config` row).

---

### User Story 2 - Countdown Reaches Zero / Redirect (Priority: P2)

When the countdown reaches zero (event has started), the page should redirect the user to the appropriate destination.

**Why this priority**: Users should not see a "0 days 0 hours 0 minutes" indefinitely — the page should gracefully transition to the live application.

**Independent Test**: Set the event target datetime to the past. Verify the page redirects to the Homepage SAA (`/`) or Login page (`/auth/login`) depending on authentication state.

**Acceptance Scenarios**:

1. **Given** the countdown has reached zero, **When** the timer hits 0:0:0, **Then** the digits display "00" for all units.
2. **Given** the countdown has expired and the user is authenticated, **When** the redirect triggers, **Then** the user is navigated to the Homepage SAA (`/`).
3. **Given** the countdown has expired and the user is NOT authenticated, **When** the redirect triggers, **Then** the user is navigated to the Login page (`/auth/login`).

---

### Edge Cases

- What happens when the `event_config` table has no active row? -> Display a fallback message or static "Coming soon" text without a countdown.
- What happens if the user has a very slow connection? -> The background keyvisual may take time to load; ensure the countdown content is visible immediately with a solid `#00101A` background.
- What happens on mobile? -> Countdown units scale down, gaps reduce, labels shrink. Digit boxes remain legible.

---

## UI/UX Requirements *(from Figma)*

### Screen Components

| Component | Description | Interactions |
|-----------|-------------|--------------|
| `<BG Image>` | Full-screen keyvisual background | Static visual, no interaction |
| `<Gradient Overlay>` | Linear gradient overlay on the keyvisual (18deg) | Static visual |
| `<Heading>` | "Sự kiện sẽ bắt đầu sau" centered text | Static display |
| `<CountdownUnit>` x3 | Days, Hours, Minutes — each with 2 glass-morphism digit boxes + label | Updates in real-time (every minute) |

### Navigation Flow

- **From**: Direct URL access (`/prelaunch`) — public route, no authentication required
- **To**: Homepage SAA (`/`) on launch + authenticated, OR Login (`/auth/login`) on launch + unauthenticated
- **Triggers**: Countdown reaches zero -> automatic redirect

### Visual Requirements

- Design canvas: 1512px desktop
- Responsive breakpoints:
  - Mobile (<768px): Smaller digits (~60px), reduced gaps, labels 24px
  - Tablet (768-1023px): Medium digits, adjusted gaps
  - Desktop (>=1024px): Full Figma spec at 1512px
- Animations/Transitions: Countdown content updates every minute
- Accessibility (WCAG 2.1 AA):
  - `aria-live="polite"` on countdown container for screen reader updates
  - Sufficient color contrast (white text on dark bg)
  - `alt` text on background image (decorative — can be empty)

---

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST display a live countdown timer showing Days, Hours, Minutes remaining to the configured event datetime.
- **FR-002**: System MUST read the event target datetime from the `event_config` Supabase table (same as Homepage SAA).
- **FR-003**: System MUST display each digit inside a glass-morphism styled box (gradient background, gold border, backdrop blur).
- **FR-004**: Countdown digits MUST update every 60 seconds and display zero-padded values (e.g., "05" not "5").
- **FR-005**: When the countdown reaches zero, the system SHOULD redirect the user to the appropriate page (Homepage or Login).
- **FR-006**: This page is a PUBLIC route — no authentication required to view.

### Technical Requirements

- **TR-001**: Page must achieve Lighthouse performance score >= 80.
- **TR-002**: Countdown timer must use `setInterval` (or equivalent) with a 60-second tick; must clean up on unmount.
- **TR-003**: Background keyvisual image must use `next/image` with `priority` for fast loading.
- **TR-004**: The page MUST reuse the existing `use-countdown` hook from `src/hooks/use-countdown.ts`.
- **TR-005**: The page MUST reuse the existing `fetchEventConfig` service from `src/services/homepage-service.ts`.

### Key Entities *(if feature involves data)*

- **EventConfig**: `{ targetDatetime: ISO8601, time: string, venue: string, streamNote: string | null }` — fetched from `event_config` table (same entity as Homepage SAA)

---

## API Dependencies

| Endpoint | Method | Purpose | Status |
|----------|--------|---------|--------|
| Supabase `event_config` table | SELECT | Fetch event datetime for countdown target | Exists (created for Homepage SAA) |

> **Note**: No new API endpoints or database tables needed — this page reuses the existing `event_config` table and `fetchEventConfig()` service.

---

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Countdown timer displays correct time remaining (within +/-1 minute accuracy) and updates every 60 seconds.
- **SC-002**: Glass-morphism digit boxes render correctly with gradient, gold border, and backdrop blur.
- **SC-003**: Page renders responsively at 375px (mobile), 768px (tablet), and 1512px (desktop) without overflow.
- **SC-004**: Page passes visual regression check against Figma design with <=5% pixel difference.
- **SC-005**: When countdown expires, user is redirected within 60 seconds.

---

## Out of Scope

- **Header / Footer / Navigation** — This is a standalone holding page with no chrome.
- **Event information** (time, venue, stream note) — Not shown on prelaunch page (only on Homepage SAA).
- **CTA buttons** — No navigation buttons; only the countdown timer.
- **Awards / Kudos sections** — Post-launch content only.
- **Admin ability to toggle prelaunch mode** — Controlled by whether the launch date has passed, not a manual switch (future enhancement).

---

## Dependencies

- [x] Constitution document exists (`.momorph/constitution.md`)
- [x] Database design completed — `event_config` table already exists (Homepage SAA migration)
- [x] Screen flow documented (`.momorph/contexts/SCREENFLOW.md`)
- [x] Design style documented (`.momorph/specs/8PJQswPZmU-CountdownPrelaunch/design-style.md`)
- [x] `use-countdown` hook implemented (Homepage SAA)
- [x] `fetchEventConfig` service implemented (Homepage SAA)
- [x] Keyvisual background image available (`/assets/homepage/images/keyvisual.png`)
- [x] Digital Numbers font self-hosted (`/assets/homepage/fonts/digital-numbers.woff2`)

---

## Notes

- This page shares many resources with the Homepage SAA: keyvisual background, Digital Numbers font, `use-countdown` hook, `fetchEventConfig` service, `event_config` table. The main unique element is the **glass-morphism digit box** styling.
- The route `/prelaunch` should be a PUBLIC route — it must NOT require authentication (unlike `/` which requires a session). The middleware must be updated to exclude `/prelaunch` from protected routes.
- The page could optionally also show a "LOGIN" button below the countdown for users who want to authenticate early, but this is NOT in the current Figma design.
- The gradient overlay angle (18deg) is different from the Homepage SAA (12deg), creating a slightly different visual atmosphere.
- Digit boxes use `backdrop-filter: blur(25px)` which may not work in all browsers. Fallback: slightly more opaque background on digit boxes for browsers without backdrop-filter support.
