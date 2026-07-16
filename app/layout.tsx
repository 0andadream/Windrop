import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

// Canonical site URL. Set NEXT_PUBLIC_SITE_URL in your host (e.g. your
// Netlify site URL); falls back to localhost for local dev.
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "WinDrop — Gift Lottery Luck",
  description:
    "Gift Megapot lottery tickets to any wallet on Base. One tap, big wins.",
  openGraph: {
    title: "WinDrop — Gift Lottery Luck",
    description:
      "Gift Megapot lottery tickets to any wallet on Base. One tap, big wins.",
    url: "/",
    siteName: "WinDrop",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "WinDrop" }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "WinDrop — Gift Lottery Luck",
    description:
      "Gift Megapot lottery tickets to any wallet on Base. One tap, big wins.",
    images: ["/og-image.png"],
  },
};

export const viewport: Viewport = {
  themeColor: "#3563ff",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Respect the OS colour scheme before hydration to avoid a flash. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var d=window.matchMedia('(prefers-color-scheme: dark)').matches;document.documentElement.classList.toggle('dark',d);}catch(e){}})();`,
          }}
        />
      </head>
      <body className={`${inter.variable} font-sans`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
