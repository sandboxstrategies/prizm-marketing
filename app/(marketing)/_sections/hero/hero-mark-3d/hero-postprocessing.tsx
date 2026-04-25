/**
 * Local canvas required — global Satūs canvas is ortho+linear, this 3D
 * scene needs perspective+sRGB+tonemapped. Do NOT migrate this back into
 * the tunnel pattern; it'll silently degrade glass / lighting / bloom.
 *
 * Local Bloom composer scoped to the hero canvas. Mirrors the structure of
 * lib/webgl/components/postprocessing/index.ts (raw `postprocessing`
 * package, no @react-three/postprocessing wrapper) but adds an
 * EffectPass(BloomEffect) between RenderPass and CopyPass.
 */

import { useFrame, useThree } from '@react-three/fiber'
import {
  BloomEffect,
  CopyPass,
  EffectComposer,
  EffectPass,
  KernelSize,
  RenderPass,
} from 'postprocessing'
import { useEffect, useRef, useState } from 'react'
import { HalfFloatType } from 'three'

interface HeroPostProcessingProps {
  /** Bloom luminance threshold (0–1). Body should never exceed this. */
  threshold?: number
  /** Bloom intensity multiplier. */
  intensity?: number
}

export function HeroPostProcessing({
  threshold = 0.85,
  intensity = 1.2,
}: HeroPostProcessingProps) {
  const gl = useThree((state) => state.gl)
  const camera = useThree((state) => state.camera)
  const scene = useThree((state) => state.scene)
  const size = useThree((state) => state.size)

  const isWebgl2 = gl.capabilities.isWebGL2
  const maxSamples = gl.capabilities.maxSamples

  const [composer] = useState(
    () =>
      new EffectComposer(gl, {
        multisampling: isWebgl2 ? Math.min(maxSamples, 4) : 0,
        frameBufferType: HalfFloatType,
      })
  )

  const renderPassRef = useRef<RenderPass | null>(null)
  const bloomPassRef = useRef<EffectPass | null>(null)
  const bloomEffectRef = useRef<BloomEffect | null>(null)
  const copyPassRef = useRef<CopyPass | null>(null)

  useEffect(() => {
    const renderPass = new RenderPass(scene, camera)
    const bloomEffect = new BloomEffect({
      luminanceThreshold: threshold,
      luminanceSmoothing: 0.3,
      intensity,
      kernelSize: KernelSize.LARGE,
      mipmapBlur: true,
      radius: 0.5,
    })
    const bloomPass = new EffectPass(camera, bloomEffect)
    const copyPass = new CopyPass()

    renderPassRef.current = renderPass
    bloomPassRef.current = bloomPass
    bloomEffectRef.current = bloomEffect
    copyPassRef.current = copyPass

    composer.addPass(renderPass)
    composer.addPass(bloomPass)
    composer.addPass(copyPass)

    return () => {
      composer.removePass(renderPass)
      composer.removePass(bloomPass)
      composer.removePass(copyPass)
      renderPass.dispose()
      bloomPass.dispose()
      bloomEffect.dispose()
      copyPass.dispose()
    }
  }, [composer, scene, camera, threshold, intensity])

  useEffect(() => {
    return () => {
      composer.dispose()
    }
  }, [composer])

  useEffect(() => {
    composer.setSize(size.width, size.height)
  }, [composer, size])

  useFrame((_, deltaTime) => {
    composer.render(deltaTime)
  }, Number.POSITIVE_INFINITY)

  return null
}
