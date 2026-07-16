"use client";

import { useEffect } from "react";
import confetti from "canvas-confetti";
import { basescanTx } from "@/lib/constants";
import { shortenAddress } from "@/lib/format";

interface SuccessModalProps {
  open: boolean;
  txHash: string | null;
  ticketCount: number;
  recipient: string;
  onClose: () => void;
}

function fireConfetti() {
  const end = Date.now() + 900;
  const colors = ["#3563ff", "#8b5cf6", "#f59e0b", "#ec4899"];
  (function frame() {
    confetti({
      particleCount: 4,
      angle: 60,
      spread: 55,
      origin: { x: 0 },
      colors,
    });
    confetti({
      particleCount: 4,
      angle: 120,
      spread: 55,
      origin: { x: 1 },
      colors,
    });
    if (Date.now() < end) requestAnimationFrame(frame);
  })();
  confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 }, colors });
}

export function SuccessModal({
  open,
  txHash,
  ticketCount,
  recipient,
  onClose,
}: SuccessModalProps) {
  useEffect(() => {
    if (open) fireConfetti();
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm animate-pop-in rounded-3xl bg-white p-8 text-center shadow-2xl dark:bg-slate-900"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mx-auto mb-4 flex h-20 w-20 animate-float items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-purple-600 text-4xl shadow-lg shadow-brand-500/30">
          🎉
        </div>
        <h2 className="mb-2 text-2xl font-black text-slate-900 dark:text-white">
          Gift sent!
        </h2>
        <p className="mb-6 text-slate-600 dark:text-slate-400">
          <span className="font-bold text-brand-500">
            {ticketCount} {ticketCount === 1 ? "ticket" : "tickets"}
          </span>{" "}
          on the way to{" "}
          <span className="font-mono font-semibold text-slate-800 dark:text-slate-200">
            {shortenAddress(recipient)}
          </span>
          . May the odds be ever in their favor. 🍀
        </p>

        {txHash && (
          <a
            href={basescanTx(txHash)}
            target="_blank"
            rel="noopener noreferrer"
            className="mb-3 flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-100 px-4 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
          >
            View receipt on Basescan ↗
          </a>
        )}

        <button
          type="button"
          onClick={onClose}
          className="w-full rounded-2xl bg-gradient-to-r from-brand-500 to-purple-600 px-4 py-3 font-black text-white transition hover:opacity-90"
        >
          Send another gift
        </button>
      </div>
    </div>
  );
}
