# Feature Specification: Sun* Kudos - Live Board

**Frame ID**: `MaZUn5xHXZ` (figma node `2940:13431`)
**Frame Name**: `Sun* Kudos - Live board`
**File Key**: `9ypp4enmFmdK3YAFJLIu6C`
**Figma Link**: https://momorph.ai/files/9ypp4enmFmdK3YAFJLIu6C/screens/MaZUn5xHXZ
**Created**: 2026-04-20
**Status**: Draft

> Visual reference: see `assets/frame.png`.
> Visual specs & tokens: see `design-style.md`.

---

## Overview

The **Sun* Kudos - Live Board** is the public landing page for the Kudos feature within the Sun Annual Awards 2025 (SAA 2025) campaign. It is the "live" public wall where Sunners see, react to, and contribute to thank-you messages (kudos) sent between colleagues.

The page composes four distinct experiences on one scroll surface:

1. **A_KV Kudos** — Hero banner with the slogan *"Hệ thống ghi nhận và cảm ơn"* and two primary entry points: `Ghi nhận` (compose) and `Tìm kiếm sunner` (search sunners).
2. **B_Highlight Kudos** — A filterable carousel of the top kudos (ordered by heart count) with Hashtag / Department filters, prev-next arrows, and pagination counter.
3. **B.7_Spotlight Board** — An interactive word-cloud canvas showing every receiving sunner as a floating label over a dark canvas with a `388 KUDOS` counter (total count, queried from DB), a sunner search input, pan/zoom controls, and a live notification ticker for new kudos events.
4. **C_All Kudos** — An infinite feed of kudo post cards (sender → receiver, content up to 5 lines, attached image gallery, hashtag list, hearts, copy link), paired with a right sidebar (`D_Thống menu phải`) showing personal stats (kudos received / sent / hearts / secret boxes) and a *"10 SUNNER NHẬN QUÀ MỚI NHẤT"* leaderboard.

A user lands on this page after clicking **Sun* Kudos** in the main navigation, the **ABOUT KUDOS** CTA, or **Chi tiết** in the Sun* Kudos section of the homepage.

---

## User Scenarios & Testing *(mandatory)*

### User Story 1 — Browse recent kudos & react (Priority: P1)

As an authenticated Sunner, I want to scroll the live board, read the most-hearted and most-recent kudos, heart the ones I love, and copy a link to share.

**Why this priority**: Reading and reacting is the most frequent user motion on this page. Without a working feed + hearts + copy-link, the page has no value. This is the MVP.

**Independent Test**: Seed the DB with ≥10 kudos. Open `/kudos`. Verify: Highlight carousel renders top 5, All-Kudos feed paginates, hearts toggle optimistically, and Copy Link writes `window.location.origin + "/kudos/{id}"` to clipboard with toast *"Link copied — ready to share!"*.

**Acceptance Scenarios**:

1. **Given** I am authenticated and there are kudos in the system, **When** I load `/kudos`, **Then** the `HIGHLIGHT KUDOS` section shows the top 5 kudos (by heart count), All Kudos shows paginated kudos, and my personal stats appear in the right sidebar.
2. **Given** I am viewing a kudo I didn't send, **When** I click the heart icon, **Then** the count increases by 1, the heart turns red, and the change persists after page reload. Clicking again decrements and turns the heart gray.
3. **Given** I am viewing a kudo I sent myself, **When** I look at the heart button, **Then** the heart button is disabled (users cannot heart their own kudo).
4. **Given** I click `Copy Link` on any kudo card, **When** the click fires, **Then** the kudo URL `{baseUrl}/kudos/{id}` is copied to clipboard and a toast `Link copied — ready to share!` appears.
5. **Given** there are zero kudos in the system, **When** the page loads, **Then** the Highlight carousel and All Kudos feed both show `Hiện tại chưa có Kudos nào.`

---

### User Story 2 — Compose / send a new kudo (Priority: P1)

As a Sunner, I want to send a thank-you to a colleague directly from the live board.

**Why this priority**: Without a compose entry point, users can only consume, not contribute — this is the generative loop of the feature.

**Independent Test**: On `/kudos`, click `Ghi nhận` in the hero. Verify navigation to the compose dialog/screen (out-of-scope behavior lives in the Viết Kudo spec). Returning from compose with a successful send must cause the All-Kudos feed and `388 KUDOS` counter to update (either optimistic or via refetch/live WS).

**Acceptance Scenarios**:

1. **Given** I am on `/kudos`, **When** I click `A.1_Button ghi nhận`, **Then** the Viết Kudo compose dialog/screen opens (see Viết Kudo spec for modal-vs-route decision).
2. **Given** a new kudo has been successfully submitted and the Viết Kudo flow signals success, **When** control returns to `/kudos` (dialog closes or navigation resolves), **Then** my `Số Kudos bạn đã gửi` increments (via `['user-stats']` invalidation) and a new entry appears at the top of the All-Kudos feed (via `['kudos-feed']` invalidation or `kudos_live` realtime event).
3. **Given** the Supabase Realtime channel `kudos_live` is subscribed, **When** any Sunner sends a new kudo, **Then** a new ticker line appears with the format `HH:MMAM/PM {recipient name} đã nhận được một Kudos mới`.

---

### User Story 3 — Filter highlight kudos by hashtag or department (Priority: P2)

As a Sunner, I want to filter the Highlight carousel by hashtag or department to find kudos relevant to me or a team.

**Why this priority**: Filtering improves discovery but the page is usable without it (unfiltered highlights remain visible). Ship P1 first.

**Independent Test**: Seed kudos with mixed hashtags & departments. Click `Hashtag` dropdown → pick a tag. Verify both the Highlight carousel AND the All-Kudos feed re-fetch with the filter, and the pagination counter resets to `1/N`.

**Acceptance Scenarios**:

1. **Given** the Highlight section is rendered, **When** I click `B.1.1_ButtonHashtag`, **Then** a dropdown of hashtags (sourced from `GET /api/kudos/hashtags`) opens.
2. **Given** I select a hashtag, **When** the selection is made, **Then** both Highlight Kudos and All Kudos refetch filtered by that hashtag, the slide pagination resets to `1/N`, and the active filter is reflected in the button's active state.
3. **Given** I select a department, **When** the selection is made, **Then** both sections refetch filtered by that department.
4. **Given** a filter yields zero results, **When** both sections update, **Then** they show `Hiện tại chưa có Kudos nào.`
5. **Given** I filter by clicking a hashtag *inside a kudo card* (`B.4.3`, `C.3.7`), **When** the click fires, **Then** the Hashtag filter is set to that tag and both sections update identically.

---

### User Story 4 — Explore the Spotlight Board (Priority: P2)

As a Sunner, I want to scan the `388 KUDOS` spotlight for receivers, hover to see details, and jump to a profile or a kudo detail.

**Why this priority**: Visual wow factor + discovery tool. Not essential for MVP because browsing and hearting cover the critical loop.

**Independent Test**: Load `/kudos` with ≥50 spotlight entries. Verify pan/zoom controls work, hover on a name shows a tooltip with the name and time, typing into the search highlights matching sunners, clicking a name navigates to that user's profile, and the live ticker streams new events without reload.

**Acceptance Scenarios**:

1. **Given** the Spotlight loads, **When** I hover a name, **Then** a tooltip appears with the Sunner name and kudo timestamp.
2. **Given** I click `B.7.2_Pan zoom` and drag, **When** the pointer moves, **Then** the canvas pans / zooms accordingly; mouse wheel also zooms.
3. **Given** I type in `B.7.3_Tìm kiếm sunner`, **When** input length ≥ 1, **Then** matching names on the canvas are highlighted and non-matching ones are dimmed. The input accepts up to 100 characters.
4. **Given** the Supabase Realtime channel is subscribed, **When** a new kudo is posted anywhere, **Then** a live ticker line fades in at the bottom of the spotlight within 3 seconds.
5. **Given** the Realtime channel disconnects, **When** the drop is detected, **Then** the ticker hides while the Supabase client silently reconnects; spotlight layout remains stable.

---

### User Story 5 — View personal stats and open secret boxes (Priority: P2)

As a Sunner, I want to see my personal kudos stats and open any secret boxes I have been awarded.

**Why this priority**: Personalization drives return visits and the secret-box flow is the reward loop.

**Independent Test**: Log in as a user with `Số Secret Box chưa mở > 0`. Verify the stats panel shows the exact counts from `GET /api/users/me/stats`. Click `D.1.8_Button mở quà` and verify a POST to `/api/gifts/open` fires and the "Gửi lời chúc Kudos" popup is shown. If `Số Secret Box chưa mở == 0`, the button is disabled with a tooltip.

**Acceptance Scenarios**:

1. **Given** I am logged in, **When** `/kudos` loads, **Then** `D.1.2`…`D.1.7` display my current counts from `GET /api/users/me/stats`.
2. **Given** I have ≥1 unopened secret box, **When** I click `Mở quà`, **Then** the Gift Receive popup opens; on close, `D.1.6` (opened) and `D.1.7` (unopened) update to reflect the change.
3. **Given** I have 0 unopened secret boxes, **When** I hover `Mở quà`, **Then** the button is disabled and a tooltip reads "Bạn chưa có hộp quà nào".
4. **Given** `D.1.4_Số tim` is double-credit (`x2`), **When** the stat is rendered, **Then** the `x2` badge appears next to the count (earned during admin-configured special days).

---

### User Story 6 — Jump to a person's profile (Priority: P3)

As a Sunner, I want to click a sender, receiver, or spotlight name and land on their profile.

**Why this priority**: Enhances navigation but not critical to core content consumption.

**Independent Test**: From any kudo card, click the sender avatar or name. Verify navigation to `/users/{id}` (Profile người khác). Same for receiver. Same for names in the Spotlight canvas and in "10 SUNNER NHẬN QUÀ MỚI NHẤT".

**Acceptance Scenarios**:

1. **Given** a kudo card, **When** I click sender / receiver avatar or name, **Then** I navigate to that user's profile.
2. **Given** I hover a sender / receiver avatar or name, **When** the hover dwell exceeds 500 ms, **Then** a profile preview card appears.
3. **Given** I hover the `Số hoa thị` badge next to a name, **When** the hover fires, **Then** a tooltip explains the rule:
   - 1 hoa thị: 10 Kudos received
   - 2 hoa thị: 20 Kudos received
   - 3 hoa thị: 50 Kudos received

---

### Edge Cases

- **No session / session expired**: page is a protected route → redirect to `/auth/login`.
- **Campaign hasn't launched yet** (`/kudos` accessed before launch): backend returns 403; frontend redirects to `/prelaunch`.
- **Network offline mid-scroll**: pagination fetch fails → inline retry button, feed keeps already-loaded items.
- **Heart race condition** (double-click): rate-limit client-side to 1 toggle/400 ms; backend enforces idempotency — a second identical POST returns current state without side effects.
- **Copy link on non-secure context** (clipboard API unavailable): fall back to prompt-select-text or `document.execCommand('copy')`.
- **Long content**: truncate to **3 lines in Highlight card** (`B.4.2`) and **5 lines in All-Kudos feed card** (`C.3.5`), ellipsis `…`.
- **Hashtag overflow**: max **5 hashtags per line**; if it exceeds 1 line, append `…`.
- **Images**: max **5 images displayed per kudo** (`C.3.6`); click opens full-size.
- **Spotlight is empty** (`0 KUDOS`): show empty-state illustration + text `Chưa có Kudos nào.`
- **No gift recipients yet**: hide `D.3_10 SUNNER nhận quà` card, or show `Chưa có dữ liệu`.
- **Self-heart**: Heart button is disabled (ownership check on sender); tooltip `Bạn không thể thả tim cho kudos của mình`.
- **Stale filter**: If the currently selected hashtag or department is removed server-side, the filter auto-resets to "All", a toast `Bộ lọc đã được cập nhật` appears, and both sections refetch.
- **Fewer than 3 highlight cards**: carousel still renders, centered with remaining slots hidden; arrows both disabled when `count ≤ 1`; dots/counter show `1/1`.
- **D.1.5 row with zero or negative value**: counts are unsigned; if API returns `null`, render `0`.
- **Heart while offline**: optimistic toggle remains visible; on reconnect, the queued POST is replayed once. If it fails, the heart reverts and a toast shows `Không thể lưu lượt thả tim, vui lòng thử lại`.
- **Heart on own kudo (disabled click)**: the disabled heart button shows a tooltip `Bạn không thể thả tim cho kudos của mình` on hover/focus.
- **Spotlight search with zero matches**: non-matching names dim uniformly; search input shows a small caption `Không tìm thấy sunner nào`. Input remains focused.

---

## UI/UX Requirements *(from Figma)*

> All visual tokens, component dimensions, colors, typography, and state mappings live in **`design-style.md`**.

### Screen Components

| ID       | Component                         | Node ID     | Description                                                                                                   | Interactions                                                                                 |
| -------- | --------------------------------- | ----------- | ------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| Header   | Global Header                     | 2940:13433  | Shared header: Logo, main nav (Home / Awards / Sun* Kudos), Language, Notification bell (+badge), Widget      | Click-through nav; language & bell open overlays                                             |
| A        | KV Kudos (Hero banner)            | 2940:13437  | "Hệ thống ghi nhận và cảm ơn" + SAA 2025 KUDOS logo on gradient bg                                            | Readonly                                                                                     |
| A.1      | Button ghi nhận                   | 2940:13449  | Pill text-field CTA "Hôm nay, bạn muốn gửi lời cảm ơn và ghi nhận đến ai?" with pen icon                      | `on_click` → open Viết Kudo dialog                                                            |
| A.2      | Tìm kiếm sunner (hero)            | 2940:13450  | Secondary pill CTA with search icon; label "Tìm kiếm sunner"                                                  | `on_click` → open Tìm kiếm Sunner search                                                      |
| B        | Highlight Kudos                   | 2940:13451  | Filterable carousel of the top `highlight_limit` kudos (default 5) ordered by heart count                     | —                                                                                            |
| B.1.1    | Hashtag filter button             | 2940:13459  | Dropdown opener; icon chevron-down                                                                            | `on_click` → dropdown overlay `1002:13013`; select filters both Highlight + All Kudos; pagination resets to 1 |
| B.1.2    | Phong ban filter button           | 2940:13460  | Dropdown opener; icon chevron-down                                                                            | `on_click` → dropdown overlay `721:5684`; same behavior as B.1.1                             |
| B.2.1    | Carousel prev                     | 2940:13470  | Round icon button left (chevron-left) on a gradient overlay                                                   | Disabled on first slide; no wrap                                                             |
| B.2.2    | Carousel next                     | 2940:13468  | Round icon button right (chevron-right) on a gradient overlay                                                 | Disabled on last slide                                                                       |
| B.3      | KUDO - Highlight card             | 2940:13465  | Large cream card: sender, arrow, receiver; time; content (3-line clamp); hashtags; actions                    | Click card / B.4.2 → View Kudo; heart toggle; Copy Link; Xem chi tiết                        |
| B.3.1/5  | Sender / Receiver avatar          | —           | Circular avatar from Google profile                                                                           | Click → profile preview frame `721:5827`; hover → profile preview                             |
| B.3.2/6  | Sender / Receiver info            | —           | Name, department, hoa thị count, danh hiệu badge                                                              | Click name → profile; hover name → preview; hover hoa thị → rule tooltip (see Data Requirements) |
| B.3.4    | Icon mũi tên (arrow)              | —           | Non-interactive arrow from sender → receiver                                                                  | Readonly                                                                                     |
| B.4.1    | Timestamp                         | —           | `10:00 - 10/30/2025` (see Data Requirements for format)                                                       | Readonly                                                                                     |
| B.4.2    | Content body                      | —           | Kudo text, clamped to 3 lines                                                                                 | Click → View Kudo detail                                                                     |
| B.4.3    | Hashtag list                      | —           | `#Dedicated #Inspring …` single line, max 5 tags                                                              | Click tag → sets Hashtag filter and refreshes both Highlight + All Kudos                     |
| B.4.4    | Actions row                       | —           | Hearts counter, Copy Link button, "Xem chi tiết" text button                                                  | See Hearts / Copy Link / "Xem chi tiết" rules                                                 |
| B.5      | Pagination strip                  | 2940:13471  | `◀  2/5  ▶`                                                                                                   | Arrows disabled at ends; click updates slide + counter                                       |
| B.6      | Section header (Spotlight)        | 2940:13476  | "Sun* Annual Awards 2025" / "SPOTLIGHT BOARD"                                                                 | Readonly                                                                                     |
| B.7      | Spotlight canvas                  | 2940:14174  | Interactive word-cloud of receiver names                                                                      | Hover name → tooltip; click name → View Kudo detail or Profile (Q11)                         |
| B.7.1    | 388 KUDOS counter                 | 3007:17482  | Total kudos count (from DB)                                                                                   | Readonly                                                                                     |
| B.7.2    | Pan/Zoom control                  | 3007:17479  | Toggle pan vs zoom                                                                                            | `on_click` toggles mode; hover → tooltip "Pan/Zoom"                                           |
| B.7.3    | Tìm kiếm sunner (spotlight)       | 2940:14833  | Search input; placeholder "Tìm kiếm"; max 100 chars                                                           | Type → debounced highlight; Enter / icon click → execute                                      |
| B.7-live | Live ticker                       | 3004:15999… | Rolling notification line `HH:MMAM/PM {name} đã nhận được một Kudos mới`                                      | Auto-scroll; deduplicates by `event_id`; `aria-live="polite"`                                 |
| C.1      | Section header (All Kudos)        | 2940:14221  | "Sun* Annual Awards 2025" / "ALL KUDOS"                                                                       | Readonly                                                                                     |
| C.3/5/6/7| KUDO Post card (light)            | 3127:21871+ | Cream card: sender → send icon → receiver; time + `IDOL GIỚI TRẺ` hashtag; content (5-line); images; tags    | Card click → detail; heart; copy link; avatar/name → profile                                 |
| C.3.2    | Send icon                         | —           | `MM_MEDIA_Send` 24×24, muted gold                                                                             | Readonly                                                                                     |
| C.3.4    | Time                              | —           | Formatted per Data Requirements                                                                               | Readonly                                                                                     |
| C.3.6    | Image gallery                     | —           | ≤5 thumbnails, left-aligned                                                                                   | Click thumbnail → lightbox; keyboard Esc closes                                               |
| C.3.7    | Hashtag list                      | —           | Same rules as B.4.3                                                                                           | Click tag → sets Hashtag filter                                                               |
| D.4      | Hashtag chip (inside card)        | —           | Pill chip, e.g. `IDOL GIỚI TRẺ` with pen icon                                                                 | Click chip → filter All+Highlight Kudos by that hashtag                                       |
| C.4.1    | Hearts                            | —           | Count + heart icon (gray inactive / red active)                                                               | Toggle subject to ownership + double-day rules (FR-004 … FR-006)                              |
| C.4.2    | Copy Link                         | —           | Text button with link icon                                                                                    | `on_click` → clipboard + toast (FR-007)                                                       |
| D.1      | Stats panel                       | 2940:13489  | Dark container with 5 numeric rows + divider + Open Gift CTA                                                  | Readonly except D.1.8                                                                        |
| D.1.2-7  | Kudos received, sent, hearts, SB  | —           | `label : value` rows; D.1.4 supports `x2` multiplier badge                                                    | Readonly                                                                                     |
| D.1.8    | Mở quà                            | 2940:13497  | Yellow button with gift icon, label "Mở quà"                                                                  | `on_click` → POST `/api/gifts/open` → "Gửi lời chúc Kudos" popup (target frame `1466:7676`)   |
| D.3      | 10 SUNNER NHẬN QUÀ MỚI NHẤT       | 2940:13510  | Leaderboard list with avatar + name + gift description                                                        | Click name/avatar → profile; hover → profile preview (`721:5827`); scroll independent         |
| Footer   | Global Footer                     | 2940:13522  | Logo + nav + copyright "Bản quyền thuộc về Sun* © 2025"                                                       | Nav links                                                                                    |

### Navigation Flow

All URLs originating from this screen are listed below. Per the constitution (`frontend.md` — *URL and Navigation Implementation*), URLs MUST be derived from `SCREENFLOW.md`. URLs marked **(predicted)** are not yet confirmed in the Navigation Graph — see Q13 in Clarification Questions.

- **From**: Homepage SAA (via "Sun* Kudos" nav, "ABOUT KUDOS" CTA, or Kudos section "Chi tiết"); any main-app page that exposes the shared Header's "Sun* Kudos" link.
- **To** (direct user navigation):
  - `/` → Homepage SAA (logo click in header/footer) — confirmed in SCREENFLOW.
  - Awards Information (header nav) — URL `TBD` per SCREENFLOW; use route constant once resolved.
  - Sun* Kudos — Live board (self, scroll-to-top on logo). This screen.
  - `/kudos/compose` **(predicted)** → Viết Kudo, from A.1
  - `/kudos/search` **(predicted)** → Tìm kiếm Sunner, from A.2
  - `/kudos/{id}` **(predicted)** → View Kudo detail — from card body, "Xem chi tiết" button, or spotlight node click
  - `/users/{id}` **(predicted)** → Profile người khác — from sender / receiver / spotlight name / leaderboard. Hover preview uses Figma frame `721:5827`.
  - Gift Receive popup (overlay) → from D.1.8, target frame `1466:7676`
  - Overlays (no route change): Hashtag dropdown (`1002:13013`), Department dropdown (`721:5684`), Language dropdown (`hUyaaugye2`), Notification panel, Quick action menu
- **To** (logic-based navigation):
  - `/auth/login` — on 401 from any API call (shared interceptor)
  - `/prelaunch` — on 403 from `/api/event-config` or kudos endpoints when campaign has not launched
- **Triggers**: see the component table above for per-element trigger and target mapping.

### Data Requirements

#### Form Fields

| Field              | Component  | Type           | Required | Validation                                        | Placeholder         |
| ------------------ | ---------- | -------------- | -------- | ------------------------------------------------- | ------------------- |
| `spotlight_search` | `B.7.3`    | text           | No       | Trim; `maxLength: 100` (per Figma spec)           | "Tìm kiếm"          |
| `hashtag_filter`   | `B.1.1`    | select (one)   | No       | Must be a `hashtag.slug` from `/api/kudos/hashtags` | label "Hashtag"    |
| `department_filter`| `B.1.2`    | select (one)   | No       | Must be a `department.id` from `/api/departments` | label "Phong ban"   |

Note: `A.1_Button ghi nhận` is visually a text field but acts as a button trigger — per Figma design it opens the Viết Kudo dialog on click; no in-place typing is supported on this screen.

#### Display fields

| Field              | Format / Rule                                                                                                   | Source                                   |
| ------------------ | --------------------------------------------------------------------------------------------------------------- | ---------------------------------------- |
| Kudo timestamp     | `HH:mm - MM/DD/YYYY` (per Figma examples `10:00 - 10/30/2025`, `08:30PM`). Confirm locale format — see Q5.      | `kudo.created_at`                        |
| Kudo content clamp | Highlight: 3 lines. All-Kudos feed: 5 lines. Overflow → `…` and still clickable for full detail.                 | `kudo.content`                           |
| Hashtag list       | Single line; max 5 visible; overflow → `…`. Hashtags render with `#` prefix.                                    | `kudo.hashtags[]`                        |
| Image gallery      | Max 5 thumbnails, left-aligned. If >5, only the first 5 are shown on this screen.                               | `kudo.images[]`                          |
| Hearts count       | Plain integer with thousands separator (`1.000` = 1000 per Figma VN locale).                                    | `kudo.hearts_count`                      |
| Spotlight counter  | Plain integer ("388 KUDOS"). Thousands separator follows VN locale when ≥ 1000.                                 | `/api/kudos/spotlight` `total_count`     |
| Ticker line        | `HH:MMAM/PM {receiver_name} đã nhận được một Kudos mới` (per Figma node `3004:15999`)                           | `LiveKudoEvent` broadcast                |
| Live-board tooltip | "Tên người nhận · 10:00 - 10/30/2025" (hover on spotlight name)                                                  | Spotlight entry (latest kudo to user)    |

#### Hoa thị (stars) threshold rules

Exact copy shown in the tooltip when hovering `Số hoa thị` (from Figma `B.3.2`, `B.3.6`, `C.3.1`, `C.3.3`):

| Stars | Threshold (kudos received) | Tooltip text                                                                                                                          |
| ----- | -------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| 1     | `≥ 10`                      | "Sunner đã nhận được 10 Kudos và bắt đầu lan tỏa năng lượng ấm áp đến mọi người xung quanh."                                          |
| 2     | `≥ 20`                      | "Sunner đã nhận được 20 Kudos và chứng minh sức ảnh hưởng của mình qua những hành động lan tỏa tích cực mỗi ngày."                     |
| 3     | `≥ 50`                      | "Sunner đã nhận được 50 Kudos và trở thành hình mẫu của sự công nhận, sẻ chia và lan tỏa tinh thần Sun*."                              |

#### Danh hiệu (badge) values

Observed values in Figma: `New Hero`, `Rising Hero`, `Super Hero`, `Legend Hero`. Mapping thresholds to danh hiệu are backend-managed and not visible in this frame — see Q3/Q8.

### Visual Requirements

- **Responsive breakpoints**:
  - Mobile `<768px`: single-column; hero CTAs stack full-width; carousel shows 1 card; spotlight downscaled but keeps pan/zoom; right sidebar collapses below feed.
  - Tablet `768-1023px`: feed is full-width; sidebar stacks below feed; highlight carousel shows 1 card with peek.
  - Desktop `≥1024px`: two-column All-Kudos (feed 680px + sidebar 422px). Highlight shows 3 cards (active centered, sides dimmed).
- **Animations**: slide transition for carousel (~250ms ease-out), fade-in for ticker lines (~200ms), heart pop-animation on click (~200ms scale 1 → 1.2 → 1), toast slide-in from top-right (~200ms). Respect `prefers-reduced-motion` — disable fades and auto-advance.
- **Accessibility**: WCAG 2.1 AA compliant.
  - All icon-only buttons MUST have `aria-label` with Vietnamese + English translations (respecting current i18n locale).
  - Hearts button `aria-pressed` reflects current liked state; `aria-label` is dynamic: `Thả tim (1.000)` / `Đã thả tim (1.001)`.
  - Carousel uses `role="region" aria-roledescription="carousel"`; Left/Right arrow keys + Home/End navigate slides when focus is inside the carousel.
  - Filter buttons use `aria-haspopup="listbox" aria-expanded`.
  - Live ticker has `aria-live="polite" aria-atomic="false"`.
  - Dropdowns (hashtag, department) trap focus and close on Escape.
  - Image gallery thumbs are `<button>`s with `aria-label="Xem ảnh N/5"`; lightbox traps focus.
  - Tab order: Header → Hero CTAs (A.1 then A.2) → Highlight filters → Highlight carousel → Pagination → Spotlight search → Pan/Zoom → Feed cards (sender → content → hearts → copy → xem chi tiết) → Sidebar (stats → open gift → top recipients) → Footer.
  - All focusable elements show a visible focus ring (`outline: 2px solid #FFEA9E; outline-offset: 2px`).
  - Contrast: all spec'd color combinations pass AA — see design-style.md.

---

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST show the top `highlight_limit` kudos (by total heart count) in the `HIGHLIGHT KUDOS` carousel. Default `highlight_limit = 5` per the Figma pagination example `2/5`; final value is configurable via EventConfig — see Q2. On filter change, the ordering and count respect the filter.
- **FR-002**: Carousel navigation arrows MUST be disabled at the first / last slide (no wrap).
- **FR-003**: Hashtag and Department filters MUST apply simultaneously to BOTH the Highlight carousel and the All-Kudos feed, and reset pagination to `1/N`.
- **FR-004**: Users MUST be able to toggle a heart on any kudo they did NOT send. The sender's heart button MUST be disabled for their own kudos.
- **FR-005**: One user may only hold one active heart per kudo. Re-clicking untoggles.
- **FR-006**: When a third party hearts a kudo, the **receiver's** (kudo target — the person being thanked) total heart balance increments by 1 normally, or by 2 during admin-configured special days (`x2` flag on the event config). Untoggling reverses the same amount that was granted. See Q1 — the Figma design note for `C.4.1` contains a conflicting phrase about "tài khoản gửi kudo được cộng 1 tim"; the interpretation adopted here aligns with the cancel rule ("Số tim trên tài khoản nhận kudos sẽ bị thu hồi") and with D.1.4 label "Số tim bạn nhận được" which counts hearts accumulated by being the **receiver**.
- **FR-007**: `Copy Link` MUST write `{baseUrl}/kudos/{id}` to the clipboard and show a toast `Link copied — ready to share!`. If the clipboard API is unavailable, fall back to `document.execCommand('copy')`.
- **FR-008**: All Kudos MUST use infinite scroll — append next page when the user scrolls within 400px of the list bottom.
- **FR-009**: Kudo card content MUST be clamped:
  - Highlight card: **3 lines** of content, ellipsis, single-line hashtags.
  - All-Kudos card: **5 lines** of content, ellipsis, single-line hashtags.
  - Both: **max 5 hashtags** visible on one line, rest truncated with `…`.
  - Both: **max 5 images** in the gallery, left-aligned.
- **FR-010**: Clicking any hashtag chip inside a kudo card sets the Hashtag filter to that tag and refreshes both sections.
- **FR-011**: The `Spotlight 388 KUDOS` counter MUST equal the total number of kudos in the system, fetched from DB.
- **FR-012**: The Spotlight canvas MUST support pan (click + drag) and zoom (mouse wheel or +/- keys), toggled via `B.7.2_Pan zoom`.
- **FR-013**: The Spotlight search input `B.7.3` MUST accept text up to 100 characters. Input is optional.
- **FR-014**: Live kudo events MUST be streamed to the Spotlight ticker via **Supabase Realtime** (per constitution — Supabase is the approved Realtime provider). The client subscribes to a broadcast channel (e.g., `kudos_live`) and receives `LiveKudoEvent` payloads. On disconnect the Supabase client handles silent reconnection — the UI hides the ticker while disconnected.
- **FR-015**: The Stats panel MUST reflect the current user's counts: kudos received, kudos sent, hearts received (with `x2` badge when active), secret boxes opened, secret boxes unopened.
- **FR-016**: `Mở quà` MUST be disabled when `Secret Box chưa mở == 0` with tooltip `Bạn chưa có hộp quà nào`. When enabled, click posts `/api/gifts/open` and, on success, navigates to the Gift Receive popup.
- **FR-017**: Clicking sender/receiver avatar or name MUST navigate to `/users/{id}` (URL predicted — see Q13). Hovering for ≥500ms MUST open a profile-preview tooltip rendered from Figma frame `721:5827`.
- **FR-017a**: Clicking a kudo card body (B.4.2 / C.3.5) or the "Xem chi tiết" action button (B.4.4) MUST navigate to `/kudos/{id}` (URL predicted — see Q13) with the clicked kudo's ID.
- **FR-017b**: Clicking an image thumbnail (C.3.6) MUST open a fullscreen lightbox over the current page (no route change). The lightbox MUST: trap focus; close on Escape or backdrop click; support ←/→ arrow keys to navigate between the kudo's images; show the current index (e.g., `2/5`).
- **FR-018**: Hovering the `Số hoa thị` badge MUST show a tooltip explaining the rules (1/2/3 stars → 10/20/50 kudos received).
- **FR-019**: Empty states — both Highlight and All Kudos show `Hiện tại chưa có Kudos nào.` when the filter returns 0 results; Spotlight shows an empty state; D.3 hides the block or shows `Chưa có dữ liệu`.
- **FR-020**: Language follows the global `i18nStore` (VN default, EN supported). All user-visible copy MUST go through `t()`.

### Technical Requirements

- **TR-001**: Stack alignment — this screen MUST be implemented on the approved stack from the constitution: Next.js 15 App Router, React 19, TailwindCSS v4, Supabase (Auth + DB + Realtime), Cloudflare Workers via OpenNext, TypeScript strict. No new runtime deps without PR-level justification.
- **TR-002**: Data fetching — Feed + Highlight use a data-fetching layer compatible with Supabase (e.g., TanStack Query) with ~60s stale time and background refetch on window focus. Server components SHOULD be used for initial render where possible.
- **TR-003**: Heart POST MUST be idempotent per `(user_id, kudo_id)` — server returns current state for repeated identical requests within the same window.
- **TR-004**: Heart click debounced 400ms client-side and 5 req/s rate-limited server-side per user.
- **TR-005**: Copy Link uses `navigator.clipboard.writeText`, with `document.execCommand('copy')` fallback for non-secure contexts.
- **TR-006**: Supabase Realtime subscription for live ticker — channel events include a unique `event_id` used to dedupe against cached feed data. The Supabase client manages reconnection; the UI gates the ticker visibility on subscription status.
- **TR-007**: Spotlight name placement MUST be deterministic — positions computed from a seeded hash of `user_id + kudos_received_count` so repeated reloads render identically, and multiple clients see the same layout (see Q11 for whether seed is client- or server-computed).
- **TR-008**: Feed virtualized (e.g., `@tanstack/react-virtual`) once the loaded list exceeds 30 cards.
- **TR-009**: All network responses handle 401 (redirect to `/auth/login`), 403 (redirect to `/prelaunch` if event not running), 429 (toast + disable briefly), 5xx (retry button per section).
- **TR-010**: Target performance — LCP ≤ 2.5s on 4G, INP ≤ 200ms on heart click and carousel arrow.
- **TR-011**: Component hydration strategy — Hero and Highlight render first (critical), Spotlight lazy-hydrates (intersection observer), All Kudos streams with `<Suspense>`.
- **TR-012**: Clean architecture — per constitution, route handlers in `src/app/api/**` are thin; business logic lives in `src/services/*-service.ts`; Supabase client lives in `src/libs/supabase/`. Page components consume services via hooks in `src/hooks/`.
- **TR-013**: Asset paths — icons/images under `public/assets/kudos/{icons|images|logos}/*.{svg,png}` using kebab-case filenames (`pen.svg`, `open-gift.svg`, `send.svg`, `heart.svg`, `link.svg`, `chevron-down.svg`, `chevron-left.svg`, `chevron-right.svg`, `pan-zoom.svg`, `star.svg`, `kv-kudos.png`, `spotlight-aurora.png`, `kudos-logo.svg`). See `design-style.md` → Asset Registry for the complete list with source Figma nodes.

### State Management

#### Local component state

| State                     | Type                            | Initial       | Purpose                                                            |
| ------------------------- | ------------------------------- | ------------- | ------------------------------------------------------------------ |
| `highlightFilter`         | `{ hashtag, department }`       | `{}`          | Active filter; also passed as query params on `/api/kudos*` calls  |
| `highlightIndex`          | `number`                        | `0`           | Current slide in the Highlight carousel                            |
| `spotlightQuery`          | `string`                        | `""`          | Debounced (200ms) text from `B.7.3_Tìm kiếm sunner`                |
| `spotlightZoom`           | `number`                        | `1`           | Zoom scale of `B.7` canvas                                         |
| `spotlightPan`            | `{ x, y }`                      | `{ 0, 0 }`    | Pan translation of canvas                                          |
| `panZoomMode`             | `'pan' \| 'zoom'`               | `'pan'`       | Toggled by `B.7.2`                                                 |
| `feedPageParam`           | `string \| null` (cursor)       | `null`        | Cursor for All-Kudos feed pagination                               |
| `optimisticHearts`        | `Map<kudoId, { liked, count }>` | empty         | Local override while POST `/api/kudos/{id}/hearts` is in flight    |
| `openGiftLoading`         | `boolean`                       | `false`       | Loading state on `D.1.8`                                           |
| `dropdownOpen`            | `'hashtag' \| 'department' \| null` | `null`   | Which filter dropdown is currently open                            |
| `toast`                   | `{ id, kind, message } \| null` | `null`        | Shared toast slot (copy-link, errors)                              |
| `imageLightbox`           | `{ kudoId, index } \| null`     | `null`        | Fullscreen image viewer state                                      |

#### Global / shared state

| State                | Store / Source           | Read/Write | Purpose                                                       |
| -------------------- | ------------------------ | ---------- | ------------------------------------------------------------- |
| `session / user`     | Supabase Auth            | Read       | Auth guard + identify current user for stats and heart-ownership |
| `locale`             | i18n dictionary context  | Read       | Drives all `t()` calls and date formatting                    |
| `unreadGiftCount`    | `useUserStats` hook cache | Read/Write | Mirrors `D.1.7`; invalidated after `Mở quà`                   |
| `notificationBadge`  | shared notification store | Read       | Header bell red dot                                           |
| `realtimeStatus`     | Supabase channel state   | Read       | Gates ticker visibility                                       |

#### Server state / cache keys

| Key                                           | Source                                  | Invalidate on                                                         |
| --------------------------------------------- | --------------------------------------- | --------------------------------------------------------------------- |
| `['kudos-highlights', filter]`                | `GET /api/kudos/highlights`             | Filter change; heart toggle; `kudo_created` realtime event            |
| `['kudos-hashtags']`                          | `GET /api/kudos/hashtags`               | Rarely; 1-day stale time                                              |
| `['departments']`                             | `GET /api/departments`                  | Rarely; 1-day stale time                                              |
| `['kudos-feed', filter, cursor]` (infinite)   | `GET /api/kudos`                        | Filter change; new-kudo submit; heart toggle                          |
| `['kudos-spotlight', filter]`                 | `GET /api/kudos/spotlight`              | Periodic (60s); on visibility focus                                   |
| `['user-stats']`                              | `GET /api/users/me/stats`               | After `Mở quà`, new kudo sent, or heart on own kudo received          |
| `['gifts-top-recipients']`                    | `GET /api/gifts/top-recipients`         | After any `Mở quà` event                                              |
| `['event-config']`                            | `GET /api/event-config`                 | 5-minute stale; refetch on focus                                      |

#### Loading / error / empty / success states

Each section renders independently — a failure in one MUST NOT prevent the others from rendering.

| Section           | Loading                                          | Error                                                                     | Empty                                                 | Success                                                |
| ----------------- | ------------------------------------------------ | ------------------------------------------------------------------------- | ----------------------------------------------------- | ------------------------------------------------------ |
| Highlight Kudos   | 3 skeleton cards                                 | Inline banner + retry button; keep filters usable                          | `Hiện tại chưa có Kudos nào.`                          | carousel renders; pagination updates                   |
| Spotlight canvas  | spinner inside canvas frame                      | Inline message + retry; ticker hidden                                      | `Chưa có Kudos nào.`                                   | name cloud fades in                                    |
| All Kudos feed    | 3 skeleton post cards (initial); inline row loader (subsequent pages) | Retry button at row where failure occurred                   | `Hiện tại chưa có Kudos nào.`                          | posts render; hearts toggle animates                   |
| Stats panel       | `—` placeholders in each numeric slot            | Red border + retry                                                         | N/A — authenticated user always has stats             | values render; `x2` badge appears when active          |
| Top recipients    | 10 skeleton rows                                 | inline error inside panel; retains header                                  | `Chưa có dữ liệu`                                      | rows render                                            |
| Heart toggle      | optimistic update; heart icon shows ripple       | revert + toast `Không thể lưu lượt thả tim, vui lòng thử lại`              | N/A                                                    | count + color persist                                  |
| Copy Link         | N/A                                              | toast `Không thể sao chép liên kết` if both clipboard APIs fail            | N/A                                                    | toast `Link copied — ready to share!`                  |
| Open Gift         | spinner in button                                | toast `Không thể mở quà, vui lòng thử lại`                                 | disabled when `unopened == 0`                          | receive popup opens; stats invalidated                 |

### Key Entities

- **Kudo**: `id`, `sender_id`, `receiver_id`, `content` (≤ N chars), `hashtags[]`, `images[]` (≤5), `department_id`, `hearts_count`, `created_at`. Relationships: `sender, receiver → User`; `department → Department`; `hashtags → Hashtag[]`.
- **User (Sunner)**: `id`, `name`, `avatar_url`, `department_id`, `kudos_received_count`, `kudos_sent_count`, `hearts_received_count`, `hoa_thi_level` (0/1/2/3), `danh_hieu` (New Hero / Rising Hero / Super Hero / Legend Hero), `secret_box_opened_count`, `secret_box_unopened_count`.
- **Hashtag**: `id`, `slug`, `label`.
- **Department (Phòng ban)**: `id`, `name`.
- **Heart**: `user_id`, `kudo_id`, `value` (1 or 2), `created_at`. Unique on `(user_id, kudo_id)`. `value` records the multiplier **at click time** (1 or 2 during `x2` days) so cancellation reverses the same amount. The receiver's aggregate `hearts_received_count` (on User) is the sum of `Heart.value` over kudos they received.
- **SecretBox / Gift**: `id`, `owner_id`, `status` (`opened` / `unopened`), `gift_description`, `opened_at`.
- **LiveKudoEvent**: `event_id`, `kudo_id`, `receiver_id`, `receiver_name`, `occurred_at`.
- **EventConfig**: `double_heart_active` (bool), `launch_at`, `ends_at`.

---

## API Dependencies

| Endpoint                            | Method | Purpose                                                             | Status     |
| ----------------------------------- | ------ | ------------------------------------------------------------------- | ---------- |
| `/api/users/me`                     | GET    | Current user profile                                                | Predicted  |
| `/api/users/me/stats`               | GET    | Stats panel: received, sent, hearts (+x2), secret boxes             | Predicted  |
| `/api/kudos`                        | GET    | Paginated All-Kudos feed `?page&limit&hashtag&department&sort`     | Predicted  |
| `/api/kudos/{id}`                   | GET    | Kudo detail (used by View Kudo page + hover preview)                | Predicted  |
| `/api/kudos/highlights`             | GET    | Top 5 highlight kudos `?hashtag&department`                         | Predicted  |
| `/api/kudos/hashtags`               | GET    | Options for Hashtag filter + hashtag chip navigation                | Predicted  |
| `/api/departments`                  | GET    | Options for Department filter                                       | Predicted  |
| `/api/kudos/spotlight`              | GET    | Total count + full list of receivers (for client-side filtering)    | Predicted  |
| `/api/kudos/spotlight/search`       | GET    | **Only when receiver list exceeds client-fetch budget** — server search `?q` returns matching receivers. If payload from `/api/kudos/spotlight` is complete, filter client-side and skip this call. | Predicted |
| `kudos_live` (Supabase Realtime)    | channel | Live ticker event stream — **not an HTTP endpoint**. Client subscribes via `supabase.channel('kudos_live')`; server inserts into `live_kudo_events` table trigger the Realtime broadcast | Predicted |
| `/api/kudos/{id}/hearts`            | POST   | Toggle heart (idempotent per user)                                  | Predicted  |
| `/api/gifts/top-recipients`         | GET    | Top 10 sunners who recently received gifts                          | Predicted  |
| `/api/gifts/open`                   | POST   | Open a secret box (returns gift info for the receive popup)         | Predicted  |
| `/api/event-config`                 | GET    | Double-heart flag, campaign launch/end times                        | Predicted  |

---

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: LCP ≤ 2.5 s and INP ≤ 200 ms on desktop and 4G mobile (Web Vitals p75).
- **SC-002**: ≥ 70% of authenticated Sunners who land on `/kudos` heart at least 1 kudo or open a detail page (first-visit engagement).
- **SC-003**: `Ghi nhận` click-through rate ≥ 15% during the campaign window.
- **SC-004**: Zero heart-state divergence after 5-minute continuous live streaming — server totals equal client-rendered totals within a 1-second reconcile window.
- **SC-005**: Spotlight ticker latency ≤ 3 s from kudo submit to on-screen appearance for 95% of events.
- **SC-006**: Page renders correctly on latest two versions of Chrome, Safari, Edge, Firefox + mobile Safari/Chrome.

---

## Out of Scope

- Kudo compose UI (lives in **Viết Kudo** spec).
- Kudo detail page (lives in **View Kudo** spec).
- Profile page (lives in **Profile người khác** / **Profile bản thân** specs).
- Secret-box receive popup (lives in **Gửi lời chúc Kudos** spec — target frame `1466:7676`).
- Admin configuration of double-heart days (lives in **Admin - Setting** spec).
- Notification panel and Quick-action menu behavior beyond opening (lives in separate overlay specs).

---

## Dependencies

- [x] Constitution document exists (`.momorph/constitution.md`)
- [ ] API specifications available (`.momorph/API.yml`) — predicted; backend confirmation needed.
- [ ] Database design completed (`.momorph/database.sql`) — entities predicted above.
- [x] Screen flow documented (`.momorph/contexts/SCREENFLOW.md`) — updated 2026-04-20.
- [x] Frame image: `assets/frame.png`
- [x] Visual specs: `design-style.md`

---

## Notes

- The visual design makes a deliberate contrast between the **dark sections** (Hero, Highlight, Spotlight, Sidebar) using `#00101A`/`#00070C` + gold `#FFEA9E` and the **light All-Kudos feed** cards using cream `#FFF8E1`. Any reused Kudo card needs a `variant="highlight" | "feed"` prop.
- The Header includes a notification bell with a red dot badge (`Badge/Dot`) — its unread state is driven by the shared notification store across app pages.
- The Header is z-index high enough to float above the page; the Keyvisual background extends behind it with a 25° dark gradient overlay.
- Internationalization: all strings in spec.md above are the Vietnamese UI strings shown in the design. When building, map each to an i18n key and provide EN equivalents (project uses the existing i18n dictionary system — VN default, EN supported).

---

## Clarification Needed

The following questions cannot be resolved from Figma, `SCREENFLOW.md`, or the constitution alone. Please answer before `plan.md` is generated — answers may change FRs or add new APIs.

### Business Logic

- **Q1 — Heart beneficiary**: Figma `C.4.1_Hearts` contains two sentences that disagree on who receives the hearts. This spec treats the **receiver of the kudo** as the heart beneficiary (matching D.1.4 label and the cancel-rule sentence). Please confirm.
- **Q2 — Highlight carousel count**: Is "top 5" a hard limit (FR-001) or a configurable `highlight_limit`? B.5 pagination example shows `2/5`, suggesting 5 is display-only.
- **Q3 — Double-heart (`x2`) activation**: Is `EventConfig.double_heart_active` a single boolean, or a schedule of date ranges? Does it apply retroactively to hearts cast before activation?
- **Q4 — All Kudos page size and sort**: Default limit per page? Initial sort — `created_at DESC`, `hearts_count DESC`, or mixed?
- **Q5 — Date format per locale**: Figma examples (`10:00 - 10/30/2025`) use `MM/DD/YYYY`. For VN locale, should we use `DD/MM/YYYY` or keep the Figma format globally?
- **Q6 — Self-heart enforcement**: Design mandates the sender cannot heart. Does this include admin/moderator roles, or is the rule universal?
- **Q7 — Secret box open flow**: Does `POST /api/gifts/open` complete synchronously and return the gift info the receive popup needs, or is there an async animation step?
- **Q8 — Spotlight hover tooltip**: When a receiver has multiple kudos, which timestamp does the tooltip show — most recent, oldest, or the one that placed them on the board?
- **Q9 — Leaderboard listed in Figma D description but not on this frame**: `D_Thống menu phải` description mentions "10 SUNNER CÓ SỰ THĂNG HẠNG MỚI NHẤT" in addition to `D.3_10 SUNNER NHẬN QUÀ MỚI NHẤT`. Is the "thăng hạng" (rank-up) list in scope for this screen, or a different frame?

### Design / Visual

- **Q10 — Carousel with <3 cards**: At `count ∈ {0, 1, 2}` how should the carousel lay out? Center-align, fill with placeholders, or hide section entirely? Current assumption: render center-aligned; hide when `count == 0` with empty copy.
- **Q11 — Spotlight name positioning source**: Is the layout computed server-side (`/api/kudos/spotlight` returns explicit `(x, y, size, weight)`), or client-side from a deterministic seed? Current assumption: client-side deterministic; server returns only `user_id + kudos_received_count`.

### Technical / Routing

- **Q12 — Realtime provider**: Per constitution, live ticker uses Supabase Realtime. Confirm channel name (`kudos_live`?) and payload shape `LiveKudoEvent { event_id, kudo_id, receiver_id, receiver_name, occurred_at }`.
- **Q13 — Screen URLs**: The following are predicted and not yet in SCREENFLOW. Please confirm or provide correct paths:
  - `/kudos` (this screen)
  - `/kudos/compose` (Viết Kudo)
  - `/kudos/search` (Tìm kiếm Sunner)
  - `/kudos/{id}` (View Kudo)
  - `/users/{id}` (Profile người khác)
  - `/awards` (Awards Information — currently `TBD` in SCREENFLOW)
- **Q14 — Dropdown frames (`1002:13013` hashtag, `721:5684` department, `1466:7676` gift receive, `721:5827` profile preview)**: Should each be specified as its own screen spec, or inlined into this spec? Current assumption: separate overlay specs referenced from here.
- **Q15 — Backend route convention**: Should API routes live under `src/app/api/kudos/**`, proxying Supabase via services, or should the UI call Supabase directly through a client library (e.g., RPCs)? Constitution permits both; confirm preferred pattern.
