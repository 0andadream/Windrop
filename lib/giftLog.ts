"use client";

// Lightweight local record of gifts sent from this device. A production build
// would index gifts on-chain (or via an API) so recipients see them too; this
// gives the dashboard real "gifts you've sent" data with no backend.

export interface GiftRecord {
  recipient: string;
  handle?: string;
  tickets: number;
  hash: string;
  ts: number;
}

const KEY = "windrop:gifts";

export function recordGift(g: GiftRecord) {
  try {
    const list = getGifts();
    list.unshift(g);
    localStorage.setItem(KEY, JSON.stringify(list.slice(0, 50)));
  } catch {
    /* storage unavailable — non-fatal */
  }
}

export function getGifts(): GiftRecord[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as GiftRecord[]) : [];
  } catch {
    return [];
  }
}
