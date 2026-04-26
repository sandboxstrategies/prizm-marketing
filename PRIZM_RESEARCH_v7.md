# Prizm Marketing Site — Research Findings v7 (Round 5: drei + Theatre + HDRI + basement OSS)

**Compacted:** April 26, 2026 (continuation session, fifth deep round)
**Method:** `git clone` + read source on drei (120 components), Theatre.js (full monorepo with R3F examples), web research on HDRI generation patterns and basement.studio OSS.
**Combines with:** v2 (master) + v3-v6 (prior rounds) + this round.
**Why this exists:** v6 settled architecture. This round audits the drei ecosystem for components we haven't surfaced (huge — there are 120), pins down Theatre.js production deployment with the actual JSON state workflow (not just the dev demo), resolves the custom HDRI question with a concrete brand-color recipe, and surfaces basement.studio's OSS toolkit which dropped in the last few months.

---

## ★ THE FIVE BIG FINDINGS THIS ROUND ★

**1. Drei has 120 components. We're using ~6.** The remaining 114 contain at least a dozen high-leverage components that could materially upgrade Phase 1B: `Float` (subtle hover animation), `Lightformer` (scene lights that AND act as environment), `MeshRefractionMaterial` (BVH-accelerated raytracing for heavier glass than MTM), `MeshPortalMaterial` (the "look into another scene" effect — Prizm Custom gatekeeper visual), `Sparkles` (1-line emissive particle field), `Trail` (motion trails for orbiting elements), `Caustics` (light pattern beneath the prism — N8Programs-grade, drei-wrapped), `Mask`/`useMask` (stencil cuts), `AdaptiveDpr` + `PerformanceMonitor` (auto-tune DPR by FPS), `Float`, `useIntersect` (frame loop gating). All MIT, all maintained. We should adopt at least 6 of these for v1.

**2. The custom-HDRI problem has a clean solution: `<Environment>` with Lightformer children.** Reading drei's `Environment.tsx` source: when you pass children to `<Environment>`, it activates `EnvironmentPortal` mode — creates a virtual scene, renders children into a HalfFloatType CubeRenderTarget via portal, uses THAT as the environment map. **Zero HDRI download.** Set `frames={1}` to bake once on first frame (zero per-frame cost). Author the entire environment with brand-color `<Lightformer>` rectangles. **This is the production-grade replacement for `<Environment preset="studio">`** which is explicitly discouraged by drei docs ("preset property is not meant to be used in production environments").

**3. Theatre.js production workflow has a clean three-step pattern.** From the actual benchmarks code: (1) export project state to JSON file via Theatre Studio button, (2) `import projectState from './hero.theatre-project-state.json'` and pass to `getProject('Hero', { state: projectState })`, (3) drive timeline via `sheet.sequence.position = scrollProgress * sequence.length`. Production bundle DOES NOT include `@theatre/studio` — gated by `if (process.env.NODE_ENV === 'development')`. The `editable as e` HOC stays in production but reads keyframes from JSON instead of the dev studio. **This is shippable. Not bleeding-edge.**

**4. drei's `Caustics` component IS the Maxime Heckel caustics algorithm, drei-wrapped.** Source line 1: *"Author: @N8Programs https://github.com/N8python https://github.com/N8python/caustics"*. The same N8Programs that Maxime credits in his caustics post (v6 §4). **We don't need to write caustics from scratch for Phase 2.** drei's Caustics component takes IOR, bounces, intensity, worldRadius, backside, frames params. ~5-line API. Maxime's post becomes "understanding why this works" rather than "implementation guide."

**5. basement.studio just shipped `shader-lab` as OSS (Dec 2025).** A "Photoshop for shaders" — their internal shader editor + a portable React runtime (`@basementstudio/shader-lab`) that loads compositions as config objects. 13 effect layers: ASCII, CRT, directional blur, dithering, halftone, ink, particle grid, pattern, pixelation, pixel sorting, posterize, slice, edge detect, displacement map, **chromatic aberration**. Also `basement-laboratory` is a public lab repo with experimental 3D scenes. **basement is the studio behind the Vercel Next.js Conf prism we're calibrating against.** Their OSS toolkit is plug-and-play. This is direct upgrade path for Phase 2 if we want shader composition without writing GLSL.

---

## 1. Drei ecosystem audit (the headline this round)

### What we already use
- `<MeshTransmissionMaterial>` — the prism glass material
- `<Environment preset="studio">` — placeholder HDRI (production blocker, see §3 below)
- `<PerspectiveCamera>` — the hero camera
- `<OrthographicCamera>` — Sat ūs's GlobalCanvas default
- `<Suspense>` (technically R3F, not drei)

That's it. **Drei has 114 more components.** Here's the audit, organized by relevance.

### Drei components that should materially improve Phase 1B

| Component | What it does | Why we want it for Phase 1B |
|---|---|---|
| **`<Float>`** | Subtle floating + rotation animation (~10 lines internal: `Math.sin(t)/8` for rotation, `Math.sin(t)/10` for y-position) | Replaces our manual `useFrame` rotation/bob. Cleaner. Built-in `floatingRange`, `rotationIntensity`, `floatIntensity` props. `autoInvalidate` for `frameloop="demand"`. |
| **`<Lightformer>`** | A mesh-as-light. Renders as MeshBasicMaterial with `toneMapped: false` and emissive color. Forms: `circle`, `ring`, `rect`, `plane`, `box`. | The atomic unit of custom HDRI. Place several in scene → environment map captures them → MTM transmission samples brand colors. See §3. |
| **`<MeshRefractionMaterial>`** | BVH-accelerated raytraced refraction (uses `three-mesh-bvh`). Props: `bounces` (2 default), `ior` (2.4 — diamond-tier), `aberrationStrength`, `fastChroma`. | Heavier than MTM but TRUE refraction (MTM is approximate). For a higher-IOR look on the prism — diamond-clarity rather than glass. **Phase 2 candidate.** |
| **`<MeshPortalMaterial>`** | "Look into another scene through this object." Renders children into a portal scene with optional blur, blend, SDF edge fade. | **The Prizm Custom gatekeeper visual.** A small "look into the gatekept tier" — peer through the prism into a curated inner scene. Author by N8Programs and drcmda. |
| **`<Sparkles>`** | Built-in shader for emissive sparkle/dust particles. Per-particle `size`, `speed`, `opacity`, `noise`, `color` attributes. Animated via `time` uniform. | Cheap atmospheric particle system. **1-line API for what we'd write 100+ lines of custom shader for.** Not as powerful as TSL/MRT, but covers Phase 1B. |
| **`<Trail>`** | Motion trail mesh (uses `meshline`). Tracks any Object3D ref. Configurable width, length, decay, attenuation function. | Light beam trail through the prism — tracks an invisible point as it travels apex→base, leaves a glowing cyan trail. |
| **`<Caustics>`** | drei wrapper around N8Programs's caustics implementation. IOR-driven projection of light pattern onto a plane below the object. | **Maxime Heckel's caustics post implemented and packaged.** Drop-in for Phase 2 atmospheric depth — light pattern beneath the prism that ties brand mark to content. |
| **`<Mask>` + `useMask`** | Stencil-test masking. Mask geometry written to stencil buffer; other geometry tests against it. | The "Prizm Custom" tier reveal — a stencil cut showing a different scene through the gatekept boundary. Or used for clean transitions between sections. |
| **`<PerformanceMonitor>`** | Tracks FPS, calls onIncline/onDecline/onChange. Pass `bounds(refreshrate) => [50, 90]` to set thresholds. | Auto-tune DPR based on real performance. Pair with `<AdaptiveDpr>`: drop from 2 → 1.5 → 1.25 if FPS sags. **More accurate than our `isMobile` heuristic.** |
| **`<AdaptiveDpr>`** | Subscribes to performance.current and sets DPR. Optional `pixelated` mode. | Companion to PerformanceMonitor. ~30 lines. |
| **`useIntersect`** | IntersectionObserver hook for any Object3D ref. Returns visibility state. | Frame loop gating — pause useFrame work when prism not in viewport. Saves significant CPU on long pages. |

### Drei components worth knowing about (lower Phase 1B priority)

| Component | What it does | When relevant |
|---|---|---|
| `<Stage>` | Auto-lights + auto-environment + auto-shadows for a model | Quick prototyping — not for our hand-tuned aesthetic |
| `<AccumulativeShadows>` + `<RandomizedLight>` | Soft shadows accumulated over multiple frames | If we want grounded ambient occlusion on the prism. Pretty but expensive. |
| `<ContactShadows>` | Single-frame fake shadow projection | Cheaper than AccumulativeShadows. Good ground anchor. |
| `<Outlines>` | Toon-style outlines around objects (inverted hull technique) | Probably not for us — too cartoony |
| `<Edges>` | Edge-only wireframe (uses three-stdlib LineSegmentsGeometry) | Could be used for the silhouette of the Penrose triangle — alternative to current lineSegments approach |
| `<Center>` | Auto-centers children based on their bounding box | Useful for keeping prism centered without manual position math |
| `<Bounds>` + `<useBounds>` | Camera fit-to-content. `bounds.refresh().clip().fit()` recenters camera to content. | Could drive part of the camera path — programmatically frame the prism |
| `<Resize>` | Auto-scale to fit a target size in world units | Useful if we want a consistent "1 unit on screen" prism regardless of viewport |
| `<RoundedBox>` | Box geometry with rounded corners | Not for us |
| `<MeshDistortMaterial>` | Vertex-displacement noise for organic distortion | Cool effect, but conflicts with crisp Penrose facets |
| `<MeshWobbleMaterial>` | Time-based vertex wobble | Too gimmicky for Prizm |
| `<MeshReflectorMaterial>` | Real-time floor reflections (mirror) | Phase 2 if we want a reflective floor under the prism |
| `<Hud>` | Renders content in a separate viewport on top of the main scene | Useful for an overlay UI. Not Phase 1B. |
| `<Backdrop>` | Curved bent-plane backdrop (studio cyclorama) | Could be brand background — clean curved surface behind prism. Phase 2 candidate. |
| `<RenderTexture>` + `useFBO` | Render-to-texture for shader effects | Maxime Heckel's render targets post is built on this. Phase 2 needed for caustics. |
| `<Fbo>` | Lower-level FBO management | Phase 2. |
| `<Stars>`, `<Sky>`, `<Cloud>` | Pre-built skybox/atmosphere effects | Probably not — not our aesthetic |
| `<Splat>` | Gaussian splatting renderer | Bleeding-edge, Phase 3+. Not relevant for prism. |
| `<Detailed>` (LOD) | Level-of-detail with multiple meshes | Useful for camera-distance-driven Penrose subdivision count |
| `<Bvh>` | BVH acceleration wrapper | Required by MeshRefractionMaterial |
| `<Instances>` | InstancedMesh wrapper for repeated geometry | **The Phase 1B particle system implementation.** Pair with custom shader for animated particles. |
| `<Points>` + `<PointMaterial>` | Particle systems via THREE.Points (more efficient than Instances for huge counts) | Alternative for >10K particles |
| `<DetectGPU>` | Better than our isMobile — uses gpu detection library to grade GPU tier | Could replace our useDeviceDetection for finer mobile gating |
| `<SpotLight>` (drei version) | Volumetric spot light with cone visualization | Phase 2 — could create god-rays through the prism |
| `<Helper>` + `useHelper` | Add three.js helpers (CameraHelper, BoxHelper, DirectionalLightHelper) in dev | Dev-only — useful for debugging |
| `<Stats>` / `<StatsGl>` | FPS panel | Use r3f-perf in webgl profile instead |
| `<Preload>` | Preloads all visible textures + materials at startup | Already in Sat ūs's GlobalCanvas |
| `<Gltf>`, `<useGLTF>`, `<useFbx>`, `<useAnimations>` | Model loading | Not relevant — we're not loading external models for the prism |
| `<Text>`, `<Text3D>` | SDF text / extruded 3D text | Probably not — we have HTML for text |

### Drei web-only (the View family)

| Component | What it does | Use |
|---|---|---|
| **`<View>`** | The Phase 1B architecture cornerstone (v6 §1). Tracks DOM element + scissors render to its bounds. Each View has own camera, lights, env. | Per-section scenes inside ONE GlobalCanvas |
| `<ScrollControls>` + `<useScroll>` | Built-in scroll system. Provides scroll offset 0-1, range, visible, viewport, fill helpers. | **Alternative to Lenis + ScrollTrigger.** Self-contained but less integrated with non-3D scroll content. We have Lenis already, stick with it. |
| `<Html>` | Renders HTML inside the 3D canvas, transforms tracking the parent mesh | Could put labels on prism facets |
| `<KeyboardControls>`, `<DragControls>`, `<PresentationControls>` | Input controls | Not Phase 1B |

### Verdict

**For Phase 1B, adopt:** `<Float>`, `<Lightformer>` (multiple), `<Sparkles>`, `<View>`, `<PerformanceMonitor>` + `<AdaptiveDpr>`, `useIntersect`. That's 6 new components, all production-mature, all reducing custom code.

**For Phase 2 / Phase 3:** `<Caustics>`, `<MeshRefractionMaterial>`, `<MeshPortalMaterial>`, `<Trail>`, `<Mask>`, `<Backdrop>`, `<MeshReflectorMaterial>`, `<Detailed>` (LOD).

The agent who built the current implementation didn't audit drei. With the audit complete, the rebuild can replace ~150 lines of custom code with drei components.

---

## 2. Theatre.js production deployment (now fully traced)

### What I cloned and read
- `theatre/packages/r3f/README.md` — API docs (v6 already covered this)
- `theatre/examples/r3f-cra/src/App.js` — canonical R3F example with full usage
- `theatre/packages/playground/src/shared/r3f-rocket/App.tsx` — production-style rocket scene with EditableCamera + GLB model + lights as camera children
- `theatre/packages/benchmarks/src/index.tsx` — **the production state-loading + scroll-driven sequence pattern**

### The full production workflow (with code)

**Step 1: In dev — author the camera path visually**

```tsx
// app/(marketing)/_sections/hero/hero-scene.tsx
import { editable as e, SheetProvider } from '@theatre/r3f'
import { getProject } from '@theatre/core'
import { Canvas } from '@react-three/fiber'

// In dev only — initialize Theatre Studio
if (process.env.NODE_ENV === 'development') {
  import('@theatre/studio').then(({ default: studio }) => {
    import('@theatre/r3f/dist/extension').then(({ default: extension }) => {
      studio.extend(extension)
      studio.initialize()
    })
  })
}

const project = getProject('Hero')
const sheet = project.sheet('HeroScene')

export function HeroScene() {
  return (
    <SheetProvider sheet={sheet}>
      <e.perspectiveCamera 
        theatreKey="HeroCamera"
        makeDefault 
        fov={35} 
        position={[0, 0, 2.8]} 
      />
      
      {/* Lights as children of camera = move with camera through timeline */}
      <e.directionalLight theatreKey="KeyLight" position={[2, 3, 4]} intensity={3.5} color="#00cfee" />
      <e.directionalLight theatreKey="FillLight" position={[-3, 0.5, 2]} intensity={1.6} color="#7c4ff5" />
      <e.directionalLight theatreKey="BackLight" position={[0, 2, -3]} intensity={2.2} color="#00cfee" />
      
      <PrismMesh />
    </SheetProvider>
  )
}
```

In dev, Theatre Studio panel appears in the corner. Drag camera, set keyframes at multiple timeline positions. Animate position + rotation + lights' intensity over time. Live preview in the canvas.

**Step 2: Export the timeline state**

In Theatre Studio panel: top-right menu → "Export project state" → downloads JSON file.

```bash
# Save in your project
mv ~/Downloads/Hero.theatre-project-state.json public/animations/hero.theatre-project-state.json
```

**Step 3: In production — load JSON, drive sequence with scroll**

```tsx
// app/(marketing)/_sections/hero/hero-scene.tsx (revised)
import { editable as e, SheetProvider } from '@theatre/r3f'
import { getProject, ISheet } from '@theatre/core'
import { Canvas } from '@react-three/fiber'
import { useEffect, useRef } from 'react'
import { useLenis } from '@/components/layout/lenis'

import projectState from '/public/animations/hero.theatre-project-state.json'

// Project loads from JSON (no studio bundle in production)
const project = getProject('Hero', { state: projectState })
const sheet: ISheet = project.sheet('HeroScene')

export function HeroScene() {
  const sectionRef = useRef<HTMLDivElement>(null)

  // Wait for project to load (it's async)
  useEffect(() => {
    project.ready.then(() => {
      // Sequence is now safe to drive
    })
  }, [])

  // Drive timeline with Lenis scroll progress
  useLenis(({ scroll, limit }) => {
    if (!sectionRef.current) return
    
    const rect = sectionRef.current.getBoundingClientRect()
    const sectionTop = rect.top + scroll
    const sectionHeight = rect.height
    
    // Progress from 0 (just entered) to 1 (just exited)
    const progress = Math.max(0, Math.min(1, (scroll - sectionTop) / sectionHeight))
    
    sheet.sequence.position = progress * sheet.sequence.length
  })

  return (
    <SheetProvider sheet={sheet}>
      <e.perspectiveCamera theatreKey="HeroCamera" makeDefault fov={35} position={[0, 0, 2.8]} />
      <e.directionalLight theatreKey="KeyLight" position={[2, 3, 4]} intensity={3.5} color="#00cfee" />
      {/* ... etc ... */}
      <PrismMesh />
    </SheetProvider>
  )
}
```

The `editable as e` HOC stays — but in production it reads keyframe values from the JSON state instead of from the live Theatre Studio. Setting `sheet.sequence.position` interpolates between keyframes.

### Production bundle implications

- `@theatre/core` ships in production: ~50KB gzipped (per their docs)
- `@theatre/studio` is dev-only — gated by `if (process.env.NODE_ENV === 'development')` import
- `@theatre/r3f`'s `editable` HOC ships in production but reads from JSON, not studio
- Total production cost: `@theatre/core` + `@theatre/r3f` runtime ≈ 70KB gzipped

For Sat ūs which already imports Theatre, this is essentially a no-op.

### The "API will change drastically" caveat

Theatre's R3F README explicitly warns: *"Here be dragons! 🐉 `@theatre/r3f` is pre-release software, the API, the internal logic, and even the package name can and will drastically change at any time."*

**Mitigation:** Sat ūs locks Theatre at `@theatre/core@^0.7.2` and `@theatre/studio@^0.7.2`. As long as we don't bump these, the API is stable for our deployment. **Lock the version, ship.**

### The pragmatic decision

For Phase 1B v1:
- **If camera path is simple (3-5 keyframes):** code it with Bruno's eased-targeting + ANGLE_PRESETS pattern (v6 §2). Faster to implement, no new dep complexity.
- **If camera path is complex (10+ keyframes, choreographed timing):** use Theatre.js. The visual scrubber pays off.

The current copy lock in PRIZM.md describes a relatively simple camera scope: "subtle pull-toward via scroll, ~1600px scroll length." Code with Bruno's pattern. **Defer Theatre.js to Phase 1B.5 / Phase 2** when we add the cinematic hero sequence.

---

## 3. Custom HDRI via Lightformer children — the brand-color recipe

### The problem with the current code

`<Environment preset="studio">` downloads `studio_small_03_1k.hdr` from a CDN — drei docs explicitly say: *"preset property is not meant to be used in production environments and may fail as it relies on CDNs."*

Plus it's a generic studio HDRI — neutral whites and grays. Our prism is BRAND-COLORED — cyan apex, ember base. The HDRI's reflections/refractions don't reinforce the brand.

### The solution

Pass `<Lightformer>` children to `<Environment>` to activate `EnvironmentPortal` mode. Drei renders the children to a HalfFloatType CubeRenderTarget and uses it as the environment map. **Zero HDRI download. Brand-colored reflections.**

From drei's `Environment.tsx` source (lines 186-202):

```tsx
return (
  <>
    {createPortal(
      <>
        {children}
        <cubeCamera ref={camera} args={[near, far, fbo]} />
        {/* optional: layer a real HDRI behind the lightformers */}
      </>,
      virtualScene
    )}
  </>
)
```

The `<cubeCamera>` (with HalfFloatType FBO) bakes the virtual scene each frame. Set `frames={1}` to bake once on mount. Set `frames={Infinity}` for real-time updates (lights animate → environment animates).

### The recipe for Prizm

```tsx
import { Environment, Lightformer } from '@react-three/drei'

<Environment frames={1} resolution={256}>
  {/* Backdrop: subtle violet ambient base */}
  <color attach="background" args={['#0a0c16']} />
  
  {/* Cyan KEY light from upper-front-right (matches current "key" directional) */}
  <Lightformer
    form="rect"
    intensity={4}
    color="#00cfee"
    position={[3, 4, 4]}
    scale={[4, 5, 1]}
    target={[0, 0, 0]}
  />
  
  {/* Violet FILL from lower-left (matches current "fill" directional) */}
  <Lightformer
    form="rect"
    intensity={2}
    color="#7c4ff5"
    position={[-4, 1, 3]}
    scale={[3, 4, 1]}
    target={[0, 0, 0]}
  />
  
  {/* Cyan BACK rim from above-behind */}
  <Lightformer
    form="rect"
    intensity={2.5}
    color="#00cfee"
    position={[0, 3, -4]}
    scale={[3, 3, 1]}
    target={[0, 0, 0]}
  />
  
  {/* Ember floor warmth — the "refraction-pools-into-warmer-base" spectrum cue */}
  <Lightformer
    form="circle"
    intensity={1.5}
    color="#ffaa44"
    position={[0, -3, 0]}
    scale={5}
    target={[0, 0, 0]}
  />
  
  {/* Magenta accent ring — captures spectrum mid-band into reflections */}
  <Lightformer
    form="ring"
    intensity={1}
    color="#ff5c8a"
    position={[0, 1.5, 0]}
    scale={3}
    target={[0, 0, 0]}
    args={[1, 1.5, 32]}
  />
</Environment>
```

### The MTM samples this environment automatically

`<MeshTransmissionMaterial>` reads from `scene.environment` for IBL refraction. Once the Environment renders to the cube map, MTM picks it up automatically. No code change to PrismMesh — just replace the Environment.

### The result

- Cyan in upper transmission (the apex looks at the cyan key light through the glass)
- Violet in mid transmission (the body samples the violet fill)
- Ember warming the base (refracted floor light)
- Magenta accent in reflections (catches the highlight rim)
- Total HDRI download: 0 bytes
- Total render cost: 1 cube camera capture on first frame, then static
- Brand-color reflection that matches the Penrose spectrum mapping

### Phase 1B fix — drop-in replacement

```diff
- <Environment preset="studio" background={false} environmentIntensity={0.5} />
+ <Environment frames={1} resolution={256}>
+   <Lightformer form="rect" intensity={4} color="#00cfee" position={[3, 4, 4]} scale={[4, 5, 1]} target={[0, 0, 0]} />
+   <Lightformer form="rect" intensity={2} color="#7c4ff5" position={[-4, 1, 3]} scale={[3, 4, 1]} target={[0, 0, 0]} />
+   <Lightformer form="rect" intensity={2.5} color="#00cfee" position={[0, 3, -4]} scale={[3, 3, 1]} target={[0, 0, 0]} />
+   <Lightformer form="circle" intensity={1.5} color="#ffaa44" position={[0, -3, 0]} scale={5} target={[0, 0, 0]} />
+ </Environment>
```

This eliminates one of the most likely root causes of the 11 errors (HDRI CDN timeout / decode failure).

### When to use a real HDRI instead

If we want photorealistic surface highlights (reflections of detailed environments — a window, plants, etc.), Lightformers are too abstract. Use a real HDRI then.

For a brand mark prism, **Lightformers WIN** — they ARE the brand colors, not whatever Poly Haven studio HDRI happens to capture.

---

## 4. basement.studio's OSS toolkit (just shipped)

### What's in their public GitHub

basement.studio (35-person Argentina, behind Vercel × Next.js Conf prism, Webby 2026 nominee for ElevenLabs work) maintains 49 public repos. The most relevant for us:

| Repo | What it is | Relevance |
|---|---|---|
| **`shader-lab`** (Dec 2025) | "Photoshop for shaders" — visual editor + portable React runtime. 13 effect layers including chromatic aberration, halftone, dithering, ASCII, pixel sorting, edge detect, displacement | **Phase 2 candidate** — could replace custom shader work |
| **`basement-laboratory`** | Public lab repo with experimental 3D scenes, R3F demos | Visual reference / pattern source |
| **`website-2k25`** | basement.studio's own 2025 website source | The PS1-walkthrough site Maxime Heckel calls "one of the most unique agency websites I've ever seen." Reference for "elite or the few" identity |
| **`tempo`** | (their own utility, MIT) | Probably not relevant |
| **`ogl-starter`** | OGL (lightweight WebGL lib) starter | Not relevant for our R3F path |
| **`commerce`** | Shopify storefront kit | Not relevant |
| **`basement-grotesque`** | Their custom font | Not relevant for Prizm |

### shader-lab API (the one to actually consider)

Two usage modes:

**Mode 1: Drop-in composition**
```tsx
"use client"
import { ShaderLabComposition, type ShaderLabConfig } from "@basementstudio/shader-lab"

const config: ShaderLabConfig = {
  layers: [
    { type: "chromaticAberration", intensity: 0.5, /* ... */ },
    { type: "halftone", scale: 50 },
  ],
  timeline: { duration: 6, loop: true, tracks: [] },
}

export function MyEffect() {
  return <ShaderLabComposition config={config} />
}
```

**Mode 2: As-texture (composable into R3F scene)**
```tsx
import { useShaderLab } from "@basementstudio/shader-lab"
import { useFrame } from "@react-three/fiber"

function PrismWithShaderLab() {
  const { texture } = useShaderLab(config, { width: 1024, height: 1024 })
  
  // Use texture as map, emissiveMap, or as input to MTM
  return (
    <mesh>
      <primitive ... />
      <meshBasicMaterial map={texture} />
    </mesh>
  )
}
```

### Phase 2 use case for shader-lab

Run a shader-lab composition on a plane BEHIND the prism — the brand-gradient cyan→ember spectrum animated with halftone + slight chromatic aberration + slow slice. The prism transmits THROUGH this shader-lab plane, which becomes the source of color sampling. **Dynamic brand-color HDRI.**

For Phase 1B, stick with static Lightformers (§3). For Phase 2, swap in a shader-lab composition if we want the environment to BREATHE.

### What basement-laboratory contains

Per the description: "We combine intensive technology with design expertise. Pull requests are welcome." The repo is a public showcase/lab. Cloning + browsing it is a v8 experiential research target. Likely contains: WebGL experiments, R3F mini-scenes, shader playgrounds, particle systems. **Source of inspiration patterns we can reference but probably won't import wholesale.**

### Studio philosophy alignment

From the Codrops "From Basement to Breakthroughs" article (Dec 15, 2025):

> *"Nearly 40 people across Mar del Plata, Buenos Aires, and beyond. What sets us apart isn't just the talent (though, yes, we're stacked), it's the way branding, design, dev, 3D, and animation sit together and push each other. We don't work in silos. We work in symphony. Most of our clients come to us for one project… and stay for three."*

> *"Working with unicorns like Vercel, Harvey, Cursor, Eleven Labs. Winning 2 Webbys. Being chosen as 1 of the 100 most creative and unique portfolios at Muzli."*

This is the studio you're competing visually against. ElevenLabs work: *"Inspired by Chladni patterns and the physics of sound, we built a living system where motion, blur, and geometry pulse like a voice in motion. A custom generator turned data into art, giving the team freedom to remix their own brand in real time."* — note the "physics-grounded" approach maps onto our Penrose-photonics-grounded approach. **Penrose IS our Chladni.**

---

## 5. The Phase 1B blueprint — REVISED with v7 findings

Combining v2-v7, the architecture is now (incorporating v7 deltas in **bold**):

### Canvas: ONE GlobalCanvas in app/layout.tsx

```tsx
<GlobalCanvas postprocessing forceWebGL />
```

(Already discussed in v6.)

### Sections: drei `<View>` per scene + `<PerformanceMonitor>` for adaptive DPR

```tsx
import { PerformanceMonitor } from '@react-three/drei'

<GlobalCanvas postprocessing forceWebGL>
  <PerformanceMonitor 
    onIncline={() => setDpr(2)} 
    onDecline={() => setDpr(1.5)}
    bounds={(refreshrate) => refreshrate > 90 ? [50, 90] : [50, 60]}
  />
  {/* Views render via WebGLTunnel.Out */}
</GlobalCanvas>
```

### Hero scene — **with v7 components**

```tsx
import { View, PerspectiveCamera, Environment, Lightformer, Float, MeshTransmissionMaterial, Sparkles } from '@react-three/drei'
import { useRef } from 'react'

export function Hero() {
  const containerRef = useRef<HTMLDivElement>(null)
  
  return (
    <section ref={containerRef} className="hero">
      <div className="copy">{/* HTML content */}</div>
      
      <View track={containerRef} className="prism-mark">
        <PerspectiveCamera makeDefault fov={35} position={[0, 0, 2.8]} near={0.1} far={20} />
        
        {/* v7: Brand-color Lightformer environment, no HDRI download */}
        <Environment frames={1} resolution={256}>
          <Lightformer form="rect" intensity={4} color="#00cfee" position={[3, 4, 4]} scale={[4, 5, 1]} target={[0, 0, 0]} />
          <Lightformer form="rect" intensity={2} color="#7c4ff5" position={[-4, 1, 3]} scale={[3, 4, 1]} target={[0, 0, 0]} />
          <Lightformer form="rect" intensity={2.5} color="#00cfee" position={[0, 3, -4]} scale={[3, 3, 1]} target={[0, 0, 0]} />
          <Lightformer form="circle" intensity={1.5} color="#ffaa44" position={[0, -3, 0]} scale={5} target={[0, 0, 0]} />
        </Environment>
        
        {/* v7: Float for subtle motion (replaces manual useFrame rotation/bob) */}
        <Float speed={1} rotationIntensity={0.5} floatIntensity={0.3} floatingRange={[-0.05, 0.05]}>
          <PrismMesh />
        </Float>
        
        {/* v7: Sparkles for atmospheric particles */}
        <Sparkles 
          count={isMobile ? 30 : 80} 
          scale={4} 
          size={2} 
          speed={0.3} 
          color="#00cfee" 
          opacity={0.6}
        />
      </View>
    </section>
  )
}
```

### What this revised blueprint replaces from current implementation

| Current code | Replaced by v7 component |
|---|---|
| Manual useFrame for yaw + bob (~10 lines) | `<Float>` (1 line, configurable, IDLE-aware) |
| `<Environment preset="studio">` with CDN download | `<Environment>` with Lightformer children (4 lines, brand-colored, no download) |
| Three manual `<directionalLight>` (3 lines) | Now embedded in Lightformer environment (already in scene as the lighting) |
| Manual mobile/desktop sample heuristic | `<PerformanceMonitor>` adaptive DPR (~10 lines, runtime FPS-driven) |
| No particles | `<Sparkles>` (1 line, brand-colored, GPU-cheap) |

### Camera path — defer Theatre.js, ship Bruno's pattern v1

For Phase 1B v1, code the camera with Bruno's eased-target + angle-presets pattern (v6 §2). Simple section-driven angles via ScrollTrigger.

For Phase 1B v2 / Phase 2, swap to Theatre.js authored if we add complex choreography.

### Particles — Phase 1B = Sparkles, Phase 2 = TSL

`<Sparkles>` for v1 (drei's built-in shader, ~80 particles, GPU-cheap, brand-colored).

For Phase 2, switch to TSL particle system per Codrops Gommage pattern (v5 §4) for MRT-based selective bloom + WebGPU compute shader animation.

### Postprocessing — unchanged from v6

```tsx
<EffectComposer disableNormalPass>
  <Bloom mipmapBlur luminanceThreshold={1.1} levels={9} intensity={1.5} />
  <ToneMapping mode={ToneMappingMode.ACES_FILMIC} />  {/* MUST be last */}
</EffectComposer>
```

ACES_FILMIC at end. luminanceThreshold 1.1 (HDR > LDR mapping). Body color stays below threshold; emissive seams + Sparkles + Lightformers exceed it and bloom.

---

## 6. Open questions going into Phase 1B brief

Updated from v6 §7:

1. **Camera path: Bruno or Theatre?** v7 confirms: **Bruno's pattern for v1.** Theatre for v2+ when choreography gets complex.

2. **HDRI: preset, file, or Lightformers?** v7 settles: **Lightformers.** Drop-in replacement for `<Environment preset="studio">`. No download.

3. **Particles: count and library?** v7: **`<Sparkles>` count={80 desktop / 30 mobile} for v1.** TSL system for Phase 2.

4. **The 11 errors in current code — root cause?** Three top candidates from v7:
   - HDRI CDN timeout/decode (Lightformer fix eliminates)
   - WebGPU+transmission bug (forceWebGL fix per v5)
   - MSAA framebuffer overflow (Bloom MSAA cap fix)
   - Capture actual errors before deciding which

5. **AnimatedGradient migration to View?** Still open. Test during implementation.

6. **Caustics for Phase 2 — yes or no?** v7 confirms drei `<Caustics>` is the N8Programs implementation Maxime Heckel writes about. **Yes — Phase 2 candidate, ~5-line API, drei-wrapped.**

7. **shader-lab adoption?** Phase 2 candidate. v1 doesn't need it. v2 could swap Lightformer environment for animated shader-lab composition behind the prism.

---

## 7. v8+ research targets

Lower-priority threads still open:

1. **Experiential round** — Vercel prism live, basement-laboratory, Active Theory portfolio, Exo Ape Amaterasu (needs Chrome MCP — Mac tomorrow)
2. **Three.js r190+ release notes** — WebGPU+transmission bug status
3. **Yuri Artiukh YouTube** — reverse-engineering production scenes
4. **Codrops studio spotlights I haven't read** — Naughtyduk, Malvah, Forged
5. **basement-laboratory deep clone** — what specific demos are in it
6. **Maxime Heckel render targets post** — Phase 2 caustics implementation guide

---

## TL;DR for v7

**Five upgrades to the Phase 1B blueprint that came out of this round:**

1. **Add 6 drei components to v1:** `<Float>`, `<Lightformer>` (multiple), `<Sparkles>`, `<View>`, `<PerformanceMonitor>` + `<AdaptiveDpr>`, `useIntersect`. Each one replaces or improves something in the current implementation.

2. **Replace `<Environment preset="studio">` with `<Environment>` + Lightformer children.** Brand-color refraction without HDRI download. Eliminates one of the most likely 11-error root causes. Drop-in fix.

3. **Theatre.js production workflow is solved** — `import projectState from './hero.theatre-project-state.json'`, `getProject('Hero', { state: projectState })`, drive timeline with `sheet.sequence.position = scrollProgress * sequence.length`. **But defer to v2** — code Bruno's camera pattern for v1, Theatre when choreography demands it.

4. **drei's `<Caustics>` IS the Maxime Heckel/N8Programs caustics algorithm packaged.** Phase 2 ready, ~5-line API. We don't write it from scratch.

5. **basement.studio shipped `shader-lab` as OSS in Dec 2025.** "Photoshop for shaders." Phase 2 candidate for animated brand-color environment. The studio behind the Vercel prism we're calibrating against.

The Phase 1B brief has converged. v8+ is calibration. **The brief can be drafted whenever.**
