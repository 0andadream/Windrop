import type { Metadata } from "next";
import { Providers } from "../providers";

export const metadata: Metadata = {
  title: "Gift Tickets — WinDrop",
  description:
    "Gift Megapot lottery tickets to any wallet on Base. Connect, pick an amount, and send.",
};

// The wallet/auth stack (Privy → wagmi → react-query) only wraps the gift
// app, so the marketing pages render without any wallet configuration.
export default function GiftLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Providers>{children}</Providers>;
}
