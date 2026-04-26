# Prizm Marketing Site — Research Findings v10 (Round 8: Project Playbook + Pre-Implementation Gotchas)

**Compacted:** April 26, 2026 (continuation session, eighth and final text round before experiential)
**Method:** Read the full Sat ūs project-level playbook (ARCHITECTURE/PATTERNS/BOUNDARIES/COMPONENTS docs that are also in your repo), traced the actual AnimatedGradient + Fluid sim code path that produces the 11 errors, audited Sat ūs's Wrapper/GSAPRuntime/Orchestra/Theatre integration mechanics, decided r3f-perf vs Stats, and synthesized a "pre-implementation gotchas" section for things the previous Phase 1B agent's code might collide with.
**Combines with:** v2 (master) + v3-v9 (prior rounds) + this round.
**Why this exists:** v9 closed aesthetic-DNA. v10 closes project-level convention questions. Anyone building inside Sat ūs has 8 patterns, 20 UI primitives, 19 hooks, 31 easings, 8 utility namespaces — all pre-built — that need to be respected, not rebuilt. Plus we now have certainty on the AnimatedGradient/Fluid/WebGPU interaction, the Theatre.js integration is turnkey not custom, and r3f-perf/Stats decision is settled.

---

## ★ THE FIVE BIG FINDINGS THIS ROUND ★

**1. Sat ūs ships a complete project-level playbook that reduces the rebuild surface area drastically.** ARCHITECTURE.md, PATTERNS.md, BOUNDARIES.md, COMPONENTS.md (all four exist in your project repo too). Together they document **8 patterns** (Compound Component, CSS Modules+Tailwind, Standard Context, Server/Client Decision, Integration Optionality, WebGL Element Lifecycle, useRef Object Instantiation, Import Conventions), **20 UI primitives** wrapping Base UI (Accordion, AlertDialog, Checkbox, Dropdown, Fold, Form, Image, Link, Marquee, Menu, NotConfigured, RealViewport, SanityImage, ScrollRestoration, Scrollbar, Select, Switch, Tabs, Toast, Tooltip), **5 layout components**, **4 effect components**, **19 hooks**, **8 utility namespaces** including 31 named easing functions. **None of this gets rebuilt — it gets used.**

**2. The AnimatedGradient material chain is now fully traced.** `AnimatedGradient` (DOM wrapper) → `WebGLAnimatedGradient` (R3F mesh inside WebGLTunnel) → `AnimatedGradientMaterial` (extends MeshBasicMaterial, uses onBeforeCompile pattern) → `useFlowmap('fluid')` returns `Fluid` instance → `Fluid` extends `RawShaderMaterial` ← **THIS is what fails on WebGPU.** Trace confirmed via reading the actual files. The hero canvas was never the problem (separate `<Canvas>`, runs WebGL by default). **`forceWebGL: true` on the GlobalCanvas is the canonical fix and is non-disruptive** — AnimatedGradient itself works fine on WebGL where it was designed to run.

**3. Theatre.js integration is turnkey via `<TheatreProjectProvider>`, not custom.** Sat ūs ships `lib/dev/theatre/` with provider component that fetches JSON state from a path (e.g. `/config/Hero.theatre-project-state.json`), instantiates project, waits for ready promise, sets state. Already wraps R3F. Already gated by Orchestra (Cmd/Ctrl+O toggle). For Phase 1B v2/cinematic camera, **this is plug-and-play** — author the timeline in dev, export JSON to `/public/config/`, ship.

**4. r3f-perf vs Stats decision settled.** Sat ūs's Orchestra includes a `stats/` panel already. **For dev: use Orchestra Stats** (no new dep). **For deep performance debugging: add `r3f-perf` as devDep** — shows FPS + draw calls + triangles + textures + shaders + GPU/CPU time + memory + render time. **Production: nothing.** Lighthouse + Vercel Analytics field data handles real-user monitoring. Don't ship perf tools to production.

**5. Pre-implementation gotchas — where the previous Phase 1B agent's code might collide with what we know now.** Six concrete items: (a) Don't add `<Header>`/`<Footer>` to layout.tsx — Wrapper does it. (b) Don't use `<a>` — Biome plugin enforces `<Link>`. (c) Don't use relative parent imports — Biome plugin enforces aliases. (d) Don't use `useMemo`/`useCallback`/`React.memo` — React Compiler handles it; use `useRef + null check` for class instantiation. (e) Use `useScrollTrigger` from `hamo`, not raw `gsap/ScrollTrigger`. (f) The hero scene's local `<Canvas>` is currently separate from the GlobalCanvas — moving to drei `<View>` inside WebGLTunnel needs to happen during rebuild, but ONLY after `forceWebGL: true` clears the 11 errors.

---

## 1. The Sat ūs project-level playbook

These four docs (ARCHITECTURE/PATTERNS/BOUNDARIES/COMPONENTS) ship with every Sat ūs project including yours. **PRIZM.md adds project-specific overrides on top.** What's in them:

### ARCHITECTURE.md key decisions

**React Compiler is enabled. Do NOT use `useMemo`, `useCallback`, or `React.memo`.**
```tsx
// ❌ Don't
const memoizedValue = useMemo(() => compute(a, b), [a, b])

// ✅ Do
const value = compute(a, b)
```
**Exception:** Use `useRef` for object instantiation to prevent infinite loops. **The current Prizm hero already follows this** (v6 §5 noted the geometry singleton pattern).

**CSS Modules + Tailwind hybrid:**
- **Tailwind (80%)** — spacing, colors, typography
- **CSS Modules** — complex animations, custom layouts, CSS specificity
- Import CSS modules as `s`: `import s from './component.module.css'`

**Custom Image/Link components mandatory:** Always `<Image>` from `@/components/ui/image` and `<Link>` from `@/components/ui/link`. Never native HTML or `next/image`/`next/link`. Image: optimization + aspect ratios + WebGL integration. Link: external detection + prefetching + consistent behavior.

**Lenis for scrolling** is already configured in `app/layout.tsx`. ScrollTrigger uses Lenis automatically.

**Optional Features Pattern** — Root layout uses `<OptionalFeatures />` from `@/lib/features` which conditionally loads WebGL, dev tools when needed.

**Cache Components (Next.js 16):**
| Data Type | Cache Strategy |
|---|---|
| Public content | ISR with `revalidate` |
| User-specific | `cache: 'no-store'` |
| Real-time | `cache: 'no-store'` |

For Prizm: marketing content is ISR. No user-specific data. No real-time data. **Default ISR is correct.**

**WebGL architecture:**
```
Root Layout → LazyGlobalCanvas (mounts on first WebGL page)
    └─ WebGLTunnel (portals 3D content)
        └─ Your 3D scene
```
Context survives navigation. **This is the architecture we're targeting for the rebuild** (v6 §6).

### PATTERNS.md — 8 documented patterns

#### Pattern 1: Compound Component
20 UI primitives wrap Base UI (`@base-ui/react`) with project styling. Two flavors:

**Pattern A — Namespace + Named Exports** (Accordion, Tabs):
```tsx
function Root({ children, className, ...props }: RootProps) {
  return <Collapsible.Root className={cn(s.accordion, className)} {...props}>{children}</Collapsible.Root>
}
function Button({ children, className, ...props }: HTMLAttributes<HTMLButtonElement>) {
  return <Collapsible.Trigger className={cn(s.button, className)} {...props}>{children}</Collapsible.Trigger>
}
export { Body, Button, Group, Root }
export const Accordion = { Group, Root, Button, Body }
```

**Pattern B — Function Properties** (Tooltip, Checkbox, Switch):
```tsx
function Tooltip({ content, children, side = 'top', className }: TooltipProps) { /* simple API */ }
Tooltip.Root = BaseTooltip.Root
Tooltip.Popup = Popup
export { Tooltip }
```

Rules: CSS Modules as `s`, merged via `cn()` from `clsx`. Always pass `className` through. Spread `{...props}` for extensibility.

#### Pattern 2: CSS Modules + Tailwind
File naming: `{component}.module.css` (not `index.module.css`). Always import as `s`. Combined: `<div className={cn(s.root, 'p-4', className)}>`.

#### Pattern 3: Standard Context
Utility at `lib/utils/context.ts`. Shape always `{ state, actions, meta? }`:
```tsx
const MyContext = createStandardContext<MyState, MyActions, MyMeta>('MyComponent')
function useMyComponent() {
  return useStandardContext(MyContext, 'useMyComponent')  // throws if outside provider
}
```

#### Pattern 4: Server vs Client Decision
**Default to Server Components.** Add `'use client'` only when using hooks, event handlers, browser APIs, context consumers. `'use client'` on first line, before imports. Server can import Client (not vice versa). All UI primitives in `components/ui/` are `'use client'`.

#### Pattern 5: Integration Optionality
All integrations self-contained in `lib/integrations/{name}/`. Use `isSanityConfigured()`, `isShopifyConfigured()`, etc. as guards. Renders `<NotConfigured integration="Sanity" />` if env vars missing.

#### Pattern 6: WebGL Element Lifecycle (the architecture cornerstone)
DOM-synced WebGL via tunnel. **DOM side:**
```tsx
function MyWebGLComponent({ className }: { className?: string }) {
  const { setRef, rect, isVisible } = useWebGLElement()
  const { WebGLTunnel } = useCanvas()

  return (
    <>
      <div ref={setRef} className={className} />
      <WebGLTunnel.In>
        <MyMesh rect={rect} visible={isVisible} />
      </WebGLTunnel.In>
    </>
  )
}
```

**WebGL side:**
```tsx
function MyMesh({ rect, visible }: { rect: Rect; visible: boolean }) {
  const meshRef = useRef<Mesh>(null)
  useWebGLRect(rect, ({ position, scale }) => {
    meshRef.current?.position.copy(position)
    meshRef.current?.scale.copy(scale)
  }, { visible })
  if (!visible) return null
  return <mesh ref={meshRef}>{/* geometry + material */}</mesh>
}
```

**This is SAT ŪS'S WAY OF DOING WHAT v6/v7 DESCRIBED AS DREI `<View>`.** Same concept, different implementation. **For the rebuild we should use Sat ūs's pattern (it's what AnimatedGradient already uses), not drei's `<View>`** — drei `<View>` would be redundant. WebGLTunnel + useWebGLElement + useWebGLRect is the canonical way.

#### Pattern 7: useRef for Object Instantiation
```tsx
// Persistent instances
const instanceRef = useRef<MyClass | null>(null)
if (!instanceRef.current) {
  instanceRef.current = new MyClass()
}

// Three.js objects with cleanup
const [material] = useState(() => new MeshBasicMaterial())
useEffect(() => () => material.dispose(), [material])
```

The current Prizm hero code already does this for the Penrose geometry. ✅

#### Pattern 8: Import Conventions
```tsx
import { Image } from '@/components/ui/image'      // path aliases
import { Link } from '@/components/ui/link'         // wrapper, not next/link
import s from './component.module.css'              // CSS Modules as 's'
import type { Metadata } from 'next'                // type-only (Biome enforced)
import { Tabs } from '@base-ui/react/tabs'          // sub-packages, not barrel
import cn from 'clsx'                               // default import
```

Import order (Biome enforced): React/framework → third-party → `@/` aliases → relative → CSS Module.

### BOUNDARIES.md — the simple rule

> *"One decision to make: Am I building my project or extending the starter?"*  
> *"Building your project → Modify freely (pages, styling, content)"*  
> *"Extending the starter → Create alongside existing components"*

For the rebuild: **app/(marketing) and components/ specific to Prizm = modify freely.** `lib/`, `lib/webgl/`, `components/ui/`, `components/layout/` = create new files alongside, don't modify.

### COMPONENTS.md — the "DO NOT REBUILD" manifest

20 UI primitives + 5 layout + 4 effect + 19 hooks + 8 utility namespaces. **Pre-built. Use them.**

#### UI primitives ready to import
| Component | Use case |
|---|---|
| `Accordion` | Collapsible sections — for the Problem section's 6-chip convergence reveal? |
| `Marquee` | Infinite scrolling ticker synced with Lenis. Could be the "47 days NTP → install" stat band |
| `Tooltip`, `AlertDialog`, `Toast` | If we ever need them |
| `Image` | **Always** instead of next/image |
| `Link` | **Always** instead of `<a>` or next/link — Biome enforces |
| `RealViewport` | Sets CSS `--vw`, `--dvh` etc. — already in Wrapper |
| `Form` + `Form/fields` | Server-action forms with validation. Future contact-form usage |

#### Layout components
| Component | Notes |
|---|---|
| `Wrapper` | **Includes Header + Footer + Theme + Lenis + Canvas.** Don't add these separately. |
| `Header`, `Footer` | Customize THESE for Prizm branding |
| `Lenis` | Smooth scroll synced with Tempus |
| `Theme` | Theme context provider (`useTheme()` hook) |

#### Effect components
| Component | Notes |
|---|---|
| `GSAPRuntime` | Mount once in root. Syncs GSAP ticker with Tempus. |
| `AnimatedGradient` | The WebGL animated gradient. **Used by Prizm FinalCta. Stays in v1.** |
| `SplitText` | GSAP SplitText for line/word/char — useful for hero H1 reveal |
| `ProgressText` | Scroll-driven word-by-word reveal — useful for Problem section |

#### 19 hooks
Critical ones for the rebuild:
- `useStore` — global nav state (zustand)
- `useDeviceDetection` — **isMobile/isDesktop/isReducedMotion/hasGPU/hasWebGPU/hasWebGL/gpuCapability/isLowPowerMode/dpr/isSafari/isFirefox**. Already used in current Prizm hero. ✅
- `usePrefetch(href)` — viewport-triggered route prefetch with network awareness
- `useScrollTrigger` from `hamo` — **NOT raw GSAP ScrollTrigger.** Sat ūs uses hamo's wrapper which is Lenis-aware
- `useMediaQuery` from `hamo` — `(query) => boolean`
- `usePreferredReducedMotion` — already in useDeviceDetection
- `useDocumentVisibility` — pause useFrame when tab inactive
- `useTransform` + `TransformProvider` from `hamo` — hierarchical transform context
- `useViewport` — viewport dimensions
- `useFlowmap('fluid')` — **the failing-on-WebGPU one.** Returns Fluid instance
- `useCanvas()` — `{ WebGLTunnel, DOMTunnel }` access
- `useWebGLElement()` — combined rect + visibility tracking for WebGL components
- `useWebGLRect(rect, onUpdate, options)` — DOM-to-WebGL position mapping with scroll sync

#### Utility namespaces

**`@/utils/math`**: `clamp, lerp, mapRange, truncate, modulo, roundTo, degToRad, radToDeg, distance, normalize`

**`@/utils/animation`**: `stagger, ease, fromTo, spring`. Re-exports math + easings + raf + viewport.

**`@/utils/easings`**: 31 named easing functions (`linear, quad, cubic, quart, quint, sine, expo, circ, back, elastic, bounce` × `in/out/inOut`). **No need to import GSAP eases for simple progress-based animations.**

**`@/utils/raf`**: `measure, mutate, batch` — DOM read/write batching to prevent layout thrashing. Useful when reading getBoundingClientRect during scroll.

**`@/utils/viewport`**: `desktopVW(value, width), mobileVW(value, width), desktopVH(value, height), mobileVH(value, height)` — px scaling relative to design widths (1728px desktop, 375px mobile).

**`@/utils/metadata`**: `generatePageMetadata` for Next.js metadata with OG/Twitter cards. **Use this for Prizm's metadata.**

**`@/utils/strings, fetch, rate-limit, context, validation`** — utilities. Not heavy use for Phase 1B.

---

## 2. The AnimatedGradient → Fluid → 11 errors trace, fully resolved

### What the code actually does (read end-to-end)

**`components/effects/animated-gradient/index.tsx`** — DOM wrapper:
```tsx
const WebGLAnimatedGradient = dynamic(() => import('./webgl').then(m => m.WebGLAnimatedGradient), { ssr: false })

export function AnimatedGradient({ className, style, ...props }) {
  const { setRef, rect, isVisible } = useWebGLElement<HTMLDivElement>()

  return (
    <div ref={setRef} className={className} style={style}>
      <WebGLTunnel>
        <WebGLAnimatedGradient rect={toDOMRect(rect)} visible={isVisible} {...props} />
      </WebGLTunnel>
    </div>
  )
}
```

It's the canonical Pattern 6 (WebGL Element Lifecycle): dynamic import the WebGL twin, useWebGLElement for rect+visibility, WebGLTunnel.In to portal up to the GlobalCanvas.

**`components/effects/animated-gradient/webgl.tsx`** — R3F twin:
```tsx
function WebGLAnimatedGradient({ rect, visible, /* ... */ }) {
  const flowmap = useFlowmap('fluid')  // ← grabs the Fluid instance
  
  const [material] = useState(() => new AnimatedGradientMaterial({
    /* ... */ 
    ...(hasFlowmap && { flowmap }),
  }))
  
  // ... uniforms updated on prop changes ...
  
  useWebGLRect(rect, /* ... */, { visible })
  return <mesh visible={visible} ref={meshRef}>{/* plane geometry */}</mesh>
}
```

Note `useState(() => new AnimatedGradientMaterial({ flowmap }))` — the canonical `useRef`/`useState` pattern for class instantiation (Pattern 7).

**`components/effects/animated-gradient/material.ts`** — the material:
```ts
export class AnimatedGradientMaterial extends MeshBasicMaterial {
  // ...
  constructor({ /* ... */, flowmap }: { /* ... */, flowmap?: Flowmap | Fluid }) {
    super({ transparent: true })
    this.uniforms = {
      uFlowmap: { value: flowmap?.uniform?.value ?? null },
      // ...
    }
    this.defines = {
      USE_FLOWMAP: !!flowmap,
      // ...
    }
  }
  // onBeforeCompile injects custom GLSL
}
```

**Critical insight:** `AnimatedGradientMaterial` extends `MeshBasicMaterial`, not `ShaderMaterial`. Uses `onBeforeCompile` to inject custom GLSL. **MeshBasicMaterial has a NodeMaterial-compatible counterpart in the WebGPU build** (`MeshBasicNodeMaterial`), so this would survive WebGPU. **But the `flowmap` it consumes IS the problem.**

**`lib/webgl/utils/fluid/fluid-sim.ts`** — the failing class:

The error trace points to line 605:
```ts
this.screen.material = this.curlMaterial
renderer.setRenderTarget(this.curl)
renderer.render(this.screen, this.screenCamera)  // ← line 605 throws
```

Inside the Fluid class which uses several `RawShaderMaterial` instances for fluid simulation passes (curl, vorticity, divergence, pressure, gradient, advection, splat, display). **Each RawShaderMaterial fires the "not compatible" error against WebGPU's NodeMaterial system.** That's where the 8-9 unique errors come from.

### Why `forceWebGL: true` is the canonical fix

```tsx
// app/layout.tsx
<GlobalCanvas postprocessing forceWebGL />
```

Sat ūs's `createRenderer.ts` (v5 §1) checks the `forceWebGL` flag. If true, skips WebGPU entirely. Fluid sim's RawShaderMaterials run against WebGLRenderer where they were designed to run. **All 11 errors clear.** AnimatedGradient renders correctly. Hero canvas is unaffected (separate canvas, was always WebGL). **No code change to AnimatedGradient or Fluid sim required.**

### Tracking the upstream fix

Sat ūs upstream (`darkroomengineering/satus`) needs to migrate `lib/webgl/utils/fluid/fluid-sim.ts` from RawShaderMaterial to NodeMaterial/TSL. **When that ships:**
1. Drop `forceWebGL` from GlobalCanvas
2. WebGPU auto-selects on capable devices
3. WebGL 2 fallback for older browsers
4. Performance gains where applicable

Watch for it. Until then, ship with `forceWebGL: true`.

---

## 3. Wrapper, GSAPRuntime, Orchestra — the standing infrastructure

### The Wrapper component (CRITICAL FOR THE BRIEF)

```tsx
// components/layout/wrapper/index.tsx
export function Wrapper({ children, theme = 'dark', lenis = true, webgl = true, className, ...props }) {
  return (
    <Theme theme={theme}>
      <Lenis options={lenis}>
        {webgl && <Canvas />}
        <Header />
        <main className={className}>{children}</main>
        <Footer />
      </Lenis>
    </Theme>
  )
}
```

**Critical rule from the source comment:** *"This component ALREADY includes <Header> and <Footer>. Do NOT add Header/Footer to layout.tsx or individual pages — they render here."*

**For the Prizm rebuild:** the marketing pages do this:
```tsx
// app/(marketing)/page.tsx
export default function Page() {
  return (
    <Wrapper theme="dark" webgl>
      <Hero />
      <Problem />
      <Pillars />
      <Features />
      <PrizmCustom />
      <FinalCta />
    </Wrapper>
  )
}
```

**No `<Header>`, no `<Footer>`, no `<Lenis>`, no `<Canvas>` — Wrapper handles all four.**

### GSAPRuntime — the orchestration spine

```tsx
// components/effects/gsap.tsx
import gsap from 'gsap'
import { useTempus } from 'tempus/react'

if (typeof window !== 'undefined') {
  gsap.defaults({ ease: 'none' })   // matches v3 §1
  gsap.ticker.lagSmoothing(0)       // disable lag smoothing
  gsap.ticker.remove(gsap.updateRoot)  // remove default ticker
}

export function GSAPRuntime() {
  useTempus((time) => {
    gsap.updateRoot(time / 1000)    // Tempus-driven ticker
  })
  return null
}
```

**Critical for the brief:** Mount `<GSAPRuntime />` ONCE in `app/layout.tsx`. After that, ALL GSAP animations use Tempus's frame loop. **No need to import gsap.ticker anywhere else.** And `gsap.defaults({ ease: 'none' })` means **every tween defaults to linear** — explicitly pass `ease: 'power2.inOut'` etc. when you want easing.

### Orchestra — the dev-tools meta-system

```tsx
// lib/dev/orchestra.ts
const Orchestra = createStore<OrchestraState>()(
  persist(
    subscribeWithSelector(() => ({}) as OrchestraState),
    { name: 'orchestra', storage: createJSONStorage(() => localStorage) }
  )
)
```

Tools wrapped:

| Tool | Trigger |
|---|---|
| Theatre.js | Animation debugging |
| Stats | FPS + performance |
| Grid | Layout grid overlay |
| Minimap | Page navigation |
| Dev Mode | Development toggle |
| Screenshot | Clean UI captures |

**Toggle: `Cmd/Ctrl + O`.** Persists in localStorage, syncs across tabs.

**Critical for the brief:** Don't reinvent the dev panel. Don't add custom Stats. Use Orchestra. Add leva ONLY for parameter calibration (MTM ior/chromaticAberration sliders), as v9 §2 specced.

### Theatre.js — turnkey via TheatreProjectProvider

```tsx
// lib/dev/theatre/index.tsx
export function TheatreProjectProvider({ children, id, config }) {
  const [project, setProject] = useState<IProject>()
  
  useLayoutEffect(() => {
    if (config) {
      fetch(config)                       // fetches /config/Project.json
        .then(r => r.json())
        .then(state => {
          const project = getProject(id, { state })
          if (project.isReady) setProject(project)
          else project.ready.then(() => setProject(project))
        })
    } else {
      const project = getProject(id)      // dev mode, no JSON
      project.ready.then(() => setProject(project))
    }
  }, [config, id])
  
  return <TheatreProjectContext.Provider value={project}>{children}</TheatreProjectContext.Provider>
}
```

**Phase 1B v2 / Phase 2 cinematic camera workflow** (when we move beyond Bruno's preset pattern):

1. Author camera path in dev with `<TheatreProjectProvider id="Hero">` (no config prop = uses studio for live editing)
2. Theatre Studio panel appears via Orchestra `Cmd/Ctrl+O` toggle
3. Drag camera, set keyframes
4. Export project state JSON via Studio's "Export project state" button
5. Save to `public/config/Hero.theatre-project-state.json`
6. In production code: `<TheatreProjectProvider id="Hero" config="/config/Hero.theatre-project-state.json">` — fetches JSON, no studio UI
7. Drive timeline in `useFrame`: `sheet.sequence.position = scrollProgress * sheet.sequence.length`

**This is THE production workflow from v6 §3 + v7 §2 — Sat ūs has it pre-wrapped.**

---

## 4. Lefthook + Biome — the enforcement layer

### Pre-commit hooks
```yaml
# lefthook.yml
pre-commit:
  parallel: true
  commands:
    biome:
      glob: '*.{js,mjs,ts,jsx,tsx,css,scss}'
      run: bun biome check --max-diagnostics=200 --write --unsafe {staged_files}
      stage_fixed: true
    typecheck:
      glob: '*.{ts,tsx}'
      run: bunx tsgo --noEmit --incremental false
      stage_fixed: false

post-merge:
  commands:
    install-deps:
      run: bun i
```

**Critical for the brief:**
- Biome auto-fixes + stages on every commit (including unsafe fixes)
- TypeScript check runs in parallel (using `tsgo`, not `tsc`)
- After every merge: auto-run `bun i`
- **No build verification on pre-push.** Builds happen in CI. *"Too slow for dev workflow."*

### Biome plugins enforce three rules

```json
// biome.json
"plugins": [
  "./.biome/plugins/no-anchor-element.grit",
  "./.biome/plugins/no-unnecessary-forwardref.grit",
  "./.biome/plugins/no-relative-parent-imports.grit"
]
```

**`no-anchor-element.grit`:** Bans `<a>` tags. Must use `<Link>`.

**`no-unnecessary-forwardref.grit`:** Bans `forwardRef` for components that don't actually need ref forwarding (React 19 doesn't need it for most cases).

**`no-relative-parent-imports.grit`:** Bans `import x from '../../foo'`. Must use path aliases (`@/...`).

**For the brief:** any code that violates these will fail pre-commit. Write the brief to specify the alias-based imports up front.

### Formatter rules
- 2-space indent
- LF line endings
- 80-char line width
- Auto-organize imports on save

---

## 5. r3f-perf vs Stats — the perf monitoring decision

### What's available

| Tool | Where | Shows | Cost |
|---|---|---|---|
| **Sat ūs Orchestra Stats** | `lib/dev/stats/` (already there) | FPS basics | Free, dev-only |
| **stats-gl** (Bruno's recommendation) | `npm i stats-gl` | FPS + GPU + CPU + Hz | Vanilla 3.js focused |
| **r3f-perf** (utsuboco) | `npm i -D r3f-perf` | FPS + draw calls + triangles + textures + shaders + GPU/CPU time + memory + custom data | R3F-specific, gold-standard |
| **drei `<Stats>` / `<StatsGl>`** | already in drei | Minimal FPS panel | Pre-included |

### Decision matrix

**For v1 dev:** Use Sat ūs Orchestra Stats. Already there, no new dep, already gated by `Cmd/Ctrl+O`.

**For deep performance debugging** (when Lighthouse scores aren't where we want them, or FPS drops on specific devices): `bun add -D r3f-perf`. Drop in `<Perf position="top-left" />` inside the Hero `<View>`. Read draw calls (target <100), triangles (target <8K per scene per PRIZM.md), GPU/CPU split, render time. Remove before deploy.

**For production:** **Nothing.** Vercel Analytics (already in PRIZM.md stack) provides field data. Lighthouse CI provides lab data. Don't ship perf tools to real users.

**Specific number targets** (from Utsubo's 100-tips guide):
- Draw calls: <100 per frame for 60fps. Prizm scene with 1 prism mesh + ~80 sparkles = ~30 draw calls.
- Triangles: <50K per scene for mobile, <500K desktop. Prizm Penrose mesh = ~13-17 facets × 2 triangles ≈ 30 triangles. Plus particles. Way under budget.
- Texture memory: monitor via `renderer.info.memory.textures`. Should stay stable, not climb.

### Add to brief
```diff
"devDependencies": {
+ "r3f-perf": "^7.2.3"
}
```
Use only during specific perf debugging passes. Not part of the standard dev loop.

---

## 6. Maxime Heckel's caustics post — what it actually says

### Article: "Shining a light on Caustics with Shaders and React Three Fiber" (Jan 2024)

URL: `blog.maximeheckel.com/posts/caustics-in-webgl/`

**Core technique:**
1. Render the transmissive mesh's normal map to an FBO (using a custom material that outputs world-space normals)
2. In a fragment shader on a ground plane, sample the normal map and compute caustic intensity by tracing virtual light rays through the refraction
3. Auto-scale the ground plane to bound the caustic pattern based on the mesh's bounding box
4. Use the Euclidean distance from the bounding cube vertices to size the plane safely

### The author's own recommendation

Maxime explicitly says at the end of his post: *"In the meantime, if you wish to have caustics running on your own project, I can't recommend `@react-three/drei`'s own Caustics component enough, which is far more production-grade than the implementation I went through here and will most likely cater to your project much better than this."*

**Translation: drei `<Caustics>` IS the production version of his post.** v7 §1 already noted drei's Caustics is the N8Programs implementation. Maxime's post is the THEORY GUIDE. drei is the implementation.

### For Prizm Phase 2

**If we want caustics under the prism** (light-pattern projection on a ground plane, reinforcing brand-mark presence):
- Use drei `<Caustics>` directly, not custom shader
- Frame-budget cost: prototype on actual mobile device, ~3-5ms per frame typical
- Read drei source for prop spec: `ior, bounces, intensity, worldRadius, backside, frames`
- If frame budget allows: ship in Phase 2 as atmospheric depth element

**For Phase 1B v1: NO caustics.** Just MTM glass + Lightformer environment + Sparkles. Budget reserved.

---

## 7. PRE-IMPLEMENTATION GOTCHAS — six things the previous Phase 1B agent might have done wrong

Based on what we've now learned, here are six concrete items where the existing implementation MIGHT collide with Sat ūs conventions or the recommended rebuild architecture. **Verify each during the rebuild.**

### Gotcha 1: Header/Footer in layout.tsx instead of Wrapper

**Wrapper already includes Header + Footer.** If `app/layout.tsx` separately imports/renders Header or Footer, they double-render.

**Check:** does `app/layout.tsx` import Header/Footer? If yes, remove. Wrapper handles it.

### Gotcha 2: Native `<a>` tags somewhere in the marketing copy

Biome plugin `no-anchor-element.grit` bans `<a>`. **The current Prizm hero CTAs and footer might use `<a>` for `cal.com` links.** Must convert to `<Link>` from `@/components/ui/link`. Link auto-detects external URLs and renders the right element.

```tsx
// ❌ Will fail pre-commit
<a href="https://cal.com/prizm-solar">Talk to the founder</a>

// ✅ 
<Link href="https://cal.com/prizm-solar">Talk to the founder</Link>
```

### Gotcha 3: Relative parent imports

If any file uses `import x from '../../foo'`, Biome will fail pre-commit. Must use `import x from '@/foo'`.

**Check:** grep `"\.\./\.\./"` in current Prizm code. Convert to aliases.

### Gotcha 4: useMemo / useCallback / React.memo

React Compiler is on. ARCHITECTURE.md explicitly says don't use these. **For class instantiation specifically, use `useRef + null check` pattern.** The current Prizm hero does this for the Penrose geometry (good). **Verify other components do too.**

### Gotcha 5: Two canvases

Current Prizm hero has its own local `<Canvas>` (per v6 §5). The rebuild should portal into Sat ūs's GlobalCanvas via `WebGLTunnel` (Pattern 6). **Critical sequence:**
1. First: add `forceWebGL` to GlobalCanvas — clears the 11 errors
2. Then: migrate hero scene from local `<Canvas>` to `useWebGLElement` + `WebGLTunnel.In` + `useWebGLRect` pattern
3. Result: ONE canvas, hero + AnimatedGradient + any future scenes coexisting

**Don't try to migrate before fixing the WebGPU issue.** Migration first if errors aren't cleared = errors propagate to hero.

### Gotcha 6: Direct `gsap.ticker` or `ScrollTrigger.create()` calls

GSAPRuntime drives gsap.ticker via Tempus. Direct `gsap.ticker.add(...)` calls fight with Tempus.

For ScrollTrigger: use `useScrollTrigger` from `hamo` (re-exported by Sat ūs hooks). It's Lenis-aware and uses Tempus for ticking.

```tsx
// ❌
import { ScrollTrigger } from 'gsap/ScrollTrigger'
useEffect(() => {
  ScrollTrigger.create({ /* ... */ })
}, [])

// ✅
import { useScrollTrigger } from 'hamo'
useScrollTrigger({
  start: 0,
  end: 1,
  onUpdate: ({ progress }) => { /* ... */ }
})
```

---

## 8. Updated Phase 1B blueprint — v10 final

Cumulative blueprint. Carry forward v2-v9 decisions, add v10 implementation conventions:

### File structure (Sat ūs convention)
```
app/
├── layout.tsx                    # GlobalCanvas + GSAPRuntime + ReactTempus
├── (marketing)/
│   ├── page.tsx                  # Wrapper + section components
│   ├── _sections/
│   │   ├── hero/
│   │   │   ├── index.tsx         # Hero DOM (uses useWebGLElement)
│   │   │   ├── webgl.tsx         # WebGL twin (lives in WebGLTunnel)
│   │   │   ├── prism-scene.tsx   # The actual R3F scene
│   │   │   ├── prism-mesh.tsx    # Geometry component
│   │   │   ├── svg-fallback.tsx  # SVG for reduced-motion
│   │   │   └── hero.module.css
│   │   ├── problem/
│   │   ├── pillars/
│   │   ├── features/
│   │   ├── prizm-custom/
│   │   └── final-cta/
│   └── _components/
│       └── (any shared marketing components)
public/
├── config/                       # Theatre.js JSON state files (Phase 2)
└── fonts/                        # Geist 1A
```

### app/layout.tsx
```tsx
import { GSAPRuntime } from '@/components/effects/gsap'
import { ReactTempus } from 'tempus/react'
import { GlobalCanvas } from '@/webgl/components/global-canvas'
import { OptionalFeatures } from '@/lib/features'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ReactTempus />
        <GSAPRuntime />
        <GlobalCanvas postprocessing forceWebGL />
        <OptionalFeatures />
        {children}
      </body>
    </html>
  )
}
```

**Five lines do all the global setup.** Everything else is in components.

### app/(marketing)/page.tsx
```tsx
import { Wrapper } from '@/components/layout/wrapper'
import { Hero } from './_sections/hero'
import { Problem } from './_sections/problem'
// ... etc

export const metadata = generatePageMetadata({
  title: 'Prizm — The Solar Operating System',
  description: '...',
  // ...
})

export default function Home() {
  return (
    <Wrapper theme="dark" webgl>
      <Hero />
      <Problem />
      <Pillars />
      <Features />
      <PrizmCustom />
      <FinalCta />
    </Wrapper>
  )
}
```

### app/(marketing)/_sections/hero/index.tsx
```tsx
'use client'

import dynamic from 'next/dynamic'
import { useWebGLElement } from '@/webgl/hooks/use-webgl-element'
import { useCanvas } from '@/webgl/components/canvas'
import { Link } from '@/components/ui/link'
import { useDeviceDetection } from '@/hooks/use-device-detection'
import { SVGPrismFallback } from './svg-fallback'
import s from './hero.module.css'

const HeroWebGL = dynamic(
  () => import('./webgl').then(m => m.HeroWebGL),
  { ssr: false, loading: () => null }
)

export function Hero() {
  const { setRef, rect, isVisible } = useWebGLElement<HTMLDivElement>()
  const { WebGLTunnel } = useCanvas()
  const { isReducedMotion } = useDeviceDetection()
  
  return (
    <section aria-labelledby="hero-h1" className={s.section}>
      <div className={s.copy}>
        <p className={s.eyebrow}>THE SOLAR OPERATING SYSTEM</p>
        <h1 id="hero-h1" className={s.h1}>
          Everyone on the same platform. <em>Nothing falling through.</em>
        </h1>
        <p className={s.subhead}>
          Sales, ops, commissions, integrations, and AI. One system. Built by operators.
        </p>
        <div className={s.ctas}>
          <Link href="https://cal.com/prizm-solar" className={s.ctaPrimary}>
            Talk to the founder
          </Link>
          <Link href="#problem" className={s.ctaSecondary}>
            See how it works
          </Link>
        </div>
        <p className={s.belowFold}>
          47 days NTP → install. The metric we built Prizm to fix.
        </p>
      </div>
      
      {/* Reserved layout space — CLS = 0 */}
      <div ref={setRef} className={s.prismContainer} aria-hidden="true" tabIndex={-1}>
        {isReducedMotion 
          ? <SVGPrismFallback /> 
          : (
            <WebGLTunnel.In>
              <HeroWebGL rect={rect} visible={isVisible} />
            </WebGLTunnel.In>
          )}
      </div>
    </section>
  )
}
```

### app/(marketing)/_sections/hero/webgl.tsx
```tsx
'use client'

import { useRef } from 'react'
import { useWebGLRect } from '@/webgl/hooks/use-webgl-rect'
import { Float, PerspectiveCamera, Environment, Lightformer, Sparkles, MeshTransmissionMaterial, PerformanceMonitor, AdaptiveDpr } from '@react-three/drei'
import { Leva, useControls } from 'leva'
import { PrismMesh } from './prism-mesh'
import type { Mesh } from 'three'

export function HeroWebGL({ rect, visible }: { rect: DOMRect; visible: boolean }) {
  const groupRef = useRef<Mesh>(null)
  
  useWebGLRect(rect, ({ position, scale }) => {
    if (groupRef.current) {
      groupRef.current.position.copy(position)
      // scale handled by camera positioning, not mesh
    }
  }, { visible })
  
  // Dev calibration controls (auto-hidden in production)
  const mtm = useControls('Prism MTM', {
    ior: { value: 1.55, min: 1, max: 2.5, step: 0.01 },
    chromaticAberration: { value: 0.07, min: 0, max: 0.5, step: 0.005 },
    thickness: { value: 0.4, min: 0.1, max: 2, step: 0.05 },
    samples: { value: 10, min: 4, max: 32, step: 1 },
    resolution: { value: 1024, min: 256, max: 2048, step: 128 },
    transmission: { value: 0.95, min: 0, max: 1, step: 0.01 },
    roughness: { value: 0.05, min: 0, max: 0.5, step: 0.01 },
    attenuationDistance: { value: 0.8, min: 0, max: 5, step: 0.1 },
    attenuationColor: '#7c4ff5',
  })
  
  if (!visible) return null
  
  return (
    <>
      <Leva hidden={process.env.NODE_ENV === 'production'} />
      
      <PerformanceMonitor 
        bounds={(refreshrate) => refreshrate > 90 ? [50, 90] : [50, 60]}
      />
      <AdaptiveDpr />
      
      <PerspectiveCamera makeDefault fov={35} position={[0, 0, 2.8]} />
      
      <Environment frames={1} resolution={256}>
        <Lightformer form="rect" intensity={2.5} color="#00cfee" position={[3, 4, 4]} scale={[4, 5, 1]} target={[0, 0, 0]} />
        <Lightformer form="rect" intensity={1.5} color="#7c4ff5" position={[-4, 1, 3]} scale={[3, 4, 1]} target={[0, 0, 0]} />
        <Lightformer form="rect" intensity={2} color="#00cfee" position={[0, 3, -4]} scale={[3, 3, 1]} target={[0, 0, 0]} />
        <Lightformer form="circle" intensity={1} color="#ffaa44" position={[0, -3, 0]} scale={5} target={[0, 0, 0]} />
      </Environment>
      
      <Float ref={groupRef} speed={1} rotationIntensity={0.5} floatIntensity={0.3} floatingRange={[-0.05, 0.05]}>
        <PrismMesh>
          <MeshTransmissionMaterial {...mtm} forceSinglePass={false} />
        </PrismMesh>
      </Float>
      
      <Sparkles count={80} scale={4} size={2} speed={0.3} color="#00cfee" opacity={0.6} />
    </>
  )
}
```

This is the v1 target. After leva A/B testing, lock the values, remove leva controls (or just gate via env), ship.

### Acceptance criteria for the brief

- ✅ Lighthouse mobile Performance ≥ 90
- ✅ Lighthouse mobile Accessibility ≥ 95  
- ✅ Lighthouse mobile BP ≥ 95
- ✅ Lighthouse mobile SEO ≥ 95
- ✅ LCP ≤ 1.5s on Vercel-deployed mobile-emulator
- ✅ CLS = 0 (reserved layout space for prism container)
- ✅ 60fps on iPhone 14 desktop emulation
- ✅ 45fps minimum on low-end Android (industry standard for mobile)
- ✅ Zero console errors on production build
- ✅ All 11 dev errors clear with forceWebGL: true
- ✅ Pre-commit Biome + tsgo passes (no anchor elements, no relative parent imports, no unnecessary forwardRefs)
- ✅ Visual reference 80%+ match to Vercel Next.js Conf prism (per v4) for confidence
- ✅ DNA alignment: feels closer to Cartier than Vercel demo (per v9)

---

## 9. Open questions still — v10 close

From v9 §7 carryforward + v10 deltas:

1-10: ~~All settled in prior rounds.~~ ✅

11. **Leva visibility flag:** ENV check (`process.env.NODE_ENV`), no keystroke needed. ✅ Decided v10.
12. **Lightformer intensity calibration:** A/B during rebuild via leva. v9 §6 target: key=2.5, fill=1.5, back=2, floor=1.
13. **Sound design:** Phase 2. ✅
14. **KTX2:** Phase 2. ✅
15. **Stats decision:** Orchestra Stats for dev, r3f-perf for deep debug, nothing in prod. ✅ Decided v10.
16. **Caustics for Phase 2:** drei `<Caustics>`, prototype + measure first. ✅ Settled v10.
17. **Existing implementation collisions:** 6 gotchas flagged in §7. **Verify each before brief locks.**

---

## 10. v11+ — Experiential round (Mac browser MCP, tomorrow)

This is what's left and it's big. Text research can't replace seeing motion.

### Sites to capture in detail

**1. Vercel Next.js Conf prism** — `nextjs.org/conf/oct22/registration`
- Camera path mechanics
- Refraction quality at scroll states
- Bloom intensity calibration
- Color spectrum animation

**2. basement.studio's own site (2025)** — `basement.studio`
- The PS1-walkthrough scene  
- Chromatic aberration intensity in their own brand mark
- Motion timing (their work is bolder than Cartier-luxury)

**3. Immersive Garden Cartier work**
- `immersive-g.com/projects/cartier-end-of-year-23`
- `immersive-g.com/projects/cartier-in-time`
- `immersive-g.com/projects/cartier-watches-and-wonders-24`
- `immersive-g.com/projects/dioriviera-1`
- Reference for "Cartier-grade restraint" — slow motion, soft palette, subtle chromatic, premium feel

**4. Active Theory portfolio** — `activetheory.net`
- The "alien-feeling 3D environment" reference
- Cinematic camera transitions

**5. Exo Ape Amaterasu** — `amaterasu.exoape.com`
- Per PRIZM.md and v6 references
- Slow camera moves, premium luxury 3D

**6. Lusion** — `lusion.co`
- "Award-winning 3D and interactive web studio"
- Recent client work tier reference

**7. moonfall.oblio.io** — the volumetric light rays site Yuri Artiukh reverse-engineered (v8 §3)
- See the actual volumetric light effect live
- For Phase 2 god-rays decision

**8. kentatoshikura.com** — the glass effect site Yuri reverse-engineered
- Closest aesthetic prior art for glass-like prism (per v8 §3)
- Compare to drei MTM result

**9. nextjs.org/ship** and `nextjs.org` recent product pages
- Vercel's marketing site evolution
- High-bar reference for Next.js product marketing pages

### What to capture per site

For each, screenshots + notes on:
- **Initial impression** — what hit emotionally first
- **Motion timing** — how slow/fast, what eases
- **Color restraint** — palette breadth, intensity
- **Chromatic intensity** — none / subtle / dramatic
- **Camera behavior** — static / scroll-driven / autonomous
- **Detail-to-impact ratio** — minimal/maximal
- **Audio** — present? type? volume?
- **Loading experience** — what shows during load
- **Mobile experience** — does it gracefully degrade?

### After experiential

Write **v11** with screenshots, motion captures, and a "what to copy / what to avoid" matrix mapping each site's specific moves to Phase 1B/2 decisions. Then write the **PHASE_1B_BRIEF.md**.

---

## TL;DR for v10

Five findings:

1. **Sat ūs ships a complete project-level playbook (8 patterns, 20 UI primitives, 19 hooks, 31 easings, 8 utility namespaces).** Pre-built. Use them. The "DO NOT REBUILD" list is now concrete.

2. **AnimatedGradient → Fluid → 11 errors trace fully resolved.** AnimatedGradient itself extends MeshBasicMaterial (would survive WebGPU). Its Fluid sim dependency uses RawShaderMaterial (the actual culprit). `forceWebGL: true` on GlobalCanvas is the canonical fix, non-disruptive, doesn't touch AnimatedGradient code.

3. **Theatre.js is turnkey via `<TheatreProjectProvider>`.** Author timeline in dev with studio, export JSON to `public/config/`, ship production with `config="/config/X.json"` prop. Sat ūs already wraps it. Phase 1B v2 / Phase 2 cinematic camera is plug-and-play.

4. **r3f-perf vs Stats settled.** Sat ūs Orchestra Stats for dev (already there). r3f-perf as devDep ONLY for deep performance debugging. Production: nothing — Vercel Analytics + Lighthouse handle it.

5. **Six pre-implementation gotchas flagged for the brief.** Header/Footer in Wrapper not layout, no `<a>` tags, no relative parent imports, no `useMemo`/`useCallback`, single canvas via WebGLTunnel not local `<Canvas>`, useScrollTrigger from hamo not raw GSAP. **Verify each in current implementation before brief locks.**

The brief is ready to write. v11 = experiential with browser MCP on Mac. Then strategic setup → PHASE_1B_BRIEF.md → implementation.
