# 🎁 WinDrop — Brand Kit

Everything you need to represent **WinDrop** consistently: gift Megapot lottery
tickets to any wallet on Base. Playful, vibrant, and Web3-native — inspired by
Megapot's energetic look (vivid blues, lucky greens, jackpot yellow).

---

## 1. Logo

**Concept.** The mark is a **droplet** — the "drop" of Win**Drop** — carrying a
golden four-point **spark** inside it: the moment of luck landing in someone's
wallet. It reads as a gift, a drop, and a win all at once. The rounded-square
container makes it work as an app icon.

| Asset | File | Use |
| --- | --- | --- |
| App icon / favicon | [`app/icon.svg`](../app/icon.svg) | Browser tab, PWA, small sizes |
| Logo mark (square) | [`public/logo-mark.svg`](../public/logo-mark.svg) | Avatars, app stores, standalone mark |
| Wordmark (light bg) | [`public/logo.svg`](../public/logo.svg) | Headers on light surfaces |
| Wordmark (dark bg) | [`public/logo-dark.svg`](../public/logo-dark.svg) | Headers on dark surfaces |
| Apple touch icon | [`public/apple-icon.png`](../public/apple-icon.png) | iOS home screen (180×180) |
| Icon raster | [`public/favicon-512.png`](../public/favicon-512.png) | Fallback PNG favicon (512×512) |

**Wordmark.** `Win` is set in solid ink (or white on dark); `Drop` uses the
brand gradient. Typeface: **Inter, weight 900 (Black)**, letter-spacing `-2`.

**Clear space.** Keep padding of at least the height of the droplet around the
full logo. Don't crowd it.

**Don'ts.** Don't recolor the droplet, don't stretch or skew, don't add drop
shadows to the wordmark, don't place the light wordmark on a busy light photo.

---

## 2. Color palette

Megapot-inspired: electric blue leads, lucky green supports, jackpot yellow is
the accent that signals a win.

### Core

| Token | Hex | Role |
| --- | --- | --- |
| **WinDrop Blue** | `#3563ff` | Primary — buttons, links, brand |
| **Iris** | `#6d5cf6` | Gradient mid-stop, secondary |
| **Lucky Green** | `#22c55e` | Success, "you won", gradient end |
| **Jackpot Yellow** | `#facc15` | Accent — sparks, highlights, 🎲 |
| **Confetti Pink** | `#ec4899` | Tertiary accent, celebration |
| **Ink** | `#0b1120` | Dark background / dark text |
| **Cloud** | `#ffffff` | Light background / on-dark text |

### Blue ramp (matches `tailwind.config.ts` `brand`)

| 50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `#eef4ff` | `#d9e6ff` | `#bcd3ff` | `#8eb5ff` | `#598cff` | `#3563ff` | `#1f40f5` | `#1730e1` | `#1929b6` | `#1a288f` |

### Signature gradient

The WinDrop gradient runs **blue → iris → green**, used on the logo, ticket
count, and primary buttons:

```css
background: linear-gradient(135deg, #3563ff 0%, #6d5cf6 55%, #22c55e 100%);
```

The "celebration" gradient (Surprise button, confetti) adds warmth:

```css
background: linear-gradient(135deg, #facc15 0%, #ec4899 100%);
```

---

## 3. Typography

- **Family:** [Inter](https://rsms.me/inter/) (loaded via `next/font`).
- **Display / ticket counts:** weight **900 (Black)**, tight tracking.
- **Body:** weight 400–600.
- **Numerals:** use `tabular-nums` for ticket counts and USDC totals so the
  stepper doesn't jump.

---

## 4. Taglines

**Primary**

> **Gift Lottery Luck**

**Punchy alternates**

- One Tap, Big Wins
- Drop Someone Some Luck
- Send a Shot at the Jackpot
- Luck, Gift-Wrapped
- Someone's Feeling Lucky

**Descriptor (for meta / stores)**

> Gift Megapot lottery tickets to any wallet on Base.

**Voice.** Warm, generous, a little cheeky. Celebrate the recipient, never
overpromise the odds. Emoji in moderation: 🎁 🍀 🎉 🎲.

---

## 5. Favicon & social preview

- **Favicon:** `app/icon.svg` (auto-served by Next.js at all sizes). PNG
  fallback at `public/favicon-512.png`.
- **Apple touch icon:** `app/apple-icon.png` (180×180).
- **Open Graph / Twitter card:** `public/og-image.png` (1200×630), wired into
  `app/layout.tsx` via `openGraph.images` and `twitter.card`. SVG source at
  `public/og-image.svg` for edits — re-export with:

```bash
npx sharp-cli -i public/og-image.svg -o public/og-image.png resize 1200 630
```

> Social platforms (Twitter/X, Slack, Facebook) require raster images, so the
> PNG is the canonical share asset; the SVG is the editable master.

---

## 6. Quick reference

```
Blue      #3563ff      Green   #22c55e      Yellow  #facc15
Iris      #6d5cf6      Pink    #ec4899      Ink     #0b1120
Gradient  135°, #3563ff → #6d5cf6 → #22c55e
Font      Inter (Black 900 for display)
Tagline   "Gift Lottery Luck"
```
