"use client"

import "./globals.css"
import { Inter, Poppins } from "next/font/google"
import { useEffect } from "react"
import Header from "@/components/header"
import { Toaster } from "react-hot-toast"
import { useTheme } from "@/store/theme-store"

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-poppins",
})

// export const metadata = {
//   title: "VoteChain - Decentralized Voting Platform",
//   description: "Secure, transparent, and decentralized voting platform built on blockchain technology",
//   generator: 'v0.dev'
// }

export default function RootLayout({ children }) {
  // Initialize theme
  const { theme } = useTheme()

  // Effect to handle initial theme setup
  useEffect(() => {
    // The actual theme toggles are handled in the theme-store.js
    // This is just for making sure SSR works well with the client-side theme
    return () => { };
  }, [theme]);

  return (
    <html lang="en" suppressHydrationWarning className={theme === "dark" ? "dark" : ""}>
      <body className={`${inter.variable} ${poppins.variable} font-inter antialiased bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 min-h-screen`}>
        <Toaster
          position="bottom-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: 'var(--color-background)',
              color: 'var(--color-foreground)',
              border: '1px solid var(--color-border)',
            },
          }}
        />
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
          <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
          <Header />
          <main className="relative pt-20">{children}</main>
        </div>
      </body>
    </html>
  )
}
