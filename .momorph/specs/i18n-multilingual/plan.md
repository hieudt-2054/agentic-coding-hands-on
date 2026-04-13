# Implementation Plan: Multilingual (i18n) — Vietnamese / English

**Feature**: Cross-cutting — affects all screens
**Date**: 2026-04-13
**Status**: Plan

---

## Summary

Add Vietnamese (VN) / English (EN) language support across the entire application. Currently, the `LanguageToggle` stores the user's preference in localStorage but **no component uses it** — all text is hardcoded (mixed VN/EN). This plan implements real translations using a **lightweight dictionary-based approach** (no external library) that works with both Server and Client Components.

**Approach**: Cookie + localStorage for language persistence → dictionary JSON files → `getDictionary()` helper for Server Components → `useTranslation()` hook for Client Components.

---

## Current State Analysis

### What exists
- `src/hooks/use-language.ts` — stores language in localStorage (`'vn'` | `'en'`), default `'vn'`
- `src/components/login/LanguageToggle.tsx` — dropdown UI that saves preference but nothing reads it
- Language flags: VN flag + EN flag SVGs

### What's missing
- **No translation files** — all ~60+ strings are hardcoded
- **No cookie** — Server Components can't read localStorage
- **No translation function** — no `t('key')` pattern
- **No library** — and we won't add one (keep it lightweight)

### Hardcoded strings inventory (~60+ strings across 15+ files)

| Component | Strings | Language |
|-----------|---------|----------|
| AwardsSection | "Sun* annual awards 2025", "Hệ thống giải thưởng" | Mixed |
| CTAButtons | "ABOUT AWARDS", "ABOUT KUDOS" | EN |
| CountdownTimer | "Coming soon" | EN |
| CountdownUnit | "Days", "Hours", "Minutes" | EN |
| EventInfo | "Thời gian:", "Địa điểm:" | VN |
| KudosSection | "Chi tiết" | VN |
| AwardCard | "Chi tiết →" | VN |
| AppHeader | Nav links + aria-labels | Mixed |
| AppFooter | Nav links + copyright | Mixed |
| PrelaunchCountdown | "Sự kiện sẽ bắt đầu sau", "DAYS/HOURS/MINUTES" | Mixed |
| AwardsSectionTitle | Title + caption | Mixed |
| AwardDetailCard | "Số lượng giải thưởng:", "Giá trị giải thưởng:" | VN |
| AwardsSidebar | aria-label | VN |
| LoginPage | Hero text | VN |
| LoginButton | "LOGIN With Google", error message | EN |
| Footer (login) | Copyright text | VN |

---

## Architecture Decisions

### Why no i18n library?

- **No URL-based routing** needed — app is behind authentication, SEO not a concern
- **Only 2 languages** — VN and EN, simple key-value dictionaries
- **Lightweight** — no bundle size impact from i18next/next-intl
- **Works with App Router** — Server Components read cookie, Client Components read localStorage
- Constitution says "no speculative abstractions" — a simple dictionary pattern is sufficient

### Translation system design

```
┌─────────────────────────────────────────────────────┐
│  src/i18n/                                           │
│  ├── dictionaries/                                   │
│  │   ├── vi.ts    ← Vietnamese translations          │
│  │   └── en.ts    ← English translations             │
│  ├── get-dictionary.ts  ← Server: read cookie        │
│  └── use-translation.ts ← Client: hook wrapping      │
│                           useLanguage + dictionary    │
└─────────────────────────────────────────────────────┘

Server Component flow:
  page.tsx → cookies().get('lang') → getDictionary('vi') → pass dict to components

Client Component flow:
  Component → useTranslation() → useLanguage() reads localStorage → getDictionary() → t('key')
```

### Cookie + localStorage dual persistence

When user selects a language in `LanguageToggle`:
1. Save to `localStorage` (existing behavior — for client components)
2. Save to a `lang` cookie via `document.cookie` (NEW — for server components to read)

Server Components read the cookie via `cookies()` from `next/headers`.

### Translation key structure

Flat namespace with dot notation, grouped by screen:

```typescript
// src/i18n/dictionaries/vi.ts
const vi = {
  // Common
  'common.nav.aboutSaa': 'About SAA 2025',
  'common.nav.awards': 'Awards Information',
  'common.nav.kudos': 'Sun* Kudos',
  'common.nav.menu': 'Menu',
  'common.nav.notifications': 'Thông báo',
  'common.nav.account': 'Tài khoản của bạn',
  'common.copyright': 'Bản quyền thuộc về Sun* © 2025',
  'common.detail': 'Chi tiết',

  // Homepage
  'home.comingSoon': 'Coming soon',
  'home.countdown.days': 'DAYS',
  'home.countdown.hours': 'HOURS',
  'home.countdown.minutes': 'MINUTES',
  'home.eventInfo.time': 'Thời gian:',
  'home.eventInfo.venue': 'Địa điểm:',
  'home.cta.aboutAwards': 'ABOUT AWARDS',
  'home.cta.aboutKudos': 'ABOUT KUDOS',
  'home.awards.caption': 'Sun* annual awards 2025',
  'home.awards.title': 'Hệ thống giải thưởng',
  'home.kudos.label': 'Phong trào ghi nhận',

  // Prelaunch
  'prelaunch.heading': 'Sự kiện sẽ bắt đầu sau',

  // Awards page
  'awards.title': 'Hệ thống giải thưởng SAA 2025',
  'awards.caption': 'Sun* annual awards 2025',
  'awards.quantity': 'Số lượng giải thưởng:',
  'awards.prizeValue': 'Giá trị giải thưởng:',
  'awards.sidebar.label': 'Danh mục giải thưởng',
  'awards.empty': 'Chưa có dữ liệu giải thưởng',

  // Login
  'login.hero': 'Bắt đầu hành trình của bạn cùng SAA 2025.\nĐăng nhập để khám phá!',
  'login.button': 'LOGIN With Google',
  'login.error': 'Xác thực thất bại. Vui lòng thử lại.',
  'login.loading': 'Đang tải',
} as const;

export default vi;
```

```typescript
// src/i18n/dictionaries/en.ts
const en = {
  'common.nav.aboutSaa': 'About SAA 2025',
  'common.nav.awards': 'Awards Information',
  'common.nav.kudos': 'Sun* Kudos',
  'common.nav.menu': 'Menu',
  'common.nav.notifications': 'Notifications',
  'common.nav.account': 'Your account',
  'common.copyright': 'Copyright © 2025 Sun* Inc. All rights reserved.',
  'common.detail': 'Details',

  'home.comingSoon': 'Coming soon',
  'home.countdown.days': 'DAYS',
  'home.countdown.hours': 'HOURS',
  'home.countdown.minutes': 'MINUTES',
  'home.eventInfo.time': 'Time:',
  'home.eventInfo.venue': 'Venue:',
  'home.cta.aboutAwards': 'ABOUT AWARDS',
  'home.cta.aboutKudos': 'ABOUT KUDOS',
  'home.awards.caption': 'Sun* annual awards 2025',
  'home.awards.title': 'Award Categories',
  'home.kudos.label': 'Recognition Movement',

  'prelaunch.heading': 'Event starts in',

  'awards.title': 'SAA 2025 Award Categories',
  'awards.caption': 'Sun* annual awards 2025',
  'awards.quantity': 'Number of awards:',
  'awards.prizeValue': 'Prize value:',
  'awards.sidebar.label': 'Award Categories',
  'awards.empty': 'No award data available',

  'login.hero': 'Start your journey with SAA 2025.\nLog in to explore!',
  'login.button': 'LOGIN With Google',
  'login.error': 'Authentication failed. Please try again.',
  'login.loading': 'Loading',
} as const;

export default en;
```

---

## Project Structure

### New Files

| File | Purpose | Type |
|------|---------|------|
| `src/i18n/dictionaries/vi.ts` | Vietnamese translations | Dictionary |
| `src/i18n/dictionaries/en.ts` | English translations | Dictionary |
| `src/i18n/get-dictionary.ts` | Server-side: read cookie → return dictionary | Utility |
| `src/i18n/use-translation.ts` | Client-side: hook wrapping useLanguage + dictionary | Hook |
| `src/i18n/types.ts` | `Dictionary` type, `Locale` type | Types |

### Modified Files

| File | What Changes |
|------|-------------|
| `src/hooks/use-language.ts` | Also set `lang` cookie when language changes (for SSR) |
| `src/components/login/LanguageToggle.tsx` | Set cookie alongside localStorage on language change |
| `src/app/page.tsx` | Read cookie → pass `dict` to components |
| `src/app/awards/page.tsx` | Read cookie → pass `dict` to components |
| `src/app/prelaunch/page.tsx` | Read cookie → pass `dict` to components |
| `src/app/auth/login/page.tsx` | Read cookie → pass `dict` to components |
| `src/components/homepage/AwardsSection.tsx` | Replace hardcoded strings with `dict.*` props |
| `src/components/homepage/CTAButtons.tsx` | Replace hardcoded strings |
| `src/components/homepage/CountdownTimer.tsx` | Replace hardcoded strings |
| `src/components/homepage/CountdownUnit.tsx` | Accept label as prop (already does) |
| `src/components/homepage/EventInfo.tsx` | Replace "Thời gian:", "Địa điểm:" |
| `src/components/homepage/KudosSection.tsx` | Replace "Chi tiết" |
| `src/components/homepage/AwardCard.tsx` | Replace "Chi tiết →" |
| `src/components/layout/AppHeader.tsx` | Replace nav labels + aria-labels |
| `src/components/layout/AppFooter.tsx` | Replace nav labels + copyright |
| `src/components/prelaunch/PrelaunchCountdown.tsx` | Replace heading + labels |
| `src/components/awards/AwardsSectionTitle.tsx` | Replace title + caption |
| `src/components/awards/AwardDetailCard.tsx` | Replace metadata labels |
| `src/components/awards/AwardsSidebar.tsx` | Replace aria-label |
| `src/components/login/LoginButton.tsx` | Replace button text + error |

### Dependencies

No new npm packages required.

---

## Implementation Strategy

### Phase 1: Foundation — Translation System

1. Create `src/i18n/types.ts` — `Locale` type (`'vi' | 'en'`), `Dictionary` type
2. Create `src/i18n/dictionaries/vi.ts` — all Vietnamese translations
3. Create `src/i18n/dictionaries/en.ts` — all English translations
4. Create `src/i18n/get-dictionary.ts` — `getDictionary(locale: Locale)` reads cookie, returns dict. Used in Server Components.
5. Create `src/i18n/use-translation.ts` — `useTranslation()` hook for Client Components. Reads `useLanguage()` → returns `{ t, locale }` where `t(key)` looks up translation.
6. Update `src/hooks/use-language.ts` — add cookie setting alongside localStorage:
   ```typescript
   const setLanguage = (lang: string) => {
     setLang(lang);
     localStorage.setItem('lang', lang);
     document.cookie = `lang=${lang};path=/;max-age=31536000`;
   };
   ```

### Phase 2: Integrate — Server Components (pages)

Update each page Server Component to read the cookie and pass dictionary:

```typescript
// Pattern for every page:
import { getDictionary } from '@/i18n/get-dictionary';

export default async function Page() {
  const dict = await getDictionary();
  // ... pass dict to child components as props
}
```

Affected pages: `page.tsx` (home), `awards/page.tsx`, `prelaunch/page.tsx`, `auth/login/page.tsx`.

Server Components receive `dict` as props and use `dict['key']` directly — no hook needed.

### Phase 3: Integrate — Client Components

Client Components use `useTranslation()` hook:

```typescript
const { t } = useTranslation();
// ... use t('home.comingSoon') instead of 'Coming soon'
```

Affected: `CountdownTimer`, `PrelaunchCountdown`, `AppHeader` (hamburger menu), `WidgetButton`, `LoginButton`, `LanguageToggle`.

### Phase 4: Test + Verify

1. Update existing tests — mock dictionary or pass it as props
2. Verify VN renders correctly (default)
3. Switch to EN in browser → verify ALL text changes
4. Run full test suite — no regressions

---

## Risk Assessment

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Cookie not set on first visit | Medium | Low | `getDictionary()` defaults to `'vi'` if no cookie |
| Props drilling dict through many levels | Medium | Medium | Keep dict passing shallow (page → direct children only); Client Components use hook |
| Missing translation key | Low | Medium | `t()` returns the key itself as fallback — visible in UI, easy to spot |
| Test breakage from string changes | High | Medium | Update test assertions to use translation keys or expected text |

### Estimated Complexity

- **Frontend**: Medium (5 new files, ~20 modified files — but changes are mechanical string replacements)
- **Backend**: None
- **Testing**: Medium (many test assertions reference hardcoded strings)

---

## Decisions (confirmed by user)

- **Q1**: DB content stays Vietnamese — only UI labels/chrome translated ✅
- **Q2**: Prelaunch page supports EN ✅
- **Q3**: JS-accessible cookie (simplest approach) ✅

---

## Notes

- This is a **cross-cutting feature** that touches almost every component. The changes per file are small (string replacements) but the total scope is wide.
- The pattern is deliberately simple: no library, no URL routing, no middleware changes. Just dictionary files + a cookie + a hook.
- DB content (award titles, descriptions, kudos text) stays in Vietnamese. Only UI chrome/labels are translated.
- The `LanguageToggle` UI already works correctly — we just need to make the rest of the app actually USE the stored preference.
