import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AppProvider } from "@/lib/store";
import BottomNav from "@/components/BottomNav";
import Toast from "@/components/Toast";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Litmus Protocol — Get Paid to Catch Fakes",
  description:
    "Verify deepfakes, bet on authenticity, and earn LMT tokens on Solana.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#0f0f0f",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
        <AppProvider>
          <div className="relative mx-auto min-h-screen max-w-[480px]">
            <main className="pb-[88px]">{children}</main>
            <BottomNav />
            <Toast />
          </div>
        </AppProvider>
      </body>
    </html>
  );
}
