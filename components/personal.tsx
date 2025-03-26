"use client"

import { useRef, useEffect, useState } from "react"
import { motion, useInView, useAnimation } from "framer-motion"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Heart } from "lucide-react"

export default function Personal() {
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
    <section
      id="personal"
      ref={ref}
      className="py-20 md:py-32 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-background to-muted/30"
    >
      <div className="max-w-5xl mx-auto">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={controls}
          className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center"
        >
          <motion.div variants={itemVariants} className="order-2 md:order-1">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">My Inspiration</h2>
            <p className="text-lg text-muted-foreground mb-6">
              Behind every creative mind is a source of inspiration. For me, it's my wonderful girlfriend who supports
              me through every challenge and celebrates every success.
            </p>
            <p className="text-lg text-muted-foreground mb-6">
              Her creativity, patience, and unwavering belief in my abilities have been instrumental in my journey as a
              developer.
            </p>
            <div className="flex items-center gap-2">
              <Heart className="h-6 w-6 text-red-500 animate-pulse" />
              <span className="text-primary font-medium">Forever grateful for her support</span>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="order-1 md:order-2">
            <div className="relative group">
              <div className="absolute -inset-4 rounded-xl bg-gradient-to-r from-pink-500/20 to-purple-500/20 blur-xl opacity-70 group-hover:opacity-100 transition-opacity duration-500" />
              <Card className="relative overflow-hidden rounded-xl border-2 border-primary/20">
                <CardContent className="p-0">
                  <div className="relative">
                    <Image
                      src="https://i.imgur.com/G3Cnaj0.jpeg?height=600&width=600"
                      alt="Couple Photo"
                      width={600}
                      height={600}
                      className="w-full h-auto object-cover transition-all duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end justify-center pb-8">
                      <FloatingHearts />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

function FloatingHearts() {
  // Use useState with a fixed seed to ensure consistent rendering between server and client
  const [hearts] = useState(() => {
    // Fixed seed data to prevent hydration mismatch
    return [
      { id: 1, x: 12, delay: 0.5, size: 22 },
      { id: 2, x: 67, delay: 1.2, size: 11 },
      { id: 3, x: 48, delay: 2.3, size: 28 },
      { id: 4, x: 81, delay: 0.8, size: 25 },
      { id: 5, x: 52, delay: 1.5, size: 23 },
      { id: 6, x: 63, delay: 2.7, size: 14 },
      { id: 7, x: 42, delay: 1.8, size: 22 },
      { id: 8, x: 53, delay: 0.9, size: 14 },
      { id: 9, x: 38, delay: 2.2, size: 18 },
      { id: 10, x: 7, delay: 1.1, size: 18 },
    ]
  })

  return (
    <div className="relative w-full h-32">
      {hearts.map((heart) => (
        <motion.div
          key={heart.id}
          className="absolute bottom-0"
          style={{ left: `${heart.x}%` }}
          initial={{ y: 0, opacity: 0 }}
          animate={{
            y: -100,
            opacity: [0, 1, 0],
            x: heart.x > 50 ? 20 : -20,
          }}
          transition={{
            duration: 3,
            repeat: Number.POSITIVE_INFINITY,
            delay: heart.delay,
            ease: "easeOut",
          }}
        >
          <Heart className="text-red-500" style={{ width: heart.size, height: heart.size }} fill="currentColor" />
        </motion.div>
      ))}
    </div>
  )
}

