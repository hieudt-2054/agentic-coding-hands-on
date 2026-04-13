# Design Style: Countdown - Prelaunch Page

**Frame ID**: `8PJQswPZmU` (Figma node: `2268:35127`)
**Frame Name**: `Countdown - Prelaunch page`
**Figma Link**: https://momorph.ai/files/9ypp4enmFmdK3YAFJLIu6C/screens/8PJQswPZmU
**Extracted At**: 2026-04-13

---

## Design Tokens

### Colors

| Token Name | Hex / Value | Opacity | Usage |
|------------|-------------|---------|-------|
| `--color-bg-page` | #00101A | 100% | Page background (shared with Login/Homepage) |
| `--color-text-primary` | #FFFFFF | 100% | Heading text, unit labels |
| `--color-digit-border` | #FFEA9E | 100% | Glass digit box border |
| `--color-digit-bg` | `linear-gradient(180deg, #FFF 0%, rgba(255,255,255,0.10) 100%)` | 50% (opacity) | Glass digit box background |
| `--color-prelaunch-gradient` | `linear-gradient(18deg, #00101A 15.48%, rgba(0,18,29,0.46) 52.13%, rgba(0,19,32,0) 63.41%)` | — | Overlay gradient on keyvisual |

### Typography

| Token Name | Font Family | Size | Weight | Line Height | Letter Spacing |
|------------|-------------|------|--------|-------------|----------------|
| `--text-prelaunch-heading` | Montserrat | 36px | 700 | 48px | 0px |
| `--text-prelaunch-digit` | Digital Numbers | ~73.7px | 400 | — | 0% |
| `--text-prelaunch-label` | Montserrat | 36px | 700 | 48px | 0px |

### Spacing

| Token Name | Value | Usage |
|------------|-------|-------|
| `--spacing-prelaunch-px` | 144px | Main content horizontal padding |
| `--spacing-prelaunch-py` | 96px | Main content vertical padding |
| `--spacing-prelaunch-section-gap` | 120px | Gap between sections |
| `--spacing-prelaunch-unit-gap` | 60px | Gap between countdown units (Days/Hours/Minutes) |
| `--spacing-prelaunch-digit-gap` | 21px | Gap between 2 digit boxes within a unit |
| `--spacing-prelaunch-digit-label-gap` | 21px | Gap between digit row and label text |

### Border & Radius

| Token Name | Value | Usage |
|------------|-------|-------|
| `--radius-prelaunch-digit` | 12px | Digit box border radius |
| `--border-prelaunch-digit` | 0.75px solid #FFEA9E | Digit box border |

---

## Layout Specifications

### Container

| Property | Value | Notes |
|----------|-------|-------|
| width | 1512px | Design canvas (desktop) |
| height | 1077px | Full viewport height |
| background | #00101A | Dark navy |

### Layout Structure (ASCII)

```
┌──────────────────────────────────────────────────────────────────┐
│  PAGE (1512px wide, 1077px tall, bg: #00101A)                     │
│                                                                   │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │  BG Image (1512×1077px, absolute, cover)                    │  │
│  └────────────────────────────────────────────────────────────┘  │
│                                                                   │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │  Gradient Cover (1512×1077px, absolute)                     │  │
│  │  linear-gradient(18deg, #00101A 15.48%, ...)                │  │
│  └────────────────────────────────────────────────────────────┘  │
│                                                                   │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │  Content "Bìa" (1512×456px, px:144, py:96, gap:120)        │  │
│  │  flex-col, items-center, justify-center                     │  │
│  │                                                             │  │
│  │  ┌──────────────────────────────────────────────────────┐  │  │
│  │  │  Heading: "Sự kiện sẽ bắt đầu sau"                   │  │  │
│  │  │  Montserrat 36px/700/48px, white, text-center         │  │  │
│  │  └──────────────────────────────────────────────────────┘  │  │
│  │                       ↕ gap: 24px                           │  │
│  │  ┌──────────────────────────────────────────────────────┐  │  │
│  │  │  Countdown "Time" (644×192px, flex-row, gap:60px)     │  │  │
│  │  │  centered horizontally                                │  │  │
│  │  │  ┌──────────┐  ┌──────────┐  ┌──────────┐           │  │  │
│  │  │  │ 1_Days   │  │ 2_Hours  │  │ 3_Minutes│           │  │  │
│  │  │  │ 175×192  │  │ 175×192  │  │ 175×192  │           │  │  │
│  │  │  │ ┌──┐┌──┐ │  │ ┌──┐┌──┐ │  │ ┌──┐┌──┐ │           │  │  │
│  │  │  │ │00││00│ │  │ │05││  │ │  │ │20││  │ │           │  │  │
│  │  │  │ └──┘└──┘ │  │ └──┘└──┘ │  │ └──┘└──┘ │           │  │  │
│  │  │  │  DAYS    │  │  HOURS   │  │  MINUTES  │           │  │  │
│  │  │  └──────────┘  └──────────┘  └──────────┘           │  │  │
│  │  └──────────────────────────────────────────────────────┘  │  │
│  └────────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────────┘
```

---

## Component Style Details

### Countdown Digit Box

| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | `I2268:35141;186:2616` (example) | — |
| width | 76.8px (~77px) | `width: 77px` |
| height | 122.88px (~123px) | `height: 123px` |
| border | 0.75px solid #FFEA9E | `border: var(--border-prelaunch-digit)` |
| border-radius | 12px | `border-radius: var(--radius-prelaunch-digit)` |
| opacity | 0.5 | `opacity: 0.5` |
| background | linear-gradient(180deg, #FFF 0%, rgba(255,255,255,0.10) 100%) | Glass-morphism gradient |
| backdrop-filter | blur(25px) | `backdrop-filter: blur(25px)` |

### Countdown Digit Text

| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | `I2268:35141;186:2617` (example) | — |
| font-family | Digital Numbers | `font-family: var(--font-digital-numbers)` |
| font-size | ~73.7px | `font-size: var(--text-prelaunch-digit)` |
| font-weight | 400 | — |
| color | #FFFFFF | `color: var(--color-text-primary)` |
| text-align | left | Centered within box visually |

### Countdown Unit Container (e.g., "1_Days")

| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | `2268:35139` / `2268:35144` / `2268:35149` | — |
| width | 175px | `width: 175px` |
| height | 192px | `height: 192px` |
| display | flex | `display: flex` |
| flex-direction | column | `flex-direction: column` |
| justify-content | center | `justify-content: center` |
| gap (digit row) | 21px | Between the 2 digit boxes |
| gap (to label) | 21px | Between digit row and label |

### Unit Label Text (DAYS / HOURS / MINUTES)

| Property | Value | CSS |
|----------|-------|-----|
| font-family | Montserrat | `font-family: var(--font-montserrat)` |
| font-size | 36px | `font-size: var(--text-prelaunch-label)` |
| font-weight | 700 | `font-weight: 700` |
| line-height | 48px | `line-height: 48px` |
| color | #FFFFFF | white |

### Heading Text

| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | `2268:35137` | — |
| text | "Sự kiện sẽ bắt đầu sau" | — |
| font-family | Montserrat | `font-family: var(--font-montserrat)` |
| font-size | 36px | `font-size: 36px` |
| font-weight | 700 | `font-weight: 700` |
| line-height | 48px | `line-height: 48px` |
| color | #FFFFFF | white |
| text-align | center | `text-align: center` |

---

## Component Hierarchy with Styles

```
Countdown - Prelaunch page (bg: #00101A, 1512×1077px)
├── BG Image (absolute, 1512×1077px, cover)
├── Gradient Cover (absolute, 1512×1077px, linear-gradient 18deg)
│
└── Content "Bìa" (px:144, py:96, gap:120, flex-col, items-center, justify-center)
    └── Frame 523 (gap:24px, flex-col, items-center)
        ├── Heading "Sự kiện sẽ bắt đầu sau" (36px/700/48px, white, center)
        └── Time (644px, flex-row, gap:60px, items-center)
            ├── 1_Days (175×192px, flex-col, gap:21px)
            │   ├── Frame 485 (flex-row, gap:21px)
            │   │   ├── Digit Box 1 (77×123px, glass, "0")
            │   │   └── Digit Box 2 (77×123px, glass, "0")
            │   └── Label "DAYS" (36px/700/48px, white)
            │
            ├── 2_Hours (175×192px, flex-col, gap:21px)
            │   ├── Frame 485 (flex-row, gap:21px)
            │   │   ├── Digit Box 1 (77×123px, glass, "0")
            │   │   └── Digit Box 2 (77×123px, glass, "5")
            │   └── Label "HOURS" (36px/700/48px, white)
            │
            └── 3_Minutes (175×192px, flex-col, gap:21px)
                ├── Frame 485 (flex-row, gap:21px)
                │   ├── Digit Box 1 (77×123px, glass, "2")
                │   └── Digit Box 2 (77×123px, glass, "0")
                └── Label "MINUTES" (36px/700/48px, white)
```

---

## Responsive Specifications

### Breakpoints

| Name | Min Width | Max Width |
|------|-----------|-----------|
| Mobile | 0 | 767px |
| Tablet | 768px | 1023px |
| Desktop | 1024px | --- |

### Responsive Changes

#### Mobile (< 768px)

| Component | Changes |
|-----------|---------|
| Content padding | px: 16px, py: 48px |
| Heading | font-size: 24px |
| Digit boxes | scale down: ~60×95px |
| Unit gap | gap: 24px (instead of 60px) |
| Labels | font-size: 24px |

#### Tablet (768px - 1023px)

| Component | Changes |
|-----------|---------|
| Content padding | px: 48px, py: 64px |
| Unit gap | gap: 40px |

#### Desktop (>= 1024px)

| Component | Changes |
|-----------|---------|
| All | Follow Figma spec at 1512px canvas |

---

## Animation & Transitions

| Element | Property | Duration | Easing | Trigger |
|---------|----------|----------|--------|---------|
| Countdown digits | content update | — | — | Every minute (real-time) |

---

## Implementation Mapping

| Design Element | Figma Node ID | CSS Approach | React Component |
|----------------|---------------|-------------|-----------------|
| Page | `2268:35127` | `min-h-screen bg-[#00101A] relative` | `<PrelaunchPage>` |
| BG Image | `2268:35129` | `absolute inset-0 object-cover` | `<Image fill priority>` |
| Gradient | `2268:35130` | `absolute inset-0` + gradient CSS | `<div>` overlay |
| Content | `2268:35131` | `relative z-10 flex flex-col items-center justify-center` | Layout wrapper |
| Heading | `2268:35137` | Montserrat 36px/700, white, center | `<h1>` |
| Time row | `2268:35138` | `flex gap-[60px] items-center` | `<div>` |
| Countdown unit | `2268:35139` | `flex flex-col gap-[21px] items-start` | `<PrelaunchCountdownUnit>` |
| Digit box | `I2268:35141;186:2616` | Glass-morphism with border, gradient, blur | `<div>` |
| Digit text | `I2268:35141;186:2617` | Digital Numbers ~74px, white | `<span>` |
| Label | `2268:35143` | Montserrat 36px/700, white | `<span>` |

---

## Key Differences from Homepage SAA Countdown

| Aspect | Homepage SAA | Prelaunch Page |
|--------|-------------|----------------|
| Digit font size | ~49px | ~73.7px |
| Label font size | 24px | 36px |
| Digit box style | No visible box | Glass-morphism (border, gradient, blur) |
| Unit gap | 40px | 60px |
| Heading text | "Coming soon" | "Sự kiện sẽ bắt đầu sau" |
| Gradient angle | 12deg | 18deg |
| Header/Footer | Yes | No |
| Other sections | Awards, Kudos, etc. | Countdown only |

---

## Notes

- The prelaunch page shares the same background image (keyvisual) as the Homepage SAA but uses a different gradient overlay angle (18deg vs 12deg)
- Digit boxes use **glass-morphism** effect: semi-transparent gradient background + gold border + backdrop-filter blur
- The page has NO header, NO footer, NO navigation — it's a standalone holding page shown before the event launches
- The `Digital Numbers` font is shared with the Homepage SAA countdown (self-hosted)
- Page background color `#00101A` is shared across Login, Homepage, and Prelaunch
