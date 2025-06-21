"use client"

import { BarChart3, PieChart, TrendingUp, Users } from "lucide-react"

export default function VotingStats({ election }) {
  const totalVotes = election.candidates.reduce((sum, candidate) => sum + candidate.votes, 0)
  const sortedCandidates = [...election.candidates].sort((a, b) => b.votes - a.votes)

  const turnoutRate = election.participants > 0 ? (totalVotes / election.participants) * 100 : 0

  return (
    <div className="grid md:grid-cols-2 gap-6">
      {/* Vote Distribution */}
      <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl border border-white/20 dark:border-gray-700/20 rounded-lg">
        <div className="p-6 pb-2">
          <h3 className="flex items-center gap-2 text-gray-900 dark:text-white text-lg font-semibold">
            <PieChart className="w-5 h-5" />
            Vote Distribution
          </h3>
        </div>
        <div className="p-6 pt-2 space-y-4">
          {sortedCandidates.map((candidate, index) => {
            const percentage = totalVotes > 0 ? (candidate.votes / totalVotes) * 100 : 0
            return (
              <div key={candidate.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-3 h-3 rounded-full ${index === 0
                          ? "bg-blue-500"
                          : index === 1
                            ? "bg-purple-500"
                            : index === 2
                              ? "bg-green-500"
                              : "bg-gray-400"
                        }`}
                    ></div>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">{candidate.name}</span>
                  </div>
                  <span className="text-sm font-bold text-gray-900 dark:text-white">{percentage.toFixed(1)}%</span>
                </div>
                <div className="relative h-2 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
                  <div
                    className="h-full bg-blue-600 transition-all"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Election Analytics */}
      <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl border border-white/20 dark:border-gray-700/20 rounded-lg">
        <div className="p-6 pb-2">
          <h3 className="flex items-center gap-2 text-gray-900 dark:text-white text-lg font-semibold">
            <BarChart3 className="w-5 h-5" />
            Election Analytics
          </h3>
        </div>
        <div className="p-6 pt-2 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
              <Users className="w-6 h-6 text-blue-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-blue-600">{election.participants}</p>
              <p className="text-sm text-blue-600/80">Eligible Voters</p>
            </div>
            <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-xl">
              <TrendingUp className="w-6 h-6 text-green-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-green-600">{turnoutRate.toFixed(1)}%</p>
              <p className="text-sm text-green-600/80">Turnout Rate</p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Voter Participation</span>
              <span className="font-medium text-gray-900 dark:text-white">{turnoutRate.toFixed(1)}%</span>
            </div>
            <div className="relative h-3 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
              <div
                className="h-full bg-blue-600 transition-all"
                style={{ width: `${turnoutRate}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
