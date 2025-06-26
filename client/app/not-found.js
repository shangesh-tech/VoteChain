"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { FileX, Home, ArrowLeft } from "lucide-react"

export default function NotFound() {
    const router = useRouter()

    return (
        <div className="min-h-[80vh] flex items-center justify-center">
            <div className="text-center space-y-8 max-w-lg px-6">
                <div className="flex flex-col items-center justify-center gap-4">
                    <div className="w-24 h-24 bg-red-50 dark:bg-red-900/20 rounded-full flex items-center justify-center">
                        <FileX className="w-12 h-12 text-red-500" />
                    </div>

                    <div>
                        <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-red-600 via-pink-500 to-red-500 bg-clip-text text-transparent font-poppins mt-4">
                            404
                        </h1>
                        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mt-2">
                            Page Not Found
                        </h2>
                        <p className="text-gray-600 dark:text-gray-300 mt-4">
                            The page you are looking for doesn&apos;t exist or has been moved.
                        </p>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <button
                        onClick={() => router.back()}
                        className="inline-flex items-center justify-center rounded-md bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border border-gray-200 dark:border-gray-700 px-6 py-3 text-sm font-medium text-gray-800 dark:text-gray-200 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-all w-full sm:w-auto"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Go Back
                    </button>
                    <Link
                        href="/"
                        className="inline-flex items-center justify-center rounded-md bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-6 py-3 text-sm font-medium text-white shadow-lg hover:shadow-xl transition-all transform hover:scale-105 w-full sm:w-auto"
                    >
                        <Home className="w-4 h-4 mr-2" />
                        Back to Home
                    </Link>
                </div>
            </div>
        </div>
    )
} 