# Feature Specification: Homepage SAA

**Frame ID**: `i87tDx10uM`
**Frame Name**: `Homepage SAA`
**File Key**: `9ypp4enmFmdK3YAFJLIu6C`
**Created**: 2026-04-12
**Status**: Draft

---

## Overview

The Homepage SAA is the main post-login hub for the Sun Annual Awards 2025 (SAA 2025) application. It is the first screen users land on after completing Google OAuth authentication. The page serves three key purposes:

1. **Event anticipation** — displays a countdown timer to the award ceremony date, event time/venue info, and the hero "ROOT FURTHER" visual identity.
2. **Navigation hub** — provides direct entry points to Awards Information, Sun* Kudos, and About SAA 2025 sections via the header navigation bar and prominent CTA buttons.
3. **Content preview** — showcases the six award categories in a visual grid and the Sun* Kudos recognition program, encouraging user engagement before the event.

The page also includes a sticky header (with language toggle, notifications, and profile controls), a fixed floating Widget Button for quick actions, and a footer with site navigation.

Visual design reference: `.momorph/specs/i87tDx10uM-HomepageSAA/design-style.md`
Figma link: https://momorph.ai/files/9ypp4enmFmdK3YAFJLIu6C/screens/i87tDx10uM

---

## User Scenarios & Testing *(mandatory)*

### User Story 1 - View Hero Section & Countdown (Priority: P1)

An authenticated user visits the homepage at `/` and sees the keyvisual hero section: the "ROOT FURTHER" logo image, a live countdown timer (Days / Hours / Minutes) to the event date, event time and venue info, and the two CTA navigation buttons.

**Why this priority**: This is the first thing users see after login. The countdown creates event anticipation and the CTAs are the primary navigation drivers. Without this, the page has no purpose.

**Independent Test**: Render the homepage in isolation with a mocked event config (target datetime, venue, time). Verify the countdown displays correct remaining time, event info is shown, and the two CTA buttons are present.

**Acceptance Scenarios**:

1. **Given** an authenticated user visits `/`, **When** the page loads, **Then** the hero section renders with the ROOT FURTHER logo image, a "Coming soon" label, and countdown showing Days / Hours / Minutes remaining.
2. **Given** the event datetime is in the future, **When** the countdown is displayed, **Then** each unit (Days, Hours, Minutes) shows the correct value using the Digital Numbers font.
3. **Given** the event has a configured time and venue, **When** the page loads, **Then** the event info row shows "Thời gian: 18h30" and "Địa điểm: Nhà hát..." with gold (#FFEA9E) values.
4. **Given** the user sees the CTA row, **When** they are presented, **Then** two buttons appear: "ABOUT AWARDS" (primary gold) and "ABOUT KUDOS" (secondary outline).
5. **Given** the countdown reaches zero, **When** the timer hits zero, **Then** the "Coming soon" label is hidden and the digits show 00:00:00.

---

### User Story 2 - Navigate to Awards Information (Priority: P1)

An authenticated user on the homepage navigates to the Awards Information page, either via the header nav link, the "ABOUT AWARDS" CTA button, or by clicking an award card (image, title, or "Chi tiết" link).

**Why this priority**: Navigating to award details is the primary call-to-action goal of the homepage. The entire awards grid section exists to drive this user flow.

**Independent Test**: Mount the homepage with mocked award data (6 award cards). Verify that clicking "ABOUT AWARDS" CTA, the "Awards Information" nav link, and any award card "Chi tiết" link all navigate to the Awards Information page (with optional `#{award-slug}` hash anchor for card clicks).

**Acceptance Scenarios**:

1. **Given** the user is on the homepage, **When** they click "Awards Information" in the header nav, **Then** the browser navigates to the Awards Information page.
2. **Given** the user is on the homepage, **When** they click the "ABOUT AWARDS" CTA button, **Then** the browser navigates to the Awards Information page.
3. **Given** the awards grid section is visible, **When** the user clicks an award card image, title, or "Chi tiết" link, **Then** they are navigated to Awards Information with the corresponding `#{award-slug}` anchor.
4. **Given** the awards grid is rendered, **When** the page loads, **Then** 6 award cards are displayed in a 3-column grid, each showing an image (gold border, glow shadow), title (gold), description (white, max 2 lines), and a "Chi tiết →" link.
5. **Given** a user hovers over an award card, **When** the card is hovered, **Then** the card lifts slightly (`translateY(-2px)`) and the glow shadow intensifies.

---

### User Story 3 - Navigate to Sun* Kudos (Priority: P2)

An authenticated user on the homepage navigates to the Sun* Kudos section, either via the "Sun* Kudos" header nav link, the "ABOUT KUDOS" CTA button, or the "Chi tiết" button inside the Sun* Kudos section card.

**Why this priority**: The Kudos feature is a secondary but important engagement driver. It's P2 because the Awards section is the primary event feature.

**Independent Test**: Mount the homepage. Verify that clicking "Sun* Kudos" nav link, "ABOUT KUDOS" CTA, and the "Chi tiết" button inside the D1_Sun* Kudos section card all navigate to the Sun* Kudos page.

**Acceptance Scenarios**:

1. **Given** the user is on the homepage, **When** they click "Sun* Kudos" in the header nav, **Then** the browser navigates to the Sun* Kudos page.
2. **Given** the user is on the homepage, **When** they click the "ABOUT KUDOS" CTA button, **Then** the browser navigates to the Sun* Kudos page.
3. **Given** the Sun* Kudos section is visible, **When** the user clicks the "Chi tiết" button inside the Kudos card, **Then** they are navigated to the Sun* Kudos page.
4. **Given** the Sun* Kudos section is rendered, **When** the page loads, **Then** a dark card (bg: #0F0F0F, radius: 16px) appears showing: "Phong trào ghi nhận" label (white), "Sun* Kudos" title (gold, 57px), description text (white), and a gold "Chi tiết" button.

---

### User Story 4 - Header Navigation & Controls (Priority: P2)

An authenticated user interacts with the sticky header: navigates via nav links, opens the language dropdown, views notifications, and accesses their profile dropdown.

**Why this priority**: The header is present on every page view and controls key global interactions (language, notifications, profile). It's P2 because navigation to detail pages is more critical.

**Independent Test**: Mount the header component in isolation. Verify the SAA logo renders, all 3 nav links appear (About SAA 2025, Awards Information, Sun* Kudos), the language toggle opens a dropdown, and the bell and avatar buttons are present.

**Acceptance Scenarios**:

1. **Given** the user is on the homepage, **When** they view the header, **Then** the SAA logo, 3 nav links, language toggle, bell icon, and avatar button are all visible.
2. **Given** the user looks at the header nav, **When** "About SAA 2025" is the active page, **Then** the link is highlighted with gold color (#FFEA9E) and an underline.
3. **Given** the user clicks the language toggle button, **When** the dropdown opens, **Then** a language selection overlay (hUyaaugye2) appears.
4. **Given** the user clicks the bell icon (A1.6), **When** clicked, **Then** the notification panel overlay appears.
5. **Given** the user clicks the avatar button (A1.8), **When** clicked, **Then** the profile dropdown overlay (frame 721:5223) appears.
6. **Given** the user scrolls down the page, **When** scrolling, **Then** the header remains fixed at the top (sticky positioning).

---

### User Story 5 - Widget Button (Floating Action) (Priority: P3)

An authenticated user clicks the Widget Button (floating pill button fixed at bottom-right) to open the Quick Action menu overlay.

**Why this priority**: The widget button is a convenience shortcut. It's non-critical to the core page functionality.

**Independent Test**: Mount the homepage. Verify a pill-shaped button (bg: #FFEA9E, fixed bottom-right) with pencil icon + "/" + SAA icon is present. Clicking it opens the quick action menu overlay.

**Acceptance Scenarios**:

1. **Given** the user is on the homepage, **When** the page loads, **Then** a fixed pill button (106×64px, bg: #FFEA9E, radius: 100px, glow shadow) appears at bottom-right (bottom: 32px, right: 19px).
2. **Given** the widget button is visible, **When** its content is inspected, **Then** it shows a pencil icon, a "/" slash, and a SAA mini icon in a row.
3. **Given** the user clicks the widget button, **When** clicked, **Then** the Quick Action menu overlay appears.

---

### Edge Cases

- What happens when `GET /awards` fails or returns empty? → Award grid renders with placeholder/skeleton cards or an empty state message.
- What happens when `GET /kudos` fails? → Kudos section renders with static/fallback content or a loading error state.
- What happens when the user is unauthenticated? → Middleware redirects to `/auth/login` before the page renders.
- What happens when the event datetime has already passed? → Countdown shows `00 : 00 : 00` and the "Coming soon" label is hidden.
- What happens on mobile (<768px)? → Award grid collapses to 1 column, CTA buttons stack vertically, nav links hidden behind hamburger, footer stacks vertically.

---

## UI/UX Requirements *(from Figma)*

### Screen Components

| Component | Description | Interactions |
|-----------|-------------|--------------|
| `<Header>` (A1_Header) | Sticky top bar: SAA logo, 3 nav links, language toggle, bell icon, avatar | Click nav → navigate; click logo → scroll top; click lang → dropdown; click bell → notifications; click avatar → profile |
| `<HeroSection>` | Full-width keyvisual with gradient overlay + ROOT FURTHER image | Static visual, no direct interaction |
| `<CountdownTimer>` (B1) | Live countdown: Days / Hours / Minutes in Digital Numbers font | Updates in real-time (every minute); "Coming soon" label hidden at zero |
| `<EventInfo>` (B2) | Event time and venue details in two-line layout | Static display |
| `<CTAButtons>` (B3) | Two CTA buttons: "ABOUT AWARDS" (primary) + "ABOUT KUDOS" (secondary) | Click → navigate; hover swaps primary/secondary visual style |
| `<RootFurtherDescription>` (B4) | Descriptive section about Root Further initiative | Static content |
| `<AwardsHeader>` (C1) | Section header: caption, divider, title "Hệ thống giải thưởng" | Static |
| `<AwardCard>` (C2) × 6 | Award category card: image + title + description + Chi tiết link | Click any part → navigate to Awards Info with hash anchor; hover lifts card |
| `<KudosSection>` (D1) | Dark card showcasing Sun* Kudos program | Click "Chi tiết" → navigate to Sun* Kudos |
| `<WidgetButton>` (6) | Fixed floating pill: pencil + "/" + SAA icon | Click → open Quick Action menu overlay |
| `<Footer>` (7_Footer) | Bottom bar: logo + nav links + copyright | Click nav links → navigate; click logo → scroll top |

### Navigation Flow

- **From**: Login page (`/auth/login`) after successful Google OAuth
- **To**: Awards Information (`/awards` or TBD), Sun* Kudos (`/kudos` or TBD), About SAA 2025 (TBD)
- **Triggers**: Header nav links, CTA buttons, award card clicks, "Chi tiết" buttons; header overlays open in-place with no URL change

### Visual Requirements

- Design canvas: 1512px desktop
- Responsive breakpoints:
  - Mobile (<768px): 1-column grid, stacked CTAs, hamburger nav, stacked footer
  - Tablet (768–1023px): 2-column award grid, adjusted padding
  - Desktop (≥1024px): Full Figma spec at 1512px
- Animations/Transitions:
  - Award card: `transform + box-shadow` 200ms ease-out on hover
  - CTA buttons: swap primary/secondary styles 150ms ease-in-out on hover
  - Nav links: color + background 150ms ease-in-out on hover
  - Widget button: shadow + transform 150ms ease-in-out on hover
  - Countdown: content updates every minute
- Accessibility (WCAG 2.1 AA):
  - All interactive elements reachable via keyboard (Tab/Enter)
  - CTA buttons have `aria-label` or visible text
  - Navigation links have descriptive text
  - Images have `alt` attributes
  - Focus rings visible on all interactive elements
  - Countdown timer updates announced if possible (`aria-live`)

---

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST display a live countdown timer showing Days, Hours, Minutes remaining to the configured event datetime.
- **FR-002**: System MUST display event info (time and venue) from configuration or API.
- **FR-003**: System MUST render 6 award category cards with image, title, description, and "Chi tiết" link fetched from `GET /awards`.
- **FR-004**: System MUST render the Sun* Kudos section with content fetched from `GET /kudos`.
- **FR-005**: Users MUST be able to navigate to Awards Information from: header nav link, "ABOUT AWARDS" CTA, and any award card.
- **FR-006**: Users MUST be able to navigate to Sun* Kudos from: header nav link, "ABOUT KUDOS" CTA, and the Kudos section "Chi tiết" button.
- **FR-007**: System MUST protect this route — unauthenticated users are redirected to `/auth/login`.
- **FR-008**: System MUST render a sticky header that remains at the top during scroll.
- **FR-009**: System MUST render a fixed Widget Button (floating pill) that opens the Quick Action menu overlay on click.
- **FR-010**: System MUST render a footer with logo, nav links, and copyright text.

### Technical Requirements

- **TR-001**: Page must achieve Lighthouse performance score ≥ 80 on desktop.
- **TR-002**: Countdown timer must use `setInterval` (or equivalent) with a 60-second tick; it must clean up on component unmount.
- **TR-003**: Award card images must use `next/image` with `priority` for above-the-fold images and lazy loading for below-the-fold.
- **TR-004**: `GET /awards` and `GET /kudos` must be fetched server-side (Next.js Server Component or `getServerSideProps`) to avoid layout shift.
- **TR-005**: All navigation uses Next.js `<Link>` component (not `<a>` tags) to preserve SPA behavior.
- **TR-006**: The countdown timer must be a Client Component (`'use client'`) because it relies on `setInterval` and local state.

### Key Entities *(if feature involves data)*

- **Award**: `{ id: string, slug: string, title: string, description: string, imageUrl: string, category: string }` — fetched from `GET /awards`
- **KudosInfo**: `{ label: string, title: string, description: string, detailUrl: string }` — fetched from `GET /kudos`
- **EventConfig**: `{ targetDatetime: ISO8601, time: string, venue: string, streamNote: string }` — from environment config or `GET /event-config`

---

## API Dependencies

| Endpoint | Method | Purpose | Status |
|----------|--------|---------|--------|
| `GET /awards` | GET | Fetch 6 award categories for the award grid | Predicted (New) |
| `GET /kudos` | GET | Fetch Sun* Kudos section content | Predicted (New) |
| `GET /event-config` | GET | Fetch event datetime, venue, time info for countdown + event info | Predicted (New) |

> **Note**: All API endpoints are predicted based on UI requirements. Actual endpoints subject to backend implementation.

---

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: All 6 award cards render correctly with images, gold borders, and glow shadows matching Figma spec.
- **SC-002**: Countdown timer displays correct time remaining (within ±1 minute) and updates every 60 seconds.
- **SC-003**: Clicking any of the 3 navigation paths to Awards Information (nav link, CTA, card click) successfully navigates the user.
- **SC-004**: Clicking any of the 3 navigation paths to Sun* Kudos (nav link, CTA, section button) successfully navigates the user.
- **SC-005**: Page passes visual regression check against the Figma design with ≤5% pixel difference threshold.
- **SC-006**: Unauthenticated access to `/` redirects to `/auth/login` within 1 navigation step.
- **SC-007**: Page renders responsively at 375px (mobile), 768px (tablet), and 1512px (desktop) without overflow or broken layout.

---

## Out of Scope

- **Quick Action menu content** — the overlay opened by Widget Button is a separate screen; only the trigger button is in scope here.
- **Notification panel content** — the overlay opened by the bell icon is out of scope; only the button is in scope.
- **Profile dropdown content** — the overlay opened by the avatar button is out of scope; only the button trigger is in scope.
- **About SAA 2025 page** — the nav link must exist but the destination page is not part of this screen's implementation.
- **Admin functionality** — admin screens are entirely separate.
- **Search functionality** — not present on the homepage design.
- **Kudos writing/sending** — the Sun* Kudos section here is read-only preview; the full Kudos workflow is a separate feature.
- **Authentication logic** — handled by middleware (Login screen spec); this screen only consumes the session.

---

## Dependencies

- [x] Constitution document exists (`.momorph/constitution.md`)
- [ ] API specifications available (`.momorph/contexts/api-docs.yaml`) — predicted endpoints need backend confirmation
- [ ] Database design completed (`.momorph/contexts/database-schema.sql`) — pending
- [x] Screen flow documented (`.momorph/contexts/SCREENFLOW.md`)
- [x] Design style documented (`.momorph/specs/i87tDx10uM-HomepageSAA/design-style.md`)
- [x] Login feature implemented (prerequisite: authenticated session exists)

---

## Notes

- The "ROOT FURTHER" text is an image asset (`/assets/homepage/root-further.png`), not text rendered in CSS.
- The keyvisual background image (`3.5_Keyvisual`) has a `linear-gradient(12deg, #00101A 23.7%, rgba(0,18,29,0.46) 38.34%, rgba(0,19,32,0) 48.92%)` overlay to blend it into the dark page background.
- Award card images use `mix-blend-mode: screen` to blend with the dark background.
- The "Coming soon" label above the countdown is conditionally rendered — hidden when countdown reaches zero.
- The B4 "Root Further description" section (1152×1090px) is a content-heavy section; its exact content (text, images) needs to be sourced from the content team.
- The decorative right side of the Sun* Kudos card uses SVN-Gotham font (~96px "Sun* Kudos" text) and an overlay image — these are purely decorative.
- Language selection (VN/EN toggle) persists via `localStorage` key `'lang'` (already implemented in `use-language.ts` hook).
- The Widget Button and its overlay are designed to be accessible from every page, suggesting it should be part of a shared layout, not page-specific.
