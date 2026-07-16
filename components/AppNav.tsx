"use client";

import Link from "next/link";
import { usePrivy } from "@privy-io/react-auth";
import { useAccount } from "wagmi";
import { AccountMenu } from "@/components/AccountMenu";

function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2.5" aria-label="WinDrop home">
      <svg width="30" height="30" viewBox="0 0 512 512" aria-hidden>
        <defs>
          <linearGradient id="appnav-mark" x1="0" y1="0" x2="512" y2="512">
            <stop offset="0" stopColor="#14264d" />
            <stop offset="0.55" stopColor="#12213f" />
            <stop offset="1" stopColor="#0a1430" />
          </linearGradient>
        </defs>
        <rect width="512" height="512" rx="120" fill="url(#appnav-mark)" />
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

const LINKS = [
  { href: "/gift", label: "Gift", key: "gift" },
  { href: "/dashboard", label: "Dashboard", key: "dashboard" },
];

export function AppNav({
  active,
  onDeposit,
}: {
  active?: "gift" | "dashboard";
  onDeposit?: () => void;
}) {
  const { ready, authenticated, login } = usePrivy();
  const { isConnected } = useAccount();

  return (
    <nav className="sticky top-0 z-40 border-b border-slate-200/70 bg-white/70 backdrop-blur-xl dark:border-slate-800/70 dark:bg-slate-950/70">
      <div className="mx-auto flex max-w-2xl items-center justify-between px-4 py-3">
        <div className="flex items-center gap-6">
          <Logo />
          <div className="hidden items-center gap-1 sm:flex">
            {LINKS.map((l) => (
              <Link
                key={l.key}
                href={l.href}
                className={`rounded-full px-3 py-1.5 text-sm font-bold transition ${
                  active === l.key
                    ? "bg-navy-50 text-navy-800 dark:bg-navy-900/50 dark:text-white"
                    : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                }`}
              >
                {l.label}
              </Link>
            ))}
          </div>
        </div>

        {ready && (
          <div className="flex items-center gap-2">
            {authenticated && isConnected ? (
              <>
                {onDeposit && (
                  <button
                    type="button"
                    onClick={onDeposit}
                    className="hidden items-center gap-1.5 rounded-full border border-slate-200 bg-white/80 px-3.5 py-2 text-sm font-bold text-slate-700 shadow-sm transition hover:border-navy-300 hover:text-navy-700 sm:flex dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-200"
                  >
                    Deposit
                  </button>
                )}
                <AccountMenu />
              </>
            ) : (
              <button
                type="button"
                onClick={login}
                className="rounded-full bg-gradient-to-r from-navy-700 to-navy-900 px-4 py-2 text-sm font-black text-white shadow-md shadow-brand-500/30 transition hover:shadow-lg active:scale-[0.98]"
              >
                Sign in with X
              </button>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
