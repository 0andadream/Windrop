"use client";

import { useEffect, useMemo, useState } from "react";
import { usePrivy } from "@privy-io/react-auth";
import { useAccount, useReadContract } from "wagmi";
import { isAddress } from "viem";
import { TicketSelector } from "@/components/TicketSelector";
import { RecipientInput } from "@/components/RecipientInput";
import { GiftButton } from "@/components/GiftButton";
import { SuccessModal } from "@/components/SuccessModal";
import { DepositModal } from "@/components/DepositModal";
import { AccountMenu } from "@/components/AccountMenu";
import { useGiftTickets } from "@/hooks/useGiftTickets";
import { ERC20_ABI } from "@/lib/abi";
import { USDC_ADDRESS } from "@/lib/constants";
import { formatUsdc } from "@/lib/format";

function Logo() {
  return (
    <div className="flex items-center gap-2.5">
      <svg width="30" height="30" viewBox="0 0 512 512" aria-hidden>
        <defs>
          <linearGradient id="nav-mark" x1="0" y1="0" x2="512" y2="512">
            <stop offset="0" stopColor="#3563ff" />
            <stop offset="0.55" stopColor="#6d5cf6" />
            <stop offset="1" stopColor="#22c55e" />
          </linearGradient>
        </defs>
        <rect width="512" height="512" rx="120" fill="url(#nav-mark)" />
        <path
          d="M256 96C316 190 372 262 372 328a116 116 0 1 1-232 0C140 262 196 190 256 96Z"
          fill="#fff"
        />
        <path
          d="M256 250c8 34 18 44 52 52-34 8-44 18-52 52-8-34-18-44-52-52 34-8 44-18 52-52Z"
          fill="#facc15"
        />
      </svg>
      <span className="text-xl font-black tracking-tight text-slate-900 dark:text-white">
        Win<span className="text-brand-500">Drop</span>
      </span>
    </div>
  );
}

function TopNav({ onDeposit }: { onDeposit: () => void }) {
  const { ready, authenticated, login } = usePrivy();
  const { isConnected } = useAccount();

  return (
    <nav className="sticky top-0 z-40 border-b border-slate-200/70 bg-white/70 backdrop-blur-xl dark:border-slate-800/70 dark:bg-slate-950/70">
      <div className="mx-auto flex max-w-lg items-center justify-between px-4 py-3">
        <Logo />

        {ready && (
          <div className="flex items-center gap-2">
            {authenticated && isConnected ? (
              <>
                <button
                  type="button"
                  onClick={onDeposit}
                  className="flex items-center gap-1.5 rounded-full border border-slate-200 bg-white/80 px-3.5 py-2 text-sm font-bold text-slate-700 shadow-sm backdrop-blur transition hover:border-brand-300 hover:text-brand-600 dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-200 dark:hover:border-brand-700"
                >
                  <svg
                    width="15"
                    height="15"
                    viewBox="0 0 24 24"
                    fill="none"
                    aria-hidden
                  >
                    <path
                      d="M12 5v14M5 12l7 7 7-7"
                      stroke="currentColor"
                      strokeWidth="2.4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  Deposit
                </button>
                <AccountMenu />
              </>
            ) : (
              <button
                type="button"
                onClick={login}
                className="flex items-center gap-1.5 rounded-full bg-gradient-to-r from-brand-500 via-indigo-500 to-purple-600 bg-animated-gradient animate-gradient-pan px-4 py-2 text-sm font-black text-white shadow-md shadow-brand-500/30 transition hover:shadow-lg hover:shadow-brand-500/40 active:scale-[0.98]"
              >
                Launch App
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden
                >
                  <path
                    d="M5 12h14M13 6l6 6-6 6"
                    stroke="currentColor"
                    strokeWidth="2.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}

export default function Home() {
  const { ready, authenticated, login } = usePrivy();
  const { address, isConnected } = useAccount();

  const [tickets, setTickets] = useState(5);
  const [recipient, setRecipient] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [showDeposit, setShowDeposit] = useState(false);

  const { status, error, buyHash, gift, reset } = useGiftTickets();

  const { data: usdcBalance } = useReadContract({
    address: USDC_ADDRESS,
    abi: ERC20_ABI,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
    query: { enabled: Boolean(address) },
  });

  const recipientValid = isAddress(recipient.trim());
  const busy = status !== "idle" && status !== "error" && status !== "success";

  // Surface the success modal once the flow completes.
  useEffect(() => {
    if (status === "success") setShowSuccess(true);
  }, [status]);

  const canGift = useMemo(
    () => ready && authenticated && isConnected && recipientValid && !busy,
    [ready, authenticated, isConnected, recipientValid, busy],
  );

  const handleGift = () => {
    if (!authenticated) {
      login();
      return;
    }
    gift(recipient.trim(), tickets);
  };

  const handleCloseSuccess = () => {
    setShowSuccess(false);
    setRecipient("");
    reset();
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-brand-50 dark:from-slate-950 dark:via-slate-950 dark:to-slate-900">
      <TopNav onDeposit={() => setShowDeposit(true)} />

      <div className="mx-auto max-w-lg px-4 py-10 sm:py-14">
        {/* Hero */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-black leading-tight tracking-tight text-slate-900 sm:text-5xl dark:text-white">
            Gift the{" "}
            <span className="bg-gradient-to-r from-brand-500 via-indigo-500 to-purple-600 bg-clip-text text-transparent">
              thrill
            </span>
          </h1>
          <p className="mx-auto mt-3 max-w-md text-slate-600 dark:text-slate-400">
            Send Megapot lottery tickets to any wallet on Base. One tap, and
            someone&apos;s in the running for the jackpot. 🍀
          </p>
        </div>

        {/* Balance + deposit */}
        {isConnected && usdcBalance !== undefined && (
          <div className="mb-5 flex items-center justify-center gap-2">
            <span className="rounded-full bg-white/70 px-4 py-1.5 text-sm font-semibold text-slate-600 shadow-sm backdrop-blur dark:bg-slate-900/70 dark:text-slate-300">
              Balance:{" "}
              <span className="font-bold text-slate-900 dark:text-white">
                {formatUsdc(usdcBalance as bigint)} USDC
              </span>
            </span>
            <button
              type="button"
              onClick={() => setShowDeposit(true)}
              className="rounded-full bg-brand-50 px-3 py-1.5 text-sm font-bold text-brand-600 transition hover:bg-brand-100 dark:bg-brand-900/40 dark:text-brand-300 dark:hover:bg-brand-900/60"
            >
              + Deposit
            </button>
          </div>
        )}

        <div className="space-y-5">
          <TicketSelector value={tickets} onChange={setTickets} disabled={busy} />

          <RecipientInput
            value={recipient}
            onChange={setRecipient}
            disabled={busy}
          />

          {/* Error banner */}
          {status === "error" && error && (
            <div className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-300">
              <span aria-hidden>⚠️</span>
              <span className="font-medium">{error}</span>
            </div>
          )}

          {!authenticated && ready ? (
            <button
              type="button"
              onClick={login}
              className="w-full rounded-2xl bg-gradient-to-r from-brand-500 via-indigo-500 to-purple-600 bg-animated-gradient animate-gradient-pan px-6 py-4 text-lg font-black text-white shadow-lg shadow-brand-500/30 transition hover:shadow-xl hover:shadow-brand-500/40 active:scale-[0.99]"
            >
              Launch App to start gifting
            </button>
          ) : (
            <GiftButton
              status={status}
              onClick={handleGift}
              disabled={!canGift}
              ticketCount={tickets}
            />
          )}

          {/* In-flight status */}
          {status === "confirming-purchase" && buyHash && (
            <p className="text-center text-xs text-slate-400">
              Purchase submitted — waiting for confirmation…
            </p>
          )}
        </div>

        <footer className="mt-10 text-center text-xs text-slate-400">
          Powered by Megapot on Base · Referrer-free · Non-custodial
        </footer>
      </div>

      <DepositModal
        open={showDeposit}
        address={address}
        onClose={() => setShowDeposit(false)}
      />

      <SuccessModal
        open={showSuccess}
        txHash={buyHash}
        ticketCount={tickets}
        recipient={recipient.trim()}
        onClose={handleCloseSuccess}
      />
    </main>
  );
}
