"use client"

import { useState } from "react"
import { Plus, Trash2, Calendar, Users, FileText, ImageIcon, X, ChevronDown } from "lucide-react"
import toast from "react-hot-toast"
import useVoteChainStore from "@/store/contract-store"

export default function CreateElectionModal({ isOpen, onClose, onCreateElection }) {
  const { contract } = useVoteChainStore()
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    imageUrl: "",
    deadlineDays: 7,
    category: "governance",
    candidates: [
      { name: "", description: "" },
      { name: "", description: "" },
    ],
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectOpen, setSelectOpen] = useState(false)

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleCandidateChange = (index, field, value) => {
    setFormData((prev) => ({
      ...prev,
      candidates: prev.candidates.map((candidate, i) => (i === index ? { ...candidate, [field]: value } : candidate)),
    }))
  }

  const addCandidate = () => {
    if (formData.candidates.length >= 10) {
      toast.error("Maximum of 10 candidates allowed")
      return
    }

    setFormData((prev) => ({
      ...prev,
      candidates: [...prev.candidates, { name: "", description: "" }],
    }))
  }

  const removeCandidate = (index) => {
    if (formData.candidates.length <= 2) {
      toast.error("Minimum of 2 candidates required")
      return
    }

    setFormData((prev) => ({
      ...prev,
      candidates: prev.candidates.filter((_, i) => i !== index),
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Validation
      if (!formData.title.trim()) {
        toast.error("Please enter an election title")
        setIsSubmitting(false)
        return
      }

      if (!formData.description.trim()) {
        toast.error("Please enter an election description")
        setIsSubmitting(false)
        return
      }

      if (formData.deadlineDays < 1 || formData.deadlineDays > 7) {
        toast.error("Election duration must be between 1 and 7 days")
        setIsSubmitting(false)
        return
      }

      const validCandidates = formData.candidates.filter((c) => c.name.trim())
      if (validCandidates.length < 2) {
        toast.error("Please add at least 2 candidates with names")
        setIsSubmitting(false)
        return
      }

      if (validCandidates.length > 10) {
        toast.error("Maximum of 10 candidates allowed")
        setIsSubmitting(false)
        return
      }

      if (formData.candidates.some((c) => !c.name.trim())) {
        toast.error("Please enter a name for all candidates")
        setIsSubmitting(false)
        return
      }

      // Create election
      const deadline = new Date()
      deadline.setDate(deadline.getDate() + Number(formData.deadlineDays))

      const newElection = {
        title: formData.title,
        description: formData.description,
        image: formData.imageUrl || "/placeholder.svg?height=300&width=500",
        deadline: deadline,
        category: formData.category,
        candidates: formData.candidates.filter((c) => c.name.trim()),
        deadlineDays: formData.deadlineDays
      }

      await onCreateElection(newElection)

      // Reset form
      setFormData({
        title: "",
        description: "",
        imageUrl: "",
        deadlineDays: 7,
        category: "governance",
        candidates: [
          { name: "", description: "" },
          { name: "", description: "" },
        ],
      })

      onClose()
    } catch (error) {
      toast.error(`Error creating election: ${error.message || "Unknown error"}`)
      console.error(error)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="max-w-4xl max-h-[90vh] overflow-y-auto bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border border-white/20 dark:border-gray-700/20 rounded-lg shadow-xl p-6 m-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent font-poppins">
            Create New Election
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label htmlFor="title" className="flex items-center gap-2 text-gray-700 dark:text-gray-300 text-sm font-medium">
                  <FileText className="w-4 h-4" />
                  Election Title *
                </label>
                <input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  placeholder="Enter election title"
                  className="mt-2 bg-white/50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-md w-full px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label htmlFor="category" className="flex items-center gap-2 text-gray-700 dark:text-gray-300 text-sm font-medium">
                  <Users className="w-4 h-4" />
                  Category
                </label>
                <div className="relative mt-2">
                  <button
                    type="button"
                    onClick={() => setSelectOpen(!selectOpen)}
                    className="flex items-center justify-between w-full bg-white/50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-md px-3 py-2 text-sm text-left focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <span>{formData.category.charAt(0).toUpperCase() + formData.category.slice(1)}</span>
                    <ChevronDown className="w-4 h-4" />
                  </button>

                  {selectOpen && (
                    <div className="absolute z-10 mt-1 w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg">
                      <div className="py-1">
                        {["governance", "community", "policy"].map((category) => (
                          <button
                            key={category}
                            type="button"
                            className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
                            onClick={() => {
                              handleInputChange("category", category);
                              setSelectOpen(false);
                            }}
                          >
                            {category.charAt(0).toUpperCase() + category.slice(1)}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label htmlFor="deadlineDays" className="flex items-center gap-2 text-gray-700 dark:text-gray-300 text-sm font-medium">
                  <Calendar className="w-4 h-4" />
                  Election Duration (days) *
                </label>
                <input
                  id="deadlineDays"
                  type="number"
                  min="1"
                  max="7"
                  value={formData.deadlineDays}
                  onChange={(e) => handleInputChange("deadlineDays", e.target.value)}
                  className="mt-2 bg-white/50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-md w-full px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  Smart contract limits duration between 1-7 days
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label htmlFor="description" className="flex items-center gap-2 text-gray-700 dark:text-gray-300 text-sm font-medium">
                  <FileText className="w-4 h-4" />
                  Description *
                </label>
                <textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  placeholder="Describe what this election is about"
                  rows={4}
                  className="mt-2 bg-white/50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-md w-full px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label htmlFor="imageUrl" className="flex items-center gap-2 text-gray-700 dark:text-gray-300 text-sm font-medium">
                  <ImageIcon className="w-4 h-4" />
                  Banner Image URL (optional)
                </label>
                <input
                  id="imageUrl"
                  value={formData.imageUrl}
                  onChange={(e) => handleInputChange("imageUrl", e.target.value)}
                  placeholder="https://example.com/image.jpg"
                  className="mt-2 bg-white/50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-md w-full px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Candidates */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <label className="text-xl font-semibold text-gray-900 dark:text-white">Candidates (2-10)*</label>
              <button
                type="button"
                onClick={addCandidate}
                className="inline-flex items-center justify-center rounded-md border border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-800/50 px-3 py-1.5 text-sm font-medium text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={formData.candidates.length >= 10}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Candidate
              </button>
            </div>

            <div className="grid gap-6">
              {formData.candidates.map((candidate, index) => (
                <div
                  key={index}
                  className="bg-white/30 dark:bg-gray-800/30 backdrop-blur-sm border border-white/20 dark:border-gray-700/20 rounded-2xl p-6 space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-gray-900 dark:text-white">Candidate {index + 1}</span>
                    <button
                      type="button"
                      onClick={() => removeCandidate(index)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 p-1 rounded-md"
                      disabled={formData.candidates.length <= 2}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor={`candidate-name-${index}`} className="text-gray-700 dark:text-gray-300 text-sm font-medium">
                        Name *
                      </label>
                      <input
                        id={`candidate-name-${index}`}
                        value={candidate.name}
                        onChange={(e) => handleCandidateChange(index, "name", e.target.value)}
                        placeholder="Candidate name"
                        className="mt-1 bg-white/50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-md w-full px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label htmlFor={`candidate-description-${index}`} className="text-gray-700 dark:text-gray-300 text-sm font-medium">
                        Description
                      </label>
                      <textarea
                        id={`candidate-description-${index}`}
                        value={candidate.description}
                        onChange={(e) => handleCandidateChange(index, "description", e.target.value)}
                        placeholder="Brief description of the candidate"
                        rows={2}
                        className="mt-1 bg-white/50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-md w-full px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 inline-flex items-center justify-center rounded-md border border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-800/50 px-4 py-2 text-sm font-medium text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 inline-flex items-center justify-center rounded-md bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-4 py-2 text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              disabled={isSubmitting || !contract}
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Creating...
                </div>
              ) : (
                "Create Election"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
