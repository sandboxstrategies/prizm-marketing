/**
 * Local canvas required — global Satūs canvas is ortho+linear, this 3D
 * scene needs perspective+sRGB+tonemapped. Do NOT migrate this back into
 * the tunnel pattern; it'll silently degrade glass / lighting / bloom.
 */

import { Color } from 'three'

interface Stop {
  y: number
  hex: string
  intensity: number
}

const STOPS: Stop[] = [
  { y: 0.0, hex: '#00cfee', intensity: 1.8 },
  { y: 0.22, hex: '#3b6cf5', intensity: 1.6 },
  { y: 0.5, hex: '#7c4ff5', intensity: 1.6 },
  { y: 0.75, hex: '#ff5c8a', intensity: 1.6 },
  { y: 1.0, hex: '#ffaa44', intensity: 1.4 },
]

interface PrecomputedStop {
  y: number
  r: number
  g: number
  b: number
}

const PRECOMPUTED: PrecomputedStop[] = STOPS.map((s) => {
  const c = new Color(s.hex)
  return {
    y: s.y,
    r: c.r * s.intensity,
    g: c.g * s.intensity,
    b: c.b * s.intensity,
  }
})

export interface RGB {
  r: number
  g: number
  b: number
}

/**
 * Sample the spectrum at normalized Y (0 = apex / cyan, 1 = base / ember).
 * Output values are in linear space and may exceed 1.0 (intensity multiplier
 * boosts past unit luminance so they trigger bloom).
 */
export function colorAtY(yNorm: number): RGB {
  const y = Math.max(0, Math.min(1, yNorm))

  for (let i = 0; i < PRECOMPUTED.length - 1; i++) {
    const a = PRECOMPUTED[i]
    const b = PRECOMPUTED[i + 1]
    if (!(a && b)) continue
    if (y >= a.y && y <= b.y) {
      const span = b.y - a.y
      const t = span === 0 ? 0 : (y - a.y) / span
      return {
        r: a.r + (b.r - a.r) * t,
        g: a.g + (b.g - a.g) * t,
        b: a.b + (b.b - a.b) * t,
      }
    }
  }

  const last = PRECOMPUTED[PRECOMPUTED.length - 1]
  return last ? { r: last.r, g: last.g, b: last.b } : { r: 1, g: 1, b: 1 }
}
