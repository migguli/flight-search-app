import type { Metadata } from "next";
import { inter, systemFont } from "./fonts";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import "../styles/globals.css";
import "../styles/fonts.css";

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
    <html lang="en" className={inter.className}>
      <body className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
