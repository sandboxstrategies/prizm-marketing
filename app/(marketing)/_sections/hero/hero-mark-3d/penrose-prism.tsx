/**
 * Local canvas required — global Satūs canvas is ortho+linear, this 3D
 * scene needs perspective+sRGB+tonemapped. Do NOT migrate this back into
 * the tunnel pattern; it'll silently degrade glass / lighting / bloom.
 */

'use client'

import { Environment, MeshTransmissionMaterial } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { Suspense, useEffect, useRef, useState } from 'react'
import {
  AdditiveBlending,
  type BufferGeometry,
  type Group,
  MathUtils,
  MeshBasicMaterial,
} from 'three'
import { buildPenroseMesh } from './penrose-geometry'

interface PenrosePrismProps {
  /** Reduced GPU budget for mobile (transmission samples, resolution). */
  isMobile?: boolean
}

export function PenrosePrism({ isMobile = false }: PenrosePrismProps) {
  const groupRef = useRef<Group>(null)

  // Build the geometry exactly once. React Compiler can't handle class
  // instantiation in render, hence the useRef pattern (per CLAUDE.md
  // "exception for class/object instantiation").
  const meshRef = useRef<{
    body: BufferGeometry
    seam: BufferGeometry
    bodyTriCount: number
    seamSegmentCount: number
  } | null>(null)
  if (!meshRef.current) {
    const built = buildPenroseMesh({ depth: 0.6 })
    meshRef.current = {
      body: built.bodyGeometry,
      seam: built.seamGeometry,
      bodyTriCount: built.bodyTriCount,
      seamSegmentCount: built.seamSegmentCount,
    }
  }

  const seamMaterialRef = useRef<MeshBasicMaterial | null>(null)
  if (!seamMaterialRef.current) {
    seamMaterialRef.current = new MeshBasicMaterial({
      vertexColors: true,
      toneMapped: false,
      blending: AdditiveBlending,
      transparent: true,
      depthWrite: false,
    })
  }

  // Dev-only rotation freeze for screenshot capture (per-round screenshot
  // matrix needs deterministic angles).
  const [rotOverride, setRotOverride] = useState<number | null>(null)
  useEffect(() => {
    if (process.env.NODE_ENV !== 'development') return
    const params = new URLSearchParams(window.location.search)
    const rot = params.get('rot')
    if (rot !== null && !Number.isNaN(Number(rot))) {
      setRotOverride((Number(rot) * Math.PI) / 180)
    }
  }, [])

  // Cleanup on unmount.
  useEffect(() => {
    const mesh = meshRef.current
    const seamMat = seamMaterialRef.current
    return () => {
      mesh?.body.dispose()
      mesh?.seam.dispose()
      seamMat?.dispose()
    }
  }, [])

  // Constant tilt — set once on mount.
  useEffect(() => {
    if (groupRef.current) {
      groupRef.current.rotation.z = MathUtils.degToRad(8)
    }
  }, [])

  useFrame(({ clock }) => {
    const group = groupRef.current
    if (!group) return
    const t = clock.elapsedTime
    if (rotOverride !== null) {
      group.rotation.y = rotOverride
      group.position.y = 0
    } else {
      group.rotation.y = (t * Math.PI * 2) / 30
      group.position.y = Math.sin((t * Math.PI * 2) / 6) * 0.05
    }
  })

  const samples = isMobile ? 6 : 10
  const resolution = isMobile ? 512 : 1024

  return (
    <>
      {/* Three-point lighting */}
      <ambientLight intensity={0.05} />
      <directionalLight position={[2, 3, 4]} intensity={2.5} color="#00cfee" />
      <directionalLight
        position={[-3, 0.5, 2]}
        intensity={1.0}
        color="#7c4ff5"
      />
      <directionalLight position={[0, 2, -3]} intensity={1.5} color="#00cfee" />

      {/* HDR studio environment — soft fill on the glass body. Suspends
          while drei lazy-loads the HDR map; hero copy/CTAs aren't blocked. */}
      <Suspense fallback={null}>
        <Environment
          preset="studio"
          background={false}
          environmentIntensity={0.3}
        />
      </Suspense>

      <group ref={groupRef}>
        <mesh geometry={meshRef.current.body}>
          <MeshTransmissionMaterial
            transmission={0.95}
            thickness={0.4}
            ior={1.6}
            chromaticAberration={0.2}
            anisotropicBlur={0.1}
            roughness={0.05}
            distortion={0}
            distortionScale={0}
            temporalDistortion={0}
            samples={samples}
            resolution={resolution}
            backside={false}
            color="#0a0c16"
            attenuationColor="#7c4ff5"
            attenuationDistance={0.8}
          />
        </mesh>
        <lineSegments
          geometry={meshRef.current.seam}
          material={seamMaterialRef.current}
        />
      </group>
    </>
  )
}
