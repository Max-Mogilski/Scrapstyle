import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "sonner";
import { Analytics } from "@vercel/analytics/next";
import Background from "./components/Background";
import Header from "./components/Header";
import Footer from "./components/Footer";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Scrape Style - AI-Ready Style Guides for Cursor & Lovable",
  description:
    "Paste a URL, get a design system. Generate AI-ready style guides for Cursor & Lovable in seconds. Free & open source.",
  keywords: [
    "design system",
    "style guide",
    "Cursor",
    "Lovable",
    "AI coding",
    "UI design",
    "design tokens",
  ],
  icons: {
    icon: "/icon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} antialiased`}>
        <Background />
        <Toaster
          position="top-center"
          toastOptions={{
            unstyled: true,
            classNames: {
              toast:
                "flex items-center gap-4 px-6 py-5 bg-white border-2 border-[#383838] rounded-xl shadow-[-6px_6px_0px_0px_#383838] font-[var(--font-inter)]",
              success:
                "!bg-gradient-to-r !from-[#E8F5E9] !to-white animate-success-glow",
              title: "font-bold text-lg text-[#383838]",
              description: "text-sm text-[#555]",
            },
          }}
        />
        <div className="min-h-screen flex flex-col relative overflow-hidden">
          <Header />
          {children}
          <Footer />
        </div>
        <Analytics />
      </body>
    </html>
  );
}
