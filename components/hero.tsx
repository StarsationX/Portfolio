"use client"

import { useRef, useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { Environment, PresentationControls, ContactShadows } from "@react-three/drei"
import * as THREE from "three"
import { Button } from "@/components/ui/button"
import { ArrowRight, ChevronRight } from "lucide-react"
import { useTheme } from "next-themes"
import type React from "react"
import type { JSX } from "react/jsx-runtime"

function RubiksCube() {
  const cubeRef = useRef<THREE.Group>(null)
  const [rotation, setRotation] = useState({ x: 0, y: 0, z: 0 })
  const [clicked, setClicked] = useState(false)

  const [moveAnimation, setMoveAnimation] = useState<{
    axis: "x" | "y" | "z"
    layer: number
    direction: number
    progress: number
  } | null>(null)

  const { gl } = useThree()

  // Handle pointer movement for cube rotation
  const handlePointerMove = (event: PointerEvent) => {
    if (!cubeRef.current) return
    const sensitivity = 0.5
    setRotation((prev) => ({
      x: prev.x - event.movementY * sensitivity,
      y: prev.y - event.movementX * sensitivity,
      z: prev.z,
    }))
  }

  const handlePointerDown = (event: React.PointerEvent) => {
    event.preventDefault()
    gl.domElement.setPointerCapture(event.pointerId)
    window.addEventListener("pointermove", handlePointerMove)
    setClicked(true)
  }

  const handlePointerUp = (event: React.PointerEvent) => {
    gl.domElement.releasePointerCapture(event.pointerId)
    window.removeEventListener("pointermove", handlePointerMove)
    setClicked(false)
  }

  // Smooth auto-rotation & layer animation
  useFrame(({ clock }, delta) => {
    if (cubeRef.current && !clicked) {
      const t = clock.getElapsedTime()
      // Use lerp for smooth easing
      cubeRef.current.rotation.y = THREE.MathUtils.lerp(cubeRef.current.rotation.y, Math.sin(t) * 0.5, 0.05)
      cubeRef.current.rotation.x = THREE.MathUtils.lerp(cubeRef.current.rotation.x, Math.sin(t * 0.8) * 0.2, 0.05)
    } else if (cubeRef.current) {
      // When clicked, apply user-controlled rotation
      cubeRef.current.rotation.x = rotation.x
      cubeRef.current.rotation.y = rotation.y
      cubeRef.current.rotation.z = rotation.z

      // Handle layer rotation animation if defined
      if (moveAnimation) {
        const { axis, layer, direction, progress } = moveAnimation
        const rotationSpeed = Math.PI / 2 // 90° rotation
        const animationDuration = 0.5 // seconds

        const newProgress = progress + delta / animationDuration
        if (newProgress >= 1) {
          setMoveAnimation(null)
        } else {
          setMoveAnimation((prev) =>
            prev
              ? {
                  ...prev,
                  progress: newProgress,
                }
              : null,
          )
          // Rotate cubies in the specified layer
          cubeRef.current.children.forEach((child) => {
            const pos = child.position
            const roundedPos = [Math.round(pos.x), Math.round(pos.y), Math.round(pos.z)]
            const layerIndex = axis === "x" ? 0 : axis === "y" ? 1 : 2
            if (roundedPos[layerIndex] === layer) {
              const rotationAmount = rotationSpeed * direction * newProgress
              if (axis === "x") {
                child.rotation.x = rotationAmount
              } else if (axis === "y") {
                child.rotation.y = rotationAmount
              } else {
                child.rotation.z = rotationAmount
              }
            }
          })
        }
      }
    }
  })

  // Create black materials for each face
  const faceMaterials = [
    new THREE.MeshStandardMaterial({ color: "#000000", roughness: 0.3, metalness: 0.8 }), // Right face
    new THREE.MeshStandardMaterial({ color: "#000000", roughness: 0.3, metalness: 0.8 }), // Left face
    new THREE.MeshStandardMaterial({ color: "#000000", roughness: 0.3, metalness: 0.8 }), // Top face
    new THREE.MeshStandardMaterial({ color: "#000000", roughness: 0.3, metalness: 0.8 }), // Bottom face
    new THREE.MeshStandardMaterial({ color: "#000000", roughness: 0.3, metalness: 0.8 }), // Front face
    new THREE.MeshStandardMaterial({ color: "#000000", roughness: 0.3, metalness: 0.8 }), // Back face
  ]

  const Cubie = ({ position }: { position: [number, number, number] }) => {
    return (
      <mesh
        position={position}
        castShadow
        receiveShadow
        scale={[0.95, 0.95, 0.95]}
        material={faceMaterials} // Assign the materials directly to the mesh
      >
        <boxGeometry args={[1, 1, 1]} />
      </mesh>
    )
  }

  // Build a 3x3x3 Rubik's cube (skipping the inner cubie)
  const createCubies = () => {
    const cubies: JSX.Element[] = []
    const positions = [-1, 0, 1]
    positions.forEach((x) => {
      positions.forEach((y) => {
        positions.forEach((z) => {
          // Only add outer cubies
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
      <spotLight position={[5, 5, 5]} angle={0.3} penumbra={1} intensity={3} castShadow shadow-mapSize={[2048, 2048]} />
      <spotLight position={[-5, 5, 5]} angle={0.3} penumbra={1} intensity={2} castShadow />
      <pointLight position={[0, -5, 0]} intensity={1.5} color="#ffffff" />
      <pointLight position={[0, 0, -5]} intensity={3} color="#0000ff" />
      <group
        ref={cubeRef}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerOut={handlePointerUp}
      >
        {createCubies()}
      </group>
    </>
  )
}

function AnimatedBackground() {
  const { theme } = useTheme()
  const bgColor = theme === "light" ? "#ffffff" : "#000000"

  return (
    <Canvas className="w-full h-full" camera={{ position: [5, 2, 5], fov: 50 }} dpr={[1, 2]} shadows>
      <color attach="background" args={[bgColor]} />
      <ambientLight intensity={0.5} />
      <PresentationControls
        global
        rotation={[0, 0, 0]}
        polar={[-Math.PI / 3, Math.PI / 3]}
        azimuth={[-Math.PI / 3, Math.PI / 3]}
        config={{ mass: 2, tension: 400 }}
        snap={{ mass: 4, tension: 300 }}
        style={{ touchAction: "none", pointerEvents: "auto" }}
        zoom={0.8}
        minZoom={0.5}
        maxZoom={1.5}
      >
        <RubiksCube />
      </PresentationControls>
      <ContactShadows position={[0, -2, 0]} opacity={0.7} scale={5} blur={2.5} far={4} />
      <Environment preset="city" />
    </Canvas>
  )
}

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

