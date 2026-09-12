import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { AgeGateModal } from "@/components/AgeGateModal";

export const metadata: Metadata = {
  title: "Edge Calculator | NBA Player-Prop Historical Evidence Beta",
  description:
    "Mobile-first decision-support tool comparing NBA player-prop lines with licensed historical evidence and Wilson score uncertainty intervals. Analysis-only 21+ beta.",
  applicationName: "Edge Calculator",
  keywords: [
    "NBA",
    "Player Props",
    "Historical Evidence",
    "Hit Rate Calculator",
    "Wilson Score Interval",
    "Break-Even Odds",
  ],
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#020617",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="bg-slate-950 text-slate-100 min-h-screen flex flex-col font-sans antialiased selection:bg-sky-500 selection:text-slate-950">
        <AgeGateModal />
        <Header />
        <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
