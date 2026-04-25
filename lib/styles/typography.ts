import type { CSSProperties } from 'react'

const fonts = {
  // PHASE 3 swap point — replace with '--next-font-display' when Neue Machina installs
  display: '--font-geist-sans',
  sans: '--font-geist-sans',
  mono: '--font-geist-mono',
} as const

const typography: TypeStyles = {
  'display-xl': {
    'font-family': `var(${fonts.display})`,
    'font-style': 'normal',
    'font-weight': 500,
    'line-height': '95%',
    'letter-spacing': '-0.04em',
    'font-size': { mobile: 44, desktop: 96 },
  },
  'display-lg': {
    'font-family': `var(${fonts.display})`,
    'font-style': 'normal',
    'font-weight': 500,
    'line-height': '100%',
    'letter-spacing': '-0.03em',
    'font-size': { mobile: 36, desktop: 70 },
  },
  'display-md': {
    'font-family': `var(${fonts.display})`,
    'font-style': 'normal',
    'font-weight': 500,
    'line-height': '110%',
    'letter-spacing': '-0.02em',
    'font-size': { mobile: 28, desktop: 51 },
  },
  'body-lg': {
    'font-family': `var(${fonts.sans})`,
    'font-style': 'normal',
    'font-weight': 400,
    'line-height': '150%',
    'letter-spacing': '-0.005em',
    'font-size': { mobile: 16, desktop: 18 },
  },
  'body-md': {
    'font-family': `var(${fonts.sans})`,
    'font-style': 'normal',
    'font-weight': 400,
    'line-height': '155%',
    'letter-spacing': '0em',
    'font-size': { mobile: 15, desktop: 16 },
  },
  caption: {
    'font-family': `var(${fonts.sans})`,
    'font-style': 'normal',
    'font-weight': 500,
    'line-height': '130%',
    'letter-spacing': '0.12em',
    'font-size': { mobile: 11, desktop: 12 },
  },
  'mono-md': {
    'font-family': `var(${fonts.mono})`,
    'font-style': 'normal',
    'font-weight': 400,
    'line-height': '130%',
    'letter-spacing': '0em',
    'font-size': { mobile: 13, desktop: 14 },
  },
  'mono-lg': {
    'font-family': `var(${fonts.mono})`,
    'font-style': 'normal',
    'font-weight': 500,
    'line-height': '110%',
    'letter-spacing': '-0.01em',
    'font-size': { mobile: 22, desktop: 24 },
  },
} as const

export { fonts, typography }

// UTIL TYPES
type TypeStyles = Record<
  string,
  {
    'font-family': string
    'font-style': CSSProperties['fontStyle']
    'font-weight': CSSProperties['fontWeight']
    'line-height':
      | `${number}%`
      | { mobile: `${number}%`; desktop: `${number}%` }
    'letter-spacing':
      | `${number}em`
      | { mobile: `${number}em`; desktop: `${number}em` }
    'font-feature-settings'?: string
    'font-size': number | { mobile: number; desktop: number }
  }
>
