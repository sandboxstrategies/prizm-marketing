# Prizm Marketing Site — Research Findings v5 (Round 3 Source Deep Dive)

**Compacted:** April 26, 2026 (continuation session, third deep round)
**Method change:** This round used `bash_tool` to clone repos and read actual source. Previous rounds were search-and-fetch only.
**Combines with:** v2 (master) + v3 (round 1) + v4 (round 2). Reading order: v2 → v3 → v4 → v5.
**Why this exists:** Rounds 1-2 inferred architecture from blog posts and search results. This round reads the actual Sat ūs source, the cc-settings repo, and the Gommage tutorial code. Several v3-v4 conclusions need updating.

---

## ★ THE FIVE CONCRETE ANSWERS THIS ROUND ★

If you read nothing else in v5, read these. Each one is sourced from actual code, not theory.

**1. The eleven errors are most likely WebGPU + transmission + render-target conflicts.** Sat ūs's `lib/webgl/utils/create-renderer.ts` auto-selects WebGPU on capable desktops via `if (!forceWebGL && isWebGPUAvailable() && !capability.isLowPower)`. The Dec 2025 forum thread documents exactly this break: WebGPU + custom transmission material + extra render targets = depth thickness fails, refraction goes black. **First fix to test:** add `forceWebGL={true}` to `<GlobalCanvas />` in app/layout.tsx. Five-minute test. If errors disappear, theory confirmed and we ship on WebGL.

**2. The canonical version baseline is locked.** Sat ūs's `package.json` ships with `three: 0.183.2`, `@react-three/fiber: ^9.5.0`, `@react-three/drei: ^10.7.7`, `postprocessing: ^6.38.2` (raw, NOT `@react-three/postprocessing`), `next: 16.2.0`, `react: 19.2.4`, `lenis: ^1.3.17`, `gsap: ^3.14.2`, `tempus: 1.0.0-dev.17`, `tunnel-rat: ^0.1.2`, `zustand: ^5.0.11`, `hamo: 1.0.0-dev.13`. **Run `bun pm ls` in the project and report any version drift.** Drift is the second-most-likely cause of the eleven errors.

**3. Sat ūs's GlobalCanvas IS configured for 2D shaders.** The actual config: `orthographic frameloop="never" linear flat dpr={[1,2]}` with an `OrthographicCamera makeDefault position={[0,0,5000]} near={0.001} far={10000} zoom={1}`. The `linear flat` settings mean `LinearSRGBColorSpace` + `NoToneMapping`. This is correct for AnimatedGradient (a 2D shader), but the prism needs perspective + ACES tone mapping. **The fix is drei `<View>` with its own `<PerspectiveCamera makeDefault>` and tone mapping applied at the EffectComposer level via `<ToneMapping mode={ToneMappingMode.ACES_FILMIC} />` at end of pipeline.** This works WITH the renderer being `flat`.

**4. cc-settings ships a `webgl` profile that is essentially a Phase 1B brief preamble.** It defines: behavioral mode (performance-obsessed, frame-rate-aware), priorities (frame rate > memory > correctness > performance > responsiveness), favored tools (`bun`, `r3f-perf`, `pinchtab`, `bun biome check --fix`, `/docs three`), R3F + GSAP + Lenis + Tempus patterns, performance budgets (60fps/16.67ms, geometry tier table, texture power-of-2), gotchas (GSAP hydration, memory leaks, `useMemo` not needed in R3F because React Compiler handles it), and a Pre-Implementation Checklist. **The brief should explicitly delegate Phase 1B to this profile via `/profile webgl` or `/skills webgl`.**

**5. The 10 darkroom agents are sophisticated enough to delegate Phase 1B by name.** `maestro` orchestrates, `planner` breaks down without implementing, `explore` is read-only research, `implementer` writes code, `reviewer` checks against Darkroom standards, `deslopper` cleans up before push, `oracle` answers Q&A with file:line citations, `scaffolder` for boilerplate, `security-reviewer` for OWASP/secrets, `tester` for Vitest. **The brief should name agents per phase:** planner first → explore the prior art (Vercel prism source) → maestro orchestrates implementer in parallel with scaffolder → reviewer + deslopper before push.

---

## 1. Sat ūs source code — the architecture, settled

### What I actually cloned and read

`darkroomengineering/satus` master branch, ~30 files in `lib/webgl/`, plus the example `app/(examples)/r3f/` page that demonstrates real usage. The architecture is now fully understood.

### The renderer selection chain (lib/webgl/utils/create-renderer.ts)

```typescript
// Try WebGPU first (unless forced to WebGL)
if (!forceWebGL && isWebGPUAvailable() && !capability.isLowPower) {
  try {
    const { WebGPURenderer } = await import('three/webgpu')
    const renderer = new WebGPURenderer({
      canvas, alpha,
      antialias: antialias && capability.dpr < 2,
      powerPreference, forceWebGL: false,
    })
    await renderer.init()
    return { renderer, type: 'webgpu', isWebGPU: true }
  } catch (error) {
    console.warn('WebGPU renderer failed, falling back to WebGL:', error)
  }
}

// Fall back to WebGL
const { WebGLRenderer } = await import('three')
const renderer = new WebGLRenderer({ canvas, alpha, antialias, powerPreference, precision, stencil, depth })
return { renderer, type: 'webgl', isWebGPU: false }
```

**Implications for the eleven errors:**
- On a non-low-power device with WebGPU support (most desktops in 2026), Sat ūs picks WebGPU
- WebGPU + transmission has the documented bug class (v4 §7)
- `<GlobalCanvas forceWebGL={true} />` bypasses WebGPU entirely
- This is a **5-minute diagnostic** — if errors disappear, root cause confirmed

### The GPU capability detection (lib/webgl/utils/gpu-detection.ts)

```typescript
const dpr = Math.min(window.devicePixelRatio || 1, 2)
const isLowPower = window.matchMedia('(any-pointer: coarse) and (hover: none)').matches

cachedCapability = {
  hasWebGPU, hasWebGL2, hasWebGL1,
  hasGPU: hasWebGPU || hasWebGL2 || hasWebGL1,
  preferredRenderer, // 'webgpu' | 'webgl2' | 'webgl1' | 'none'
  dpr,
  isLowPower,
}
```

**`isLowPower` is mobile detection.** On phones/tablets, `isLowPower: true` and WebGPU is skipped automatically. This means our SVG fallback gate at parent level (v2 §4) can simply use `useDeviceDetection().hasGPU` to know whether to render the prism or the SVG.

```tsx
function HeroPrism() {
  const { hasGPU, isLowPower } = useDeviceDetection()
  
  // SVG fallback for low-end devices
  if (!hasGPU || isLowPower) return <SVGPrismFallback />
  
  return <Wrapper webgl><WebGLPrism /></Wrapper>
}
```

That's the clean integration path with the SVG fallback. Mobile + iPhone SE 2nd gen automatically gets the SVG.

### The actual canvas config (lib/webgl/components/global-canvas/index.tsx)

```tsx
<Canvas
  gl={async (props) => {
    const { renderer, type } = await createRenderer({
      canvas: props.canvas as HTMLCanvasElement,
      alpha,
      antialias: !postprocessing && capability.dpr < 2,
      powerPreference: 'high-performance',
      stencil: !postprocessing,
      depth: !postprocessing,
      forceWebGL,
    })
    setRendererType(type)
    return renderer
  }}
  dpr={[1, capability.dpr]}
  orthographic
  frameloop="never"
  linear
  flat
  eventSource={document.documentElement}
  eventPrefix="client"
  resize={{ scroll: false, debounce: 500 }}
>
  <SheetProvider id="webgl">
    <OrthographicCamera makeDefault position={[0, 0, 5000]} near={0.001} far={10000} zoom={1} />
    <RAF render={shouldRender} />
    <FlowmapProvider>
      {postprocessing && <PostProcessing />}
      <Suspense>
        <WebGLTunnel.Out />
      </Suspense>
    </FlowmapProvider>
    <Preload />
  </SheetProvider>
</Canvas>
```

**Critical observations:**
1. `frameloop="never"` — render loop is manually driven by the RAF component (Tempus-based)
2. `linear flat` — renderer is in `LinearSRGBColorSpace` with `NoToneMapping`
3. `OrthographicCamera makeDefault` — DEFAULT camera is ortho. Views can override.
4. `stencil: !postprocessing, depth: !postprocessing` — when postprocessing is on, the renderer drops stencil/depth (postprocessing manages its own framebuffers)
5. `SheetProvider id="webgl"` — Theatre.js choreography is wired in by default
6. `<Suspense><WebGLTunnel.Out /></Suspense>` — tunneled content renders here, lazy-loaded

### The RAF component (lib/webgl/components/raf/index.ts)

```typescript
import { useTempus } from 'tempus/react'

export function RAF({ render = true }) {
  const advance = useThree((state) => state.advance)
  useTempus((time: number) => {
    if (render) advance(time / 1000)
  }, { priority: 1 })
  return null
}
```

**This is the Tempus orchestration spine integration.** Tempus drives R3F's `advance()` at priority 1. The Tempus orchestration we specced in v3 §1 IS the right pattern — Sat ūs already uses it. Our brief just needs to confirm Lenis is wired into Tempus before the canvas advance.

### The actual postprocessing setup (lib/webgl/components/postprocessing/index.ts)

```typescript
import { CopyPass, EffectComposer, RenderPass } from 'postprocessing'
import { HalfFloatType } from 'three'

const [composer] = useState(() =>
  new EffectComposer(gl, {
    multisampling: isWebgl2 && needsAA ? maxSamples : 0,
    frameBufferType: HalfFloatType,
  })
)

// Default chain is just RenderPass + CopyPass — empty, ready for effects
useEffect(() => {
  const renderPass = new RenderPass(scene, camera)
  const copyPass = new CopyPass()
  composer.addPass(renderPass)
  composer.addPass(copyPass)
  return () => {
    composer.removePass(renderPass)
    composer.removePass(copyPass)
    renderPass.dispose()
    copyPass.dispose()
  }
}, [composer, scene, camera])

// Renders LAST, after everything else
useFrame((_, deltaTime) => {
  composer.render(deltaTime)
}, Number.POSITIVE_INFINITY)
```

**Key facts:**
- Sat ūs uses raw `postprocessing` package, NOT `@react-three/postprocessing`
- Default chain is empty (RenderPass + CopyPass only) — ready for effects to be added
- `HalfFloatType` framebuffer for HDR (good — supports our cinematic LUT)
- `multisampling: maxSamples` when DPR < 2 (smart — disables MSAA when DPR=2 saves AA work)
- `Number.POSITIVE_INFINITY` priority means this runs LAST after everything

For Phase 1B we either:
- **Extend this PostProcessing component** with our prism-specific effects (Bloom + LUT + ToneMapping)
- OR **add per-View postprocessing** inside our prism's `<View>` (cleaner, doesn't affect AnimatedGradient)

### The actual usage pattern (app/(examples)/r3f/_components/box/)

The Box example shows the canonical pattern for DOM-synced 3D:

```tsx
// box/index.tsx (the React UI component)
'use client'
import { WebGLTunnel } from '@/webgl/components/tunnel'
import { useWebGLElement } from '@/webgl/hooks/use-webgl-element'

const WebGLBox = dynamic(() => import('./webgl').then(({ WebGLBox }) => WebGLBox), { ssr: false })

export function Box({ className }: { className: string }) {
  const { setRef, rect, isVisible } = useWebGLElement<HTMLDivElement>()
  const progressRef = useRef(0)
  
  const [setTriggerRef] = useScrollTrigger({
    start: 'top bottom', end: 'bottom top',
    onProgress: ({ progress }) => { progressRef.current = progress },
  })
  
  return (
    <div ref={(node) => { setRef(node); setTriggerRef(node) }} className={className}>
      <WebGLTunnel>
        <WebGLBox rect={rect} visible={isVisible} progressRef={progressRef} />
      </WebGLTunnel>
    </div>
  )
}

// box/webgl.tsx (the 3D twin)
'use client'
import { useFrame } from '@react-three/fiber'
import { useWebGLRect } from '@/webgl/hooks/use-webgl-rect'

export function WebGLBox({ rect, visible, progressRef }) {
  const meshRef = useRef<Mesh | null>(null)
  
  useFrame(() => {
    if (!(visible && meshRef.current)) return
    const rotation = progressRef.current * Math.PI * 4
    meshRef.current.rotation.set(rotation, rotation, 0)
    meshRef.current.updateMatrix()
  })
  
  useWebGLRect(rect, ({ scale, position, rotation }) => {
    meshRef.current?.position.set(position.x, position.y, position.z)
    meshRef.current?.rotation.set(rotation.x, rotation.y, rotation.z)
    meshRef.current?.scale.setScalar(scale.x)
    meshRef.current?.updateMatrix()
  }, { visible })
  
  return (
    <mesh matrixAutoUpdate={false} ref={meshRef}>
      <boxGeometry />
      <meshNormalMaterial />
    </mesh>
  )
}
```

**This is the canonical Sat ūs pattern.** For our prism we'd use it the same way:
- `components/prism/index.tsx` — DOM container with scroll trigger, dynamic-imports the WebGL twin
- `components/prism/webgl.tsx` — The 3D mesh + drei `<View>` + perspective camera + transmission material + effects

The `useWebGLElement` hook returns `{ setRef, rect, isVisible }` — `isVisible` is the IntersectionObserver value we use to gate the frame loop. `useWebGLRect` syncs mesh transform to DOM rect. `matrixAutoUpdate={false}` is a perf optimization — we manually call `updateMatrix()` instead of letting Three do it every frame.

### One caveat to note

The Box example doesn't use drei `<View>`. It just puts the mesh DIRECTLY in the global canvas. This is fine for `meshNormalMaterial` (which doesn't care about color space) but won't work for our prism's transmission material with HDR environment lookup. The brief should specify: **wrap the prism's WebGL content in `<View>` with its own perspective camera + environment + effects**.

---

## 2. cc-settings — what Knighthawk now has

### The 10 agents

| Agent | Trigger | Tools | Effort |
|---|---|---|---|
| **deslopper** (cyan) | Find duplicate/dead code, "DRY this up", before push | Read, Edit, Grep, Glob, LS, Bash, Agent, AskUserQuestion, Team | high |
| **explore** (purple) | "How does X work?", "Find Y", "Map architecture", read-only research | Read, Grep, Glob, LS, Bash, WebFetch | medium |
| **implementer** (green) | "Implement X", "Build Y", "Apply the plan" | Read, Write, Edit, MultiEdit, Bash, Grep, Glob, LS, TodoWrite | high |
| **maestro** (red) | "Implement full feature X", "Refactor across codebase", 3+ agent coordination | Read, Write, Edit, MultiEdit, Bash, Grep, Glob, LS, TodoWrite, Agent | max |
| **oracle** (gold) | "Why is X done this way?", deep Q&A with file:line citations | Read, Grep, Glob, LS, WebFetch, Bash | medium |
| **planner** (blue) | "Plan X", "Break down Y", architecture roadmaps without code | Read, Grep, Glob, LS | medium |
| **reviewer** (yellow) | "Review my changes", PR review against Darkroom standards | Read, Grep, Glob, LS, Bash | high |
| **scaffolder** (magenta) | "Create new component", boilerplate generation | Read, Write, Edit, Bash, Glob, LS | low |
| **security-reviewer** (red) | OWASP audit, secrets scanning, before production deploys | Read, Grep, Glob, Bash | high |
| **tester** (cyan) | Vitest unit tests, "Run the tests" | Read, Write, Edit, Bash, Grep, Glob, LS | medium |

**Critical detail:** `implementer`, `deslopper`, `scaffolder`, `security-reviewer`, `tester` use `isolation: worktree` — they create separate git worktrees. This means parallel agents can work without stepping on each other's commits.

### The 5 profiles

`maestro.md`, `nextjs.md`, `react-native.md`, `tauri.md`, **`webgl.md`** ← Phase 1B uses this.

### The 39+ skills

Functional categories:

**Investigation:** ask, audit, autoresearch, debug, discovery, explore, fix, learn, oracle, premortem, qa, review, tldr, verify

**Build/scaffold:** build, component, hook, init, project, refactor, scaffolder, ship

**Coordination:** checkpoint, consolidate, create-handoff, context, design-tokens, docs, f-thread, l-thread, orchestrate, prd, resume-handoff, teams

**Specific tools:** figma (Figma MCP integration), **lenis** (smooth scroll patterns specifically), lighthouse (perf audit)

**Reference docs (not skills):** accessibility.md, architecture-reference.md, security-reference.md, seo-reference.md

**Notable for Phase 1B:**
- `lenis` skill — smooth scroll patterns specifically for Sat ūs
- `lighthouse` skill — runs Lighthouse audit on perf
- `qa` skill — visual QA via `pinchtab`
- `figma` skill — design token extraction from Figma file
- `design-tokens` skill — design token system management
- `verify` skill — pre-ship verification
- `ship` skill — deployment workflow
- `premortem` skill — anticipate failure modes before building

### The 11 rules

`accessibility.md`, `git.md`, `performance.md`, `react-perf.md`, `react.md`, `security.md`, `style.md`, `typescript.md`, `ui-skills.md`, `web-vitals.md`, plus README.md.

These are coding standards that all agents check against.

### The 5 contexts

`react-native.md`, `tauri.md`, `web.md`, **`webgl.md`** ← short reference that activates webgl mode.

### The 5 MCP servers (verified in Knighthawk's `~/.claude.json`)

- **context7** — documentation lookup (`/docs three`, `/docs gsap`, `/docs drei` etc. resolve through this)
- **Sanity** — CMS integration
- **tldr** — fast file/codebase summary tool
- **figma** — Figma file integration for design token extraction
- **chrome-devtools** — **live perf debugging on actual browser instances** ← critical for Phase 1B verification

The `chrome-devtools` MCP is the one that makes Phase 1B verifiable. It lets Claude Code launch a Chrome instance, run Lighthouse, capture FPS data, screenshot the page at scroll positions, and report back. This is the iteration loop tooling we specced in v3 §15 — it's already there.

---

## 3. The webgl profile — Phase 1B preamble

The full `cc-settings/profiles/webgl.md` is 454 lines. The substance:

### Behavioral mode
> "Performance-obsessed, frame-rate-aware, GPU-conscious."

### Priorities (in order)
1. Frame Rate (60fps, no jank)
2. Memory (dispose on unmount, no leaks)
3. Correctness (visual matches intent)
4. Performance (draw calls minimized, instancing used)
5. Responsiveness (adapts to device capabilities)

### Tools
| Task | Command |
|---|---|
| Package manager | `bun` (never npm/yarn) |
| Dev server | `bun dev` |
| Performance monitor | `r3f-perf` component |
| Fetch docs | `/docs three`, `/docs gsap`, `/docs lenis` |
| Visual QA | `/qa` or `pinchtab` |
| Linting | `bun biome check --fix` |

### Pre-implementation checklist
- [ ] Fetched latest docs for R3F, GSAP, Lenis
- [ ] GSAP dynamically imported (no SSR)
- [ ] Cleanup functions dispose resources
- [ ] Performance monitoring in dev mode
- [ ] Responsive DPR and geometry quality
- [ ] Instancing for repeated objects

### Performance budgets
- Target: 60fps = 16.67ms per frame
- Safe budget: ~10ms for JS (leave room for rendering)
- Geometry tiers: low-poly < 10K tris, medium 10-50K, high 50-200K, hero asset 200K+
- Texture: power of 2 dimensions (512, 1024, 2048), KTX2/Basis compression preferred

### Gotchas
- GSAP hydration errors → dynamic import with `{ ssr: false }`
- Memory leaks → dispose geometry/material in cleanup
- Scroll jank with ScrollTrigger → integrate Lenis properly
- Low FPS on mobile → reduce `dpr`, simplify geometry
- Texture size issues → use power-of-2
- Too many draw calls → use `<Instances>`
- **`useMemo` in R3F → Not needed - React Compiler handles it** ← matches v2/v3
- Missing cleanup → always return cleanup in `useEffect`/`useGSAP`

### Common patterns it includes inline
- Scroll-driven 3D with `useLenis`
- Responsive Canvas (`dpr` and `fov` change on mobile)
- Loading states with `<Suspense>` + `<Html>` + `useProgress`
- Instancing via `<Instances limit={count}>`
- Cleanup via `scene.traverse` + dispose
- GSAP timeline with ScrollTrigger pin
- Lenis + ScrollTrigger integration (the same orchestration we specced in v3)

**Phase 1B brief should literally just reference this profile.** No need to redocument any of it — Claude Code can switch into `webgl` profile and have all of it loaded.

---

## 4. The Gommage tutorial code — Phase 2 reference

I cloned `WallabyMonochrome/WebGPU-clair-obscur-gommage-codrops`. It's a working WebGPU + TSL implementation with MSDF text dissolve, dust particles, petal particles with bend+spin, and selective bloom via MRT.

### Key architecture

```
src/
├── experience.js          # Main scene/camera/renderer setup, postprocessing
├── gommageOrchestrator.js # Orchestrates effects, GSAP triggers
├── msdfText.js            # MSDF text with noise dissolve
├── dustParticles.js       # InstancedMesh dust with TSL animation
├── petalParticles.js      # InstancedMesh petals with bend+spin
└── debug.js               # Tweakpane singleton
```

### The selective bloom MRT pattern (most relevant for Prizm)

```typescript
// In experience.js
const scenePass = pass(this.#scene, this.#camera);
scenePass.setMRT(mrt({
  output,                         // standard color output
  bloomIntensity: float(0),       // extra render target for bloom mask
}));

const outputPass = scenePass.getTextureNode();
const bloomIntensityPass = scenePass.getTextureNode('bloomIntensity');
const bloomPass = bloom(outputPass.mul(bloomIntensityPass), 0.8);
this.#webgpuComposer.outputNode = scenePass.add(bloomPass).renderOutput();

// In each material that should bloom:
material.mrtNode = mrt({
  bloomIntensity: float(0.4).mul(dissolve),  // selective per-material intensity
});
```

**This is the cleanest selective-bloom pattern available.** Instead of using `luminanceThreshold` to gate bloom (which catches anything bright), MRT lets each material declare its own bloom mask intensity. The dust gets `0.5 * fadingOut`, petals get `0.7 * fadingOut`, the dissolving text gets `0.4 * dissolve`.

For our prism on WebGL (not WebGPU/TSL), we have to use the simpler approach: `<Bloom luminanceThreshold={1.1} />` with `emissiveIntensity > 1.1` on the parts we want to bloom (prism seams, particle highlights). This is OK but less surgical. **Phase 2 upgrade path: switch to TSL/MRT once WebGPU+transmission bugs resolve.**

### The other relevant patterns

- **Camera FOV preservation on resize**: stores horizontal FOV, recomputes vertical based on aspect — keeps composition stable
- **Combined attribute optimization**: pack 4 floats into one `aBirthLifeSeedScale` attribute (Birth, Life, Seed, Scale) instead of 4 separate attributes — important because WebGPU has a 9 attribute limit on InstancedMesh
- **Two perlin samples for X/Y turbulence**: sample noise at `noiseUv` and `noiseUv + vec2(13.37, 7.77)` for independent X/Y turbulence — cheap trick for organic motion
- **Lifetime-based animation**: `lifeInterpolation = clamp(dustAge.div(aLife), 0, 1)`, then derive `scaleFactor` (smoothstep at start) and `fadingOut` (smoothstep at end) from this single value
- **GSAP-driven progress uniform**: `gsap.to(this.#uProgress, { value: 1, duration: 4 })` updates a TSL uniform that the shader reads — the GSAP-to-shader bridge

These patterns are repository-tier reference. Save `WallabyMonochrome/WebGPU-clair-obscur-gommage-codrops` as canonical Phase 2 reference for WebGPU+TSL particle systems.

---

## 5. The diagnostic ladder for the eleven errors (concrete this round)

In order of likelihood + effort. Stop at the first one that resolves the issue.

### Step 1 — Force WebGL bypass (5 minutes)

```tsx
// app/layout.tsx
<GlobalCanvas forceWebGL={true} />
```

If errors clear → root cause was WebGPU + transmission bug class. Ship on WebGL primary, treat WebGPU as future enhancement. **This should be tried first.**

### Step 2 — Version drift check (10 minutes)

```bash
cd ~/Projects/prizm-marketing
bun pm ls 2>&1 | grep -E "three|react-three|postprocessing|next|react|lenis|gsap|tempus|tunnel-rat"
```

Compare to canonical baseline:
- `three: 0.183.2` (or 0.179.x if 0.180+ MTM bug confirms)
- `@react-three/fiber: ^9.5.0`
- `@react-three/drei: ^10.7.7`
- `postprocessing: ^6.38.2` (raw, not React wrapper)
- `next: 16.2.0`, `react: 19.2.4`
- `lenis: ^1.3.17`, `gsap: ^3.14.2`, `tempus: 1.0.0-dev.17`

**Specific concern:** three.js 0.180.0 had a documented MTM compatibility break ("ShaderMaterial of DiscardMaterial incompatibility"). If your project ended up on 0.180.0, downgrade to 0.179.x or upgrade to 0.183.x.

### Step 3 — `forceSinglePass: false` flag (15 minutes)

```tsx
<MeshTransmissionMaterial
  forceSinglePass={false}
  // ... other props
/>
```

Standard MTM workaround for shader compilation order issues. Adds a render pass but resolves a class of known MTM bugs.

### Step 4 — Architectural conflict — wrap prism in `<View>` (1-2 hours)

If the eleven errors persist after steps 1-3, the issue is the architectural conflict between AnimatedGradient (needs `linear flat ortho`) and the prism (needs `sRGB ACES perspective`). Refactor the prism's WebGL component to use drei `<View>` with its own perspective camera, environment, and effects:

```tsx
import { View, PerspectiveCamera, Environment } from '@react-three/drei'
import { EffectComposer, Bloom, ToneMapping } from '@react-three/postprocessing'
import { ToneMappingMode } from 'postprocessing'

export function WebGLPrism({ rect, visible }) {
  return (
    <View track={containerRef}>
      <PerspectiveCamera makeDefault fov={35} position={[0, 0, 5]} />
      <Environment preset="studio" />
      <ambientLight intensity={0.3} />
      <directionalLight position={[5, 5, 5]} intensity={0.8} />
      
      <PrismMesh ref={meshRef}>
        <MeshTransmissionMaterial 
          forceSinglePass={false}
          ior={1.5}
          chromaticAberration={0.06}
          // ... other props
        />
      </PrismMesh>
      
      <EffectComposer disableNormalPass>
        <Bloom mipmapBlur luminanceThreshold={1.1} levels={9} intensity={1.5} />
        <ToneMapping mode={ToneMappingMode.ACES_FILMIC} />
      </EffectComposer>
    </View>
  )
}
```

Note: this requires installing `@react-three/postprocessing` (Sat ūs uses raw `postprocessing` directly, but for per-View effects the React wrapper is cleaner). Add to `package.json`: `"@react-three/postprocessing": "^3.0.0"`.

### Step 5 — Last resort: add the screenshots and console errors

If steps 1-4 don't resolve the issue, capture:
- `bun pm ls` full output
- 11 actual console error texts (copy-paste from devtools)
- A screenshot of the rendered hero (showing what's visible vs. expected)
- Browser + OS version

Send these and we'll dig into the specific error class.

---

## 6. Updated reference studio table

Adding Exo Ape and confirming Active Theory positioning:

| Studio | Location | Strength | Tier | Replicable? |
|---|---|---|---|---|
| **darkroom.engineering** | Multiple | Sat ūs author, Ibicash, Looped | T1 | YES — direct toolchain match |
| **Studio Freight** | NYC | Brutal Elegance, Brex/Mercury/Dragonfly | T1 | YES — design partner pattern |
| **basement.studio** | Argentina | Vercel Ship prism, Webby 2026 | T1 | YES — direct prism prior art (v4 §1) |
| **14islands** | Stockholm/Reykjavík | r3f-scroll-rig, Cartier Yearbook | T1 | YES — architectural pattern source |
| **ToyFight®** | Manchester | INK Games one-canvas, ToyBox starter | T1 | YES — operational playbook |
| **Exo Ape** | Roermond, NL | Amaterasu, Columbia 100, Pixelflakes | T1 | YES — philosophy match (3-person studio) |
| **Active Theory** | Venice Beach + Amsterdam | Hydra (proprietary), Apple/Nike-tier work | T0 | NO — Hydra is proprietary, not OSS |
| **Lusion** | London | Buttery motion, animation systems | T1 | YES — animation calibration |
| **Utsubo** | (multi) | Engineering-led WebGPU/WebGL with perf budgets | T1 | YES — engineering rigor |
| **Resn** | Wellington NZ | Listed as Lenis user | T1 | (didn't research) |
| **Locomotive** | Montreal | Original Locomotive Scroll | T1 | (didn't research) |
| **Immersive Garden** | France | Bruno Simon's former studio | T1 | (didn't research) |
| **Naughtyduk** | (specified) | Codrops studio spotlight | T1 | (didn't research) |

**T0 (Active Theory) is aspirational ceiling, ~70-85% of effects reachable on OSS stack.** The remaining 15-30% requires custom engine work (their Aura runtime, Hydra 3D engine).

**T1 is the achievable target.** Vercel × basement.studio's prism is in T1 and used the exact stack we have. Match T1, don't chase T0.

### Exo Ape's philosophy — adopt explicitly

Their tagline: *"In the rush to be first, most forget to be meaningful. We choose to stay in the slow part of the process, because only what is built with depth can truly resonate."*

This is your "elite or the few" philosophy in studio form. The brief should reference this directly — it's the quality bar for Phase 1B (and a reminder that ambitious doesn't mean rushed).

Their Amaterasu project (Silver Lovie + multiple SOTD) translated quantum algorithms into "something a person could actually feel and understand." The Prizm parallel: solar physics + operations complexity translated into something operators FEEL the simplicity of. Same play.

---

## 7. Updated brief structure (concrete this round)

The Phase 1B brief should be ~5,000 tokens with these sections:

### Pre-flight (Knighthawk runs before any code)

1. Restart Claude Code, run `/plugin list` to verify cc-settings active
2. Run `bun pm ls` and post version output
3. Test the WebGL force fix: add `forceWebGL={true}` to GlobalCanvas, observe if 11 errors clear
4. If still errors: capture them as text + screenshots, post

### Section 1 — Identity context

- The three locked frames (positioning: elite-or-few, thesis: Penrose-photonics, principle: keep-looking)
- Voice: operator-confident, Hormozi-coded without cringe
- Banned vocabulary list
- Locked hero copy
- Brand palette + brand mark spec
- Studio Freight's "Brutal Elegance" as the design north star
- Exo Ape's "stay in the slow part" as the quality north star

### Section 2 — The visual blueprint

- **Direct prior art:** Vercel × basement.studio Next.js Conf 2022 prism (v4 §1)
- Full code patterns: `calculateRefractionAngle`, `<Beam>`, `<Rainbow>`, EffectComposer + Bloom + LUT, drei `<PerformanceMonitor>` (v4 §1)
- Adapt their visual to our metaphor: light beams = the six tools converging into the Prizm OS
- Reference URL: https://nextjs.org/conf/oct22/registration (still up)

### Section 3 — Architecture: drei `<View>` single-canvas (v4 §2 + this round)

- One `<Canvas>` at Layout level (Sat ūs's `GlobalCanvas`)
- Each 3D section wrapped in `<View track={containerRef}>`
- Each View has own `<PerspectiveCamera makeDefault>`, `<Environment>`, materials
- WebGL scissor method renders each in its container's bounds
- Frame loop runs only when 3D visible (ScrollTrigger `onToggle` callbacks)
- Source: ToyFight INK Games case study + Sat ūs's existing GlobalCanvas

### Section 4 — Renderer: WebGL with drei MTM (v4 §7)

- WebGL primary, NOT WebGPU (Dec 2025 forum bug class)
- drei `MeshTransmissionMaterial` with `forceSinglePass: false`
- Tone mapping in postprocessing (NOT renderer): `<ToneMapping mode={ToneMappingMode.ACES_FILMIC}>` at end of EffectComposer
- WebGPU is Phase 2 enhancement when ecosystem fixes the bugs
- Source: Vercel prism shipped on WebGL; forum data confirms WebGPU+transmission unsolved

### Section 5 — Orchestration spine (v3 §1)

- Sat ūs already wires Tempus → Lenis → R3F via the RAF component
- We just need to confirm Lenis raf is added to Tempus before R3F advance
- GSAP 3.14.2 with `gsap.ticker.lagSmoothing(0)` and `gsap.updateRoot` driven by Tempus

### Section 6 — Hero scene proper

- Concept: Penrose golden triangle prism, 3-level Robinson subdivision (~13-17 facets)
- Camera path: subtle pull-toward via scroll, ~1600px scroll length
- Materials: drei MTM with cyan→ember spectrum, 8° axis tilt
- Particles: 5K desktop / 2K mobile with InstancedMesh
- Environment: drei `<Environment preset="studio">` for prototype, custom HDRI for polish
- Render scales: SVG nav (24-32px), SVG footer (32-48px), volumetric WebGL hero
- Source: v2 §6 (visual blueprint) + v4 §10 (Poly Haven HDRIs)

### Section 7 — Section choreography (v4 §2)

For our 7-section site, plan Views per section:
- Hero: View 1 (perspective, prism)
- Problem: View 2 (orthographic, chip-convergence with Elastica)
- Pillars: HTML/CSS only
- Features: HTML/CSS only or View 3-8 (small 3D)
- Prizm Custom: View 9 (close-up volumetric)
- Final CTA: View 10 (calmer prism reprise)
- Footer: HTML/CSS only

### Section 8 — Mobile fallback (v2 §4)

```tsx
const { hasGPU, isLowPower } = useDeviceDetection()
if (!hasGPU || isLowPower) return <SVGPrismFallback />
return <Wrapper webgl><WebGLPrism /></Wrapper>
```

iPhone SE 2nd gen and below get SVG. Hard cutoff: any device with `(any-pointer: coarse) and (hover: none)`. This is built into Sat ūs's `gpu-detection.ts`.

### Section 9 — Postprocessing (v4 §12)

```tsx
<EffectComposer disableNormalPass multisampling={isWebGL2 && dpr < 2 ? maxSamples : 0}>
  <Bloom mipmapBlur luminanceThreshold={1.1} levels={9} intensity={1.5} />
  <LUT lut={cinematicCubeFile} />
  <ToneMapping mode={ToneMappingMode.ACES_FILMIC} />  {/* MUST be last */}
</EffectComposer>
```

`luminanceThreshold` is 1.1 because we're using ACES_FILMIC (HDR > LDR mapping). Source: postprocessing v3.0 changes.

### Section 10 — Performance gating (v4)

- drei `<PerformanceMonitor>` with `onDecline` → `setDpr(1.5)`, `onIncline` → `setDpr(2)`
- Or use `r3f-perf` component (cc-settings webgl profile recommendation) for in-dev monitoring
- Frame loop: gated by `ScrollTrigger onToggle` per View visibility
- Particle counts: 5K desktop / 2K mobile / 0 on low-power
- Texture sizes: 512/1024/2048 power-of-2

### Section 11 — The eleven errors playbook (this round §5)

Diagnostic ladder, in order:
1. `forceWebGL={true}` (5 min)
2. `bun pm ls` version drift (10 min)
3. `forceSinglePass: false` (15 min)
4. Wrap prism in `<View>` with own camera/effects (1-2 hours)
5. Last resort: capture errors + screenshots, escalate

### Section 12 — Iteration loop protocol

- Use `chrome-devtools` MCP for live perf debugging
- Use `pinchtab` for visual QA (cc-settings ships this)
- Run `/qa` skill for per-iteration verification
- Lighthouse audit via `lighthouse` skill
- 5 iteration rounds, screenshot capture, self-critique against Vercel prism reference

### Section 13 — Agent delegation per phase

Phase 1B work plan:

1. **planner** delegates: "Plan the prism hero scene per the brief, output numbered task list with dependencies"
2. **explore** runs in parallel: "Read the Vercel prism case study URL, summarize the canvas setup, beam component, and rainbow shader pattern"
3. **maestro** orchestrates after planner output:
   - **scaffolder** creates the file structure (`components/hero/index.tsx`, `components/hero/webgl.tsx`, `components/hero/prism-geometry.ts`)
   - **implementer** writes the prism mesh, materials, and View setup
   - **implementer** writes the postprocessing chain
   - **implementer** writes the SVG fallback
4. **reviewer** runs: "Review against Darkroom standards, check for memory leaks, dispose patterns"
5. **deslopper** runs: "Check for dead code or duplication before push"
6. **tester** runs: "Run Lighthouse audit, verify 60fps desktop / 45fps mobile floor"

### Section 14 — Acceptance criteria

- Lighthouse mobile: Perf ≥ 90, A11y ≥ 95, BP ≥ 95, SEO ≥ 95
- Total page < 1.2MB, LCP ≤ 1.5s 4G mobile, CLS = 0
- 60fps iPhone 14 desktop, 45fps minimum low-end Android
- Browser support: Chrome/Edge 144+, Safari 17.5+, Firefox 130+
- iPhone SE 2nd gen and below = SVG fallback
- Visual reference match: side-by-side with Vercel prism, 80%+ visual fidelity

---

## 8. Open issues going into Phase 1B

1. **Sat ūs's `<PostProcessing>` component is global.** Adding effects there affects the AnimatedGradient. Per-View postprocessing requires careful handling — the brief should mark this as a Phase 1B unknown to validate during implementation.

2. **Need actual error texts.** Diagnostic Steps 1-3 should resolve common cases, but Step 5 (last resort) requires concrete error texts to match against forum reports. Knighthawk should capture these before brief execution if possible.

3. **Custom HDRI vs preset.** drei `<Environment preset="studio">` works for prototype. For brand-color match (cobalt + ember), custom HDRI from Poly Haven (Ferndale Studio 02 or TV Studio) gives better refraction sampling. Decide during iteration.

4. **3D vs HTML for non-hero sections.** Pillars, Features, Final CTA could be CSS-3D-perspective hybrids (ToyFight pattern) instead of WebGL Views. Cheaper, simpler, often visually sufficient. Brief should flag this as a perf-budget decision per section.

5. **Theatre.js deferred or not.** Sat ūs ships with Theatre.js wired in (`SheetProvider id="webgl"`). The hero camera path could be authored in Theatre Studio rather than coded. Trade-off: faster iteration on camera path, requires Theatre auth/login during dev. Brief should flag this as a tooling choice.

---

## 9. What the next research round (v6) would cover

If we go another round (and the user wants to), the highest-value remaining gaps:

1. **The Naughtyduk, Malvah, Forged studio spotlights** — three more Codrops studio stories I haven't read. Each ~10 minutes.

2. **Locomotive (Montreal)** — original Locomotive Scroll author, currently shipping their own creative dev work. T1 reference.

3. **Threejs.paris Sept 2026 conference content** — first dedicated Three.js conference, talks may be live as recordings by now.

4. **The actual basement.studio blog** — they wrote a Vercel Ship 3D badge tutorial that could include more refined patterns post-2022.

5. **Maxime Heckel's most recent posts** — caustics, volumetrics, transmission. He's the canonical R3F shader blogger and updates frequently.

6. **Bruno Simon's portfolio source** (bruno-simon.com on GitHub MIT license) — actual TSL+WebGL+WebGPU implementation of a creative dev portfolio.

7. **Three.js r190+ release notes** — track if WebGPU+transmission bugs got fixed.

8. **Cloning the Vercel prism case study source** — they linked CodeSandboxes, but a github repo with the full implementation may exist.

9. **Looking at Sat ūs's other example pages** (`app/(examples)/components/page.tsx`, `app/(examples)/sanity/`) for more patterns we haven't surfaced.

10. **r3f-perf vs PerformanceMonitor specifics** — cc-settings webgl profile recommends r3f-perf, Vercel prism uses drei PerformanceMonitor. Deciding which we use in Phase 1B affects monitoring reliability.

If time and energy permit, prioritize 1, 5, 6, 8 — those are the most likely to surface new patterns. The rest are calibration.

---

## TL;DR for v5

This round did three things prior rounds couldn't:

1. **Settled the architecture debate with actual code.** Sat ūs's `GlobalCanvas` is `linear flat orthographic` for AnimatedGradient. Our prism wraps in drei `<View>` with own perspective camera + ACES tone mapping in postprocessing. The brief now has the answer with a code path, not a guess.

2. **Cataloged the cc-settings tooling Knighthawk has access to.** 10 agents (each with delegation triggers and tool sets), 5 profiles (`webgl` is the Phase 1B preamble), 39+ skills (`lenis`, `lighthouse`, `qa`, `figma`, `design-tokens` are most relevant), 11 rules, 5 MCP servers (`chrome-devtools` is the perf-verification killer). The brief delegates by name.

3. **Locked the canonical version baseline.** Sat ūs ships with three 0.183.2 + R3F 9.5.0 + drei 10.7.7 + raw postprocessing 6.38.2 + next 16.2.0 + react 19.2.4 + lenis 1.3.17 + gsap 3.14.2. The brief specifies these, and step 2 of the diagnostic ladder is to verify Knighthawk's project matches.

Plus a concrete 5-step diagnostic ladder for the 11 errors, starting with the 5-minute `forceWebGL={true}` test which is most likely the root cause.

Ready to write the Phase 1B brief when you are.
