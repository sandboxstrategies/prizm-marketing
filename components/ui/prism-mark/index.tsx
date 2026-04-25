import cn from 'clsx'
import { type ComponentProps, useId } from 'react'
import {
  centroid,
  colorForCentroidY,
  deflateN,
  logSpiralPath,
  makeRootGoldenTriangle,
  type Tri,
  triPolygonPoints,
} from './deflate'
import s from './prism-mark.module.css'

const VIEW = 100
const LEVELS_BY_VARIANT = {
  favicon: 0,
  nav: 1,
  footer: 2,
  'hero-placeholder': 3,
} as const

interface PrismMarkProps extends Omit<ComponentProps<'svg'>, 'children'> {
  size?: number
  variant?: keyof typeof LEVELS_BY_VARIANT
  showSpiral?: boolean
}

export function PrismMark({
  size = 24,
  variant = 'nav',
  showSpiral,
  className,
  ...props
}: PrismMarkProps) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, '')
  const root = makeRootGoldenTriangle(VIEW)
  const levels = LEVELS_BY_VARIANT[variant]
  const triangles: Tri[] = levels === 0 ? [root] : deflateN(root, levels)
  const renderSpiral = showSpiral ?? variant === 'hero-placeholder'
  const usePrismGradient =
    variant === 'footer' || variant === 'hero-placeholder'
  const useSpectrumFacets = variant === 'hero-placeholder'

  const apexNorm = root.a.y
  const baseNorm = root.b.y
  const span = baseNorm - apexNorm

  const yNormFor = (t: Tri) => {
    const y = centroid(t).y
    return (y - apexNorm) / span
  }

  const seamGradientId = `prism-seam-${uid}`
  const fillGradientId = `prism-fill-${uid}`
  const apexGlowId = `prism-apex-${uid}`
  const blurFilterId = `prism-blur-${uid}`

  const blurStd = variant === 'hero-placeholder' ? 1.4 : 1.1
  const seamStrokeWidthByVariant = {
    favicon: 0,
    nav: 0.9,
    footer: 0.6,
    'hero-placeholder': 0.5,
  }
  const seamStrokeWidth = seamStrokeWidthByVariant[variant]
  const outerStrokeWidthByVariant = {
    favicon: 0,
    nav: 0.6,
    footer: 0.45,
    'hero-placeholder': 0.4,
  }
  const outerStrokeWidth = outerStrokeWidthByVariant[variant]
  const outerStrokeOpacityByVariant = {
    favicon: 0,
    nav: 0.65,
    footer: 0.55,
    'hero-placeholder': 0.5,
  }
  const outerStrokeOpacity = outerStrokeOpacityByVariant[variant]
  const facetAcuteOpacity = variant === 'hero-placeholder' ? 0.6 : 0.18
  const facetObtuseOpacity = variant === 'hero-placeholder' ? 0.42 : 0.1

  const seamStroke = usePrismGradient
    ? `url(#${seamGradientId})`
    : 'var(--color-cyan-500)'

  const silhouette = variant === 'favicon'

  const apexGlowOpacityByVariant = {
    favicon: 1,
    nav: 0.95,
    footer: 0.85,
    'hero-placeholder': 0.78,
  }
  const apexGlowOpacity = apexGlowOpacityByVariant[variant]

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${VIEW} ${VIEW}`}
      role="img"
      aria-label="Prizm"
      className={cn(s.root, className)}
      {...props}
    >
      <defs>
        <linearGradient
          id={seamGradientId}
          x1="0"
          y1={apexNorm}
          x2="0"
          y2={baseNorm}
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="var(--color-cyan-500)" />
          <stop offset="22%" stopColor="var(--color-cobalt-500)" />
          <stop offset="50%" stopColor="var(--color-violet-500)" />
          <stop offset="75%" stopColor="var(--color-magenta-500)" />
          <stop offset="100%" stopColor="var(--color-ember-500)" />
        </linearGradient>

        <linearGradient
          id={fillGradientId}
          x1="0"
          y1={apexNorm}
          x2="0"
          y2={baseNorm}
          gradientUnits="userSpaceOnUse"
        >
          <stop
            offset="0%"
            stopColor="var(--color-cyan-500)"
            stopOpacity="0.55"
          />
          <stop
            offset="35%"
            stopColor="var(--color-cobalt-500)"
            stopOpacity="0.28"
          />
          <stop
            offset="70%"
            stopColor="var(--color-violet-500)"
            stopOpacity="0.18"
          />
          <stop
            offset="100%"
            stopColor="var(--color-ember-500)"
            stopOpacity="0.12"
          />
        </linearGradient>

        <radialGradient
          id={apexGlowId}
          cx={root.a.x}
          cy={root.a.y}
          r={(span * 0.45).toFixed(2)}
          gradientUnits="userSpaceOnUse"
        >
          <stop
            offset="0%"
            stopColor="var(--color-cyan-400)"
            stopOpacity="0.95"
          />
          <stop
            offset="55%"
            stopColor="var(--color-cyan-500)"
            stopOpacity="0.35"
          />
          <stop
            offset="100%"
            stopColor="var(--color-cyan-500)"
            stopOpacity="0"
          />
        </radialGradient>

        <filter id={blurFilterId} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation={blurStd} />
        </filter>
      </defs>

      {/* Outer silhouette: filled per variant */}
      {silhouette ? (
        <polygon points={triPolygonPoints(root)} className={s.silhouette} />
      ) : (
        <polygon
          points={triPolygonPoints(root)}
          fill={`url(#${fillGradientId})`}
        />
      )}

      {/* Per-facet fills (spectrum mapping for hero-placeholder) */}
      {!silhouette &&
        useSpectrumFacets &&
        triangles.map((t, i) => (
          <polygon
            // biome-ignore lint/suspicious/noArrayIndexKey: triangles are deterministic per render
            key={`facet-${i}`}
            points={triPolygonPoints(t)}
            fill={colorForCentroidY(yNormFor(t))}
            fillOpacity={
              t.kind === 'acute' ? facetAcuteOpacity : facetObtuseOpacity
            }
            stroke="var(--color-surface-line)"
            strokeWidth={0.25}
            strokeOpacity={0.5}
            className={s.facet}
          />
        ))}

      {/* Internal seams (only when at least one deflation has occurred) */}
      {!silhouette && levels > 0 && (
        <g filter={`url(#${blurFilterId})`} className={s.seam}>
          {triangles.map((t, i) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: triangles are deterministic per render
            <g key={`seam-${i}`}>
              <line
                x1={t.a.x}
                y1={t.a.y}
                x2={t.b.x}
                y2={t.b.y}
                stroke={seamStroke}
                strokeWidth={seamStrokeWidth}
                strokeLinecap="round"
                strokeOpacity={0.85}
              />
              <line
                x1={t.a.x}
                y1={t.a.y}
                x2={t.c.x}
                y2={t.c.y}
                stroke={seamStroke}
                strokeWidth={seamStrokeWidth}
                strokeLinecap="round"
                strokeOpacity={0.85}
              />
            </g>
          ))}
        </g>
      )}

      {/* Logarithmic spiral easter egg — same growth factor (φ) as nautilus shells */}
      {renderSpiral && (
        <path d={logSpiralPath(root, 2.5)} className={s.spiral} />
      )}

      {/* Outer outline for crisp edge (skipped on favicon) */}
      {!silhouette && (
        <polygon
          points={triPolygonPoints(root)}
          fill="none"
          stroke={seamStroke}
          strokeWidth={outerStrokeWidth}
          strokeLinejoin="round"
          strokeLinecap="round"
          strokeOpacity={outerStrokeOpacity}
        />
      )}

      {/* Apex glow — always on, dominates at favicon and nav scales */}
      <polygon
        points={triPolygonPoints(root)}
        fill={`url(#${apexGlowId})`}
        opacity={apexGlowOpacity}
        className={s.apexGlow}
      />

      {/* Bright apex core — anchors the focal point on every variant */}
      <circle
        cx={root.a.x}
        cy={root.a.y}
        r={span * 0.022}
        fill="var(--color-cyan-400)"
        opacity={0.95}
      />
      <circle
        cx={root.a.x}
        cy={root.a.y}
        r={span * 0.06}
        fill="var(--color-cyan-400)"
        opacity={0.32}
        filter={`url(#${blurFilterId})`}
      />
    </svg>
  )
}
