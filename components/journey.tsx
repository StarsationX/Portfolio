"use client"

import { useRef, useEffect } from "react"
import { motion, useInView, useAnimation } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const journeyItems = [
  {
    year: "2023",
    title: "Senior Frontend Developer",
    company: "Tech Innovations Inc.",
    description:
      "Led the development of cutting-edge web applications using React and Three.js, focusing on creating immersive user experiences.",
  },
  {
    year: "2021",
    title: "Frontend Developer",
    company: "Digital Solutions Ltd.",
    description: "Developed responsive web applications and implemented modern UI/UX designs using React and Next.js.",
  },
  {
    year: "2019",
    title: "UI/UX Designer",
    company: "Creative Studio",
    description:
      "Created user-centered designs and prototypes for web and mobile applications, focusing on usability and accessibility.",
  },
  {
    year: "2017",
    title: "Web Developer Intern",
    company: "StartUp Hub",
    description:
      "Assisted in the development of websites and web applications, learning modern web development practices.",
  },
]

export default function Journey() {
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
        staggerChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { x: -50, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  }

  return (
    <section id="journey" ref={ref} className="py-20 md:py-32 px-4 sm:px-6 lg:px-8 relative">
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 right-1/3 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
      </div>

      <div className="max-w-5xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">My Journey</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            The path that led me to where I am today, with each step shaping my skills and perspective.
          </p>
        </motion.div>

        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-0 md:left-1/2 top-0 h-full w-px bg-border transform md:-translate-x-px" />

          <motion.div variants={containerVariants} initial="hidden" animate={controls} className="space-y-12">
            {journeyItems.map((item, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className={`relative flex flex-col md:flex-row ${index % 2 === 0 ? "md:flex-row-reverse" : ""}`}
              >
                {/* Timeline dot */}
                <div className="absolute left-0 md:left-1/2 top-6 w-4 h-4 rounded-full bg-primary transform -translate-x-1/2 md:-translate-x-2" />

                {/* Content */}
                <div className={`md:w-1/2 ${index % 2 === 0 ? "md:pl-12" : "md:pr-12"}`}>
                  <Card className="border-primary/10 hover:border-primary/30 transition-all duration-300 overflow-hidden group">
                    {/* Line animation that only crosses the panel */}
                    <div
                      className={`absolute top-0 ${index % 2 === 0 ? "right-0" : "left-0"} w-full h-1 bg-gradient-to-r from-primary/50 to-primary-foreground/50 transform origin-${index % 2 === 0 ? "right" : "left"} scale-x-0 group-hover:scale-x-100 transition-transform duration-500`}
                    />
                    <CardContent className="p-6">
                      <Badge variant="outline" className="mb-2 bg-primary/5">
                        {item.year}
                      </Badge>
                      <h3 className="text-xl font-bold mb-1">{item.title}</h3>
                      <p className="text-primary/80 mb-3">{item.company}</p>
                      <p className="text-muted-foreground">{item.description}</p>
                    </CardContent>
                  </Card>
                </div>

                {/* Empty space for the other side */}
                <div className="hidden md:block md:w-1/2" />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}

