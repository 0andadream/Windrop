import { formatUnits } from "viem";
import { USDC_DECIMALS } from "./constants";

export function formatUsdc(value: bigint, maxFractionDigits = 2): string {
  const raw = Number(formatUnits(value, USDC_DECIMALS));
  return raw.toLocaleString(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: maxFractionDigits,
  });
}

export function shortenAddress(address: string): string {
  if (!address || address.length < 10) return address;
  return `${address.slice(0, 6)}…${address.slice(-4)}`;
}
