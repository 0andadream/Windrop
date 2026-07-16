import { http } from "wagmi";
import { base } from "wagmi/chains";
import { createConfig } from "@privy-io/wagmi";

const rpcUrl =
  process.env.NEXT_PUBLIC_BASE_RPC_URL || "https://mainnet.base.org";

export const wagmiConfig = createConfig({
  chains: [base],
  transports: {
    [base.id]: http(rpcUrl),
  },
});

declare module "wagmi" {
  interface Register {
    config: typeof wagmiConfig;
  }
}
