"use client";

import { useState } from "react";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Pre-launch waitlist capture. There's no backend yet, so on submit we
 * persist locally and show a success state. Swap `persist()` for a POST to
 * your provider (e.g. an /api/waitlist route or a form service) to go live.
 */
export function WaitlistForm() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const persist = (value: string) => {
    try {
      const key = "windrop:waitlist";
      const existing = JSON.parse(localStorage.getItem(key) || "[]");
      if (!existing.includes(value)) existing.push(value);
      localStorage.setItem(key, JSON.stringify(existing));
    } catch {
      /* storage unavailable — non-fatal */
    }
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const value = email.trim();
    if (!EMAIL_RE.test(value)) {
      setError("Please enter a valid email address.");
      return;
    }
    setError(null);
    persist(value);
    setDone(true);
  };

  if (done) {
    return (
      <div className="mx-auto flex max-w-md items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-left dark:border-emerald-900/50 dark:bg-emerald-950/40">
        <span className="text-2xl" aria-hidden>
          🎉
        </span>
        <div>
          <p className="font-black text-emerald-700 dark:text-emerald-300">
            You&apos;re on the list!
          </p>
          <p className="text-sm text-emerald-600/90 dark:text-emerald-400/90">
            We&apos;ll email you the moment WinDrop goes live.
          </p>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className="mx-auto flex w-full max-w-md flex-col gap-3 sm:flex-row"
      noValidate
    >
      <div className="flex-1">
        <input
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (error) setError(null);
          }}
          placeholder="you@email.com"
          aria-label="Email address"
          className={`w-full rounded-2xl border-2 bg-white px-4 py-3.5 text-slate-900 outline-none transition placeholder:text-slate-400 dark:bg-slate-900 dark:text-white ${
            error
              ? "border-red-400 focus:border-red-500"
              : "border-slate-200 focus:border-brand-500 dark:border-slate-700"
          }`}
        />
        {error && (
          <p className="mt-1.5 px-1 text-left text-sm font-medium text-red-500">
            {error}
          </p>
        )}
      </div>
      <button
        type="submit"
        className="rounded-2xl bg-gradient-to-r from-brand-500 to-purple-600 px-6 py-3.5 font-black text-white shadow-lg shadow-brand-500/30 transition hover:shadow-xl hover:shadow-brand-500/40 active:scale-[0.98]"
      >
        Join Waitlist
      </button>
    </form>
  );
}
