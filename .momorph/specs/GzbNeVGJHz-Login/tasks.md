# Tasks: Login

**Frame**: `GzbNeVGJHz-Login`
**Prerequisites**: plan.md ✅ spec.md ✅ design-style.md ✅
**Generated**: 2026-04-12

---

## Task Format

```
- [x] T### [P?] [Story?] Description | file/path.ts
```

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this belongs to (US1, US2)
- **|**: File path affected by this task

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization, testing infrastructure, assets, and environment setup

- [x] T001 Cài đặt Jest + React Testing Library dependencies: `jest@^29 @testing-library/react@^16 @testing-library/jest-dom@^6 jest-environment-jsdom@^29 ts-jest@^29` | package.json
- [x] T002 Tạo Jest configuration file | jest.config.ts
- [x] T003 Tạo Jest setup file với `@testing-library/jest-dom` import | jest.setup.ts
- [x] T004 Thêm `NEXT_PUBLIC_SITE_URL=http://localhost:3000` vào environment config | .env.local
- [x] T005 [P] Tải asset SAA Logo từ MoMorph node `I662:14391;178:1033;178:1030` | public/assets/login/logos/saa-logo.png
- [x] T006 [P] Tải asset Vietnam Flag từ MoMorph node `I662:14391;186:1696;186:1821;186:1709` | public/assets/login/icons/vn-flag.svg
- [x] T007 [P] Tải asset ROOT FURTHER keyvisual từ MoMorph node `2939:9548` | public/assets/login/images/root-further.png
- [x] T008 [P] Tải asset Google Icon từ MoMorph node `I662:14426;186:1766` | public/assets/login/icons/google-icon.svg
- [x] T009 [P] Tạo Chevron Down SVG icon (tự tạo — MoMorph trả null) | public/assets/login/icons/chevron-down.svg

---

## Phase 2: Foundation (Blocking Prerequisites)

**Purpose**: Core infrastructure required by ALL user stories — PHẢI hoàn thành trước khi bắt đầu Phase 3+

**⚠️ CRITICAL**: Không bắt đầu user story nào cho đến khi phase này hoàn tất

- [x] T010 Thêm toàn bộ CSS design tokens vào globals.css: colors, typography, spacing, border, shadows (từ design-style.md) | src/app/globals.css
- [x] T011 Cập nhật root layout: thêm `Montserrat` + `Montserrat_Alternates` font từ `next/font/google`, inject CSS variables | src/app/layout.tsx
- [x] T012 [P] Tạo shared types file: `AuthError`, `LoginState` types | src/types/auth.ts
- [x] T013 Tạo root middleware: session refresh + route protection (redirect về `/auth/login` nếu unauthenticated) dùng `src/libs/supabase/middleware.ts` | src/middleware.ts
- [x] T014 Tạo OAuth callback Route Handler: nhận `code` từ Google, gọi `exchangeCodeForSession`, redirect về `/` khi thành công hoặc `/auth/login?error=auth_error` khi thất bại | src/app/auth/callback/route.ts

**Checkpoint**: `yarn dev` chạy được, `src/middleware.ts` hoạt động, callback route phản hồi GET requests.

---

## Phase 3: User Story 1 — Authenticate via Google (Priority: P1) 🎯 MVP

**Goal**: User click "LOGIN With Google" → Google OAuth flow → session được tạo → redirect về homepage

**Independent Test**: Điều hướng đến `/auth/login` (unauthenticated). Click nút login. Hoàn thành Google OAuth. Xác nhận redirect về `/` với session đã xác thực.

### Tests (viết TRƯỚC — TDD, xác nhận FAIL trước khi implement)

- [x] T015 [P] [US1] Viết tests cho OAuth callback route — xác nhận FAIL | src/__tests__/auth/callback.test.ts
  ```
  ✗ redirects to / on successful code exchange
  ✗ redirects to /auth/login?error=auth_error on failed exchange
  ✗ returns 400 if no code in query params
  ```
- [x] T016 [P] [US1] Viết tests cho auth-service — xác nhận FAIL | src/__tests__/services/auth-service.test.ts
  ```
  ✗ signInWithGoogle calls supabase.auth.signInWithOAuth with correct params
  ✗ signInWithGoogle passes redirectTo from NEXT_PUBLIC_SITE_URL env
  ```
- [x] T017 [P] [US1] Viết tests cho LoginButton component — xác nhận FAIL | src/__tests__/components/login/LoginButton.test.tsx
  ```
  ✗ renders "LOGIN With Google" text and Google icon
  ✗ shows spinner and disables button when isLoading=true
  ✗ calls signInWithGoogle on click
  ✗ displays error message below button when error is set
  ✗ error element has role="alert" and aria-live="assertive"
  ✗ focus ring is visible (outline: 2px solid #FFFFFF)
  ```

### Implementation (sau khi tests FAIL xác nhận)

- [x] T018 [US1] Implement auth service: encapsulate `signInWithOAuth` với `redirectTo` từ `NEXT_PUBLIC_SITE_URL` | src/services/auth-service.ts
- [x] T019 [US1] Implement LoginButton Client Component: `isLoading`/`error` state, Google icon bên phải text, spinner khi loading, error message bên dưới với ARIA | src/components/login/LoginButton.tsx
- [x] T020 [P] [US1] Tạo Header layout component: logo bên trái, language slot bên phải, sticky top-0 | src/components/layout/Header.tsx
- [x] T021 [P] [US1] Tạo Footer layout component: copyright text centered, border-top | src/components/layout/Footer.tsx
- [x] T022 [US1] Tạo Login page Server Component: đọc session, render Header + hero section + LoginButton + Footer | src/app/(auth)/login/page.tsx
- [x] T023 [US1] Tạo auth group layout: kiểm tra session server-side, redirect về `/` nếu đã authenticated | src/app/(auth)/layout.tsx

### Validate Tests Pass (US1)

- [x] T024 [US1] Chạy toàn bộ tests US1 — xác nhận TẤT CẢ PASS | src/__tests__/auth/, src/__tests__/components/login/LoginButton.test.tsx, src/__tests__/services/

**Checkpoint**: Điều hướng đến `/auth/login`, click button, hoàn thành Google OAuth, redirect về `/`. Tests US1 PASS.

---

## Phase 4: User Story 2 — Switch Display Language (Priority: P2)

**Goal**: User click language selector trong header → dropdown mở, chọn ngôn ngữ → lưu vào localStorage, UI cập nhật

**Independent Test**: Trên Login page, click language toggle. Xác nhận dropdown mở. Chọn ngôn ngữ. Xác nhận localStorage `lang` được cập nhật và header hiển thị ngôn ngữ mới.

### Tests (viết TRƯỚC — TDD, xác nhận FAIL trước khi implement)

- [x] T025 [P] [US2] Viết tests cho use-language hook — xác nhận FAIL | src/__tests__/hooks/use-language.test.ts
  ```
  ✗ returns 'vn' as default language
  ✗ reads language from localStorage on init
  ✗ setLanguage writes to localStorage
  ✗ setLanguage updates state
  ```
- [x] T026 [P] [US2] Viết tests cho LanguageToggle component — xác nhận FAIL | src/__tests__/components/login/LanguageToggle.test.tsx
  ```
  ✗ renders VN flag and "VN" text
  ✗ opens dropdown on click
  ✗ closes dropdown on outside click
  ✗ chevron rotates 180deg when open
  ✗ selecting language updates localStorage and closes dropdown
  ```

### Implementation (sau khi tests FAIL xác nhận)

- [x] T027 [US2] Implement use-language hook: đọc/ghi localStorage key `'lang'`, default `'vn'`, chỉ chạy sau mount (`useEffect`) | src/hooks/use-language.ts
- [x] T028 [US2] Implement LanguageToggle Client Component: VN flag + code + chevron, dropdown mở/đóng, outside click dismiss, chevron rotate 180° khi open | src/components/login/LanguageToggle.tsx
- [x] T029 [US2] Tích hợp LanguageToggle vào Header component | src/components/layout/Header.tsx

### Validate Tests Pass (US2)

- [x] T030 [US2] Chạy toàn bộ tests US2 — xác nhận TẤT CẢ PASS | src/__tests__/hooks/, src/__tests__/components/login/LanguageToggle.test.tsx

**Checkpoint**: Language toggle mở/đóng, chọn ngôn ngữ được lưu localStorage, giữ nguyên sau reload. Tests US2 PASS.

---

## Phase 5: Polish & Cross-Cutting Concerns

**Purpose**: Responsive, accessibility, UX refinements

- [x] T031 [P] Kiểm tra responsive mobile (< 768px): header padding 16px, hero padding 48px/16px, button width 100% | src/components/, src/app/
- [x] T032 [P] Kiểm tra responsive tablet (768–1023px): header padding 48px, hero padding 64px/48px | src/components/, src/app/
- [x] T033 [P] Kiểm tra keyboard navigation: Tab tới login button → Enter submit, Tab tới language toggle → Enter mở, Escape đóng dropdown | src/components/login/
- [x] T034 [P] Kiểm tra focus states WCAG AA: login button `outline: 2px solid #FFFFFF`, language toggle `outline: 2px solid rgba(255,255,255,0.5)` | src/components/login/
- [x] T035 Kiểm tra redirect flow: user đã login vào `/auth/login` → redirect về `/` (không flash login page) | src/app/(auth)/layout.tsx, src/middleware.ts
- [x] T036 [P] Kiểm tra error states: OAuth thất bại → error message dưới button, `role="alert"`, button re-enabled | src/components/login/LoginButton.tsx
- [x] T037 [P] Kiểm tra loading state: button disabled + spinner thay Google icon, không thể double-click | src/components/login/LoginButton.tsx
- [x] T038 Chạy full test suite — xác nhận không có regression | src/__tests__/

---

## Dependencies & Execution Order

### Phase Dependencies

```
Phase 1 (Setup)
    ↓
Phase 2 (Foundation) — BLOCKING
    ↓
Phase 3 (US1) ──────────────────────────── 🎯 MVP
    ↓
Phase 4 (US2)
    ↓
Phase 5 (Polish)
```

- **Phase 1**: Không có dependencies — bắt đầu ngay
- **Phase 2**: Phụ thuộc vào Phase 1 — BLOCK tất cả user stories
- **Phase 3 (US1)**: Phụ thuộc vào Phase 2 — có thể bắt đầu sau khi Phase 2 hoàn tất
- **Phase 4 (US2)**: Phụ thuộc vào Phase 3 (Header.tsx đã có sẵn)
- **Phase 5**: Phụ thuộc vào Phase 3 + 4

### Trong mỗi User Story (TDD cycle bắt buộc)

```
Viết tests → xác nhận FAIL → Implement → xác nhận PASS
```

1. Tests (marked [P] — viết song song nếu có)
2. Services/Hooks trước Components
3. Components trước Pages
4. Core implementation trước integration

### Parallel Opportunities

| Phase | Tasks có thể chạy song song |
|-------|---------------------------|
| Phase 1 | T005, T006, T007, T008, T009 (asset downloads) |
| Phase 2 | T012 (types) sau T010, T011 |
| Phase 3 | T015, T016, T017 (test writing), T020, T021 (Header/Footer) |
| Phase 4 | T025, T026 (test writing) |
| Phase 5 | T031, T032, T033, T034, T036, T037 |

---

## Implementation Strategy

### MVP First (Recommended)

1. Hoàn thành **Phase 1 + 2** (Infrastructure)
2. Hoàn thành **Phase 3** (US1 — Google OAuth login) ← **MVP**
3. **STOP và VALIDATE**: Test full OAuth flow thủ công
4. Deploy nếu sẵn sàng

### Incremental Delivery

1. Setup + Foundation (Phase 1-2)
2. US1: Google Auth → Test → Deploy (Phase 3)
3. US2: Language Toggle → Test → Deploy (Phase 4)
4. Polish → Final deploy (Phase 5)

---

## Task Count Summary

| Phase | Tasks | User Story |
|-------|-------|-----------|
| Phase 1: Setup | T001–T009 (9 tasks) | — |
| Phase 2: Foundation | T010–T014 (5 tasks) | — |
| Phase 3: US1 | T015–T024 (10 tasks) | US1 |
| Phase 4: US2 | T025–T030 (6 tasks) | US2 |
| Phase 5: Polish | T031–T038 (8 tasks) | — |
| **Total** | **38 tasks** | |

**Parallel opportunities**: 20 tasks marked [P]

---

## Notes

- Commit sau mỗi phase (hoặc sau mỗi task nhóm logic)
- Chạy `yarn test` trước khi chuyển phase
- Supabase Google OAuth callback URL phải được whitelist: `{SITE_URL}/auth/callback` trong Supabase Dashboard + Google Cloud Console
- `src/app/auth/callback/route.ts` KHÔNG nằm trong `(auth)` group — callback từ Google không cần auth layout
- Background keyvisual dùng `next/image` với `priority` và `fill` để tối ưu LCP
- Khi deploy Cloudflare, set `NEXT_PUBLIC_SITE_URL` là production URL trong `wrangler.jsonc`
- Mark tasks complete khi xong: đổi `[ ]` thành `[x]`
