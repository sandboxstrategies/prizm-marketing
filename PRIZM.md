# PRIZM.md — Project-Specific Context

This file complements Satūs's `CLAUDE.md`, `ARCHITECTURE.md`, `BOUNDARIES.md`, `COMPONENTS.md`, and `PATTERNS.md`. **Read all of them.**

If anything in this file conflicts with Satūs framework docs for code conventions (Biome rules, React Compiler rules, theme contract, file structure, component patterns, build pipeline), **Satūs always wins.** PRIZM.md only overrides for product/design/copy decisions.

---

## Project: Prizm Marketing Site

The single-page marketing site at prizm.solar. Promotes the Prizm platform — a full-lifecycle solar operating system. Separate from the Prizm product app (different repo, do not touch).

This is a Satūs project running on Next.js 16, React 19, Tailwind v4, and the React Compiler. **Use Satūs's existing patterns and components wherever possible.** Do not rebuild what already exists.

---

## Corporate structure (state truthfully on the site)

- **Sandbox Strategies** is Knighthawk's development company. Sandbox builds and operates Prizm. Prizm is the Sandbox flagship product.
- **Flo Energy Solar** is Knighthawk's solar company — partial owner. Flo runs on Prizm; Flo is the proof case, not the parent.
- **Knighthawk's experience**: 10+ years operating in solar — sales, ops, permits, install, commissions, finance. Owned a previous solar company before Flo.

When we say "built by operators," it's literally true. Don't soften, don't make it metaphorical.

Footer copyright: `© 2026 Sandbox Strategies. Prizm is operated by Sandbox Strategies in partnership with Flo Energy Solar.`

---

## Audience and voice

**Audience**: solar installer owner-operators, ops directors, sales reps in solar orgs/dealers/EPCs/hybrid orgs. They run small-to-mid solar businesses (5–50 person teams). They've been burned by software that doesn't understand the actual workflow.

**Voice rules** (apply to every line of copy):

1. Short sentences. Periods land hard.
2. Numbers > adjectives. "47-day install cycle" > "fast install cycles."
3. **Banned vocabulary**: unlock, empower, seamless, solution, leverage, robust, game-changing, revolutionize, cutting-edge, best-in-class, holistic, synergize, delight, "blow your mind", mind-blowing, "you're welcome", "trust us", "we got you", end-to-end, all-in-one, single-source-of-truth. If a competitor uses it, we don't.
4. Confident declaratives. "We do X." Not "We help you do X."
5. Italics on the pivot word only — the one word that turns a sentence. Use real italic font when available (Phase 3+); system italic fallback acceptable in 1A.
6. Delete every word you can without losing meaning.
7. No SaaS storytelling. No "imagine a world where..." Just say it.

**Mental test for every copy decision**: would a 15-year solar operator nod and say "yeah, these are my people"? If not, rewrite.

---

## What makes Prizm different (in priority order)

1. **Built BY operators with skin in the game.** Knighthawk co-owns Flo Energy and has 10+ years of solar across every function. He's the founder you talk to.
2. **Designed end-to-end for solar specifically.** Not a generic CRM with a solar paint job. Native modeling for the solar lifecycle: lead → contract → NTP → install → activation → service.
3. **Sales rep transparency** (rare in this space). Reps see their own pipeline. Reps see their own commissions in real time — EPCs, redlines, adders, clawbacks, draws.
4. **Speed to install + speed to funded.** The two operational metrics that move money.
5. **Robust data on metrics that matter.** Cycle times by stage, conversion by rep, EPC variance, funder velocity.
6. **Customization via Sandbox Strategies.** Prizm Custom is the gatekept tier. Never list qualification criteria publicly.
7. **Everything in one platform.** Internal modules + integrated tools.

---

## Aesthetic direction

**Direction**: Creative Studio territory. Reference DNA — basement.studio's confidence + immersive-g.com's premium restraint. Dark, cinematic, motion-rich.

**Single CTA**: "Talk to the founder" → `https://cal.com/prizm-solar`. No pricing shown anywhere. No demo signups.

---

## Brand mark — Penrose Golden Triangle Prism

The mark is a **golden triangle** (36° apex, 72° base angles — the Penrose primitive) **subdivided into Robinson triangles** following Penrose deflation rules, **rendered with our spectrum colors**, **lit from within** at the internal seams. Levels of detail scale with render size.

### Why this geometry

The golden triangle is the atomic unit of all Penrose tilings. Every kite is two golden triangles. Every dart is two golden gnomons. The arms of a pentagram are five golden triangles. Penrose tilings (built from these triangles) exhibit **"forbidden" five-fold rotational symmetry** that classical mathematicians said was impossible to use for tiling a plane.

This isn't decorative math. **Penrose patterns are physically used in solar cell research** to improve light absorption by up to 57% vs periodic structures (peer-reviewed at UNSW Sydney, Cambridge, Fraunhofer ISE). The mark literally references the science of high-efficiency photovoltaics. The operator pitch:

> *"Our mark uses the same Penrose pattern researchers use to make solar cells absorb 57% more light at every angle. Aperiodic structures handle every angle. Same with our platform."*

### Geometry specifications

**Outer silhouette**: Golden triangle (acute Robinson triangle).
- Apex angle: 36°
- Base angles: 72° each
- Side lengths in golden ratio to base: sides = φ × base where φ = (1 + √5) / 2 ≈ 1.618
- For a triangle with base = 1: sides = 1.618, height = √(φ² − 0.25) ≈ 1.539

**Internal structure**: Robinson triangle deflation.
- A golden triangle (sides φ, base 1) deflates into: 1 smaller golden triangle (sides 1, base 1/φ) + 1 golden gnomon (sides 1/φ, base 1)
- A golden gnomon (sides 1, base φ) deflates into: 1 golden triangle (sides 1, base 1/φ) + 1 golden gnomon (sides 1/φ, base 1)
- Bisection of golden triangle: bisect one of the 72° base angles; the bisector hits the opposite side at the point that divides it in golden ratio
- Bisection of golden gnomon: trisect the 108° apex angle (or equivalently, bisect a 36° base angle); the bisector hits the opposite side at the golden ratio point

Reference algorithm: Wolfram MathWorld — "Penrose Tiles" deflation rules. Standard, well-documented, dozens of open-source p5.js / paper.js / JS implementations.

### Scale-aware rendering

Levels of detail scale with the render size. Each scale gets its own variant:

| Variant | Size | Subdivision levels | Treatment |
|---|---|---|---|
| `favicon` | 16–24px | 0 (silhouette only) | Solid silhouette + single cyan apex glow |
| `nav` | 24–32px | 1 deflation (2 sub-triangles) | Silhouette + 1 internal seam, cyan glow |
| `footer` | 32–48px | 2 deflations (~5 sub-triangles) | Multiple seams, prism-gradient inner glow |
| `hero-placeholder` | 200px+ | 3–4 deflations (~15–30 sub-triangles) | Full Robinson subdivision, spectrum colors per facet, internal seams glow |

### Color mapping (cyan apex, ember base — refraction direction)

White light enters at the apex, refracts into spectrum down through the body. This matches real prism behavior AND real solar spectrum behavior (cooler high-energy light at top, warmer light at horizon).

- Apex region (top ~20% of triangle area): `cyan-500` dominant facets
- Upper-middle (next ~25%): `cobalt-500`
- Middle (next ~25%): `violet-500`
- Lower-middle (next ~20%): `magenta-500`
- Base (bottom ~10%): `ember-500`

Saturation drops from full (apex) to ~70% (base) — apex is the brightest, most-saturated region; base softens. Each facet has subtle gradient from `surface-line` edge → mapped spectrum color.

### Inner seam glow

The seams between Robinson triangles emit light. This is the "lit from within" signature.

- `nav` / `favicon` variants: solid `cyan-500` strokes with `feGaussianBlur` filter (stdDeviation 1.5–2)
- `footer` / `hero-placeholder` variants: stroke uses `--prism-gradient` (cyan→cobalt→violet→magenta→ember) via SVG `<linearGradient>` matching the gradient direction of the color mapping
- The apex seam (where topmost subdivisions converge) gets the brightest glow — that's the focal point

### Logarithmic spiral Easter egg

Bonus mathematical detail. When you recursively subdivide a golden triangle, the apex points of each successive sub-triangle trace a **logarithmic spiral** — the same spiral found in nautilus shells, hurricane systems, galaxy arms, and sunflower seed patterns.

For `hero-placeholder` and (Phase 1B) the volumetric version: include this spiral as a 1px stroke at 5% opacity passing through the apex vertices. Quiet, but enriches the mark for those who notice. In motion, the spiral can serve as the path for an internal light beam — the "white light beam" entering the apex and refracting downward.

### Three render modes for Phase 1A

All three are flat 2D SVG. The volumetric WebGL hero version comes Phase 1B.

1. **`favicon` / `nav` / `footer`** — implemented as a single `PrismMark` React component with `variant` prop, `size` prop. CSS Module + SVG.
2. **Hero placeholder** — same component at large size + 3-4 deflation levels visible. HTML comment marks the file: `<!-- PHASE 1B: replace with WebGL volumetric Penrose triangle scene using useWebGLElement + WebGLTunnel.In per PATTERNS.md §6 -->`

### Phase 1B preview (NOT this session)

The volumetric hero version: 3D extrusion of the Robinson triangle subdivision into a faceted gem (each facet = a 3D triangular face with depth). `MeshPhysicalMaterial` for premium glass-like material. Emissive seams in cyan + spectrum. UnrealBloomPass for glow. Slow rotation revealing the Penrose subdivision from different angles. Theatre.js choreography for scroll-driven inflation/deflation.

---

## Build pipeline (read carefully — this is critical)

**`lib/styles/css/tailwind.css` and `lib/styles/css/root.css` are AUTO-GENERATED.** Never edit them directly. They are output of `bun run setup:styles` which transforms the source files.

**The source files you edit:**
- `lib/styles/colors.ts` — flat color palette + theme registry (3-slot theme contract)
- `lib/styles/typography.ts` — type scale (mobile/desktop sizes generate `.dr-{name}` utilities)
- `lib/styles/fonts.ts` — `next/font/local` and Geist declarations
- `lib/styles/easings.ts` — easing curves (already loaded as `--ease-*` tokens)
- `lib/styles/layout.mjs` — column count, gap, safe area, screen reference widths

**For custom CSS that doesn't fit the build script's contract** (like the prism gradient), edit `lib/styles/css/global.css` — that file IS hand-edited and gets imported via `lib/styles/css/index.css`.

**Workflow**: edit source → run `bun run setup:styles` → tailwind.css and root.css regenerate → reload dev server.

---

## The Satūs theme contract (3 colors per theme)

Satūs's theme model has exactly 3 semantic slots: `{ primary, secondary, contrast }`.

`global.css` already wires these to body styles:
- `body` background uses `var(--color-primary)`
- `body` text uses `var(--color-secondary)`
- focus outlines and selection use `var(--color-contrast)`

**For Prizm we add a new `prizm` theme** to the registry that maps:
- `primary` → `surface-void` (page background)
- `secondary` → `text-primary` (text color)
- `contrast` → `cyan-500` (accent)

We **also add our extended OKLCH palette as flat colors** in `colors.ts` so Tailwind generates utilities like `bg-cyan-500`, `bg-violet-500`, `bg-surface-raised`. The build script generates `--color-{name}` for every entry in the `colors` object.

---

## Design tokens (FINAL)

### Step 1 — Edit `lib/styles/colors.ts`

Extend the existing `colors` object with our OKLCH palette. Tailwind v4 supports OKLCH natively in custom properties.

```typescript
const colors = {
  // Keep existing satus base colors (black, white, red, blue, green, purple, pink)

  // Prizm brand primary — Plasma Cyan
  'cyan-400':      'oklch(0.85 0.15 200)',
  'cyan-500':      'oklch(0.78 0.18 200)',
  'cyan-600':      'oklch(0.68 0.20 205)',

  // Spectrum — refracted accents (cyan apex → ember base)
  'cobalt-500':    'oklch(0.62 0.22 258)',
  'violet-500':    'oklch(0.60 0.24 295)',
  'magenta-500':   'oklch(0.65 0.24 340)',
  'ember-500':     'oklch(0.74 0.18 60)',

  // Surfaces — near-obsidian with subtle warm undertones
  'surface-void':   'oklch(0.06 0.012 265)',
  'surface-base':   'oklch(0.09 0.015 265)',
  'surface-raised': 'oklch(0.12 0.018 265)',
  'surface-float':  'oklch(0.15 0.022 265)',
  'surface-line':   'oklch(0.20 0.025 265)',

  // Text
  'text-primary':   'oklch(0.97 0.005 100)',
  'text-secondary': 'oklch(0.72 0.01 100)',
  'text-tertiary':  'oklch(0.52 0.01 100)',
  'text-dim':       'oklch(0.38 0.01 100)',
} as const
```

Add `prizm` to `themeNames`:

```typescript
const themeNames = ['light', 'dark', 'red', 'evil', 'prizm'] as const
```

Add the `prizm` theme to the `themes` object:

```typescript
prizm: {
  primary: colors['surface-void'],
  secondary: colors['text-primary'],
  contrast: colors['cyan-500'],
},
```

### Step 2 — Add custom CSS to `lib/styles/css/global.css`

Append:

```css
:root {
  --prism-gradient: linear-gradient(
    180deg in oklch,
    var(--color-cyan-500) 0%,
    var(--color-cobalt-500) 22%,
    var(--color-violet-500) 50%,
    var(--color-magenta-500) 75%,
    var(--color-ember-500) 100%
  );
}
```

Note: the gradient direction is `180deg` (top→bottom) to match the cyan-apex/ember-base color mapping in the brand mark. Use the same direction in any SVG `<linearGradient>` defs that reference this.

### Step 3 — Run `bun run setup:styles`

Regenerates `tailwind.css` and `root.css` with all our colors. Verify utilities like `bg-cyan-500`, `text-text-secondary`, `border-surface-line` work.

### Color usage rules

- Use `theme="prizm"` on the `Wrapper` for all marketing pages.
- Spectrum colors never exceed 20% of any section's surface area.
- One accent per section. Hero (cyan + cobalt). Problem (cobalt). Pillars (cyan/violet/ember). Features (rotating). Prizm Custom (violet). Final CTA (cyan).
- Body text lives at `text-text-secondary`. `text-text-primary` is reserved for headlines and emphasis.
- Borders: 1px, `border-surface-line`.

---

## Typography (FINAL)

### Phase 1A approach — ship on free fonts

Use **Geist + Geist Mono** for Phase 1A. Both free, ship via `bun add geist`. Save Neue Machina + Berkeley Mono ($174 total) for Phase 3 as an upgrade pass once the site's generating founder calls.

### Step 1 — Edit `lib/styles/fonts.ts`

```typescript
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'

const sans = GeistSans   // .variable e.g. '--font-geist-sans'
const mono = GeistMono   // .variable e.g. '--font-geist-mono'

const fonts = [sans, mono]
const fontsVariable = fonts.map((font) => font.variable).join(' ')

export { fontsVariable }
```

### Step 2 — Edit `lib/styles/typography.ts`

Update the `fonts` object:

```typescript
const fonts = {
  display: '--font-geist-sans',  // Phase 3 swap point — replace with '--next-font-display' when Neue Machina installs
  sans: '--font-geist-sans',
  mono: '--font-geist-mono',
} as const
```

(Verify the actual variable names exposed by `geist/font/sans` and `geist/font/mono` when installing.)

Replace the placeholder `typography` object:

```typescript
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
```

After running `bun run setup:styles`: utility classes `dr-display-xl`, `dr-display-lg`, `dr-body-md`, `dr-caption`, `dr-mono-lg`, etc.

### Type rules

- Headlines: `dr-display-xl` for hero H1, `dr-display-lg` for section H2s, `dr-display-md` for subsections. Geist Sans 500.
- Body: `dr-body-md` for everything except hero subhead which uses `dr-body-lg`. Geist Sans 400.
- Eyebrows: `dr-caption` ALL CAPS, accent color (e.g. `text-cyan-500`).
- Every concrete number renders in mono — wrap numerics: `<span className="dr-mono-md">47 days</span>`.
- Italics for the pivot word: `<em>Nothing falling through.</em>`. System italic fallback in 1A; real Neue Machina Italic comes Phase 3.

---

## Layout

Satūs handles responsive scaling via the `dr-*` utility system. Sizes specified at the **375px mobile / 1440px desktop** reference widths scale fluidly via vw calc.

**Container**: use `dr-layout-grid` for the standard column grid (4 cols mobile, 12 cols desktop), `dr-layout-block` for full-width blocks.

**Spacing utilities** (use these, not hardcoded px):
- `dr-pt-{n}` / `dr-pb-{n}` / `dr-px-{n}` / `dr-py-{n}` — padding
- `dr-mt-{n}` / `dr-mb-{n}` — margin
- `dr-gap-{n}` — gap
- `dr-w-{n}` / `dr-h-{n}` — width / height
- `dr-rounded-{n}` — border-radius

`{n}` is the px value at the reference width.

**Section vertical rhythm**: 96px between sections on mobile, 192px on desktop. Use `dr-py-48 dt:dr-py-96` (the `dt:` variant is Satūs's desktop breakpoint at 800px).

**Touch targets**: 48px min on mobile.

**Container max-widths**: handled by the grid system. Use `col-span-full` on mobile, `dt:col-start-2 dt:col-end-12` on desktop for primary content blocks.

---

## Motion principles

**Slow. Confident. Heavy.** Like expensive machinery settling. Not bouncy or springy.

```
Timing:
instant:    100ms    button feedback
fast:       200ms    hover, small UI
default:    400ms    section reveals
slow:       700ms    hero elements
cinematic:  1200ms   the 3 big moments

Easing utilities (Tailwind ease-{name} maps to --ease-* tokens):
ease-out-expo:      cubic-bezier(0.19, 1, 0.22, 1)     default
ease-in-out-quart:  cubic-bezier(0.77, 0, 0.175, 1)    big moments
```

### Rules

- No bounces, no overshoots, no springy physics.
- Animate only `transform` and `opacity`.
- Native CSS scroll-timeline for ~70% of scroll reveals.
- GSAP + Theatre.js reserved for the 3 cinematic moments.
- Stagger children by 60ms, max 8 items.
- `prefers-reduced-motion: reduce` → all motion becomes 200ms opacity fades. Use `usePreferredReducedMotion` from `@/hooks/use-sync-external`.

### The 3 cinematic moments (Phase 1B, NOT 1A)

1. **Hero Penrose triangle reveal** — volumetric 3D version of the brand mark. R3F + drei. WebGL Tunnel pattern (`useWebGLElement` + `WebGLTunnel.In`) per `PATTERNS.md §6`. Slow rotation reveals subdivision facets. Internal logarithmic spiral becomes the path of an internal light beam.
2. **Problem → Pillars convergence** — GSAP timeline. 6 chips collapse into Penrose mark, mark deflates (more facets appear), refracts spectrum out into 3 pillars.
3. **Final CTA aurora** — use existing `<AnimatedGradient />` component, scroll-triggered intensity ramp.

---

## Existing Satūs components — DO NOT REBUILD

| Need | Use this | Notes |
|------|----------|-------|
| External link to cal.com | `Link` from `@/components/ui/link` | Auto-detects external — just pass `href` |
| Image rendering | `Image` from `@/components/ui/image` | `noImgElement` is enforced |
| Page wrapper | `Wrapper` from `@/components/layout/wrapper` | Pass `theme="prizm" webgl` for marketing |
| Final CTA aurora background | `AnimatedGradient` from `@/components/effects/animated-gradient` | Accepts `colors`, `amplitude`, `frequency`, `radial`, `flowmap`, `speed` |
| Headline word/char animation (1B) | `SplitText` from `@/components/effects/split-text` | GSAP wrapper |
| Scroll-driven word reveal (1B) | `ProgressText` from `@/components/effects/progress-text` | |
| Scroll parallax | `Fold` from `@/components/ui/fold` | If needed |
| WebGL hero (1B) | `useWebGLElement` + `WebGLTunnel.In` | Per `PATTERNS.md §6` |
| Viewport CSS variables | `useViewport` from `@/components/ui/real-viewport` | |
| Reduced motion preference | `usePreferredReducedMotion` from `@/hooks/use-sync-external` | |
| Device detection | `useDeviceDetection` from `@/hooks/use-device-detection` | |
| Class composition | `cn` (default import from `clsx`) | |
| Math utils | `clamp`, `lerp`, `mapRange` from `@/utils/math` | |
| Animation utils | `stagger`, `ease`, `fromTo`, `spring` from `@/utils/animation` | |

**Component generation**: use `bun run generate` for new components.

---

## Site copy (locked — do not paraphrase)

### Header (modify `components/layout/header/index.tsx` — replace existing JSX, keep file)
- Penrose mark + "Prizm" wordmark
- One CTA: "Talk to the founder" → `https://cal.com/prizm-solar`

### Hero
```
Eyebrow:    THE SOLAR OPERATING SYSTEM
H1:         Everyone on the same platform. <em>Nothing falling through.</em>
Subhead:    Sales, ops, commissions, integrations, and AI.
            One system. Built by operators.
Primary CTA:   Talk to the founder → cal.com/prizm-solar
Secondary CTA: See how it works → #problem
Below-fold:    47 days NTP → install. The metric we built Prizm to fix.
```

### Problem
```
Eyebrow:  THE PROBLEM
H2:       Six tools to move a kilowatt. This is why deals die.
Visual:   Six chips: CRM · Proposal · Funding · Voice · Payroll · Integrator
Body:     Context-switching kills cycle time.
          Data drifts between systems.
          Reps can't see their own pipeline.
          You paid for software and got a second job.
```
Sentence 4 ("You paid for software...") gets `text-text-primary` — punchline.

### Pillars
```
Eyebrow:  THE PRIZM ADVANTAGE
H2:       Three reasons we win.

01 (cyan-400)
Title:    Efficient. Automated. Set up to win.
Body:     Workflows that do the work. Automations that fire when they should.
          No rep rekeying anything.
Metric:   0 CONTEXT SWITCHES

02 (violet-500)
Title:    Flexible. Fast. Never the blocker.
Body:     Deep integrations with everything you already run.
          New capabilities ship weekly.
          What you need next is already on our roadmap.
Metric:   WEEKLY RELEASE CADENCE

03 (ember-500)
Title:    Built by operators. Not by SaaS people.
Body:     Every part of Prizm reflects someone's scar tissue.
          Sales. Ops. Permits. Installs. Commissions. Finance.
          We've owned the trucks. Closed the deals. Pulled the permits.
Metric:   10+ YEARS OPERATING SOLAR
```

### Features (six blocks, alternating left/right on desktop)
```
Eyebrow:  THE PROOF
H2:       What 'one platform' actually means.

Block 1 (cobalt) - PIPELINE
Pipeline health. Visible to everyone.
Every role sees their deals. Reps see their own. No more "who owns this?"

Block 2 (ember) - COMMISSIONS
Commissions reps can actually see.
EPC, redlines, adders, clawbacks, draws — visible to the rep in real time.
Friday pay, Tuesday cutoff. Done.

Block 3 (violet) - INTEGRATIONS
Integrations deeper than anyone else.
Palmetto. Salesforce. Albedo. JustCall. Pipe. Plus internal modules.
Not surface-level. Not webhooks-as-data-payload.

Block 4 (magenta) - AI
Agents doing the grunt work.
Drafting. Routing. Reconciling. Flagging.
The work you shouldn't have to hire someone for.

Block 5 (cyan) - FIELD
The field, in your pocket.
Installers check in. Ops sees status.
Everyone knows what's on today and what ships tomorrow.

Block 6 (ember) - DATA
The metrics that actually move money.
Cycle time by stage. Funder velocity. EPC variance.
The numbers operators care about — not vanity dashboards.
```

### Prizm Custom
```
Eyebrow:  PRIZM CUSTOM
H2:       For operators who need Prizm to do something nobody else can.
Body:     Select clients get dedicated engineering through Sandbox Strategies.
          Features built to your spec.
          Integrations we don't publicly list.
          A platform team that treats your operation like the one it's built for.
          Because it is.
CTA:      Talk to the founder → cal.com/prizm-solar
Subtext:  By invitation. Founder conversation required.
```
Visual: slightly darker bg vs. neighboring sections, 1px gradient border using `--prism-gradient`.

### Final CTA
```
H2:       The solar operating system. Period.
CTA:      Talk to the founder → cal.com/prizm-solar
Subtext:  30 minutes with Knighthawk. Real questions only.
```
Background: `<AnimatedGradient colors={['#0a0c16','#00cfee','#7c4ff5','#ff5c8a','#ffaa44','#0a0c16']} radial flowmap amplitude={1.2} speed={0.4} />` — tune in 1B.

### Footer (modify `components/layout/footer/index.tsx` — replace existing JSX)
- Penrose mark (32px, prism-gradient on the seam) + "Prizm" wordmark
- "Talk to the founder" → cal.com/prizm-solar
- "© 2026 Sandbox Strategies"
- "Built by operators." (mono)

---

## Performance budget

- Total page weight: ≤ 1.2 MB (excluding fonts ~50 KB on Geist alone)
- LCP: ≤ 1.5s on 4G mobile
- CLS: 0
- Lighthouse mobile minimums: Performance ≥ 90, Accessibility ≥ 95, Best Practices ≥ 95, SEO ≥ 95

## Browser support

Chrome 144+, Edge 144+, Safari 17.5+, Firefox 130+, Mobile Safari iOS 17+, Chrome Android 144+.

---

## What you don't do autonomously

- Change copy specified above (every line is intentional)
- Change the cal.com URL
- Add features not in the active session brief
- Buy fonts (Phase 3 only — Phase 1A ships on Geist + Geist Mono, both free)
- Touch the existing Prizm app
- Build a light theme variant
- Add a hamburger menu
- Add social media links
- Add pricing or pricing pages
- Add a demo signup flow
- Edit `lib/styles/css/tailwind.css` or `lib/styles/css/root.css` directly (regenerated by `setup:styles`)
- Rebuild components that already exist (see existing-components table)
- Add Header or Footer to `app/layout.tsx` (Wrapper handles them)

When uncertain:
1. *Less is more*. Editorial restraint > maximalist clutter.
2. *Operator credibility*. Designy choice that doesn't help operators? Cut it.
3. *Fewer words*. Re-read every line, cut a word.
4. Check `BOUNDARIES.md` before modifying core `ui/` primitives — wrap, don't modify.
5. If genuinely stuck: leave a `// QUESTION:` comment + your choice and ship it.

---

## Session handoffs

At end of each session, append to `lib/SESSION_LOG.md`:
- Date, session label
- What shipped
- Vercel preview URL
- Lighthouse scores
- Known issues / open questions
- What's next

This is the running build log.