"use client";

import { useEffect, useRef } from "react";
import QRCode from "qrcode";
import { useCopy } from "@/hooks/useCopy";
import { basescanAddress } from "@/lib/constants";

interface DepositModalProps {
  open: boolean;
  address: string | undefined;
  onClose: () => void;
}

export function DepositModal({ open, address, onClose }: DepositModalProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { copied, copy } = useCopy();

  useEffect(() => {
    if (open && address && canvasRef.current) {
      QRCode.toCanvas(canvasRef.current, address, {
        width: 180,
        margin: 1,
        color: { dark: "#0b1120", light: "#ffffff" },
      }).catch(() => {
        /* rendering the QR is best-effort */
      });
    }
  }, [open, address]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    if (open) document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open || !address) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label="Deposit USDC"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm animate-pop-in rounded-3xl bg-white p-6 shadow-2xl dark:bg-slate-900"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-1 flex items-start justify-between">
          <div>
            <h2 className="text-xl font-black text-slate-900 dark:text-white">
              Deposit USDC
            </h2>
            <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">
              Fund your wallet to start gifting.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="rounded-full p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path
                d="M6 6l12 12M18 6L6 18"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        {/* Network badge */}
        <div className="mb-4 mt-3 flex justify-center">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-50 px-3 py-1 text-xs font-bold text-brand-600 dark:bg-brand-900/40 dark:text-brand-300">
            <span className="h-2 w-2 rounded-full bg-brand-500" />
            Base network · USDC only
          </span>
        </div>

        {/* QR */}
        <div className="mb-4 flex justify-center">
          <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm dark:border-slate-700">
            <canvas ref={canvasRef} className="h-[180px] w-[180px]" />
          </div>
        </div>

        {/* Copyable address */}
        <button
          type="button"
          onClick={() => copy(address)}
          className="group flex w-full items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-left transition hover:border-brand-300 hover:bg-brand-50/50 dark:border-slate-700 dark:bg-slate-800/60 dark:hover:border-brand-700"
        >
          <span className="min-w-0 flex-1">
            <span className="block text-[11px] font-semibold uppercase tracking-wide text-slate-400">
              Your wallet address
            </span>
            <span className="block truncate font-mono text-sm font-medium text-slate-800 dark:text-slate-200">
              {address}
            </span>
          </span>
          <span
            className={`shrink-0 rounded-lg px-2.5 py-1.5 text-xs font-bold transition ${
              copied
                ? "bg-emerald-500 text-white"
                : "bg-white text-brand-600 shadow-sm group-hover:bg-brand-500 group-hover:text-white dark:bg-slate-700 dark:text-brand-300"
            }`}
          >
            {copied ? "Copied ✓" : "Copy"}
          </span>
        </button>

        <p className="mt-4 flex items-start gap-2 rounded-xl bg-amber-50 px-3 py-2.5 text-xs font-medium text-amber-700 dark:bg-amber-950/40 dark:text-amber-300">
          <span aria-hidden>⚠️</span>
          <span>
            Only send <strong>USDC on Base</strong> to this address. Other assets
            or networks may be lost.
          </span>
        </p>

        <a
          href={basescanAddress(address)}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 block text-center text-xs font-semibold text-slate-400 transition hover:text-brand-500"
        >
          View wallet on Basescan ↗
        </a>
      </div>
    </div>
  );
}
