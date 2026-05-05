# Screen: Viết Kudo (Compose Kudo Modal)

## Screen Info

| Property           | Value                                                         |
| ------------------ | ------------------------------------------------------------- |
| **Figma Frame ID** | ihQ26W78P2 (node `520:11602`)                                 |
| **Figma Link**     | https://momorph.ai/files/9ypp4enmFmdK3YAFJLIu6C/screens/ihQ26W78P2 |
| **Screen Group**   | Sun* Kudos / Compose                                          |
| **Status**         | discovered                                                    |
| **Discovered At**  | 2026-04-20                                                    |
| **Last Updated**   | 2026-04-20                                                    |

---

## Description

A **modal dialog** rendered on top of the Sun* Kudos Live Board (or anywhere the user can trigger a new kudo) for composing and sending a thank-you message to a teammate. The modal collects:

1. **Người nhận** — target Sunner (autocomplete search, required)
2. **Danh hiệu** — a playful title the sender bestows on the receiver (free text, required)
3. **Content** — a rich-text message with basic formatting (bold / italic / strikethrough / numbered list / link / quote) plus `@mention` autocomplete of other Sunners
4. **Hashtag** — 1–5 predefined-or-custom hashtags (chip input, required)
5. **Image** — up to 5 optional attached images (file picker, remove per thumb)
6. **Gửi ẩn danh** — optional checkbox to send anonymously
7. **Footer** — Hủy (close without saving) or Gửi (validate + submit)

On successful submit, the kudo is persisted, the Live Board feed/carousel/spotlight are invalidated, the Spotlight Realtime ticker receives the new event, and the modal closes with a success toast. The receiver's `kudos_received_count` + the sender's `kudos_sent_count` are bumped by the existing DB trigger on `kudos` INSERT.

---

## Navigation Analysis

### Incoming Navigations (From)

| Source Screen           | Trigger                                                                 | Condition          |
| ----------------------- | ----------------------------------------------------------------------- | ------------------ |
| Sun* Kudos - Live board | Click `A.1_Button ghi nhận` pill CTA in hero                            | User authenticated |
| Sun* Kudos - Live board | Navigate directly to `/kudos/compose` (deep-link)                       | User authenticated |
| Any header "+ Ghi nhận" shortcut (future) | Click header shortcut — pre-fills no receiver                | User authenticated |
| Profile người khác (future)                | Click "Send Kudo" on someone's profile — pre-fills receiver  | User authenticated |

### Outgoing Navigations (To)

| Target Screen                     | Trigger Element                         | Node ID        | Confidence | Notes                                                                       |
| --------------------------------- | --------------------------------------- | -------------- | ---------- | --------------------------------------------------------------------------- |
| Sun* Kudos - Live board           | Click `H.1` Hủy                         | I520:11647;520:9906 | high   | Close modal, discard draft                                                  |
| Sun* Kudos - Live board           | Click `H.2` Gửi (success)                | I520:11647;520:9907 | high   | Close modal, show success toast, invalidate feed/highlights/spotlight cache |
| Community Standards page          | Click `Tiêu chuẩn cộng đồng` link       | I520:11647;3053:11619 | medium | External/internal page with rules for kudo content                          |
| Mention popover                   | Type `@` in textarea                    | —              | high       | Inline autocomplete; no route change                                        |
| Hashtag dropdown (overlay)        | Click `+ Hashtag`                       | —              | high       | Inline popover; no route change                                             |
| File picker (browser native)      | Click `+ Image`                         | —              | high       | Native `<input type="file">`                                                |

### Navigation Rules

- **Back behavior**: Escape key or backdrop click closes the modal (if no unsaved changes) or shows a confirm dialog (if form is dirty).
- **Deep link support**: Yes — `/kudos/compose` opens the modal on top of `/kudos`. Closing returns to `/kudos`.
- **Auth required**: Yes — protected route, redirects to `/auth/login` if no session.
- **Prefill support**: URL query `?to={user_id}` pre-selects the receiver (used when opening from a profile "Send Kudo" CTA).

---

## Component Schema

### Layout Structure

```
Modal backdrop (dimmed page behind)
┌────────────────────────────────────────────────────────────────┐
│  Viết Kudo (modal container, cream card, centered)             │
│ ┌────────────────────────────────────────────────────────────┐ │
│ │  A  Gửi lời cám ơn và ghi nhận đến đồng đội (title)         │ │
│ ├────────────────────────────────────────────────────────────┤ │
│ │  B  Người nhận *                                            │ │
│ │       [ Tìm kiếm                                      ▾ ]   │ │
│ │                                                              │ │
│ │  B′ Danh hiệu *                                             │ │
│ │       [ Dành tặng một danh hiệu cho đồng đội             ]  │ │
│ │       Ví dụ: Người truyền động lực cho tôi.                 │ │
│ │       Danh hiệu sẽ hiển thị làm tiêu đề Kudos của bạn.      │ │
│ │                                                              │ │
│ │  C  [ B  I  S  1=  🔗  "  ]         Tiêu chuẩn cộng đồng    │ │
│ │  D  ┌──────────────────────────────────────────────────┐    │ │
│ │     │ Hãy gửi gắm lời cám ơn và ghi nhận đến đồng đội  │    │ │
│ │     │ tại đây nhé!                                     │    │ │
│ │     │                                                  │    │ │
│ │     │                                                  │    │ │
│ │     └──────────────────────────────────────────────────┘    │ │
│ │  D.1 Bạn có thể "@ + tên" để nhắc tới đồng nghiệp khác       │ │
│ │                                                              │ │
│ │  E  Hashtag *    [+ Hashtag]  Tối đa 5                      │ │
│ │       #Dedicated  #Inspring  #IdolGioiTre  ...               │ │
│ │                                                              │ │
│ │  F  Image                                                   │ │
│ │       [🖼][🖼][🖼][🖼][🖼]   [+ Image  Tối đa 5]            │ │
│ │                                                              │ │
│ │  G  ☐ Gửi lời cám ơn và ghi nhận ẩn danh                    │ │
│ │                                                              │ │
│ │  H  [  Hủy  ✕  ]                    [  Gửi  ➤  ]            │ │
│ └────────────────────────────────────────────────────────────┘ │
└────────────────────────────────────────────────────────────────┘
```

### Component Hierarchy

```
ComposeKudoModal (Organism)
├── Backdrop (Atom)
├── ModalCard (Molecule)
│   ├── Title (Atom) — A_Gửi lời cám ơn…
│   ├── ReceiverField (Molecule) — B
│   │   ├── Label (Atom) — B.1_Title
│   │   └── SunnerAutocomplete (Molecule) — B.2_Search
│   ├── DanhHieuField (Molecule) — Frame 552
│   │   ├── Label (Atom)
│   │   ├── TextInput (Atom)
│   │   └── HelperText (Atom) — "Ví dụ: Người truyền động lực…"
│   ├── ContentEditor (Organism) — C + D
│   │   ├── Toolbar (Molecule) — C_Chức năng
│   │   │   ├── BoldButton (Atom)        — C.1
│   │   │   ├── ItalicButton (Atom)      — C.2
│   │   │   ├── StrokeButton (Atom)      — C.3
│   │   │   ├── NumberListButton (Atom)  — C.4
│   │   │   ├── LinkButton (Atom)        — C.5
│   │   │   ├── QuoteButton (Atom)       — C.6
│   │   │   └── CommunityStandardsLink (Atom)
│   │   ├── Textarea (Molecule) — D_text filed
│   │   ├── MentionPopover (Organism, overlay on `@`)
│   │   └── HelperText (Atom) — D.1_Gợi ý "@+tên"
│   ├── HashtagField (Organism) — E_Frame 536
│   │   ├── Label (Atom) — E.1_Title
│   │   ├── TagGroup (Molecule) — E.2_Tag Group (selected chips)
│   │   ├── AddHashtagButton (Atom) — "+ Hashtag"
│   │   ├── Note (Atom) — "Tối đa 5"
│   │   └── HashtagDropdown (Organism, overlay)
│   ├── ImageUploader (Organism) — F_Frame 537
│   │   ├── Label (Atom) — F.1_Title "Image"
│   │   ├── ImageThumb (Molecule) × N  — F.2..F.4, up to 5
│   │   │   ├── Thumbnail (Atom)
│   │   │   └── RemoveButton (Atom)
│   │   └── AddImageButton (Atom) — F.5 "+ Image • Tối đa 5"
│   ├── AnonymousCheckbox (Molecule) — G_Gửi ẩn danh
│   └── FooterActions (Molecule) — H_Frame 538
│       ├── CancelButton (Atom) — H.1 "Hủy ✕"
│       └── SubmitButton (Atom) — H.2 "Gửi ➤" (disabled until valid)
```

### Main Components

| Component                    | Type     | Node ID                   | Description                                               | Reusable |
| ---------------------------- | -------- | ------------------------- | --------------------------------------------------------- | -------- |
| ComposeKudoModal             | Organism | 520:11602                 | Full modal dialog                                         | No       |
| ReceiverField                | Molecule | I520:11647;520:9871       | Sunner autocomplete with dropdown arrow                   | Yes (profile flows) |
| DanhHieuField                | Molecule | I520:11647;1688:10448     | Short free-text field for a playful title                 | No       |
| ContentEditor                | Organism | I520:11647;520:9874       | Toolbar + textarea with formatting + `@mention`           | No       |
| HashtagField                 | Organism | I520:11647;520:9890       | Chip input with `+ Hashtag` dropdown, max 5               | Yes (compose variants) |
| ImageUploader                | Organism | I520:11647;520:9896       | File picker + thumb grid with per-item remove, max 5      | Yes (compose variants) |
| AnonymousCheckbox            | Molecule | I520:11647;520:14099      | Labeled toggle for anonymous delivery                     | No       |
| FooterActions                | Molecule | I520:11647;520:9905       | Hủy + Gửi row                                              | No       |

---

## Form Fields

| Field              | Component            | Type               | Required | Validation                                                                   | Placeholder                                                             |
| ------------------ | -------------------- | ------------------ | -------- | ---------------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| `receiver_id`      | `B.2_Search`         | select (one, autocomplete over `profiles`) | Yes | Must be a valid profile id ≠ current user                      | "Tìm kiếm"                                                              |
| `danh_hieu`        | Danh hiệu input      | text               | Yes      | Trim, 1 ≤ length ≤ 60                                                         | "Dành tặng một danh hiệu cho đồng đội"                                   |
| `content`          | `D_text filed`       | rich-text (HTML/Markdown) | Yes | Plain-text length ≥ 5, ≤ 2000; supports `@mention` tokens                    | "Hãy gửi gắm lời cám ơn và ghi nhận đến đồng đội tại đây nhé!"          |
| `hashtags`         | `E_Frame 536`        | array of hashtag.slug | Yes   | 1 ≤ count ≤ 5, each must exist in `hashtags` table (or be accepted new tag)  | —                                                                       |
| `images`           | `F_Frame 537`        | array of uploaded file URLs | No | ≤ 5 files, each ≤ 5 MB, MIME `image/jpeg|png|webp`                        | —                                                                       |
| `is_anonymous`     | `G_Gửi ẩn danh`      | boolean            | No       | default `false`                                                              | —                                                                       |

### Validation schema (TypeScript / Zod sketch)

```ts
const ComposeKudoSchema = z.object({
  receiverId: z.string().uuid().refine(id => id !== currentUserId, 'cannot_send_to_self'),
  danhHieu: z.string().trim().min(1).max(60),
  content: z.string().trim().min(5).max(2000),
  hashtags: z.array(z.string().min(1)).min(1).max(5),
  images: z.array(z.object({ url: z.string().url(), position: z.number().int().min(0).max(4) })).max(5),
  isAnonymous: z.boolean().default(false),
});
```

---

## API Mapping

### On Modal Open

| API                         | Method | Purpose                                                 |
| --------------------------- | ------ | ------------------------------------------------------- |
| `/api/kudos/hashtags`       | GET    | Populate the `+ Hashtag` dropdown                        |
| `/api/profiles/search?q=`   | GET    | Power the receiver autocomplete (debounced)              |
| `/api/profiles/search?q=`   | GET    | Mention popover — triggered by `@` token in textarea     |

### On Submit

| Action                | API                          | Method | Request                                                                                       | Response                                           |
| --------------------- | ---------------------------- | ------ | --------------------------------------------------------------------------------------------- | -------------------------------------------------- |
| Upload image (per file) | `/api/kudos/images/upload` | POST   | multipart form-data `file`                                                                    | `{ url: string, position: number }`                |
| Submit kudo            | `/api/kudos`                 | POST   | `{ receiver_id, danh_hieu, content, hashtag_slugs, image_urls, is_anonymous }`                | `{ id: string, created_at: string }`               |

The backend INSERT into `public.kudos` will trigger:
- `on_kudo_insert` trigger → insert into `public.live_kudo_events` (fans out over Supabase Realtime `kudos_live`)
- Auto-bump `profiles.kudos_received_count` + `profiles.kudos_sent_count`

### Error handling

| Error Code      | Condition                            | UI Action                                                                    |
| --------------- | ------------------------------------ | ---------------------------------------------------------------------------- |
| 401             | Session expired                      | Redirect to `/auth/login` with `?redirect=/kudos/compose`                    |
| 403             | Campaign not launched                | Redirect to `/prelaunch`                                                     |
| 422 `invalid_receiver` | Receiver = self OR not found        | Inline error on receiver field                                               |
| 422 `content_too_long` | Content > 2000 chars                | Inline error below textarea + counter turns red                              |
| 413 `image_too_large`  | Single image > 5 MB                 | Toast "Ảnh quá lớn (tối đa 5 MB)", remove from list                          |
| 409 `duplicate`        | Same sender+receiver+content within 60s | Toast "Bạn vừa gửi kudo y hệt — đã bị chặn trùng lặp"                   |
| 429             | Spam protection                      | Toast + disable Submit for 5 s                                                |
| 5xx             | Network / server                     | Modal stays open, show inline banner + retry button                          |

---

## State Management

### Local state

| State              | Type                               | Initial              | Purpose                                                       |
| ------------------ | ---------------------------------- | -------------------- | ------------------------------------------------------------- |
| `formValues`       | `ComposeKudoForm`                  | `{}` (or prefilled)  | Controlled form values for all fields                         |
| `errors`           | `Record<field, string>`            | `{}`                 | Inline per-field error messages                               |
| `receiverQuery`    | `string`                           | `""`                 | Debounced input for receiver search                           |
| `receiverResults`  | `SunnerRef[]`                      | `[]`                 | Autocomplete dropdown items                                   |
| `mentionQuery`     | `string \| null`                   | `null`               | Active `@mention` token in textarea                           |
| `mentionResults`   | `SunnerRef[]`                      | `[]`                 | Mention popover items                                         |
| `hashtagOptions`   | `Hashtag[]`                        | `[]`                 | Dropdown options                                              |
| `isSubmitting`     | `boolean`                          | `false`              | Submit button loading state                                   |
| `imagesUploading`  | `Record<localId, number>`          | `{}`                 | Per-image upload progress 0..1                                |
| `isDirty`          | `boolean`                          | `false`              | Has user typed anything? (for confirm-on-close)               |

### Global / shared state

| State         | Store                   | Read/Write | Purpose                                                            |
| ------------- | ----------------------- | ---------- | ------------------------------------------------------------------ |
| `session`     | Supabase Auth           | Read       | Current user id — prevent self-send                                |
| `locale`      | i18n dictionary         | Read       | Label / placeholder / error translations                           |
| `queryClient` | TanStack Query          | Invalidate | On success, invalidate `['kudos-feed']`, `['kudos-highlights']`, `['kudos-spotlight']`, `['user-stats']` |

### Cache / server state keys

| Key                                | Source                                    | Refetch trigger                      |
| ---------------------------------- | ----------------------------------------- | ------------------------------------ |
| `['profiles-search', q]`           | `GET /api/profiles/search?q=`             | Debounced on `receiverQuery` change  |
| `['kudos-hashtags']`               | `GET /api/kudos/hashtags`                 | Modal open / 1-day stale-time        |
| `['profiles-mention', q]`          | same endpoint as receiver search          | Debounced on `mentionQuery` change   |

---

## UI States

### Loading
- Initial open: skeleton for receiver dropdown + hashtag dropdown options if opened immediately.
- Submit in flight: `Gửi` button shows spinner; all fields disabled.
- Image upload: each thumb shows progress ring until URL lands, then renders final thumbnail.

### Error
- 401/403: modal closes, redirect per error handling table.
- Inline validation (receiver empty, content too short, 0 hashtags): field turns red + error text below.
- Submit fails (5xx / 429): inline banner at the top of the modal body + `Thử lại` CTA; form values preserved.

### Success
- Toast top-right `Đã gửi Kudo! 🎉` for ~3 seconds.
- Modal closes and queries are invalidated (Live Board refreshes).

### Empty / Placeholder
- Receiver dropdown empty state: "Không tìm thấy Sunner" after 300ms of zero matches.
- Mention popover empty: `@abc` → "Không có kết quả nào" tiny popover.
- Hashtag group empty: inline "Chưa có hashtag nào" under field with `+ Hashtag` primary.

---

## Accessibility

| Requirement            | Implementation                                                                  |
| ---------------------- | ------------------------------------------------------------------------------- |
| Modal dialog semantics | `role="dialog" aria-modal="true" aria-labelledby="compose-kudo-title"`          |
| Focus management       | On open, move focus to receiver input. On close, restore focus to trigger CTA.  |
| Focus trap             | Tab cycles inside modal only until Esc or Cancel closes it.                     |
| Escape                 | Close modal (confirm if dirty).                                                  |
| Backdrop click         | Close modal (confirm if dirty).                                                  |
| Required fields        | `aria-required="true"` on Người nhận / Danh hiệu / Content / Hashtag.           |
| Error announcement     | `role="alert" aria-live="polite"` on per-field error text.                      |
| Submit button          | `aria-disabled="true"` when form invalid; tooltip explains what's missing.      |
| File picker            | Native `<input type="file">`; label via `aria-label="Thêm ảnh đính kèm"`.       |
| Rich-text toolbar      | Each button is a real `<button>` with `aria-pressed` reflecting format state.    |

---

## Responsive Behavior

| Breakpoint       | Changes                                                                                           |
| ---------------- | ------------------------------------------------------------------------------------------------- |
| Mobile (<768px)  | Modal becomes fullscreen bottom-sheet; vertical stack for image thumbs (2-up grid); footer pinned |
| Tablet (768–1023) | Modal max-width 560px, centered                                                                   |
| Desktop (≥1024)  | Modal max-width ~600px, centered, shadow-xl                                                       |

---

## Analysis Metadata

| Property             | Value                                                |
| -------------------- | ---------------------------------------------------- |
| Analyzed By          | Screen Flow Discovery (momorph.screenflow)           |
| Analysis Date        | 2026-04-20                                           |
| Needs Deep Analysis  | Yes — proceed to momorph.specify for design tokens   |
| Confidence Score     | High                                                 |

### Next Steps
- [x] Frame image saved to `.momorph/specs/ihQ26W78P2-viet-kudo/assets/frame.png`
- [ ] Run `list_frame_styles` + `list_design_items` (done by momorph.specify)
- [ ] Decide on rich-text library (contenteditable + commands vs Tiptap/Lexical) — new dep likely required
- [ ] Define mention autocomplete trigger + popover positioning
- [ ] Confirm community-standards page URL with stakeholders
