# Design Style: Login

**Frame ID**: `GzbNeVGJHz` (Figma node: `662:14387`)
**Frame Name**: `Login`
**Figma Link**: https://momorph.ai/files/9ypp4enmFmdK3YAFJLIu6C/frames/GzbNeVGJHz
**Extracted At**: 2026-04-08

---

## Design Tokens

### Colors

| Token Name | Hex Value | Opacity | Usage |
|------------|-----------|---------|-------|
| `--color-bg-page` | #00101A | 100% | Page background (full screen) |
| `--color-header-bg` | #0B0F12 | 80% | Header background (semi-transparent) |
| `--color-btn-login-bg` | #FFEA9E | 100% | "LOGIN With Google" button background |
| `--color-btn-login-text` | #00101A | 100% | Login button text color |
| `--color-text-primary` | #FFFFFF | 100% | Hero text, copyright, language code |
| `--color-divider` | #2E3940 | 100% | Footer top border |
| `--color-error` | #FF4D4F | 100% | Error message text (auth failure) |
| `--color-gradient-hero` | `linear-gradient(90deg, #00101A 0%, #00101A 25.41%, rgba(0,16,26,0) 100%)` | — | Left-to-right gradient overlay on hero (Rectangle 57) |
| `--color-gradient-footer` | `linear-gradient(0deg, #00101A 22.48%, rgba(0,19,32,0) 51.74%)` | — | Bottom-to-top gradient overlay (Cover) |

### Typography

| Token Name | Font Family | Size | Weight | Line Height | Letter Spacing |
|------------|-------------|------|--------|-------------|----------------|
| `--text-hero-cta` | Montserrat | 20px | 700 | 40px | 0.5px |
| `--text-btn-login` | Montserrat | 22px | 700 | 28px | 0px |
| `--text-lang-code` | Montserrat | 16px | 700 | 24px | 0.15px |
| `--text-footer` | Montserrat Alternates | 16px | 700 | 24px | 0% |
| `--text-error` | Montserrat | 14px | 500 | 20px | 0px |

### Spacing

| Token Name | Value | Usage |
|------------|-------|-------|
| `--spacing-header-px` | 144px | Header horizontal padding |
| `--spacing-header-py` | 12px | Header vertical padding |
| `--spacing-hero-px` | 144px | Hero section horizontal padding |
| `--spacing-hero-py` | 96px | Hero section vertical padding |
| `--spacing-hero-gap` | 120px | Gap between hero sections |
| `--spacing-footer-px` | 90px | Footer horizontal padding |
| `--spacing-footer-py` | 40px | Footer vertical padding |
| `--spacing-btn-login-px` | 24px | Login button horizontal padding |
| `--spacing-btn-login-py` | 16px | Login button vertical padding |
| `--spacing-btn-lang-p` | 16px | Language button padding |
| `--spacing-lang-inner-gap` | 4px | Language flag+text gap |

### Border & Radius

| Token Name | Value | Usage |
|------------|-------|-------|
| `--radius-btn-login` | 8px | Login button border radius |
| `--radius-btn-lang` | 4px | Language toggle button radius |
| `--border-footer-top` | 1px solid #2E3940 | Footer top divider |

### Shadows

No explicit shadows defined for this screen. Login button hover effect (per spec): subtle elevation (`box-shadow: 0 4px 12px rgba(255,234,158,0.3)`).

---

## Layout Specifications

### Container

| Property | Value | Notes |
|----------|-------|-------|
| width | 1440px | Design canvas (desktop) |
| height | 1024px | Design canvas (desktop) |
| background | #00101A | Dark navy |

### Layout Structure (ASCII)

```
┌──────────────────────────────────────────────────────────────────────────┐
│  PAGE (1440×1024px, bg: #00101A)                                         │
│                                                                          │
│  ┌────────────────────────────────────────────────────────────────────┐  │
│  │  A_Header (1440×80px, px:144px, py:12px, bg: rgba(11,15,18,0.8))  │  │
│  │  ┌────────────────┐                  ┌──────────────────────────┐  │  │
│  │  │ A.1_Logo       │                  │ A.2_Language (108×56px)  │  │  │
│  │  │ (52×56px)      │                  │ [🇻🇳 VN ▾] (4px radius) │  │  │
│  │  └────────────────┘                  └──────────────────────────┘  │  │
│  └────────────────────────────────────────────────────────────────────┘  │
│                                                                          │
│  ┌────────────────────────────────────────────────────────────────────┐  │
│  │  C_Keyvisual (bg artwork full canvas, absolute)                    │  │
│  │  + Rectangle 57 (gradient: #00101A → transparent, left to right)  │  │
│  │  + Cover (gradient: transparent → #00101A, top to bottom)         │  │
│  └────────────────────────────────────────────────────────────────────┘  │
│                                                                          │
│  ┌────────────────────────────────────────────────────────────────────┐  │
│  │  B_Bìa (1440×845px, py:96px, px:144px, gap:120px, flex-col)       │  │
│  │                                                                    │  │
│  │  ┌──────────────────────────────────────────────────────────────┐ │  │
│  │  │  B.1_Key Visual (451×200px)                                  │ │  │
│  │  │  "ROOT FURTHER" artwork/logo image                           │ │  │
│  │  └──────────────────────────────────────────────────────────────┘ │  │
│  │                                                                    │  │
│  │  ┌──────────────────────────────────────────────────────────────┐ │  │
│  │  │  Frame 550 (gap:24px, pl:16px, flex-col)                     │ │  │
│  │  │                                                              │ │  │
│  │  │  B.2_content (480×80px)                                      │ │  │
│  │  │  "Bắt đầu hành trình của bạn cùng SAA 2025.                  │ │  │
│  │  │   Đăng nhập để khám phá!"                                    │ │  │
│  │  │  [Montserrat 20px/700/40px line-height/#FFFFFF]               │ │  │
│  │  │                                                              │ │  │
│  │  │  B.3_Login Button (305×60px)                                 │ │  │
│  │  │  [LOGIN With Google] [Google icon 24×24]                     │ │  │
│  │  │  [bg:#FFEA9E, radius:8px, px:24px, py:16px]                  │ │  │
│  │  └──────────────────────────────────────────────────────────────┘ │  │
│  └────────────────────────────────────────────────────────────────────┘  │
│                                                                          │
│  ┌────────────────────────────────────────────────────────────────────┐  │
│  │  D_Footer (px:90px, py:40px, border-top: 1px solid #2E3940)       │  │
│  │  "Bản quyền thuộc về Sun* © 2025"                                 │  │
│  │  [Montserrat Alternates 16px/700/24px/#FFFFFF, centered]          │  │
│  └────────────────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────────────────┘
```

---

## Component Style Details

### A_Header — Top Navigation Bar

| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | `662:14391` | — |
| width | 1440px | `width: 100%` |
| height | 80px | `height: 80px` |
| padding | 12px 144px | `padding: 12px 144px` |
| background | rgba(11,15,18,0.8) | `background-color: rgba(11,15,18,0.8)` |
| display | flex | `display: flex` |
| flex-direction | row | `flex-direction: row` |
| justify-content | space-between | `justify-content: space-between` |
| align-items | center | `align-items: center` |
| position | absolute / sticky | `position: sticky; top: 0; z-index: 10` |

---

### A.1_Logo — Sun Annual Awards Logo

| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | `I662:14391;186:2166` | — |
| width | 52px | `width: 52px` |
| height | 56px | `height: 56px` |
| interaction | None (non-clickable) | — |

---

### A.2_Language — Language Selector Toggle

| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | `I662:14391;186:1601` | — |
| width | 108px | `width: 108px` |
| height | 56px | `height: 56px` |
| padding | 16px | `padding: 16px` |
| border-radius | 4px | `border-radius: 4px` |
| display | flex | `display: flex` |
| flex-direction | row | `flex-direction: row` |
| justify-content | space-between | `justify-content: space-between` |
| align-items | center | `align-items: center` |
| gap | 2px | `gap: 2px` |
| cursor | pointer | `cursor: pointer` |

**Inner elements:**
- Flag icon: 24×24px (Vietnam flag SVG)
- Language code text ("VN"): Montserrat 16px 700 #FFFFFF, letter-spacing 0.15px
- Chevron icon (down arrow): 24×24px

**States:**

| State | Changes |
|-------|---------|
| Default | Background: transparent |
| Hover | Background: rgba(255,255,255,0.08), cursor: pointer |
| Focus | outline: 2px solid rgba(255,255,255,0.5), outline-offset: 2px (keyboard nav) |
| Active/Open | Chevron rotates 180°, dropdown visible |
| Disabled | opacity: 0.4, cursor: not-allowed (nếu cần trong tương lai) |

---

### B.1_Key Visual — ROOT FURTHER Brand Image

| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | `662:14395` | — |
| width | 451px | `width: 451px` |
| height | 200px | `height: 200px` |
| content | Image (ROOT FURTHER artwork from `MM_MEDIA_Root Further Logo`) | `<Image>` component |
| aspect-ratio | 115/51 | `aspect-ratio: 115/51` |

---

### B.2_content — Hero Description Text

| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | `662:14753` | — |
| width | 480px | `max-width: 480px` |
| height | 80px | auto |
| font-family | Montserrat | `font-family: 'Montserrat', sans-serif` |
| font-size | 20px | `font-size: 20px` |
| font-weight | 700 | `font-weight: 700` |
| line-height | 40px | `line-height: 40px` |
| letter-spacing | 0.5px | `letter-spacing: 0.5px` |
| color | #FFFFFF | `color: white` |
| text-align | left | `text-align: left` |

Content (2 lines):
```
Bắt đầu hành trình của bạn cùng SAA 2025.
Đăng nhập để khám phá!
```

---

### B.3_Login — "LOGIN With Google" Button

| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | `662:14425` / `662:14426` | — |
| width | 305px | `width: 305px` |
| height | 60px | `height: 60px` |
| padding | 16px 24px | `padding: 16px 24px` |
| background | #FFEA9E | `background-color: var(--color-btn-login-bg)` |
| border-radius | 8px | `border-radius: 8px` |
| display | flex | `display: flex` |
| flex-direction | row | `flex-direction: row` |
| align-items | center | `align-items: center` |
| gap | 8px | `gap: 8px` |
| cursor | pointer | `cursor: pointer` |

**Text ("LOGIN With Google"):**
| Property | Value |
|----------|-------|
| font-family | Montserrat |
| font-size | 22px |
| font-weight | 700 |
| line-height | 28px |
| letter-spacing | 0px |
| color | #00101A |

**Google icon:** 24×24px (SVG component, **nằm bên phải text** — thứ tự trong Figma: text node startX:184→endX:409, icon startX:417→endX:441)

**States:**

| State | Changes |
|-------|---------|
| Default | background: #FFEA9E |
| Hover | background: #FFE07A, box-shadow: 0 4px 12px rgba(255,234,158,0.3), transform: translateY(-1px) |
| Active | background: #FFD54F, transform: translateY(0) |
| Disabled/Loading | background: #FFEA9E, opacity: 0.6, cursor: not-allowed; spinner icon thay thế Google icon |
| Focus | outline: 2px solid #FFFFFF, outline-offset: 3px (`#FFEA9E` trên `#FFEA9E` vô hình — dùng trắng để đạt WCAG AA) |

---

### B.3_ErrorMessage — Auth Error Text

Hiển thị bên dưới nút login khi xác thực thất bại. Không có trong Figma design (error state chưa được thiết kế) — style được xác nhận bởi team.

| Property | Value | CSS |
|----------|-------|-----|
| position | Bên dưới B.3_Login button | `margin-top: 8px` |
| font-family | Montserrat | `font-family: 'Montserrat', sans-serif` |
| font-size | 14px | `font-size: 14px` |
| font-weight | 500 | `font-weight: 500` |
| line-height | 20px | `line-height: 20px` |
| color | #FF4D4F | `color: var(--color-error)` |
| text-align | left | `text-align: left` |
| max-width | 305px | khớp với width của login button |

**ARIA:** `role="alert"` + `aria-live="assertive"` — được announce ngay khi xuất hiện.

---

### D_Footer — Copyright Bar

| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | `662:14447` | — |
| width | 1440px | `width: 100%` |
| padding | 40px 90px | `padding: 40px 90px` |
| border-top | 1px solid #2E3940 | `border-top: 1px solid var(--color-divider)` |
| display | flex | `display: flex` |
| align-items | center | `align-items: center` |
| justify-content | center | `justify-content: center` (text nằm giữa x≈720/1440px — Figma dùng space-between nhưng chỉ có 1 child, intent là center) |

**Copyright text:**
| Property | Value |
|----------|-------|
| font-family | Montserrat Alternates |
| font-size | 16px |
| font-weight | 700 |
| line-height | 24px |
| color | #FFFFFF |
| text-align | center |

Content: `Bản quyền thuộc về Sun* © 2025`

---

## Component Hierarchy with Styles

```
Login Page (bg: #00101A, min-h: 100vh)
├── A_Header (h:80px, px:144px, bg:rgba(11,15,18,0.8), sticky top-0 z-10)
│   ├── A.1_Logo (w:52px, h:56px, non-interactive)
│   └── A.2_Language (w:108px, h:56px, p:16px, radius:4px, cursor:pointer)
│       ├── Flag icon (24×24px)
│       ├── "VN" text (Montserrat 16px/700/#FFF)
│       └── Chevron down icon (24×24px)
│
├── C_Keyvisual (absolute, full canvas, background artwork)
├── Rectangle 57 (absolute, gradient left→right: #00101A→transparent)
├── Cover (absolute, gradient top→bottom: transparent→#00101A)
│
├── B_Bìa (py:96px, px:144px, gap:120px, flex-col)
│   ├── B.1_Key Visual (451×200px, ROOT FURTHER brand image)
│   └── Frame 550 (flex-col, gap:24px, pl:16px)
│       ├── B.2_content (Montserrat 20px/700/40px/0.5px, #FFF, max-w:480px)
│       └── B.3_Login Button (305×60px, bg:#FFEA9E, px:24px, py:16px, radius:8px)
│           ├── "LOGIN With Google" text (Montserrat 22px/700/#00101A)
│           └── Google icon (24×24px)
│
└── D_Footer (px:90px, py:40px, border-top:1px solid #2E3940)
    └── Copyright text (Montserrat Alternates 16px/700/#FFF)
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
| A_Header | padding: 12px 16px |
| A.2_Language | width: auto |
| B_Bìa | padding: 48px 16px, gap: 40px |
| B.1_Key Visual | width: 100%, max-width: 280px |
| B.2_content | font-size: 16px, line-height: 28px, max-width: 100% |
| B.3_Login | width: 100% |
| D_Footer | padding: 24px 16px |

#### Tablet (768px – 1023px)

| Component | Changes |
|-----------|---------|
| A_Header | padding: 12px 48px |
| B_Bìa | padding: 64px 48px, gap: 64px |
| B.1_Key Visual | max-width: 320px |
| D_Footer | padding: 32px 48px |

#### Desktop (≥ 1024px)

| Component | Changes |
|-----------|---------|
| All | Follow Figma spec at 1440px |

---

## Icon Specifications

| Icon Name | Size | Color | Usage |
|-----------|------|-------|-------|
| Vietnam Flag | 24×24px | — | Language selector (left) |
| Chevron Down | 24×24px | #FFFFFF | Language selector (right) |
| Google Logo | 24×24px | Multicolor | Login button (right of text) |
| Spinner | 24×24px | #00101A | Login button loading state |

All icons MUST be implemented as SVG components, not `<img>` tags.

---

## Animation & Transitions

| Element | Property | Duration | Easing | Trigger |
|---------|----------|----------|--------|---------|
| B.3_Login | background-color, box-shadow, transform | 150ms | ease-in-out | Hover |
| B.3_Login | opacity | 200ms | ease | Loading state |
| A.2_Language | background-color | 150ms | ease-in-out | Hover |
| A.2_Language chevron | transform (rotate 180°) | 200ms | ease-in-out | Dropdown open |

---

## Implementation Mapping

| Design Element | Figma Node ID | Tailwind Class suggestion | React Component |
|----------------|---------------|--------------------------|-----------------|
| Page | `662:14387` | `min-h-screen bg-[#00101A]` | `<LoginPage>` |
| Header | `662:14391` | `sticky top-0 z-10 flex items-center justify-between px-36 py-3` | `<Header>` |
| Logo | `I662:14391;186:2166` | `w-[52px] h-[56px]` | `<Logo>` |
| Language toggle | `I662:14391;186:1601` | `flex items-center gap-1 p-4 rounded cursor-pointer hover:bg-white/5` | `<LanguageToggle>` |
| Hero section | `662:14393` | `flex flex-col py-24 px-36 gap-[120px]` | `<HeroSection>` |
| Key Visual | `662:14395` | `w-[451px] h-[200px]` | `<KeyVisual>` |
| Hero text | `662:14753` | `text-white font-bold text-xl leading-10 tracking-[0.5px]` | `<p>` |
| Login button | `662:14425` | `flex items-center gap-2 px-6 py-4 bg-[#FFEA9E] rounded-lg text-[#00101A] font-bold text-[22px] w-[305px] h-[60px] cursor-pointer hover:shadow-lg` | `<LoginButton>` |
| Error message | N/A (not in Figma) | `mt-2 text-sm font-medium text-[#FF4D4F] max-w-[305px]` | `<p role="alert" aria-live="assertive">` |
| Footer | `662:14447` | `flex items-center justify-center px-[90px] py-10 border-t border-[#2E3940]` | `<Footer>` |

---

## Notes

- All colors MUST use CSS variables defined in `src/app/globals.css`.
- Google icon MUST be an SVG component (not `<img>`), per `frontend.md` guidelines.
- The background artwork (`C_Keyvisual`) is a media asset — fetch via `MM_MEDIA_Root Further Logo` from MoMorph.
- The ROOT FURTHER logo image (`B.1_Key Visual`) should be placed under `public/assets/login/images/root-further-logo.png`.
- Google OAuth brand icon should be placed under `public/assets/login/icons/google-icon.svg`.
- Ensure WCAG AA contrast: `#00101A` on `#FFEA9E` → contrast ratio ≈ 12.6:1 ✅
