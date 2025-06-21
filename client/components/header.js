"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Moon, Sun, Wallet, LogOut, User, Settings, ChevronDown } from "lucide-react"
import { useTheme } from "@/store/theme-store"
import useVoteChainStore from "@/store/contract-store"
import toast from "react-hot-toast"

export default function Header() {
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const { theme, toggleTheme } = useTheme()
  const {
    account,
    connectWallet,
    disconnectWallet,
    provider,
    chainId
  } = useVoteChainStore()

  const isConnected = !!account

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownOpen && !event.target.closest(".wallet-dropdown")) {
        setDropdownOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [dropdownOpen])

  const handleConnect = async () => {
    try {
      await connectWallet("metamask")
      toast.success("Wallet connected successfully")
    } catch (error) {
      toast.error("Failed to connect wallet: " + (error.message || "Unknown error"))
    }
  }

  const handleDisconnect = async () => {
    try {
      await disconnectWallet()
      toast.success("Wallet disconnected")
    } catch (error) {
      toast.error("Failed to disconnect wallet: " + (error.message || "Unknown error"))
    }
    setDropdownOpen(false)
  }

  const shortenAddress = (address) => {
    return address ? `${address.slice(0, 6)}...${address.slice(-4)}` : ""
  }

  return (
    <header className="sticky top-0 z-40 backdrop-blur-md bg-white/60 dark:bg-gray-900/60 border-b border-white/10 dark:border-gray-800/50">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2">
            <div className="rounded-full bg-gradient-to-r from-blue-600 to-purple-600 p-1 flex items-center justify-center">
              <Wallet className="h-5 w-5 text-white" />
            </div>
            <span className="font-bold text-xl bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent font-poppins">
              VoteChain
            </span>
          </Link>
        </div>

        <div className="flex items-center gap-4">
          {/* Dark Mode Toggle */}
          <button
            onClick={toggleTheme}
            className="relative p-2 rounded-full bg-white/10 dark:bg-gray-800/20 hover:bg-gray-100 dark:hover:bg-gray-800 shadow-sm transition-colors"
            aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
          >
            <Sun
              className={`w-5 h-5 ${theme === 'light'
                  ? 'text-yellow-500'
                  : 'text-gray-400 dark:text-gray-500'
                } transition-all duration-300 ${theme === 'dark' ? 'opacity-0 scale-0' : 'opacity-100 scale-100'
                } absolute inset-0 m-auto`}
            />
            <Moon
              className={`w-5 h-5 ${theme === 'dark'
                  ? 'text-blue-300'
                  : 'text-gray-400'
                } transition-all duration-300 ${theme === 'light' ? 'opacity-0 scale-0' : 'opacity-100 scale-100'
                } absolute inset-0 m-auto`}
            />
          </button>

          {isConnected ? (
            <div className="relative wallet-dropdown">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 px-3 py-1.5 bg-white/60 dark:bg-gray-800/60 rounded-md border border-gray-200 dark:border-gray-700 hover:bg-white dark:hover:bg-gray-800 transition-colors"
              >
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/50">
                  <User className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                </span>
                <span className="text-sm font-medium hidden md:block">{shortenAddress(account)}</span>
                <ChevronDown className={`h-4 w-4 transition-transform ${dropdownOpen ? "rotate-180" : ""}`} />
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 origin-top-right divide-y divide-gray-100 dark:divide-gray-800 rounded-md bg-white dark:bg-gray-800 shadow-lg ring-1 ring-black dark:ring-gray-700 ring-opacity-5 focus:outline-none">
                  <div className="py-2 px-3 text-xs text-gray-500 dark:text-gray-400">Connected to {chainId ? `Chain ID: ${chainId}` : "blockchain"}</div>
                  <div className="py-1">
                    <button
                      onClick={() => {
                        setDropdownOpen(false)
                      }}
                      className="flex w-full items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <Settings className="mr-2 h-4 w-4" />
                      Settings
                    </button>
                    <button
                      onClick={handleDisconnect}
                      className="flex w-full items-center px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Disconnect
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={handleConnect}
              className="inline-flex items-center justify-center rounded-md bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-4 py-2 text-sm font-medium text-white shadow-sm hover:shadow-md transition-all"
            >
              <Wallet className="mr-2 h-4 w-4" />
              Connect Wallet
            </button>
          )}
        </div>
      </div>
    </header>
  )
}
