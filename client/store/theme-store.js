"use client"

import { create } from 'zustand'
import { useEffect } from 'react'

const useThemeStore = create((set) => ({
    theme: "light",
    setTheme: (newTheme) => {
        if (typeof window !== 'undefined') {
            localStorage.setItem("theme", newTheme)

            if (newTheme === "dark") {
                document.documentElement.classList.add("dark")
            } else {
                document.documentElement.classList.remove("dark")
            }
        }
        set({ theme: newTheme })
    },
    toggleTheme: () =>
        set((state) => {
            const newTheme = state.theme === "light" ? "dark" : "light"
            if (typeof window !== 'undefined') {
                localStorage.setItem("theme", newTheme)

                if (newTheme === "dark") {
                    document.documentElement.classList.add("dark")
                } else {
                    document.documentElement.classList.remove("dark")
                }
            }
            return { theme: newTheme }
        })
}))

// Hook for components to use
export const useTheme = () => {
    const { theme, setTheme, toggleTheme } = useThemeStore()

    useEffect(() => {

        if (typeof window !== 'undefined') {
            const savedTheme = localStorage.getItem("theme")
            const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches

            if (savedTheme) {
                setTheme(savedTheme)
            } else if (systemPrefersDark) {
                setTheme("dark")
            }
        }
    }, [setTheme])

    return { theme, toggleTheme }
}

export default useThemeStore 