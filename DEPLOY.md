# 🚀 Deploying WinDrop

Two deployables live in this repo:

| What | Where | How |
| --- | --- | --- |
| **Website** (`/` + `/gift`) | Vercel | Native Git integration (auto-deploy on push) |
| **Extension** (`/extension`) | Chrome Web Store | GitHub Actions → `deploy-extension.yml` |

CI (`.github/workflows/ci.yml`) builds the site + extension on every push/PR.
Vercel handles website deploys directly from GitHub — no Actions secrets needed.

---

## Part 1 — Website on Vercel

Next.js is Vercel's native framework, so this is zero-config.

### 1. Import the repo

1. Sign in at [vercel.com](https://vercel.com) with GitHub.
2. **Add New… → Project → Import** this repository.
3. Framework preset auto-detects **Next.js**. Leave build/output settings at
   their defaults (`next build`). Click **Deploy**.

Vercel now rebuilds automatically on every push to the connected branch, with
preview deployments for other branches and PRs.

### 2. Set environment variables

Vercel → Project → **Settings → Environment Variables** (Production + Preview):

| Variable | Value |
| --- | --- |
| `NEXT_PUBLIC_PRIVY_APP_ID` | your **production** Privy app ID ([dashboard.privy.io](https://dashboard.privy.io)) |
| `NEXT_PUBLIC_SITE_URL` | your site URL, e.g. `https://your-app.vercel.app` |
| `NEXT_PUBLIC_BASE_RPC_URL` | *(optional)* a custom Base RPC |

Redeploy after adding them (Deployments → ⋯ → Redeploy) so they're inlined.

> - The marketing landing (`/`) renders without any wallet config. Only the
>   `/gift` app needs `NEXT_PUBLIC_PRIVY_APP_ID` — without it, `/gift` shows a
>   friendly setup screen.
> - In your Privy app settings, add your Vercel domain to the **Allowed origins**
>   so wallet login works in production.

---

## Part 2 — Extension on the Chrome Web Store

### 1. Point the extension at your live site

Repo → **Settings → Secrets and variables → Actions → Variables → New
repository variable**:

| Variable | Value |
| --- | --- |
| `PLASMO_PUBLIC_WINDROP_URL` | your deployed site URL (e.g. `https://your-app.vercel.app`) |

(Or set it in `extension/.env` for local builds. Falls back to
`https://windrop.xyz` if unset.)

### 2. Get the packaged zip

Run **Actions → Build & publish extension → Run workflow**. Download the
**`windrop-chrome-mv3`** artifact — that's your store-ready
`chrome-mv3-prod.zip`.

(Locally: `cd extension && npm ci && npm run build && npm run package` →
`extension/build/chrome-mv3-prod.zip`.)

### 3. First submission (manual — one time)

The Chrome Web Store API can only *update* an existing item, so the first
upload is done by hand:

1. Create a developer account at the
   [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole)
   (one-time $5 fee).
2. **Add new item** → upload `chrome-mv3-prod.zip`.
3. Fill the listing from [`extension/store/LISTING.md`](./extension/store/LISTING.md),
   add the screenshots/promo tiles in [`extension/store/`](./extension/store/),
   and link the privacy policy from
   [`extension/store/PRIVACY.md`](./extension/store/PRIVACY.md) (host it on your
   site, e.g. `/privacy`).
4. Submit for review.

### 4. Automated updates (optional)

Once the item exists, you can publish updates from CI:

1. Follow the [BPP setup](https://github.com/PlasmoHQ/bpp) to generate your
   Chrome Web Store API credentials JSON.
2. Add it as the `BPP_KEYS` repo **secret**.
3. Bump `extension/package.json` `version`, commit, then push a tag:

   ```bash
   git tag ext-v0.1.1 && git push origin ext-v0.1.1
   ```

   `deploy-extension.yml` builds, packages, and publishes the update.

> Firefox/Edge: `plasmo build --target=firefox-mv3` (or `edge-mv3`) and add
> those keys to `BPP_KEYS`.

---

## Secrets & variables at a glance

| Name | Type | Used by | Purpose |
| --- | --- | --- | --- |
| `NEXT_PUBLIC_PRIVY_APP_ID` | Vercel env | site build | Privy auth (needed by `/gift`) |
| `NEXT_PUBLIC_SITE_URL` | Vercel env | site build | Canonical URL for OG tags |
| `NEXT_PUBLIC_BASE_RPC_URL` | Vercel env | site build | *(optional)* custom Base RPC |
| `PLASMO_PUBLIC_WINDROP_URL` | repo variable | `deploy-extension` | Where gift links point |
| `BPP_KEYS` | secret | `deploy-extension` | Chrome Web Store auto-publish |
