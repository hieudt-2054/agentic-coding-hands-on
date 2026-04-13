# Feature Specification: Awards Information (Hệ thống giải thưởng SAA 2025)

**Frame ID**: `zFYDgyj_pD` (Figma node: `313:8436`)
**Frame Name**: `Hệ thống giải`
**File Key**: `9ypp4enmFmdK3YAFJLIu6C`
**Created**: 2026-04-13
**Status**: Draft

---

## Overview

The Awards Information page is the detail view of all six SAA 2025 award categories. It serves as the primary destination when users click "Awards Information" in the header nav, the "ABOUT AWARDS" CTA on the Homepage, or any individual award card.

The page presents:

1. **Hero keyvisual** -- a full-width banner with the "ROOT FURTHER" and "Sun* Annual Award 2025" artwork (1200x871px cover image).
2. **Section title** -- "Hệ thống giải thưởng SAA 2025" with a caption and gold heading (57px).
3. **Two-column award browser** -- a sticky left sidebar navigation listing all 6 award categories plus a scrollable right content area containing stacked award detail cards.
4. **Sun* Kudos promotion** -- a reused promotional card for the Sun* Kudos recognition program.

The page supports hash anchor navigation (`#top-talent`, `#top-project`, etc.) so that links from the Homepage award cards scroll directly to the corresponding section.

Visual design reference: `.momorph/specs/zFYDgyj_pD-AwardsInformation/design-style.md`
Figma link: https://momorph.ai/files/9ypp4enmFmdK3YAFJLIu6C/screens/zFYDgyj_pD

---

## User Scenarios & Testing *(mandatory)*

### User Story 1 - View Award Details (Priority: P1)

An authenticated user navigates to the Awards Information page and sees all 6 SAA 2025 award categories, each displayed as a detail card with image, title, description, quantity, and prize value.

**Why this priority**: Displaying the award details is the core purpose of this page. Without it, users cannot understand the award categories, quantities, or prize values.

**Independent Test**: Render the Awards Information page with mocked award data (6 awards). Verify that all 6 award detail cards render with image (336x336px), title, description, quantity (e.g., "10 Đơn vị"), and prize value (e.g., "7.000.000 VND").

**Acceptance Scenarios**:

1. **Given** an authenticated user navigates to the Awards Information page, **When** the page loads, **Then** the hero keyvisual banner is displayed at the top with the "ROOT FURTHER" + "Sun* Annual Award 2025" artwork.
2. **Given** the page has loaded, **When** the user scrolls past the hero, **Then** the section title "Hệ thống giải thưởng SAA 2025" is displayed with "Sun* annual awards 2025" caption above it.
3. **Given** the awards data has loaded, **When** the user views the main content area, **Then** 6 award detail cards are displayed vertically, each showing: an award image (336x336px), title (gold text), description (white text), quantity with unit type, and prize value in VND.
4. **Given** award data is fetched from the API, **When** the cards are rendered, **Then** the awards appear in order: Top Talent, Top Project, Top Project Leader, Best Manager, Signature 2025 - Creator, MVP.
5. **Given** any award detail card, **When** the user reads the metadata, **Then** the quantity shows a number + unit (e.g., "10 Đơn vị", "02 Tập thể", "01 Cá nhân") and the prize value is formatted with dots as thousand separators and "VND" suffix.

---

### User Story 2 - Navigate Between Awards (Priority: P1)

An authenticated user uses the sticky sidebar navigation to jump between award sections, or arrives at the page with a hash anchor in the URL that scrolls to a specific award.

**Why this priority**: The page is 6410px tall. Without sidebar navigation and hash anchor support, users cannot efficiently locate specific awards. This is also required for the Homepage-to-award-card navigation flow to work correctly.

**Independent Test**: Mount the Awards Information page with mocked data. Click each sidebar nav item and verify the page scrolls to the corresponding award section. Also navigate to the page with `#top-project` hash and verify the page scrolls to the Top Project card on load.

**Acceptance Scenarios**:

1. **Given** the user is on the Awards Information page, **When** they view the left sidebar, **Then** 6 navigation items are listed: Top Talent, Top Project, Top Project Leader, Best Manager, Signature 2025 - Creator, MVP.
2. **Given** the sidebar is visible, **When** the user clicks a sidebar item (e.g., "Top Project"), **Then** the page smoothly scrolls to the corresponding award detail card section.
3. **Given** the user scrolls through the award cards, **When** an award card enters the viewport, **Then** the corresponding sidebar item becomes active (gold text + underline indicator + active background).
4. **Given** the user navigates to the page with a hash anchor (e.g., `/awards#top-talent`), **When** the page loads, **Then** the page scrolls to the Top Talent award card section and the sidebar highlights "Top Talent".
5. **Given** the user scrolls the page, **When** the sidebar reaches its sticky position, **Then** it remains fixed in the viewport while the right content scrolls.

---

### User Story 3 - Navigate to Sun* Kudos (Priority: P2)

An authenticated user scrolls to the bottom of the Awards Information page and sees the Sun* Kudos promotional section, then clicks "Chi tiết" to navigate to the Sun* Kudos detail page.

**Why this priority**: The Kudos section is a secondary engagement driver reused from the Homepage. It is not the primary purpose of this page but provides a valuable cross-promotion path.

**Independent Test**: Mount the Awards Information page. Scroll to the Sun* Kudos section at the bottom. Verify the card renders with label, title, description, and "Chi tiết" button. Click "Chi tiết" and verify navigation to the Sun* Kudos page.

**Acceptance Scenarios**:

1. **Given** the user scrolls past all award detail cards, **When** the Sun* Kudos section enters the viewport, **Then** a dark card (bg: #0F0F0F, radius: 16px) appears showing: "Phong trào ghi nhận" label, "Sun* Kudos" title (gold, 57px), description text, and a gold "Chi tiết" button.
2. **Given** the Sun* Kudos section is visible, **When** the user clicks the "Chi tiết" button, **Then** the browser navigates to the Sun* Kudos detail page.
3. **Given** the Kudos data fails to load, **When** the section renders, **Then** it falls back to static/placeholder content or an error state.

---

### Edge Cases

- What happens when the URL contains a hash anchor (e.g., `#top-talent`) on page load? --> The page scrolls to the corresponding award section after data loads, with offset accounting for the sticky header height.
- What happens when `GET /awards` fails or returns empty? --> The award section shows a loading skeleton or empty state message ("Chua co du lieu giai thuong"). The sidebar nav is hidden or disabled.
- What happens when `GET /awards` returns fewer than 6 awards? --> Only the available awards are rendered. Sidebar nav shows only the available items.
- What happens when `GET /kudos` fails? --> The Sun* Kudos section renders with static fallback content or is hidden.
- What happens when the user is unauthenticated? --> Middleware redirects to `/auth/login` before the page renders.
- What happens on mobile (< 768px)? --> The sidebar collapses to a horizontal scrollable chip bar above the content area. The two-column layout becomes single-column.
- What happens when the hash anchor references a non-existent award slug? --> The page loads at the top position. No error shown.

---

## UI/UX Requirements *(from Figma)*

### Screen Components

| Component | Figma Node | Description | Interactions |
|-----------|------------|-------------|--------------|
| `<AppHeader>` | (reused) | Sticky top bar: SAA logo, 3 nav links, language toggle, bell, avatar | Reused from shared layout -- not part of this spec |
| `<HeroKeyvisual>` (3_Keyvisual) | `313:8437` | Full-width hero banner with "ROOT FURTHER" + SAA 2025 artwork (1200x871px cover) | Static visual, no interaction |
| `<AwardsSectionTitle>` (A_Title) | `313:8453` | Section title: "Sun* annual awards 2025" caption + "Hệ thống giải thưởng SAA 2025" heading | Static |
| `<AwardsSidebar>` (C_Menu list) | `313:8459` | Left sticky sidebar navigation with 6 award items | Click item --> scroll to section; active state tracks scroll position |
| `<SidebarNavItem>` (C.1-C.6) | `313:8460`-`313:8465` | Individual nav item with award name | Click --> scroll; active/normal state |
| `<AwardDetailCard>` (D.1-D.6) | `313:8467`-`313:8510` | Award detail card: image (336x336), title, description, quantity, prize value | Scroll target for sidebar nav + hash anchors |
| `<KudosSection>` (D1_Sunkudos) | `335:12023` | Sun* Kudos promotional card (reused component) | Click "Chi tiết" --> navigate to Kudos page |
| `<AppFooter>` | (reused) | Footer with logo, nav links, copyright | Reused from shared layout -- not part of this spec |

### Navigation Flow

- **From**: Homepage SAA --> "Awards Information" header nav link, "ABOUT AWARDS" CTA button, or any award card click (with `#{award-slug}` hash)
- **To**: Sun* Kudos page (from "Chi tiết" button in Kudos section)
- **Route**: `/awards` (confirmed route path for this page)
- **Hash anchors**: `#top-talent`, `#top-project`, `#top-project-leader`, `#best-manager`, `#signature-2025-creator`, `#mvp`
- **Sidebar**: Click triggers smooth scroll to target section + URL hash update

### Visual Requirements

- Design canvas: 1440x6410px desktop
- Responsive breakpoints:
  - Mobile (< 768px): Single-column layout, sidebar becomes horizontal scroll bar
  - Tablet (768-1023px): Narrower two-column, reduced gap
  - Desktop (>= 1024px): Full Figma spec at 1440px
- Animations/Transitions:
  - Sidebar active state: color + background 150ms ease-in-out
  - Smooth scroll to anchor sections: `scroll-behavior: smooth` with offset for sticky header
  - Award card images: subtle hover effect (optional enhancement)
- Accessibility (WCAG 2.1 AA):
  - Sidebar nav items reachable via keyboard (Tab/Enter)
  - Active sidebar item has `aria-current="true"`
  - Award sections have `id` attributes matching hash anchors
  - All images have descriptive `alt` text
  - Focus rings visible on interactive elements
  - Sidebar navigation uses `<nav>` landmark with `aria-label`

---

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST display a hero keyvisual banner at the top of the page with the SAA 2025 artwork.
- **FR-002**: System MUST display a section title with "Sun* annual awards 2025" caption and "Hệ thống giải thưởng SAA 2025" heading in gold.
- **FR-003**: System MUST render 6 award detail cards fetched from `GET /awards`, each showing: image, title, description, quantity (with unit type), and prize value (VND formatted).
- **FR-004**: System MUST render a sticky left sidebar navigation listing all 6 award categories.
- **FR-005**: Clicking a sidebar nav item MUST smoothly scroll the page to the corresponding award detail card section.
- **FR-006**: The sidebar MUST visually indicate the currently active/visible award section as the user scrolls (scroll spy behavior).
- **FR-007**: System MUST support hash anchor navigation on page load -- navigating to `/awards#top-talent` scrolls to the Top Talent section.
- **FR-008**: System MUST render the Sun* Kudos promotional section at the bottom, with a "Chi tiết" button navigating to the Kudos detail page.
- **FR-009**: System MUST protect this route -- unauthenticated users are redirected to `/auth/login`.
- **FR-010**: Awards MUST be displayed in the defined order: Top Talent, Top Project, Top Project Leader, Best Manager, Signature 2025 - Creator, MVP.

### Technical Requirements

- **TR-001**: Page must achieve Lighthouse performance score >= 80 on desktop.
- **TR-002**: Award data MUST be fetched server-side (Next.js Server Component or `getServerSideProps`) to avoid layout shift and improve SEO.
- **TR-003**: Award card images must use `next/image` with lazy loading for below-the-fold images.
- **TR-004**: The scroll spy (sidebar active state tracking) MUST be implemented as a Client Component (`'use client'`) using `IntersectionObserver`.
- **TR-005**: Hash anchor scroll-on-load MUST account for the sticky header height (80px) by using `scroll-margin-top` or equivalent offset.
- **TR-006**: All navigation uses Next.js `<Link>` component to preserve SPA behavior.
- **TR-007**: The `awards` table MUST be extended with `quantity` (integer), `unit_type` (text: 'Đơn vị' | 'Tập thể' | 'Cá nhân'), and `prize_value` (text) columns. Migration required before implementation.
- **TR-008**: Prize values MUST be formatted with Vietnamese number formatting (dot as thousand separator, e.g., "7.000.000 VND").

### Key Entities *(if feature involves data)*

- **Award** (extended): `{ id: string, slug: string, title: string, description: string, image_url: string, category: string, quantity: number, unit_type: string, prize_value: string, display_order: number }` -- fetched from `GET /awards`. Fields `quantity`, `unit_type`, and `prize_value` are NEW columns that must be added to the existing `awards` Supabase table.
- **KudosInfo** (reused): `{ label: string, title: string, description: string, detail_url: string }` -- fetched from `GET /kudos`. Same entity used on the Homepage.

---

## API Dependencies

| Endpoint | Method | Purpose | Status |
|----------|--------|---------|--------|
| `GET /awards` | GET | Fetch all 6 award categories with extended fields (quantity, unit_type, prize_value) | Exists (needs schema extension) |
| `GET /kudos` | GET | Fetch Sun* Kudos section content | Exists (from Homepage) |

> **Note**: The `awards` Supabase table already exists with `slug`, `title`, `description`, `image_url` columns. New columns required: `quantity` (integer), `unit_type` (text), `prize_value` (text). A database migration must be created before implementation.

---

## State Management

| State | Type | Location | Description |
|-------|------|----------|-------------|
| `awards` | `Award[]` | Server-fetched (props) | List of 6 award categories from Supabase |
| `kudosInfo` | `KudosInfo` | Server-fetched (props) | Kudos section content from Supabase |
| `activeAwardSlug` | `string` | Client Component local state | Currently active sidebar item, tracked via IntersectionObserver scroll spy |
| `initialHash` | `string \| null` | URL hash on page load | Used to scroll to target section on mount |

---

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: All 6 award detail cards render correctly with image, title, description, quantity, and prize value matching the Figma design.
- **SC-002**: Clicking any sidebar nav item scrolls to the corresponding award section within 500ms.
- **SC-003**: Scroll spy correctly highlights the active sidebar item as the user scrolls through all 6 sections (with <= 50px tolerance).
- **SC-004**: Navigating from the Homepage with a hash anchor (e.g., clicking the "Top Project" card) lands on the correct award section on this page.
- **SC-005**: Page passes visual regression check against the Figma design with <= 5% pixel difference threshold.
- **SC-006**: Unauthenticated access redirects to `/auth/login` within 1 navigation step.
- **SC-007**: Page renders responsively at 375px (mobile), 768px (tablet), and 1440px (desktop) without overflow or broken layout.

---

## Out of Scope

- **AppHeader content** -- the header is a shared layout component; only the "Awards Information" active state is relevant to this page.
- **AppFooter content** -- the footer is a shared layout component; reused as-is.
- **Widget Button** -- the floating action button is a shared layout component.
- **Award nomination or voting** -- this is a read-only information page; no write actions.
- **Individual award detail page** -- there is no separate page per award; all details are on this single page.
- **Admin CRUD for awards** -- managing award data is an admin function outside this scope.
- **Sun* Kudos full page** -- only the promotional card is in scope; the full Kudos page is a separate feature.

---

## Dependencies

- [x] Constitution document exists (`.momorph/constitution.md`)
- [x] Screen flow documented (`.momorph/contexts/SCREENFLOW.md`)
- [x] Design style documented (`.momorph/specs/zFYDgyj_pD-AwardsInformation/design-style.md`)
- [x] Homepage SAA spec exists (`.momorph/specs/i87tDx10uM-HomepageSAA/spec.md`) -- defines the navigation flow to this page
- [ ] Database migration for `awards` table extension (add `quantity`, `unit_type`, `prize_value` columns) -- required before implementation
- [ ] API specifications available (`.momorph/contexts/api-docs.yaml`) -- extended `GET /awards` response needs confirmation

---

## Notes

- The hero keyvisual on this page (3_Keyvisual, node `313:8437`) is a different image from the Homepage hero -- it is a 1200x871px cover artwork specific to the Awards Information page.
- The sidebar navigation (C_Menu list) is sticky-positioned and should remain visible as the user scrolls through the award cards on the right side.
- The two-column layout has a 238px gap between the sidebar and content area, which is generous and contributes to the premium visual feel.
- Award slugs for hash anchors should be derived from the `slug` column in the `awards` table (e.g., `top-talent`, `top-project`, `top-project-leader`, `best-manager`, `signature-2025-creator`, `mvp`).
- The Signature 2025 award has a dual prize value: "5.000.000 (ca nhan) / 8.000.000 VND (tap the)" -- the `prize_value` column should store this as a text string, not a numeric value, to accommodate this case.
- The D1_Sunkudos component (node `335:12023`) is the same Sun* Kudos promotional card used on the Homepage SAA -- it should be implemented as a shared/reusable component.
- Award card images use the same gold border and glow shadow style as the Homepage award cards, but at a larger display size in the detail view.
