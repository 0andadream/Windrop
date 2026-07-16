"use client";

import { useState } from "react";
import Link from "next/link";

const LINKS = [
  { href: "#how", label: "How it works" },
  { href: "#features", label: "Features" },
  { href: "#why", label: "Why WinDrop" },
  { href: "#waitlist", label: "Waitlist" },
];

function Mark() {
  return (
    <Link href="/" className="flex items-center gap-2.5" aria-label="WinDrop home">
      <svg width="30" height="30" viewBox="0 0 512 512" aria-hidden>
        <defs>
          <linearGradient id="lnav-mark" x1="0" y1="0" x2="512" y2="512">
            <stop offset="0" stopColor="#14264d" />
            <stop offset="0.55" stopColor="#12213f" />
            <stop offset="1" stopColor="#0a1430" />
          </linearGradient>
        </defs>
        <rect width="512" height="512" rx="120" fill="url(#lnav-mark)" />
        <path
          d="M256 96C316 190 372 262 372 328a116 116 0 1 1-232 0C140 262 196 190 256 96Z"
          fill="#fff"
        />
        <path
          d="M256 250c8 34 18 44 52 52-34 8-44 18-52 52-8-34-18-44-52-52 34-8 44-18 52-52Z"
          fill="#e3c15a"
        />
      </svg>
      <span className="text-xl font-black tracking-tight text-slate-900 dark:text-white">
        Win<span className="text-gold-600">Drop</span>
      </span>
    </Link>
  );
}

export function LandingNav() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 border-b border-slate-200/60 bg-white/70 backdrop-blur-xl dark:border-slate-800/60 dark:bg-slate-950/70">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3.5">
        <Mark />

        <div className="hidden items-center gap-8 md:flex">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-sm font-semibold text-slate-600 transition hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
            >
              {l.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/gift"
            className="hidden rounded-full bg-gradient-to-r from-navy-700 via-navy-800 to-navy-900 bg-animated-gradient animate-gradient-pan px-5 py-2.5 text-sm font-black text-white shadow-md shadow-brand-500/30 transition hover:shadow-lg hover:shadow-brand-500/40 active:scale-[0.98] sm:block"
          >
            Gift Now
          </Link>
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-label="Toggle menu"
            aria-expanded={open}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-slate-700 md:hidden dark:border-slate-700 dark:text-slate-200"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
              {open ? (
                <path
                  d="M6 6l12 12M18 6L6 18"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                />
              ) : (
                <path
                  d="M4 7h16M4 12h16M4 17h16"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="border-t border-slate-200/60 bg-white/95 px-5 py-4 md:hidden dark:border-slate-800/60 dark:bg-slate-950/95">
          <div className="flex flex-col gap-1">
            {LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
              >
                {l.label}
              </a>
            ))}
            <Link
              href="/gift"
              onClick={() => setOpen(false)}
              className="mt-2 rounded-xl bg-gradient-to-r from-navy-700 to-navy-900 px-3 py-3 text-center text-sm font-black text-white"
            >
              Gift Now
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
