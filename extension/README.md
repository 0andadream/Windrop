# 🎟️ WinDrop Browser Extension

Gift [Megapot](https://megapot.io) lottery tickets to anyone on **X** — a
one-tap **🎟️ WinDrop** button right next to their Follow button, plus a
toolbar popup for quick gifting.

Built with [Plasmo](https://docs.plasmo.com) (Manifest V3).

---

## What it does

- **Profile button** — injects a gradient **🎟️ WinDrop** button into the action
  row of every `x.com` / `twitter.com` profile, beside Follow. Clicking it opens
  `https://windrop.xyz/gift?to=@username` in a new tab.
- **Popup** — click the toolbar icon for a quick gift preview: it auto-detects
  the handle of the profile you're viewing, lets you pick a ticket count
  (presets, ± stepper, 🎲 surprise), shows the USDC total, and deep-links into
  WinDrop.

The extension never touches your keys or funds — it only builds a WinDrop link.
All signing happens on windrop.xyz.

---

## Folder structure

```
extension/
├── package.json          Plasmo config + MV3 manifest overrides
├── tsconfig.json
├── popup.tsx             Toolbar popup — quick gift preview
├── contents/
│   └── x-profile.ts      Content script — injects the profile button
├── lib/
│   └── windrop.ts        Shared config, handle detection, link builder
└── assets/
    └── icon.png          Source icon (Plasmo generates all sizes)
```

Plasmo derives the MV3 `manifest.json` automatically:

- `popup.tsx` → `action.default_popup`
- `contents/x-profile.ts` → a content script (matches from its `PlasmoCSConfig`)
- `assets/icon.png` → generated icon set
- `package.json → manifest` → `permissions` / `host_permissions`

---

## Develop

```bash
cd extension
npm install
npm run dev
```

Then load the unpacked dev build in Chrome:

1. Visit `chrome://extensions`
2. Enable **Developer mode**
3. **Load unpacked** → select `extension/build/chrome-mv3-dev`
4. Open any X profile — the **🎟️ WinDrop** button appears next to Follow.

## Build for production

```bash
npm run build      # → build/chrome-mv3-prod
npm run package    # → a zipped, store-ready bundle
```

Target another browser with `--target`, e.g. `plasmo build --target=firefox-mv3`.

---

## Permissions

| Permission | Why |
| --- | --- |
| `activeTab` | Read the current tab's URL in the popup to auto-detect the profile handle. Granted only when you click the extension. |
| `host_permissions: x.com / twitter.com` | Run the content script that injects the button on profile pages. |

No background page, no analytics, no remote code.
