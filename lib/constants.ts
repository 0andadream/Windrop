import type { Address } from "viem";

// Base mainnet
export const BASE_CHAIN_ID = 8453;

// USDC on Base (6 decimals)
export const USDC_ADDRESS: Address =
  "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913";
export const USDC_DECIMALS = 6;

// Megapot — JackpotRandomTicketBuyer
export const TICKET_BUYER_ADDRESS: Address =
  "0xb9560b43b91dE2c1DaF5dfbb76b2CFcDaFc13aBd";

// Referrer is passed as the zero address (no referral).
export const ZERO_ADDRESS: Address =
  "0x0000000000000000000000000000000000000000";

// 1 USDC per ticket.
export const TICKET_PRICE_USDC = 1;

// Ticket selection bounds.
export const MIN_TICKETS = 1;
export const MAX_TICKETS = 100;
export const TICKET_PRESETS = [1, 5, 10, 25];

export const BASESCAN_URL = "https://basescan.org";

export const basescanTx = (hash: string) => `${BASESCAN_URL}/tx/${hash}`;
export const basescanAddress = (addr: string) =>
  `${BASESCAN_URL}/address/${addr}`;
