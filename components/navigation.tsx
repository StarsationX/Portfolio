"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useMobile } from "@/hooks/use-mobile"

const navItems = [
  { name: "Home", href: "#" },
  { name: "About", href: "#about" },
  { name: "Projects", href: "#projects" },
  { name: "Journey", href: "#journey" },
  { name: "Personal", href: "#personal" },
  { name: "Contact", href: "#contact" },
]

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const [activeSection, setActiveSection] = useState("")
  const isMobile = useMobile()

  const toggleMenu = () => setIsOpen(!isOpen)

  const handleScroll = () => {
    const sections = document.querySelectorAll("section")
    const scrollPosition = window.scrollY + 100

    sections.forEach((section) => {
      const sectionTop = section.offsetTop
      const sectionHeight = section.offsetHeight
      const sectionId = section.getAttribute("id")

      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight && sectionId) {
        setActiveSection(`#${sectionId}`)
      }
    })

    if (scrollPosition < 100) {
      setActiveSection("#")
    }
  }

  useEffect(() => {
    window.addEventListener("scroll", handleScroll)
    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  const handleNavClick = (href) => {
    setIsOpen(false)
    const element = document.querySelector(href)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <>
      {/* Mobile Navigation Button */}
      <div className="fixed top-6 left-6 z-50 md:hidden">
        <Button
          variant="outline"
          size="icon"
          onClick={toggleMenu}
          className="bg-background/80 backdrop-blur-sm border-primary/20"
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </Button>
      </div>

      {/* Desktop Navigation */}
      <nav className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50 hidden md:block">
        <div className="bg-background/80 backdrop-blur-sm rounded-full border border-primary/20 p-1 shadow-lg">
          <ul className="flex items-center space-x-1">
            {navItems.map((item) => (
              <li key={item.name}>
                <Button
                  variant="ghost"
                  className={`relative px-4 py-2 rounded-full text-sm ${
                    activeSection === item.href ? "text-primary font-medium" : "text-muted-foreground"
                  }`}
                  onClick={() => handleNavClick(item.href)}
                >
                  {activeSection === item.href && (
                    <motion.div
                      layoutId="activeSection"
                      className="absolute inset-0 bg-primary/10 rounded-full"
                      initial={false}
                      transition={{ type: "spring", duration: 0.6 }}
                    />
                  )}
                  <span className="relative z-10">{item.name}</span>
                </Button>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      {/* Mobile Navigation Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: "-100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "-100%" }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 bg-background/95 backdrop-blur-md md:hidden"
          >
            <div className="flex flex-col items-center justify-center h-full">
              <ul className="flex flex-col items-center space-y-6">
                {navItems.map((item) => (
                  <li key={item.name}>
                    <Button
                      variant="ghost"
                      className={`text-2xl font-medium ${
                        activeSection === item.href ? "text-primary" : "text-muted-foreground"
                      }`}
                      onClick={() => handleNavClick(item.href)}
                    >
                      {item.name}
                    </Button>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

