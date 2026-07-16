"use client";

import { useEffect, useState } from "react";
import { useWithdraw } from "@/hooks/useWithdraw";
import { formatUsdc } from "@/lib/format";

interface WithdrawModalProps {
  open: boolean;
  balance: bigint | undefined;
  onClose: () => void;
  onSuccess: (hash: string) => void;
}

const BUSY: string[] = ["sending", "confirming"];
const BUSY_LABEL: Record<string, string> = {
  sending: "Confirm in your wallet…",
  confirming: "Sending USDC…",
};

export function WithdrawModal({
  open,
  balance,
  onClose,
  onSuccess,
}: WithdrawModalProps) {
  const [to, setTo] = useState("");
  const [amount, setAmount] = useState("");
  const { status, error, hash, withdraw, reset } = useWithdraw();

  const busy = BUSY.includes(status);
  const balanceLabel = balance !== undefined ? formatUsdc(balance) : "0";

  useEffect(() => {
    if (status === "success" && hash) {
      onSuccess(hash);
      setTo("");
      setAmount("");
      reset();
    }
  }, [status, hash, onSuccess, reset]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape" && !busy) onClose();
    }
    if (open) document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, busy, onClose]);

  if (!open) return null;

  const setMax = () => {
    if (balance !== undefined) setAmount(formatUsdc(balance, 6));
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label="Withdraw USDC"
      onClick={() => !busy && onClose()}
    >
      <div
        className="w-full max-w-sm animate-pop-in rounded-3xl bg-white p-6 shadow-2xl dark:bg-slate-900"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-start justify-between">
          <div>
            <h2 className="text-xl font-black text-slate-900 dark:text-white">
              Withdraw USDC
            </h2>
            <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">
              Available: {balanceLabel} USDC
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={busy}
            aria-label="Close"
            className="rounded-full p-1.5 text-slate-400 transition hover:bg-slate-100 disabled:opacity-40 dark:hover:bg-slate-800"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wide text-slate-400">
          Destination address
        </label>
        <input
          value={to}
          onChange={(e) => setTo(e.target.value)}
          placeholder="0x… wallet on Base"
          spellCheck={false}
          disabled={busy}
          className="mb-4 w-full rounded-2xl border-2 border-slate-200 bg-white px-4 py-3 font-mono text-sm text-slate-900 outline-none transition focus:border-navy-500 disabled:opacity-60 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
        />

        <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wide text-slate-400">
          Amount
        </label>
        <div className="mb-4 flex items-center gap-2 rounded-2xl border-2 border-slate-200 bg-white px-4 py-3 focus-within:border-navy-500 dark:border-slate-700 dark:bg-slate-900">
          <input
            value={amount}
            onChange={(e) => setAmount(e.target.value.replace(/[^0-9.]/g, ""))}
            placeholder="0.00"
            inputMode="decimal"
            disabled={busy}
            className="min-w-0 flex-1 bg-transparent text-lg font-bold text-slate-900 outline-none disabled:opacity-60 dark:text-white"
          />
          <span className="text-sm font-bold text-slate-400">USDC</span>
          <button
            type="button"
            onClick={setMax}
            disabled={busy}
            className="rounded-lg bg-navy-50 px-2.5 py-1 text-xs font-black text-navy-700 transition hover:bg-navy-100 disabled:opacity-40 dark:bg-navy-900/50 dark:text-navy-200"
          >
            MAX
          </button>
        </div>

        {status === "error" && error && (
          <div className="mb-4 flex items-start gap-2 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-300">
            <span aria-hidden>⚠️</span>
            <span>{error}</span>
          </div>
        )}

        <button
          type="button"
          onClick={() => withdraw(to, amount)}
          disabled={busy || !to || !amount}
          className="w-full rounded-2xl bg-gradient-to-r from-navy-700 via-navy-800 to-navy-900 px-6 py-3.5 text-base font-black text-white shadow-lg shadow-brand-500/30 transition hover:shadow-xl active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {busy ? BUSY_LABEL[status] : "Withdraw USDC"}
        </button>

        {/* Fiat off-ramp entry point. A production build wires this to a
            Coinbase/Privy off-ramp; here it opens Coinbase and is clearly
            marked as needing provider setup. */}
        <a
          href="https://www.coinbase.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 flex items-center justify-center gap-2 rounded-2xl border border-slate-200 px-4 py-3 text-sm font-bold text-slate-600 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
        >
          🏦 Cash out to bank (via Coinbase)
        </a>
        <p className="mt-2 text-center text-[11px] text-slate-400">
          Bank cash-out uses an external off-ramp — configure a Coinbase/Privy
          provider to enable in-app.
        </p>
      </div>
    </div>
  );
}
