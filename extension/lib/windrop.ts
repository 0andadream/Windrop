// Shared config + helpers for the WinDrop extension.

export const WINDROP_BASE_URL = "https://windrop.xyz";

// Brand palette (mirrors branding/BRANDING.md).
export const COLORS = {
  blue: "#3563ff",
  iris: "#6d5cf6",
  green: "#22c55e",
  yellow: "#facc15",
  pink: "#ec4899",
  ink: "#0b1120",
  cloud: "#ffffff",
};

export const GRADIENT = `linear-gradient(135deg, ${COLORS.blue} 0%, ${COLORS.iris} 55%, ${COLORS.green} 100%)`;

export const TICKET_PRESETS = [1, 5, 10, 25];
export const TICKET_PRICE_USDC = 1;

// X routes that are not user profiles.
const RESERVED_HANDLES = new Set([
  "home",
  "explore",
  "notifications",
  "messages",
  "i",
  "settings",
  "compose",
  "search",
  "hashtag",
  "bookmarks",
  "lists",
  "communities",
  "tos",
  "privacy",
  "about",
  "login",
  "signin",
  "signup",
  "logout",
  "session",
  "jobs",
  "intent",
  "share",
  "widgets",
  "account",
  "topics",
  "moment",
  "moments",
  "live",
  "tv",
  "verified_followers",
  "follower_requests",
  "connect_people",
  "notifications_timeline",
]);

const HANDLE_RE = /^[A-Za-z0-9_]{1,15}$/;

export function isValidHandle(handle: string | null | undefined): handle is string {
  if (!handle) return false;
  return HANDLE_RE.test(handle) && !RESERVED_HANDLES.has(handle.toLowerCase());
}

/** Pull the profile handle from an x.com / twitter.com URL, or null. */
export function handleFromUrl(rawUrl: string): string | null {
  try {
    const url = new URL(rawUrl);
    if (!/(^|\.)(x|twitter)\.com$/.test(url.hostname)) return null;
    const segment = url.pathname.split("/").filter(Boolean)[0];
    return isValidHandle(segment) ? segment : null;
  } catch {
    return null;
  }
}

/** Build the WinDrop gift deep-link for a handle. */
export function giftUrl(handle: string, tickets?: number): string {
  const params = new URLSearchParams({ to: `@${handle}` });
  if (tickets && tickets > 0) params.set("tickets", String(tickets));
  return `${WINDROP_BASE_URL}/gift?${params.toString()}`;
}
