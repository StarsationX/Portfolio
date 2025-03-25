"use client"

import { useRef, useEffect } from "react"
import { motion, useInView, useAnimation } from "framer-motion"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"

const skills = [
  "React",
  "Next.js",
  "TypeScript",
  "Tailwind CSS",
  "Three.js",
  "Framer Motion",
  "Node.js",
  "GraphQL",
  "UI/UX Design",
  "Responsive Design",
  "WebGL",
  "GSAP",
]

export default function About() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: false, amount: 0.3 })
  const controls = useAnimation()

  useEffect(() => {
    if (isInView) {
      controls.start("visible")
    }
  }, [isInView, controls])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 },
    },
  }

  return (
    <section id="about" ref={ref} className="py-20 md:py-32 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={controls}
          className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center"
        >
          <motion.div variants={itemVariants} className="relative">
            <div className="absolute -inset-4 rounded-xl bg-gradient-to-r from-primary/20 to-primary-foreground/20 blur-xl opacity-70 animate-pulse" />
            <Card className="relative overflow-hidden rounded-xl border-2 border-primary/20">
              <CardContent className="p-0">
                <Image
                  src="/placeholder.svg?height=600&width=600"
                  alt="Developer Portrait"
                  width={600}
                  height={600}
                  className="w-full h-auto object-cover transition-all duration-500 hover:scale-105"
                />
              </CardContent>
            </Card>
          </motion.div>

          <div className="space-y-8">
            <motion.div variants={itemVariants}>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">About Me</h2>
              <TypewriterEffect text="I'm a creative developer passionate about building immersive digital experiences." />
            </motion.div>

            <motion.p variants={itemVariants} className="text-muted-foreground text-lg">
              With a focus on pushing the boundaries of what's possible on the web, I combine technical expertise with
              creative vision to craft memorable user experiences that stand out.
            </motion.p>

            <motion.div variants={itemVariants}>
              <h3 className="text-xl font-semibold mb-4">My Skills</h3>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill, index) => (
                  <Badge
                    key={index}
                    variant="outline"
                    className="px-3 py-1 text-sm bg-background/50 backdrop-blur-sm hover:bg-primary hover:text-primary-foreground transition-all duration-300"
                  >
                    {skill}
                  </Badge>
                ))}
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

function TypewriterEffect({ text }) {
  const [displayText, setDisplayText] = useState("")
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isTyping, setIsTyping] = useState(true)

  useEffect(() => {
    if (currentIndex < text.length && isTyping) {
      const timeout = setTimeout(() => {
        setDisplayText((prev) => prev + text[currentIndex])
        setCurrentIndex((prev) => prev + 1)
      }, 50)

      return () => clearTimeout(timeout)
    } else if (currentIndex >= text.length) {
      setIsTyping(false)
    }
  }, [currentIndex, isTyping, text])

  return (
    <h3 className="text-xl md:text-2xl font-medium text-primary">
      {displayText}
      <span className={`inline-block w-1 h-6 ml-1 bg-primary ${isTyping ? "animate-blink" : ""}`}></span>
    </h3>
  )
}

import { useState } from "react"

