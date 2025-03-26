"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import dynamic from "next/dynamic"
import { Button } from "@/components/ui/button"
import { ArrowRight, ChevronRight } from "lucide-react"
import { useTheme } from "next-themes"

// Dynamically import the 3D components with no SSR
const AnimatedBackground = dynamic(() => import("./animated-background"), {
  ssr: false,
  loading: () => <div className="w-full h-full bg-black/10 rounded-lg animate-pulse" />,
})

export default function Hero() {
  const { theme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // After mounting, we have access to the theme
  useEffect(() => {
    setMounted(true)
  }, [])

  const scrollToProjects = () => {
    const projectsSection = document.getElementById("projects")
    if (projectsSection) {
      projectsSection.scrollIntoView({ behavior: "smooth" })
    }
  }

  const scrollToContact = () => {
    const contactSection = document.getElementById("contact")
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: "smooth" })
    }
  }

  // Use a safe theme value (only use theme after mounting)
  const currentTheme = mounted ? theme : "dark" // Default to dark to match server render

  // Determine text color based on theme
  const textColorClass = currentTheme === "light" ? "text-gray-900" : "text-white"
  const textMutedClass = currentTheme === "light" ? "text-gray-600" : "text-gray-400"
  const buttonOutlineClass =
    currentTheme === "light"
      ? "border-gray-300 text-gray-900 hover:bg-gray-100"
      : "border-gray-700 text-white hover:bg-gray-800"
  const bgClass = currentTheme === "light" ? "bg-white" : "bg-black"

  return (
    <section className={`relative min-h-screen w-full ${bgClass} overflow-hidden`} suppressHydrationWarning>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="h-[400px] md:h-[500px] lg:h-[600px] w-full order-1 lg:order-2"
          >
            {mounted && <AnimatedBackground />}
          </motion.div>
          <div className="space-y-8 order-2 lg:order-1">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary/10 text-primary"
            >
              <span>Portfolio Launch</span>
              <ChevronRight className="ml-1 h-4 w-4" />
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className={`text-5xl md:text-6xl lg:text-7xl font-bold ${textColorClass}`}
              suppressHydrationWarning
            >
              Starsation's
              <br />
              Portfolio
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className={`text-xl ${textMutedClass} max-w-lg`}
              suppressHydrationWarning
            >
              I'm just a Lua and Cpp enjoyer that just got in to WebDev
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-wrap gap-4"
            >
              <Button size="lg" className="rounded-full px-6 group" onClick={scrollToProjects}>
                View My Work
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                className={`rounded-full px-6 ${buttonOutlineClass}`}
                onClick={scrollToContact}
                suppressHydrationWarning
              >
                Contact Me
              </Button>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}

