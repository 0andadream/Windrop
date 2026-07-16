# 🎁 WinDrop

Gift [Megapot](https://megapot.io) lottery tickets to any wallet on **Base**.
Pick a ticket count, drop in a recipient address, and send them a shot at the
jackpot — one tap, non-custodial, referrer-free.

Built with **Next.js 15** (App Router) + **React 19**, **Privy** auth wired
through **wagmi**, **viem**, and **Tailwind CSS**.

---

## How it works

Gifting a ticket runs a two-step on-chain flow on Base (chain `8453`):

1. **USDC approve** — approve the Megapot ticket buyer to spend your USDC
   (only when the existing allowance is too low).
2. **`buyTickets(_referrer, _value, _recipient)`** — buy tickets for the
   recipient, passing `address(0)` as the referrer.

Ticket price is **1 USDC each**.

### Contracts (Base mainnet)

| Contract | Address |
| --- | --- |
| USDC (6 decimals) | `0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913` |
| JackpotRandomTicketBuyer | `0xb9560b43b91dE2c1DaF5dfbb76b2CFcDaFc13aBd` |

---

## Getting started

### 1. Install

```bash
npm install
```

### 2. Configure environment

Copy the example env file and add your Privy app ID:

```bash
cp .env.example .env.local
```

| Variable | Required | Description |
| --- | --- | --- |
| `NEXT_PUBLIC_PRIVY_APP_ID` | ✅ | App ID from [dashboard.privy.io](https://dashboard.privy.io) |
| `NEXT_PUBLIC_BASE_RPC_URL` | — | Custom Base RPC (defaults to the public `mainnet.base.org`) |

> Without a valid `NEXT_PUBLIC_PRIVY_APP_ID`, the app renders a friendly setup
> screen instead of crashing.

### 3. Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### 4. Production build

```bash
npm run build
```

The build must pass compile, typecheck, lint, and prerender.

---

## Project structure

```
app/
  layout.tsx        Root layout + fonts + dark/light bootstrap
  page.tsx          Main gift page
  providers.tsx     Client-only Privy → wagmi → react-query stack
components/
  TicketSelector.tsx  Ticket count, presets, +/− stepper, 🎲 surprise
  RecipientInput.tsx  Validated 0x address input
  GiftButton.tsx      Live transaction status button
  SuccessModal.tsx    Confetti + Basescan receipt
hooks/
  useGiftTickets.ts   Balance → allowance → approve → buyTickets flow
lib/
  abi.ts        ERC-20 + ticket buyer ABI fragments
  constants.ts  Addresses, chain, ticket config
  wagmi.ts      wagmi/Privy config
  format.ts     USDC + address formatting helpers
```

---

## Notes

- The Privy/wagmi provider stack renders **client-only** (gated on a `mounted`
  flag) so static generation doesn't try to initialize Privy at build time.
- `next.config.mjs` pushes `pino-pretty`, `lokijs`, and `encoding` to webpack
  externals and stubs `@react-native-async-storage/async-storage` to silence
  optional-dependency warnings from wagmi / wallet SDKs.

## Deployment

The site deploys to **Vercel** (native Git integration) and the extension to the
**Chrome Web Store** (GitHub Actions). See [`DEPLOY.md`](./DEPLOY.md) for the full
setup (environment variables and the publish flow). Set `NEXT_PUBLIC_SITE_URL` to
your deployed URL so social/OG tags resolve correctly.

The marketing landing (`/`) renders without wallet config; only the `/gift` app
requires `NEXT_PUBLIC_PRIVY_APP_ID`.

## Branding

The full brand kit — color palette, logo/marks, taglines, favicon, and social
preview — lives in [`branding/BRANDING.md`](./branding/BRANDING.md). Logo SVGs
are in `public/` and `app/icon.svg`; the Open Graph image is `public/og-image.png`.

## Roadmap

- Gift by X (Twitter) username → resolved wallet
- Browser extension for one-click gifting anywhere

---

Powered by Megapot on Base. Not affiliated with Megapot; use at your own risk.
