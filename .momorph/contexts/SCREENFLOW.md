# Screen Flow Overview

## Project Info
- **Project Name**: Sun Annual Awards 2025 (SAA 2025)
- **Figma File Key**: 9ypp4enmFmdK3YAFJLIu6C
- **Figma URL**: https://www.figma.com/design/9ypp4enmFmdK3YAFJLIu6C
- **Created**: 2026-04-08
- **Last Updated**: 2026-04-20

---

## Discovery Progress

| Metric | Count |
|--------|-------|
| Total Screens | 150+ |
| Discovered | 6 |
| Remaining | ~144 |
| Completion | ~4% |

---

## Screens

| # | Screen Name | Frame ID | Figma Link | Status | Detail File | Predicted APIs | Navigations To |
|---|-------------|----------|------------|--------|-------------|----------------|----------------|
| 1 | Login | GzbNeVGJHz | https://www.figma.com/design/9ypp4enmFmdK3YAFJLIu6C?node-id=GzbNeVGJHz | discovered | — | POST /auth/google, GET /auth/me | Homepage SAA, Dropdown-ngôn ngữ |
| 2 | Homepage SAA | i87tDx10uM | https://www.figma.com/design/9ypp4enmFmdK3YAFJLIu6C?node-id=i87tDx10uM | discovered | — | GET /awards, GET /kudos | About SAA 2025, Awards Information, Sun* Kudos, Dropdown-profile, Dropdown-ngôn ngữ, Notification panel, Quick action menu |
| 3 | Countdown - Prelaunch page | 8PJQswPZmU | https://www.figma.com/design/9ypp4enmFmdK3YAFJLIu6C?node-id=8PJQswPZmU | discovered | — | GET event_config (Supabase) | Homepage SAA (on launch + auth), Login (on launch + unauth) |
| 4 | Awards Information (Hệ thống giải) | zFYDgyj_pD | https://www.figma.com/design/9ypp4enmFmdK3YAFJLIu6C?node-id=zFYDgyj_pD | discovered | — | GET /awards (extended), GET /kudos | Sun* Kudos, Homepage SAA (via header) |
| 5 | Sun* Kudos - Live board | MaZUn5xHXZ | https://momorph.ai/files/9ypp4enmFmdK3YAFJLIu6C/screens/MaZUn5xHXZ | implemented | screen_specs/sun-kudos-live-board.md | Supabase (kudos, profiles, hashtags, departments, kudo_hearts, secret_boxes, live_kudo_events) + RPC toggle_kudo_heart + RPC open_secret_box + Realtime `kudos_live` | Viết Kudo (stub), Tìm kiếm Sunner (stub), Profile người khác (stub), View Kudo (stub), Gửi lời chúc Kudos, Homepage SAA, Awards Information, Dropdown-ngôn ngữ, Notification panel, Quick action menu, Hashtag filter dropdown, Department filter dropdown |
| 6 | Viết Kudo (modal) | ihQ26W78P2 | https://momorph.ai/files/9ypp4enmFmdK3YAFJLIu6C/screens/ihQ26W78P2 | discovered | screen_specs/viet-kudo.md | GET /profiles/search, GET /kudos/hashtags, POST /kudos/images/upload, POST /kudos | Sun* Kudos - Live board (on close / success), Community Standards page, Mention popover, Hashtag dropdown, File picker |
| 7 | Dropdown-ngôn ngữ | hUyaaugye2 | https://www.figma.com/design/9ypp4enmFmdK3YAFJLIu6C?node-id=hUyaaugye2 | pending | — | — | — |

---

## Navigation Graph

```mermaid
flowchart TD
    subgraph Auth["Authentication Flow"]
        Login["Login\n/auth/login"]
    end

    subgraph Main["Main Application"]
        Homepage["Homepage SAA\n/"]
        Countdown["Countdown - Prelaunch\n/prelaunch"]
        AboutSAA["About SAA 2025"]
        AwardsInfo["Awards Information"]
        SunKudos["Sun* Kudos - Live board\n/kudos\nMaZUn5xHXZ"]
        WriteKudo["Viết Kudo (compose)\n/kudos/compose"]
        ViewKudo["View Kudo (detail)\n/kudos/{id}"]
        SearchSunner["Tìm kiếm Sunner\n/kudos/search"]
        ProfileOther["Profile người khác\n/users/{id}"]
        ReceiveGift["Gửi lời chúc Kudos\n(receive popup)"]
    end

    subgraph Overlay["Overlays / Dropdowns"]
        LangDropdown["Dropdown-ngôn ngữ\n(overlay)\nhUyaaugye2"]
        ProfileDropdown["Dropdown-profile\n(overlay)\n721:5223"]
        NotifPanel["Notification panel\n(overlay)"]
        QuickAction["Quick action menu\n(overlay)"]
        HashtagFilter["Hashtag filter dropdown\n(overlay)"]
        DeptFilter["Department filter dropdown\n(overlay)"]
    end

    %% Entry to Login
    AnyUnauthPage["Any unauthenticated page"] -->|"redirect (no session)"| Login
    Countdown -->|"campaign starts / login required"| Login

    %% From Login
    Login -->|"Click 'LOGIN With Google' → Google OAuth success"| Homepage
    Login -->|"Click Language button (VN toggle)"| LangDropdown
    LangDropdown -->|"Select language / dismiss"| Login

    %% From Homepage SAA — nav bar
    Homepage -->|"Click 'About SAA 2025' nav link"| AboutSAA
    Homepage -->|"Click 'Awards Information' nav link"| AwardsInfo
    Homepage -->|"Click 'Sun* Kudos' nav link"| SunKudos

    %% From Homepage SAA — CTA buttons
    Homepage -->|"Click 'ABOUT AWARDS' CTA"| AwardsInfo
    Homepage -->|"Click 'ABOUT KUDOS' CTA"| SunKudos

    %% From Homepage SAA — award cards
    Homepage -->|"Click award card (image/title/'Chi tiết')"| AwardsInfo

    %% From Homepage SAA — Sun* Kudos section
    Homepage -->|"Click 'Chi tiết' in Sun* Kudos section"| SunKudos

    %% From Homepage SAA — header overlays
    Homepage -->|"Click avatar/user icon (A1.8)"| ProfileDropdown
    Homepage -->|"Click language toggle (A1.7)"| LangDropdown
    Homepage -->|"Click bell icon (A1.6)"| NotifPanel
    Homepage -->|"Click Widget Button (6)"| QuickAction

    %% Logo — scroll to top (same page)
    Homepage -->|"Click logo"| Homepage

    %% From other pages back to Homepage
    AboutSAA -->|"Click logo"| Homepage
    AwardsInfo -->|"Click logo"| Homepage
    SunKudos -->|"Click logo"| Homepage

    %% After successful login
    Homepage -->|"logout"| Login

    %% From Sun* Kudos - Live board
    SunKudos -->|"Click logo / Homepage nav"| Homepage
    SunKudos -->|"Click Awards Information nav"| AwardsInfo
    SunKudos -->|"Click 'Ghi nhận' CTA"| WriteKudo
    SunKudos -->|"Click 'Tìm kiếm sunner' CTA"| SearchSunner
    SunKudos -->|"Click sender/receiver avatar or name / spotlight name"| ProfileOther
    SunKudos -->|"Click Kudo card / copy link deep link"| ViewKudo
    SunKudos -->|"Click 'Mở quà' (D.1.8)"| ReceiveGift
    SunKudos -->|"Click Hashtag filter"| HashtagFilter
    SunKudos -->|"Click Phong ban filter"| DeptFilter
    SunKudos -->|"Click language toggle"| LangDropdown
    SunKudos -->|"Click bell icon"| NotifPanel
    SunKudos -->|"Click Widget Button"| QuickAction

    %% From Viết Kudo modal (ihQ26W78P2)
    WriteKudo -->|"Click 'Hủy' or backdrop / Esc"| SunKudos
    WriteKudo -->|"Click 'Gửi' → POST /api/kudos success"| SunKudos
    WriteKudo -.->|"Click 'Tiêu chuẩn cộng đồng' link"| CommunityStandards["Community Standards\n(page, target TBD)"]
```

---

## Screen Groups

### Group: Authentication
| Screen | Purpose | Entry Points | URL |
|--------|---------|--------------|-----|
| Login | User authentication via Google OAuth | App launch, any unauthenticated route, logout | `/auth/login` |

### Group: Pre-Launch
| Screen | Purpose | Entry Points | URL |
|--------|---------|--------------|-----|
| Countdown - Prelaunch page | Hold page shown before campaign launch | Direct access before event opens | `/prelaunch` |

### Group: Main Application
| Screen | Purpose | Entry Points | URL |
|--------|---------|--------------|-----|
| Homepage SAA | Main hub / landing after login; links to Awards, Kudos, About SAA sections | After successful Google OAuth; click logo from any page | `/` |
| About SAA 2025 | About the Sun Annual Awards 2025 event | "About SAA 2025" nav link from any main page | TBD |
| Awards Information | Detailed awards listing and individual award detail | "Awards Information" nav link, "ABOUT AWARDS" CTA, award card click | TBD |
| Sun* Kudos - Live board | Kudos feature hub: hero CTAs, highlight carousel, spotlight board, all-kudos feed, personal stats sidebar | "Sun* Kudos" nav link, "ABOUT KUDOS" CTA, Kudos section "Chi tiết" | `/kudos` |
| Viết Kudo (modal) | Compose + send a new Kudo to a teammate | `A.1_Button ghi nhận` on Live Board, deep link to `/kudos/compose`, optional prefill `?to={userId}` | `/kudos/compose` (deep-linked), renders as modal over `/kudos` |

### Group: Overlays
| Screen | Purpose | Entry Points |
|--------|---------|--------------|
| Dropdown-ngôn ngữ (hUyaaugye2) | Language selector overlay | Language button in header (Login, Homepage SAA, Sun* Kudos) |
| Dropdown-profile (721:5223) | User profile dropdown | Avatar/user icon (A1.8) in Homepage SAA header |
| Notification panel | In-app notifications | Bell icon (A1.6) in Homepage SAA / Sun* Kudos header |
| Quick action menu | Shortcut actions | Widget Button (6) in Homepage SAA / Sun* Kudos |
| Hashtag filter dropdown | Filter Highlight Kudos by hashtag | `B.1.1_ButtonHashtag` on Sun* Kudos - Live board |
| Department filter dropdown | Filter Highlight Kudos by department | `B.1.2_Button Phong ban` on Sun* Kudos - Live board |

---

## Login Screen Detail (GzbNeVGJHz)

### Page URL
`/auth/login`

### Interactive Elements
| Element | Type | Action | Navigation Target |
|---------|------|--------|-------------------|
| A.1_Logo | Logo | Non-interactive | — |
| A.2_Language (VN toggle) | Button (toggle) | `on_click` → open language dropdown | Dropdown-ngôn ngữ (overlay) |
| B.3_Login ("LOGIN With Google") | Button (icon+text) | `on_click` → trigger Google OAuth flow | Homepage SAA (`/`) on success |
| D_Footer | Label | Non-interactive | — |

### Navigation FROM Login
| Trigger | Target Screen | Target URL |
|---------|--------------|------------|
| Click "LOGIN With Google" → Google OAuth success | Homepage SAA | `/` |
| Click Language button (VN) | Dropdown-ngôn ngữ | overlay (no route change) |

### Navigation TO Login
| Source | Trigger |
|--------|---------|
| Any unauthenticated route | Automatic redirect (no valid session / token) |
| Countdown - Prelaunch page | Redirect when campaign requires login |
| Any screen with logout action | Explicit logout |

### Authentication Notes
- **No username/password form** — login is exclusively via Google OAuth (`LOGIN With Google` button).
- On click: opens Google OAuth flow; on success returns JWT/session token and redirects to Homepage SAA.
- While processing, the login button is disabled and shows a loading indicator.
- No "Forgot Password" or "Register" screens — Google account handles credential management.

---

## Homepage SAA Screen Detail (i87tDx10uM)

### Page URL
`/`

### Interactive Elements
| Element | Type | Action | Navigation Target |
|---------|------|--------|-------------------|
| Logo | Image/Link | `on_click` → scroll to top (same page) | Homepage SAA (`/`) |
| A1.6 — Bell icon | Icon button | `on_click` → open notification panel | Notification panel (overlay) |
| A1.7 — Language toggle | Button (toggle) | `on_click` → open language dropdown | Dropdown-ngôn ngữ (overlay, hUyaaugye2) |
| A1.8 — Avatar/user icon | Button/Avatar | `on_click` → open profile dropdown | Dropdown-profile (overlay, 721:5223) |
| "About SAA 2025" nav link | Nav link | `on_click` → navigate | About SAA 2025 page |
| "Awards Information" nav link | Nav link | `on_click` → navigate | Awards Information page |
| "Sun* Kudos" nav link | Nav link | `on_click` → navigate | Sun* Kudos page |
| "ABOUT AWARDS" CTA button | Button | `on_click` → navigate | Awards Information page |
| "ABOUT KUDOS" CTA button | Button | `on_click` → navigate | Sun* Kudos page |
| Award card (image/title/"Chi tiết") | Card / Link | `on_click` → navigate with hash | Awards Information page (`#{award-slug}`) |
| "Chi tiết" in Sun* Kudos section | Link/Button | `on_click` → navigate | Sun* Kudos page |
| Widget Button (6) | Floating button | `on_click` → open quick action menu | Quick action menu (overlay) |

### Navigation FROM Homepage SAA
| Trigger | Target Screen | Target URL / Notes |
|---------|--------------|-------------------|
| Click "About SAA 2025" nav link | About SAA 2025 page | TBD |
| Click "Awards Information" nav link | Awards Information page | TBD |
| Click "Sun* Kudos" nav link | Sun* Kudos page | TBD |
| Click "ABOUT AWARDS" CTA button | Awards Information page | TBD |
| Click "ABOUT KUDOS" CTA button | Sun* Kudos page | TBD |
| Click award card (image / title / "Chi tiết") | Awards Information page | `#{award-slug}` hash anchor |
| Click "Chi tiết" in Sun* Kudos section | Sun* Kudos page | TBD |
| Click avatar/user icon (A1.8) | Dropdown-profile | overlay (no route change), frame 721:5223 |
| Click language toggle (A1.7) | Dropdown-ngôn ngữ | overlay (no route change), screen hUyaaugye2 |
| Click bell icon (A1.6) | Notification panel | overlay (no route change) |
| Click Widget Button (6) | Quick action menu | overlay (no route change) |
| Click logo | Homepage SAA | `/` — scroll to top, no route change |

### Navigation TO Homepage SAA
| Source | Trigger |
|--------|---------|
| Login (GzbNeVGJHz) | Successful Google OAuth redirect |
| Any page with logo | Click logo |

### Notes
- The homepage is the main post-login hub, surfacing both the Awards and Sun* Kudos features.
- Award card clicks deep-link to Awards Information with a `#{award-slug}` hash to scroll to the relevant award.
- Header overlays (profile dropdown, language dropdown, notification panel) are all rendered in-place with no URL change.
- Quick action menu (Widget Button 6) is a floating shortcut launcher, also overlay only.

---

## API Endpoints Summary

| Endpoint | Method | Screens Using | Purpose |
|----------|--------|---------------|---------|
| /auth/google | POST/GET | Login | Initiate Google OAuth flow |
| /auth/google/callback | GET | Login (callback) | Handle OAuth callback, issue session |
| /auth/me | GET | Login (post-auth) | Get authenticated user info |
| /awards | GET | Homepage SAA | Fetch awards list for homepage award cards |
| /kudos | GET | Homepage SAA, Sun* Kudos - Live board | Paginated kudo feed (All Kudos section) |
| /kudos/highlights | GET | Sun* Kudos - Live board | Curated highlight kudos for the carousel |
| /kudos/hashtags | GET | Sun* Kudos - Live board | Hashtag options for the Highlight filter |
| /departments | GET | Sun* Kudos - Live board | Department options for the Highlight filter |
| /kudos/spotlight | GET | Sun* Kudos - Live board | Aggregate spotlight data: total count + sunner name cloud |
| /kudos/spotlight/search | GET | Sun* Kudos - Live board | Search sunners inside the spotlight canvas |
| /kudos/spotlight/live | WS/SSE | Sun* Kudos - Live board | Live ticker of new kudo events |
| /kudos/{id}/hearts | POST | Sun* Kudos - Live board, View Kudo | Heart / unheart a kudo (idempotent per user) |
| /users/me/stats | GET | Sun* Kudos - Live board | Personal stats: kudos received/sent, hearts (x2), secret boxes |
| /gifts/top-recipients | GET | Sun* Kudos - Live board | Top 10 sunners who recently received gifts |
| /gifts/open | POST | Sun* Kudos - Live board | Open a secret box → navigate to "Gửi lời chúc Kudos" popup |
| /kudos | POST | Viết Kudo modal | Create a new kudo (receiver, danh_hieu, content, hashtags, images, is_anonymous) |
| /kudos/images/upload | POST | Viết Kudo modal | Upload an attached image (multipart), returns public URL |
| /profiles/search?q= | GET | Viết Kudo modal | Autocomplete over profiles for receiver picker + @mention popover |

---

## Data Flow

```mermaid
flowchart LR
    subgraph Client["Frontend"]
        Login["Login Screen\n/auth/login"]
        Homepage["Homepage SAA\n/"]
    end

    subgraph GoogleOAuth["Google OAuth"]
        Google["Google Identity\nProvider"]
    end

    subgraph API["Backend API"]
        AuthAPI["Auth Service\n/auth/google"]
        AwardsAPI["Awards Service\n/awards"]
        KudosAPI["Kudos Service\n/kudos"]
    end

    Login -->|"Click LOGIN With Google\nredirect to Google"| Google
    Google -->|"OAuth callback with code"| AuthAPI
    AuthAPI -->|"JWT / session token"| Login
    Login -->|"redirect on success"| Homepage
    Homepage -->|"fetch award cards"| AwardsAPI
    Homepage -->|"fetch kudos section"| KudosAPI
```

---

## Technical Notes

### Authentication Flow
- Google OAuth 2.0 (no local credentials)
- Session token (JWT) issued by backend after Google callback
- Token stored in cookie or localStorage (TBD per constitution)
- Protected routes check session validity; redirect to `/auth/login` if absent

### Routing
- Router: Next.js App Router
- `/auth/login` — public route (Login screen)
- `/` — protected route (Homepage SAA, requires valid session)
- Unauthenticated access to any protected route → redirect to `/auth/login`

### Language / i18n
- Language selector available on Login screen (header)
- Supported: Vietnamese (VN) — additional languages via Dropdown-ngôn ngữ overlay
- Language selection persists across screens

---

## Discovery Log

| Date | Action | Screens | Notes |
|------|--------|---------|-------|
| 2026-04-08 | Initial discovery | Login (GzbNeVGJHz) | Auth flow documented; Google OAuth only, no register/forgot-password |
| 2026-04-12 | Screen discovery | Homepage SAA (i87tDx10uM) | Post-login hub; nav to Awards, Kudos, About SAA; header overlays (profile, lang, notif); award card deep-links with hash; Widget Button quick action |
| 2026-04-13 | Screen discovery | Countdown - Prelaunch (8PJQswPZmU) | Standalone holding page; countdown timer only; public route; no header/footer; redirects to Login/Homepage on launch |
| 2026-04-19 | Screen discovery | Sun* Kudos - Live board (MaZUn5xHXZ) | Kudos hub with 4 sections: Hero/CTAs, Highlight carousel (filterable), Spotlight board (live WS ticker + pan/zoom), All-Kudos feed (infinite scroll). Right sidebar with user stats + top 10 gift recipients. New targets: Viết Kudo, View Kudo, Tìm kiếm Sunner, Gửi lời chúc Kudos, Profile người khác |
| 2026-04-20 | Implementation | Sun* Kudos - Live board (MaZUn5xHXZ) | Shipped end-to-end MVP on Next.js 15 + Supabase stack: 9 tables + RLS + 2 RPCs + Realtime publication, 28 React components (4 hooks, 2 skeletons, infinite-scroll feed, filter dropdowns, pan/zoom spotlight, stats panel, open-gift flow, profile hover preview), TanStack Query + React Query Devtools, analytics stub + Web Vitals reporter. Stub routes for Viết Kudo / Tìm kiếm Sunner / View Kudo / Profile người khác |
| 2026-04-20 | Screen discovery | Viết Kudo modal (ihQ26W78P2) | Compose dialog triggered from `A.1_Button ghi nhận` on the Live Board. Seven fields: Người nhận (autocomplete), Danh hiệu (text), rich-text content (Bold/Italic/Strike/NumberList/Link/Quote + @mention), Hashtag (chips, max 5), Image (upload, max 5), ẩn danh toggle, Hủy/Gửi actions. Links out to Community Standards page, Mention popover, Hashtag dropdown, file picker. Requires `/api/profiles/search`, `/api/kudos/images/upload`, `POST /api/kudos`. |

---

## Countdown - Prelaunch Screen Detail (8PJQswPZmU)

### Page URL
`/prelaunch`

### Interactive Elements
| Element | Type | Action | Navigation Target |
|---------|------|--------|-------------------|
| Countdown Timer | Live display | Auto-updates every 60 seconds | — |

### Navigation FROM Countdown - Prelaunch
| Trigger | Target Screen | Target URL / Notes |
|---------|--------------|-------------------|
| Countdown reaches zero + user authenticated | Homepage SAA | `/` |
| Countdown reaches zero + user NOT authenticated | Login | `/auth/login` |

### Navigation TO Countdown - Prelaunch
| Source | Trigger |
|--------|---------|
| Direct URL access | User visits `/prelaunch` before campaign launch |

### Notes
- This is a PUBLIC route — no authentication required
- Shares keyvisual background with Homepage SAA (different gradient: 18deg vs 12deg)
- Reuses `event_config` table, `fetchEventConfig()` service, and `use-countdown` hook from Homepage SAA
- Countdown uses glass-morphism digit boxes (unique to this page)

---

## Next Steps

- [x] Discover Homepage SAA (i87tDx10uM) — map post-login navigation
- [x] Discover Countdown - Prelaunch page (8PJQswPZmU)
- [x] Discover Sun* Kudos - Live board (MaZUn5xHXZ)
- [x] Discover Viết Kudo modal (ihQ26W78P2)
- [ ] Discover Admin screens (Admin - Overview, Admin - User, Admin - Setting, etc.)
- [ ] Discover Profile screens (Profile bản thân, Profile người khác)
- [ ] Discover remaining Sun* Kudos flow (Viết Kudo, View Kudo, Tìm kiếm Sunner, Gửi lời chúc Kudos)
- [ ] Discover error pages (403, 404)
- [ ] Verify all navigation paths with frontend routing
- [ ] Map all remaining API endpoints
