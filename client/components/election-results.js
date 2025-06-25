"use client"

import { BarChart3, Trophy, Users, TrendingUp } from "lucide-react"

export default function ElectionResults({ election }) {
  if (!election || !election.candidates || election.candidates.length === 0) {
    return (
      <div className="text-center p-8 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
        <p className="text-gray-500 dark:text-gray-400">No results available</p>
      </div>
    )
  }

  const sortedCandidates = [...election.candidates].sort((a, b) => b.votes - a.votes)
  const winner = sortedCandidates[0]
  const totalVotes = election.totalVotes || election.candidates.reduce((sum, candidate) => sum + candidate.votes, 0)


  return (
    <div className="space-y-6">
      {/* Winner Announcement */}
      {winner && winner.votes > 0 && (
        <div className="rounded-xl overflow-hidden shadow-lg bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border border-yellow-200 dark:border-yellow-800">
          <div className="p-8 text-center">
            <div className="space-y-4">
              <div className="w-20 h-20 bg-yellow-500 rounded-full flex items-center justify-center mx-auto shadow-inner">
                <Trophy className="w-10 h-10 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Election Winner</h3>
                <p className="text-4xl font-bold text-yellow-600 dark:text-yellow-400 font-poppins animate-pulse">{winner.name}</p>
                <p className="text-lg text-gray-600 dark:text-gray-300 mt-3">
                  {totalVotes > 0 ? `${((winner.votes / totalVotes) * 100).toFixed(1)}% of votes` : "0% of votes"} ({winner.votes.toLocaleString()} votes)
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Results Chart */}
      <div className="rounded-xl overflow-hidden shadow-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border border-white/20 dark:border-gray-700/20">
        <div className="p-6 border-b border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-3 text-xl font-bold text-gray-900 dark:text-white">
            <BarChart3 className="w-6 h-6" />
            Vote Distribution
          </div>
        </div>
        <div className="p-6 space-y-8">
          {/* Bar Chart */}
          <div className="space-y-6">
            {sortedCandidates.map((candidate, index) => {
              const percentage = totalVotes > 0 ? (candidate.votes / totalVotes) * 100 : 0
              const barColors = [
                "bg-gradient-to-r from-yellow-400 to-yellow-600 shadow-yellow-500/50", // Winner - Gold
                "bg-gradient-to-r from-orange-400 to-orange-600 shadow-orange-500/50", // Second - Silver
                "bg-gradient-to-r from-blue-400 to-blue-600 shadow-blue-500/50", // Third - Bronze
                "bg-gradient-to-r from-gray-400 to-gray-600 shadow-gray-500/50", // Others - Blue
              ]

              return (
                <div key={candidate.id} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <span className="text-3xl font-bold text-gray-400 w-8">#{index + 1}</span>
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white text-lg">{candidate.name}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {candidate.votes.toLocaleString()} votes
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">{percentage.toFixed(1)}%</p>
                    </div>
                  </div>

                  {/* Custom Bar */}
                  <div className="relative h-10 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden shadow-inner">
                    <div
                      className={`h-full ${barColors[index] || barColors[3]} transition-all duration-1000 ease-out rounded-full flex items-center justify-end pr-4 shadow-lg`}
                      style={{ width: `${Math.max(percentage, 5)}%` }}
                    >
                      {percentage > 15 && (
                        <span className="text-white font-semibold">{percentage.toFixed(1)}%</span>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
