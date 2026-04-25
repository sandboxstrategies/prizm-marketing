export const PHI = (1 + Math.sqrt(5)) / 2

export type TriangleKind = 'acute' | 'obtuse'

export interface Pt {
  x: number
  y: number
}

export interface Tri {
  kind: TriangleKind
  a: Pt
  b: Pt
  c: Pt
}

function lerp(p: Pt, q: Pt, t: number): Pt {
  return { x: p.x + (q.x - p.x) * t, y: p.y + (q.y - p.y) * t }
}

export function deflate(t: Tri): Tri[] {
  if (t.kind === 'acute') {
    const P = lerp(t.a, t.b, 1 / PHI)
    return [
      { kind: 'acute', a: t.c, b: P, c: t.b },
      { kind: 'obtuse', a: P, b: t.c, c: t.a },
    ]
  }
  const Q = lerp(t.b, t.a, 1 / PHI)
  const R = lerp(t.b, t.c, 1 / PHI)
  return [
    { kind: 'obtuse', a: R, b: t.c, c: t.a },
    { kind: 'obtuse', a: Q, b: R, c: t.b },
    { kind: 'acute', a: R, b: Q, c: t.a },
  ]
}

export function deflateN(root: Tri, n: number): Tri[] {
  let triangles: Tri[] = [root]
  for (let i = 0; i < n; i++) {
    const next: Tri[] = []
    for (const t of triangles) next.push(...deflate(t))
    triangles = next
  }
  return triangles
}

export function centroid(t: Tri): Pt {
  return {
    x: (t.a.x + t.b.x + t.c.x) / 3,
    y: (t.a.y + t.b.y + t.c.y) / 3,
  }
}

export function makeRootGoldenTriangle(viewSize: number): Tri {
  // Render a golden triangle (apex 36°, base 72°-72°) inside a square viewBox.
  // Native aspect is 1 : sqrt(phi^2 - 0.25) ≈ 1 : 1.539. To fit in a square,
  // constrain by height with a small margin so the apex glow has room.
  const margin = viewSize * 0.04
  const heightAvail = viewSize - margin * 2
  const baseLen = heightAvail / Math.sqrt(PHI * PHI - 0.25)
  const cx = viewSize / 2
  const top = margin
  const bottom = viewSize - margin
  return {
    kind: 'acute',
    a: { x: cx, y: top },
    b: { x: cx - baseLen / 2, y: bottom },
    c: { x: cx + baseLen / 2, y: bottom },
  }
}

/**
 * Logarithmic spiral that emerges from recursive Penrose subdivision. Sampled
 * analytically (r = a*phi^(theta / (pi/5))) rather than tracing apex vertices,
 * which gives a smoother arc at the brand-mark scales we render.
 */
export function logSpiralPath(root: Tri, turns: number): string {
  const cx = (root.a.x + root.b.x + root.c.x) / 3
  const cy = (root.a.y + root.b.y + root.c.y) / 3
  const baseLen = Math.hypot(root.b.x - root.c.x, root.b.y - root.c.y)
  const a = baseLen * 0.06
  const b = Math.log(PHI) / (Math.PI / 5)
  const points: Pt[] = []
  const steps = Math.floor(turns * 36)
  const startAngle = -Math.PI / 2
  for (let i = 0; i <= steps; i++) {
    const theta = startAngle + (i / 36) * Math.PI
    const r = a * Math.exp(b * theta)
    points.push({
      x: cx + r * Math.cos(theta),
      y: cy + r * Math.sin(theta),
    })
  }
  if (points.length < 2) return ''
  let d = `M ${points[0]!.x.toFixed(2)} ${points[0]!.y.toFixed(2)}`
  for (let i = 1; i < points.length; i++) {
    d += ` L ${points[i]!.x.toFixed(2)} ${points[i]!.y.toFixed(2)}`
  }
  return d
}

export function triPolygonPoints(t: Tri): string {
  return `${t.a.x.toFixed(2)},${t.a.y.toFixed(2)} ${t.b.x.toFixed(2)},${t.b.y.toFixed(2)} ${t.c.x.toFixed(2)},${t.c.y.toFixed(2)}`
}

export function colorForCentroidY(yNorm: number): string {
  if (yNorm < 0.2) return 'var(--color-cyan-500)'
  if (yNorm < 0.45) return 'var(--color-cobalt-500)'
  if (yNorm < 0.7) return 'var(--color-violet-500)'
  if (yNorm < 0.9) return 'var(--color-magenta-500)'
  return 'var(--color-ember-500)'
}
