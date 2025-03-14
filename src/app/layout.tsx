import type { Metadata } from "next";
import { inter, systemFont } from "./fonts";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import SkipToContent from "@/components/layout/SkipToContent";
import BackgroundController from "@/components/layout/BackgroundController";
import "./globals.css";
import "@/styles/fonts.css";

export const metadata: Metadata = {
  title: "Flight Search App",
  description: "Find and book your perfect flight",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${systemFont.variable}`}>
      <body className="min-h-screen flex flex-col font-sans bg-black text-foreground">
        <BackgroundController />
        <SkipToContent />
        <Header />
        <main id="main-content" className="flex-grow container py-8" tabIndex={-1}>
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
