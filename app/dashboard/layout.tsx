import type { Metadata } from "next";
import { Providers } from "../providers";

export const metadata: Metadata = {
  title: "Dashboard — WinDrop",
  description: "Your tickets, gifts, winnings, and withdrawals on WinDrop.",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Providers>{children}</Providers>;
}
