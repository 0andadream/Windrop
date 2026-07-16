"use client";

import type { GiftStatus } from "@/hooks/useGiftTickets";

interface GiftButtonProps {
  status: GiftStatus;
  disabled?: boolean;
  onClick: () => void;
  ticketCount: number;
}

const BUSY_STATES: GiftStatus[] = [
  "checking",
  "approving",
  "confirming-approval",
  "buying",
  "confirming-purchase",
];

const STATUS_LABELS: Partial<Record<GiftStatus, string>> = {
  checking: "Checking balance…",
  approving: "Approve USDC in wallet…",
  "confirming-approval": "Confirming approval…",
  buying: "Confirm purchase in wallet…",
  "confirming-purchase": "Sending your gift…",
};

export function GiftButton({
  status,
  disabled,
  onClick,
  ticketCount,
}: GiftButtonProps) {
  const busy = BUSY_STATES.includes(status);
  const label = busy
    ? STATUS_LABELS[status] ?? "Working…"
    : `🎁 Gift ${ticketCount} ${ticketCount === 1 ? "ticket" : "tickets"}`;

  return (
    <button
      type="button"
      disabled={disabled || busy}
      onClick={onClick}
      className="group relative w-full overflow-hidden rounded-2xl bg-gradient-to-r from-brand-500 via-indigo-500 to-purple-600 bg-animated-gradient animate-gradient-pan px-6 py-4 text-lg font-black text-white shadow-lg shadow-brand-500/30 transition active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
    >
      <span className="flex items-center justify-center gap-2">
        {busy && (
          <svg
            className="h-5 w-5 animate-spin"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-90"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
            />
          </svg>
        )}
        {label}
      </span>
    </button>
  );
}
