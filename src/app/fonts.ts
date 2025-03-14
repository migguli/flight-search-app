import { Inter } from "next/font/google"

export const inter = Inter({
  subsets: ["latin"],
  display: "swap",
})

// Temporary system font fallback until Clash Display is properly licensed
export const systemFont = {
  style: {
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
  },
  variable: "--font-clash-display" as const,
} 