# Implementation Plan: Login

**Frame**: `GzbNeVGJHz-Login`
**Date**: 2026-04-08
**Spec**: `specs/GzbNeVGJHz-Login/spec.md`

---

## Summary

Xây dựng màn hình Login cho SAA 2025 với luồng xác thực Google OAuth duy nhất thông qua Supabase Auth.
Trang là một hero page full-screen tối màu với nút "LOGIN With Google" và language selector.
Backend đã có sẵn Supabase helpers — chủ yếu cần tạo: root middleware, auth callback route handler,
login page, components, và bổ sung design tokens vào globals.css.

---

## Technical Context

**Language/Framework**: TypeScript / Next.js 15 (App Router)
**Primary Dependencies**: React 19, TailwindCSS v4, @supabase/ssr ^2.x
**Database**: Supabase (Auth only — user data managed bởi Supabase Auth)
**Testing**: Jest + React Testing Library (cần thêm — chưa có trong package.json)
**State Management**: Component local state (`isLoading`, `error`), `localStorage` cho language
**API Style**: Supabase Auth SDK (`signInWithOAuth`, `exchangeCodeForSession`)
**Deployment**: Cloudflare Workers via OpenNext

---

## Constitution Compliance Check

*GATE: Must pass before implementation can begin*

- [x] Follows project coding conventions (kebab-case modules, PascalCase components)
- [x] Uses approved libraries: Supabase Auth, Next.js App Router, TailwindCSS v4
- [x] Adheres to folder structure: `src/app/`, `src/components/`, `src/libs/`, `src/services/`, `src/hooks/`
- [x] Meets security requirements: OAuth via Supabase, `redirectTo` env-based, no hardcoded secrets
- [x] Follows testing standards: TDD — viết tests trước khi implement

**Violations (nếu có)**:

| Violation | Justification | Alternative Rejected |
|-----------|---------------|---------------------|
| Thêm Jest + React Testing Library | Constitution Principle III yêu cầu TDD, chưa có test runner | Vitest — chọn Jest vì phổ biến hơn với Next.js ecosystem |

---

## Architecture Decisions

### Frontend Approach

- **Component Structure**: Feature-based — tất cả components của Login nằm trong `src/components/login/`
- **Styling Strategy**: TailwindCSS v4 utilities + CSS variables từ `globals.css` — không hardcode màu
- **Data Fetching**: Không fetch data ở Login page. Server Component kiểm tra session, Client Component xử lý OAuth click.
- **Login page** (`src/app/(auth)/login/page.tsx`): Server Component — đọc session server-side, redirect nếu đã login.
- **LoginButton** (`src/components/login/LoginButton.tsx`): `'use client'` — quản lý `isLoading`, `error` state, gọi Supabase `signInWithOAuth`.
- **LanguageToggle** (`src/components/login/LanguageToggle.tsx`): `'use client'` — đọc/ghi `localStorage`, toggle dropdown.

### Backend Approach

- **Auth Callback**: `src/app/auth/callback/route.ts` — Next.js Route Handler (GET), nhận `code` từ Google OAuth, gọi `exchangeCodeForSession`, redirect về `/`.
- **Middleware**: `src/middleware.ts` (root level) — dùng helper `src/libs/supabase/middleware.ts` để refresh session trên mọi request; redirect về `/auth/login` nếu truy cập protected route không có session.
- **Service layer**: `src/services/auth-service.ts` — encapsulate `signInWithOAuth` call để có thể test độc lập.

### Integration Points

- **Existing Services**: `src/libs/supabase/client.ts`, `src/libs/supabase/server.ts`, `src/libs/supabase/middleware.ts` — tất cả đã có sẵn, tái sử dụng trực tiếp.
- **Shared Components**: `<Header>`, `<Footer>` có thể tái sử dụng cho các màn hình khác — tạo trong `src/components/layout/`.
- **API Contracts**: Supabase Auth SDK — không cần custom API contracts.

---

## Project Structure

### Documentation (this feature)

```text
.momorph/specs/GzbNeVGJHz-Login/
├── spec.md              ✅ Feature specification
├── design-style.md      ✅ Design specifications
├── plan.md              ← file này
├── tasks.md             (bước tiếp theo)
└── assets/frame.png     ✅
```

### Source Code (files cần tạo/sửa)

```text
# Tạo mới
src/
├── middleware.ts                              ← Root middleware (session refresh + route protection)
├── app/
│   ├── (auth)/
│   │   ├── layout.tsx                         ← Auth group layout (redirect nếu đã login)
│   │   └── login/
│   │       └── page.tsx                       ← Login page (Server Component)
│   └── auth/
│       └── callback/
│           └── route.ts                       ← OAuth callback Route Handler
├── components/
│   ├── login/
│   │   ├── LoginButton.tsx                    ← "LOGIN With Google" button (Client Component)
│   │   └── LanguageToggle.tsx                 ← Language selector (Client Component)
│   └── layout/
│       ├── Header.tsx                         ← Header tái sử dụng
│       └── Footer.tsx                         ← Footer tái sử dụng
├── services/
│   └── auth-service.ts                        ← Business logic: signInWithOAuth
├── hooks/
│   └── use-language.ts                        ← localStorage language hook
└── types/
    └── auth.ts                                ← AuthError, LoginState types

# Sửa
src/app/layout.tsx                             ← Thêm Montserrat + Montserrat Alternates fonts
src/app/globals.css                            ← Thêm toàn bộ design tokens từ design-style.md

# Assets (tải từ MoMorph)
public/assets/login/
├── logos/
│   └── saa-logo.png                           ← Node I662:14391;178:1033;178:1030
├── images/
│   └── root-further.png                       ← Node 2939:9548 (ROOT FURTHER key visual)
└── icons/
    ├── google-icon.svg                        ← Node I662:14426;186:1766
    ├── vn-flag.svg                            ← Node I662:14391;186:1696;186:1821;186:1709
    └── chevron-down.svg                       ← Tự tạo (null từ MoMorph)

# Tests (viết TRƯỚC khi implement)
src/__tests__/
├── auth/
│   └── callback.test.ts                       ← Integration test: OAuth callback route
├── components/login/
│   ├── LoginButton.test.tsx                   ← Unit test: states, click handler
│   └── LanguageToggle.test.tsx                ← Unit test: localStorage, dropdown
└── hooks/
    └── use-language.test.ts                   ← Unit test: read/write localStorage
```

### Dependencies cần thêm

| Package | Version | Purpose |
|---------|---------|---------|
| `jest` | ^29 | Test runner |
| `@testing-library/react` | ^16 | Component testing |
| `@testing-library/jest-dom` | ^6 | Custom matchers |
| `jest-environment-jsdom` | ^29 | Browser env cho Jest |
| `ts-jest` | ^29 | TypeScript support trong Jest |

---

## Phase 0: Asset Preparation

Download tất cả media assets từ MoMorph trước khi implement UI.

| Asset | MoMorph Node ID | URL (tạm thời — có expiry) | Đích |
|-------|----------------|---------------------------|------|
| SAA Logo | `I662:14391;178:1033;178:1030` | *(link từ get_media_files)* | `public/assets/login/logos/saa-logo.png` |
| Vietnam Flag | `I662:14391;186:1696;186:1821;186:1709` | *(link từ get_media_files)* | `public/assets/login/icons/vn-flag.svg` |
| ROOT FURTHER | `2939:9548` | *(link từ get_media_files)* | `public/assets/login/images/root-further.png` |
| Google Icon | `I662:14426;186:1766` | *(link từ get_media_files)* | `public/assets/login/icons/google-icon.svg` |
| Chevron Down | N/A (null) | Tự tạo SVG inline | `public/assets/login/icons/chevron-down.svg` |
| BG Keyvisual | `662:14388` (via frame image) | *(từ frame screenshot)* | `public/assets/login/images/keyvisual-bg.png` |

---

## Implementation Strategy

### Phase 1: Foundation (Blocking — tất cả phases sau đều cần)

**Mục tiêu**: Infrastructure sẵn sàng để implement feature

1. **Setup Jest** — cài packages, cấu hình `jest.config.ts`, `jest.setup.ts`
2. **Cập nhật `globals.css`** — thêm toàn bộ CSS variables từ `design-style.md`:
   - Colors: `--color-bg-page`, `--color-header-bg`, `--color-btn-login-bg`, v.v.
   - Fonts cần thêm vào `layout.tsx`: `Montserrat`, `Montserrat_Alternates` (từ `next/font/google`)
3. **Cập nhật `src/app/layout.tsx`** — inject Montserrat font variables
4. **Tạo `src/middleware.ts`** (root) — session refresh + route protection
5. **Tạo `src/app/auth/callback/route.ts`** — OAuth callback handler
6. **Tạo `src/types/auth.ts`** — types dùng chung

**Checkpoint**: `yarn dev` chạy được, middleware hoạt động.

### Phase 2: User Story 1 — Authenticate via Google (P1)

**Mục tiêu**: User có thể click "LOGIN With Google" và hoàn thành Google OAuth

**TDD order** (bắt buộc):
1. Viết tests → confirm FAIL → implement → confirm PASS

#### Tests viết trước (Phase 2 — TDD)

```
src/__tests__/auth/callback.test.ts
  ✗ redirects to / on successful code exchange
  ✗ redirects to /auth/login?error=auth_error on failed exchange
  ✗ returns 400 if no code in query params

src/__tests__/components/login/LoginButton.test.tsx
  ✗ renders "LOGIN With Google" text and Google icon
  ✗ shows spinner and disables button when isLoading=true
  ✗ calls signInWithGoogle on click
  ✗ displays error message below button when error is set
  ✗ error element has role="alert" and aria-live="assertive"
  ✗ focus ring is visible (outline: 2px solid #FFFFFF)

src/__tests__/services/auth-service.test.ts
  ✗ signInWithGoogle calls supabase.auth.signInWithOAuth with correct params
  ✗ signInWithGoogle passes redirectTo from NEXT_PUBLIC_SITE_URL env
```

#### Implement (sau khi tests FAIL xác nhận):
- `src/services/auth-service.ts`
- `src/components/login/LoginButton.tsx`
- `src/app/(auth)/login/page.tsx` (Server Component shell + LoginButton)
- `src/components/layout/Header.tsx` (logo + language slot)
- `src/components/layout/Footer.tsx` (copyright)
- `src/app/(auth)/layout.tsx` (redirect authenticated users)

**Checkpoint**: Có thể navigate đến `/auth/login`, click button, hoàn thành Google OAuth, redirect về `/`.

### Phase 3: User Story 2 — Language Toggle (P2)

**TDD order**:
```
src/__tests__/hooks/use-language.test.ts
  ✗ returns 'vn' as default language
  ✗ reads language from localStorage on init
  ✗ setLanguage writes to localStorage
  ✗ setLanguage updates state

src/__tests__/components/login/LanguageToggle.test.tsx
  ✗ renders VN flag and "VN" text
  ✗ opens dropdown on click
  ✗ closes dropdown on outside click
  ✗ chevron rotates 180deg when open
  ✗ selecting language updates localStorage and closes dropdown
```

#### Implement:
- `src/hooks/use-language.ts`
- `src/components/login/LanguageToggle.tsx`
- Tích hợp vào `Header.tsx`

**Checkpoint**: Language toggle mở/đóng, chọn ngôn ngữ được lưu localStorage.

### Phase 4: Polish & Cross-cutting

- Kiểm tra responsive: mobile (< 768px), tablet (768–1023px), desktop (≥ 1024px)
- Kiểm tra keyboard navigation: Tab tới button, Enter để submit, Esc đóng dropdown
- Kiểm tra error states: hiển thị text đỏ dưới button với `role="alert"`
- Kiểm tra loading state: button disabled + spinner thay Google icon
- Kiểm tra redirect: user đã login vào `/auth/login` → redirect về `/`
- Verify WCAG AA: focus ring `#FFFFFF` visible trên nền `#FFEA9E`

---

## Integration Testing Strategy

### Test Scope

- [x] **Component interactions**: LoginButton ↔ auth-service (click → OAuth call)
- [x] **External dependencies**: Supabase Auth Google provider
- [x] **Data layer**: Supabase session cookie creation via `/auth/callback`
- [x] **User workflows**: Full OAuth flow (click → Google consent → callback → redirect)

### Test Categories

| Category | Applicable? | Key Scenarios |
|----------|-------------|---------------|
| UI ↔ Logic | Yes | Button click → isLoading, error display |
| App ↔ External API | Yes | Supabase `signInWithOAuth`, `exchangeCodeForSession` |
| App ↔ Data Layer | Yes | Session cookie set after callback |
| Cross-platform | Yes | Responsive breakpoints, keyboard nav |

### Mocking Strategy

| Dependency | Strategy | Rationale |
|------------|----------|-----------|
| `supabase.auth.signInWithOAuth` | Mock trong unit tests | Không trigger real OAuth trong CI |
| `supabase.auth.exchangeCodeForSession` | Mock trong unit tests | Không cần real Supabase trong CI |
| `localStorage` | jsdom (built-in) | Test môi trường browser |
| `next/navigation` (`redirect`) | Mock | Kiểm tra redirect logic |

### Test Scenarios

1. **Happy Path**
   - [x] Click login → Google OAuth flow được khởi tạo
   - [x] Callback nhận `code` → session được tạo → redirect về `/`
   - [x] Language lưu localStorage → giữ nguyên sau reload

2. **Error Handling**
   - [x] OAuth thất bại → error message hiển thị dưới button
   - [x] Callback không có `code` → redirect về `/auth/login?error=...`
   - [x] User đã login → redirect từ `/auth/login` về `/`

3. **Edge Cases**
   - [x] Double-click login button → chỉ 1 OAuth call (button disabled)
   - [x] localStorage không available → fallback default language 'vn'

---

## Risk Assessment

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Cloudflare Workers không support một số Node.js APIs trong middleware | Medium | High | Test với `wrangler dev` sớm; dùng Edge-compatible APIs |
| Supabase Google OAuth callback URL chưa được cấu hình | Medium | High | Ghi note setup rõ ràng trong task; check env vars |
| `next/font/google` load Montserrat chậm ở Cloudflare Edge | Low | Low | Dùng `display: 'swap'`, preload subset |
| `localStorage` không available trong SSR | Low | Medium | `use-language` hook chỉ chạy sau mount (`useEffect`) |

---

## Dependencies & Prerequisites

### Required Before Start

- [x] `constitution.md` reviewed
- [x] `spec.md` approved (reviewed + clarified)
- [x] `design-style.md` completed
- [x] Supabase helpers đã có (`src/libs/supabase/`)
- [ ] Google OAuth provider cần được enable trong Supabase Dashboard
- [ ] `NEXT_PUBLIC_SITE_URL` env var cần được thêm vào `.env`
- [ ] Supabase Auth callback URL cần được whitelist: `{SITE_URL}/auth/callback`

### Environment Variables cần thêm

```bash
# .env (thêm vào)
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### External Dependencies

- Google Cloud Console: OAuth 2.0 credentials với redirect URI `{SITE_URL}/auth/callback`
- Supabase Dashboard: Authentication → Providers → Google → Enable + cấu hình Client ID/Secret

---

## Notes

- `src/app/auth/callback/route.ts` phải là route handler **không nằm trong** `(auth)` group, vì đây là callback từ Google (không cần auth layout).
- Khi deploy lên Cloudflare, `NEXT_PUBLIC_SITE_URL` phải là production URL. Cần set trong `wrangler.jsonc` vars.
- Background keyvisual image (`C_Keyvisual`) nặng — dùng `next/image` với `priority` và `fill` layout để tối ưu LCP.
- Montserrat Alternates chỉ dùng cho footer — load subset `latin` với `display: 'swap'` để tránh layout shift.

---

## Next Steps

1. **Run** `/momorph.tasks` để tạo task breakdown
2. **Setup**: Cài Jest trước khi bắt đầu implement
3. **TDD**: Viết tests → fail → implement → pass cho từng phase

