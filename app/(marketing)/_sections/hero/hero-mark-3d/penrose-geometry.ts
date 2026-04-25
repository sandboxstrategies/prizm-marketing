/**
 * Local canvas required — global Satūs canvas is ortho+linear, this 3D
 * scene needs perspective+sRGB+tonemapped. Do NOT migrate this back into
 * the tunnel pattern; it'll silently degrade glass / lighting / bloom.
 */

import { BufferGeometry, Float32BufferAttribute } from 'three'
import {
  deflateN,
  makeRootGoldenTriangle,
  type Pt,
} from '@/components/ui/prism-mark/deflate'
import { colorAtY } from './seam-colors'

const VIEW = 1
const SEAM_INSET = 0.001

interface Edge {
  p1: Pt
  p2: Pt
  count: number
}

function edgeKey(p1: Pt, p2: Pt): string {
  const aFirst =
    p1.x < p2.x || (p1.x === p2.x && p1.y < p2.y) ? [p1, p2] : [p2, p1]
  const a = aFirst[0]!
  const b = aFirst[1]!
  return `${a.x.toFixed(5)},${a.y.toFixed(5)}|${b.x.toFixed(5)},${b.y.toFixed(5)}`
}

interface MeshOutput {
  bodyGeometry: BufferGeometry
  seamGeometry: BufferGeometry
  silhouetteGeometry: BufferGeometry
  bodyTriCount: number
  seamSegmentCount: number
  silhouetteSegmentCount: number
  silhouetteEdgeCount: number
  internalEdgeCount: number
}

/**
 * Construct the volumetric Penrose prism — a golden-triangle outline
 * subdivided into Robinson facets (3 levels of deflation), extruded along Z,
 * with per-face normals (faceted shading). Internal subdivision edges are
 * returned as a separate line geometry with vertex colors mapped along
 * normalized Y.
 *
 * Coordinate frame: apex up (+Y), centered at origin.
 *
 * `depth` is expressed as a fraction of the base length (so 0.6 means the
 * prism is 0.6 × base_width thick). Default 0.6 per the brief.
 */
export function buildPenroseMesh({
  depth = 0.6,
}: {
  depth?: number
} = {}): MeshOutput {
  const root = makeRootGoldenTriangle(VIEW)
  const tris = deflateN(root, 3)

  const baseLen = Math.hypot(root.c.x - root.b.x, root.c.y - root.b.y)
  const halfDepth = (depth * baseLen) / 2

  const apexY = root.a.y
  const baseYAxis = root.b.y
  const ySpan = baseYAxis - apexY

  // Convert deflate.ts coords (Y-down screen-space) to world (Y-up, centered)
  function toWorld(p: Pt, z: number): [number, number, number] {
    return [p.x - VIEW / 2, VIEW / 2 - p.y, z]
  }

  // Edge classification: silhouette edges appear in exactly 1 triangle;
  // internal edges (the seams) appear in exactly 2.
  const edgeMap = new Map<string, Edge>()
  for (const tri of tris) {
    const pairs: [Pt, Pt][] = [
      [tri.a, tri.b],
      [tri.b, tri.c],
      [tri.c, tri.a],
    ]
    for (const [p1, p2] of pairs) {
      const key = edgeKey(p1, p2)
      const existing = edgeMap.get(key)
      if (existing) {
        existing.count += 1
      } else {
        edgeMap.set(key, { p1, p2, count: 1 })
      }
    }
  }

  const silhouetteEdges: Edge[] = []
  const internalEdges: Edge[] = []
  for (const e of edgeMap.values()) {
    if (e.count === 1) silhouetteEdges.push(e)
    else if (e.count === 2) internalEdges.push(e)
  }

  // ─────────────────────────────────────────────────────────────────────
  // BODY GEOMETRY — non-indexed so computeVertexNormals() yields face normals
  // ─────────────────────────────────────────────────────────────────────
  const bodyPositions: number[] = []

  for (const tri of tris) {
    // Front face (counter-clockwise viewed from +Z front).
    // deflate.ts coords are screen-down so a Y-flip inverts winding —
    // emit as (a, b, c) and the world-space conversion handles it.
    bodyPositions.push(...toWorld(tri.a, +halfDepth))
    bodyPositions.push(...toWorld(tri.c, +halfDepth))
    bodyPositions.push(...toWorld(tri.b, +halfDepth))

    // Back face (reverse winding so normal points -Z).
    bodyPositions.push(...toWorld(tri.a, -halfDepth))
    bodyPositions.push(...toWorld(tri.b, -halfDepth))
    bodyPositions.push(...toWorld(tri.c, -halfDepth))
  }

  // Silhouette walls — quads connecting front and back along outer-boundary
  // edges only. Internal edges live as emissive lines, not solid walls.
  for (const e of silhouetteEdges) {
    const fp1 = toWorld(e.p1, +halfDepth)
    const fp2 = toWorld(e.p2, +halfDepth)
    const bp1 = toWorld(e.p1, -halfDepth)
    const bp2 = toWorld(e.p2, -halfDepth)

    // Two triangles per quad. Winding chosen so outward normal faces away
    // from the prism interior; computeVertexNormals will flip if needed.
    bodyPositions.push(...fp1, ...fp2, ...bp2)
    bodyPositions.push(...fp1, ...bp2, ...bp1)
  }

  const bodyGeometry = new BufferGeometry()
  bodyGeometry.setAttribute(
    'position',
    new Float32BufferAttribute(bodyPositions, 3)
  )
  bodyGeometry.computeVertexNormals()

  // ─────────────────────────────────────────────────────────────────────
  // SEAM GEOMETRY — line segments along internal edges, drawn on both
  // front and back faces (mirrored slightly inset toward the interior).
  // ─────────────────────────────────────────────────────────────────────
  const seamPositions: number[] = []
  const seamColors: number[] = []

  for (const e of internalEdges) {
    const tFront = +halfDepth - SEAM_INSET
    const tBack = -halfDepth + SEAM_INSET

    const yNorm1 = (e.p1.y - apexY) / ySpan
    const yNorm2 = (e.p2.y - apexY) / ySpan
    const c1 = colorAtY(yNorm1)
    const c2 = colorAtY(yNorm2)

    // Front
    seamPositions.push(...toWorld(e.p1, tFront))
    seamPositions.push(...toWorld(e.p2, tFront))
    seamColors.push(c1.r, c1.g, c1.b)
    seamColors.push(c2.r, c2.g, c2.b)

    // Back
    seamPositions.push(...toWorld(e.p1, tBack))
    seamPositions.push(...toWorld(e.p2, tBack))
    seamColors.push(c1.r, c1.g, c1.b)
    seamColors.push(c2.r, c2.g, c2.b)
  }

  const seamGeometry = new BufferGeometry()
  seamGeometry.setAttribute(
    'position',
    new Float32BufferAttribute(seamPositions, 3)
  )
  seamGeometry.setAttribute('color', new Float32BufferAttribute(seamColors, 3))

  // ─────────────────────────────────────────────────────────────────────
  // SILHOUETTE GEOMETRY — line segments along outer-boundary edges.
  // Lower intensity than seams (multiplied 0.55x) so they anchor the
  // triangle shape without competing with the Penrose subdivision pattern.
  // ─────────────────────────────────────────────────────────────────────
  const silhouettePositions: number[] = []
  const silhouetteColors: number[] = []
  const SILHOUETTE_DAMPEN = 0.55

  for (const e of silhouetteEdges) {
    const tFront = +halfDepth - SEAM_INSET
    const tBack = -halfDepth + SEAM_INSET

    const yNorm1 = (e.p1.y - apexY) / ySpan
    const yNorm2 = (e.p2.y - apexY) / ySpan
    const c1 = colorAtY(yNorm1)
    const c2 = colorAtY(yNorm2)

    silhouettePositions.push(...toWorld(e.p1, tFront))
    silhouettePositions.push(...toWorld(e.p2, tFront))
    silhouetteColors.push(
      c1.r * SILHOUETTE_DAMPEN,
      c1.g * SILHOUETTE_DAMPEN,
      c1.b * SILHOUETTE_DAMPEN
    )
    silhouetteColors.push(
      c2.r * SILHOUETTE_DAMPEN,
      c2.g * SILHOUETTE_DAMPEN,
      c2.b * SILHOUETTE_DAMPEN
    )

    silhouettePositions.push(...toWorld(e.p1, tBack))
    silhouettePositions.push(...toWorld(e.p2, tBack))
    silhouetteColors.push(
      c1.r * SILHOUETTE_DAMPEN,
      c1.g * SILHOUETTE_DAMPEN,
      c1.b * SILHOUETTE_DAMPEN
    )
    silhouetteColors.push(
      c2.r * SILHOUETTE_DAMPEN,
      c2.g * SILHOUETTE_DAMPEN,
      c2.b * SILHOUETTE_DAMPEN
    )
  }

  const silhouetteGeometry = new BufferGeometry()
  silhouetteGeometry.setAttribute(
    'position',
    new Float32BufferAttribute(silhouettePositions, 3)
  )
  silhouetteGeometry.setAttribute(
    'color',
    new Float32BufferAttribute(silhouetteColors, 3)
  )

  return {
    bodyGeometry,
    seamGeometry,
    silhouetteGeometry,
    bodyTriCount: bodyPositions.length / 9,
    seamSegmentCount: seamPositions.length / 6,
    silhouetteSegmentCount: silhouettePositions.length / 6,
    silhouetteEdgeCount: silhouetteEdges.length,
    internalEdgeCount: internalEdges.length,
  }
}
