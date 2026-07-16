"use client";

import { useEffect, useMemo, useState } from "react";
import { usePrivy } from "@privy-io/react-auth";
import { useAccount, useReadContract } from "wagmi";
import { isAddress } from "viem";
import { TicketSelector } from "@/components/TicketSelector";
import { RecipientInput } from "@/components/RecipientInput";
import { GiftButton } from "@/components/GiftButton";
import { SuccessModal } from "@/components/SuccessModal";
import { useGiftTickets } from "@/hooks/useGiftTickets";
import { ERC20_ABI } from "@/lib/abi";
import { USDC_ADDRESS } from "@/lib/constants";
import { formatUsdc, shortenAddress } from "@/lib/format";

function Header() {
  const { ready, authenticated, login, logout, user } = usePrivy();
  const { address } = useAccount();

  return (
    <header className="mb-8 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <span className="text-3xl">🎁</span>
        <span className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
          Win<span className="text-brand-500">Drop</span>
        </span>
      </div>

      {ready && (
        <div>
          {authenticated ? (
            <button
              type="button"
              onClick={logout}
              className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              {address
                ? shortenAddress(address)
                : user?.email?.address ?? "Sign out"}
            </button>
          ) : (
            <button
              type="button"
              onClick={login}
              className="rounded-full bg-gradient-to-r from-brand-500 to-purple-600 px-5 py-2 text-sm font-black text-white shadow-md shadow-brand-500/30 transition hover:opacity-90"
            >
              Connect
            </button>
          )}
        </div>
      )}
    </header>
  );
}

export default function Home() {
  const { ready, authenticated, login } = usePrivy();
  const { address, isConnected } = useAccount();

  const [tickets, setTickets] = useState(5);
  const [recipient, setRecipient] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);

  const {
    status,
    error,
    buyHash,
    gift,
    reset,
  } = useGiftTickets();

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
      <div className="mx-auto max-w-lg px-4 py-8 sm:py-12">
        <Header />

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

        {/* Balance chip */}
        {isConnected && usdcBalance !== undefined && (
          <div className="mb-4 flex justify-center">
            <span className="rounded-full bg-white/70 px-4 py-1.5 text-sm font-semibold text-slate-600 shadow-sm backdrop-blur dark:bg-slate-900/70 dark:text-slate-300">
              Balance: {formatUsdc(usdcBalance as bigint)} USDC
            </span>
          </div>
        )}

        <div className="space-y-5">
          <TicketSelector
            value={tickets}
            onChange={setTickets}
            disabled={busy}
          />

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
              className="w-full rounded-2xl bg-gradient-to-r from-brand-500 to-purple-600 px-6 py-4 text-lg font-black text-white shadow-lg shadow-brand-500/30 transition hover:opacity-90"
            >
              Connect to start gifting
            </button>
          ) : (
            <GiftButton
              status={status}
              onClick={handleGift}
              disabled={!canGift}
              ticketCount={tickets}
            />
          )}

          {/* In-flight approval receipt link */}
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
