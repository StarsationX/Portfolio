"use client"

import type React from "react"

import { useRef, useState } from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { Environment, PresentationControls, ContactShadows } from "@react-three/drei"
import * as THREE from "three"
import { useTheme } from "next-themes"
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

export default function AnimatedBackground() {
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

