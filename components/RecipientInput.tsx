"use client";

import { isAddress } from "viem";

interface RecipientInputProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export function RecipientInput({
  value,
  onChange,
  disabled,
}: RecipientInputProps) {
  const trimmed = value.trim();
  const isValid = isAddress(trimmed);
  const showError = trimmed.length > 0 && !isValid;

  return (
    <div>
      <label
        htmlFor="recipient"
        className="mb-2 block text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400"
      >
        Recipient wallet
      </label>
      <div className="relative">
        <input
          id="recipient"
          type="text"
          inputMode="text"
          autoComplete="off"
          spellCheck={false}
          disabled={disabled}
          placeholder="0x… address to gift to"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`w-full rounded-2xl border-2 bg-white px-4 py-3.5 pr-11 font-mono text-sm text-slate-900 outline-none transition placeholder:font-sans placeholder:text-slate-400 disabled:opacity-60 dark:bg-slate-900 dark:text-slate-100 ${
            showError
              ? "border-red-400 focus:border-red-500"
              : isValid
                ? "border-emerald-400 focus:border-emerald-500"
                : "border-slate-200 focus:border-brand-500 dark:border-slate-700"
          }`}
        />
        {isValid && (
          <span
            className="absolute right-3 top-1/2 -translate-y-1/2 text-emerald-500"
            aria-hidden
          >
            ✓
          </span>
        )}
      </div>
      {showError && (
        <p className="mt-2 text-sm font-medium text-red-500">
          Enter a valid 0x wallet address.
        </p>
      )}
    </div>
  );
}
