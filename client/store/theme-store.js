"use client"

import { create } from 'zustand'
import { useEffect } from 'react'

// Define the theme store with zustand
const useThemeStore = create((set) => ({
    theme: "light", // default theme
    setTheme: (newTheme) => set({ theme: newTheme }),
    toggleTheme: () =>
        set((state) => {
            const newTheme = state.theme === "light" ? "dark" : "light"
            if (typeof window !== 'undefined') {
                localStorage.setItem("theme", newTheme)

                // Update the HTML class for Tailwind dark mode
                if (newTheme === "dark") {
                    document.documentElement.classList.add("dark")
                } else {
                    document.documentElement.classList.remove("dark")
                }
            }
            return { theme: newTheme }
        }),
    initTheme: () => {
        const savedTheme = localStorage.getItem("theme")
        const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches

        let theme = "light"
        if (savedTheme) {
            theme = savedTheme
        } else if (systemPrefersDark) {
            theme = "dark"
        }

        document.documentElement.classList.toggle("dark", theme === "dark")
        set({ theme })
    }
}))

// Hook for components to use
export const useTheme = () => {
    const { theme, setTheme, toggleTheme } = useThemeStore()

    useEffect(() => {
        // Initialize theme from localStorage or system preference
        if (typeof window !== 'undefined') {
            const savedTheme = localStorage.getItem("theme")

            if (savedTheme) {
                setTheme(savedTheme)
                if (savedTheme === "dark") {
                    document.documentElement.classList.add("dark")
                } else {
                    document.documentElement.classList.remove("dark")
                }
            } else {
                // Check system preference
                const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
                setTheme(prefersDark ? "dark" : "light")
                if (prefersDark) {
                    document.documentElement.classList.add("dark")
                }
            }
        }
    }, [setTheme])

    return { theme, toggleTheme }
}

export default useThemeStore 