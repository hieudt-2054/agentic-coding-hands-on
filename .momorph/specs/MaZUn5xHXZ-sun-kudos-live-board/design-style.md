# Design Style: Sun* Kudos - Live Board

**Frame ID**: `MaZUn5xHXZ` (figma node `2940:13431`)
**Frame Name**: `Sun* Kudos - Live board`
**Figma Link**: https://momorph.ai/files/9ypp4enmFmdK3YAFJLIu6C/screens/MaZUn5xHXZ
**Extracted At**: 2026-04-20
**Visual reference**: `assets/frame.png`

---

## Design Tokens

### Colors

Extracted directly from Figma `list_frame_styles`. The design system uses a **dark base + gold accent** theme named `Details-*`.

| Token Name                           | Hex / RGBA                             | Opacity | Usage                                                                              |
| ------------------------------------ | -------------------------------------- | ------- | ---------------------------------------------------------------------------------- |
| `--color-page`                       | `#00101A`                              | 100%    | Page background, carousel fade gradient stops (`--Details-Background`)              |
| `--color-panel`                      | `#00070C`                              | 100%    | Dark panels (D.1 stats, D.3 leaderboard) (`--Details-Container-2`)                  |
| `--color-header-bg`                  | `rgba(16, 20, 23, 0.80)`               | 80%     | Header bar translucent backdrop                                                    |
| `--color-border-gold`                | `#998C5F`                              | 100%    | Primary border on pill buttons, filter buttons, spotlight frame (`--Details-Border`) |
| `--color-text-primary-gold`          | `#FFEA9E`                              | 100%    | "HIGHLIGHT KUDOS" / "ALL KUDOS" large titles, yellow accents (`--Details-Text-Primary-1`) |
| `--color-secondary-button`           | `rgba(255, 234, 158, 0.10)`            | 10%     | Translucent yellow fill on secondary pill + filter buttons (`--Details-SecondaryButton-Normal`) |
| `--color-secondary-button-hover`     | `rgba(255, 234, 158, 0.40)`            | 40%     | Hover state of secondary buttons (`--Details-ButtonSecondary-Hover`, approx.)       |
| `--color-primary-button`             | `#FFEA9E`                              | 100%    | "Mở quà" CTA background, Highlight card active border                              |
| `--color-card-cream`                 | `#FFF8E1`                              | 100%    | Highlight card + All-Kudos feed card fill (`--Details-PrimaryButton-Hover` in Figma; renamed for clarity — this token names the *surface* colour used by the cream cards, not a button state) |
| `--color-primary-button-hover`       | `#FFF3C6`                              | 100%    | Hover state of "Mở quà" primary button (slightly lighter cream)                     |
| `--color-primary-button-active`      | `#FAE287`                              | 100%    | Active/pressed state of "Mở quà" primary button                                     |
| `--color-text-button`                | `rgba(255, 243, 198, 1)` = `#FFF3C6`   | 100%    | Text buttons (nav links)                                                           |
| `--color-text-on-light`              | `#00101A`                              | 100%    | Text color atop cream / gold surfaces                                              |
| `--color-text-white`                 | `#FFFFFF`                              | 100%    | Body text on dark surfaces                                                         |
| `--color-text-secondary-1`           | `rgba(219, 209, 193, 1)` = `#DBD1C1`   | 100%    | Muted warm gray-cream on dark bg                                                   |
| `--color-text-secondary-2`           | `rgba(46, 57, 64, 1)`   = `#2E3940`    | 100%    | Muted body text on light cards                                                     |
| `--color-divider`                    | `#2E3940`                              | 100%    | Footer border-top, D.1 horizontal separator                                        |
| `--color-muted`                      | `rgba(153, 153, 153, 1)` = `#999999`   | 100%    | Heart icon inactive / secondary icons                                              |
| `--color-heart-active`               | `rgba(212, 39, 29, 1)`  = `#D4271D`    | 100%    | Active heart red                                                                   |
| `--color-heart-accent`               | `rgba(241, 118, 118, 1)` = `#F17676`   | 100%    | Heart hover / secondary red                                                        |
| `--color-cover-gradient-start`       | `#00101A`                              | 100%    | Bottom of keyvisual cover gradient (25° / 14.74% stop)                             |
| `--color-cover-gradient-end`         | `rgba(0, 19, 32, 0.00)`                | 0%      | Top of keyvisual cover gradient (47.8% stop)                                       |

### Typography

| Token Name              | Font Family         | Size     | Weight | Line Height | Letter Spacing | Usage                                                        |
| ----------------------- | ------------------- | -------- | ------ | ----------- | -------------- | ------------------------------------------------------------ |
| `--text-display-hero`   | Montserrat          | `57px`   | `700`  | `64px`      | `-0.25px`      | Section titles: "HIGHLIGHT KUDOS", "ALL KUDOS" (gold)        |
| `--text-display-sub`    | Montserrat          | `36px`   | `700`  | `44px`      | `0`            | "388 KUDOS" spotlight counter                                |
| `--text-h1`             | Montserrat          | `32px`   | `700`  | `40px`      | `0`            | Big numeric stats (Highlight Số)                             |
| `--text-h2`             | Montserrat          | `24px`   | `700`  | `32px`      | `0`            | Section subtitle "Sun* Annual Awards 2025"                   |
| `--text-h3`             | Montserrat          | `22px`   | `700`  | `28px`      | `0`            | Stat labels (Số Kudos bạn nhận được) + "Mở quà" button text  |
| `--text-body-lg`        | Montserrat          | `20px`   | `700`  | `28px`      | `0`            | Sunner name in cards                                         |
| `--text-body`           | Montserrat          | `16px`   | `700`  | `24px`      | `0.15px`       | Primary button / nav text, card body metadata                |
| `--text-body-sm`        | Montserrat          | `14px`   | `500`  | `20px`      | `0`            | Captions, timestamps, hashtags, recipient gift description    |
| `--text-caption`        | Montserrat          | `12px`   | `500`  | `16px`      | `0.01em`       | Spotlight search placeholder, small helper text               |
| `--text-brand-kudos`    | Montserrat Alternates | `140px` | `700` | `1`         | `0`            | "KUDOS" brand wordmark (decorative; scales responsively)      |
| `--text-footer`         | SVN-Gotham          | `14px`   | `400`  | `20px`      | `0`            | Footer copyright                                             |

Fonts present in Figma: `Montserrat`, `Montserrat Alternates`, `SVN-Gotham`. Load Montserrat via Google Fonts; Montserrat Alternates for brand wordmark; SVN-Gotham via local webfont if licensed.

### Spacing

Derived from Figma `gap` / `padding` / column deltas.

| Token Name         | Value    | Usage                                                           |
| ------------------ | -------- | --------------------------------------------------------------- |
| `--spacing-2xs`    | `4px`    | Gap inside filter buttons (icon+label)                          |
| `--spacing-xs`     | `8px`    | Small row gaps (stats row gap)                                  |
| `--spacing-sm`     | `16px`   | Card internal gap / padding increments                          |
| `--spacing-md`     | `24px`   | D.1 / D.3 panel padding; card vertical gap                      |
| `--spacing-lg`     | `32px`   | Footer vertical padding                                         |
| `--spacing-xl`     | `40px`   | Section gaps (C_All kudos), Footer horizontal padding           |
| `--spacing-2xl`    | `48px`   | Hero-to-highlight top spacing                                   |
| `--spacing-page-x` | `144px`  | Desktop horizontal gutter (Header, Highlight header, footers)   |
| `--spacing-header` | `80px`   | Header total height                                             |

### Border & Radius

| Token Name          | Value        | Usage                                                          |
| ------------------- | ------------ | -------------------------------------------------------------- |
| `--radius-xs`       | `4px`        | Filter buttons `B.1.1`, `B.1.2`                                |
| `--radius-sm`       | `8px`        | "Mở quà" button `D.1.8`                                        |
| `--radius-md`       | `16px`       | Highlight card `B.3`                                           |
| `--radius-lg`       | `17px`       | Dark panels `D.1`, `D.3`                                       |
| `--radius-xl`       | `24px`       | All-Kudos post card `C.3/5/6/7`                                |
| `--radius-2xl`      | `47.14px`    | Spotlight canvas `B.7`                                          |
| `--radius-pill`     | `68px`       | Hero pill CTAs `A.1`, `Tìm kiếm sunner` (2940:13450)           |
| `--radius-pill-sm`  | `46.404px`   | Spotlight search input `B.7.3`                                  |
| `--radius-full`     | `9999px`     | Avatars                                                        |
| `--border-width`    | `1px`        | Default border (pill CTAs, filter buttons, Spotlight frame)    |
| `--border-width-active` | `4px`    | Highlight card active border (`B.3`)                           |

### Shadows / Effects

No explicit drop shadows extracted from the frame (dark theme relies on borders). When elevating overlay menus (dropdowns, tooltips) apply:

| Token Name      | Value                            | Usage                                             |
| --------------- | -------------------------------- | ------------------------------------------------- |
| `--shadow-sm`   | `0 2px 4px rgba(0,0,0,0.15)`     | Subtle card hover elevation                       |
| `--shadow-md`   | `0 4px 12px rgba(0,0,0,0.25)`    | Dropdowns, tooltips                               |
| `--shadow-lg`   | `0 8px 24px rgba(0,0,0,0.35)`    | Active highlight card / feed card hover lift      |
| `--shadow-xl`   | `0 16px 40px rgba(0,0,0,0.50)`   | Modals, profile preview, image lightbox backdrop  |

### Keyvisual gradients (reference)

- Cover: `linear-gradient(25deg, #00101A 14.74%, rgba(0,19,32,0.00) 47.8%)`
- Highlight carousel side fades:
  - Left: `linear-gradient(90deg, #00101A 50%, rgba(255,255,255,0) 100%)`
  - Right: `linear-gradient(270deg, #00101A 50%, rgba(255,255,255,0) 100%)`

---

## Layout Specifications

### Container

| Property           | Value     | Notes                                                            |
| ------------------ | --------- | ---------------------------------------------------------------- |
| Frame total width  | `1440px`  | Desktop canvas                                                   |
| Frame total height | `5862px`  | Full-page scroll                                                 |
| Content max-width  | `1152px`  | Inner content area (matches A_KV Kudos, B.1 header)              |
| Horizontal padding | `144px`   | Left & right (applies to Header, B.1, C.1 sections)              |
| Background color   | `#00101A` | Page-wide                                                        |

### Section dimensions

| Section            | Node       | Width     | Height    | Notes                                                                 |
| ------------------ | ---------- | --------- | --------- | --------------------------------------------------------------------- |
| Keyvisual          | 2940:13432 | `1440px`  | `512px`   | Absolute; holds decorative background + dark cover gradient           |
| Header             | 2940:13433 | `1440px`  | `80px`    | Flex row, space-between, padding `12px 144px`                         |
| A_KV Kudos hero    | 2940:13437 | `1152px`  | `160px`   | Flex column, gap `10px`                                               |
| A.1 Ghi nhận pill  | 2940:13449 | `738px`   | `72px`    | Flex row, padding `24px 16px`, radius `68px`                          |
| Tìm kiếm sunner    | 2940:13450 | `381px`   | `72px`    | Same style as A.1                                                     |
| B.1 header block   | 2940:13452 | `1440px`  | `129px`   | Padding `0 144px`, flex column gap `40px`                             |
| B.2 Highlight row  | 2940:13461 | `1440px`  | `525px`   | Absolute; carousel                                                    |
| Highlight card     | 2940:13465 | `528px`   | auto      | Padding `24px 24px 16px 24px`, gap `16px`, radius `16px`, 4px border  |
| B.5 pagination     | 2940:13471 | `1440px`  | `52px`    | Centered row                                                          |
| B.7 Spotlight      | 2940:14174 | `1157px`  | `548px`   | 1px border, radius `47.14px`                                          |
| Spotlight search   | 2940:14833 | `219px`   | `39px`    | Inside B.7                                                            |
| C.1 All Kudos hdr  | 2940:14221 | `1440px`  | `129px`   | Padding `0 144px`, flex column gap `16px`                             |
| C.2 Feed column    | 2940:13482 | `680px`   | `3068px`  | Flex column gap `24px`                                                |
| C.3 Kudo post card | 3127:21871 | `680px`   | `749px`   | Radius `24px`, padding `40px 40px 16px 40px`, background `#FFF8E1`    |
| D_Sidebar          | 2940:13488 | `422px`   | `933px`   | Flex column gap `24px`                                                |
| D.1 Stats panel    | 2940:13489 | `422px`   | auto      | Padding `24px`, radius `17px`, bg `#00070C`, 1px border gold          |
| D.1.8 Open gift    | 2940:13497 | `374px`   | `60px`    | Padding `16px`, radius `8px`, bg `#FFEA9E`, text-on-light             |
| D.3 Top recipients | 2940:13510 | `422px`   | auto      | Padding `24px 16px 24px 24px`, radius `17px`, bg `#00070C`            |
| Footer             | 2940:13522 | `1440px`  | auto      | Padding `40px 90px`, border-top `1px solid #2E3940`                   |

### Layout Structure (ASCII)

```
┌────────────────────────────────────────────────────────────────────────────┐
│  KEYVISUAL  (1440 × 512, abs, behind)                                      │
│ ┌────────────────────────────────────────────────────────────────────────┐ │
│ │ HEADER  1440×80, padding 12×144, bg rgba(16,20,23,.8)                  │ │
│ │  [Logo]  [Home · Awards · Sun*Kudos]          [Lang][Bell*][Widget]    │ │
│ └────────────────────────────────────────────────────────────────────────┘ │
│                                                                            │
│  A_KV Kudos (1152×160, flex col gap 10)                                    │
│     "Hệ thống ghi nhận và cảm ơn"    (Montserrat 57/700, #FFEA9E)          │
│     [ MM_MEDIA_Kudos logo ]                                                │
│     ┌─────── A.1 Ghi nhận (738×72, pill 68, border gold 1px) ──────────┐   │
│     │  🖊  Hôm nay, bạn muốn gửi lời cảm ơn…                           │   │
│     └──────────────────────────────────────────────────────────────────┘   │
│     ┌── Tìm kiếm sunner (381×72, pill 68) ─────┐                          │
│     │  🔍  Tìm kiếm sunner                      │                          │
│     └───────────────────────────────────────────┘                          │
│                                                                            │
│  B.1 Highlight header (1440×129, padding 0×144, gap 40)                    │
│     Sun* Annual Awards 2025  (24/700 white)                                │
│     ───  accent bar                                                        │
│     HIGHLIGHT KUDOS  (57/700 #FFEA9E)   [Hashtag ▾] [Phong ban ▾] (r 4)    │
│                                                                            │
│  B.2 Carousel row (1440×525)                                                │
│     ◀  [dim card]  [ACTIVE card 528 wide]  [dim card]  ▶                   │
│         (active = cream #FFF8E1, 4px gold border, radius 16)               │
│  B.5 Pagination (1440×52)   ◀   2/5   ▶                                     │
│                                                                            │
│  B.6 Spotlight header (1440×129)                                            │
│     Sun* Annual Awards 2025                                                │
│     SPOTLIGHT BOARD                                                        │
│                                                                            │
│  B.7 Spotlight canvas (1157×548, border gold 1px, radius 47.14)            │
│     ┌────────────────────────────────────────────────────────────────┐    │
│     │ 388 KUDOS   🔍 [Tìm kiếm     ] (219×39, pill 46.4)   [+][−][⤢] │    │
│     │                                                                │    │
│     │    ·nameA·  ·nameB·  ·nameC·   ·nameD·   ·nameE·               │    │
│     │         ·nameF·  ·nameG·    ·nameH·                            │    │
│     │     ·nameI·    ·nameJ·   ·nameK·                               │    │
│     │                                                                │    │
│     │  08:30PM Nguyễn Bá Chức đã nhận được một Kudos mới             │    │
│     └────────────────────────────────────────────────────────────────┘    │
│                                                                            │
│  C.1 All Kudos header  (1440×129)                                           │
│     Sun* Annual Awards 2025                                                │
│     ALL KUDOS (#FFEA9E)                                                    │
│                                                                            │
│  Two-column area (desktop)                                                 │
│  ┌───────────────────────────────────┐  ┌──────────────────────────────┐   │
│  │ C.2 Feed (680 wide, gap 24)       │  │ D (422 wide, gap 24)         │   │
│  │ ┌───── C.3 KudoPost (680×749) ──┐ │  │ ┌── D.1 Stats (r 17) ────┐   │   │
│  │ │ [Sender] →sent→ [Receiver]    │ │  │ │  Số Kudos nhận: 25      │   │   │
│  │ │ time · hashtag · content      │ │  │ │  Số Kudos gửi:  25      │   │   │
│  │ │ [img×5]                       │ │  │ │  Số tim:        25  x2  │   │   │
│  │ │ #Dedicated #Inspring…         │ │  │ │  ──────                 │   │   │
│  │ │ ♥1.000    🔗 Copy Link         │ │  │ │  SB mở: 25  chưa mở: 25 │   │   │
│  │ └───────────────────────────────┘ │  │ │  [    Mở quà    ]       │   │   │
│  │ ┌──── C.5 / C.6 / C.7 …  ─────┐   │  │ └────────────────────────┘   │   │
│  │ └─────────────────────────────┘   │  │ ┌── D.3 10 SUNNER… ────┐    │   │
│  │ … infinite scroll …              │  │ │  • name · "Nhận áo…"  │    │   │
│  └───────────────────────────────────┘  │ │  • name · …           │    │   │
│                                          │ └────────────────────────┘    │   │
│                                          └──────────────────────────────┘   │
│                                                                            │
│ ┌────────────────────────────────────────────────────────────────────────┐ │
│ │ FOOTER (border-top 1px #2E3940, padding 40×90)                          │ │
│ │  [Logo] [nav]                     Bản quyền thuộc về Sun* © 2025        │ │
│ └────────────────────────────────────────────────────────────────────────┘ │
└────────────────────────────────────────────────────────────────────────────┘
```

---

## Component Style Details

### Header (shared)

| Property              | Value                                        |
| --------------------- | -------------------------------------------- |
| **Node ID**           | `2940:13433`                                 |
| width / height        | `1440px / 80px`                              |
| padding               | `12px 144px`                                 |
| background            | `rgba(16, 20, 23, 0.80)`                     |
| display               | `flex; flex-direction: row; align-items: center; justify-content: space-between` |
| gap                   | `238px` (left group ↔ right group)            |

Nav link (Home / Awards / Sun* Kudos):

| Property       | Value                                            |
| -------------- | ------------------------------------------------ |
| typography     | Montserrat 16/700 white, letter-spacing `0.15px` |
| padding        | `8px 12px`                                       |
| border-radius  | `4px`                                            |

**Nav link states:**
| State      | Changes                                                                     |
| ---------- | --------------------------------------------------------------------------- |
| Default    | `color: #FFFFFF`                                                             |
| Hover      | `color: #FFEA9E`                                                             |
| Active (current page) | `color: #FFEA9E; border-bottom: 2px solid #FFEA9E`               |
| Focus      | `outline: 2px solid #FFEA9E; outline-offset: 2px`                            |

---

### A.1 — Button Ghi nhận (hero compose CTA)

| Property              | Value                                                       | CSS                                                     |
| --------------------- | ----------------------------------------------------------- | ------------------------------------------------------- |
| **Node ID**           | `2940:13449`                                                 | -                                                       |
| width / height        | `738px / 72px`                                               | `width: 738px; height: 72px`                            |
| padding               | `24px 16px`                                                  | `padding: 24px 16px`                                    |
| gap (icon↔label)      | `8px`                                                        | `gap: 8px`                                              |
| background            | `rgba(255, 234, 158, 0.10)`                                  | `background: var(--color-secondary-button)`             |
| border                | `1px solid #998C5F`                                          | `border: 1px solid var(--color-border-gold)`            |
| border-radius         | `68px`                                                       | `border-radius: var(--radius-pill)`                     |
| icon                  | `MM_MEDIA_Pen` 24×24                                         | Pen icon, color `#FFEA9E`                                |
| label                 | Montserrat 16/700, white                                     | `font: 700 16px/24px Montserrat; letter-spacing: .15px; color: #FFF;` |

**States:**
| State     | Changes                                                        |
| --------- | -------------------------------------------------------------- |
| Default   | as above                                                       |
| Hover     | `background: rgba(255, 234, 158, 0.40)` (`--color-secondary-button-hover`) |
| Focus     | `outline: 2px solid #FFEA9E; outline-offset: 2px`              |
| Active    | `background: rgba(255, 234, 158, 0.20)`                         |
| Disabled  | `opacity: .5; cursor: not-allowed`                              |

---

### Tìm kiếm Sunner — hero secondary pill

| Property        | Value                                   |
| --------------- | --------------------------------------- |
| **Node ID**     | `2940:13450`                             |
| width / height  | `381px / 72px`                           |
| padding / gap   | `24px 16px` / `8px`                      |
| background      | `rgba(255,234,158,0.10)`                 |
| border          | `1px solid #998C5F`                      |
| border-radius   | `68px`                                   |
| icon            | `MM_MEDIA_Search` 24×24                  |
| label           | Montserrat 16/700, white                 |

Same state rules as A.1.

---

### B.1.1 / B.1.2 — Filter buttons (Hashtag, Phong ban)

| Property        | Value                                          |
| --------------- | ---------------------------------------------- |
| **Node IDs**    | `2940:13459` (Hashtag), `2940:13460` (Phong ban) |
| padding         | `16px`                                          |
| gap             | `8px`                                           |
| background      | `rgba(255,234,158,0.10)`                        |
| border          | `1px solid #998C5F`                             |
| border-radius   | `4px`                                           |
| label           | Montserrat 16/700 white                         |
| trailing icon   | `MM_MEDIA_Down` 24×24                            |

**States:**
| State     | Changes                                                        |
| --------- | -------------------------------------------------------------- |
| Default   | translucent yellow fill                                        |
| Active (selected) | `background: #FFEA9E; color: #00101A;` (inverted); label shows the selected value (e.g. `#Dedicated`) |
| Hover     | `background: rgba(255,234,158,0.25)`                           |
| Focus     | `outline: 2px solid #FFEA9E; outline-offset: 2px`              |
| Open      | chevron rotates 180°; `aria-expanded="true"`                   |
| Disabled  | `opacity: .5; cursor: not-allowed` (when filter options are loading or empty) |

Dropdown list (overlay, frames `1002:13013` / `721:5684`): surface `#00070C`, 1px gold border, `radius: 12px`, shadow `--shadow-md`. Each option row is `40px` high, `padding: 8px 16px`, Montserrat 16/500 white. Selected option gets `background: rgba(255,234,158,0.15); color: #FFEA9E`. Hover option gets `background: rgba(255,255,255,0.05)`.

---

### B.2.1 / B.2.2 — Carousel prev/next buttons

| Property        | Value                                                      |
| --------------- | ---------------------------------------------------------- |
| **Node IDs**    | `2940:13470` (prev wrapper `Frame 528`, `400×525`, left gradient), `2940:13468` (next, right gradient) |
| size            | Icon button ~`48×48`                                        |
| background      | `linear-gradient(90deg, #00101A 50%, rgba(255,255,255,0) 100%)` (prev side), mirrored for next |
| icon            | `MM_MEDIA_Left` / `MM_MEDIA_Right` (chevron)                |
| color           | `#FFEA9E`                                                    |

**States:**
| State     | Changes                                            |
| --------- | -------------------------------------------------- |
| Default   | visible                                            |
| Disabled  | `opacity: .4; pointer-events: none` (at ends)      |

---

### B.3 — Highlight Kudo card

| Property              | Value                                                           |
| --------------------- | --------------------------------------------------------------- |
| **Node ID**           | `2940:13465`                                                    |
| width                 | `528px` (active) — side cards scaled ~0.85                      |
| padding               | `24px 24px 16px 24px`                                           |
| gap (between blocks)  | `16px`                                                          |
| background            | `#FFF8E1` (cream)                                               |
| border                | `4px solid #FFEA9E` (when active)                               |
| border-radius         | `16px`                                                          |
| flex-direction        | `column`; `align-items: flex-start`                              |
| text color            | `#00101A` default, `#2E3940` for secondary                       |

**States:**
| State      | Changes                                                              |
| ---------- | -------------------------------------------------------------------- |
| Active (center) | 4px gold border, full opacity                                   |
| Inactive (side) | `opacity: 0.5; border-width: 1px; transform: scale(0.92)`       |
| Hover (active)  | `transform: translateY(-2px); box-shadow: 0 8px 24px rgba(0,0,0,.35)` |

Internal atoms:
- Name: Montserrat 20/700 `#00101A`
- Department / Hoa thị row: Montserrat 14/500 `#2E3940`; hoa thị star icon fill `#FFEA9E`
- `danh hiệu` badge (`New Hero` / `Rising Hero` / `Super Hero` / `Legend Hero`): pill `height: 20px`, `padding: 2px 8px`, `radius: 9999px`, `background: linear-gradient(90deg, #FFEA9E 0%, #FAE287 100%)`, text Montserrat 10/700 `#00101A`
- Timestamp `10:00 - 10/30/2025`: Montserrat 14/500 `#2E3940`
- Content: Montserrat 16/400, clamped **3 lines** with `…`
- Hashtags: Montserrat 14/500 `#2E3940`, single line, max 5 tags; each tag is a button — hover `text-decoration: underline; color: #00101A`
- Hearts row: number Montserrat 16/700 `#00101A`, heart icon toggling `#999999 ↔ #D4271D`
- "Xem chi tiết" text button: Montserrat 14/500 `#2E3940`; hover `color: #00101A; text-decoration: underline`
- Copy Link button: Montserrat 14/500 `#2E3940` + link icon `#2E3940`; hover `color: #00101A; text-decoration: underline`

**Heart icon states:**
| State      | Changes                                                           |
| ---------- | ----------------------------------------------------------------- |
| Inactive   | `fill: #999999`                                                   |
| Hover (inactive)  | `fill: #F17676`                                            |
| Active     | `fill: #D4271D`                                                   |
| Loading    | spinner overlay, icon hidden                                      |
| Disabled (self-kudo) | `fill: #999999; opacity: .5; cursor: not-allowed`       |

**Avatar states (sender / receiver):**
| State     | Changes                                                         |
| --------- | --------------------------------------------------------------- |
| Default   | Circular image, `border: 2px solid transparent`                 |
| Hover     | `border: 2px solid #FFEA9E; cursor: pointer`                    |
| Focus     | `outline: 2px solid #FFEA9E; outline-offset: 2px`               |

---

### B.7 — Spotlight canvas

| Property        | Value                                       |
| --------------- | ------------------------------------------- |
| **Node ID**     | `2940:14174`                                 |
| width / height  | `1157px / 548px`                             |
| border          | `1px solid #998C5F`                          |
| border-radius   | `47.14px`                                    |
| background      | `#00101A` + decorative aurora images (image 24, image 25, "Root further mo rong 1") |

Sub-components:
- `B.7.1 388 KUDOS`: Montserrat 36/700 white, `217×44`, left-aligned.
- `B.7.2 Pan zoom`: 30×30 icon button top-right; tooltip "Pan/Zoom".
- `B.7.3 Tìm kiếm sunner` input:
  - `219px × 39px`, padding `16.378px 10.919px`, gap `5.459px`
  - `border: 0.682px solid #998C5F`, `border-radius: 46.404px`
  - `background: rgba(255, 234, 158, 0.10)`
  - placeholder `Tìm kiếm` Montserrat 12, `#DBD1C1`
- Floating name tokens: Montserrat, size varies by weight (hashed from user_id), color gradients of gold/white at `40-80%` opacity.
- Live ticker line: Montserrat 14/500 `#DBD1C1`, bottom-left, fade-in animation 200ms.

---

### C.3/5/6/7 — Kudo Post card (All Kudos feed)

| Property              | Value                                                        |
| --------------------- | ------------------------------------------------------------ |
| **Node IDs**          | `3127:21871` / `3127:22053` / `3127:22375` / `3127:22439`     |
| width / height        | `680px / 749px` (content may cause dynamic grow)              |
| padding               | `40px 40px 16px 40px`                                        |
| gap (vertical)        | `16px`                                                       |
| background            | `#FFF8E1`                                                    |
| border-radius         | `24px`                                                       |
| flex-direction        | `column`                                                     |

Internal components:
- `Info user` row (sender → send icon → receiver): flex row, equal columns, center aligned.
- Sender / Receiver block: circular avatar 64px + name column (Montserrat 20/700 `#00101A` + dept Montserrat 14 `#2E3940` + hoa thị `#FFEA9E`).
- `C.3.2 Icon sent` — MM_MEDIA_Send, 24×24, muted gold.
- `Rectangle 14/15` — 1px divider, `#2E3940 @ 10%` between sections.
- `C.3.4 Time` — Montserrat 14 `#2E3940`, format `HH:mm - MM/DD/YYYY`.
- `D.4 hashtag` pill (inside card) — yellow accent chip `rgba(255,234,158,.4)` text `#00101A`.
- `C.3.5 Content` — Montserrat 16/400 `#00101A`, clamp **5 lines**.
- `C.3.6 Images` — 5 thumbs, each square ~`112×112`, gap `8px`, radius `12px`. Thumb states: hover `transform: scale(1.04); cursor: pointer`; focus `outline: 2px solid #FFEA9E; outline-offset: 2px`.
- `C.3.7 Hashtags` — Montserrat 14/500 `#2E3940`, single line, max 5 tags.
- `C.4.1 Hearts` — number Montserrat 16/700 `#00101A` + heart icon toggling.
- `C.4.2 Copy Link` — text button Montserrat 14/500 with link icon; underline on hover.

**States:**
| State     | Changes                                                         |
| --------- | --------------------------------------------------------------- |
| Hover card| `box-shadow: 0 8px 24px rgba(0,0,0,.25); cursor: pointer`       |
| Heart active  | icon fill `#D4271D`, scale pulse 200ms                       |
| Heart disabled | `opacity:.5; cursor: not-allowed` (own kudo)                |

---

### D.1 — Stats panel

| Property        | Value                                   |
| --------------- | --------------------------------------- |
| **Node ID**     | `2940:13489`                             |
| padding         | `24px`                                   |
| background      | `#00070C`                                |
| border          | `1px solid #998C5F`                      |
| border-radius   | `17px`                                   |
| gap             | `10px`                                   |

Each stat row (`D.1.2`, `D.1.3`, `D.1.4`, `D.1.6`, `D.1.7`):
- `width: 374px; height: 40px`, `justify-content: space-between`, `align-items: center`.
- Label: Montserrat 22/700 white `rgba(255,255,255,1)`.
- Value: Montserrat 32/700 gold `#FFEA9E` (text-align right).
- `D.1.5` is a decorative divider rectangle, 1px.
- `D.1.4` includes an `x2` badge beside the value (gold fill, cream text) when the event has double-heart active.

#### D.1.8 — Open gift button

| Property       | Value                                         |
| -------------- | --------------------------------------------- |
| **Node ID**    | `2940:13497`                                   |
| width / height | `374px / 60px`                                 |
| padding        | `16px`                                         |
| gap            | `8px`                                          |
| background     | `#FFEA9E`                                       |
| border-radius  | `8px`                                          |
| label          | Montserrat 22/700 `#00101A` "Mở quà"           |
| icon           | `MM_MEDIA_Open Gift` 24×24 `#00101A`            |

**States:**
| State     | Changes                                              |
| --------- | ---------------------------------------------------- |
| Hover     | `background: #FFF3C6`                                |
| Active    | `background: #FAE287`                                 |
| Disabled  | `opacity: .5; cursor: not-allowed` (0 unopened boxes)|
| Loading   | spinner replaces gift icon, label unchanged          |

---

### D.3 — Top 10 gift recipients

| Property        | Value                                    |
| --------------- | ---------------------------------------- |
| **Node ID**     | `2940:13510`                              |
| padding         | `24px 16px 24px 24px`                     |
| background      | `#00070C`                                 |
| border          | `1px solid #998C5F`                       |
| border-radius   | `17px`                                    |

Each recipient row (`D.3.2` … `D.3.6`): avatar (circle 40px) + name (Montserrat 16/700 white) + gift description (Montserrat 14 `#DBD1C1`), row height `64px`, gap `8px`.
Header title `D.3.1`: Montserrat 20/700 `#FFEA9E`, 2-line label "10 SUNNER NHẬN QUÀ / MỚI NHẤT".

**Recipient row states:**
| State     | Changes                                                                 |
| --------- | ----------------------------------------------------------------------- |
| Default   | transparent background                                                  |
| Hover     | `background: rgba(255,234,158,0.08); cursor: pointer` (entire row clickable → profile) |
| Focus     | `outline: 2px solid #FFEA9E; outline-offset: -2px` (inset ring)         |

---

### Footer

| Property        | Value                                 |
| --------------- | ------------------------------------- |
| **Node ID**     | `2940:13522`                           |
| padding         | `40px 90px`                            |
| border-top      | `1px solid #2E3940`                    |
| display         | `flex; align-items: center; justify-content: space-between` |
| copyright text  | Montserrat 14 `#DBD1C1` "Bản quyền thuộc về Sun* © 2025" |

---

## Component Hierarchy with Styles

```
Screen (bg: #00101A)
├── KeyvisualBackground (1440×512, abs, z:1)
├── HeaderBar (1440×80, bg rgba(16,20,23,.8), px 144, py 12, flex row)
│   ├── Logo (INSTANCE)
│   ├── NavGroup (flex gap 32, text: --text-body white)
│   ├── LanguageButton (IC 24×24, chevron)
│   ├── NotificationButton (IC 24×24 + red dot badge top-right)
│   └── WidgetButton (IC 24×24)
│
├── HeroSection (A_KV Kudos) (w 1152, flex col gap 10)
│   ├── HeroSlogan (text: --text-display-hero, color #FFEA9E, line-height 64)
│   ├── KudosLogo (MM_MEDIA_Kudos logo, decorative)
│   └── HeroCTAs (flex row gap 16)
│       ├── ButtonGhiNhan  (A.1)  — pill 738×72, radius 68
│       └── ButtonTimKiemSunner   — pill 381×72, radius 68
│
├── HighlightKudosSection (B)
│   ├── SectionHeader (B.1) (px 144, flex col gap 40)
│   │   ├── EventTitle (#FFFFFF, --text-h2)
│   │   ├── Divider (Rectangle 26 — 1px gold line)
│   │   └── TitleRow (flex row justify-between)
│   │       ├── SectionTitle "HIGHLIGHT KUDOS" (--text-display-hero #FFEA9E)
│   │       └── FilterButtons (flex row gap 8)
│   │           ├── HashtagDropdown  (B.1.1) radius 4
│   │           └── DepartmentDropdown (B.1.2) radius 4
│   ├── HighlightCarousel (B.2) (1440×525)
│   │   ├── CarouselPrevOverlay (400×525, linear-gradient right)
│   │   ├── CarouselTrack (flex row gap 24)
│   │   │   └── KudoHighlightCard (B.3) × N — cream card 528 wide
│   │   └── CarouselNextOverlay (400×525, linear-gradient left)
│   └── PaginationBar (B.5) (1440×52, centered "2/5")
│
├── SpotlightSection (B.6 + B.7)
│   ├── SectionHeader (B.6, "SPOTLIGHT BOARD")
│   └── SpotlightCanvas (B.7) 1157×548, border gold, radius 47.14
│       ├── Counter (B.7.1 "388 KUDOS", 36/700 white)
│       ├── SearchInput (B.7.3) — 219×39 pill
│       ├── PanZoomIcon (B.7.2) — 30×30
│       ├── FloatingNameCloud (TEXT nodes, hashed positions, gold/white 40–80%)
│       └── LiveTicker (aria-live polite, Montserrat 14 #DBD1C1)
│
├── AllKudosSection (C)
│   ├── SectionHeader (C.1 "ALL KUDOS")
│   └── TwoColumn (flex row gap 40, px 144)
│       ├── FeedColumn (C.2) w 680, gap 24
│       │   └── KudoPostCard (C.3/5/6/7) 680×749, bg #FFF8E1, radius 24
│       │       ├── InfoUserRow (sender → send-icon → receiver)
│       │       ├── Divider (Rectangle 14)
│       │       ├── ContentBlock
│       │       │   ├── Time (C.3.4)
│       │       │   ├── HashtagBadge (D.4) pill
│       │       │   ├── Content (C.3.5, 5-line clamp)
│       │       │   ├── ImageGallery (C.3.6) ≤5 thumbs 112×112
│       │       │   └── Hashtags (C.3.7) single-line
│       │       ├── Divider (Rectangle 15)
│       │       └── ActionsRow (C.4)
│       │           ├── CopyLinkButton (C.4.2)
│       │           └── HeartsCounter (C.4.1)
│       └── SidebarColumn (D) w 422 gap 24
│           ├── StatsPanel (D.1) radius 17, bg #00070C, border gold
│           │   ├── KudosReceived (D.1.2) — label 22, value 32 #FFEA9E
│           │   ├── KudosSent (D.1.3)
│           │   ├── HeartsReceived (D.1.4 with optional x2 badge)
│           │   ├── Divider (D.1.5)
│           │   ├── SecretBoxOpened (D.1.6)
│           │   ├── SecretBoxUnopened (D.1.7)
│           │   └── OpenGiftButton (D.1.8) — bg #FFEA9E, radius 8
│           └── TopRecipientsPanel (D.3) radius 17, bg #00070C
│               ├── SectionTitle (D.3.1)
│               └── RecipientRow × 10 (D.3.2…) avatar + name + gift desc
│
└── Footer (2940:13522) border-top #2E3940, px 90, py 40
```

---

## Responsive Specifications

### Breakpoints

| Name     | Min Width | Max Width |
| -------- | --------- | --------- |
| Mobile   | 0         | 767px     |
| Tablet   | 768px     | 1023px    |
| Desktop  | 1024px    | ∞         |

### Responsive Changes

#### Mobile (< 768px)

| Component               | Changes                                                               |
| ----------------------- | --------------------------------------------------------------------- |
| Container               | `padding: 16px`                                                       |
| Header                  | Nav collapses to hamburger; language/bell/widget visible              |
| HeroSlogan              | `font-size: 32px; line-height: 40px`                                  |
| Hero CTAs               | `width: 100%`, stack vertically, `gap: 12px`                          |
| Highlight card          | `width: calc(100vw - 32px)`, 1 visible, side peeks collapsed          |
| Filter buttons          | wrap to 2 rows below section title                                    |
| Spotlight canvas        | `width: calc(100vw - 32px); height: 420px`, controls overlap top-right |
| AllKudos two-column     | sidebar moves **below** feed; both full-width                         |
| Footer                  | logo + nav stack, centered text                                       |

#### Tablet (768 – 1023px)

| Component               | Changes                                                               |
| ----------------------- | --------------------------------------------------------------------- |
| Container               | `padding: 24px; max-width: 100%`                                      |
| Highlight carousel      | 1 card with 1 peek, arrow overlays compressed                         |
| Feed                    | full-width, sidebar below                                             |

#### Desktop (≥ 1024px)

| Component       | Changes                                                   |
| --------------- | --------------------------------------------------------- |
| Container       | `max-width: 1440px; padding: 0 144px`                      |
| Highlight       | 3 visible cards (active 528 wide, sides 448 wide dimmed)   |
| AllKudos        | two-column: feed 680 + sidebar 422, gap 40                 |

---

## Icon Specifications

| Icon Name              | Size   | Color                | Usage                                 |
| ---------------------- | ------ | -------------------- | ------------------------------------- |
| `MM_MEDIA_Logo`        | var    | gold + cream         | Header & footer branding              |
| `MM_MEDIA_Kudos logo`  | var    | gold                 | Hero brand wordmark                   |
| `MM_MEDIA_Pen`         | 24×24  | `#FFEA9E`             | A.1 compose CTA                       |
| `MM_MEDIA_Search`      | 24×24  | `#FFEA9E`             | Secondary hero CTA, B.7.3             |
| `MM_MEDIA_Down`        | 24×24  | white                | Filter button chevrons (B.1.1/2)       |
| `MM_MEDIA_Left`        | 24×24  | `#FFEA9E`             | Carousel prev                          |
| `MM_MEDIA_Right`       | 24×24  | `#FFEA9E`             | Carousel next                          |
| `MM_MEDIA_Send`        | 24×24  | `#998C5F`             | C.3.2 "sent" icon in kudo cards        |
| `MM_MEDIA_Heart`       | 24×24  | `#999999 → #D4271D`   | Hearts (inactive / active)             |
| `MM_MEDIA_Link`        | 24×24  | `#2E3940`             | Copy Link button                       |
| `MM_MEDIA_Open Gift`   | 24×24  | `#00101A`             | D.1.8 button icon                      |
| Language flag `VN`     | 24×16  | multi                | Header language button                 |
| Bell icon              | 24×24  | white                | Header notification                    |
| Badge dot              | 8×8    | `#D4271D`             | Header unread indicator                |
| Widget icon            | 24×24  | gold                 | Header quick action                    |

All icons **MUST** be rendered via a dedicated `<Icon />` component (no inline SVGs or `<img>`). Provide icon name via a `name` prop backed by a central icon registry.

---

## Animation & Transitions

| Element                        | Property                  | Duration | Easing        | Trigger                     |
| ------------------------------ | ------------------------- | -------- | ------------- | --------------------------- |
| Hero CTA                       | background-color, shadow  | 150ms    | ease-in-out   | Hover / active              |
| Filter button chevron          | transform (rotate 180°)   | 150ms    | ease-out      | Dropdown open / close       |
| Carousel slide                 | transform                 | 250ms    | ease-out      | Next / prev / dot click     |
| Heart icon                     | transform (scale 1→1.2→1) | 200ms    | ease-out      | Click                        |
| Heart color                    | fill                      | 150ms    | ease-in-out   | Toggle                       |
| Live ticker line               | opacity + translateY(8px) | 200ms    | ease-out      | Event received               |
| Toast "Link copied…"           | opacity + translateY      | 200ms    | ease-out      | Copy action                  |
| Kudo card hover                | transform + box-shadow    | 200ms    | ease-out      | Hover                        |
| Dropdown / tooltip             | opacity + translateY(4px) | 150ms    | ease-out      | Open / close                 |

All animations MUST be gated by `@media (prefers-reduced-motion: reduce)` → set duration to `0ms` and disable auto-advance / pulses.

---

## Implementation Mapping

> Per the constitution (Core Principles II and `frontend.md`), **raw color / spacing / radius / typography literals are FORBIDDEN in component files**. All tokens below MUST be defined in `src/app/globals.css` as CSS variables and consumed via Tailwind v4 utilities generated from them (e.g., `bg-page`, `text-text-primary-gold`, `rounded-card-feed`). The suggested class names below assume the tokens are registered in the global stylesheet.

### Required Tailwind v4 `@theme` block

Tailwind v4 consumes tokens through an `@theme` block in the global stylesheet. Registering a variable here automatically generates the corresponding utility (e.g., `--color-page` → `bg-page`, `text-page`, `border-page`; `--radius-pill` → `rounded-pill`).

```css
/* src/app/globals.css — to be added before this screen is built */
@import "tailwindcss";

@theme {
  /* ── Colors (see "Colors" table above for source & usage) ───────────── */
  --color-page:                    #00101A;
  --color-panel:                   #00070C;
  --color-header-bg:               rgba(16, 20, 23, 0.80);
  --color-border-gold:             #998C5F;
  --color-text-primary-gold:       #FFEA9E;
  --color-secondary-button:        rgba(255, 234, 158, 0.10);
  --color-secondary-button-hover:  rgba(255, 234, 158, 0.40);
  --color-primary-button:          #FFEA9E;
  --color-primary-button-hover:    #FFF3C6;
  --color-primary-button-active:   #FAE287;
  --color-card-cream:              #FFF8E1;
  --color-text-on-light:           #00101A;
  --color-text-white:              #FFFFFF;
  --color-text-button:             #FFF3C6;
  --color-text-secondary-1:        #DBD1C1;
  --color-text-secondary-2:        #2E3940;
  --color-divider:                 #2E3940;
  --color-muted:                   #999999;
  --color-heart-active:            #D4271D;
  --color-heart-accent:            #F17676;

  /* ── Radii ──────────────────────────────────────────────────────────── */
  --radius-xs:        4px;
  --radius-sm:        8px;
  --radius-md:       16px;
  --radius-lg:       17px;    /* stat & leaderboard panels */
  --radius-xl:       24px;    /* feed card */
  --radius-2xl:      47.14px; /* spotlight canvas */
  --radius-pill:     68px;
  --radius-pill-sm:  46.404px;

  /* ── Spacing ────────────────────────────────────────────────────────── */
  --spacing-2xs:     4px;
  --spacing-xs:      8px;
  --spacing-sm:     16px;
  --spacing-md:     24px;
  --spacing-lg:     32px;
  --spacing-xl:     40px;
  --spacing-2xl:    48px;
  --spacing-page-x: 144px;
  --spacing-header:  80px;

  /* ── Shadows ────────────────────────────────────────────────────────── */
  --shadow-sm:  0 2px 4px  rgba(0, 0, 0, 0.15);
  --shadow-md:  0 4px 12px rgba(0, 0, 0, 0.25);
  --shadow-lg:  0 8px 24px rgba(0, 0, 0, 0.35);
  --shadow-xl:  0 16px 40px rgba(0, 0, 0, 0.50);
}
```

### Suggested Tailwind v4 class names (mapped to the variables above)

These classes are placeholders — they assume a Tailwind v4 `@theme` block exposes the variables. Use the Tailwind config that maps each token to a utility (e.g., `--color-page` → `bg-page`, `--radius-pill` → `rounded-pill`). Do NOT hard-code `bg-[#00101A]`, `rounded-[68px]`, or similar arbitrary values in component code.

| Design Element           | Figma Node ID  | Tailwind (v4 utilities via vars)                                                                                   | React Component                                       |
| ------------------------ | -------------- | ------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------- |
| Page shell               | `2940:13431`   | `bg-page text-text-white min-h-screen`                                                                              | `<KudosLiveBoardPage />`                              |
| Header                   | `2940:13433`   | `h-header px-page-x bg-header-bg flex items-center justify-between`                                                 | `<GlobalHeader />`                                    |
| Hero slogan              | `2940:13439`   | `text-display-hero text-text-primary-gold`                                                                          | `<HeroSlogan />`                                      |
| Hero A.1 pill            | `2940:13449`   | `w-[738px] h-18 rounded-pill border border-border-gold bg-secondary-button text-body`                               | `<PillCTA icon="pen" intent="compose" />`             |
| Hero A.2 pill            | `2940:13450`   | `w-[381px] h-18 rounded-pill border border-border-gold bg-secondary-button text-body`                               | `<PillCTA icon="search" intent="search-sunner" />`    |
| Filter button            | `2940:13459/60`| `rounded-xs border border-border-gold bg-secondary-button px-sm py-sm gap-xs text-body`                             | `<DropdownFilter kind="hashtag \| department" />`     |
| Highlight section title  | `2940:13457`   | `text-display-hero text-text-primary-gold tracking-tight`                                                            | `<SectionTitle tone="gold" />`                        |
| Highlight card (active)  | `2940:13465`   | `w-[528px] rounded-md bg-card-cream border-4 border-primary-button p-md pb-sm gap-sm text-text-on-light`             | `<KudoCard variant="highlight" active />`             |
| Carousel arrow overlay   | `2940:13468/70`| `absolute inset-y-0 w-[400px] flex items-center justify-center pointer-events-none [&>button]:pointer-events-auto`   | `<CarouselControls />` (uses gradient background class) |
| Carousel pagination      | `2940:13471`   | `flex items-center justify-center gap-lg h-13 text-text-primary-gold`                                               | `<CarouselPagination />`                              |
| Spotlight canvas         | `2940:14174`   | `w-[1157px] h-[548px] rounded-2xl border border-border-gold bg-page relative overflow-hidden`                       | `<SpotlightCanvas />`                                 |
| Spotlight search         | `2940:14833`   | `rounded-pill-sm border border-border-gold bg-secondary-button px-sm py-sm text-caption`                            | `<SunnerSearchInput size="sm" />`                     |
| Pan/Zoom control         | `3007:17479`   | `absolute top-sm right-sm size-[30px]`                                                                              | `<PanZoomControls />`                                 |
| Kudo post card (feed)    | `3127:21871+`  | `w-[680px] rounded-xl bg-card-cream p-xl pb-sm gap-sm text-text-on-light`                                           | `<KudoCard variant="feed" />`                         |
| Hearts counter           | `—`            | `inline-flex items-center gap-xs font-bold`                                                                         | `<HeartsCounter kudoId={id} />`                       |
| Copy Link button         | `—`            | `inline-flex items-center gap-xs text-body-sm text-text-secondary-2 hover:text-text-on-light hover:underline`       | `<CopyLinkButton kudoId={id} />`                      |
| "Xem chi tiết" button    | `—`            | `inline-flex items-center gap-xs text-body-sm text-text-secondary-2 hover:text-text-on-light hover:underline`       | `<ViewDetailLink kudoId={id} />`                      |
| Stats panel              | `2940:13489`   | `rounded-lg bg-panel border border-border-gold p-md gap-2.5`                                                        | `<StatsPanel />`                                      |
| Open gift button         | `2940:13497`   | `h-[60px] w-[374px] rounded-sm bg-primary-button text-text-on-light font-bold hover:bg-primary-button-hover active:bg-primary-button-active disabled:opacity-50 disabled:cursor-not-allowed` | `<OpenGiftButton />`                                  |
| Top recipients panel     | `2940:13510`   | `rounded-lg bg-panel border border-border-gold p-md`                                                                | `<TopRecipientsPanel />`                              |
| Footer                   | `2940:13522`   | `border-t border-divider px-[90px] py-lg flex justify-between items-center`                                         | `<GlobalFooter />`                                    |

Fall back to CSS variables (`style={{ background: 'var(--color-page)' }}`) only when a Tailwind utility isn't yet available, and immediately add the utility to the config.

---

## Asset Registry (per `frontend.md` asset conventions)

| File                               | Source Figma Node         | Purpose                              |
| ---------------------------------- | ------------------------- | ------------------------------------ |
| `public/assets/kudos/icons/pen.svg`            | `MM_MEDIA_Pen`           | A.1 compose CTA icon                 |
| `public/assets/kudos/icons/search.svg`         | `MM_MEDIA_Search`        | A.2 + B.7.3 search icon              |
| `public/assets/kudos/icons/chevron-down.svg`   | `MM_MEDIA_Down`          | Filter dropdown chevrons             |
| `public/assets/kudos/icons/chevron-left.svg`   | `MM_MEDIA_Left`          | Carousel prev arrow                  |
| `public/assets/kudos/icons/chevron-right.svg`  | `MM_MEDIA_Right`         | Carousel next arrow                  |
| `public/assets/kudos/icons/send.svg`           | `MM_MEDIA_Send`          | Kudo-card "sent" glyph               |
| `public/assets/kudos/icons/heart.svg`          | `MM_MEDIA_Heart`         | Hearts counter                       |
| `public/assets/kudos/icons/link.svg`           | `MM_MEDIA_Link`          | Copy-link button                     |
| `public/assets/kudos/icons/open-gift.svg`      | `MM_MEDIA_Open Gift`     | D.1.8 Mở quà button                  |
| `public/assets/kudos/icons/pan-zoom.svg`       | `B.7.2_Pan zoom`         | Spotlight canvas control             |
| `public/assets/kudos/icons/star.svg`           | `Ellipse 70` in hoa thị  | Hoa thị (star) icon                  |
| `public/assets/kudos/images/kv-kudos.png`      | `A_KV Kudos background`  | Hero background illustration         |
| `public/assets/kudos/images/spotlight-aurora.png` | `image 24` / `image 25` in B.7 | Spotlight decorative aurora   |
| `public/assets/kudos/logos/kudos-logo.svg`     | `MM_MEDIA_Kudos logo`    | Hero KUDOS brand wordmark            |

All filenames are kebab-case. Icons MUST be rendered through the shared `<Icon name="..." />` component; no inline `<svg>` or `<img>` tags in business components.

---

## Notes

- All colors MUST be exposed as CSS variables in `src/app/globals.css` (see "Required CSS variables" above) and consumed via Tailwind v4 utilities — never as arbitrary-value classes like `bg-[#00101A]`.
- The cream card used by both Highlight and All-Kudos variants is the same visual token (`--color-card-cream`) — share a single `<KudoCard>` with a `variant="highlight" | "feed"` prop.
- Icons are **mandatory via the Icon component**, never raw `<svg>` or `<img>` tags in business components.
- Gradient overlays (keyvisual cover, carousel fades) should be pre-composited CSS `linear-gradient` values — do not use images.
- The `388 KUDOS` counter is dynamic (from DB). The `388` in Figma is mock data.
- Montserrat Alternates is decorative and only used by the KUDOS wordmark — keep subsets small.
- The Spotlight name-cloud requires deterministic layout: hash user_id + kudos_received_count → (x, y, size, weight) with a seeded PRNG so multiple clients render the same board. See spec.md Q11 for whether seed is client- or server-computed.
- Contrast check: gold `#FFEA9E` on `#00101A` (ratio 13.9:1, AAA), white on `#101417@80%` (≈12:1, AAA), `#2E3940` on `#FFF8E1` (≈11.4:1, AAA) — all pass WCAG AA.
