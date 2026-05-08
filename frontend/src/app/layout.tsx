import type { Metadata } from "next";
import { Outfit, Geist } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AIChatWidget from "@/components/AIChatWidget";
import { FavoritesProvider } from "@/context/FavoritesContext";
import Providers from "./providers";
import { Suspense } from "react";
import { cn } from "@/lib/utils";

const geist = Geist({ subsets: ['latin'], variable: '--font-sans' });

const outfit = Outfit({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "PTGR Cars | Find Your Perfect Vehicle",
  description: "Discover thousands of cars for sale and rent. Buy, sell, or rent your next vehicle with PTGR Cars — the trusted car marketplace.",
}
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn("scroll-smooth", "font-sans", geist.variable)}>
      <body className={outfit.className}>
        <Providers>
          <FavoritesProvider>
            <Navbar />
            <main className="min-h-screen">
              {children}
            </main>
            <Footer />
            <Suspense fallback={
              <div className="fixed bottom-6 right-6 z-9999 flex flex-col items-end">
                <div className="bg-primary text-white p-5 rounded-3xl shadow-2xl flex items-center justify-center cursor-wait">
                  <div className="w-7 h-7 border-[3px] border-white/20 border-t-white rounded-full animate-spin"></div>
                </div>
              </div>
            }>
              <AIChatWidget />
            </Suspense>
          </FavoritesProvider>
        </Providers>
      </body>
    </html>
  );
}
