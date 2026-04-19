# Screen: Sun* Kudos - Live board

## Screen Info

| Property           | Value                                                                    |
| ------------------ | ------------------------------------------------------------------------ |
| **Figma Frame ID** | MaZUn5xHXZ (node `2940:13431`)                                           |
| **Figma Link**     | https://momorph.ai/files/9ypp4enmFmdK3YAFJLIu6C/screens/MaZUn5xHXZ       |
| **Screen Group**   | Main Application / Sun* Kudos                                            |
| **Status**         | discovered                                                               |
| **Discovered At**  | 2026-04-19                                                               |
| **Last Updated**   | 2026-04-19                                                               |

---

## Description

The **Sun* Kudos - Live board** is the public landing page of the Kudos feature during Sun Annual Awards 2025. It surfaces four concurrent experiences on a single page:

1. **Hero / KV Kudos** — brand hero with the slogan "Hệ thống ghi nhận và cảm ơn" and the two primary CTAs `Ghi nhận` (write a kudo) and `Tìm kiếm sunner` (search people).
2. **Highlight Kudos** — a filterable carousel (by hashtag / by department) of editor-picked kudo cards with left/right nav and pagination dots.
3. **Spotlight Board** — a live "live board" showing a dynamic cluster of sunner names floating over a dark canvas with a `388 KUDOS` counter, a search-sunner input, a pan/zoom control, and a live notification ticker ("08:30PM Nguyễn Bá Chức đã nhận được một Kudos mới").
4. **All Kudos** — an infinite feed of kudo posts (sender → receiver, content, hashtags, attached images, hearts counter, copy-link button) plus a right sidebar with personal stats (kudos received / sent / hearts / secret box opened / unopened, open-gift CTA) and a "10 SUNNER nhận quà" list.

The page is the default landing when a user clicks `Sun* Kudos` from the homepage navigation or the `ABOUT KUDOS` CTA.

---

## Navigation Analysis

### Incoming Navigations (From)

| Source Screen      | Trigger                                               | Condition                |
| ------------------ | ----------------------------------------------------- | ------------------------ |
| Homepage SAA       | Click nav link "Sun* Kudos" (header)                  | User authenticated       |
| Homepage SAA       | Click CTA "ABOUT KUDOS"                               | User authenticated       |
| Homepage SAA       | Click "Chi tiết" in the Sun* Kudos homepage section   | User authenticated       |
| Awards Information | Click header nav "Sun* Kudos"                         | User authenticated       |
| Any main page      | Click header nav "Sun* Kudos"                         | User authenticated       |

### Outgoing Navigations (To)

| Target Screen                       | Trigger Element                                                     | Node ID         | Confidence | Notes                                                                  |
| ----------------------------------- | ------------------------------------------------------------------- | --------------- | ---------- | ---------------------------------------------------------------------- |
| Homepage SAA (`/`)                  | Header LOGO (`I2940:13433;178:1033`)                                | 2940:13433      | high       | Click logo returns to homepage                                         |
| Homepage SAA (`/`)                  | Header nav button "Homepage" (first button)                         | I2940:13433;186:1579 | medium | Inherited from shared Header component                                 |
| Awards Information                  | Header nav button "Awards Information"                              | I2940:13433;186:1587 | medium | Inherited from shared Header component                                 |
| Sun* Kudos (self)                   | Header nav button "Sun* Kudos" (active)                             | I2940:13433;186:1593 | high   | Current page — no-op / scroll-to-top                                   |
| Viết Kudo (compose)                 | A.1_Button ghi nhận (`Ghi nhận`)                                    | 2940:13449      | high       | Primary CTA; opens Kudo composer flow                                  |
| Tìm kiếm Sunner (search)            | Tìm kiếm sunner (`Tìm kiếm sunner`)                                 | 2940:13450      | high       | Secondary CTA in hero; opens search dialog / screen                    |
| Profile người khác                  | Click sender/receiver avatar or name inside any Kudo card           | multiple        | high       | Standard Kudo-card behavior — avatar → profile                         |
| Profile người khác                  | Click a name inside the Spotlight Board                             | 3007:17479 area | medium     | Spotlight is a floating-name cloud; clicking jumps to profile          |
| View Kudo (detail)                  | Click on a Kudo card body / "Copy link" target                      | 3127:21871+     | medium     | Each card opens a Kudo detail view; copy-link button copies deep link  |
| Gửi lời chúc Kudos (receive popup)  | D.1.8_Button mở quà (`Open gift`)                                   | 2940:13497      | medium     | Opens unopened secret box → receive-kudo popup                         |
| Dropdown-ngôn ngữ (overlay)         | Header Language button (`A1.7`)                                     | I2940:13433;186:1696 | high   | Shared header overlay                                                  |
| Notification panel (overlay)        | Header Bell button (`A1.6`)                                         | I2940:13433;186:2101 | high   | Shared header overlay                                                  |
| Quick action menu (overlay)         | Header Widget button                                                | I2940:13433;186:1597 | medium | Shared header overlay                                                  |
| Hashtag filter dropdown (overlay)   | B.1.1_ButtonHashtag                                                 | 2940:13459      | high       | Opens a dropdown to select hashtag for Highlight Kudos filter          |
| Department filter dropdown (overlay)| B.1.2_Button Phong ban                                              | 2940:13460      | high       | Opens a dropdown to select department for Highlight Kudos filter       |

### Navigation Rules

- **Back behavior**: Browser back from anywhere opened from this page returns here.
- **Deep link support**: Yes — `/kudos` is the base path; `/kudos#highlight`, `/kudos#spotlight`, `/kudos#all` for section anchors; `/kudos/{id}` for a single Kudo deep link (via Copy link).
- **Auth required**: Yes — this is a protected route; unauthenticated users are redirected to `/auth/login`.

---

## Component Schema

### Layout Structure

```
┌──────────────────────────────────────────────────────────────────────────┐
│  Keyvisual background (full-bleed, shared with Homepage)                 │
│ ┌──────────────────────────────────────────────────────────────────────┐ │
│ │ HEADER  [Logo]  [Nav: Home / Awards / Sun* Kudos]   [Lang][Bell][▸]  │ │
│ └──────────────────────────────────────────────────────────────────────┘ │
│                                                                          │
│  A_KV Kudos  ─────────────────                                           │
│    "Hệ thống ghi nhận và cảm ơn"                                         │
│    [ KUDOS logo ]                                                        │
│    [ Ghi nhận ] [ Tìm kiếm sunner ]                                      │
│                                                                          │
│  B_Highlight ────────────────────────────────────────────────────────────│
│    Sun* Annual Awards 2025                                               │
│    HIGHLIGHT KUDOS     [Hashtag ▾] [Phong ban ▾]                         │
│    ◀  [KUDO card] [KUDO card] [KUDO card]  ▶                             │
│                     ● ● ○                                                │
│                                                                          │
│  B.7_Spotlight ──────────────────────────────────────────────────────────│
│    Sun* Annual Awards 2025                                               │
│    SPOTLIGHT BOARD                                                       │
│    ┌────────────────────────────────────────────────────────────────┐    │
│    │ 388 KUDOS       [🔍 Tìm kiếm sunner]           [+] [−] [⤢]     │    │
│    │                                                                │    │
│    │     nameA   nameB   nameC   nameD   ...                        │    │
│    │       nameE   nameF   nameG                                    │    │
│    │   "08:30PM Nguyễn Bá Chức đã nhận được một Kudos mới"           │    │
│    └────────────────────────────────────────────────────────────────┘    │
│                                                                          │
│  C_All kudos ────────────────────────────────────────────────────────────│
│    Sun* Annual Awards 2025                                               │
│    ALL KUDOS                                                             │
│    ┌───────────────────────────────────┐  ┌───────────────────────────┐  │
│    │ Kudo post                         │  │ D.1 Stats                 │  │
│    │  [Sender] →sent→ [Receiver]        │  │ - Kudos nhận: 25          │  │
│    │  time · hashtag · content          │  │ - Kudos gửi:  25          │  │
│    │  [img][img][img][img][img]         │  │ - Hearts: 25  x2          │  │
│    │  #Dedicated #Inspring ...          │  │ - Secret box mở: 25       │  │
│    │  [♥ 1.000] [🔗 Copy link]           │  │ - Secret box chưa mở: 25  │  │
│    ├───────────────────────────────────┤  │ [ Mở quà ]                │  │
│    │ Kudo post …                       │  │                           │  │
│    └───────────────────────────────────┘  │ D.3 10 SUNNER nhận quà    │  │
│         …pagination / infinite scroll…   │  - Name · "Nhận 1 áo…"     │  │
│                                          │  - …                       │  │
│                                          └───────────────────────────┘   │
│                                                                          │
│ ┌──────────────────────────────────────────────────────────────────────┐ │
│ │ FOOTER  [Logo]   [nav links]      Bản quyền thuộc về Sun* © 2025     │ │
│ └──────────────────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────────────────┘
```

### Component Hierarchy

```
SunKudosLiveBoardPage (Template)
├── KeyvisualBackground (Atom)            — 2940:13432
├── Header (Organism, shared)             — 2940:13433
│   ├── Logo
│   ├── NavLinks (Home / Awards / Kudos)
│   ├── LanguageButton
│   ├── NotificationButton (+ badge dot)
│   └── WidgetButton
├── KudosHero (Organism)                  — 2940:13434 > 2940:13435 > 2940:13436 (A_KV Kudos 2940:13437)
│   ├── HeroSlogan (Atom)                 — "Hệ thống ghi nhận và cảm ơn"
│   ├── KudosLogo (Atom)                  — 2940:13440
│   └── HeroCTAs (Molecule)               — 2940:13448
│       ├── ButtonGhiNhan (Atom)          — 2940:13449
│       └── ButtonTimKiemSunner (Atom)    — 2940:13450
├── HighlightKudosSection (Organism)      — 2940:13451
│   ├── SectionHeader (Molecule)          — 2940:13452
│   │   ├── EventTitle (Atom)             — "Sun* Annual Awards 2025"
│   │   ├── SectionTitle (Atom)           — "HIGHLIGHT KUDOS"
│   │   └── FilterButtons (Molecule)      — 2940:13458
│   │       ├── HashtagDropdown (Atom)    — 2940:13459
│   │       └── DepartmentDropdown (Atom) — 2940:13460
│   ├── HighlightCarousel (Organism)      — 2940:13461
│   │   ├── KudoHighlightCard (Molecule) ×N — KUDO - Highlight / B.3_KUDO - Highlight
│   │   ├── CarouselPrev (Atom)           — 2940:13470 (B.2.1)
│   │   └── CarouselNext (Atom)           — 2940:13468 (B.2.2)
│   └── SliderDots (Molecule)             — 2940:13471 (B.5_slide)
├── SpotlightBoardSection (Organism)      — 2940:14170
│   ├── SectionHeader (Molecule)          — 2940:13476
│   │   └── SectionTitle (Atom)           — "SPOTLIGHT BOARD"
│   └── SpotlightCanvas (Organism)        — 2940:14174 (B.7_Spotlight)
│       ├── KudosCounter (Atom)           — 3007:17482 ("388 KUDOS")
│       ├── SunnerSearchInput (Molecule)  — 2940:14833 (B.7.3)
│       ├── PanZoomControls (Molecule)    — 3007:17479 (B.7.2)
│       ├── FloatingNameCloud (Organism)  — collection of TEXT nodes (sunner names)
│       └── LiveKudoTicker (Molecule)     — 3004:15995..15999 + 2940:14230
├── AllKudosSection (Organism)            — 2940:13475
│   ├── SectionHeader (Molecule)          — 2940:14221
│   │   └── SectionTitle (Atom)           — "ALL KUDOS"
│   ├── KudoFeed (Organism)               — 2940:13482
│   │   └── KudoPostCard (Molecule) ×N    — 3127:21871 (C.3), 3127:22053 (C.5), 3127:22375 (C.6), 3127:22439 (C.7)
│   │       ├── KudoSender (Molecule)     — C.3.1
│   │       ├── SendIcon (Atom)           — C.3.2
│   │       ├── KudoReceiver (Molecule)   — C.3.3
│   │       ├── KudoTime (Atom)           — C.3.4
│   │       ├── KudoHashtagBadge (Molecule)  — D.4_hashtag
│   │       ├── KudoContent (Atom)        — C.3.5
│   │       ├── KudoImagesGrid (Molecule) — C.3.6 (≤5 images)
│   │       ├── KudoHashtags (Atom)       — C.3.7
│   │       ├── CopyLinkButton (Atom)     — C.4.2
│   │       └── HeartsCounter (Molecule)  — C.4.1
│   └── UserStatsSidebar (Organism)       — 2940:13488 (D_Thống menu phải)
│       ├── StatsPanel (Molecule)         — 2940:13489 (D.1)
│       │   ├── KudosReceived (Atom)      — 2940:13491 (D.1.2)
│       │   ├── KudosSent (Atom)          — 2940:13492 (D.1.3)
│       │   ├── HeartsReceived (Atom)     — 3241:14882 (D.1.4, with x2 multiplier)
│       │   ├── SecretBoxOpened (Atom)    — 2940:13495 (D.1.6)
│       │   ├── SecretBoxUnopened (Atom)  — 2940:13496 (D.1.7)
│       │   └── OpenGiftButton (Atom)     — 2940:13497 (D.1.8)
│       └── TopGiftRecipients (Molecule)  — 2940:13510 (D.3 "10 SUNNER nhận quà")
│           └── SunnerGiftRow (Atom) ×10  — D.3.2..D.3.6
└── Footer (Organism, shared)             — 2940:13522
    ├── Logo
    ├── NavLinks
    └── Copyright                         — "Bản quyền thuộc về Sun* © 2025"
```

### Main Components

| Component                | Type     | Node ID       | Description                                                                    | Reusable |
| ------------------------ | -------- | ------------- | ------------------------------------------------------------------------------ | -------- |
| Header                   | Organism | 2940:13433    | Top nav shared with Homepage / Awards Information                              | Yes      |
| KudosHero                | Organism | 2940:13436    | Hero block with slogan, Kudos logo, two CTAs                                   | No       |
| ButtonGhiNhan            | Atom     | 2940:13449    | Primary CTA to open Kudo composer                                              | No       |
| ButtonTimKiemSunner      | Atom     | 2940:13450    | Secondary CTA to open sunner search                                            | No       |
| HighlightCarousel        | Organism | 2940:13461    | Horizontal carousel of highlight Kudo cards with prev/next + dots              | No       |
| KudoHighlightCard        | Molecule | 2940:13464/65 | Dark-theme large Kudo card (sender, receiver, content, hashtags, hearts)      | Yes (card variant) |
| FilterButton (Hashtag)   | Atom     | 2940:13459    | Dropdown filter for highlight Kudos                                            | Yes (pattern) |
| FilterButton (Department)| Atom     | 2940:13460    | Dropdown filter for highlight Kudos                                            | Yes (pattern) |
| SpotlightCanvas          | Organism | 2940:14174    | Interactive live board: counter, search, floating names, live ticker, pan/zoom | No       |
| SunnerSearchInput        | Molecule | 2940:14833    | Search input on spotlight canvas                                               | Yes      |
| PanZoomControls          | Molecule | 3007:17479    | +/- and fit-to-screen for the canvas                                           | Yes      |
| KudoPostCard             | Molecule | 3127:21871    | Light-theme Kudo post card in the feed with images, hearts, copy-link          | Yes      |
| UserStatsSidebar         | Organism | 2940:13488    | Personal stats + gift recipients list                                          | No       |
| OpenGiftButton           | Atom     | 2940:13497    | CTA to open a secret-box / gift                                                | No       |
| Footer                   | Organism | 2940:13522    | Shared footer with logo + nav + copyright                                      | Yes      |

---

## Form Fields

| Field              | Type         | Required | Validation                 | Placeholder              |
| ------------------ | ------------ | -------- | -------------------------- | ------------------------ |
| spotlightSearch    | text         | No       | Trim; min 1 char to search | "Tìm kiếm sunner"        |
| hashtagFilter      | select (one) | No       | Must exist in hashtag list | "Hashtag"                |
| departmentFilter   | select (one) | No       | Must exist in dept list    | "Phong ban"              |

(No submit form on this page — `Ghi nhận` navigates to a composer screen which has its own spec.)

---

## API Mapping

### On Screen Load

| API                         | Method | Purpose                                                                | Response Usage                              |
| --------------------------- | ------ | ---------------------------------------------------------------------- | ------------------------------------------- |
| `/api/users/me`             | GET    | Current user profile (for stats scope)                                 | Stats sidebar header                        |
| `/api/kudos/highlights`     | GET    | List of curated highlight kudos (supports `?hashtag=&department=`)     | HighlightCarousel cards                     |
| `/api/kudos/hashtags`       | GET    | Hashtag options for the filter dropdown                                | HashtagDropdown options                     |
| `/api/departments`          | GET    | Department options for the filter dropdown                             | DepartmentDropdown options                  |
| `/api/kudos/spotlight`      | GET    | Aggregate data for spotlight canvas: total count + all receiver names  | `388 KUDOS` counter + FloatingNameCloud     |
| `/api/kudos/spotlight/live` | WS/SSE | Live stream: new kudos events for the ticker                           | LiveKudoTicker ("08:30PM … Kudos mới")      |
| `/api/kudos`                | GET    | Paginated kudo feed (e.g. `?page=&limit=&sort=recent`)                 | AllKudosSection feed                        |
| `/api/users/me/stats`       | GET    | Personal stats: kudos received, sent, hearts (x2), secret boxes        | StatsPanel                                  |
| `/api/gifts/top-recipients` | GET    | Top 10 sunners who recently received gifts                             | TopGiftRecipients list                      |

### On User Action

| Action                                | API                                | Method | Request                                     | Response                                  |
| ------------------------------------- | ---------------------------------- | ------ | ------------------------------------------- | ----------------------------------------- |
| Click "Ghi nhận"                      | —                                  | —      | Navigation to `/kudos/compose`              | —                                         |
| Click "Tìm kiếm sunner"               | —                                  | —      | Opens search dialog or `/kudos/search`      | —                                         |
| Select Hashtag filter                 | `/api/kudos/highlights`            | GET    | `?hashtag=<slug>`                           | Filtered cards                            |
| Select Department filter              | `/api/kudos/highlights`            | GET    | `?department=<id>`                          | Filtered cards                            |
| Type in spotlight search              | `/api/kudos/spotlight/search`      | GET    | `?q=<term>`                                 | Highlights matching sunners in the canvas |
| Click name in spotlight               | —                                  | —      | Navigation to `/users/{id}` (Profile người khác) | —                                     |
| Click ♥ on a Kudo                     | `/api/kudos/{id}/hearts`           | POST   | `{}`                                        | `{ hearts: number, likedByMe: boolean }`  |
| Click Copy link                       | —                                  | —      | Writes `window.location/kudos/{id}` to clipboard | Toast "Đã sao chép"                  |
| Click "Mở quà" (D.1.8)                | `/api/gifts/open`                  | POST   | `{ secretBoxId }`                           | Redirects to "Gửi lời chúc Kudos" popup   |
| Scroll to bottom of feed              | `/api/kudos`                       | GET    | `?page=n+1`                                 | Appends posts                             |
| Click Kudo card sender/receiver       | —                                  | —      | Navigation to `/users/{id}`                 | —                                         |

### Error Handling

| Error Code | Message                         | UI Action                                                        |
| ---------- | ------------------------------- | ---------------------------------------------------------------- |
| 401        | Unauthorized                    | Redirect to `/auth/login`                                        |
| 403        | Event not running / no access   | Show 403 page                                                    |
| 404        | Kudo / gift not found           | Inline error in section, keep rest of page usable                |
| 429        | Heart rate-limited              | Toast "Bạn đã vote quá nhanh, thử lại sau"                       |
| 500        | Server error                    | Section-level skeleton → retry button; keep other sections alive |
| WS/SSE drop| Live stream disconnected        | Silent reconnect w/ exponential backoff; hide ticker while down  |

---

## State Management

### Local State

| State                    | Type                       | Initial       | Purpose                                                       |
| ------------------------ | -------------------------- | ------------- | ------------------------------------------------------------- |
| highlightFilter          | `{ hashtag, department }`  | `{ }`         | Selected filter for HighlightCarousel                         |
| highlightIndex           | number                     | `0`           | Current slide index in HighlightCarousel                      |
| spotlightQuery           | string                     | `""`          | Text typed in spotlight search                                |
| spotlightZoom            | number                     | `1`           | Pan/zoom scale of SpotlightCanvas                             |
| spotlightPan             | `{ x, y }`                 | `{ 0, 0 }`    | Pan translation                                               |
| feedPage                 | number                     | `1`           | Current page for AllKudos feed                                |
| feedItems                | `KudoPost[]`               | `[]`          | Loaded items                                                  |
| likedKudoIds             | `Set<string>`              | `∅`           | Local optimistic likes                                        |
| openGiftLoading          | boolean                    | `false`       | Open-gift button loading state                                |

### Global State

| State            | Store         | Read/Write | Purpose                                       |
| ---------------- | ------------- | ---------- | --------------------------------------------- |
| currentUser      | authStore     | Read       | Auth guard + personal stats scope             |
| language         | i18nStore     | Read       | Language-aware copy (VN/EN)                   |
| unreadGiftCount  | giftStore     | Read/Write | Mirrors D.1.7 `Số secret box chưa mở`         |
| notificationBadge| notifStore    | Read       | Shared header bell badge                      |

### Server State / Cache

- React Query (or equivalent) keys:
  - `["kudos-highlights", filter]`
  - `["kudos-hashtags"]`
  - `["departments"]`
  - `["kudos-spotlight", query]`
  - `["kudos-feed", { page, sort }]`
  - `["user-stats"]`
  - `["gifts-top-recipients"]`
- Live stream (`/api/kudos/spotlight/live`) via WebSocket or SSE — events pushed into the ticker queue (last N events).

---

## UI States

### Loading State
- Skeleton cards for HighlightCarousel (3 placeholders).
- Spinner over SpotlightCanvas until counter + name list are ready.
- Skeleton for each Kudo post in AllKudos feed.
- Skeleton numbers (`—`) for StatsPanel counters.

### Error State
- Per-section inline error with `Thử lại` button; other sections continue.
- WebSocket drop: hide live ticker, retain cached spotlight layout.

### Success State
- Hearts animation on click.
- Toast "Đã sao chép liên kết" on Copy link.
- Inline pulse on new spotlight ticker entry.

### Empty State
- HighlightKudos empty: "Chưa có Kudo nào nổi bật".
- AllKudos empty: "Chưa có Kudo nào — hãy là người đầu tiên gửi lời cảm ơn".
- TopGiftRecipients empty: hide section.
- SecretBoxUnopened == 0: disable `Mở quà` button with tooltip "Bạn chưa có hộp quà nào".

---

## Accessibility

| Requirement          | Implementation                                                           |
| -------------------- | ------------------------------------------------------------------------ |
| Focus management     | Tab order: Header → CTAs → Filters → Carousel → Spotlight search → Feed posts → Sidebar → Footer |
| Keyboard navigation  | Carousel: arrow keys; Spotlight pan: arrow keys; zoom: `+` / `-`          |
| Screen reader        | `aria-live="polite"` on LiveKudoTicker; `aria-label` on all icon buttons |
| Color contrast       | Dark sections (Highlight, Spotlight) checked for WCAG AA on light text   |
| Motion               | Respect `prefers-reduced-motion` — disable auto-scroll carousel & ticker animation |

---

## Responsive Behavior

| Breakpoint        | Layout Changes                                                                 |
| ----------------- | ------------------------------------------------------------------------------ |
| Mobile (<768px)   | All sections full-width stacked; sidebar collapses below feed; spotlight downscaled, pan/zoom remains |
| Tablet (768-1024) | Feed remains full-width; sidebar stacks below feed                             |
| Desktop (>1024)   | Two-column layout for All Kudos (feed + sidebar). Spotlight full-width         |

---

## Analytics Events (Optional)

| Event                     | Trigger                                 | Properties                                      |
| ------------------------- | --------------------------------------- | ----------------------------------------------- |
| screen_view               | On mount                                | `{ screen: "sun_kudos_live_board" }`            |
| hero_cta_click            | Click Ghi nhận / Tìm kiếm sunner        | `{ cta: "ghi_nhan" \| "tim_kiem_sunner" }`      |
| highlight_filter_change   | Hashtag/Department filter change        | `{ filter_type, value }`                        |
| highlight_slide_change    | Carousel next/prev/dot                  | `{ from, to }`                                  |
| spotlight_search          | Type/debounced                          | `{ query_length }`                              |
| spotlight_name_click      | Click floating name                     | `{ user_id }`                                   |
| kudo_heart                | Click heart                             | `{ kudo_id, liked: bool }`                      |
| kudo_copy_link            | Click copy link                         | `{ kudo_id }`                                   |
| gift_open                 | Click Mở quà                            | `{ gift_id }`                                   |

---

## Implementation Notes

### Dependencies
- Data fetching: `@tanstack/react-query` (or SWR).
- Live updates: native `WebSocket` or SSE via `EventSource`.
- Carousel: `embla-carousel-react` (lightweight, supports keyboard + dots).
- Pan/zoom canvas: `react-zoom-pan-pinch` or custom transform + hammerjs.
- Virtualized feed: `@tanstack/react-virtual` once list exceeds 30 items.
- i18n: existing project dictionary system (VN default, EN supported) — all copy above must go through `t()`.

### Special Considerations
- **Two Kudo-card variants** exist — a **dark highlight card** (Highlight section) and a **light feed card** (All Kudos). Keep them as sibling variants of a shared `KudoCard` molecule to stay consistent.
- **Spotlight floating-name layout** — must be deterministic (seeded) so identical screens render identically across clients; compute positions on the client using a hash of user ID + `kudos_count`.
- **Live ticker** must de-duplicate events if the page refetches + receives a WS replay.
- **Heart count** should be optimistic with server reconciliation; server must support `POST /kudos/{id}/hearts` being idempotent per user.
- **Gift flow** — `Mở quà` POSTs to `/api/gifts/open` and on success navigates to the "Gửi lời chúc Kudos" receive-popup screen (separate spec).

---

## Analysis Metadata

| Property             | Value                                                   |
| -------------------- | ------------------------------------------------------- |
| Analyzed By          | Screen Flow Discovery                                   |
| Analysis Date        | 2026-04-19                                              |
| Needs Deep Analysis  | Yes (design tokens + validation captured in spec.md)    |
| Confidence Score     | High                                                    |

### Next Steps
- [x] Frame image saved to `.momorph/specs/MaZUn5xHXZ-sun-kudos-live-board/assets/frame.png`
- [ ] Run `list_frame_design_items` + `list_frame_styles` (done as part of `momorph.specify`)
- [ ] Discover `Viết Kudo`, `View Kudo`, `Gửi lời chúc Kudos`, `Profile người khác` (link targets)
- [ ] Confirm API shape with backend team
- [ ] Define hashtag + department taxonomies
