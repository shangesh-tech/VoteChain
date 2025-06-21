"use client"

import { useState } from "react"
import { User, CheckCircle, Crown, Medal, Award } from "lucide-react"
import useVoteChainStore from "@/store/contract-store"

export default function CandidateCard({
  candidate,
  totalVotes = 0,
  onVote,
  hasVoted = false,
  isUserVote = false,
  showResults = false,
  isElectionEnded = false,
  rank = null,
}) {
  const [isVoting, setIsVoting] = useState(false)
  const { account } = useVoteChainStore()
  const isConnected = !!account

  const votePercentage = totalVotes > 0 ? (candidate.votes / totalVotes) * 100 : 0

  const getRankIcon = (rank) => {
    switch (rank) {
      case 1:
        return <Crown className="w-5 h-5 text-yellow-500" />
      case 2:
        return <Medal className="w-5 h-5 text-gray-400" />
      case 3:
        return <Award className="w-5 h-5 text-orange-500" />
      default:
        return null
    }
  }

  const getRankColor = (rank) => {
    switch (rank) {
      case 1:
        return "border-yellow-300 bg-yellow-50 dark:bg-yellow-900/20"
      case 2:
        return "border-gray-300 bg-gray-50 dark:bg-gray-800/50"
      case 3:
        return "border-orange-300 bg-orange-50 dark:bg-orange-900/20"
      default:
        return "border-gray-200 dark:border-gray-700"
    }
  }

  const handleVote = async () => {
    if (!isConnected) return
    if (hasVoted) return
    if (isElectionEnded) return

    setIsVoting(true)
    try {
      await onVote(candidate.id)
    } finally {
      setIsVoting(false)
    }
  }

  return (
    <div className={`rounded-xl shadow-md transition-all duration-300 hover:shadow-xl ${isUserVote
      ? "ring-2 ring-green-500 bg-green-50 dark:bg-green-900/20"
      : showResults && rank
        ? `${getRankColor(rank)} border-2`
        : "bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl border border-white/20 dark:border-gray-700/20"
      }`}>
      <div className="p-6">
        <div className="flex items-center justify-between">
          {/* Candidate Info */}
          <div className="flex items-center gap-4 flex-1">
            {/* Avatar */}
            <div className="relative group">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 rounded-2xl flex items-center justify-center overflow-hidden transform transition-transform group-hover:scale-105">
                {candidate.avatar ? (
                  <img
                    src={candidate.avatar || "/placeholder.svg"}
                    alt={candidate.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="w-10 h-10 text-gray-600 dark:text-gray-400" />
                )}
              </div>

              {/* Rank Badge */}
              {showResults && rank && (
                <div className="absolute -top-3 -right-3 w-10 h-10 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center shadow-lg border-2 border-white dark:border-gray-800 transform transition-transform group-hover:scale-110">
                  {getRankIcon(rank)}
                </div>
              )}
            </div>

            {/* Details */}
            <div className="flex-1 space-y-3">
              <div className="flex items-center gap-3 flex-wrap">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white font-poppins">{candidate.name}</h3>

                {isUserVote && (
                  <span className="px-3 py-1 bg-green-500 text-white rounded-full text-sm flex items-center">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Your Vote
                  </span>
                )}

                {showResults && rank === 1 && (
                  <span className="px-3 py-1 bg-yellow-500 text-white rounded-full text-sm flex items-center">
                    <Crown className="w-3 h-3 mr-1" />
                    Winner
                  </span>
                )}
              </div>

              <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">{candidate.description}</p>

              {/* Platform Tags */}
              {candidate.platform && (
                <div className="flex flex-wrap gap-2">
                  {candidate.platform.slice(0, 3).map((item, index) => (
                    <span key={index} className="px-3 py-1 rounded-full text-xs border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-800/50">
                      {item}
                    </span>
                  ))}
                </div>
              )}

              {/* Results - Only show if election ended */}
              {showResults && (
                <div className="space-y-2 mt-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">{candidate.votes.toLocaleString()} votes</span>
                    <span className="font-bold text-gray-900 dark:text-white text-lg">
                      {votePercentage.toFixed(1)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                    <div
                      className="bg-blue-600 h-2.5 rounded-full transition-all duration-500"
                      style={{ width: `${votePercentage}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {!isElectionEnded && (
            <div className="ml-4">
              <button
                onClick={handleVote}
                disabled={!isConnected || hasVoted || isVoting}
                className={`px-8 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 disabled:hover:scale-100 ${isUserVote
                  ? "bg-green-600 hover:bg-green-700 text-white"
                  : !isConnected
                    ? "bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                    : hasVoted
                      ? "bg-gray-200 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                      : isVoting
                        ? "bg-blue-400 text-white"
                        : "bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-blue-500/30"
                  }`}
              >
                {!isConnected ? "Connect Wallet" :
                  hasVoted ? (isUserVote ? "✓ Voted" : "Already Voted") :
                    isVoting ? (
                      <div className="flex items-center justify-center">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        Voting...
                      </div>
                    ) : "Vote"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
