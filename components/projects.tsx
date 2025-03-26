"use client"

import { useRef, useState } from "react"
import { motion, useInView, useAnimation } from "framer-motion"
import { useEffect } from "react"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Github, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useMobile } from "@/hooks/use-mobile"

const projects = [
  {
    id: 1,
    title: "Roblox Evade Utils",
    description: "A Lua script that has several features to enhance the gameplay of the game.",
    image: "https://i.imgur.com/fNBQKcV.png?height=400&width=600",
    tags: ["Lua", "Reverse Engineer", "Algorithm"],
    github: "https://github.com/StarsationX/The-Hexation",
    demo: "https://github.com/StarsationX/The-Hexation",
  },
  {
    id: 2,
    title: "The Hexation",
    description:
      "A Lua script hub that has several features to enhance the gameplay of the game.",
    image: "https://i.imgur.com/DgzU8WB.png?height=400&width=600",
    tags: ["Lua", "Reverse Engineer"],
    github: "#",
    demo: "#",
  },
  {
    id: 3,
    title: "Project: Rin",
    description:
      "A Local AI that use text generation webui and Pygmalion 2.7B.",
    image: "https://i.imgur.com/UVhzuiD.png?height=400&width=600",
    tags: ["Node.js", "Python", "AI"],
    github: "#",
    demo: "#",
  },
  {
    id: 4,
    title: "Quick Store Design",
    description: "A quick design that I made in Figma.",
    image: "https://i.imgur.com/5aQU4lK.png?height=400&width=600",
    tags: ["Figma", "UI/UX Design"],
    github: "#",
    demo: "#",
  },
]

function ProjectCard({ project }) {
  const [isFlipped, setIsFlipped] = useState(false)
  const isMobile = useMobile()

  const handleFlip = () => {
    setIsFlipped(!isFlipped)
  }

  return (
    <div
      className="h-full perspective-1000"
      onClick={isMobile ? handleFlip : undefined}
      onMouseEnter={!isMobile ? () => setIsFlipped(true) : undefined}
      onMouseLeave={!isMobile ? () => setIsFlipped(false) : undefined}
    >
      <div
        className={`relative w-full h-full transition-all duration-500 transform-style-3d ${isFlipped ? "rotate-y-180" : ""}`}
      >
        {/* Front of card */}
        <Card className="absolute w-full h-full backface-hidden border-2 border-primary/10 overflow-hidden group">
          <div className="relative h-48 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent z-10" />
            <img
              src={project.image || "/placeholder.svg"}
              alt={project.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
          </div>
          <CardContent className="p-6">
            <h3 className="text-xl font-bold mb-2">{project.title}</h3>
            <p className="text-muted-foreground line-clamp-2">{project.description}</p>
          </CardContent>
          <CardFooter className="px-6 pb-6 pt-0 flex flex-wrap gap-2">
            {project.tags.map((tag, index) => (
              <Badge key={index} variant="secondary" className="bg-secondary/50">
                {tag}
              </Badge>
            ))}
          </CardFooter>
        </Card>

        {/* Back of card */}
        <Card className="absolute w-full h-full backface-hidden rotate-y-180 border-2 border-primary/10 flex flex-col">
          <CardContent className="p-6 flex-1 flex flex-col justify-center items-center text-center">
            <h3 className="text-xl font-bold mb-4">{project.title}</h3>
            <p className="text-muted-foreground mb-6">{project.description}</p>
            <div className="flex gap-4">
            <a href={project.github}>
              <Button size="sm" variant="outline" className="gap-2">
                <Github className="h-4 w-4" />
                Code
              </Button>
            </a>
              <a href={project.demo}>
                <Button size="sm" className="gap-2">
                  <ExternalLink className="h-4 w-4" />
                  Live Demo
                </Button>
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default function Projects() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: false, amount: 0.1 })
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
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 },
    },
  }

  return (
    <section id="projects" ref={ref} className="py-20 md:py-32 px-4 sm:px-6 lg:px-8 bg-muted/30">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Featured Projects</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            A selection of my recent work showcasing my skills and expertise in web development.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={controls}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8"
        >
          {projects.map((project) => (
            <motion.div key={project.id} variants={itemVariants} className="h-[400px]">
              <ProjectCard project={project} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

