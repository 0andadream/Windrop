import type { PlasmoCSConfig } from "plasmo"

import { GRADIENT, giftUrl, handleFromUrl, isValidHandle } from "~lib/windrop"

export const config: PlasmoCSConfig = {
  matches: ["https://x.com/*", "https://twitter.com/*"],
  run_at: "document_idle",
  all_frames: false
}

const BTN_ID = "windrop-gift-btn"
const STYLE_ID = "windrop-style"

/** Read the handle of the profile currently shown in the header. */
function currentHandle(): string | null {
  // Prefer the handle rendered in the profile header (accurate to the view).
  const userName = document.querySelector('[data-testid="UserName"]')
  const match = userName?.textContent?.match(/@([A-Za-z0-9_]{1,15})/)
  if (match && isValidHandle(match[1])) return match[1]

  // Fall back to the first URL path segment.
  return handleFromUrl(location.href)
}

function ensureStyles() {
  if (document.getElementById(STYLE_ID)) return
  const style = document.createElement("style")
  style.id = STYLE_ID
  style.textContent = `
    #${BTN_ID} {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      height: 36px;
      padding: 0 16px;
      margin-right: 8px;
      border: 0;
      border-radius: 9999px;
      background: ${GRADIENT};
      background-size: 160% 160%;
      color: #fff;
      font-family: inherit;
      font-size: 14px;
      font-weight: 700;
      line-height: 1;
      cursor: pointer;
      white-space: nowrap;
      box-shadow: 0 2px 10px rgba(53, 99, 255, 0.35);
      transition: transform .12s ease, filter .12s ease, background-position .3s ease;
    }
    #${BTN_ID}:hover { filter: brightness(1.07); transform: translateY(-1px); background-position: 100% 50%; }
    #${BTN_ID}:active { transform: translateY(0); }
    #${BTN_ID}:focus-visible { outline: 2px solid #fff; outline-offset: 2px; }
  `
  document.head.appendChild(style)
}

function buildButton(handle: string): HTMLButtonElement {
  const btn = document.createElement("button")
  btn.id = BTN_ID
  btn.type = "button"
  btn.setAttribute("aria-label", `Gift Megapot tickets to @${handle} on WinDrop`)
  btn.title = `Gift @${handle} some lottery luck`
  btn.innerHTML = `<span aria-hidden="true">🎟️</span><span>WinDrop</span>`
  btn.dataset.handle = handle
  btn.addEventListener("click", (e) => {
    e.preventDefault()
    e.stopPropagation()
    window.open(giftUrl(btn.dataset.handle || handle), "_blank", "noopener")
  })
  return btn
}

/** Inject (or refresh) the WinDrop button in the profile action bar. */
function inject() {
  // The "More" (userActions) button sits in the profile header action row,
  // right next to Follow / Following. That row is our anchor.
  const more = document.querySelector('[data-testid="userActions"]')
  const bar = more?.parentElement as HTMLElement | null
  if (!bar) return

  const followBtn = bar.querySelector(
    '[data-testid$="-follow"], [data-testid$="-unfollow"]'
  )
  // No follow button means this is our own profile — nothing to gift.
  if (!followBtn) return

  const handle = currentHandle()
  if (!isValidHandle(handle)) return

  const existing = bar.querySelector<HTMLButtonElement>(`#${BTN_ID}`)
  if (existing) {
    // Keep the handle fresh across SPA navigations.
    if (existing.dataset.handle !== handle) existing.dataset.handle = handle
    return
  }

  ensureStyles()
  const btn = buildButton(handle)
  // Place it immediately before Follow so the two sit side by side.
  bar.insertBefore(btn, followBtn)
}

// X is a SPA: the header re-renders on navigation. Watch the DOM and
// re-inject, debounced so we stay cheap.
let scheduled = false
function schedule() {
  if (scheduled) return
  scheduled = true
  requestAnimationFrame(() => {
    scheduled = false
    try {
      inject()
    } catch {
      // Non-fatal: X DOM changed shape; try again on the next mutation.
    }
  })
}

const observer = new MutationObserver(schedule)
observer.observe(document.body, { childList: true, subtree: true })
schedule()
