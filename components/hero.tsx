"use client"

import { useRef, useState } from "react"
import { motion } from "framer-motion"
import { Canvas, useFrame } from "@react-three/fiber"
import { Environment, PresentationControls, ContactShadows } from "@react-three/drei"
import { Button } from "@/components/ui/button"
import { ArrowRight, ChevronRight } from "lucide-react"

// Rubik's Cube component
function RubiksCube() {
  const cubeRef = useRef()
  const [clicked, setClicked] = useState(false)
  const lightRef = useRef()

  // Helper to visualize the light (only in development)
  // useHelper(lightRef, THREE.SpotLightHelper, 'cyan')

  // Gentle rotation animation
  useFrame(({ clock }) => {
    if (cubeRef.current && !clicked) {
      const t = clock.getElapsedTime() * 0.2
      cubeRef.current.rotation.y = Math.sin(t) * 0.5
      cubeRef.current.rotation.x = Math.sin(t * 0.8) * 0.2
    }
  })

  // Create a single cubie (small cube)
  const Cubie = ({ position }) => {
    return (
      <mesh position={position} castShadow receiveShadow>
        <boxGeometry args={[0.95, 0.95, 0.95]} />
        <meshStandardMaterial color="#111111" roughness={0.3} metalness={0.8} />
      </mesh>
    )
  }

  // Create a 3x3x3 Rubik's Cube
  const createCubies = () => {
    const cubies = []
    const positions = [-1, 0, 1]

    positions.forEach((x) => {
      positions.forEach((y) => {
        positions.forEach((z) => {
          // Skip the inner cube (not visible)
          if (Math.abs(x) !== 0 || Math.abs(y) !== 0 || Math.abs(z) !== 0) {
            cubies.push(<Cubie key={`${x}-${y}-${z}`} position={[x, y, z]} />)
          }
        })
      })
    })

    return cubies
  }

  return (
    <>
      {/* Add dramatic lighting */}
      <spotLight
        ref={lightRef}
        position={[5, 5, 5]}
        angle={0.3}
        penumbra={0.8}
        intensity={1.5}
        castShadow
        shadow-mapSize={[2048, 2048]}
      />
      <spotLight position={[-5, 5, 5]} angle={0.3} penumbra={0.8} intensity={0.8} castShadow />
      <group ref={cubeRef} onPointerDown={() => setClicked(!clicked)}>
        {createCubies()}
      </group>
    </>
  )
}

function AnimatedBackground() {
  return (
    <Canvas
      className="w-full h-full"
      camera={{ position: [5, 2, 5], fov: 50 }}
      dpr={[1, 2]} // Optimize for performance and quality
      shadows
    >
      <color attach="background" args={["#000000"]} />
      <ambientLight intensity={0.2} />

      {/* Make the entire scene interactive with PresentationControls */}
      <PresentationControls
        global
        rotation={[0, 0, 0]}
        polar={[-Math.PI / 3, Math.PI / 3]} // Limit vertical rotation
        azimuth={[-Math.PI / 3, Math.PI / 3]} // Limit horizontal rotation
        config={{ mass: 2, tension: 400 }}
        snap={{ mass: 4, tension: 300 }}
        style={{ touchAction: "none" }} // Fix touch action for mobile
        // Add constraints to prevent the cube from going out of view
        zoom={0.8}
        minZoom={0.5}
        maxZoom={1.5}
      >
        <RubiksCube />
      </PresentationControls>

      <ContactShadows position={[0, -2, 0]} opacity={0.5} scale={5} blur={2.5} />
      <Environment preset="night" />
    </Canvas>
  )
}

export default function Hero() {
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

  return (
    <section className="relative min-h-screen w-full bg-black overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
        {/* Reverse order on mobile, normal on desktop */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* 3D Cube - will appear first on mobile */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="h-[400px] md:h-[500px] lg:h-[600px] w-full order-1 lg:order-2"
          >
            <AnimatedBackground />
          </motion.div>

          {/* Content - will appear second on mobile */}
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
              className="text-5xl md:text-6xl lg:text-7xl font-bold text-white"
            >
              Creative
              <br />
              Developer
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-xl text-gray-400 max-w-lg"
            >
              Crafting immersive digital experiences that push the boundaries of web development.
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
                className="rounded-full px-6 border-gray-700 text-white hover:bg-gray-800"
                onClick={scrollToContact}
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

