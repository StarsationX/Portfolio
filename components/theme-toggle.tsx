"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTheme } from "next-themes"

export default function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <Button
        variant="outline"
        size="icon"
        className="relative overflow-hidden rounded-full bg-background/80 backdrop-blur-sm border-primary/20"
        aria-label="Toggle theme"
      >
        <div className="relative z-10">
          <Sun className="h-5 w-5" />
        </div>
      </Button>
    )
  }

  const toggleTheme = () => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark")
  }

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={toggleTheme}
      className="relative overflow-hidden rounded-full bg-background/80 backdrop-blur-sm border-primary/20"
      aria-label={`Switch to ${resolvedTheme === "dark" ? "light" : "dark"} theme`}
    >
      <div className="relative z-10">
        {resolvedTheme === "dark" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
      </div>
      <motion.div
        className="absolute inset-0 bg-primary"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: resolvedTheme === "dark" ? 1.5 : 0, opacity: resolvedTheme === "dark" ? 0.1 : 0 }}
        transition={{ duration: 0.5 }}
      />
    </Button>
  )
}

