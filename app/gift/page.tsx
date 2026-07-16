"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { usePrivy } from "@privy-io/react-auth";
import { useAccount, useReadContract } from "wagmi";
import { isAddress } from "viem";
import { AppNav } from "@/components/AppNav";
import { TicketSelector } from "@/components/TicketSelector";
import { RecipientInput } from "@/components/RecipientInput";
import { GiftButton } from "@/components/GiftButton";
import { SuccessModal } from "@/components/SuccessModal";
import { DepositModal } from "@/components/DepositModal";
import { useGiftTickets } from "@/hooks/useGiftTickets";
import { ERC20_ABI } from "@/lib/abi";
import { USDC_ADDRESS } from "@/lib/constants";
import { formatUsdc } from "@/lib/format";
import { recordGift } from "@/lib/giftLog";

export default function GiftPage() {
  const { ready, authenticated, login } = usePrivy();
  const { address, isConnected } = useAccount();

  const [tickets, setTickets] = useState(5);
  const [recipient, setRecipient] = useState("");
  const [search, setSearch] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [showDeposit, setShowDeposit] = useState(false);
  const recordedRef = useRef(false);

  const { status, error, buyHash, gift, reset } = useGiftTickets();

  // Prefill the recipient from ?to= (the browser extension links here as
  // /gift?to=@username or ?to=0x…). We keep whatever was passed; the input
  // validates it and @usernames are surfaced with a gentle hint.
  const [prefillHandle, setPrefillHandle] = useState<string | null>(null);
  useEffect(() => {
    const to = new URLSearchParams(window.location.search).get("to");
    if (!to) return;
    if (isAddress(to.trim())) {
      setRecipient(to.trim());
    } else {
      setPrefillHandle(to.replace(/^@/, ""));
    }
  }, []);

  const { data: usdcBalance } = useReadContract({
    address: USDC_ADDRESS,
    abi: ERC20_ABI,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
    query: { enabled: Boolean(address) },
  });

  const recipientValid = isAddress(recipient.trim());
  const busy = status !== "idle" && status !== "error" && status !== "success";

  // Search accepts a pasted address (fills recipient) or an @handle / Megapot
  // username (surfaces the hint until on-chain resolution ships).
  const handleSearch = (raw: string) => {
    setSearch(raw);
    const v = raw.trim();
    if (isAddress(v)) {
      setRecipient(v);
      setPrefillHandle(null);
    } else if (v) {
      setPrefillHandle(v.replace(/^@/, ""));
    } else {
      setPrefillHandle(null);
    }
  };

  useEffect(() => {
    if (status !== "success") return;
    setShowSuccess(true);
    if (buyHash && !recordedRef.current) {
      recordedRef.current = true;
      recordGift({
        recipient: recipient.trim(),
        handle: prefillHandle ?? undefined,
        tickets,
        hash: buyHash,
        ts: Date.now(),
      });
    }
  }, [status, buyHash, recipient, prefillHandle, tickets]);

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
    setSearch("");
    setPrefillHandle(null);
    recordedRef.current = false;
    reset();
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-navy-50 dark:from-slate-950 dark:via-slate-950 dark:to-slate-900">
      <AppNav active="gift" onDeposit={() => setShowDeposit(true)} />

      <div className="mx-auto max-w-lg px-4 py-10 sm:py-14">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-black leading-tight tracking-tight text-slate-900 sm:text-5xl dark:text-white">
            Gift the{" "}
            <span className="bg-gradient-to-r from-navy-700 via-navy-800 to-navy-900 bg-clip-text text-transparent">
              thrill
            </span>
          </h1>
          <p className="mx-auto mt-3 max-w-md text-slate-600 dark:text-slate-400">
            Send Megapot lottery tickets to any wallet on Base. One tap, and
            someone&apos;s in the running for the jackpot. 🍀
          </p>
        </div>

        {/* @handle hint from the extension deep-link */}
        {prefillHandle && !recipientValid && (
          <div className="mb-4 rounded-2xl border border-brand-200 bg-brand-50 px-4 py-3 text-sm text-brand-700 dark:border-brand-800 dark:bg-brand-900/30 dark:text-brand-200">
            Gifting <span className="font-bold">@{prefillHandle}</span> — paste
            their Base wallet address below to send.{" "}
            <span className="text-brand-500/80">
              (X-username resolution is coming soon.)
            </span>
          </div>
        )}

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

          {/* Search by X handle / Megapot username */}
          <div>
            <label
              htmlFor="recipient-search"
              className="mb-2 block text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400"
            >
              Find a recipient
            </label>
            <div className="relative">
              <span
                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                aria-hidden
              >
                🔍
              </span>
              <input
                id="recipient-search"
                value={search}
                onChange={(e) => handleSearch(e.target.value)}
                disabled={busy}
                placeholder="@handle, Megapot username, or paste 0x address"
                spellCheck={false}
                autoComplete="off"
                className="w-full rounded-2xl border-2 border-slate-200 bg-white px-4 py-3 pl-10 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-navy-500 disabled:opacity-60 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
              />
            </div>
            <p className="mt-1.5 px-1 text-xs text-slate-400">
              Paste a Base wallet address to gift instantly — handle resolution
              is coming soon.
            </p>
          </div>

          <RecipientInput
            value={recipient}
            onChange={setRecipient}
            disabled={busy}
          />

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
              className="w-full rounded-2xl bg-gradient-to-r from-navy-700 via-navy-800 to-navy-900 bg-animated-gradient animate-gradient-pan px-6 py-4 text-lg font-black text-white shadow-lg shadow-brand-500/30 transition hover:shadow-xl hover:shadow-brand-500/40 active:scale-[0.99]"
            >
              Sign in with X to gift
            </button>
          ) : (
            <GiftButton
              status={status}
              onClick={handleGift}
              disabled={!canGift}
              ticketCount={tickets}
            />
          )}

          {status === "confirming-purchase" && buyHash && (
            <p className="text-center text-xs text-slate-400">
              Purchase submitted — waiting for confirmation…
            </p>
          )}
        </div>

        <footer className="mt-10 text-center text-xs text-slate-400">
          <Link href="/" className="transition hover:text-brand-500">
            ← Back to home
          </Link>
          <span className="mx-2">·</span>
          Powered by Megapot on Base · Non-custodial
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
