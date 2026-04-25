const colors = {
  black: '#000000',
  white: '#ffffff',
  red: '#e30613',
  blue: '#0070f3',
  green: '#00ff88',
  purple: '#7928ca',
  pink: '#ff0080',

  // Prizm brand primary — Plasma Cyan
  'cyan-400': 'oklch(0.85 0.15 200)',
  'cyan-500': 'oklch(0.78 0.18 200)',
  'cyan-600': 'oklch(0.68 0.20 205)',

  // Spectrum — refracted accents (cyan apex → ember base)
  'cobalt-500': 'oklch(0.62 0.22 258)',
  'violet-500': 'oklch(0.60 0.24 295)',
  'magenta-500': 'oklch(0.65 0.24 340)',
  'ember-500': 'oklch(0.74 0.18 60)',

  // Surfaces — near-obsidian with subtle warm undertones
  'surface-void': 'oklch(0.06 0.012 265)',
  'surface-base': 'oklch(0.09 0.015 265)',
  'surface-raised': 'oklch(0.12 0.018 265)',
  'surface-float': 'oklch(0.15 0.022 265)',
  'surface-line': 'oklch(0.20 0.025 265)',

  // Text
  'text-primary': 'oklch(0.97 0.005 100)',
  'text-secondary': 'oklch(0.72 0.01 100)',
  'text-tertiary': 'oklch(0.52 0.01 100)',
  'text-dim': 'oklch(0.38 0.01 100)',
} as const

const themeNames = ['light', 'dark', 'red', 'evil', 'prizm'] as const
const colorNames = ['primary', 'secondary', 'contrast'] as const

const themes = {
  light: {
    primary: colors.white,
    secondary: colors.black,
    contrast: colors.red,
  },
  dark: {
    primary: colors.black,
    secondary: colors.white,
    contrast: colors.red,
  },
  evil: {
    primary: colors.black,
    secondary: colors.red,
    contrast: colors.white,
  },
  red: {
    primary: colors.red,
    secondary: colors.black,
    contrast: colors.white,
  },
  prizm: {
    primary: colors['surface-void'],
    secondary: colors['text-primary'],
    contrast: colors['cyan-500'],
  },
} as const satisfies Themes

export { colors, themeNames, themes }

// UTIL TYPES
export type Themes = Record<
  (typeof themeNames)[number],
  Record<(typeof colorNames)[number], string>
>
