# Design Style: Viết Kudo (Compose Kudo Modal)

**Frame ID**: `ihQ26W78P2` (figma node `520:11602`)
**Frame Name**: `Viết Kudo`
**Figma Link**: https://momorph.ai/files/9ypp4enmFmdK3YAFJLIu6C/screens/ihQ26W78P2
**Extracted At**: 2026-04-20
**Visual reference**: `assets/frame.png`
**Parent screen**: Sun* Kudos - Live Board (see `specs/MaZUn5xHXZ-sun-kudos-live-board/design-style.md`)

This modal reuses the Kudos design-token palette (`--color-kudos-*`) declared on the Live Board (`src/app/globals.css` → `/* Design Tokens — Sun* Kudos (MaZUn5xHXZ) */` block). Only modal-specific values are re-listed below; **do not redefine tokens that already exist**.

---

## Design Tokens

### Colors

| Token Name                      | Hex / RGBA                    | Status                | Usage                                                                 |
| ------------------------------- | ----------------------------- | --------------------- | --------------------------------------------------------------------- |
| `--color-kudos-page`            | `#00101A`                     | ♻ reuse from LB       | Body text on cream surfaces (title, labels)                           |
| `--color-kudos-card-cream`      | `#FFF8E1`                     | ♻ reuse from LB       | Modal card background (matches Kudo post card)                        |
| `--color-kudos-heart-active`    | `#D4271D`                     | ♻ reuse from LB       | Also used here for the × remove-button on image thumbs                |
| `--color-kudos-modal-backdrop`  | `rgba(0, 16, 26, 0.80)`       | ➕ new (this spec)     | Full-viewport dim layer behind modal                                  |
| `--color-kudos-input-bg`        | `#FFFFFF`                     | ➕ new                 | Receiver / danh hiệu / textarea / hashtag chip backgrounds            |
| `--color-kudos-input-border`    | `#998C5F`                     | ♻ same as `--color-border-gold` on LB | 1px border on all inputs and toolbar cells            |
| `--color-kudos-placeholder`     | `#999999`                     | ♻ same as `--color-kudos-muted` on LB | Placeholder text + disabled label                     |
| `--color-kudos-required-star`   | `#CF1322`                     | ➕ new                 | The `*` glyph beside required field labels (and the recommended replacement for the community-link colour per Q11) |
| `--color-kudos-community-link`  | `#E46060`                      | ➕ new                 | "Tiêu chuẩn cộng đồng" link — Figma colour locked (Q11 resolved 2026-04-20). Contrast on cream = 3.4:1; partially mitigated by `font-weight: 700` + `hover: underline` — revisit if a11y audit flags it |
| `--color-kudos-submit-bg`       | `#FFEA9E` (same as `--color-primary-button` on LB) | ♻ reuse | Gửi primary CTA background                                            |
| `--color-kudos-cancel-bg`       | `rgba(255, 234, 158, 0.10)`   | ♻ same as `--color-secondary-button` on LB | Hủy secondary CTA background                     |
| `--color-kudos-image-accent`    | `#FFEA9E`                     | ♻ reuse                | Image thumbnail inner frame                                           |

### Typography

| Token                  | Family          | Size  | Weight | Line | Letter | Usage                                          |
| ---------------------- | --------------- | ----- | ------ | ---- | ------ | ---------------------------------------------- |
| `--text-modal-title`   | Montserrat      | 32px  | 700    | 40px | 0      | Modal header "Gửi lời cám ơn và ghi nhận đến đồng đội" |
| `--text-field-label`   | Montserrat      | 22px  | 700    | 28px | 0      | Field labels (Người nhận, Danh hiệu, Hashtag, checkbox label) |
| `--text-body`          | Montserrat      | 16px  | 700    | 24px | 0.15px | Inputs, placeholder, buttons, helper text      |
| `--text-body-sm`       | Montserrat      | 14px  | 500    | 20px | 0      | "Ví dụ: Người truyền động lực…" helper under Danh hiệu |
| `--text-hashtag-chip`  | Montserrat      | 11px  | 700    | 16px | 0.5px  | "Hashtag" / "Tối đa 5" caption inside chip     |
| `--text-required-star` | Noto Sans JP    | 16px  | 700    | 20px | 0      | The `*` asterisk                                |
| `--text-submit`        | Montserrat      | 22px  | 700    | 28px | 0      | "Gửi" label                                     |

### Spacing

| Token                        | Value | Usage                                              |
| ---------------------------- | ----- | -------------------------------------------------- |
| `--spacing-modal-padding`    | 40px  | Modal card inner padding on all sides              |
| `--spacing-modal-section`    | 32px  | Gap between fields/sections in the modal card      |
| `--spacing-modal-field-row`  | 16px  | Horizontal gap inside a single field row (label ↔ input) |
| `--spacing-modal-footer-gap` | 24px  | Gap between Hủy and Gửi in the footer              |

### Border & Radius

| Token                         | Value   | Usage                                       |
| ----------------------------- | ------- | ------------------------------------------- |
| `--radius-modal-card`         | 24px    | Modal container                             |
| `--radius-modal-input`        | 8px     | Text inputs + submit CTA                    |
| `--radius-modal-toolbar-left` | 8px 0 0 0 | Toolbar first button top-left corner     |
| `--radius-modal-toolbar-right`| 0 8px 0 0 | Toolbar last-button top-right corner     |
| `--radius-modal-textarea`     | 0 0 8px 8px | Textarea (meets toolbar bottom seam)   |
| `--radius-modal-cancel`       | 4px     | Hủy button                                  |
| `--radius-modal-image-thumb`  | 18px    | Outer frame of each image thumbnail         |
| `--radius-modal-image-inner`  | 4px     | Image itself (inside the gold frame)        |
| `--radius-modal-remove-btn`   | 9999px  | Circular close button on each thumb         |
| `--border-width-1`            | 1px     | All modal borders                           |

### Shadows

| Token             | Value                              | Usage                         |
| ----------------- | ---------------------------------- | ----------------------------- |
| `--shadow-modal`  | `0 16px 40px rgba(0, 0, 0, 0.50)`  | Modal card elevation (re-uses `--shadow-kudos-modal` from Live Board) |

---

## Layout Specifications

### Container

| Property           | Value                    | Notes                                      |
| ------------------ | ------------------------ | ------------------------------------------ |
| Frame total        | `1440 × 1024`             | Desktop overlay canvas (= page under modal) |
| Backdrop           | full viewport             | `rgba(0, 16, 26, 0.8)`                     |
| Modal card         | `752 × 1012` max          | Centered horizontally + vertically         |
| Card padding       | `40px` all sides          |                                           |
| Card gap (col)     | `32px`                    | Between sections                           |
| Card radius        | `24px`                    |                                           |
| Card background    | `#FFF8E1`                 | Cream (same as KudoCard)                   |

### Section dimensions (inside the card, widths = 672px after 40px padding)

| Section                       | Width | Height | Notes                                                   |
| ----------------------------- | ----- | ------ | ------------------------------------------------------- |
| Title (A)                     | 672   | 80     | 2 lines, centered                                       |
| Người nhận (B)                | 672   | 56     | Label 146 + gap 16 + input 514                          |
| Danh hiệu (Frame 552)         | 672   | 104    | Label 146 + input 514 row + helper text below           |
| Toolbar + Textarea (C + D)    | 672   | 268    | Toolbar 40 + textarea 200 + helper 24 (gap 4)            |
| Hashtag (E)                   | 672   | 48     | Label 108 + gap 16 + chip row 548                        |
| Image (F)                     | 672   | 80     | Label + 5 thumb squares (80×80) + "+ Image" button       |
| Anonymous (G)                 | 672   | 28     | Checkbox 24×24 + label                                   |
| Footer (H)                    | 672   | 60     | Hủy ~146 + gap 24 + Gửi 502                              |

### Layout Structure (ASCII)

```
┌── Backdrop (1440×1024, rgba(0,16,26,0.8)) ───────────────────────┐
│                                                                  │
│          ┌── Modal card (752×1012, radius 24, #FFF8E1) ────┐     │
│          │  padding: 40px, gap: 32px                        │     │
│          │                                                  │     │
│          │      Gửi lời cám ơn và ghi nhận                  │     │
│          │            đến đồng đội  (32/700 centered)       │     │
│          │                                                  │     │
│          │  Người nhận *                                    │     │
│          │  [ 🔍 Tìm kiếm                              ▼ ]  │     │
│          │                                                  │     │
│          │  Danh hiệu *                                     │     │
│          │  [ Dành tặng một danh hiệu cho đồng đội       ]  │     │
│          │  Ví dụ: Người truyền động lực cho tôi.           │     │
│          │  Danh hiệu sẽ hiển thị làm tiêu đề Kudos.        │     │
│          │                                                  │     │
│          │  ┌─────────────────────────────────────────┐     │     │
│          │  │ B I S 1=  🔗  "       Tiêu chuẩn cộng đồng │  │     │
│          │  ├─────────────────────────────────────────┤     │     │
│          │  │ Hãy gửi gắm lời cám ơn và ghi nhận đến  │     │     │
│          │  │ đồng đội tại đây nhé!                   │     │     │
│          │  │                                         │     │     │
│          │  └─────────────────────────────────────────┘     │     │
│          │       Bạn có thể "@ + tên" để nhắc đồng nghiệp   │     │
│          │                                                  │     │
│          │  Hashtag *   [+ Hashtag  Tối đa 5]               │     │
│          │                                                  │     │
│          │  Image                                           │     │
│          │  [🖼×][🖼×][🖼×][🖼×][🖼×]  [+ Image]          │     │
│          │                                                  │     │
│          │  ☐ Gửi lời cám ơn và ghi nhận ẩn danh            │     │
│          │                                                  │     │
│          │  [  Hủy ✕  ]                    [  Gửi ➤  ]     │     │
│          │                                                  │     │
│          └──────────────────────────────────────────────────┘     │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

---

## Component Style Details

### Modal container

| Property        | Value                            |
| --------------- | -------------------------------- |
| **Node ID**     | `520:11647`                      |
| width / height  | `752px / 1012px` (max)           |
| padding         | `40px`                           |
| gap             | `32px` column gap                |
| background      | `#FFF8E1`                        |
| border-radius   | `24px`                           |
| box-shadow      | `0 16px 40px rgba(0,0,0,0.5)`    |
| position        | fixed-centered via portal        |

**States:**
| State   | Changes                                               |
| ------- | ----------------------------------------------------- |
| Open    | Fade-in 200ms + scale from 0.96 to 1                  |
| Closing | Fade-out 150ms                                        |
| Reduced motion | Skip animations (`@media prefers-reduced-motion`) |

### Backdrop

| Property        | Value                           |
| --------------- | ------------------------------- |
| **Node ID**     | `520:11646`                     |
| Coverage        | Full viewport (`position: fixed; inset: 0`) |
| Background      | `rgba(0, 16, 26, 0.80)`         |
| Click behavior  | Close modal (confirm if dirty)  |

### Title (A)

| Property       | Value                          |
| -------------- | ------------------------------ |
| **Node ID**    | `I520:11647;520:9870`          |
| font           | Montserrat 32/700, line 40px, centered |
| color          | `#00101A`                      |
| width          | 672px (2 lines)                |

### Field row (Người nhận — B, Danh hiệu — Frame 552, Hashtag — E)

| Property        | Value                                  |
| --------------- | -------------------------------------- |
| Layout          | `display: flex; flex-direction: row; align-items: center; gap: 16px` |
| Label           | Montserrat 22/700 `#00101A` + `*` in `#CF1322` Noto Sans JP 16/700 |
| Input container | `flex: 1; height: 56px` (B + Frame 552); `48px` for hashtag chips |

#### Text input (receiver / danh hiệu)

| Property         | Value                                     |
| ---------------- | ----------------------------------------- |
| padding          | `16px 24px`                                |
| background       | `#FFFFFF`                                  |
| border           | `1px solid #998C5F`                        |
| border-radius    | `8px`                                      |
| placeholder      | Montserrat 16/700 `#999999`                |
| trailing icon    | `MM_MEDIA_Down` (24×24, chevron) — only on receiver |

**Input states:**
| State     | Changes                                                              |
| --------- | -------------------------------------------------------------------- |
| Default   | as above                                                             |
| Focus     | `border-color: #FFEA9E; box-shadow: 0 0 0 3px rgba(255,234,158,0.25)` |
| Invalid   | `border-color: #CF1322; color: #00101A`                               |
| Disabled  | `background: #F3F4F6; color: #999999; cursor: not-allowed`           |

### Content editor toolbar (C)

| Property        | Value                                  |
| --------------- | -------------------------------------- |
| **Node ID**     | `I520:11647;520:9877`                  |
| Height          | `40px`                                 |
| Layout          | `display: flex; flex-direction: row; align-items: center; justify-content: flex-end` |
| Button (atom)   | 40×40 container, inner `padding: 10px 16px`, `gap: 8px`, icon 24×24 |
| Button border   | `1px solid #998C5F`                     |
| Button radius   | First button `8px 0 0 0`, middle buttons `0`, "Tiêu chuẩn cộng đồng" end `0 8px 0 0` |
| Button bg       | `rgba(0, 0, 0, 0)` (transparent)        |

**Toolbar buttons & icons**

| Node ID                          | Role     | Icon                   |
| -------------------------------- | -------- | ---------------------- |
| `I520:11647;520:9881` (C.1)      | Bold     | `MM_MEDIA_Bold`        |
| `I520:11647;662:11119` (C.2)     | Italic   | `MM_MEDIA_Italic`      |
| `I520:11647;662:11213` (C.3)     | Strike   | `MM_MEDIA_Strikethrough` |
| `I520:11647;662:10376` (C.4)     | Numbered | `MM_MEDIA_Number List` |
| `I520:11647;662:10507` (C.5)     | Link     | `MM_MEDIA_Link`        |
| `I520:11647;662:10647` (C.6)     | Quote    | `MM_MEDIA_Quote`       |
| `I520:11647;3053:11619`          | Link button | Text "Tiêu chuẩn cộng đồng" (red) |

**Toolbar button states:**
| State       | Background                      | Icon color                        |
| ----------- | ------------------------------- | --------------------------------- |
| Default     | transparent                     | `#00101A`                         |
| Hover       | `rgba(255, 234, 158, 0.10)`     | `#00101A`                         |
| Active (formatting ON) | `rgba(255, 234, 158, 0.40)` | `#00101A`                         |
| Focus       | outline `2px solid #FFEA9E`     | `#00101A`                         |

**Community standards link (right cell):**
- `font: 16px / 24px / 700 Montserrat`
- `color: #E46060`
- `text-align: right`
- On hover: `text-decoration: underline`

### Textarea (D)

| Property         | Value                                   |
| ---------------- | --------------------------------------- |
| **Node ID**      | `I520:11647;520:9886`                   |
| height           | `200px` (min-height 120px)              |
| padding          | `16px 24px`                             |
| background       | `#FFFFFF`                                |
| border           | `1px solid #998C5F`                      |
| border-radius    | `0 0 8px 8px` (joins the toolbar above) |
| placeholder      | Montserrat 16/700 `#999999`              |
| resize           | vertical                                 |

**Helper text (D.1)**
- `font: 16/24/700 Montserrat`, `color: #00101A`
- Positioned below the textarea (gap 4px).

### Hashtag field (E)

| Property       | Value                                       |
| -------------- | ------------------------------------------- |
| **Node ID**    | `I520:11647;520:9890`                       |
| Label area     | "Hashtag *" 22/700                          |
| Chip container | `flex: 1; gap: 8px; height: 48px`           |

**Selected hashtag chip** (future state, not drawn but implied):
- `background: rgba(255, 234, 158, 0.40)`
- `color: #00101A`
- `padding: 4px 12px`
- `border-radius: 9999px`
- trailing `×` remove icon `#D4271D` 16×16

**"+ Hashtag" button (E-add)** — node `I520:11647;662:8911`:
- `padding: 4px 8px`, `height: 48px`
- `border: 1px solid #998C5F`
- `background: #FFFFFF`
- `border-radius: 8px`
- Inside: plus icon + stacked text "Hashtag" + "Tối đa 5"
- Inner text: Montserrat 11/700 `#999999`, letter-spacing `0.5px`

**"+ Hashtag" states:**
| State          | Changes                                                                         |
| -------------- | ------------------------------------------------------------------------------- |
| Default        | as above                                                                        |
| Hover          | `background: #FFF8E1` (subtle cream), `border-color: #FFEA9E`                    |
| Focus          | `outline: 2px solid #FFEA9E; outline-offset: 2px`                               |
| Dropdown open  | `border-color: #FFEA9E`; chevron (if present) rotates 180°                      |
| Disabled (5/5) | Button is **hidden** (not shown greyed out) per spec FR                         |

**Selected hashtag chip (rendered inside the Tag Group, predicted state — confirm with Q9):**
- `background: rgba(255, 234, 158, 0.40)`
- `color: #00101A`
- `padding: 6px 12px`
- `border-radius: 9999px`
- Trailing `×` 16×16 in `#D4271D`; hover fades opacity to 0.7.

### Image uploader (F)

| Property         | Value                                    |
| ---------------- | ---------------------------------------- |
| **Node ID**      | `I520:11647;520:9896`                    |
| Layout           | `flex; gap: 16px; align-items: center`    |
| Label            | "Image" 22/700 (F.1 — no asterisk)        |
| Thumb frame      | 80×80, `border: 1px solid #998C5F`, `border-radius: 18px` |
| Thumb image      | 80×80 inner, `border: 1px solid #FFEA9E`, `border-radius: 4px` |
| Remove button    | 20×20 absolute top-right, `background: #D4271D`, `border-radius: 9999px`, white ✕ icon 17×17 |
| "+ Image" button | 98×48, vertical stack: plus icon 24 + "Image" (11/700 `#999`) + "Tối đa 5" (smaller) |

**Image states:**
| State        | Changes                                                          |
| ------------ | ---------------------------------------------------------------- |
| Uploading    | Thumb shows a circular progress ring overlay                     |
| Failed       | Red border + alert icon; click remove retries or discards        |
| 5/5 reached  | "+ Image" button hidden                                          |

### Anonymous checkbox (G)

| Property       | Value                                 |
| -------------- | ------------------------------------- |
| **Node ID**    | `I520:11647;520:14099`                |
| Checkbox atom  | 24×24, `1px solid #999`, `border-radius: 4px`, `background: #FFF` |
| Checked mark   | Inset check glyph in `#00101A` on `#FFEA9E` filled box |
| Label          | Montserrat 22/700 `#999999` when unchecked, `#00101A` when checked |

**Checkbox states:**
| State        | Changes                                                                     |
| ------------ | --------------------------------------------------------------------------- |
| Unchecked    | as above (default)                                                          |
| Hover        | `border-color: #998C5F`                                                      |
| Focus        | `outline: 2px solid #FFEA9E; outline-offset: 2px`                            |
| Checked      | `background: #FFEA9E; border-color: #FFEA9E`; label color darkens to `#00101A` |
| Disabled     | `opacity: 0.5; cursor: not-allowed` (never used in default flow)            |

### Footer actions (H)

| Property       | Value                                 |
| -------------- | ------------------------------------- |
| **Node ID**    | `I520:11647;520:9905`                 |
| Layout         | `flex; gap: 24px`                      |
| Height         | `60px`                                 |

#### H.1 — Hủy (cancel)

| Property         | Value                                     |
| ---------------- | ----------------------------------------- |
| padding          | `16px 40px`                               |
| background       | `rgba(255, 234, 158, 0.10)`                |
| border           | `1px solid #998C5F`                        |
| border-radius    | `4px`                                      |
| label            | Montserrat 16/700 `#00101A` "Hủy"         |
| trailing icon    | `MM_MEDIA_Close` 24×24                     |

**States:**
| State    | Changes                                                   |
| -------- | --------------------------------------------------------- |
| Hover    | `background: rgba(255, 234, 158, 0.25)`                    |
| Focus    | `outline: 2px solid #FFEA9E`                               |
| Disabled | `opacity: 0.5; cursor: not-allowed` (never in default state) |

#### H.2 — Gửi (submit)

| Property         | Value                                     |
| ---------------- | ----------------------------------------- |
| width / height   | `502px / 60px` (expand to fill remainder) |
| padding          | `16px`                                    |
| background       | `#FFEA9E`                                  |
| border-radius    | `8px`                                      |
| label            | Montserrat 22/700 `#00101A` "Gửi"          |
| leading icon     | `MM_MEDIA_Send` 24×24                      |

**States:**
| State        | Changes                                             |
| ------------ | --------------------------------------------------- |
| Hover        | `background: #FFF3C6`                               |
| Active       | `background: #FAE287`                                |
| Focus        | `outline: 2px solid #00101A; outline-offset: 2px`   |
| Disabled     | `opacity: 0.5; cursor: not-allowed` (when form invalid) |
| Loading      | Spinner replaces send icon; label unchanged        |

---

### Dirty-close confirm dialog (new sub-modal — see spec FR-017)

Rendered as a nested `role="alertdialog"` on top of the main modal when the user tries to close with a dirty form.

| Property        | Value                                                 |
| --------------- | ----------------------------------------------------- |
| Size            | `400 × 200` centered                                   |
| Background      | `#FFF8E1` (cream, same as main modal)                 |
| Border          | `1px solid #998C5F`                                    |
| Border-radius   | `16px`                                                 |
| Padding         | `24px`                                                 |
| Shadow          | `--shadow-modal` (`0 16px 40px rgba(0,0,0,0.5)`)       |
| Title           | "Bỏ bản nháp này?" Montserrat 20/700 `#00101A`         |
| Body            | "Nội dung chưa gửi sẽ bị mất." Montserrat 16/500 `#2E3940` |
| Actions         | Row, gap 16px, right-aligned                          |
| `[Bỏ]`          | Cancel-style button (secondary) — closes the main modal too |
| `[Tiếp tục viết]` | Primary gold button — closes the sub-modal, returns to compose with data intact. **Default focus.** |

**States:**
| State   | Changes                                                    |
| ------- | ---------------------------------------------------------- |
| Open    | Backdrop dim (`rgba(0,16,26,0.4)` over existing modal)      |
| Closing | Fade-out 120ms                                              |

---

## Component Hierarchy with Styles

```
Backdrop (fixed inset, bg rgba(0,16,26,0.8))
└── ModalCard (752×1012, p:40, gap:32, bg:#FFF8E1, radius:24, shadow-modal)
    ├── Title A (32/700 centered #00101A)
    ├── ReceiverField B (row, gap:16)
    │   ├── Label "Người nhận *" (22/700 + red *)
    │   └── Input 514×56 (radius 8, border gold, bg #FFF, placeholder 16/700 #999, chevron-down)
    ├── DanhHieuField (Frame 552, col stack)
    │   ├── Row (label 22/700 + input 514×56)
    │   └── Helper text "Ví dụ: Người truyền động lực…" 14/500 #999
    ├── ContentEditor (col, gap 4)
    │   ├── Toolbar 672×40 (flex row, border gold, radius 8/8/0/0)
    │   │   ├── Bold | Italic | Stroke | NumberList | Link | Quote
    │   │   └── CommunityStandardsLink 336×40 "Tiêu chuẩn cộng đồng" #E46060
    │   ├── Textarea 672×200 (border gold, bg #FFF, radius 0 0 8 8, placeholder 16/700 #999)
    │   └── HelperText D.1 "Bạn có thể '@ + tên' để nhắc…" 16/700 #00101A
    ├── HashtagField E (row, gap 16)
    │   ├── Label "Hashtag *" (22/700)
    │   ├── TagGroup (flex row gap 8)
    │   └── AddHashtag button (border gold, radius 8, bg #FFF, 98×48)
    ├── ImageUploader F (row, gap 16)
    │   ├── Label "Image" (22/700)
    │   ├── ImageThumb × N (80×80, radius 18, inner 4, remove #D4271D 20×20)
    │   └── AddImage button (98×48, radius 8, plus icon + "Image" + "Tối đa 5")
    ├── AnonymousCheckbox G (row, gap 16)
    │   ├── Checkbox (24×24, radius 4, border #999)
    │   └── Label "Gửi lời cám ơn và ghi nhận ẩn danh" (22/700 #999 → #00101A when checked)
    └── FooterActions H (row, gap 24, 60 high)
        ├── CancelButton (border gold, radius 4, padding 16/40)
        └── SubmitButton 502×60 (bg #FFEA9E, radius 8)
```

---

## Responsive Specifications

### Breakpoints

| Name     | Min Width | Max Width |
| -------- | --------- | --------- |
| Mobile   | 0         | 767px     |
| Tablet   | 768px     | 1023px    |
| Desktop  | 1024px    | ∞         |

### Responsive Changes

#### Mobile (< 768px) — bottom-sheet pattern

| Component         | Changes                                                                     |
| ----------------- | --------------------------------------------------------------------------- |
| Modal card        | `max-width: 100vw; width: 100vw; min-height: 100vh; border-radius: 24px 24px 0 0; padding: 24px 16px; gap: 24px` |
| Title             | `font-size: 24px; line-height: 32px`                                        |
| Labels            | `font-size: 18px`                                                            |
| Field rows        | wrap (label on top, input below)                                             |
| Footer            | sticky at bottom of viewport (padding-bottom safe area)                     |
| Gửi button        | `width: 100%`                                                                |
| Image thumbs      | 2-up grid (64×64 each)                                                       |

#### Tablet (768 – 1023px)

| Component         | Changes                                             |
| ----------------- | --------------------------------------------------- |
| Modal card        | `max-width: 640px; padding: 32px; gap: 24px`         |
| Image thumbs      | keep horizontal scroll if overflow                   |

#### Desktop (≥ 1024px)

Matches Figma `752 × 1012` max.

---

## Icon Specifications

| Icon Name                     | Size  | Color       | Usage                                 |
| ----------------------------- | ----- | ----------- | ------------------------------------- |
| `MM_MEDIA_Down`               | 24×24 | `#00101A`   | Receiver chevron dropdown arrow       |
| `MM_MEDIA_Bold`               | 24×24 | `#00101A`   | Toolbar C.1                           |
| `MM_MEDIA_Italic`             | 24×24 | `#00101A`   | Toolbar C.2                           |
| `MM_MEDIA_Strikethrough`      | 24×24 | `#00101A`   | Toolbar C.3                           |
| `MM_MEDIA_Number List`        | 24×24 | `#00101A`   | Toolbar C.4                           |
| `MM_MEDIA_Link`               | 24×24 | `#00101A`   | Toolbar C.5                           |
| `MM_MEDIA_Quote`              | 24×24 | `#00101A`   | Toolbar C.6                           |
| `MM_MEDIA_Plus`               | 24×24 | `#999999`   | `+ Hashtag`, `+ Image` buttons        |
| `MM_MEDIA_Close Tiny`         | 17×17 | `#FFFFFF` on `#D4271D` circle | Image thumb remove |
| `MM_MEDIA_Close`              | 24×24 | `#00101A`   | Hủy trailing icon                     |
| `MM_MEDIA_Send`               | 24×24 | `#00101A`   | Gửi leading icon                      |

All icons must flow through the shared `<Icon />` atom established for the Live Board feature. Extend its `KudosIconName` union with the new icons from this modal:

### Asset Registry additions (to `public/assets/kudos/icons/`)

| File                                      | Source Figma Node                | Purpose                               |
| ----------------------------------------- | -------------------------------- | ------------------------------------- |
| `public/assets/kudos/icons/bold.svg`      | `MM_MEDIA_Bold`                  | Toolbar C.1                           |
| `public/assets/kudos/icons/italic.svg`    | `MM_MEDIA_Italic`                | Toolbar C.2                           |
| `public/assets/kudos/icons/strikethrough.svg` | `MM_MEDIA_Strikethrough`     | Toolbar C.3                           |
| `public/assets/kudos/icons/number-list.svg` | `MM_MEDIA_Number List`         | Toolbar C.4                           |
| `public/assets/kudos/icons/quote.svg`     | `MM_MEDIA_Quote`                 | Toolbar C.6                           |
| `public/assets/kudos/icons/plus.svg`      | `MM_MEDIA_Plus`                  | + Hashtag, + Image                    |
| `public/assets/kudos/icons/close.svg`     | `MM_MEDIA_Close`                 | Hủy button trailing icon              |
| `public/assets/kudos/icons/close-tiny.svg` | `MM_MEDIA_Close Tiny`           | Image remove × glyph                  |

Reused from Live Board (no new file): `pen.svg`, `search.svg`, `chevron-down.svg`, `send.svg`, `link.svg`, `heart.svg`, `open-gift.svg`, `star.svg`.

---

## Animation & Transitions

| Element             | Property                     | Duration | Easing       | Trigger           |
| ------------------- | ---------------------------- | -------- | ------------ | ----------------- |
| Backdrop            | opacity 0 → 1                | 200ms    | ease-out     | Open              |
| Modal card          | opacity 0 → 1 + scale 0.96 → 1 | 200ms  | ease-out     | Open              |
| Modal close         | opacity 1 → 0 + scale 1 → 0.96 | 150ms  | ease-in      | Close             |
| Toolbar button      | background                   | 150ms    | ease-in-out  | Hover / toggle    |
| Input focus         | border-color + box-shadow    | 150ms    | ease-in-out  | Focus             |
| Submit loading      | opacity 1 → 0.85             | 100ms    | ease-out     | Mutation pending  |
| Toast (success)     | translateY(8px → 0) + opacity | 200ms   | ease-out     | Send success      |

Gated by `@media (prefers-reduced-motion: reduce)` — set durations to `0ms`.

---

## Implementation Mapping

Per constitution (frontend.md): **no raw color / spacing / typography literals in component files**. Consume via CSS variables or Tailwind utilities bound to them. The tokens above should be registered inside the existing `src/app/globals.css` Kudos block (alongside the Live Board tokens).

| Design Element       | Figma Node ID            | Tailwind / CSS hint                                                                                     | React Component                   |
| -------------------- | ------------------------ | ------------------------------------------------------------------------------------------------------- | --------------------------------- |
| Backdrop             | `520:11646`              | `fixed inset-0 bg-kudos-modal-backdrop`                                                                  | `<ModalBackdrop />`               |
| Modal card           | `520:11647`              | `w-[752px] max-w-full rounded-modal-card bg-kudos-card-cream p-modal-padding gap-modal-section shadow-modal` | `<ComposeKudoModal />`           |
| Title                | `I520:11647;520:9870`    | `text-modal-title text-kudos-on-light text-center`                                                       | `<ModalTitle />`                  |
| Receiver field       | `I520:11647;520:9871`    | `<FieldRow label="Người nhận" required>`                                                                 | `<ReceiverAutocomplete />`        |
| Danh hiệu field      | `I520:11647;1688:10448`  | `<FieldRow label="Danh hiệu" required helper>`                                                           | `<DanhHieuInput />`               |
| Toolbar              | `I520:11647;520:9877`    | `flex flex-row items-center h-10 border border-kudos-input-border`                                       | `<ContentEditorToolbar />`        |
| Toolbar button       | `I520:11647;520:9881`    | `inline-flex items-center justify-center h-10 px-4 border-r border-kudos-input-border`                   | `<FormatButton format="bold">`    |
| Community link       | `I520:11647;3053:11619`  | `text-body text-kudos-community-link hover:underline text-right`                                         | `<CommunityStandardsLink />`      |
| Textarea             | `I520:11647;520:9886`    | `w-full min-h-[200px] rounded-modal-textarea border border-kudos-input-border bg-kudos-input-bg px-6 py-4` | `<KudoTextarea />`                |
| Hashtag add button   | `I520:11647;662:8911`    | `h-12 rounded-modal-input border border-kudos-input-border bg-kudos-input-bg px-2 py-1 flex-col`         | `<AddHashtagButton />`            |
| Hashtag chip (selected) | `E.2_Tag Group children` | `rounded-full bg-[color:rgba(255,234,158,0.4)] px-3 py-1`                                            | `<HashtagPill onRemove={…} />`    |
| Image thumb          | `I520:11647;662:9197`    | `relative w-20 h-20 rounded-[18px] border border-kudos-input-border p-0.5`                               | `<KudoImageThumb />`               |
| Image remove btn     | `I520:11647;662:9197;662:9287` | `absolute top-0.5 right-0.5 w-5 h-5 rounded-full bg-kudos-remove-btn`                              | `<ImageRemoveButton />`           |
| Add image button     | `I520:11647;662:9132`    | `flex flex-col items-center gap-0.5 h-12 px-2`                                                            | `<AddImageButton />`              |
| Anonymous checkbox   | `I520:11647;520:14099`   | `inline-flex items-center gap-4`                                                                         | `<AnonymousCheckbox />`           |
| Cancel button        | `I520:11647;520:9906`    | `h-[60px] rounded-modal-cancel border border-kudos-cancel-border bg-kudos-cancel-bg px-10 py-4 text-body` | `<ModalCancelButton />`           |
| Submit button        | `I520:11647;520:9907`    | `flex-1 h-[60px] rounded-modal-input bg-kudos-submit-bg text-submit text-kudos-on-light`                  | `<ModalSubmitButton />`           |
| Confirm dialog       | (new sub-modal, see Dirty-close confirm dialog section) | `w-[400px] rounded-2xl bg-kudos-card-cream border border-kudos-input-border p-6 shadow-modal` | `<DirtyCloseConfirmDialog />` |
| Character counter    | (under Danh hiệu + textarea) | `text-body-sm text-right text-kudos-placeholder data-[over]:text-kudos-required-star`                   | `<CharCounter value={n} max={…} />` |

---

## Notes

- The modal's card color (`#FFF8E1`) is **exactly the same** as the Kudo cream card on the Live Board — reuse `--color-kudos-card-cream`. Visually the modal "rises out" of the All-Kudos feed surface when opened.
- Title uses Montserrat 32/700 — this is **the only 32px token** in the Kudos feature; add a new `--text-modal-title` variable rather than extending existing `--text-kudos-hero-size` (which is 57px and for page-hero scale).
- The toolbar is a horizontal row of pill-less segmented buttons sharing a single outer border with `border-radius: 8px 8px 0 0`. The textarea below continues that shape with `border-radius: 0 0 8px 8px`. Render them as two visually joined pieces but keep them as **separate components** for focus/state isolation.
- The required `*` uses **Noto Sans JP** in the Figma metadata — this is stylistic (a glyph difference). Either load Noto Sans JP or fall back to the Montserrat `*` — the visual impact is minor; document the fallback in the Implementation Mapping section.
- "Tiêu chuẩn cộng đồng" = "Community Standards". Current assumption: links to an in-app page or external doc — see spec.md Q3.
- Mention popover (triggered by `@` in the textarea) is **not drawn in this frame**. Treat it as an overlay component styled like `DropdownFilter` from the Live Board: `bg: #00070C`, `border: 1px solid #998C5F`, `radius: 12px`, `shadow: --shadow-kudos-dropdown`.
- Contrast check: `#00101A` on `#FFF8E1` = 16.8:1 ✅ AAA. `#E46060` on `#FFF8E1` = 3.4:1 — **fails AA for body text**; OK only because it's a link with underline on hover. Consider darkening to `#CF1322` if stakeholders want stricter contrast — confirm in review.
