import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { clashDisplay } from "./fonts";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import "../styles/globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

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
    <html lang="en" className={`${inter.variable} ${clashDisplay.variable}`}>
      <body className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
