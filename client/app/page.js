"use client"

import { useState, useEffect } from "react"
import { Plus, TrendingUp, Users, Search, Award, Shield } from "lucide-react"
import ElectionCard from "@/components/election-card"
import CreateElectionModal from "@/components/create-election-modal"
import StatsCard from "@/components/stats-card"
import useVoteChainStore from "@/store/contract-store"
import toast from "react-hot-toast"

const categories = [
  { id: "all", name: "All Elections", color: "bg-blue-500" },
  { id: "active", name: "Active", color: "bg-green-500" },
  { id: "ended", name: "Ended", color: "bg-red-500" }
]

export default function HomePage() {
  const {
    fetchElections,
    elections,
    loading,
    account,
    createElection,
    contract,
    connectWallet,
    totalElections,
    contractOwner
  } = useVoteChainStore()

  const [filteredElections, setFilteredElections] = useState([])
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true)
      try {
        await fetchElections()
      } catch (error) {
        console.error("Failed to fetch elections:", error)
        toast.error("Failed to load elections")
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [fetchElections])

  useEffect(() => {
    if (!elections) return

    let filtered = [...elections]

    if (searchQuery) {
      filtered = filtered.filter(
        (election) =>
          election.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          election.description.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    const now = Math.floor(Date.now() / 1000)

    if (selectedCategory !== "all") {
      if (selectedCategory === "active") {
        filtered = filtered.filter((election) => Number(election.deadline) > now)
      } else if (selectedCategory === "ended") {
        filtered = filtered.filter((election) => Number(election.deadline) <= now)
      }
    }

    setFilteredElections(filtered)
  }, [elections, searchQuery, selectedCategory])

  const handleCreateElection = async (newElection) => {
    if (!account) {
      toast.error("Please connect your wallet first")
      return
    }

    if (!contract) {
      toast.error("Contract not connected")
      return
    }

    if (account.toLowerCase() !== contractOwner.toLowerCase()) {
      toast.error("You are not the owner of the contract")
      return
    }

    try {
      const {
        title,
        description,
        image,
        candidates,
        deadlineDays,
      } = newElection

      const candidateNames = candidates.map(c => c.name)
      const candidateDescriptions = candidates.map(c => c.description)

      toast.loading("Creating election...", { id: "createElection" })

      await createElection(
        title,
        description,
        image || "https://via.placeholder.com/500",
        candidateNames,
        candidateDescriptions,
        deadlineDays
      )

      toast.success("Election created successfully!", { id: "createElection" })
      await fetchElections()
    } catch (error) {
      console.error("Failed to create election:", error)
      toast.error("Failed to create election", { id: "createElection" })
    }
  }

  // Calculate totals from actual data
  const totalVotes = elections.reduce((sum, election) => {
    // For TheGraph data, we don't have vote counts directly
    // This would require additional queries or contract calls
    return sum + (election.totalVotes || 0)
  }, 0)

  const totalParticipants = elections.length > 0 ? elections.length * 100 : 0 // Placeholder

  const now = Math.floor(Date.now() / 1000)
  const activeElections = elections.filter((e) => Number(e.deadline) > now).length

  if (isLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading VoteChain...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-12">
      <section className="text-center space-y-8">
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-4 py-2 rounded-full text-sm font-medium">
            <Shield className="w-4 h-4" />
            Secured by Ethereum
          </div>
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent font-poppins">
            VoteChain
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Secure, transparent, and decentralized voting platform powered by blockchain technology
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
          <StatsCard
            icon={<Users className="w-6 h-6" />}
            title="Total Elections"
            value={totalElections ? Number(totalElections).toString() : "0"}
            change="+New"
            changeType="positive"
          />
          <StatsCard
            icon={<TrendingUp className="w-6 h-6" />}
            title="Votes Cast"
            value={totalVotes.toString()}
            change="+Daily"
            changeType="positive"
          />
          <StatsCard
            icon={<Award className="w-6 h-6" />}
            title="Active Elections"
            value={activeElections.toString()}
            change="Vote Now"
            changeType="positive"
          />
        </div>
      </section>

      {/* Elections Section */}
      <section className="space-y-6">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">All Elections</h2>

          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            {/* Search */}
            <div className="relative">
              <Search className="absolute z-50 left-3 mt-2 text-gray-400 size-6" />

              <input
                type="text"
                placeholder="Search elections..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-full sm:w-64 bg-white/50 dark:bg-white backdrop-blur-sm h-10 rounded-md border border-gray-200 dark:border-gray-700"
              />
            </div>

            {/* Filters */}
            <div className="flex gap-2 flex-wrap">
              {categories.map((category) => (
                <span
                  key={category.id}
                  className={`inline-flex items-center rounded-md px-2.5 py-1 border-gray-800 dark:text-white text-md font-medium cursor-pointer transition-all duration-200 hover:scale-105 ${selectedCategory === category.id
                    ? `${category.color} text-white`
                    : "border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800"
                    }`}
                  onClick={() => setSelectedCategory(category.id)}
                >
                  {category.name}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Create Election Button */}
        <div className="flex justify-end">
          <button
            onClick={() => {
              if (!account) {
                toast.error("Please connect your wallet first")
                connectWallet("metamask")
              } else {
                if (account.toLowerCase() !== contractOwner.toLowerCase()) {
                  toast.error("You are not the owner of the contract")
                  return
                } else {
                  toast.success("You are the owner of the contract")
                  setIsCreateModalOpen(true)
                }
              }
            }}
            className="inline-flex items-center justify-center rounded-md bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-4 py-2 text-sm font-medium text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Election
          </button>
        </div>

        {/* Elections Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredElections.map((election, index) => (
            <div
              key={election.id}
              className="animate-in slide-in-from-bottom"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <ElectionCard
                election={{
                  id: election.internal_id,
                  title: election.name,
                  description: election.description,
                  deadline: Number(election.deadline) * 1000, // Convert to milliseconds
                  image: election.image,
                  totalVotes: election.totalVotes || 0,
                  category: "governance", // Default category
                  featured: index === 0,
                  trending: index < 2
                }}
                isConnected={!!account}
              />
            </div>
          ))}
        </div>

        {filteredElections.length === 0 && (
          <div className="text-center py-16 space-y-4">
            <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto">
              <Search className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">No elections found</h3>
            <p className="text-gray-500 dark:text-gray-400">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </section>

      {/* Create Election Modal */}
      <CreateElectionModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreateElection={handleCreateElection}
      />
    </div>
  )
}
