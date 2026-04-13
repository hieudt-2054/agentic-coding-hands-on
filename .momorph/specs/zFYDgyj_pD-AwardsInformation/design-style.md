# Design Style: Awards Information (Hệ thống giải thưởng SAA 2025)

**Frame ID**: `zFYDgyj_pD` (Figma node: `313:8436`)
**Frame Name**: `Hệ thống giải`
**Figma Link**: https://momorph.ai/files/9ypp4enmFmdK3YAFJLIu6C/screens/zFYDgyj_pD
**Extracted At**: 2026-04-13

---

## Design Tokens

### Colors

Most colors are shared with the Homepage SAA and Login pages. Only page-specific additions are noted below.

| Token Name | Hex / Value | Opacity | Usage |
|------------|-------------|---------|-------|
| `--color-bg-page` | #00101A | 100% | Page background (shared) |
| `--color-header-bg` | rgba(16, 20, 23, 0.8) | 80% | Header background (shared) |
| `--color-text-gold` | #FFEA9E | 100% | Section title, award titles, sidebar active text, prize values |
| `--color-text-primary` | #FFFFFF | 100% | Body text, descriptions, sidebar normal text |
| `--color-text-secondary` | #DBD1C1 | 100% | Decorative text (Kudos SVN-Gotham) |
| `--color-divider` | #2E3940 | 100% | Section dividers, sidebar separators |
| `--color-border-gold` | #998C5F | 100% | Secondary borders, award card accent |
| `--color-nav-active-bg` | rgba(255, 234, 158, 0.10) | 10% | Sidebar active item background |
| `--color-card-bg` | #0F0F0F | 100% | Sun* Kudos card background (shared) |
| `--color-card-border` | #FFEA9E | 100% | Award image card border (shared) |
| `--color-btn-primary-bg` | #FFEA9E | 100% | "Chi tiết" button background (shared) |
| `--color-btn-primary-text` | #00101A | 100% | "Chi tiết" button text (shared) |
| `--color-accent-red` | #D4271D | 100% | Decorative red accent (limited use) |
| `--shadow-card-glow` | `0 4px 4px 0 rgba(0,0,0,0.25), 0 0 6px 0 #FAE287` | -- | Award image glow shadow (shared) |

### Typography

| Token Name | Font Family | Size | Weight | Line Height | Letter Spacing |
|------------|-------------|------|--------|-------------|----------------|
| `--text-section-title` | Montserrat | 57px | 700 | 64px | -0.25px |
| `--text-section-caption` | Montserrat | 24px | 700 | 32px | 0px |
| `--text-sidebar-item` | Montserrat | 16px | 700 | 24px | 0.15px |
| `--text-award-title` | Montserrat | 24px | 700 | 32px | 0px |
| `--text-award-desc` | Montserrat | 16px | 400 | 24px | 0.5px |
| `--text-award-meta-label` | Montserrat | 16px | 400 | 24px | 0.15px |
| `--text-award-meta-value` | Montserrat | 24px | 700 | 32px | 0px |
| `--text-kudos-title` | Montserrat | 57px | 700 | 64px | -0.25px |
| `--text-kudos-desc` | Montserrat | 16px | 700 | 24px | 0.5px |
| `--text-kudos-btn` | Montserrat | 16px | 700 | 24px | 0.15px |
| `--text-footer-copyright` | Montserrat Alternates | 16px | 700 | 24px | 0% |
| `--text-decorative` | SVN-Gotham | ~96px | -- | -- | -- |

### Spacing

| Token Name | Value | Usage |
|------------|-------|-------|
| `--spacing-page-px` | 144px | Main content horizontal padding (shared) |
| `--spacing-page-py` | 96px | Main content vertical padding (shared) |
| `--spacing-section-gap` | 120px | Gap between major page sections (shared) |
| `--spacing-sidebar-width` | 200px | Left sidebar navigation width (NEW) |
| `--spacing-two-col-gap` | 238px | Gap between sidebar and content area (NEW) |
| `--spacing-card-stack-gap` | 80px | Vertical gap between award detail cards (NEW) |
| `--spacing-card-inner-gap` | 24px | Gap inside award card (image to text) (NEW) |
| `--spacing-meta-gap` | 16px | Gap between metadata rows inside card (NEW) |
| `--spacing-sidebar-item-py` | 12px | Sidebar nav item vertical padding (NEW) |
| `--spacing-kudos-content-gap` | 32px | Gap inside Sun* Kudos content (shared) |
| `--spacing-footer-py` | 40px | Footer vertical padding (shared) |
| `--spacing-footer-px` | 90px | Footer horizontal padding (shared) |

### Border & Radius

| Token Name | Value | Usage |
|------------|-------|-------|
| `--radius-award-img` | 24px | Award card image border radius (shared) |
| `--radius-kudos-card` | 16px | Sun* Kudos card border radius (shared) |
| `--radius-btn-details` | 4px | "Chi tiết" button radius (shared) |
| `--border-award-img` | `0.955px solid #FFEA9E` | Award card image border (shared) |
| `--border-sidebar-active` | `2px solid #FFEA9E` | Sidebar active item underline indicator (NEW) |
| `--border-section-divider` | `1px solid #2E3940` | Section divider line (shared) |

### Shadows

| Token Name | Value | Usage |
|------------|-------|-------|
| `--shadow-card-glow` | `0 4px 4px 0 rgba(0,0,0,0.25), 0 0 6px 0 #FAE287` | Award image card glow (shared) |

---

## Layout Specifications

### Container

| Property | Value | Notes |
|----------|-------|-------|
| width | 1440px | Design canvas (desktop) |
| height | 6410px | Full page scroll height |
| background | #00101A | Dark navy |

### Layout Structure (ASCII)

```
+-----------------------------------------------------------------------------+
|  PAGE (1440px wide, bg: #00101A)                                             |
|                                                                              |
|  +------------------------------------------------------------------------+  |
|  |  AppHeader (reused, sticky top-0, not part of this spec)               |  |
|  +------------------------------------------------------------------------+  |
|                                                                              |
|  +------------------------------------------------------------------------+  |
|  |  3_Keyvisual (313:8437) -- Hero Banner                                 |  |
|  |  1200x871px cover image: "ROOT FURTHER" + SAA 2025 artwork             |  |
|  |  Full-width, centered                                                  |  |
|  +------------------------------------------------------------------------+  |
|                                                                              |
|  +------------------------------------------------------------------------+  |
|  |  Main content (px: 144px, py: 96px, gap: 120px, flex-col)             |  |
|  |                                                                        |  |
|  |  +------------------------------------------------------------------+  |  |
|  |  |  A_Title (313:8453) -- Section Title                             |  |  |
|  |  |  "Sun* annual awards 2025" (24px/700, white)                     |  |  |
|  |  |  ------------------------------------------------ (divider)      |  |  |
|  |  |  "Hệ thống giải thưởng SAA 2025" (57px/700, gold)                |  |  |
|  |  +------------------------------------------------------------------+  |  |
|  |                          | gap: 120px                                  |  |
|  |  +------------------------------------------------------------------+  |  |
|  |  |  B_Hệ thống giải thưởng (313:8458) -- Two-Column Layout          |  |  |
|  |  |                                                                  |  |  |
|  |  |  +------------------+    238px gap    +------------------------+ |  |  |
|  |  |  | C_Menu list      |                 | Award Detail Cards     | |  |  |
|  |  |  | (313:8459)       |                 | (stacked vertically)   | |  |  |
|  |  |  | STICKY sidebar   |                 |                        | |  |  |
|  |  |  | w: ~200px        |                 | +--------------------+ | |  |  |
|  |  |  |                  |                 | | D.1 Top Talent     | | |  |  |
|  |  |  | [*] Top Talent   |                 | | (313:8467)         | | |  |  |
|  |  |  | [ ] Top Project  |                 | | img + title + desc | | |  |  |
|  |  |  | [ ] Top Project  |                 | | + qty + prize      | | |  |  |
|  |  |  |     Leader       |                 | +--------------------+ | |  |  |
|  |  |  | [ ] Best Manager |                 |        | gap: 80px    | |  |  |
|  |  |  | [ ] Signature    |                 | +--------------------+ | |  |  |
|  |  |  |     2025-Creator |                 | | D.2 Top Project    | | |  |  |
|  |  |  | [ ] MVP          |                 | | (313:8468)         | | |  |  |
|  |  |  |                  |                 | +--------------------+ | |  |  |
|  |  |  |                  |                 |        | gap: 80px    | |  |  |
|  |  |  |                  |                 | +--------------------+ | |  |  |
|  |  |  |                  |                 | | D.3 Top Project    | | |  |  |
|  |  |  |                  |                 | |     Leader         | | |  |  |
|  |  |  |                  |                 | | (313:8469)         | | |  |  |
|  |  |  |                  |                 | +--------------------+ | |  |  |
|  |  |  |                  |                 |        | gap: 80px    | |  |  |
|  |  |  |                  |                 | +--------------------+ | |  |  |
|  |  |  |                  |                 | | D.4 Best Manager   | | |  |  |
|  |  |  |                  |                 | | (313:8470)         | | |  |  |
|  |  |  |                  |                 | +--------------------+ | |  |  |
|  |  |  |                  |                 |        | gap: 80px    | |  |  |
|  |  |  |                  |                 | +--------------------+ | |  |  |
|  |  |  |                  |                 | | D.5 Signature 2025 | | |  |  |
|  |  |  |                  |                 | | (313:8471)         | | |  |  |
|  |  |  |                  |                 | +--------------------+ | |  |  |
|  |  |  |                  |                 |        | gap: 80px    | |  |  |
|  |  |  |                  |                 | +--------------------+ | |  |  |
|  |  |  |                  |                 | | D.6 MVP            | | |  |  |
|  |  |  |                  |                 | | (313:8510)         | | |  |  |
|  |  |  +------------------+                 | +--------------------+ | |  |  |
|  |  |                                       +------------------------+ |  |  |
|  |  +------------------------------------------------------------------+  |  |
|  |                          | gap: 120px                                  |  |
|  |  +------------------------------------------------------------------+  |  |
|  |  |  D1_Sunkudos (335:12023) -- Sun* Kudos Promotion                 |  |  |
|  |  |  (reused component from Homepage SAA)                            |  |  |
|  |  |  +------------------------------------------------------------+  |  |  |
|  |  |  | Inner card (bg:#0F0F0F, radius:16px)                       |  |  |  |
|  |  |  | +------------------+  +----------------------------------+ |  |  |  |
|  |  |  | | Content (left)   |  | Decorative (right, SVN-Gotham)   | |  |  |  |
|  |  |  | | Label + Title    |  |                                  | |  |  |  |
|  |  |  | | + Desc + Button  |  |                                  | |  |  |  |
|  |  |  | +------------------+  +----------------------------------+ |  |  |  |
|  |  |  +------------------------------------------------------------+  |  |  |
|  |  +------------------------------------------------------------------+  |  |
|  +------------------------------------------------------------------------+  |
|                                                                              |
|  +------------------------------------------------------------------------+  |
|  |  AppFooter (reused, not part of this spec)                             |  |
|  +------------------------------------------------------------------------+  |
+-----------------------------------------------------------------------------+
```

---

## Component Style Details

### 3_Keyvisual -- Hero Banner

| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | `313:8437` | -- |
| width | 1440px (full-width) | `width: 100%` |
| height | auto (cover image 1200x871px) | `height: auto` |
| content | "ROOT FURTHER" + SAA 2025 cover artwork | `<Image>` component, `object-fit: cover` |
| position | relative | -- |

---

### A_Title -- Section Title Block

| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | `313:8453` | -- |
| width | 100% (within content padding) | `width: 100%` |
| gap | 16px | `gap: 16px` |
| display | flex | `flex-direction: column` |

| Element | Style |
|---------|-------|
| Caption "Sun* annual awards 2025" | Montserrat 24px/700/32px, color: #FFFFFF |
| Divider | 1px solid #2E3940, width: 100% |
| Title "Hệ thống giải thưởng SAA 2025" | Montserrat 57px/700/64px, letter-spacing: -0.25px, color: #FFEA9E |

---

### C_Menu list -- Sidebar Navigation

| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | `313:8459` | -- |
| width | ~200px | `width: 200px` |
| position | sticky | `position: sticky; top: 96px` (below header) |
| align-self | flex-start | `align-self: flex-start` |
| display | flex | `flex-direction: column` |
| gap | 0px | items stacked with no external gap |

---

### SidebarNavItem -- Individual Navigation Item (C.1 - C.6)

| Property | Value | CSS |
|----------|-------|-----|
| **Node IDs** | `313:8460` - `313:8465` | -- |
| padding | 12px 16px | `padding: 12px 16px` |
| font-family | Montserrat | `font-family: 'Montserrat', sans-serif` |
| font-size | 16px | `font-size: 16px` |
| font-weight | 700 | `font-weight: 700` |
| line-height | 24px | `line-height: 24px` |
| letter-spacing | 0.15px | `letter-spacing: 0.15px` |
| cursor | pointer | `cursor: pointer` |
| white-space | nowrap | `white-space: nowrap` |

**States:**

| State | Changes |
|-------|---------|
| Normal | color: #FFFFFF; background: transparent |
| Hover | color: #FFEA9E; background: rgba(255, 234, 158, 0.05) |
| Active (scroll spy) | color: #FFEA9E; background: rgba(255, 234, 158, 0.10); border-left: 2px solid #FFEA9E (or underline indicator) |
| Focus | outline: 2px solid rgba(255, 255, 255, 0.5); outline-offset: 2px |

---

### AwardDetailCard -- Award Detail Card (D.1 - D.6)

| Property | Value | CSS |
|----------|-------|-----|
| **Node IDs** | `313:8467` - `313:8510` | -- |
| width | 100% (fills right column) | `width: 100%` |
| display | flex | **`flex-direction: row`** (image LEFT, content RIGHT) |
| gap | 24px | `gap: 24px` (between image and content) |
| scroll-margin-top | 96px | `scroll-margin-top: 96px` (offset for sticky header: 80px header + 16px breathing) |

**IMPORTANT**: Each award card is a **horizontal layout** — the award image is on the LEFT and the content block (title, description, metadata) is on the RIGHT. This is different from the Homepage award cards which are vertical.

**Inner elements:**

| Element | Node | Style |
|---------|------|-------|
| Award Image (LEFT) | `I313:8467;214:2525` | 336x336px; border: 0.955px solid #FFEA9E; border-radius: 24px; box-shadow: 0 4px 4px rgba(0,0,0,0.25), 0 0 6px #FAE287; mix-blend-mode: screen; flex-shrink: 0 |
| Content Block (RIGHT) | `I313:8467;214:2526` | flex: 1; flex-direction: column; gap: 16px |
| Award Title | child of Content | Montserrat 24px/700/32px; color: #FFEA9E |
| Award Description | child of Content | Montserrat 16px/400/24px; letter-spacing: 0.5px; color: #FFFFFF; **full text** (no truncation — unlike Homepage 2-line clamp) |
| Metadata Row (Qty) | child of Content | Label: "Số lượng giải thưởng:" Montserrat 16px/400/24px, color: #FFFFFF; Value: Montserrat 24px/700/32px, color: #FFEA9E |
| Metadata Row (Prize) | child of Content | Label: "Giá trị giải thưởng:" Montserrat 16px/400/24px, color: #FFFFFF; Value: Montserrat 24px/700/32px, color: #FFEA9E |

**Award card layout (within each card — HORIZONTAL):**

```
+----------------------------------------------------------------------+
| +------------------+    gap:24px   +-------------------------------+ |
| | Award Image      |               | Content Block (flex-col)      | |
| | 336x336px        |               |                               | |
| | gold border      |               | Title (24px/700, gold)        | |
| | glow shadow      |               |          gap: 16px            | |
| | mix-blend:screen |               | Description (16px/400, white) | |
| | flex-shrink: 0   |               | Full text, no truncation      | |
| |                  |               |          gap: 16px            | |
| |                  |               | Số lượng: [qty] [unit]  gold  | |
| |                  |               |          gap: 16px            | |
| |                  |               | Giá trị: [prize_value]  gold  | |
| +------------------+               +-------------------------------+ |
+----------------------------------------------------------------------+
```

---

### Award Data Reference (D.1 - D.6)

| Card | Node ID | Title | Quantity | Unit | Prize Value |
|------|---------|-------|----------|------|-------------|
| D.1 | `313:8467` | Top Talent | 10 | Đơn vị | 7.000.000 VND |
| D.2 | `313:8468` | Top Project | 02 | Tập thể | 15.000.000 VND |
| D.3 | `313:8469` | Top Project Leader | 03 | Cá nhân | 7.000.000 VND |
| D.4 | `313:8470` | Best Manager | 01 | Cá nhân | 10.000.000 VND |
| D.5 | `313:8471` | Signature 2025 - Creator | 01 | -- | 5.000.000 (ca nhan) / 8.000.000 VND (tap the) |
| D.6 | `313:8510` | MVP | 01 | -- | 15.000.000 VND |

---

### D1_Sunkudos -- Sun* Kudos Promotion Section

This component is reused from the Homepage SAA. See `.momorph/specs/i87tDx10uM-HomepageSAA/design-style.md` (D1_Sun* Kudos Section) for full style details.

| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | `335:12023` | -- |
| outer container | full-width (within content padding) | `width: 100%` |
| inner card | bg: #0F0F0F | `border-radius: 16px` |
| layout | flex-row, space-between | -- |
| "Chi tiết" button | 127x56px, bg: #FFEA9E, radius: 4px, padding: 16px | -- |
| "Chi tiết" text | Montserrat 16px/700/24px, ls: 0.15px, color: #00101A | -- |

---

## Component Hierarchy with Styles

```
Awards Information Page (bg: #00101A, min-h: 100vh)
|-- AppHeader (reused, sticky top-0 z-10, h:80px)
|
|-- 3_Keyvisual (313:8437)
|   Full-width hero banner (1200x871px cover image)
|
|-- Main content (px:144px, py:96px, gap:120px, flex-col)
|   |-- A_Title (313:8453, gap:16px, flex-col)
|   |   |-- "Sun* annual awards 2025" (24px/700/#FFF)
|   |   |-- Divider (1px solid #2E3940)
|   |   +-- "Hệ thống giải thưởng SAA 2025" (57px/700/gold)
|   |
|   |-- B_Hệ thống giải thưởng (313:8458, flex-row, gap:238px)
|   |   |-- C_Menu list (313:8459, w:200px, sticky top-96px, flex-col)
|   |   |   |-- C.1 "Top Talent" (313:8460, 16px/700)
|   |   |   |-- C.2 "Top Project" (313:8461)
|   |   |   |-- C.3 "Top Project Leader" (313:8462)
|   |   |   |-- C.4 "Best Manager" (313:8463)
|   |   |   |-- C.5 "Signature 2025 - Creator" (313:8464)
|   |   |   +-- C.6 "MVP" (313:8465)
|   |   |
|   |   +-- Right content (flex-col, gap:80px, flex:1)
|   |       |-- D.1 Top Talent (313:8467, **flex-ROW**, gap:24px)
|   |       |   |-- Image LEFT (336x336px, border:gold, radius:24px, glow, flex-shrink:0)
|   |       |   +-- Content RIGHT (flex-col, gap:16px, flex:1)
|   |       |       |-- Title (24px/700/gold)
|   |       |       |-- Description (16px/400/#FFF, full text - no truncation)
|   |       |       |-- Qty: "10 Đơn vị" (24px/700/gold)
|   |       |       +-- Prize: "7.000.000 VNĐ" (24px/700/gold)
|   |       |
|   |       |-- D.2 Top Project (313:8468)
|   |       |-- D.3 Top Project Leader (313:8469)
|   |       |-- D.4 Best Manager (313:8470)
|   |       |-- D.5 Signature 2025 - Creator (313:8471)
|   |       +-- D.6 MVP (313:8510)
|   |
|   +-- D1_Sunkudos (335:12023, reused Kudos card)
|       +-- Inner card (bg:#0F0F0F, radius:16px, flex-row)
|           |-- Content (gap:32px, flex-col)
|           |   |-- "Phong trào ghi nhận" (24px/700/#FFF)
|           |   |-- "Sun* Kudos" (57px/700/gold)
|           |   |-- Description (16px/700/#FFF)
|           |   +-- "Chi tiết" btn (127x56px, bg:#FFEA9E, radius:4px)
|           +-- Decorative right side (SVN-Gotham, image)
|
|-- AppFooter (reused, px:90px, py:40px, border-top:#2E3940)
```

---

## Responsive Specifications

### Breakpoints

| Name | Min Width | Max Width |
|------|-----------|-----------|
| Mobile | 0 | 767px |
| Tablet | 768px | 1023px |
| Desktop | 1024px | infinity |

### Responsive Changes

#### Mobile (< 768px)

| Component | Changes |
|-----------|---------|
| Main content | px: 16px, py: 48px, gap: 40px |
| 3_Keyvisual | height: auto, object-fit: cover, max-height: 400px |
| A_Title | Title font-size: 32px, line-height: 40px |
| B_Hệ thống giải thưởng | flex-direction: column; gap: 24px |
| C_Menu list (sidebar) | position: relative (not sticky); display: flex; flex-direction: row; overflow-x: auto; white-space: nowrap; width: 100%; gap: 8px; padding-bottom: 12px (horizontal scrollable chip bar) |
| SidebarNavItem | padding: 8px 16px; border: 1px solid #2E3940; border-radius: 20px (chip style) |
| Right content (cards) | gap: 40px |
| Award image | 240x240px (scaled down) |
| D1_Sunkudos | Inner card flex-direction: column; decorative side hidden or below |

#### Tablet (768px - 1023px)

| Component | Changes |
|-----------|---------|
| Main content | px: 48px, py: 64px, gap: 64px |
| A_Title | Title font-size: 40px |
| B_Hệ thống giải thưởng | gap: 48px |
| C_Menu list (sidebar) | width: 160px |
| Right content (cards) | gap: 60px |
| Award image | 280x280px (scaled down) |
| D1_Sunkudos | Inner card layout stacked |

#### Desktop (>= 1024px)

| Component | Changes |
|-----------|---------|
| All | Follow Figma spec at 1440px canvas |

---

## Icon Specifications

| Icon | Size | Color | Location |
|------|------|-------|----------|
| Sidebar active indicator | 2px wide | #FFEA9E | Left border of active sidebar item |

All other icons (header, footer, widget) are handled by shared layout components and are not part of this page spec.

---

## Animation & Transitions

| Element | Property | Duration | Easing | Trigger |
|---------|----------|----------|--------|---------|
| SidebarNavItem | color, background-color, border-color | 150ms | ease-in-out | Hover / Active state change |
| Smooth scroll | scroll-behavior | -- | smooth | Sidebar click / hash anchor on load |
| Award card section | scroll-margin-top | -- | -- | Hash anchor scroll offset (96px) |

---

## Implementation Mapping

| Design Element | Figma Node ID | Tailwind suggestion | React Component |
|----------------|---------------|---------------------|-----------------|
| Page | `313:8436` | `min-h-screen bg-[#00101A]` | `<AwardsInformationPage>` |
| Hero keyvisual | `313:8437` | `w-full` | `<AwardsHeroKeyvisual>` |
| Section title | `313:8453` | `flex flex-col gap-4 w-full` | `<AwardsSectionTitle>` |
| Two-column layout | `313:8458` | `flex flex-row gap-[238px]` | `<AwardsLayout>` |
| Sidebar nav | `313:8459` | `sticky top-24 w-[200px] flex flex-col self-start` | `<AwardsSidebar>` |
| Sidebar nav item | `313:8460`-`313:8465` | `py-3 px-4 text-white font-bold cursor-pointer hover:text-[#FFEA9E] hover:bg-[rgba(255,234,158,0.05)]` | `<SidebarNavItem>` |
| Sidebar active item | -- | `text-[#FFEA9E] bg-[rgba(255,234,158,0.1)] border-l-2 border-[#FFEA9E]` | `<SidebarNavItem active>` |
| Right content area | -- | `flex flex-col gap-20 flex-1` | `<AwardsCardList>` |
| Award detail card | `313:8467`-`313:8510` | `flex flex-row gap-6 scroll-mt-24` | `<AwardDetailCard>` |
| Award image | child of D.x | `w-[336px] h-[336px] rounded-[24px] border border-[#FFEA9E]` | `<AwardImage>` (shared with Homepage) |
| Award title | child of D.x | `text-[#FFEA9E] font-bold text-2xl` | `<h3>` |
| Award description | child of D.x | `text-white text-base leading-6 tracking-[0.5px]` | `<p>` |
| Award metadata row | child of D.x | `flex items-baseline gap-2` | `<AwardMetaRow>` |
| Kudos section | `335:12023` | `w-full` | `<KudosSection>` (shared with Homepage) |
| Kudos card | child of `335:12023` | `rounded-2xl bg-[#0F0F0F]` | `<KudosCard>` (shared) |

---

## Notes

- Most color tokens, typography, and spacing values are shared with the Homepage SAA (`.momorph/specs/i87tDx10uM-HomepageSAA/design-style.md`). This page introduces only the sidebar navigation and two-column layout tokens as new values.
- The sidebar navigation uses scroll spy (IntersectionObserver) to track which award section is currently in view and highlight the corresponding nav item.
- The `scroll-margin-top: 96px` on each award card section accounts for the 80px sticky header plus 16px breathing room.
- On mobile, the sidebar transforms into a horizontal scrollable chip bar, which is a common responsive pattern for vertical navigation that needs to work on narrow screens.
- The Sun* Kudos component (D1_Sunkudos) should be extracted as a shared component since it appears on both the Homepage SAA and this Awards Information page with identical styling.
- Award card images share the same gold border + glow shadow treatment used on the Homepage award grid cards. The `<AwardImage>` component should be reusable.
- The 238px gap between sidebar and content is intentionally large for the premium, spacious visual aesthetic of the SAA 2025 design language.
