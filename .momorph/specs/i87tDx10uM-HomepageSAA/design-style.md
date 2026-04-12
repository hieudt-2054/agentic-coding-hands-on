# Design Style: Homepage SAA

**Frame ID**: `i87tDx10uM` (Figma node: `2167:9026`)
**Frame Name**: `Homepage SAA`
**Figma Link**: https://momorph.ai/files/9ypp4enmFmdK3YAFJLIu6C/screens/i87tDx10uM
**Extracted At**: 2026-04-12

---

## Design Tokens

### Colors

| Token Name | Hex / Value | Opacity | Usage |
|------------|-------------|---------|-------|
| `--color-bg-page` | #00101A | 100% | Page background (inherited from Login) |
| `--color-header-bg` | rgba(16, 20, 23, 0.8) | 80% | Header background |
| `--color-text-gold` | #FFEA9E | 100% | Section titles, award titles, event values, CTA primary text-bg |
| `--color-text-primary` | #FFFFFF | 100% | Body text, nav links, labels |
| `--color-text-secondary` | #DBD1C1 | 100% | SVN-Gotham decorative text in Kudos |
| `--color-divider` | #2E3940 | 100% | Section dividers, footer border |
| `--color-btn-primary-bg` | #FFEA9E | 100% | Primary CTA button background |
| `--color-btn-primary-text` | #00101A | 100% | Primary CTA button text |
| `--color-btn-secondary-bg` | rgba(255, 234, 158, 0.10) | 10% | Secondary/outline button fill |
| `--color-btn-secondary-border` | #998C5F | 100% | Secondary button border |
| `--color-card-bg` | #0F0F0F | 100% | Sun* Kudos card background |
| `--color-card-border` | #FFEA9E | 100% | Award image card border |
| `--color-keyvisual-gradient` | `linear-gradient(12deg, #00101A 23.7%, rgba(0,18,29,0.46) 38.34%, rgba(0,19,32,0) 48.92%)` | — | Hero gradient overlay |
| `--color-nav-active-bg` | rgba(255, 234, 158, 0.10) | 10% | Active nav link background (footer/header) |
| `--shadow-card` | `0 4px 4px 0 rgba(0,0,0,0.25), 0 0 6px 0 #FAE287` | — | Award card & widget button glow |

### Typography

| Token Name | Font Family | Size | Weight | Line Height | Letter Spacing |
|------------|-------------|------|--------|-------------|----------------|
| `--text-section-title` | Montserrat | 57px | 700 | 64px | -0.25px |
| `--text-section-caption` | Montserrat | 24px | 700 | 32px | 0px |
| `--text-countdown-digit` | Digital Numbers | ~49px | 400 | — | 0% |
| `--text-countdown-label` | Montserrat | 24px | 700 | 32px | 0px |
| `--text-event-value` | Montserrat | 24px | 700 | 32px | 0px |
| `--text-event-label` | Montserrat | 16px | 700 | 24px | 0.15px |
| `--text-event-note` | Montserrat | 16px | 700 | 24px | 0.5px |
| `--text-cta-btn` | Montserrat | 22px | 700 | 28px | 0px |
| `--text-nav-link` | Montserrat | 14px | 700 | 20px | 0.1px |
| `--text-nav-link-footer` | Montserrat | 16px | 700 | 24px | 0.15px |
| `--text-card-title` | Montserrat | 24px | 400 | 32px | 0px |
| `--text-card-desc` | Montserrat | 16px | 400 | 24px | 0.5px |
| `--text-card-link` | Montserrat | 16px | 500 | 24px | 0.15px |
| `--text-kudos-desc` | Montserrat | 16px | 700 | 24px | 0.5px |
| `--text-kudos-btn` | Montserrat | 16px | 700 | 24px | 0.15px |
| `--text-footer-copyright` | Montserrat Alternates | 16px | 700 | 24px | 0% |
| `--text-widget-slash` | Montserrat | 24px | 700 | 32px | 0px |
| `--text-nav-selected` | color: `#FFEA9E` + underline | — | — | — | — |

### Spacing

| Token Name | Value | Usage |
|------------|-------|-------|
| `--spacing-page-px` | 144px | Main content horizontal padding |
| `--spacing-page-py` | 96px | Main content vertical padding |
| `--spacing-section-gap` | 120px | Gap between major page sections |
| `--spacing-header-py` | 12px | Header vertical padding |
| `--spacing-header-px` | 144px | Header horizontal padding |
| `--spacing-awards-grid-gap` | 80px | Gap between award cards in grid |
| `--spacing-award-card-gap` | 24px | Gap inside award card (image→text) |
| `--spacing-countdown-gap` | 40px | Gap between countdown units |
| `--spacing-cta-gap` | 40px | Gap between CTA buttons |
| `--spacing-kudos-content-gap` | 32px | Gap inside Sun* Kudos content |
| `--spacing-footer-py` | 40px | Footer vertical padding |
| `--spacing-footer-px` | 90px | Footer horizontal padding |
| `--spacing-footer-nav-gap` | 48px | Gap between footer nav links |
| `--spacing-footer-logo-nav-gap` | 80px | Gap between footer logo and nav |

### Border & Radius

| Token Name | Value | Usage |
|------------|-------|-------|
| `--radius-award-img` | 24px | Award card image border radius |
| `--radius-kudos-card` | 16px | Sun* Kudos card border radius |
| `--radius-btn-primary` | 8px | Primary CTA button |
| `--radius-btn-secondary` | 8px | Secondary CTA button |
| `--radius-btn-details` | 4px | "Chi tiết" button in Kudos |
| `--radius-widget` | 100px | Widget pill button |
| `--border-award-img` | `0.955px solid #FFEA9E` | Award card image border |
| `--border-footer-top` | `1px solid #2E3940` | Footer top divider |
| `--border-btn-secondary` | `1px solid #998C5F` | Secondary CTA border |
| `--border-section-divider` | `1px solid #2E3940` | C1 awards section divider line |

### Shadows

| Token Name | Value | Usage |
|------------|-------|-------|
| `--shadow-card-glow` | `0 4px 4px 0 rgba(0,0,0,0.25), 0 0 6px 0 #FAE287` | Award image card, widget button |

---

## Layout Specifications

### Container

| Property | Value | Notes |
|----------|-------|-------|
| width | 1512px | Design canvas (desktop) |
| height | 4480px | Full page scroll height |
| background | #00101A | Dark navy |

### Layout Structure (ASCII)

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│  PAGE (1512px wide, bg: #00101A)                                                 │
│                                                                                  │
│  ┌──────────────────────────────────────────────────────────────────────────┐   │
│  │  A1_Header (1512×80px, px:144px, py:12px, bg:rgba(16,20,23,0.8))         │   │
│  │  ┌──────────────────────┐  ┌────────────────────────────────────────────┐ │   │
│  │  │ Logo+Nav (606×56px)  │  │ Controls: Lang + Bell + Avatar (220×56px)  │ │   │
│  │  │ Logo(52×48) gap:64px │  │ gap: 16px                                  │ │   │
│  │  │ Nav links: gap:24px  │  │                                            │ │   │
│  │  └──────────────────────┘  └────────────────────────────────────────────┘ │   │
│  └──────────────────────────────────────────────────────────────────────────┘   │
│                                                                                  │
│  ┌──────────────────────────────────────────────────────────────────────────┐   │
│  │  3.5_Keyvisual (1512×1392px, absolute bg)                                 │   │
│  │  + Gradient overlay (linear-gradient 12deg)                               │   │
│  │                                                                           │   │
│  │  ┌────────────────────────────────────────────────────────────────────┐  │   │
│  │  │  Main content (1512×4220px, px:144px, py:96px, gap:120px, flex-col)│  │   │
│  │  │                                                                    │  │   │
│  │  │  ┌──────────────────────────────────────────────────────────────┐  │  │   │
│  │  │  │  Hero block (1224×596px, gap:40px, flex-col)                 │  │  │   │
│  │  │  │  ├── ROOT FURTHER logo image (1224×200px)                    │  │  │   │
│  │  │  │  └── Countdown+Info+CTA (1224×256px, gap:16px)               │  │  │   │
│  │  │  │       ├── B1_Countdown (1224×176px, gap:16px, flex-col)      │  │  │   │
│  │  │  │       │   ├── "Coming soon" (24px/700)                       │  │  │   │
│  │  │  │       │   └── B1.3_Countdown digits (429×128px, gap:40px)    │  │  │   │
│  │  │  │       │        ├── Days  (116×128px, gap:14px)               │  │  │   │
│  │  │  │       │        ├── Hours (116×128px, gap:14px)               │  │  │   │
│  │  │  │       │        └── Mins  (116×128px, gap:14px)               │  │  │   │
│  │  │  │       ├── B2_Event info (637×64px, gap:8px, flex-col)        │  │  │   │
│  │  │  │       └── B3_CTA buttons (570×60px, gap:40px)                │  │  │   │
│  │  │  └──────────────────────────────────────────────────────────────┘  │  │   │
│  │  │                          ↕ gap: 120px                              │  │   │
│  │  │  ┌──────────────────────────────────────────────────────────────┐  │  │   │
│  │  │  │  B4_Root Further description (1152×1090px)                   │  │  │   │
│  │  │  └──────────────────────────────────────────────────────────────┘  │  │   │
│  │  │                          ↕ gap: 120px                              │  │   │
│  │  │  ┌──────────────────────────────────────────────────────────────┐  │  │   │
│  │  │  │  C1_Awards Header (1224×129px, gap:16px, flex-col)           │  │  │   │
│  │  │  │  ├── Caption: "Sun* annual awards 2025" (24px/700)           │  │  │   │
│  │  │  │  ├── Divider (1px solid #2E3940)                             │  │  │   │
│  │  │  │  └── Title row: "Hệ thống giải thưởng" (57px/700, gold)      │  │  │   │
│  │  │  └──────────────────────────────────────────────────────────────┘  │  │   │
│  │  │                                                                    │  │   │
│  │  │  ┌──────────────────────────────────────────────────────────────┐  │  │   │
│  │  │  │  C2_Award Grid (1224×1144px, gap:80px, flex-row, wrap:3col)  │  │  │   │
│  │  │  │  ┌──────────┐ ┌──────────┐ ┌──────────┐                     │  │  │   │
│  │  │  │  │ 336×504px│ │ 336×528px│ │ 336×504px│ (flex-col, gap:24px)│  │  │   │
│  │  │  │  │ [Image]  │ │ [Image]  │ │ [Image]  │                     │  │  │   │
│  │  │  │  │ Title    │ │ Title    │ │ Title    │                     │  │  │   │
│  │  │  │  │ Desc     │ │ Desc     │ │ Desc     │                     │  │  │   │
│  │  │  │  │ Chi tiết │ │ Chi tiết │ │ Chi tiết │                     │  │  │   │
│  │  │  │  └──────────┘ └──────────┘ └──────────┘                     │  │  │   │
│  │  │  └──────────────────────────────────────────────────────────────┘  │  │   │
│  │  │                          ↕ gap: 120px                              │  │   │
│  │  │  ┌──────────────────────────────────────────────────────────────┐  │  │   │
│  │  │  │  D1_Sun* Kudos (1224×500px)                                  │  │  │   │
│  │  │  │  ┌────────────────────────────────────────────────────────┐  │  │   │
│  │  │  │  │ Inner card (1120×500px, bg:#0F0F0F, radius:16px)        │  │  │   │
│  │  │  │  │ ┌──────────────────┐  ┌──────────────────────────────┐ │  │  │   │
│  │  │  │  │ │ D2_Content       │  │ Decorative image / SVN text  │ │  │  │   │
│  │  │  │  │ │ (457×408px)      │  │ (right side)                 │ │  │  │   │
│  │  │  │  │ │ Label 24px/700   │  │                              │ │  │  │   │
│  │  │  │  │ │ Title 57px/700   │  │                              │ │  │  │   │
│  │  │  │  │ │ Desc  16px/700   │  │                              │ │  │  │   │
│  │  │  │  │ │ [Chi tiết btn]   │  │                              │ │  │  │   │
│  │  │  │  │ └──────────────────┘  └──────────────────────────────┘ │  │  │   │
│  │  │  │  └────────────────────────────────────────────────────────┘  │  │   │
│  │  │  └──────────────────────────────────────────────────────────────┘  │  │   │
│  │  └────────────────────────────────────────────────────────────────────┘  │   │
│  └──────────────────────────────────────────────────────────────────────────┘   │
│                                                                                  │
│  ┌──────────────────────────────────────────────────────────────────────────┐   │
│  │  7_Footer (px:90px, py:40px, border-top:1px solid #2E3940)               │   │
│  │  ┌────────────────────────────────────┐  ┌──────────────────────────────┐│   │
│  │  │ Logo + Nav links (971×64px, gap:80)│  │ Copyright text (right)       ││   │
│  │  │  Logo(69×64) + Links(gap:48px)     │  │ Montserrat Alternates 16px/700││  │
│  │  └────────────────────────────────────┘  └──────────────────────────────┘│   │
│  └──────────────────────────────────────────────────────────────────────────┘   │
│                                                                                  │
│  ┌────────────────────┐  (fixed, bottom-right)                                  │
│  │  6_Widget Button   │  106×64px, bg:#FFEA9E, radius:100px                    │
│  │  [✏️ / SAA logo]  │  shadow: 0 0 6px #FAE287                               │
│  └────────────────────┘                                                          │
└─────────────────────────────────────────────────────────────────────────────────┘
```

---

## Component Style Details

### A1_Header — Top Navigation Bar

| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | `2167:9091` | — |
| width | 1512px | `width: 100%` |
| height | 80px | `height: 80px` |
| padding | 12px 144px | `padding: 12px 144px` |
| background | rgba(16,20,23,0.8) | `background-color: var(--color-header-bg)` |
| display | flex | `display: flex` |
| justify-content | space-between | `justify-content: space-between` |
| align-items | center | `align-items: center` |
| position | sticky top-0 | `position: sticky; top: 0; z-index: 10` |

**Nav link states:**

| State | Changes |
|-------|---------|
| Normal | color: #FFFFFF, bg: transparent |
| Hover | highlight background |
| Selected/Active | color: #FFEA9E, underline |

---

### B1_Countdown — Countdown Timer

| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | `2167:9035` | — |
| width | 1224px | `width: 100%` |
| height | 176px | `height: 176px` |
| gap | 16px | `gap: 16px` |
| display | flex | `display: flex` |
| flex-direction | column | `flex-direction: column` |

**"Coming soon" text:**
- Font: Montserrat 24px/700/32px, color: #FFFFFF
- Hidden when countdown reaches 0

**Countdown unit (Days/Hours/Minutes) — e.g., B1.3.1_Days:**

| Property | Value |
|----------|-------|
| Node ID | `2167:9038` / `9043` / `9048` |
| container | 116×128px, flex-col, gap: 14px |
| digit pair | 2× digit boxes side by side |
| digit font | Digital Numbers ~49px/400 |
| digit color | #FFFFFF |
| label font | Montserrat 24px/700/32px |
| label color | #FFFFFF |
| separator between units | gap: 40px |

---

### B2_Thông tin sự kiện — Event Info

| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | `2167:9053` | — |
| width | 637px | `width: 637px` |
| height | 64px | `height: 64px` |
| gap | 8px | `gap: 8px` |
| display | flex | `flex-direction: column` |

| Element | Font | Color |
|---------|------|-------|
| Label "Thời gian:" / "Địa điểm:" | Montserrat 16px/700/24px | #FFFFFF |
| Value "18h30" / "Nhà hát..." | Montserrat 24px/700/32px | #FFEA9E |
| Note "Tường thuật..." | Montserrat 16px/700/24px, letter-spacing: 0.5px | #FFFFFF |

---

### B3_CTA — Call-To-Action Buttons

| Property | Value |
|----------|-------|
| **Node ID** | `2167:9062` |
| container | 570×60px, flex-row, gap: 40px |

**B3.1 Primary button (ABOUT AWARDS — hover state shown):**

| Property | Value | CSS |
|----------|-------|-----|
| Node ID | `2167:9063` | — |
| width | 276px | `width: 276px` |
| height | 60px | `height: 60px` |
| padding | 16px 24px | `padding: 16px 24px` |
| background | #FFEA9E | `background-color: var(--color-btn-primary-bg)` |
| border-radius | 8px | `border-radius: var(--radius-btn-primary)` |
| text | Montserrat 22px/700/28px | color: #00101A |
| gap | 8px | (between text and icon) |

**B3.2 Secondary button (ABOUT KUDOS — normal state shown):**

| Property | Value | CSS |
|----------|-------|-----|
| Node ID | `2167:9064` | — |
| padding | 16px 24px | `padding: 16px 24px` |
| background | rgba(255,234,158,0.10) | `background: var(--color-btn-secondary-bg)` |
| border | 1px solid #998C5F | `border: var(--border-btn-secondary)` |
| border-radius | 8px | `border-radius: var(--radius-btn-secondary)` |
| text | Montserrat 22px/700/28px | color: #FFFFFF |

**Button states (both buttons swap appearance on hover):**

| State | Primary | Secondary |
|-------|---------|-----------|
| Default | bg: #FFEA9E, text: #00101A | bg: rgba(#FFEA9E,10%), border: #998C5F, text: #FFF |
| Hover | swaps to secondary style | swaps to primary style |
| Focus | outline: 2px solid #FFFFFF | outline: 2px solid #FFFFFF |

---

### C1_Header Giải thưởng — Awards Section Header

| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | `2167:9069` | — |
| width | 1224px | `width: 100%` |
| gap | 16px | `gap: 16px` |
| flex-direction | column | — |

| Element | Style |
|---------|-------|
| Caption "Sun* annual awards 2025" | Montserrat 24px/700/32px, color: #FFFFFF |
| Divider | 1px solid #2E3940, width: 100% |
| Title "Hệ thống giải thưởng" | Montserrat 57px/700/64px, letter-spacing: -0.25px, color: #FFEA9E |

---

### C2_Award Card — Thẻ giải thưởng

| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** (example) | `2167:9075` | — |
| container | 336×504px | `flex-direction: column; gap: 24px` |
| **Image (C2.x.1)** | 336×336px | border-radius: 24px |
| image border | 0.955px solid #FFEA9E | `border: var(--border-award-img)` |
| image shadow | `0 4px 4px rgba(0,0,0,0.25), 0 0 6px #FAE287` | `box-shadow: var(--shadow-card-glow)` |
| image mix-blend | screen | `mix-blend-mode: screen` |
| **Title (C2.x.2)** | Montserrat 24px/400/32px | color: #FFEA9E |
| **Description (C2.x.3)** | Montserrat 16px/400/24px, ls: 0.5px | color: #FFFFFF, max 2 lines |
| **"Chi tiết" link (C2.x.4)** | Montserrat 16px/500/24px, ls: 0.15px | color: #FFFFFF |
| Chi tiết padding | 16px 0px | `padding: 16px 0` |

**Card states:**

| State | Changes |
|-------|---------|
| Default | Normal display |
| Hover | Slight lift: `transform: translateY(-2px)`, enhanced glow shadow |
| Focus | outline: 2px solid rgba(255,255,255,0.5) |

**Award Grid layout:**
- 3 columns, gap: 80px horizontal
- Row 1: Top Talent, Top Project, Top Project Leader
- Row 2: Best Manager, Signature 2025 Creator, MVP

---

### D1_Sun* Kudos Section

| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | `3390:10349` | — |
| outer container | 1224×500px | `width: 100%` |
| inner card | 1120×500px, bg: #0F0F0F | `border-radius: var(--radius-kudos-card)` |
| inner card layout | flex-row, space-between | — |

**D2_Content (left side, 457×408px):**

| Element | Style |
|---------|-------|
| Label "Phong trào ghi nhận" | Montserrat 24px/700/32px, color: #FFFFFF |
| Title "Sun* Kudos" | Montserrat 57px/700/64px, ls: -0.25px, color: #FFEA9E |
| Description | Montserrat 16px/700/24px, ls: 0.5px, color: #FFFFFF, text-align: justify |
| "Chi tiết" button | 127×56px, bg: #FFEA9E, radius: 4px, padding: 16px |
| "Chi tiết" text | Montserrat 16px/700/24px, ls: 0.15px, color: #00101A |

---

### 6_Widget Button — Floating Action Button

| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | `5022:15169` | — |
| width | 106px | `width: 106px` |
| height | 64px | `height: 64px` |
| padding | 16px | `padding: 16px` |
| background | #FFEA9E | `background-color: var(--color-btn-primary-bg)` |
| border-radius | 100px | `border-radius: var(--radius-widget)` |
| shadow | `0 4px 4px rgba(0,0,0,0.25), 0 0 6px #FAE287` | `box-shadow: var(--shadow-card-glow)` |
| position | fixed, bottom-right | `position: fixed; bottom: 32px; right: 19px` |
| layout | flex-row, gap: 8px | — |
| content | pencil icon (24px) + "/" text (24px/700, #00101A) + SAA icon (24px) | — |

---

### 7_Footer — Footer Bar

| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | `5001:14800` | — |
| width | 1512px | `width: 100%` |
| padding | 40px 90px | `padding: var(--spacing-footer-py) var(--spacing-footer-px)` |
| border-top | 1px solid #2E3940 | `border-top: var(--border-footer-top)` |
| display | flex | `display: flex` |
| justify-content | space-between | `justify-content: space-between` |
| align-items | center | `align-items: center` |

| Element | Style |
|---------|-------|
| Logo | 69×64px |
| Nav links | Montserrat 16px/700/24px, ls: 0.15px, color: #FFFFFF |
| Nav active link | bg: rgba(#FFEA9E, 10%), text-shadow glow |
| Copyright | Montserrat Alternates 16px/700/24px, color: #FFFFFF |
| Nav links gap | 48px |
| Logo↔nav gap | 80px |

---

## Component Hierarchy with Styles

```
Homepage SAA (bg: #00101A, min-h: 100vh)
├── A1_Header (h:80px, px:144px, bg:rgba(16,20,23,0.8), sticky top-0 z-10)
│   ├── Logo + Nav group (w:606px, gap:64px)
│   │   ├── Logo (52×48px)
│   │   └── Nav links (gap:24px, Montserrat 14px/700)
│   │       ├── "About SAA 2025" [selected: gold+underline]
│   │       ├── "Awards Information" [hover: highlight]
│   │       └── "Sun* Kudos"
│   └── Controls (w:220px, gap:16px)
│       ├── Language toggle (108×56px)
│       ├── Bell icon (40×40px)
│       └── Avatar button (40×40px, border:1px solid #998C5F)
│
├── 3.5_Keyvisual (absolute bg, 1512×1392px, cover)
│   └── gradient overlay (linear-gradient 12deg)
│
├── Main content (px:144px, py:96px, gap:120px, flex-col)
│   ├── Hero block (gap:40px)
│   │   ├── ROOT FURTHER logo image (1224×200px)
│   │   └── Info+CTA wrapper (gap:16px)
│   │       ├── B1_Countdown (1224×176px)
│   │       │   ├── "Coming soon" (24px/700, white)
│   │       │   └── Digits row (gap:40px)
│   │       │       ├── Days (116×128px, Digital Numbers ~49px)
│   │       │       ├── Hours (116×128px)
│   │       │       └── Minutes (116×128px)
│   │       ├── B2_Event info (637px, gap:8px)
│   │       │   ├── Time row: label(16px/#FFF) + value(24px/gold)
│   │       │   ├── Venue row: label(16px/#FFF) + value(24px/gold)
│   │       │   └── Note (16px/#FFF, ls:0.5px)
│   │       └── B3_CTA (gap:40px)
│   │           ├── "ABOUT AWARDS" (bg:#FFEA9E, 276×60px, radius:8px)
│   │           └── "ABOUT KUDOS" (bg:rgba(#FFEA9E,10%), border:#998C5F)
│   │
│   ├── B4_Root Further description (1152×1090px)
│   │
│   ├── Awards section
│   │   ├── C1_Header (1224px)
│   │   │   ├── "Sun* annual awards 2025" (24px/700/#FFF)
│   │   │   ├── Divider (1px/#2E3940)
│   │   │   └── "Hệ thống giải thưởng" (57px/700/gold)
│   │   └── C2_Grid (1224px, gap:80px, 3 cols)
│   │       └── Award Card × 6 (336px, flex-col, gap:24px)
│   │           ├── Image (336×336px, border:1px gold, radius:24px, glow shadow)
│   │           ├── Title (24px/400/gold)
│   │           ├── Desc (16px/400/#FFF, max 2 lines)
│   │           └── "Chi tiết →" (16px/500/#FFF)
│   │
│   └── D1_Sun* Kudos (1224px)
│       └── Inner card (1120×500px, bg:#0F0F0F, radius:16px)
│           ├── D2_Content (457×408px, gap:32px)
│           │   ├── "Phong trào ghi nhận" (24px/700/#FFF)
│           │   ├── "Sun* Kudos" (57px/700/gold)
│           │   ├── Description (16px/700/#FFF)
│           │   └── "Chi tiết" btn (127×56px, bg:#FFEA9E, radius:4px)
│           └── Decorative right side (SVN-Gotham, image)
│
├── 7_Footer (px:90px, py:40px, border-top:#2E3940)
│   ├── Logo + Nav (gap:80px)
│   │   ├── Logo (69×64px)
│   │   └── Links (gap:48px, 16px/700/#FFF)
│   └── Copyright (Montserrat Alternates 16px/700)
│
└── 6_Widget Button (fixed bottom-right, 106×64px, bg:#FFEA9E, radius:100px)
    └── [pencil icon] / [SAA icon]
```

---

## Responsive Specifications

### Breakpoints

| Name | Min Width | Max Width |
|------|-----------|-----------|
| Mobile | 0 | 767px |
| Tablet | 768px | 1023px |
| Desktop | 1024px | ∞ |

### Responsive Changes

#### Mobile (< 768px)

| Component | Changes |
|-----------|---------|
| A1_Header | px: 16px; nav links hidden (hamburger) |
| Main content | px: 16px, py: 48px, gap: 40px |
| B1_Countdown | gap: 16px; digits smaller |
| B3_CTA buttons | width: 100%, stack vertically |
| C2_Award Grid | 1 column |
| D1_Kudos | flex-col; image hidden or below |
| 7_Footer | flex-col, centered; px: 16px, py: 24px |

#### Tablet (768px – 1023px)

| Component | Changes |
|-----------|---------|
| A1_Header | px: 48px |
| Main content | px: 48px, py: 64px, gap: 64px |
| C2_Award Grid | 2 columns |
| D1_Kudos | inner layout: stacked |
| 7_Footer | px: 48px, py: 32px |

#### Desktop (≥ 1024px)

| Component | Changes |
|-----------|---------|
| All | Follow Figma spec at 1512px canvas |

---

## Icon Specifications

| Icon | Size | Color | Location |
|------|------|-------|----------|
| SAA Logo | 52×48px (header), 69×64px (footer) | — | A1_Header, Footer |
| Bell (notification) | 40×40px | #FFFFFF | Header controls |
| Avatar | 40×40px | — | Header controls |
| Arrow/Chevron icon | 24×24px | #FFFFFF | "Chi tiết" buttons |
| Pencil icon | 24×24px | #00101A | Widget button |
| SAA mini icon | 24×24px | — | Widget button |
| Language flag (VN) | 24×24px | — | Language toggle |
| Chevron down | 24×24px | #FFFFFF | Language toggle |

All icons MUST be implemented as SVG components.

---

## Animation & Transitions

| Element | Property | Duration | Easing | Trigger |
|---------|----------|----------|--------|---------|
| Award card | transform, box-shadow | 200ms | ease-out | Hover |
| CTA buttons | background-color, border | 150ms | ease-in-out | Hover |
| Nav links | background-color, color | 150ms | ease-in-out | Hover |
| Widget button | box-shadow, transform | 150ms | ease-in-out | Hover |
| B1_Countdown | content update | — | — | Every minute (real-time) |

---

## Implementation Mapping

| Design Element | Figma Node ID | Tailwind suggestion | React Component |
|----------------|---------------|---------------------|-----------------|
| Page | `2167:9026` | `min-h-screen bg-[#00101A]` | `<HomePage>` |
| Header | `2167:9091` | `sticky top-0 z-10 flex justify-between px-36 py-3` | `<Header>` (extended) |
| Countdown section | `2167:9035` | `flex flex-col gap-4` | `<CountdownTimer>` |
| Countdown unit | `2167:9038/9043/9048` | `flex flex-col gap-[14px] w-[116px]` | `<CountdownUnit>` |
| Event info | `2167:9053` | `flex flex-col gap-2` | `<EventInfo>` |
| CTA primary | `2167:9063` | `flex items-center gap-2 px-6 py-4 bg-[#FFEA9E] rounded-lg` | `<CTAButton variant="primary">` |
| CTA secondary | `2167:9064` | `flex items-center gap-2 px-6 py-4 rounded-lg border border-[#998C5F]` | `<CTAButton variant="secondary">` |
| Awards header | `2167:9069` | `flex flex-col gap-4 w-full` | `<AwardsHeader>` |
| Award card | `2167:9075` | `flex flex-col gap-6 w-[336px]` | `<AwardCard>` |
| Award image | `I2167:9075;214:1019` | `w-[336px] h-[336px] rounded-[24px] border border-[#FFEA9E]` | `<AwardImage>` |
| Kudos section | `3390:10349` | `w-full` | `<KudosSection>` |
| Kudos card | `I3390:10349;313:8416` | `rounded-2xl bg-[#0F0F0F]` | `<KudosCard>` |
| Widget button | `5022:15169` | `fixed bottom-8 right-5 flex items-center gap-2 px-4 py-4 bg-[#FFEA9E] rounded-full` | `<WidgetButton>` |
| Footer | `5001:14800` | `flex justify-between px-[90px] py-10 border-t border-[#2E3940]` | `<Footer>` (extended) |
