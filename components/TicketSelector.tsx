"use client";

import { useCallback } from "react";
import {
  MAX_TICKETS,
  MIN_TICKETS,
  TICKET_PRESETS,
  TICKET_PRICE_USDC,
} from "@/lib/constants";

interface TicketSelectorProps {
  value: number;
  onChange: (value: number) => void;
  disabled?: boolean;
}

export function TicketSelector({
  value,
  onChange,
  disabled,
}: TicketSelectorProps) {
  const clamp = useCallback(
    (n: number) => Math.min(MAX_TICKETS, Math.max(MIN_TICKETS, n)),
    [],
  );

  const set = useCallback(
    (n: number) => onChange(clamp(n)),
    [clamp, onChange],
  );

  const surprise = useCallback(() => {
    // A playful 1–25 random pick.
    set(Math.floor(Math.random() * 25) + 1);
  }, [set]);

  const total = value * TICKET_PRICE_USDC;

  return (
    <div className="rounded-3xl bg-gradient-to-br from-gold-400 via-gold-500 to-gold-600 bg-animated-gradient animate-gradient-pan p-[2px] shadow-lg shadow-gold-500/25">
      <div className="rounded-[calc(1.5rem-2px)] bg-white p-6 dark:bg-slate-900">
        <div className="mb-4 flex items-center justify-between">
          <span className="text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
            Tickets
          </span>
          <span className="rounded-full bg-brand-50 px-3 py-1 text-sm font-bold text-brand-600 dark:bg-brand-900/40 dark:text-brand-300">
            {TICKET_PRICE_USDC} USDC each
          </span>
        </div>

        {/* Big gradient count + stepper */}
        <div className="mb-6 flex items-center justify-between gap-4">
          <button
            type="button"
            aria-label="Decrease tickets"
            disabled={disabled || value <= MIN_TICKETS}
            onClick={() => set(value - 1)}
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-slate-100 text-2xl font-black text-slate-700 transition hover:bg-slate-200 disabled:opacity-40 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
          >
            −
          </button>

          <div className="flex flex-col items-center">
            <span className="bg-gradient-to-br from-gold-500 to-gold-600 bg-clip-text text-7xl font-black leading-none text-transparent tabular-nums">
              {value}
            </span>
            <span className="mt-1 text-xs font-medium uppercase tracking-widest text-slate-400">
              {value === 1 ? "ticket" : "tickets"}
            </span>
          </div>

          <button
            type="button"
            aria-label="Increase tickets"
            disabled={disabled || value >= MAX_TICKETS}
            onClick={() => set(value + 1)}
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-brand-500 text-2xl font-black text-white transition hover:bg-brand-600 disabled:opacity-40"
          >
            +
          </button>
        </div>

        {/* Presets + surprise */}
        <div className="grid grid-cols-5 gap-2">
          {TICKET_PRESETS.map((preset) => {
            const active = value === preset;
            return (
              <button
                key={preset}
                type="button"
                disabled={disabled}
                onClick={() => set(preset)}
                className={`rounded-xl py-2.5 text-sm font-bold transition disabled:opacity-40 ${
                  active
                    ? "bg-brand-500 text-white shadow-md shadow-brand-500/30"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                }`}
              >
                {preset}
              </button>
            );
          })}
          <button
            type="button"
            disabled={disabled}
            onClick={surprise}
            aria-label="Surprise me with a random ticket count"
            className="rounded-xl bg-gradient-to-br from-gold-300 to-gold-500 py-2.5 text-lg font-bold text-navy-900 shadow-md transition hover:opacity-90 disabled:opacity-40"
            title="Surprise me!"
          >
            🎲
          </button>
        </div>

        <div className="mt-6 flex items-baseline justify-between border-t border-slate-100 pt-4 dark:border-slate-800">
          <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
            Total
          </span>
          <span className="text-2xl font-black text-slate-900 dark:text-white">
            {total} <span className="text-base font-bold text-brand-500">USDC</span>
          </span>
        </div>
      </div>
    </div>
  );
}
