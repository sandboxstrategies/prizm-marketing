import { ImageResponse } from 'next/og'

export const alt =
  'Prizm — sales, ops, commissions, integrations, and AI. One platform, built by operators.'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

const PHI = (1 + Math.sqrt(5)) / 2
const VIEW = 100
const margin = VIEW * 0.04
const heightAvail = VIEW - margin * 2
const baseLen = heightAvail / Math.sqrt(PHI * PHI - 0.25)
const cx = VIEW / 2
const top = margin
const bottom = VIEW - margin
const left = cx - baseLen / 2
const right = cx + baseLen / 2

export default function OG() {
  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        background: '#0a0c16',
        position: 'relative',
        padding: '64px 80px',
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(ellipse at 80% 35%, rgba(0, 207, 238, 0.18), transparent 60%), radial-gradient(ellipse at 25% 80%, rgba(124, 79, 245, 0.12), transparent 55%)',
        }}
      />

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          height: '100%',
          width: '60%',
          color: '#f5f6f8',
          zIndex: 1,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
          <svg
            width="56"
            height="56"
            viewBox={`0 0 ${VIEW} ${VIEW}`}
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <defs>
              <linearGradient
                id="og-fill"
                x1="0"
                y1={top}
                x2="0"
                y2={bottom}
                gradientUnits="userSpaceOnUse"
              >
                <stop offset="0%" stopColor="#28c0e6" stopOpacity="0.7" />
                <stop offset="50%" stopColor="#7c4ff5" stopOpacity="0.35" />
                <stop offset="100%" stopColor="#ffaa44" stopOpacity="0.18" />
              </linearGradient>
              <radialGradient
                id="og-apex"
                cx={cx}
                cy={top}
                r={heightAvail * 0.6}
                gradientUnits="userSpaceOnUse"
              >
                <stop offset="0%" stopColor="#aef0ff" stopOpacity="1" />
                <stop offset="55%" stopColor="#28c0e6" stopOpacity="0.6" />
                <stop offset="100%" stopColor="#28c0e6" stopOpacity="0" />
              </radialGradient>
            </defs>
            <polygon
              points={`${cx},${top} ${left},${bottom} ${right},${bottom}`}
              fill="url(#og-fill)"
              stroke="#28c0e6"
              strokeWidth="0.6"
              strokeOpacity="0.6"
            />
            <polygon
              points={`${cx},${top} ${left},${bottom} ${right},${bottom}`}
              fill="url(#og-apex)"
              opacity="0.85"
            />
            <circle cx={cx} cy={top} r="3" fill="#aef0ff" />
          </svg>
          <span
            style={{ fontSize: 36, fontWeight: 600, letterSpacing: '-0.02em' }}
          >
            Prizm
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <span
            style={{
              fontSize: 76,
              lineHeight: '0.95',
              fontWeight: 600,
              letterSpacing: '-0.04em',
              color: '#f5f6f8',
              maxWidth: 720,
              display: 'flex',
            }}
          >
            The solar operating system.
          </span>
          <span
            style={{
              fontSize: 26,
              lineHeight: 1.4,
              color: '#b8b9bf',
              fontWeight: 400,
              maxWidth: 640,
              display: 'flex',
            }}
          >
            Sales, ops, commissions, integrations, and AI. Built by operators.
          </span>
        </div>

        <span
          style={{
            fontSize: 18,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: '#7c818a',
            fontWeight: 500,
          }}
        >
          prizm.solar
        </span>
      </div>

      <div
        style={{
          position: 'absolute',
          right: -120,
          top: 40,
          width: 700,
          height: 700,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          opacity: 0.85,
        }}
      >
        <svg
          width="600"
          height="600"
          viewBox={`0 0 ${VIEW} ${VIEW}`}
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <defs>
            <linearGradient
              id="og-hero-fill"
              x1="0"
              y1={top}
              x2="0"
              y2={bottom}
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0%" stopColor="#28c0e6" stopOpacity="0.55" />
              <stop offset="35%" stopColor="#3b6cf5" stopOpacity="0.3" />
              <stop offset="70%" stopColor="#7c4ff5" stopOpacity="0.22" />
              <stop offset="100%" stopColor="#ffaa44" stopOpacity="0.14" />
            </linearGradient>
            <linearGradient
              id="og-hero-stroke"
              x1="0"
              y1={top}
              x2="0"
              y2={bottom}
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0%" stopColor="#28c0e6" />
              <stop offset="35%" stopColor="#3b6cf5" />
              <stop offset="70%" stopColor="#7c4ff5" />
              <stop offset="100%" stopColor="#ffaa44" />
            </linearGradient>
            <radialGradient
              id="og-hero-apex"
              cx={cx}
              cy={top}
              r={heightAvail * 0.55}
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0%" stopColor="#aef0ff" stopOpacity="0.9" />
              <stop offset="55%" stopColor="#28c0e6" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#28c0e6" stopOpacity="0" />
            </radialGradient>
          </defs>
          <polygon
            points={`${cx},${top} ${left},${bottom} ${right},${bottom}`}
            fill="url(#og-hero-fill)"
            stroke="url(#og-hero-stroke)"
            strokeWidth="0.5"
            strokeOpacity="0.55"
          />
          <polygon
            points={`${cx},${top} ${left},${bottom} ${right},${bottom}`}
            fill="url(#og-hero-apex)"
          />
          <circle cx={cx} cy={top} r="1.2" fill="#aef0ff" />
        </svg>
      </div>
    </div>,
    { ...size }
  )
}
