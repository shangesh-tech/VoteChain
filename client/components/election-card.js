"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Clock, Users, Vote, TrendingUp, Bookmark, CheckCircle } from "lucide-react"
import toast from "react-hot-toast"
import useVoteChainStore from "@/store/contract-store"

export default function ElectionCard({ election }) {
  const [timeLeft, setTimeLeft] = useState("")
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [isElectionEnded, setIsElectionEnded] = useState(false)
  const { account } = useVoteChainStore()

  const isConnected = !!account

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime()
      const deadline = new Date(election.deadline).getTime()
      const difference = deadline - now

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24))
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))

        if (days > 0) {
          setTimeLeft(`${days}d ${hours}h`)
        } else if (hours > 0) {
          setTimeLeft(`${hours}h ${minutes}m`)
        } else {
          setTimeLeft(`${minutes}m`)
        }
        setIsElectionEnded(false)
      } else {
        setTimeLeft("Ended")
        setIsElectionEnded(true)
      }
    }, 1000)

    // Check bookmark status
    const bookmarks = JSON.parse(localStorage.getItem("bookmarkedElections") || "[]")
    setIsBookmarked(bookmarks.includes(election.id))

    return () => clearInterval(timer)
  }, [election.deadline, election.id])

  const handleBookmark = (e) => {
    e.preventDefault()
    e.stopPropagation()

    const bookmarks = JSON.parse(localStorage.getItem("bookmarkedElections") || "[]")

    if (isBookmarked) {
      const updated = bookmarks.filter((id) => id !== election.id)
      localStorage.setItem("bookmarkedElections", JSON.stringify(updated))
      setIsBookmarked(false)
      toast.success("Election removed from bookmarks!")
    } else {
      bookmarks.push(election.id)
      localStorage.setItem("bookmarkedElections", JSON.stringify(bookmarks))
      setIsBookmarked(true)
      toast.success("Election added to bookmarks!")
    }
  }

  const getCategoryColor = (category) => {
    const colors = {
      governance: "bg-purple-500",
      community: "bg-orange-500",
      policy: "bg-indigo-500",
    }
    return colors[category] || "bg-blue-500"
  }

  return (
    <div className="group hover:shadow-xl transition-all duration-300 cursor-pointer bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border border-white/20 dark:border-gray-700/20 hover:border-blue-300 dark:hover:border-blue-600 transform hover:scale-[1.02] overflow-hidden rounded-lg">
      <Link href={`/election/${election.id}`}>
        <div className="p-6 pb-4 relative">
          <div className="relative aspect-video bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 rounded-2xl mb-4 overflow-hidden">
            <Image
              src={election.image || "/placeholder.svg"}
              alt={election.title}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              width={400}
              height={225}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>

            {/* Status and Category Badges */}
            <div className="absolute top-3 left-3 flex gap-2">
              <span className={`${getCategoryColor(election.category)} text-white text-xs px-2.5 py-0.5 rounded-md inline-flex items-center`}>
                {election.category}
              </span>
              <span className={`${isElectionEnded ? "bg-red-500" : "bg-green-500"} text-white text-xs px-2.5 py-0.5 rounded-md inline-flex items-center`}>
                {isElectionEnded ? "Ended" : "Active"}
              </span>
              {election.trending && !isElectionEnded && (
                <span className="bg-orange-500 text-white text-xs px-2.5 py-0.5 rounded-md inline-flex items-center">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  Hot
                </span>
              )}
            </div>

            {/* Bookmark Button */}
            <button
              onClick={handleBookmark}
              className="absolute top-3 right-3 w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
            >
              <Bookmark className={`w-4 h-4 ${isBookmarked ? "fill-yellow-400 text-yellow-400" : "text-white"}`} />
            </button>
          </div>

          <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors font-poppins line-clamp-2">
            {election.title}
          </h3>
        </div>

        <div className="px-6 pb-4 space-y-4">
          <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-2 leading-relaxed">
            {election.description}
          </p>

          {/* Simple Stats */}
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
                <Clock className="w-4 h-4" />
                <span>{timeLeft}</span>
              </div>

            </div>

            {isElectionEnded && (
              <div className="flex items-center gap-1 text-green-600 dark:text-green-400">
                <CheckCircle className="w-4 h-4" />
                <span className="text-xs font-medium">Results Available</span>
              </div>
            )}
          </div>
        </div>
      </Link>

      <div className="px-6 pb-6 pt-0">
        <Link href={`/election/${election.id}`} className="w-full">
          <button
            className={`w-full transition-all duration-300 flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium ${isElectionEnded
              ? "bg-green-600 hover:bg-green-700 text-white"
              : isConnected
                ? "bg-blue-600 hover:bg-blue-700 text-white"
                : "bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
              }`}
            disabled={!isConnected && !isElectionEnded}
          >
            <Vote className="w-4 h-4 mr-2" />
            {isElectionEnded ? "View Results" : isConnected ? "Vote Now" : "Connect Wallet to Vote"}
          </button>
        </Link>
      </div>
    </div>
  )
}
