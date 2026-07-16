"use client";

import { useEffect, useState, type ReactNode } from "react";
import { PrivyProvider } from "@privy-io/react-auth";
import { WagmiProvider } from "@privy-io/wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { base } from "wagmi/chains";
import { wagmiConfig } from "@/lib/wagmi";

const queryClient = new QueryClient();

const PRIVY_APP_ID = process.env.NEXT_PUBLIC_PRIVY_APP_ID;

// Privy app IDs are non-empty short strings; guard against an obviously
// missing / placeholder value so we can show a friendly screen instead of
// letting the Privy provider throw ("invalid Privy app ID").
function isValidPrivyAppId(id: string | undefined): id is string {
  return typeof id === "string" && id.trim().length > 0;
}

function MissingConfigScreen() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 to-brand-50 p-6 dark:from-slate-950 dark:to-slate-900">
      <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white/80 p-8 text-center shadow-xl backdrop-blur dark:border-slate-800 dark:bg-slate-900/80">
        <div className="mb-4 text-5xl">🎁</div>
        <h1 className="mb-2 text-2xl font-black text-slate-900 dark:text-white">
          WinDrop needs setup
        </h1>
        <p className="mb-6 text-slate-600 dark:text-slate-400">
          The{" "}
          <code className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-sm text-brand-600 dark:bg-slate-800 dark:text-brand-300">
            NEXT_PUBLIC_PRIVY_APP_ID
          </code>{" "}
          environment variable is missing or invalid.
        </p>
        <div className="rounded-xl bg-slate-100 p-4 text-left text-sm text-slate-600 dark:bg-slate-800 dark:text-slate-300">
          <p className="mb-2 font-semibold">To get started:</p>
          <ol className="list-inside list-decimal space-y-1">
            <li>
              Create an app at{" "}
              <span className="font-mono text-brand-600 dark:text-brand-300">
                dashboard.privy.io
              </span>
            </li>
            <li>
              Copy{" "}
              <code className="font-mono">.env.example</code> to{" "}
              <code className="font-mono">.env.local</code>
            </li>
            <li>Add your Privy app ID and restart</li>
          </ol>
        </div>
      </div>
    </div>
  );
}

export function Providers({ children }: { children: ReactNode }) {
  // Render the wallet/auth stack client-only. Static generation cannot
  // initialize Privy (no app ID at build time) and would crash otherwise.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return null;
  }

  if (!isValidPrivyAppId(PRIVY_APP_ID)) {
    return <MissingConfigScreen />;
  }

  return (
    <PrivyProvider
      appId={PRIVY_APP_ID}
      config={{
        appearance: {
          theme: "light",
          accentColor: "#3563ff",
          logo: undefined,
        },
        defaultChain: base,
        supportedChains: [base],
        embeddedWallets: {
          createOnLogin: "users-without-wallets",
        },
      }}
    >
      <QueryClientProvider client={queryClient}>
        <WagmiProvider config={wagmiConfig}>{children}</WagmiProvider>
      </QueryClientProvider>
    </PrivyProvider>
  );
}
