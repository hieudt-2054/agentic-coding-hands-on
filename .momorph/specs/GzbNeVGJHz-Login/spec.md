# Feature Specification: Login

**Frame ID**: `GzbNeVGJHz` (Figma node: `662:14387`)
**Frame Name**: `Login`
**File Key**: `9ypp4enmFmdK3YAFJLIu6C`
**Created**: 2026-04-08
**Status**: Draft

---

## Overview

The Login screen is the entry point for the Sun Annual Awards 2025 (SAA 2025) application.
It is a full-screen hero page that presents the SAA 2025 brand visual ("ROOT FURTHER") and
provides a single authentication action: **Login With Google** via Google OAuth (Supabase Auth).

Target users: Sun* employees who need to authenticate before accessing SAA 2025 features.

This screen is intentionally minimal — no email/password form, no sign-up. Authentication is
exclusively through Google SSO, leveraging Supabase Auth's Google provider.

---

## User Scenarios & Testing

### User Story 1 — Authenticate via Google (Priority: P1)

**As a** Sun* employee visiting the SAA 2025 app for the first time (or after session expiry)
**I want to** click "LOGIN With Google" and complete Google OAuth
**So that** I can access the application and my SAA 2025 profile

**Why this priority**: This is the only authentication mechanism. Without it, the entire app
is inaccessible. All other features depend on a valid session.

**Independent Test**: Navigate to `/auth/login` (unauthenticated). Click the login button.
Complete Google OAuth. Verify redirect to homepage with authenticated session.

**Acceptance Scenarios**:

1. **Given** an unauthenticated user is on the Login page,
   **When** they click "LOGIN With Google",
   **Then** the browser navigates to Google's OAuth consent screen.

2. **Given** a user completes Google OAuth successfully,
   **When** the OAuth callback is received by `/auth/callback`,
   **Then** a Supabase session is created, and the user is redirected to the homepage (`/`).

3. **Given** a user clicks "LOGIN With Google",
   **When** the OAuth flow is in progress,
   **Then** the login button is disabled and shows a loading spinner, preventing duplicate submissions.

4. **Given** a user cancels Google OAuth or an error occurs,
   **When** they return to the Login page,
   **Then** an error message is displayed directly below the login button (e.g., "Authentication failed. Please try again."),
   the error text uses `role="alert"` and `aria-live="assertive"` for screen reader announcement,
   and the login button is re-enabled.

5. **Given** an already-authenticated user navigates to `/login`,
   **When** the page loads,
   **Then** they are automatically redirected to the homepage (`/`).

---

### User Story 2 — Switch display language (Priority: P2)

**As a** user on the Login page
**I want to** click the language selector (VN flag + "VN" + chevron) in the header
**So that** I can switch the UI language before logging in

**Why this priority**: Language selection should be available pre-login. Non-blocking and
independent of auth flow.

**Independent Test**: On the Login page, click the language toggle. Verify the language
dropdown opens (navigates to or renders Dropdown-ngôn ngữ component, screen ID `721:4942`).

**Acceptance Scenarios**:

1. **Given** a user is on the Login page,
   **When** they click the language selector button (showing "VN"),
   **Then** the language dropdown opens with available language options.

2. **Given** the language dropdown is open,
   **When** the user selects a language,
   **Then** the dropdown closes, the header updates to show the selected language code and flag,
   and the page text updates to the selected language.

3. **Given** the language dropdown is open,
   **When** the user clicks outside the dropdown,
   **Then** the dropdown closes without changing the selected language.

---

### Edge Cases

- What if Google OAuth is unavailable (network error)? → Show user-facing error: "Unable to connect to Google. Check your network and try again."
- What if Supabase session creation fails after successful Google auth? → Show generic error, log to console, re-enable login button.
- What if the user navigates to `/login` with a valid session? → Middleware redirects to `/`.
- Không giới hạn domain email — mọi tài khoản Google hợp lệ đều được phép đăng nhập.

---

## UI/UX Requirements *(from Figma)*

### Screen Components

| Component | Node ID | Description | Interactions |
|-----------|---------|-------------|--------------|
| A_Header | `662:14391` | Fixed top bar (logo + language toggle) | Language toggle: click to open dropdown |
| A.1_Logo | `I662:14391;186:2166` | SAA 2025 logo, top-left | Non-interactive |
| A.2_Language | `I662:14391;186:1601` | Language selector showing current lang code (VN) + flag + chevron | Click → open language dropdown (`721:4942`) |
| C_Keyvisual | `662:14388` | Full-canvas decorative background artwork | None |
| B_Bìa | `662:14393` | Hero section with visual + CTA | Contains login button |
| B.1_Key Visual | `662:14395` | "ROOT FURTHER" brand image | None |
| B.2_content | `662:14753` | Hero descriptive text (2 lines) | None |
| B.3_Login | `662:14425` | "LOGIN With Google" primary CTA button | Click → Google OAuth flow |
| D_Footer | `662:14447` | Copyright bar at bottom | None |

→ See `design-style.md` for complete visual specifications of each component.

### Navigation Flow

- **From**: Any unauthenticated route (middleware redirects to `/auth/login`)
- **To (on success)**: Homepage `/`
- **To (language toggle)**: Language dropdown overlay (`721:4942` — `Dropdown-ngôn ngữ`)
- **To (no navigation)**: Footer, key visual, hero text are display-only

### Visual Requirements

- **Responsive breakpoints**: Mobile (< 768px), Tablet (768–1023px), Desktop (≥ 1024px)
- **Background**: Full-screen dark navy `#00101A` with decorative background artwork + gradient overlays
- **Transitions**: Login button hover/active states per `design-style.md`
- **Accessibility**: WCAG AA — all interactive elements keyboard-navigable; login button
  has visible focus ring; error messages announced via `aria-live`

---

## Requirements

### Functional Requirements

- **FR-001**: System MUST initiate Google OAuth flow when the login button is clicked,
  using Supabase Auth's Google provider.
- **FR-002**: System MUST disable the login button and show a loading indicator while
  the OAuth flow is in progress.
- **FR-003**: System MUST create a Supabase session on successful OAuth callback and
  redirect the authenticated user to `/`.
- **FR-004**: System MUST display an error message if authentication fails (OAuth error,
  network error, or unauthorized account).
- **FR-005**: System MUST redirect already-authenticated users away from `/auth/login` to `/`
  (handled in Next.js middleware or page-level check).
- **FR-006**: System MUST display the language selector that opens the language dropdown
  component on click.
- **FR-007**: System MUST preserve the currently selected language across navigation bằng cách lưu vào `localStorage` (key: `'lang'`). Khi trang load, đọc từ `localStorage` để khởi tạo ngôn ngữ hiển thị.

### Technical Requirements

- **TR-001**: Authentication MUST use Supabase Auth with Google provider — no custom
  auth implementation.
- **TR-002**: The OAuth callback route (`/auth/callback`) MUST be a Next.js Route Handler
  using `@supabase/ssr` for server-side session creation.
- **TR-003**: Supabase client initialization MUST use `src/libs/supabase/server.ts`
  (server components/Route Handlers) and `src/libs/supabase/client.ts` (client components).
- **TR-004**: The login page route MUST be `src/app/(auth)/login/page.tsx` matching URL `/auth/login`.
- **TR-004a**: The OAuth callback route MUST be `src/app/auth/callback/route.ts` (Next.js Route Handler).
  The Supabase `signInWithOAuth` call MUST pass `redirectTo: process.env.NEXT_PUBLIC_SITE_URL + '/auth/callback'`
  to ensure correct redirect in all environments (local, staging, production).
- **TR-005**: No sensitive credentials (Supabase URL, anon key) MUST appear in client-side code
  beyond what Supabase SSR requires via environment variables.

### Key Entities

- **User Session**: Created by Supabase Auth after successful Google OAuth. Contains user ID,
  email, and Google profile data. Managed via `@supabase/ssr` cookies.

---

## API Dependencies

| Endpoint | Method | Purpose | Status |
|----------|--------|---------|--------|
| `supabase.auth.signInWithOAuth({ provider: 'google' })` | — | Initiate Google OAuth flow | Exists (Supabase Auth) |
| `/auth/callback` | GET | Receive OAuth code, exchange for session | New (Next.js Route Handler) |
| `supabase.auth.exchangeCodeForSession(code)` | — | Complete OAuth session creation | Exists (Supabase Auth) |

---

## State Management

| State | Type | Location | Description |
|-------|------|----------|-------------|
| `isLoading` | boolean | Component local state | True while OAuth in progress |
| `error` | string \| null | Component local state | Auth error message to display |
| `session` | Session \| null | Supabase Auth (server) | User session from Supabase SSR |
| `currentLanguage` | string | `localStorage` (key: `'lang'`) | Selected language code (e.g., `'vn'`, `'en'`). Đọc/ghi client-side only — không dùng trong Server Components. |

---

## Success Criteria

### Measurable Outcomes

- **SC-001**: A user can complete Google OAuth and reach the homepage within 5 seconds
  on a standard network connection.
- **SC-002**: The login button is visually disabled during OAuth processing — zero duplicate
  submissions possible.
- **SC-003**: Authenticated users navigating to `/login` are redirected to `/` within one
  navigation cycle (no flash of login page content).
- **SC-004**: All error states display a user-readable message — no raw technical errors
  shown to the user.

---

## Out of Scope

- Email/password authentication (not in design — Google OAuth only)
- User registration / sign-up flow (not present in this screen)
- Remember me / persistent login toggle (handled automatically by Supabase session)
- Social login providers other than Google
- Password reset flow

---

## Dependencies

- [x] Constitution document exists (`.momorph/constitution.md`)
- [x] Screen flow documented (`.momorph/contexts/SCREENFLOW.md`)
- [ ] API specifications available (`.momorph/api-docs.yaml`) — N/A for this screen (Supabase Auth)
- [ ] Database design completed — N/A (users managed by Supabase Auth)

---

## Notes

- The screen ID `6381` in the original URL did not match MoMorph's frame registry. The
  correct MoMorph screen ID is `GzbNeVGJHz` (Figma node `662:14387`), name "Login".
- Supabase Google OAuth requires the callback URL to be configured in both the Supabase
  dashboard (Authentication → URL Configuration) and Google Cloud Console (OAuth credentials).
- The `MM_MEDIA_Root Further Logo` and `MM_MEDIA_Logo` assets must be fetched from MoMorph
  and placed under `public/assets/login/` before implementation.
- Language dropdown target: Figma frame `721:4942` (screen ID `hUyaaugye2`, name "Dropdown-ngôn ngữ").
