/**
 * Local canvas required — global Satūs canvas is ortho+linear, this 3D
 * scene needs perspective+sRGB+tonemapped. Do NOT migrate this back into
 * the tunnel pattern; it'll silently degrade glass / lighting / bloom.
 */

'use client'

import { PerspectiveCamera } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import { useEffect, useState } from 'react'
import { ACESFilmicToneMapping, type ColorSpace, type ToneMapping } from 'three'
import { PrismMark } from '@/components/ui/prism-mark'
import { useDeviceDetection } from '@/lib/hooks/use-device-detection'
import { HeroPostProcessing } from './hero-postprocessing'
import { PenrosePrism } from './penrose-prism'

/**
 * Volumetric Penrose hero mark. Branches:
 *   - !hasGPU || isReducedMotion → SVG PrismMark fallback (no WebGL load).
 *   - mobile w/ GPU → WebGL with reduced sample budget.
 *   - desktop w/ GPU → full quality.
 *
 * Mounts a *local* WebGL canvas dedicated to the hero. The global Satūs
 * canvas (ortho/linear/flat for AnimatedGradient on FinalCta) continues
 * unchanged in parallel. See header comment in penrose-prism.tsx.
 */
export function HeroMark3D() {
  const { hasGPU, isReducedMotion, isMobile } = useDeviceDetection()

  // Avoid hydration mismatch — SSR renders the SVG; client decides on mount.
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  // Dev-only force-fallback toggle for fallback verification screenshots.
  const [forceFallback, setForceFallback] = useState(false)
  useEffect(() => {
    if (process.env.NODE_ENV !== 'development') return
    const params = new URLSearchParams(window.location.search)
    if (params.get('fallback') === '1') setForceFallback(true)
  }, [])

  if (!mounted || forceFallback || !hasGPU || isReducedMotion) {
    return (
      <PrismMark
        size={460}
        variant="hero-placeholder"
        showSpiral
        style={{ width: '100%', height: '100%' }}
        aria-hidden="true"
      />
    )
  }

  return (
    <Canvas
      gl={{
        outputColorSpace: 'srgb' satisfies ColorSpace,
        toneMapping: ACESFilmicToneMapping satisfies ToneMapping,
        toneMappingExposure: 1.0,
        antialias: true,
        alpha: true,
      }}
      dpr={[1, 2]}
      style={{ width: '100%', height: '100%' }}
    >
      <PerspectiveCamera
        makeDefault
        fov={35}
        position={[0, 0, 4.5]}
        near={0.1}
        far={20}
      />
      <PenrosePrism isMobile={isMobile ?? false} />
      <HeroPostProcessing />
    </Canvas>
  )
}
