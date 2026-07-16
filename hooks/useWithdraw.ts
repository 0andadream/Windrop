"use client";

import { useCallback, useState } from "react";
import { getAddress, parseUnits, type Address } from "viem";
import { useAccount, usePublicClient, useWalletClient } from "wagmi";
import { ERC20_ABI } from "@/lib/abi";
import { USDC_ADDRESS, USDC_DECIMALS } from "@/lib/constants";
import { parseTxError } from "@/lib/txError";

export type WithdrawStatus =
  | "idle"
  | "sending"
  | "confirming"
  | "success"
  | "error";

export function useWithdraw() {
  const { address } = useAccount();
  const publicClient = usePublicClient();
  const { data: walletClient } = useWalletClient();

  const [status, setStatus] = useState<WithdrawStatus>("idle");
  const [error, setError] = useState<string | null>(null);
  const [hash, setHash] = useState<`0x${string}` | null>(null);

  const reset = useCallback(() => {
    setStatus("idle");
    setError(null);
    setHash(null);
  }, []);

  const withdraw = useCallback(
    async (to: string, amount: string) => {
      if (!address || !walletClient || !publicClient) {
        setStatus("error");
        setError("Connect your wallet first.");
        return;
      }

      let recipient: Address;
      try {
        recipient = getAddress(to.trim());
      } catch {
        setStatus("error");
        setError("That doesn't look like a valid wallet address.");
        return;
      }

      let value: bigint;
      try {
        value = parseUnits(amount, USDC_DECIMALS);
      } catch {
        setStatus("error");
        setError("Enter a valid amount.");
        return;
      }
      if (value <= 0n) {
        setStatus("error");
        setError("Enter an amount greater than zero.");
        return;
      }

      setStatus("idle");
      setError(null);
      setHash(null);

      try {
        // Balance guard.
        const balance = (await publicClient.readContract({
          address: USDC_ADDRESS,
          abi: ERC20_ABI,
          functionName: "balanceOf",
          args: [address],
        })) as bigint;

        if (balance < value) {
          setStatus("error");
          setError("You don't have that much USDC to withdraw.");
          return;
        }

        setStatus("sending");
        const txHash = await walletClient.writeContract({
          address: USDC_ADDRESS,
          abi: ERC20_ABI,
          functionName: "transfer",
          args: [recipient, value],
        });
        setHash(txHash);
        setStatus("confirming");

        const receipt = await publicClient.waitForTransactionReceipt({
          hash: txHash,
        });
        if (receipt.status === "reverted") {
          setStatus("error");
          setError("The withdrawal transaction reverted on-chain.");
          return;
        }
        setStatus("success");
      } catch (err) {
        setStatus("error");
        setError(parseTxError(err));
      }
    },
    [address, walletClient, publicClient],
  );

  return { status, error, hash, withdraw, reset };
}
