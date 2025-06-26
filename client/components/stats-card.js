import { TrendingUp, TrendingDown } from "lucide-react"

export default function StatsCard({ icon, title, value, change, changeType }) {
  return (
    <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl border border-white/20 dark:border-gray-700/20 hover:shadow-lg transition-all duration-300 transform hover:scale-105 rounded-lg">
      <div className="p-6 text-center space-y-4">
        <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 rounded-2xl flex items-center justify-center mx-auto text-blue-600 dark:text-blue-400">
          {icon}
        </div>

        <div className="space-y-2">
          <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide">{title}</h3>
          <p className="text-3xl font-bold text-gray-900 dark:text-white font-poppins">{value}</p>

          {change && (
            <div
              className={`flex items-center justify-center gap-1 text-sm ${changeType === "positive" ? "text-green-600" : "text-red-600"
                }`}
            >
              {changeType === "positive" ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
              <span className="font-medium">{change}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
