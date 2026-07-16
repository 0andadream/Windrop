# 🚀 Deploying WinDrop

Two deployables live in this repo:

| What | Where | How |
| --- | --- | --- |
| **Website** (`/`) | Netlify | GitHub Actions → `deploy-web.yml` |
| **Extension** (`/extension`) | Chrome Web Store | GitHub Actions → `deploy-extension.yml` |

CI (`.github/workflows/ci.yml`) builds both on every push/PR. The deploy
workflows only run on `main` (site) and `ext-v*` tags (extension), and they
**soft-skip** until you add the secrets below — so nothing fails while you set
things up.

---

## Part 1 — Website on Netlify (GitHub Actions)

### 1. Create the Netlify site

1. Sign in at [app.netlify.com](https://app.netlify.com).
2. **Add new site → Import from Git** and pick this repo (or **Add new site →
   Deploy manually** to just reserve a site — the Actions workflow does the
   builds either way).
3. Note the **Site ID**: Site configuration → General → **Site information →
   Site ID**.

### 2. Create a Netlify auth token

Netlify → **User settings → Applications → Personal access tokens → New access
token**. Copy it.

### 3. Add the GitHub secrets

Repo → **Settings → Secrets and variables → Actions → New repository secret**:

| Secret | Value |
| --- | --- |
| `NETLIFY_AUTH_TOKEN` | the personal access token from step 2 |
| `NETLIFY_SITE_ID` | the Site ID from step 1 |

### 4. Set the site's environment variables (in Netlify)

Netlify → Site configuration → **Environment variables**:

| Variable | Value |
| --- | --- |
| `NEXT_PUBLIC_PRIVY_APP_ID` | your **production** Privy app ID ([dashboard.privy.io](https://dashboard.privy.io)) |
| `NEXT_PUBLIC_SITE_URL` | your site URL, e.g. `https://your-site.netlify.app` |
| `NEXT_PUBLIC_BASE_RPC_URL` | *(optional)* a custom Base RPC |

> In your Privy app settings, add your Netlify domain to the **Allowed origins**
> so login works in production.

### 5. Deploy

Push to `main` (or run **Actions → Deploy website → Run workflow**). The
workflow runs `netlify deploy --build --prod`, which builds with Netlify's
Next.js runtime and publishes.

After the first deploy, set `NEXT_PUBLIC_SITE_URL` to the real URL (step 4) and
redeploy so social/OG tags are correct.

> **Simpler alternative:** if you'd rather skip Actions, just connect the repo
> in Netlify's UI (step 1, "Import from Git") — Netlify will build on every push
> using `netlify.toml`. In that case you don't need the two secrets above.

---

## Part 2 — Extension on the Chrome Web Store

### 1. Point the extension at your live site

Repo → **Settings → Secrets and variables → Actions → Variables → New
repository variable**:

| Variable | Value |
| --- | --- |
| `PLASMO_PUBLIC_WINDROP_URL` | your deployed site URL (e.g. `https://your-site.netlify.app`) |

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
| `NETLIFY_AUTH_TOKEN` | secret | `deploy-web` | Authenticate the Netlify CLI |
| `NETLIFY_SITE_ID` | secret | `deploy-web` | Target Netlify site |
| `NEXT_PUBLIC_PRIVY_APP_ID` | Netlify env | site build | Privy auth |
| `NEXT_PUBLIC_SITE_URL` | Netlify env | site build | Canonical URL for OG tags |
| `PLASMO_PUBLIC_WINDROP_URL` | repo variable | `deploy-extension` | Where gift links point |
| `BPP_KEYS` | secret | `deploy-extension` | Chrome Web Store auto-publish |
