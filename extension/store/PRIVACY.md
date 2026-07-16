# WinDrop Extension — Privacy Policy

_Last updated: 2026_

WinDrop is a browser extension that adds a **🎟️ WinDrop** button to X (Twitter)
profiles and a popup for gifting Megapot lottery tickets. This policy explains
exactly what it does and does not do with your data.

## The short version

**WinDrop collects nothing.** No personal data, no browsing history, no
analytics, no tracking, no accounts. The extension never transmits data to us or
to any third party — it only builds a link and opens it in a new tab.

## What the extension accesses, and why

- **The active tab's URL (`activeTab`)** — read *locally, only when you open the
  popup*, solely to detect the X handle of the profile you're viewing so it can
  pre-fill the recipient. This value never leaves your browser.
- **X.com / Twitter.com pages (`host_permissions`)** — the content script runs
  only on these sites to place the WinDrop button next to the Follow button. It
  reads the public @handle shown on the page to build the gift link. It does not
  read your timeline, messages, followers, or account data.

## What it does with that information

The extension constructs a URL of the form
`https://<your-windrop-site>/gift?to=@username` and opens it in a new tab when
you click. That's the extent of the data flow. All wallet connection and
transaction signing happens on the WinDrop website, not in the extension.

## What it never does

- No background scripts, no remote code execution.
- No cookies, no local storage of personal data, no fingerprinting.
- No selling or sharing of data (there is none to sell or share).

## Permissions summary

| Permission | Purpose |
| --- | --- |
| `activeTab` | Read the current tab URL in the popup to pre-fill the handle |
| `host_permissions: x.com, twitter.com` | Inject the WinDrop button on profiles |

## Contact

Questions about this policy? Open an issue on the project repository.
