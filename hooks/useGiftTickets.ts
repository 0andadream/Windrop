"use client";

import { useCallback, useState } from "react";
import { getAddress, type Address } from "viem";
import {
  useAccount,
  usePublicClient,
  useWalletClient,
} from "wagmi";
import { ERC20_ABI, TICKET_BUYER_ABI } from "@/lib/abi";
import {
  TICKET_BUYER_ADDRESS,
  TICKET_PRICE_USDC,
  USDC_ADDRESS,
  USDC_DECIMALS,
  ZERO_ADDRESS,
} from "@/lib/constants";

export type GiftStatus =
  | "idle"
  | "checking"
  | "approving"
  | "confirming-approval"
  | "buying"
  | "confirming-purchase"
  | "success"
  | "error";

export interface GiftState {
  status: GiftStatus;
  error: string | null;
  approveHash: `0x${string}` | null;
  buyHash: `0x${string}` | null;
}

const INITIAL_STATE: GiftState = {
  status: "idle",
  error: null,
  approveHash: null,
  buyHash: null,
};

function parseError(err: unknown): string {
  const message =
    err instanceof Error ? err.message : String(err ?? "Unknown error");
  const lower = message.toLowerCase();

  if (
    lower.includes("user rejected") ||
    lower.includes("user denied") ||
    lower.includes("rejected the request")
  ) {
    return "Transaction cancelled. No worries — try again whenever you're ready.";
  }
  if (
    lower.includes("insufficient funds") ||
    lower.includes("exceeds balance") ||
    lower.includes("transfer amount exceeds")
  ) {
    return "Not enough funds to cover the tickets and gas. Top up and try again.";
  }
  if (lower.includes("insufficient allowance")) {
    return "USDC approval didn't go through. Please try again.";
  }
  // Fall back to the first line of the raw error, trimmed for readability.
  const firstLine = message.split("\n")[0].trim();
  return firstLine.length > 160 ? `${firstLine.slice(0, 157)}…` : firstLine;
}

export function useGiftTickets() {
  const { address } = useAccount();
  const publicClient = usePublicClient();
  const { data: walletClient } = useWalletClient();
  const [state, setState] = useState<GiftState>(INITIAL_STATE);

  const reset = useCallback(() => setState(INITIAL_STATE), []);

  const gift = useCallback(
    async (recipient: string, ticketCount: number) => {
      if (!address || !walletClient || !publicClient) {
        setState({
          ...INITIAL_STATE,
          status: "error",
          error: "Connect your wallet to send a gift.",
        });
        return;
      }

      let recipientAddress: Address;
      try {
        recipientAddress = getAddress(recipient);
      } catch {
        setState({
          ...INITIAL_STATE,
          status: "error",
          error: "That doesn't look like a valid wallet address.",
        });
        return;
      }

      // Total USDC cost, in the token's smallest unit (6 decimals).
      const totalCost =
        BigInt(ticketCount) *
        BigInt(TICKET_PRICE_USDC) *
        10n ** BigInt(USDC_DECIMALS);

      setState({ ...INITIAL_STATE, status: "checking" });

      try {
        // 1. Balance guard.
        const balance = (await publicClient.readContract({
          address: USDC_ADDRESS,
          abi: ERC20_ABI,
          functionName: "balanceOf",
          args: [address],
        })) as bigint;

        if (balance < totalCost) {
          setState({
            ...INITIAL_STATE,
            status: "error",
            error: `You need ${ticketCount} USDC but only have ${
              Number(balance) / 10 ** USDC_DECIMALS
            }. Top up and try again.`,
          });
          return;
        }

        // 2. Allowance check → approve if needed.
        const allowance = (await publicClient.readContract({
          address: USDC_ADDRESS,
          abi: ERC20_ABI,
          functionName: "allowance",
          args: [address, TICKET_BUYER_ADDRESS],
        })) as bigint;

        if (allowance < totalCost) {
          setState((s) => ({ ...s, status: "approving" }));
          const approveHash = await walletClient.writeContract({
            address: USDC_ADDRESS,
            abi: ERC20_ABI,
            functionName: "approve",
            args: [TICKET_BUYER_ADDRESS, totalCost],
          });
          setState((s) => ({
            ...s,
            status: "confirming-approval",
            approveHash,
          }));
          await publicClient.waitForTransactionReceipt({ hash: approveHash });
        }

        // 3. buyTickets(_referrer=address(0), _value, _recipient).
        setState((s) => ({ ...s, status: "buying" }));
        const buyHash = await walletClient.writeContract({
          address: TICKET_BUYER_ADDRESS,
          abi: TICKET_BUYER_ABI,
          functionName: "buyTickets",
          args: [ZERO_ADDRESS, totalCost, recipientAddress],
        });
        setState((s) => ({ ...s, status: "confirming-purchase", buyHash }));

        const receipt = await publicClient.waitForTransactionReceipt({
          hash: buyHash,
        });

        if (receipt.status === "reverted") {
          setState((s) => ({
            ...s,
            status: "error",
            error: "The purchase transaction reverted on-chain.",
          }));
          return;
        }

        setState((s) => ({ ...s, status: "success" }));
      } catch (err) {
        setState((s) => ({
          ...s,
          status: "error",
          error: parseError(err),
        }));
      }
    },
    [address, walletClient, publicClient],
  );

  return { ...state, gift, reset };
}
