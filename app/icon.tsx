import { ImageResponse } from 'next/og'

export const size = { width: 32, height: 32 }
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

export default function Icon() {
  return new ImageResponse(
    <div
      style={{
        display: 'flex',
        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#0a0c16',
      }}
    >
      <svg
        width="100%"
        height="100%"
        viewBox={`0 0 ${VIEW} ${VIEW}`}
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <defs>
          <radialGradient
            id="apex"
            cx={cx}
            cy={top}
            r={heightAvail * 0.55}
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor="#7ce8ff" stopOpacity="1" />
            <stop offset="55%" stopColor="#28c0e6" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#0e88a8" stopOpacity="0.55" />
          </radialGradient>
        </defs>
        <polygon
          points={`${cx},${top} ${left},${bottom} ${right},${bottom}`}
          fill="url(#apex)"
        />
        <circle cx={cx} cy={top} r={3.5} fill="#aef0ff" />
      </svg>
    </div>,
    { ...size }
  )
}
