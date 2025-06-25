"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, Clock, Users, CheckCircle, Share2, Bookmark, Eye, Lock, BarChart3 } from "lucide-react"
import CandidateCard from "@/components/candidate-card"
import ElectionResults from "@/components/election-results"
import useVoteChainStore from "@/store/contract-store"
import toast from "react-hot-toast"

export default function ElectionDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [election, setElection] = useState(null)
  const [timeLeft, setTimeLeft] = useState("")
  const [hasVoted, setHasVoted] = useState(false)
  const [votedCandidateId, setVotedCandidateId] = useState(null)
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isElectionEnded, setIsElectionEnded] = useState(false)

  const {
    fetchElectionDetails,
    account,
    checkIfUserVoted,
    vote,
    contract,
    connectWallet
  } = useVoteChainStore()

  const isConnected = !!account

  useEffect(() => {
    const loadElection = async () => {
      setIsLoading(true)
      try {
        // Get election by ID
        const electionData = await fetchElectionDetails(params.id)

        if (!electionData) {
          setIsLoading(false)
          return
        }

        // Transform the data to match the component's expected format
        const formattedElection = {
          id: electionData.id,
          title: electionData.name,
          description: electionData.description,
          deadline: Number(electionData.deadline) * 1000, // Convert to milliseconds
          totalVotes: electionData.totalVotes || 0,
          image: electionData.image,
          category: "governance", // Default category
          trending: true,
          candidates: Array.isArray(electionData.candidates)
            ? electionData.candidates.map((candidate, index) => ({
              id: candidate.candidateId,
              name: candidate.name,
              description: candidate.description,
              votes: parseInt(candidate.voteCount),
              avatar: "https://gravatar.com/avatar/c889e36b3da0d55fec2a8191a545f5c2?s=400&d=robohash&r=x"
            }))
            : []
        }

        setElection(formattedElection)

        // Check if user has voted
        if (account) {
          const hasVoted = await checkIfUserVoted(params.id)
          setHasVoted(hasVoted)
        }

      } catch (error) {
        console.error("Failed to fetch election details:", error)
        toast.error("Failed to load election details")
      } finally {
        setIsLoading(false)
      }

      // Check bookmark status
      const bookmarks = JSON.parse(localStorage.getItem("bookmarkedElections") || "[]")
      setIsBookmarked(bookmarks.includes(Number(params.id)))
    }
    if (!isConnected) {
      toast.error("Please connect your wallet first")
      return
    } else {
      if (params.id) {
        loadElection()
      }
    }

  }, [params.id, fetchElectionDetails, account, checkIfUserVoted, isConnected])

  useEffect(() => {
    if (!election) return

    const timer = setInterval(() => {
      const now = new Date().getTime()
      const deadline = new Date(election.deadline).getTime()
      const difference = deadline - now

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24))
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))
        const seconds = Math.floor((difference % (1000 * 60)) / 1000)

        setTimeLeft(`${days}d ${hours}h ${minutes}m ${seconds}s`)
        setIsElectionEnded(false)
      } else {
        setTimeLeft("Election ended")
        setIsElectionEnded(true)
      }
    }, 1000)

    return () => clearInterval(timer)
  }, [election])

  const handleVote = async (candidateId) => {
    if (!isConnected) {
      toast.error("Please connect your wallet first")
      await connectWallet("metamask")
      return
    }

    if (hasVoted) {
      toast.error("You have already voted in this election")
      return
    }

    if (isElectionEnded) {
      toast.error("This election has ended")
      return
    }

    if (!contract) {
      toast.error("Contract not connected")
      return
    }

    try {
      toast.loading("Casting your vote...", { id: "voting" })

      await vote(params.id, candidateId)

      // Update local state
      setHasVoted(true)
      setVotedCandidateId(candidateId)

      // Update vote count in local state
      setElection((prev) => ({
        ...prev,
        candidates: prev.candidates.map((candidate) =>
          candidate.id === candidateId ? { ...candidate, votes: candidate.votes + 1 } : candidate
        ),
        totalVotes: prev.totalVotes + 1,
      }))

      toast.success("Vote cast successfully!", { id: "voting" })

    } catch (error) {
      console.error("Failed to vote:", error)
      toast.error("Failed to cast vote: " + (error.message || "Unknown error"), { id: "voting" })
    }
  }

  const handleBookmark = () => {
    const bookmarks = JSON.parse(localStorage.getItem("bookmarkedElections") || "[]")
    const electionId = Number(params.id)

    if (isBookmarked) {
      const updated = bookmarks.filter((id) => id !== electionId)
      localStorage.setItem("bookmarkedElections", JSON.stringify(updated))
      setIsBookmarked(false)
      toast.success("Removed from bookmarks")
    } else {
      bookmarks.push(electionId)
      localStorage.setItem("bookmarkedElections", JSON.stringify(bookmarks))
      setIsBookmarked(true)
      toast.success("Added to bookmarks")
    }
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: election.title,
        text: election.description,
        url: window.location.href,
      })
    } else {
      navigator.clipboard.writeText(window.location.href)
      toast.success("Link copied to clipboard")
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading election details...</p>
        </div>
      </div>
    )
  }

  if (!election) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center space-y-4">
          <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto">
            <Eye className="w-12 h-12 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Election not found</h3>
          <p className="text-gray-500 dark:text-gray-400">The election you are looking for does not exist</p>
          <button
            onClick={() => router.push("/")}
            className="mt-4 inline-flex items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </button>
        </div>
      </div>
    )
  }

  const now = new Date().getTime()
  const deadline = new Date(election.deadline).getTime()
  const totalDuration = 14 * 24 * 60 * 60 * 1000 // 14 days
  const elapsed = now - (deadline - totalDuration)
  const progressPercentage = Math.min((elapsed / totalDuration) * 100, 100)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Navigation */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => router.push("/")}
            className="inline-flex items-center justify-center rounded-md text-gray-700 dark:text-gray-300 hover:bg-white/50 dark:hover:bg-gray-800/50 backdrop-blur-sm px-4 py-2 text-sm font-medium"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Elections
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="inline-flex items-center justify-center rounded-md border border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-800/50 px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-800"
            >
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </button>
            <button
              onClick={handleBookmark}
              className={`inline-flex items-center justify-center rounded-md border border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-800/50 px-3 py-1.5 text-sm font-medium hover:bg-white dark:hover:bg-gray-800 ${isBookmarked ? "text-yellow-600" : "text-gray-700 dark:text-gray-300"}`}
            >
              <Bookmark className={`w-4 h-4 mr-2 ${isBookmarked ? "fill-current" : ""}`} />
              {isBookmarked ? "Saved" : "Save"}
            </button>
          </div>
        </div>

        {/* Election Header */}
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl overflow-hidden border border-white/20 dark:border-gray-700/20 mb-8">
          <div className="relative h-64 md:h-80 bg-gradient-to-r from-blue-500 to-purple-600">
            <img
              src={election.image}
              alt={election.title}
              className="w-full h-full object-cover mix-blend-overlay"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent"></div>
            <div className="absolute bottom-0 left-0 p-6 md:p-8">
              <div className="flex flex-wrap gap-2 mb-3">
                <span className="inline-flex items-center rounded-md border border-blue-200 bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-800 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800">
                  {election.category.charAt(0).toUpperCase() + election.category.slice(1)}
                </span>
                <span className={`inline-flex items-center rounded-md px-2.5 py-0.5 text-xs font-medium ${isElectionEnded ? "bg-red-50 text-red-800 border border-red-200 dark:bg-red-900/20 dark:text-red-300 dark:border-red-800" : "bg-green-50 text-green-800 border border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800"}`}>
                  {isElectionEnded ? "Ended" : "Active"}
                </span>
                {election.trending && !isElectionEnded && (
                  <span className="inline-flex items-center rounded-md border border-orange-200 bg-orange-50 px-2.5 py-0.5 text-xs font-medium text-orange-800 dark:bg-orange-900/20 dark:text-orange-300 dark:border-orange-800">
                    Trending
                  </span>
                )}
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-white font-poppins">{election.title}</h1>
            </div>
          </div>

          <div className="p-6 md:p-8">
            {/* Election Progress */}
            <div className="mb-6">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600 dark:text-gray-400">Election Progress</span>
                <span className="font-medium">{isElectionEnded ? "Completed" : "In Progress"}</span>
              </div>
              <div className="relative h-2 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
                <div
                  className="h-full bg-blue-600 transition-all"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
            </div>

            {/* Election Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-blue-50/50 dark:bg-blue-900/10 rounded-xl p-4 flex items-center space-x-3">
                <div className="bg-blue-100 dark:bg-blue-800/30 p-2 rounded-lg">
                  <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Time Left</p>
                  <p className="font-semibold text-gray-900 dark:text-white">{timeLeft}</p>
                </div>
              </div>

              <div className="bg-purple-50/50 dark:bg-purple-900/10 rounded-xl p-4 flex items-center space-x-3">
                <div className="bg-purple-100 dark:bg-purple-800/30 p-2 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Total Votes</p>
                  <p className="font-semibold text-gray-900 dark:text-white">{election.totalVotes.toLocaleString()}</p>
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <h2 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">About this Election</h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{election.description}</p>
            </div>
          </div>
        </div>

        {/* Candidates Section */}
        <div className="mb-12">

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {election.candidates.map((candidate) => (
              <CandidateCard
                key={candidate.id}
                candidate={candidate}
                onVote={handleVote}
                isSelected={votedCandidateId === candidate.id}
                isUserVote={votedCandidateId === candidate.id}
                hasVoted={hasVoted}
                disabled={!isConnected || hasVoted || isElectionEnded}
                isConnected={isConnected}
                totalVotes={election.totalVotes}
                showResults={hasVoted || isElectionEnded}
                isElectionEnded={isElectionEnded}
                percentage={Math.round((candidate.votes / election.totalVotes) * 100) || 0}
                rank={isElectionEnded ? election.candidates.sort((a, b) => b.votes - a.votes).findIndex(c => c.id === candidate.id) + 1 : null}
              />
            ))}
          </div>
        </div>

        {/* Results Section */}
        {(hasVoted || isElectionEnded) && (
          <div className="mb-12">
            <div className="flex items-center mb-6">
              <BarChart3 className="w-6 h-6 text-blue-600 mr-2" />
              <h2 className="text-2xl font-bold font-poppins text-gray-900 dark:text-white">Election Results</h2>
            </div>
            <ElectionResults election={election} />
          </div>
        )}
      </div>
    </div>
  )
}
