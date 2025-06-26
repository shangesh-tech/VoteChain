import "./globals.css"
import { Inter, Poppins } from "next/font/google"
import Header from "@/components/header"
import { Toaster } from "react-hot-toast"

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-poppins",
})

export const metadata = {
  title: "VoteChain - Decentralized Voting Platform",
  description: "Secure, transparent, and decentralized voting platform built on blockchain technology",
  author: "Shangesh S"
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
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
        <Header />
        <main className="relative pt-20">{children}</main>

      </body>
    </html>
  )
}
