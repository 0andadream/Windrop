"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePrivy } from "@privy-io/react-auth";
import { useAccount, useReadContract } from "wagmi";
import { AppNav } from "@/components/AppNav";
import { DepositModal } from "@/components/DepositModal";
import { WithdrawModal } from "@/components/WithdrawModal";
import { TxSuccessModal } from "@/components/TxSuccessModal";
import { useClaim } from "@/hooks/useClaim";
import { ERC20_ABI, JACKPOT_ABI } from "@/lib/abi";
import {
  JACKPOT_ADDRESS,
  USDC_ADDRESS,
  basescanTx,
  hasJackpotContract,
} from "@/lib/constants";
import { formatUsdc, shortenAddress } from "@/lib/format";
import { getGifts, type GiftRecord } from "@/lib/giftLog";

function StatCard({
  label,
  value,
  accent,
  children,
}: {
  label: string;
  value: React.ReactNode;
  accent?: boolean;
  children?: React.ReactNode;
}) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <p className="text-xs font-bold uppercase tracking-widest text-slate-400">
        {label}
      </p>
      <p
        className={`mt-2 text-4xl font-black ${
          accent
            ? "bg-gradient-to-br from-gold-500 to-gold-600 bg-clip-text text-transparent"
            : "text-slate-900 dark:text-white"
        }`}
      >
        {value}
      </p>
      {children}
    </div>
  );
}

export default function DashboardPage() {
  const { ready, authenticated, login, user } = usePrivy();
  const { address, isConnected } = useAccount();

  const [showDeposit, setShowDeposit] = useState(false);
  const [showWithdraw, setShowWithdraw] = useState(false);
  const [withdrawHash, setWithdrawHash] = useState<string | null>(null);
  const [gifts, setGifts] = useState<GiftRecord[]>([]);

  const { status: claimStatus, error: claimError, hash: claimHash, claim, reset: resetClaim } =
    useClaim();
  const [showClaimSuccess, setShowClaimSuccess] = useState(false);

  useEffect(() => setGifts(getGifts()), []);
  useEffect(() => {
    if (claimStatus === "success") setShowClaimSuccess(true);
  }, [claimStatus]);

  const { data: usdcBalance } = useReadContract({
    address: USDC_ADDRESS,
    abi: ERC20_ABI,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
    query: { enabled: Boolean(address) },
  });

  const { data: userInfo } = useReadContract({
    address: (JACKPOT_ADDRESS || undefined) as `0x${string}` | undefined,
    abi: JACKPOT_ABI,
    functionName: "usersInfo",
    args: address ? [address] : undefined,
    query: { enabled: Boolean(address) && hasJackpotContract },
  });

  const winnings =
    userInfo && Array.isArray(userInfo) ? (userInfo[1] as bigint) : 0n;
  const hasWinnings = winnings > 0n;
  const claimBusy =
    claimStatus === "claiming" || claimStatus === "confirming";

  const ticketsGifted = gifts.reduce((s, g) => s + g.tickets, 0);
  const xHandle = user?.twitter?.username;

  // Not signed in ------------------------------------------------------------
  if (ready && !authenticated) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-navy-50 dark:from-slate-950 dark:via-slate-950 dark:to-slate-900">
        <AppNav active="dashboard" />
        <div className="mx-auto flex max-w-md flex-col items-center px-4 py-24 text-center">
          <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br from-navy-700 to-navy-900 text-3xl">
            📊
          </div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white">
            Your dashboard
          </h1>
          <p className="mt-3 text-slate-600 dark:text-slate-400">
            Sign in with X to see your tickets, gifts, winnings, and to withdraw.
          </p>
          <button
            type="button"
            onClick={login}
            className="mt-6 rounded-full bg-gradient-to-r from-navy-700 to-navy-900 px-7 py-3.5 font-black text-white shadow-lg shadow-brand-500/30 transition hover:shadow-xl active:scale-[0.98]"
          >
            Sign in with X
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-navy-50 dark:from-slate-950 dark:via-slate-950 dark:to-slate-900">
      <AppNav active="dashboard" onDeposit={() => setShowDeposit(true)} />

      <div className="mx-auto max-w-2xl px-4 py-10">
        {/* Greeting */}
        <div className="mb-8">
          <p className="text-sm font-bold uppercase tracking-widest text-gold-600">
            Dashboard
          </p>
          <h1 className="mt-1 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl dark:text-white">
            {xHandle ? (
              <>
                gm, <span className="text-navy-700 dark:text-navy-200">@{xHandle}</span>
              </>
            ) : address ? (
              <>
                gm,{" "}
                <span className="font-mono text-navy-700 dark:text-navy-200">
                  {shortenAddress(address)}
                </span>
              </>
            ) : (
              "Your dashboard"
            )}
          </h1>
        </div>

        {/* Stat grid */}
        <div className="grid gap-4 sm:grid-cols-2">
          {/* Balance + Withdraw */}
          <StatCard
            label="USDC Balance"
            value={
              usdcBalance !== undefined
                ? `${formatUsdc(usdcBalance as bigint)}`
                : "—"
            }
          >
            <div className="mt-4 flex gap-2">
              <button
                type="button"
                onClick={() => setShowWithdraw(true)}
                className="flex-1 rounded-2xl bg-gradient-to-r from-navy-700 to-navy-900 px-4 py-2.5 text-sm font-black text-white shadow-md shadow-brand-500/20 transition hover:shadow-lg active:scale-[0.98]"
              >
                Withdraw
              </button>
              <button
                type="button"
                onClick={() => setShowDeposit(true)}
                className="rounded-2xl border border-slate-200 px-4 py-2.5 text-sm font-bold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
              >
                Deposit
              </button>
            </div>
          </StatCard>

          {/* Claimable Winnings + Claim */}
          <StatCard
            label="Claimable Winnings"
            value={hasJackpotContract ? `${formatUsdc(winnings)}` : "—"}
            accent={hasWinnings}
          >
            <div className="mt-4">
              <button
                type="button"
                onClick={claim}
                disabled={!hasJackpotContract || !hasWinnings || claimBusy}
                className="w-full rounded-2xl bg-gradient-to-r from-gold-400 to-gold-600 px-4 py-2.5 text-sm font-black text-navy-900 shadow-md shadow-gold-500/30 transition hover:shadow-lg active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {claimBusy
                  ? claimStatus === "claiming"
                    ? "Confirm in wallet…"
                    : "Claiming…"
                  : "🏆 Claim Prize"}
              </button>
              {claimStatus === "error" && claimError && (
                <p className="mt-2 text-xs font-medium text-red-500">
                  {claimError}
                </p>
              )}
              {!hasJackpotContract && (
                <p className="mt-2 text-[11px] text-slate-400">
                  Set NEXT_PUBLIC_JACKPOT_ADDRESS to enable claiming.
                </p>
              )}
            </div>
          </StatCard>

          {/* Tickets gifted */}
          <StatCard label="Tickets Gifted" value={ticketsGifted} accent={ticketsGifted > 0} />

          {/* Gifts sent count */}
          <StatCard label="Gifts Sent" value={gifts.length} />
        </div>

        {/* Gift new CTA */}
        <Link
          href="/gift"
          className="mt-4 flex items-center justify-center gap-2 rounded-3xl border-2 border-dashed border-navy-200 px-6 py-5 text-center font-black text-navy-700 transition hover:border-navy-400 hover:bg-navy-50/50 dark:border-navy-800 dark:text-navy-200 dark:hover:bg-navy-900/30"
        >
          🎁 Gift more lottery luck →
        </Link>

        {/* Gifts sent list */}
        <section className="mt-10">
          <h2 className="mb-4 text-lg font-black text-slate-900 dark:text-white">
            Gifts you&apos;ve sent
          </h2>
          {gifts.length === 0 ? (
            <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center dark:border-slate-800 dark:bg-slate-900">
              <p className="text-slate-500 dark:text-slate-400">
                No gifts yet. Send your first one from the{" "}
                <Link href="/gift" className="font-bold text-navy-700 dark:text-navy-200">
                  Gift
                </Link>{" "}
                page.
              </p>
            </div>
          ) : (
            <ul className="space-y-2">
              {gifts.map((g) => (
                <li
                  key={g.hash}
                  className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-3 dark:border-slate-800 dark:bg-slate-900"
                >
                  <div className="min-w-0">
                    <p className="font-bold text-slate-900 dark:text-white">
                      {g.tickets} {g.tickets === 1 ? "ticket" : "tickets"}
                    </p>
                    <p className="truncate font-mono text-xs text-slate-500">
                      to {g.handle ? `@${g.handle}` : shortenAddress(g.recipient)}
                    </p>
                  </div>
                  <a
                    href={basescanTx(g.hash)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="shrink-0 text-xs font-bold text-navy-600 transition hover:text-navy-800 dark:text-navy-300"
                  >
                    Receipt ↗
                  </a>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Received gifts (indexing note) */}
        <section className="mt-8">
          <h2 className="mb-4 text-lg font-black text-slate-900 dark:text-white">
            Gifts received
          </h2>
          <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center dark:border-slate-800 dark:bg-slate-900">
            <p className="text-slate-500 dark:text-slate-400">
              Received-gift history is being wired to an on-chain indexer.
              Your tickets and winnings above always reflect on-chain state.
            </p>
          </div>
        </section>

        <footer className="mt-10 text-center text-xs text-slate-400">
          Powered by Megapot on Base · Non-custodial
        </footer>
      </div>

      <DepositModal
        open={showDeposit}
        address={address}
        onClose={() => setShowDeposit(false)}
      />
      <WithdrawModal
        open={showWithdraw}
        balance={usdcBalance as bigint | undefined}
        onClose={() => setShowWithdraw(false)}
        onSuccess={(h) => {
          setShowWithdraw(false);
          setWithdrawHash(h);
        }}
      />
      <TxSuccessModal
        open={Boolean(withdrawHash)}
        emoji="💸"
        title="Withdrawal sent!"
        message="Your USDC is on its way."
        txHash={withdrawHash}
        onClose={() => setWithdrawHash(null)}
      />
      <TxSuccessModal
        open={showClaimSuccess}
        emoji="🏆"
        title="Prize claimed!"
        message="Your winnings have been sent to your wallet. Congratulations!"
        txHash={claimHash}
        onClose={() => {
          setShowClaimSuccess(false);
          resetClaim();
        }}
      />
    </main>
  );
}
