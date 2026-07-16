"use client";

import { useCallback, useState } from "react";
import { useAccount, usePublicClient, useWalletClient } from "wagmi";
import { JACKPOT_ABI } from "@/lib/abi";
import { JACKPOT_ADDRESS, hasJackpotContract } from "@/lib/constants";
import { parseTxError } from "@/lib/txError";

export type ClaimStatus =
  | "idle"
  | "claiming"
  | "confirming"
  | "success"
  | "error";

export function useClaim() {
  const { address } = useAccount();
  const publicClient = usePublicClient();
  const { data: walletClient } = useWalletClient();

  const [status, setStatus] = useState<ClaimStatus>("idle");
  const [error, setError] = useState<string | null>(null);
  const [hash, setHash] = useState<`0x${string}` | null>(null);

  const reset = useCallback(() => {
    setStatus("idle");
    setError(null);
    setHash(null);
  }, []);

  const claim = useCallback(async () => {
    if (!hasJackpotContract) {
      setStatus("error");
      setError(
        "Claiming isn't configured yet (missing jackpot contract address).",
      );
      return;
    }
    if (!address || !walletClient || !publicClient) {
      setStatus("error");
      setError("Connect your wallet first.");
      return;
    }

    setStatus("idle");
    setError(null);
    setHash(null);

    try {
      setStatus("claiming");
      const txHash = await walletClient.writeContract({
        address: JACKPOT_ADDRESS as `0x${string}`,
        abi: JACKPOT_ABI,
        functionName: "withdrawWinnings",
        args: [],
      });
      setHash(txHash);
      setStatus("confirming");

      const receipt = await publicClient.waitForTransactionReceipt({
        hash: txHash,
      });
      if (receipt.status === "reverted") {
        setStatus("error");
        setError("The claim transaction reverted on-chain.");
        return;
      }
      setStatus("success");
    } catch (err) {
      setStatus("error");
      setError(parseTxError(err));
    }
  }, [address, walletClient, publicClient]);

  return { status, error, hash, claim, reset };
}
