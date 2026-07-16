/** Turn a thrown wallet/RPC error into a friendly, human sentence. */
export function parseTxError(err: unknown): string {
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
    return "Not enough funds to cover this and gas. Top up and try again.";
  }
  if (lower.includes("insufficient allowance")) {
    return "Approval didn't go through. Please try again.";
  }
  const firstLine = message.split("\n")[0].trim();
  return firstLine.length > 160 ? `${firstLine.slice(0, 157)}…` : firstLine;
}
