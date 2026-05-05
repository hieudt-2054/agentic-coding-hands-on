# Feature Specification: Viết Kudo (Compose Kudo Modal)

**Frame ID**: `ihQ26W78P2` (figma node `520:11602`)
**Frame Name**: `Viết Kudo`
**File Key**: `9ypp4enmFmdK3YAFJLIu6C`
**Figma Link**: https://momorph.ai/files/9ypp4enmFmdK3YAFJLIu6C/screens/ihQ26W78P2
**Created**: 2026-04-20
**Status**: Draft
**Parent feature**: Sun* Kudos – Live Board (`specs/MaZUn5xHXZ-sun-kudos-live-board/`)

> Visual reference: see `assets/frame.png`.
> Visual specs & tokens: see `design-style.md`.

---

## Overview

The **Viết Kudo** modal is the primary way a Sunner creates a new Kudo — a thank-you / recognition message — addressed to a teammate. It is launched from the Sun* Kudos Live Board hero (`A.1_Button ghi nhận`) or via direct deep link `/kudos/compose`. The form collects all the data the backend `POST /api/kudos` endpoint requires, plus optional richness (image attachments, rich-text formatting, anonymous mode). On success the modal closes, the Live Board feed / carousel / spotlight invalidate, and the Realtime `kudos_live` channel broadcasts the new event to every subscriber.

Its defining UX principles:
- **Single-screen form** — no wizard steps; everything fits in one centered modal card.
- **Low-friction autocompletes** — receiver picker + hashtag chips + `@mention` in the textarea all use the same Supabase `profiles` / `hashtags` data.
- **Friendly tone** — placeholders, helper text ("Ví dụ: Người truyền động lực cho tôi.") and the Danh hiệu field nudge the sender towards a warm, playful message.
- **Safety net** — clicking outside / Esc / Cancel with a dirty form prompts for confirmation; spam-protected submit (server-side rate limit).

---

## User Scenarios & Testing *(mandatory)*

### User Story 1 — Send a complete kudo happy path (Priority: P1)

**As a** signed-in Sunner
**I want to** write a Kudo to a teammate with a title, message, hashtags and (optional) images
**So that** I can publicly recognise their contribution and send it to the Live Board.

**Why this priority**: This is the core generative loop of the whole Kudos feature. Without a working Viết Kudo the Live Board has no new content. MVP.

**Independent Test**: From `/kudos`, click "Ghi nhận" → fill receiver / danh hiệu / content / 1 hashtag → click "Gửi" → verify the modal closes, a success toast appears, and the new kudo shows up at the top of the All-Kudos feed within 3 seconds on another browser session via the realtime ticker.

**Acceptance Scenarios**:

1. **Given** I am signed in and on `/kudos`, **When** I click `A.1_Button ghi nhận`, **Then** the Viết Kudo modal opens, my focus lands on the Người nhận input, and the body behind the modal is dimmed + scroll-locked.
2. **Given** the modal is open, **When** I type into the receiver field, **Then** after ≥ 300 ms debounce a dropdown of matching Sunners appears (from `GET /api/profiles/search?q=…`) and arrow keys + Enter pick the highlighted one.
3. **Given** all required fields (receiver, danh hiệu, content ≥ 5 chars, ≥ 1 hashtag) are filled, **When** I click "Gửi", **Then** the button shows a spinner, `POST /api/kudos` fires, and on `201` the modal closes with a toast `Đã gửi Kudo! 🎉`.
4. **Given** a kudo was successfully sent, **When** another session is subscribed to `kudos_live`, **Then** that session's Live Ticker renders `HH:MMAM/PM {receiver_name} đã nhận được một Kudos mới` within 3 seconds and the feed + highlights + spotlight queries invalidate.
5. **Given** the sent kudo has attached images, **When** it renders in the All-Kudos feed, **Then** the image gallery shows up to 5 thumbs in the same order they were uploaded.

---

### User Story 2 — Rich content: formatting + @mentions (Priority: P2)

**As a** Sunner writing a Kudo
**I want to** format my message (bold, italic, lists, links, quotes) and mention other teammates with `@`
**So that** the Kudo is expressive and I can thank multiple people at once.

**Why this priority**: Improves quality of message but the basic plain-text flow already works (US1).

**Independent Test**: Open the modal, type "**bold**, *italic*, ~~strike~~, @Ch…"; pick a mention from the popover; click the Bold toolbar button; verify the saved kudo renders with the formatting intact in the All-Kudos feed card.

**Acceptance Scenarios**:

1. **Given** the textarea has some selected text, **When** I click the `Bold` toolbar button, **Then** the selection is wrapped in bold formatting and the Bold button shows `aria-pressed="true"`.
2. **Given** the textarea is empty and I start typing, **When** I toggle `Italic` then type, **Then** new characters appear in italic and the Italic button stays pressed until toggled off.
3. **Given** I click the Link button with text selected, **When** the URL prompt appears and I enter `https://example.com`, **Then** the selection becomes a hyperlink.
4. **Given** I type `@Ch`, **When** 200 ms has passed, **Then** a mention popover appears anchored to the caret with matching Sunners; picking one inserts a `@Chức` token linked to that user id.
5. **Given** I click the "Tiêu chuẩn cộng đồng" link, **When** the click fires, **Then** the in-app Community Standards page `/community-standards` opens in a new tab.

---

### User Story 3 — Image attachments (Priority: P2)

**As a** Sunner
**I want to** attach up to 5 images to my Kudo
**So that** the recipient has visual context (event photos, memes, certificates).

**Why this priority**: Enhances expressiveness; not required for a valid kudo.

**Independent Test**: Open modal, click `+ Image`, pick 3 images → thumbnails render; click the `×` on one → it's removed; attempt to add a 6th → `+ Image` button hides; submit → saved kudo's feed card displays exactly the remaining images.

**Acceptance Scenarios**:

1. **Given** I click `+ Image`, **When** the browser file picker returns a file, **Then** an upload is kicked off against `POST /api/kudos/images/upload`, a thumb appears with a progress ring, and on completion the ring is replaced by the image.
2. **Given** a file exceeds 5 MB, **When** the picker returns it, **Then** a toast shows "Ảnh quá lớn (tối đa 5 MB)" and the upload is cancelled.
3. **Given** the image list has 5 items, **When** the UI updates, **Then** the `+ Image` button is hidden.
4. **Given** the user clicks the × on a thumb, **When** the click fires, **Then** the image is removed locally and any in-flight upload for it is aborted.
5. **Given** images have uploaded successfully, **When** the user clicks "Gửi", **Then** the `POST /api/kudos` body contains the `images` array in thumb order with `{ url, position }`.

---

### User Story 4 — Anonymous mode (Priority: P2)

**As a** Sunner
**I want to** send a Kudo without revealing my identity to the receiver or the public feed
**So that** I can give feedback or recognition more comfortably in sensitive situations.

**Why this priority**: Requested feature, but plain mode already works.

**Independent Test**: Open modal, tick "Gửi lời cám ơn và ghi nhận ẩn danh" → Gửi. In the Live Feed the kudo's sender chip displays "Ẩn danh" instead of the sender's name for **every** viewer including admins. Heart / gift flows still work (receiver gets hearts).

**Acceptance Scenarios**:

1. **Given** the Anonymous checkbox is unchecked, **When** the kudo is submitted, **Then** the stored row has `is_anonymous = false` and the feed shows the sender's profile normally.
2. **Given** the Anonymous checkbox is checked, **When** the kudo is submitted, **Then** the stored row has `is_anonymous = true` and the feed shows sender = "Ẩn danh" (generic placeholder avatar + label) for **every viewer** — including admins. The `sender_id` remains on the row for DB integrity (FK + triggers) but MUST be stripped from any API read response (`sender_id` set to `null`, or the select omits it) so that clients cannot resolve the original sender.
3. **Given** a kudo is anonymous, **When** the receiver views it, **Then** they still see it attributed to "Ẩn danh" but the heart count / gift flow works as usual.

---

### User Story 5 — Cancel / close safely (Priority: P1)

**As a** Sunner
**I want to** cancel the compose flow without losing work accidentally
**So that** I don't send an incomplete kudo and don't discard progress by mistake.

**Why this priority**: Crucial for a modal — miss-clicks are common.

**Independent Test**: Fill the modal partially → click backdrop / Esc / Hủy → confirm dialog appears. Cancel confirm → modal stays. Confirm discard → modal closes and all state is cleared.

**Acceptance Scenarios**:

1. **Given** no field has been touched, **When** I click Hủy / Esc / backdrop, **Then** the modal closes immediately without a confirm.
2. **Given** any field has been touched (form is dirty), **When** I try to close, **Then** a confirm dialog asks "Bỏ bản nháp này?" with buttons `Tiếp tục viết` / `Bỏ`.
3. **Given** I confirm discard, **When** the modal closes, **Then** form state + any in-flight image uploads are fully cleared.

---

### User Story 6 — Deep link + prefill (Priority: P3)

**As a** Sunner who just clicked "Send Kudo" on someone's profile
**I want to** land directly on the modal with the receiver pre-filled
**So that** I can skip the search step.

**Why this priority**: Nice to have; can ship after Profile người khác spec lands.

**Independent Test**: Navigate to `/kudos/compose?to={userId}` → modal opens, receiver field is pre-filled and disabled (non-editable). Remove the pre-fill by clicking × on the chip → receiver input becomes editable again.

**Acceptance Scenarios**:

1. **Given** I navigate to `/kudos/compose?to=uuid`, **When** the page loads, **Then** `GET /api/profiles/{id}` resolves the receiver and the chip is shown with an × next to it.
2. **Given** the receiver is prefilled, **When** I click the × on the chip, **Then** the field resets to the empty search state.
3. **Given** an invalid `?to=` is passed, **When** the page loads, **Then** the field is empty and a toast "Không tìm thấy người nhận này" is shown.

---

### Edge Cases

- **No session / session expired**: Modal redirects to `/auth/login?redirect=/kudos/compose`.
- **Campaign not yet launched (pre-launch)**: Modal redirects to `/prelaunch`.
- **Rate-limited on server**: `429` → toast "Gửi Kudo quá nhanh, vui lòng thử lại sau" + Submit disabled for 5 s.
- **Send-to-self**: Receiver picker filters out the current user. If somehow submitted, server returns `422 invalid_receiver`; inline error.
- **Duplicate content**: If server returns `409 duplicate` (same sender/receiver/content within 60 s) → inline toast "Bạn vừa gửi kudo y hệt — đã bị chặn trùng lặp."
- **Content overflow**: Counter turns red once text length > 2000; Submit disabled with tooltip.
- **No internet / 5xx**: Inline banner at top of modal with retry; form state preserved.
- **Browser back button**: Closes modal, URL reverts to `/kudos`.
- **Paste formatted content**: Sanitise to allowed subset (bold/italic/strike/list/link/quote); strip scripts + styles.
- **Copy-pasted images**: Accept only image MIME types; reject PDFs / docs.
- **Too many hashtags**: `+ Hashtag` button disabled after 5; helper text turns red.
- **Mention dropdown empty**: Show "Không có kết quả" mini note, caret stays open until user types more or Escape.
- **Reduced motion**: Modal open/close animations skipped; toolbar hover transitions set to 0 ms.

---

## UI/UX Requirements *(from Figma)*

> All visual tokens, dimensions, colors, typography, and state mappings live in **`design-style.md`**.

### Screen Components

| ID       | Component                      | Node ID                  | Description                                                                             | Interactions                                                                    |
| -------- | ------------------------------ | ------------------------ | --------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------- |
| Backdrop | Modal backdrop                 | `520:11646`              | Full-viewport dim layer `rgba(0,16,26,0.8)`                                             | Click → close (confirm if dirty)                                                |
| Card     | Compose modal card             | `520:11647`              | 752×1012 cream card centered, radius 24                                                 | Traps focus                                                                     |
| A        | Title                          | `I520:11647;520:9870`    | "Gửi lời cám ơn và ghi nhận đến đồng đội"                                               | Readonly                                                                        |
| B.1      | Receiver label                 | `I520:11647;520:9872`    | "Người nhận" + `*`                                                                       | Readonly                                                                        |
| B.2      | Receiver autocomplete          | `I520:11647;520:9873`    | Search input with chevron-down; debounced `GET /api/profiles/search`                    | Type → dropdown; Enter / click picks row; Escape closes                         |
| Frame 552 (B.3) | Danh hiệu field         | `I520:11647;1688:10448`  | Text input "Dành tặng một danh hiệu cho đồng đội"; helper "Ví dụ: Người truyền động lực…" | Type freely; counter when > 50 chars; red border on empty submit              |
| C.1–C.6  | Toolbar buttons                | (listed in design-style) | Bold, Italic, Strikethrough, Number list, Link, Quote                                   | Toggle formatting; `aria-pressed` reflects state; keyboard shortcuts (Ctrl/Cmd+B etc.) |
| C.link   | Community standards link        | `I520:11647;3053:11619`  | Red text on toolbar right — "Tiêu chuẩn cộng đồng"                                      | Open community-standards page in new tab                                         |
| D        | Rich-text textarea             | `I520:11647;520:9886`    | Multi-line editor; placeholder "Hãy gửi gắm lời cám ơn và ghi nhận đến đồng đội tại đây nhé!" | Enter for newline; `@` opens mention popover; Ctrl+Enter triggers Submit shortcut |
| D.1      | Helper hint                    | `I520:11647;520:9887`    | "Bạn có thể '@ + tên' để nhắc tới đồng nghiệp khác"                                     | Readonly                                                                        |
| E.1      | Hashtag label                  | `I520:11647;520:9891`    | "Hashtag" + `*`                                                                         | Readonly                                                                        |
| E.2      | Hashtag tag group              | `I520:11647;662:8595`    | Horizontally scrolling chip container                                                   | Chips show remove-× on hover/focus                                              |
| E.3 (E-add) | + Hashtag button            | `I520:11647;662:8911`    | "+ Hashtag" button with plus icon + "Tối đa 5" hint                                     | Click → dropdown with autocomplete over `hashtags` table; can type new tag (creates on submit) |
| F.1      | Image label                    | `I520:11647;520:9897`    | "Image"                                                                                 | Readonly                                                                        |
| F.2–F.4  | Image thumbnails               | multiple F.* instances   | 80×80 cream-bordered thumb with × remove in top-right                                  | Click thumb → lightbox preview (non-destructive); × → remove                    |
| F.5      | + Image button                 | `I520:11647;662:9132`    | Plus + "Image" stacked + "Tối đa 5"                                                     | Click → native file picker (accept image/*, multiple)                           |
| G        | Anonymous checkbox             | `I520:11647;520:14099`   | 24×24 checkbox + "Gửi lời cám ơn và ghi nhận ẩn danh"                                   | Toggle; Space / Enter                                                           |
| H.1      | Hủy button                     | `I520:11647;520:9906`    | Cancel, with ✕ trailing icon                                                            | Click → close (confirm if dirty)                                                |
| H.2      | Gửi button                     | `I520:11647;520:9907`    | Yellow primary with `Send` leading icon                                                 | Click → validate → `POST /api/kudos`                                            |

### Navigation Flow

- **From**:
  - `/kudos` `A.1_Button ghi nhận` click
  - Deep link `/kudos/compose` (optional `?to={userId}`)
  - Profile người khác "Send Kudo" CTA (future — once that spec lands)
- **To**:
  - `/kudos` on Hủy / success / Esc / backdrop (via `router.back()` → URL reverts)
  - `/community-standards` (new tab) — in-app page
  - `/auth/login?redirect=/kudos/compose` on 401
  - `/prelaunch` on 403 campaign not launched

### Visual Requirements

- **Responsive breakpoints** — full-viewport bottom sheet on mobile, 640px centered card on tablet, 752px on desktop. See `design-style.md` Responsive Specifications.
- **Animations** — fade + scale open/close 200ms; button hover 150ms. Respect `prefers-reduced-motion`.
- **Accessibility**:
  - `role="dialog" aria-modal="true" aria-labelledby="compose-kudo-title"`
  - Focus trap with Esc escape + restore focus to trigger CTA on close.
  - Required fields use `aria-required="true"` + visible `*`.
  - Submit button uses `aria-disabled="true"` when form invalid; on-hover tooltip lists missing fields.
  - All toolbar buttons render as real `<button>` with `aria-pressed` for format state.
  - File picker triggered via native `<input type="file">` (keyboard-accessible).
  - Error text uses `role="alert"` with `aria-live="polite"`.

---

## Data Requirements

### Form fields

| Field              | Component      | Type                          | Required | Validation                                                                              | Placeholder                                                     |
| ------------------ | -------------- | ----------------------------- | -------- | --------------------------------------------------------------------------------------- | --------------------------------------------------------------- |
| `receiver_id`      | B.2 autocomplete | select-one over `profiles`    | Yes      | Must be valid profile id ≠ `auth.uid()` (server-side enforced)                            | "Tìm kiếm"                                                      |
| `danh_hieu`        | Frame 552 input | text                          | Yes      | Trim; `1 ≤ length ≤ 60`                                                                   | "Dành tặng một danh hiệu cho đồng đội"                           |
| `content`          | D textarea       | rich text (subset HTML)       | Yes      | Plain-text length `5 ≤ length ≤ 2000`; sanitize allowed tags only (bold, italic, strike, list, link, quote, `<span data-mention>`) | "Hãy gửi gắm lời cám ơn và ghi nhận đến đồng đội tại đây nhé!" |
| `mentions`         | D popover        | array of profile id           | No       | Each must exist in `profiles`; derived from `@` tokens in content                         | —                                                                |
| `hashtags`         | E chip group     | array of `hashtag.slug`       | Yes      | `1 ≤ count ≤ 5`; each slug exists in `hashtags` OR is a valid new slug `[a-z0-9-]{1,30}` | —                                                                |
| `images`           | F uploader       | array of `{ url, position }`  | No       | `count ≤ 5`; each file ≤ 5 MB, MIME `image/jpeg|png|webp`                                 | —                                                                |
| `is_anonymous`     | G checkbox       | boolean                       | No       | default `false`                                                                          | —                                                                |

### Validation / error messages (Vietnamese)

All strings MUST go through the i18n dictionary (key shown in code) — the Vietnamese copy below is the source of truth.

| Error code                      | i18n key                                 | Vietnamese copy                                                |
| ------------------------------- | ---------------------------------------- | -------------------------------------------------------------- |
| `receiver_required`             | `kudos.compose.err.receiverRequired`     | "Vui lòng chọn người nhận"                                      |
| `receiver_is_self`              | `kudos.compose.err.receiverIsSelf`       | "Bạn không thể gửi Kudo cho chính mình"                         |
| `receiver_not_found`            | `kudos.compose.err.receiverNotFound`     | "Không tìm thấy người nhận này"                                 |
| `danh_hieu_required`            | `kudos.compose.err.danhHieuRequired`     | "Vui lòng nhập danh hiệu"                                       |
| `danh_hieu_too_long`            | `kudos.compose.err.danhHieuTooLong`      | "Danh hiệu tối đa 60 ký tự"                                     |
| `content_too_short`             | `kudos.compose.err.contentTooShort`      | "Lời cám ơn phải có ít nhất 5 ký tự"                            |
| `content_too_long`              | `kudos.compose.err.contentTooLong`       | "Lời cám ơn tối đa 2000 ký tự"                                  |
| `hashtag_required`              | `kudos.compose.err.hashtagRequired`      | "Vui lòng chọn ít nhất 1 hashtag"                               |
| `hashtag_too_many`              | `kudos.compose.err.hashtagTooMany`       | "Tối đa 5 hashtag"                                              |
| `image_too_large`               | `kudos.compose.err.imageTooLarge`        | "Ảnh quá lớn (tối đa 5 MB)"                                     |
| `image_invalid_mime`            | `kudos.compose.err.imageInvalidMime`     | "Chỉ chấp nhận ảnh JPEG, PNG hoặc WebP"                          |
| `image_too_many`                | `kudos.compose.err.imageTooMany`         | "Tối đa 5 ảnh"                                                  |
| `rate_limited`                  | `kudos.compose.err.rateLimited`          | "Bạn gửi Kudo quá nhanh, vui lòng thử lại sau"                  |
| `duplicate`                     | `kudos.compose.err.duplicate`            | "Bạn vừa gửi kudo y hệt — đã bị chặn trùng lặp"                 |
| `network`                       | `kudos.compose.err.network`              | "Không gửi được Kudo, vui lòng thử lại"                          |

### Display fields (helper / placeholder / status)

| Field                          | Source                                 | Format                                                                 |
| ------------------------------ | -------------------------------------- | ---------------------------------------------------------------------- |
| Danh hiệu helper (line 1)      | `i18n: kudos.compose.danhHieu.helper1` | "Ví dụ: Người truyền động lực cho tôi."                                |
| Danh hiệu helper (line 2)      | `i18n: kudos.compose.danhHieu.helper2` | "Danh hiệu sẽ hiển thị làm tiêu đề Kudos của bạn."                      |
| Textarea hint                  | `i18n: kudos.compose.content.helper`   | "Bạn có thể '@ + tên' để nhắc tới đồng nghiệp khác"                    |
| Hashtag note                   | `i18n: kudos.compose.hashtag.note`     | "Tối đa 5"                                                               |
| Image note                     | `i18n: kudos.compose.image.note`       | "Tối đa 5"                                                               |
| Community standards link label | `i18n: kudos.compose.communityLink`    | "Tiêu chuẩn cộng đồng"                                                   |
| Success toast                  | `i18n: kudos.compose.success`          | "Đã gửi Kudo! 🎉"                                                        |

---

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The modal MUST validate client-side before calling `POST /api/kudos`. Invalid fields render inline errors with `role="alert"`.
- **FR-002**: Receiver autocomplete MUST query `GET /api/profiles/search?q=…` debounced at 300 ms and exclude `auth.uid()` from results. Response returns at most **10 profiles**, no paging (confirmed Q5). `q` matches `display_name` and `email` with Postgres `ILIKE '%q%'`; results are ordered by `kudos_received_count DESC` then `display_name ASC` so popular teammates surface first.
- **FR-003**: The content editor MUST support toggle formatting for Bold / Italic / Strikethrough / Numbered list / Link / Quote, accessible via toolbar click **and** keyboard shortcuts (`Ctrl/Cmd+B`, `+I`, `+Shift+X`, `+Shift+7`, `+K`, `+Shift+9`).
- **FR-004**: `@` in the textarea MUST open a mention popover anchored to the caret with up to 5 profile suggestions; picking one inserts a token `<span data-mention="{userId}">@{displayName}</span>` into the content.
- **FR-005**: The hashtag field MUST accept 1–5 hashtags. Each must exist in `hashtags` OR pass a slug regex `^[a-z0-9][a-z0-9-]{0,29}$`. New slugs are **auto-inserted server-side on kudo create** (no admin approval step); the server upserts the slug into `public.hashtags` inside the same transaction as the `kudos` INSERT.
- **FR-006**: The image uploader MUST upload files individually to `POST /api/kudos/images/upload`, showing per-item progress rings, with a hard limit of 5 and MIME validation.
- **FR-007**: The Anonymous checkbox MUST be optional and default `false`. When `true`, the server MUST strip `sender_id` from all read responses (including to admins). An RLS policy + SELECT filter ensures anonymous kudos return `sender: null` / "Ẩn danh" placeholder to every role. The `sender_id` column is retained in the row for DB integrity (FK + the `on_kudo_insert` trigger that bumps `kudos_sent_count`) but never leaves the server.
- **FR-008**: Submit MUST be disabled until receiver, danh hiệu, content (5–2000 chars), and ≥ 1 hashtag are valid. Tooltip on hover lists missing fields.
- **FR-009**: On successful `201` from `POST /api/kudos`, the modal MUST close, show a success toast, and invalidate query keys `['kudos-feed']`, `['kudos-highlights']`, `['kudos-spotlight']`, `['user-stats']`.
- **FR-010**: Closing with a dirty form MUST show a confirm dialog "Bỏ bản nháp này?" with default focus on "Tiếp tục viết".
- **FR-011**: Backdrop click + Escape + Hủy all follow the dirty-form confirm flow.
- **FR-012**: `?to={userId}` query param MUST be honoured on mount to pre-fill the receiver; invalid ids fall back to empty + toast.
- **FR-013**: The modal MUST trap focus; Tab cycles within; Shift+Tab cycles backwards; Esc closes.
- **FR-014**: Realtime side-effect: server INSERT triggers `on_kudo_insert` → `live_kudo_events` row → Supabase Realtime broadcast (existing from Live Board feature); no client-side realtime subscription added here. `live_kudo_events` only stores `receiver_id` + `receiver_name`, so anonymous sender privacy is preserved on the ticker by construction.
- **FR-015**: Image cleanup — when the user removes a thumb (before submit) OR closes/cancels the modal after images were uploaded, the client MUST call `DELETE /api/kudos/images/{path}` to remove the orphan blob from Storage. If the delete call fails (network/offline), the server runs a daily cron that garbage-collects any `kudos-images/*` blob with no matching `kudo_images.url` reference older than 24 h.
- **FR-016**: Character counters — a live counter appears **only when approaching the limit**:
  - Danh hiệu: show `{N}/60` once `N ≥ 50`; red once `N > 60`.
  - Content: show `{N}/2000` once `N ≥ 1900`; red once `N > 2000`.
  - Counter is rendered under the field, right-aligned, `--text-body-sm` style.
- **FR-017**: Dirty-close confirm dialog — uses a nested `role="alertdialog"` that inherits the modal's focus trap; 3 buttons rendered in this order: `[Bỏ] [Tiếp tục viết]` (default focus on `Tiếp tục viết`). Uses the same cream card + gold border tokens as the main modal at a smaller size (400 × 200).

### Technical Requirements

- **TR-001**: Stack alignment — implement on the approved stack (Next.js 15 App Router, React 19, Tailwind v4, TypeScript strict, Supabase SSR/browser clients, TanStack Query).
- **TR-002**: Rich-text implementation — use **contenteditable DIY** with a thin command wrapper (`document.execCommand` for bold / italic / strike / link, manual DOM surgery for numbered list + blockquote + `@mention` tokens). No new runtime dependencies. Unit-test the command wrapper thoroughly since browser quirks differ (Safari vs Chromium vs Firefox on selection ranges).
- **TR-003**: The modal uses Next.js **parallel + intercepting routes**:
  - `src/app/kudos/@modal/compose/page.tsx` — the intercepted modal (rendered over `/kudos`)
  - `src/app/kudos/compose/page.tsx` — the stub route already in the repo becomes the **full-page fallback** (for direct page loads / hard refresh, shows the modal centered on a dim background with no Live Board behind it)
  - `src/app/kudos/layout.tsx` — declares the `modal` parallel slot
  - Close handler calls `router.back()` so the URL reverts to `/kudos`
- **TR-004**: Image uploads go to a Supabase Storage bucket **`kudos-images`** (public read, authenticated write). Bucket is created via a new migration that also adds Storage RLS policies: `select` permits anyone on `authenticated` role; `insert` restricted to `auth.uid() = owner`; `delete` restricted to `owner = auth.uid()` (for cleanup). Service returns the public URL `https://{project}.supabase.co/storage/v1/object/public/kudos-images/{path}`.
- **TR-005**: Mention token format MUST be round-trippable: save as `<span data-mention-id="{uuid}" class="kudo-mention">@Name</span>` so the Live Board card can later render it as a `/users/{id}` link.
- **TR-006**: HTML sanitization on the server (Cloudflare Worker) MUST reject any tag not in `{b, strong, i, em, s, ul, ol, li, a, blockquote, p, br, span[data-mention-id]}` and strip inline `style`.
- **TR-007**: Kudo create is implemented as a single Postgres RPC `public.create_kudo(p_receiver_id uuid, p_danh_hieu text, p_content_html text, p_hashtag_slugs text[], p_image_urls jsonb, p_is_anonymous boolean) returns jsonb` — `SECURITY DEFINER`, `set search_path = public, pg_temp`. Inside the function:
  1. Validate `auth.uid()` is set and `p_receiver_id <> auth.uid()`.
  2. Rate-limit — `P0001 'rate_limited'` if `count(*) > 10` kudos sent by `auth.uid()` in the last 1 hour.
  3. Duplicate guard — `P0001 'duplicate'` if an identical `(sender_id, receiver_id, md5(content_html))` row exists within the last 60 s.
  4. Strip tags from `p_content_html` → plain `content`.
  5. INSERT the kudo, upsert any new hashtag slugs, then insert join rows for `kudo_hashtags`, `kudo_images`, `kudo_mentions` (parsed from `data-mention-id` attributes).
  6. Return `jsonb_build_object('id', new_id, 'created_at', new_row.created_at)`.
  The existing `on_kudo_insert` trigger still fires to populate `live_kudo_events` + bump `profiles.*_count`.
- **TR-008**: Duplicate guard — reject same `(sender_id, receiver_id, content-hash)` within 60 s → `409 duplicate`.
- **TR-009**: File upload cap — reject files > 5 MB at the edge (Cloudflare Worker rejects before hitting Supabase).
- **TR-010**: Validation with Zod at both client (instant feedback) and server (trust boundary) using the same schema factory.
- **TR-011**: Performance — modal open should feel instant; pre-fetch `['kudos-hashtags']` on Live Board mount so the `+ Hashtag` dropdown has data by the time the modal renders.
- **TR-012**: Clean architecture — business logic in `src/services/kudos-compose-service.ts` (server) + `src/services/kudos-compose-client.ts` (browser). Route handler under `src/app/api/kudos/route.ts` stays thin.

### Key Entities

Extends the existing Kudos schema (see `specs/MaZUn5xHXZ-sun-kudos-live-board/spec.md` Key Entities). This spec adds:

- **Kudo** — adds:
  - `danh_hieu text not null` — the playful title ("1 ≤ length ≤ 60")
  - `is_anonymous boolean not null default false`
  - `content_html text not null` — sanitised rich-text HTML (the Live Board card renders this as `dangerouslySetInnerHTML` via a Server Component, so no untrusted bytes reach the client — see TR-006 for the allow-list)
  - The existing plain-text `content` column is **kept and auto-populated** on insert (strip tags from `content_html`) so full-text search, copy-to-clipboard excerpts, and the Live Board's clamped text rendering keep working without re-parsing HTML on every render.
- **KudoMention** — new join `{ kudo_id uuid, mentioned_user_id uuid }`, PK `(kudo_id, mentioned_user_id)`. Populated on insert by the server service that parses `content_html` for `[data-mention-id]` attributes.
- **KudoImage** — already exists; no schema change (URL + position).
- No new tables for hashtags — existing `public.hashtags` is upserted on kudo create when a new slug appears.

The existing `on_kudo_insert` trigger + `toggle_kudo_heart` RPC still apply. A new server-side function `create_kudo(...)` (see TR-007) wraps the multi-table insert (kudos + kudo_hashtags + kudo_images + kudo_mentions) in a single transaction.

---

## API Dependencies

| Endpoint                        | Method | Purpose                                                                     | Status          |
| ------------------------------- | ------ | --------------------------------------------------------------------------- | --------------- |
| `/api/profiles/search?q=`       | GET    | Autocomplete for receiver + `@mention` popover                              | Predicted — new |
| `/api/profiles/{id}`            | GET    | Resolve receiver when `?to={id}` prefills the modal                         | Predicted — new |
| `/api/kudos/hashtags`           | GET    | Already exists (Live Board) — reused for Hashtag dropdown                   | Exists          |
| `/api/kudos/images/upload`      | POST   | Multipart file upload, returns `{ url, position }`                          | Predicted — new |
| `/api/kudos`                    | POST   | Create a kudo `{ receiver_id, danh_hieu, content_html, hashtag_slugs, image_urls, is_anonymous }`; returns `{ id, created_at }` | Predicted — new |
| `/community-standards`          | GET (page) | In-app Next.js page linked from the toolbar `Tiêu chuẩn cộng đồng`; separate spec  | Predicted — new |

---

## State Management

### Local state

| State              | Type                                   | Initial                 | Purpose                                                          |
| ------------------ | -------------------------------------- | ----------------------- | ---------------------------------------------------------------- |
| `formValues`       | `ComposeKudoForm`                      | `{}` or prefilled       | Controlled values for all fields                                  |
| `errors`           | `Record<field, string>`                | `{}`                    | Inline error messages                                             |
| `isDirty`          | `boolean`                              | `false`                 | Track user touches for confirm-on-close                           |
| `receiverQuery`    | `string`                               | `""`                    | Debounced input for receiver search                               |
| `receiverResults`  | `SunnerRef[]`                          | `[]`                    | Autocomplete dropdown items                                       |
| `mentionQuery`     | `string \| null`                       | `null`                  | Active `@` token in textarea                                      |
| `mentionResults`   | `SunnerRef[]`                          | `[]`                    | Mention popover items                                             |
| `hashtagQuery`     | `string`                               | `""`                    | Debounced input in the add-hashtag popover                        |
| `isSubmitting`     | `boolean`                              | `false`                 | Submit button loading state                                       |
| `imageUploads`     | `Record<tempId, { url?, progress }>`   | `{}`                    | Per-file upload progress 0..1                                     |

### Global / shared state

| State         | Store                   | Read/Write       | Purpose                                                                  |
| ------------- | ----------------------- | ---------------- | ------------------------------------------------------------------------ |
| `session`     | Supabase Auth           | Read             | Current user id — prevent self-send, include in request                  |
| `locale`      | i18n dictionary         | Read             | Label / placeholder / toast translations                                  |
| `queryClient` | TanStack Query          | Invalidate      | On success invalidate `['kudos-feed']`, `['kudos-highlights']`, `['kudos-spotlight']`, `['user-stats']` |

### Cache keys

| Key                              | Source                          | Stale time |
| -------------------------------- | ------------------------------- | ---------- |
| `['profiles-search', q]`         | `GET /api/profiles/search?q=`   | 30 s       |
| `['profiles', id]`               | `GET /api/profiles/{id}`        | 60 s (for `?to=` prefill) |
| `['kudos-hashtags']`             | `GET /api/kudos/hashtags`       | 24 h (already used by Live Board) |

### UI states

| Context          | Loading                  | Error                                                        | Empty                                      | Success                                |
| ---------------- | ------------------------ | ------------------------------------------------------------ | ------------------------------------------ | -------------------------------------- |
| Receiver search  | 3 skeleton rows          | inline "Không tải được kết quả, thử lại"                      | "Không tìm thấy Sunner nào"                 | render result list                     |
| Mention popover  | skeleton row             | hide popover silently                                         | "Không có kết quả nào"                      | render up to 5 matches                 |
| Image upload     | progress ring on thumb   | red border + retry / remove                                   | N/A                                         | replace ring with final thumb          |
| Submit           | spinner in Gửi button    | inline banner + retry; preserve form                          | N/A                                         | close modal + toast + invalidate       |

---

## Success Criteria *(mandatory)*

- **SC-001**: From click-to-open to first interactive input < 250 ms (INP on modal mount).
- **SC-002**: ≥ 80% of sessions that open the modal complete submission (anti-abandon metric).
- **SC-003**: ≤ 2% submissions fail due to network / rate-limit / duplicate in steady state.
- **SC-004**: Average time in modal < 60 s (proxy for friction).
- **SC-005**: Realtime propagation (submit → ticker on another session) ≤ 3 s for 95% of events.
- **SC-006**: Works on latest 2 versions of Chrome / Safari / Edge / Firefox + mobile Safari / Chrome; no console errors.

---

## Out of Scope

- Mention notifications (push / email / bell) — owned by a separate Notification spec.
- Community Standards page content — out of scope; we just link to it.
- Rich-text beyond the 6 formats listed — no headings, images-inline, tables, color, font size.
- Video / GIF attachments — images only.
- Drafts / autosave — explicit discard-on-close.
- Scheduled kudos — immediate send only.
- Edit / delete a sent kudo — handled by View Kudo spec.

---

## Dependencies

- [x] Constitution document reviewed
- [x] Live Board spec (`specs/MaZUn5xHXZ-sun-kudos-live-board/`) — this modal extends it
- [x] Screen flow documented (`.momorph/contexts/SCREENFLOW.md`) — updated 2026-04-20
- [x] Rich-text approach — **contenteditable DIY** (locked-in 2026-04-20)
- [x] Community Standards URL — **in-app `/community-standards`** (locked-in 2026-04-20)
- [x] Modal routing — **parallel + intercepting route** (`@modal/compose`) (locked-in 2026-04-20)
- [x] Anonymous mode — **admins also see "Ẩn danh"**; `sender_id` stripped from API reads (locked-in 2026-04-20)
- [x] New hashtag rule — **auto-create on first use** (locked-in 2026-04-20)
- [x] Supabase Storage bucket — **`kudos-images`** (locked-in 2026-04-20)
- [ ] Supabase Storage bucket created + RLS policies migrated (implementation task)
- [ ] Receiver search API shape + response pagination (Q5)

---

## Notes

- This modal is the **first write-path** in the Kudos feature. Everything in the Live Board so far is read-only (hearts are a mutation but not a CREATE). Expect to land a DB migration extending `public.kudos` with `danh_hieu` + `is_anonymous` + `content_html` + a new `kudo_mentions` table. Consider stretching the existing hashtag flow to accept new slugs on first use (server-side upsert).
- The helper text `Bạn có thể "@ + tên" để nhắc tới đồng nghiệp khác` double-serves as a11y hint and a discovery nudge — keep it visible always, not behind focus.
- The receiver's `kudos_received_count` and the sender's `kudos_sent_count` are bumped by the **existing** `on_kudo_insert` trigger; no extra logic needed here.
- If the team prefers not to deal with contenteditable complexity (selection ranges + command execution quirks across browsers), **Tiptap with StarterKit + Mention** is the drop-in upgrade. It's ~40 KB gzipped; a later migration, not an MVP blocker.
- **i18n integration**: all new strings MUST be added to both `src/i18n/dictionaries/vi.ts` and `src/i18n/dictionaries/en.ts` under the `kudos.compose.*` namespace. The validation/error-messages table above (Vietnamese copy) is the source of truth for the `vi` dictionary; `en` mirrors translate the same keys. Keep the existing Live Board `kudos.*` keys unchanged; append, don't mutate.
- **Route file layout under `app/kudos/`** after implementation:
  - `app/kudos/layout.tsx` — declares `modal` parallel slot + passes `children`
  - `app/kudos/@modal/default.tsx` — renders `null` when the modal slot is inactive
  - `app/kudos/@modal/compose/page.tsx` — intercepted modal over the Live Board
  - `app/kudos/compose/page.tsx` — full-page fallback (hard refresh / direct URL)
  Both compose pages import the same `<ComposeKudoForm />` client component so behavior stays identical; the wrapper differs (portal + backdrop vs full-page layout).
- **Token reuse**: the new `/* Design Tokens — Viết Kudo (ihQ26W78P2) */` block in `globals.css` MUST only declare the ~6 genuinely new tokens (backdrop, required-star, community-link, input-bg, placeholder if not aliased). Everything else reuses existing Kudos tokens declared by the Live Board — this keeps the theme coherent across screens.

---

## Decisions Locked-In (2026-04-20)

| # | Area | Decision |
|---|------|----------|
| Q2 | Rich-text | **Contenteditable DIY** with a thin command wrapper — no new deps (TR-002) |
| Q3 | Community Standards | **In-app** page at `/community-standards` — opens in new tab |
| Q4 | Modal routing | **Parallel + intercepting route** `app/kudos/@modal/compose/page.tsx` with `/kudos/compose` as full-page fallback (TR-003) |
| Q6 | Anonymous visibility | Admins also see "Ẩn danh"; `sender_id` stripped from API reads; FK retained for triggers (FR-007) |
| Q7 | New hashtags | Auto-create on first use (upsert in same transaction as kudo INSERT) — no admin approval (FR-005) |
| Q10 | Storage bucket | **`kudos-images`** — public read, authenticated write (TR-004) |
| Q5 | `/api/profiles/search` paging | **No paging, cap at 10** results. Order by `kudos_received_count DESC, display_name ASC` (FR-002) |
| Q1 | Danh hiệu length | **Max 60 chars** — DB column `CHECK (length(danh_hieu) BETWEEN 1 AND 60)`; Zod `min(1).max(60)`. Counter surfaces at ≥ 50 chars (FR-016) |
| Q8 | Danh hiệu helper copy | **Verbatim** as-is in Figma: "Ví dụ: Người truyền động lực cho tôi." + "Danh hiệu sẽ hiển thị làm tiêu đề Kudos của bạn." — stored under i18n keys `kudos.compose.danhHieu.helper1` / `helper2` |
| Q9 | Selected hashtag chip | Pill — `background: rgba(255, 234, 158, 0.40)`, `color: #00101A`, `padding: 6px 12px`, `border-radius: 9999px`, trailing `×` 16×16 in `#D4271D` (hover fades to 0.7) |
| Q11 | Community Standards link colour | **Keep `#E46060`** per Figma. Accepted contrast trade-off (3.4:1 on cream) — partially mitigated by `font-weight: 700` + `hover: underline`; if accessibility audit later flags it, escalate for re-review |

All clarification questions are now **resolved**. The spec is ready for `/momorph.plan`.
