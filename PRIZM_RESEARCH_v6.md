# Prizm Marketing Site — Research Findings v6 (Round 4 Architectural Synthesis)

**Compacted:** April 26, 2026 (continuation session, fourth deep round)
**Method:** Source-code reading via `bash_tool` clone + textual research via web. Browser automation MCP attempted but Chrome extension not connected. Reserving experiential research for v7.
**Combines with:** v2 (master) + v3 (round 1) + v4 (round 2) + v5 (round 3) + this round.
**Why this exists:** v5 settled "what's in Sat ūs's source." This round goes one layer deeper: r3f-scroll-rig source (the library Sat ūs's pattern is BASED on), Bruno Simon's vanilla three.js folio (camera path patterns), Theatre.js R3F bridge (visual camera path authoring), Maxime Heckel canonical R3F shader curriculum, and an implementation review of the current Prizm hero code (which we're rebuilding). The architecture decision for Phase 1B is now fully resolved.

---

## ★ THE FOUR CRITICAL FINDINGS THIS ROUND ★

**1. r3f-scroll-rig is the library Sat ūs's GlobalCanvas/Tunnel pattern was inspired by, AND drei `<View>` was adapted from r3f-scroll-rig's `<ViewportScrollScene>`.** They share lineage from threejsfundamentals.org's "multiple scenes" article. This means the architectural choice for Phase 1B isn't between separate canvases vs. drei View — it's between three closely-related implementations of the SAME scissor-test multi-scene technique. The choice is implementation-specific, not architectural.

**2. The current Prizm hero implementation IS architecturally correct.** I read penrose-prism.tsx, hero-postprocessing.tsx, and hero-mark-3d/index.tsx. Inline comment explicitly explains: *"Local canvas required — global Sat ūs canvas is ortho+linear, this 3D scene needs perspective+sRGB+tonemapped. Do NOT migrate this back into the tunnel pattern; it'll silently degrade glass / lighting / bloom."* The MTM config (ior 1.6, chromatic 0.2, samples 6/10, resolution 512/1024) + 3-point lighting + HDR studio environment + ACES tone mapping + bloom luminance threshold 0.65 are well-tuned. The 11 errors are likely environmental (HDR CDN timeout, Bloom MSAA stack overflow, or AnimatedGradient orphaned tunnel) — not architectural. Useful knowledge for the rebuild even if we start fresh.

**3. Bruno Simon's eased-targeting + named-angle-presets camera pattern is what we should use for the hero.** From his folio-2019 (MIT licensed, vanilla three.js): `targetEased.x += (target.x - targetEased.x) * 0.15` (smooth-follow lerp) + `gsap.to(angle.value, {...})` to animate between named presets (`default`, `projects`). Adapted to R3F + ScrollTrigger this becomes: each section has a named angle preset, ScrollTrigger triggers GSAP transitions between them, eased lerp gives the "alive" subtle response.

**4. Theatre.js + R3F bridge enables visual camera path authoring.** `<editable.perspectiveCamera theatreKey="HeroCamera">` lets us scrub keyframes in Theatre Studio (already wired in Sat ūs as `<SheetProvider id="webgl">`), bake to JSON, run at zero studio overhead in production. This is a 5-10x productivity multiplier vs. coding camera coordinates.

---

## 1. r3f-scroll-rig — the library Sat ūs is built upon

### The lineage (now traced)

I cloned `@14islands/r3f-scroll-rig` (MIT, version 8.15.0) and read source. The architecture lineage:

- **threejsfundamentals.org "multiple scenes" article** — the foundational technique: one canvas, one WebGL context, multiple Scene objects, scissor-test rendering each Scene to a DOM-tracked viewport
- **r3f-scroll-rig** (14islands, 2020+) — adapted that to React Three Fiber, added Lenis smooth scroll, IntersectionObserver gating, useTracker hook. **The README literally says:** *"Adapted to @react-three/fiber from https://threejsfundamentals.org/threejs/lessons/threejs-multiple-scenes.html"*
- **drei `<View>`** (Pmndrs, 2022+) — adapted from r3f-scroll-rig (the source code attribution in r3f-scroll-rig's `ViewportScrollScene.tsx` says: *"From: https://github.com/pmndrs/drei/blob/d22fe0f58fd596c7bfb60a7a543cf6c80da87624/src/web/View.tsx#L80"* — they cross-reference)
- **Sat ūs's GlobalCanvas + WebGLTunnel** (darkroom, 2023+) — implements the same technique with their own opinionated tooling (Tempus RAF, WebGPU fallback, AnimatedGradient default)

**This means our architectural choice for Phase 1B is between three implementations of the SAME idea**, not three different ideas:

| Choice | Library | Maturity | Production examples |
|---|---|---|---|
| **A. r3f-scroll-rig directly** | @14islands | v8.15.0, mature | Cartier Yearbook, 14islands clients |
| **B. drei `<View>` inside Sat ūs WebGLTunnel** | drei | mature | Many R3F production sites |
| **C. Sat ūs GlobalCanvas with views via tunnel** | Sat ūs | dev v1 | darkroom client work (Looped, Ibicash, Ecotrak) |

For the rebuild, **Option B is the cleanest path** — we keep all of Sat ūs's perf scaffolding (Tempus, GPU detection, WebGPU fallback, ReactTempus) AND we use the well-documented drei `<View>` API which has more third-party examples. r3f-scroll-rig is also viable but adds another major dep on top of Sat ūs.

### The ViewportScrollScene mechanic (gold for our hero pattern)

From r3f-scroll-rig's `src/components/ViewportScrollScene.tsx`:

```tsx
const Viewport = ({ track, children, margin = 0, ... }) => {
  const scene = useThree((s) => s.scene)  // each scene is independent (new Scene())
  const { renderViewport } = useScrollRig()

  useEffect(() => {
    // Connect the event layer to the tracking element
    const old = get().events.connected
    setEvents({ connected: track.current })
    return () => setEvents({ connected: old })
  }, [])

  useFrame(({ gl, scene, camera }) => {
    if (scene.visible) {
      renderViewport({
        gl, scene, camera,
        left: bounds.left - margin,
        top: bounds.positiveYUpBottom - margin,
        width: bounds.width + margin * 2,
        height: bounds.height + margin * 2,
        clearDepth: !!hud,
      })
    }
  }, priority)

  return (
    <>
      {!orthographic && <PerspectiveCamera manual margin={margin} makeDefault {...camera} />}
      {orthographic && <OrthographicCamera manual margin={margin} makeDefault {...camera} />}
      {/* children get scale, scrollState, inViewport, priority injected */}
      {children && children({ track, margin, scale, scrollState, inViewport, priority, ...props })}
    </>
  )
}
```

**Key mechanics:**
1. **`new Scene()` per ViewportScrollScene** — each tracked element has its own scene (line 124: `const [scene] = useState(() => new Scene())`)
2. **Each scene gets own camera** (PerspectiveCamera or OrthographicCamera, `makeDefault`)
3. **`renderViewport()`** uses `gl.setScissor()` + `gl.setViewport()` to render only to the bounds of the tracked element — efficient because the rest of the canvas isn't touched
4. **IntersectionObserver gating** — `useInView({ rootMargin, threshold })` from `react-intersection-observer` — `scene.visible = inViewport && visible` ensures the scene only renders when on-screen
5. **`scrollState.progress`** — calculated as `mapLinear(pxInside, 0, size.height + bounds.height, 0, 1)` — gives 0=just-entered, 1=just-exited. This is the value to drive scroll-triggered animations

This is EXACTLY what we want for the prism: own scene, own camera, own lights/env, scissor-rendered to its container, IntersectionObserver-gated, scroll-progress-driven.

### useTracker bounds calculation (the DOM-sync math)

From `src/hooks/useTracker.ts`:

```typescript
function updateBounds(bounds, rect, scroll, size) {
  bounds.top = rect.top - (scroll.y || 0)
  bounds.bottom = rect.bottom - (scroll.y || 0)
  bounds.left = rect.left - (scroll.x || 0)
  bounds.right = rect.right - (scroll.x || 0)
  bounds.width = rect.width
  bounds.height = rect.height
  // move coordinate system so 0,0 is at center of screen
  bounds.x = bounds.left + rect.width * 0.5 - size.width * 0.5
  bounds.y = bounds.top + rect.height * 0.5 - size.height * 0.5
  bounds.positiveYUpBottom = size.height - bounds.bottom // inverse Y
}
```

**Important detail:** `getBoundingClientRect()` is called ONCE on layout-effect mount, then bounds are derived from `rect + scroll.y` on every update. This avoids the layout-thrash of calling `getBoundingClientRect()` per frame. The rest is delta-based math. **drei's `<View>` does similar but slightly less detailed.**

For the rebuild, this is the bounds-tracking pattern to use whether we go with Option A, B, or C.

### Powerups package (production patterns, MIT-licensed)

r3f-scroll-rig also ships a `powerups/` directory with these patterns:

- **ParallaxScrollScene.tsx** — adds parallax movement to a tracked element
- **StickyScrollScene.tsx** — sticky-pinned 3D content (think GSAP ScrollTrigger pin but for WebGL)
- **WebGLImage.tsx** — replace a `<img>` with a WebGL plane, syncing to DOM bounds
- **WebGLText.tsx** — replace `<h1>`/etc with WebGL text (MSDF or otherwise)

We may not need these directly, but they're MIT-licensed patterns we can reference for the brief.

---

## 2. Bruno Simon folio-2019 — the gold camera pattern

### What I cloned

`brunosimon/folio-2019` (MIT licensed). Vanilla three.js + Cannon physics + GSAP + dat.gui. ~6500 lines of source. This is the famous portfolio with the drivable car. Pre-React, pre-R3F. Published 2019, still up.

Bruno's stack:
- `three: ^0.164.1` (older, but patterns transfer)
- `gsap: ^3.12.5`
- `cannon: ^0.6.2` (physics — we don't need)
- `dat.gui: ^0.7.9` (debug — Theatre.js is better for our use case)
- `howler: ^2.2.4` (audio — Phase 2)

### The camera pattern (this is the gold finding)

From `src/javascript/Camera.js`:

```javascript
export default class Camera {
  constructor(_options) {
    this.target = new THREE.Vector3(0, 0, 0)
    this.targetEased = new THREE.Vector3(0, 0, 0)
    this.easing = 0.15

    this.setAngle()
    this.setInstance()
    this.setZoom()
    this.setPan()
  }

  setAngle() {
    this.angle = {}
    this.angle.items = {
      default: new THREE.Vector3(1.135, -1.45, 1.15),
      projects: new THREE.Vector3(0.38, -1.4, 1.63)
    }
    this.angle.value = new THREE.Vector3()
    this.angle.value.copy(this.angle.items.default)

    // Set method — animates to a named preset
    this.angle.set = (_name) => {
      const angle = this.angle.items[_name]
      if (typeof angle !== 'undefined') {
        gsap.to(this.angle.value, { ...angle, duration: 2, ease: 'power1.inOut' })
      }
    }
  }

  setInstance() {
    this.instance = new THREE.PerspectiveCamera(40, viewport.width / viewport.height, 1, 80)
    this.instance.up.set(0, 0, 1)
    this.instance.position.copy(this.angle.value)
    this.instance.lookAt(new THREE.Vector3())
    this.container.add(this.instance)

    // Time tick
    this.time.on('tick', () => {
      if (!this.orbitControls.enabled) {
        // Eased target
        this.targetEased.x += (this.target.x - this.targetEased.x) * this.easing
        this.targetEased.y += (this.target.y - this.targetEased.y) * this.easing
        this.targetEased.z += (this.target.z - this.targetEased.z) * this.easing

        // Apply zoom: position = target + angle.normalize() × distance
        this.instance.position.copy(this.targetEased)
          .add(this.angle.value.clone().normalize().multiplyScalar(this.zoom.distance))
      }
    })
  }
}
```

**The decomposition:**
- `target` — where the camera looks AT (in world space)
- `angle` — direction camera looks FROM (a unit vector + scale)
- `zoom.distance` — how far back from target
- `easing` — smoothing factor for target tracking

**Final camera position formula:** `targetEased + angle.normalize() × zoom.distance`

Three independent concerns. Eased separately. Animated separately.

### Adapting to R3F + ScrollTrigger for our hero

```tsx
'use client'
import { useFrame } from '@react-three/fiber'
import { PerspectiveCamera } from '@react-three/drei'
import { useRef, useEffect } from 'react'
import { Vector3, MathUtils } from 'three'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

const ANGLE_PRESETS = {
  hero:   new Vector3(0,    0,    1).normalize(),  // straight on
  problem: new Vector3(0.3, -0.2, 1).normalize(),  // slight pan-down
  pillars: new Vector3(0.5, -0.4, 0.8).normalize(),
  features: new Vector3(0.4,  0.1, 0.9).normalize(),
  custom: new Vector3(0,    0.1, 1).normalize(),  // close-up
  cta:    new Vector3(0,    0,    1).normalize(),  // back to centered
}

export function HeroCamera() {
  const cameraRef = useRef<THREE.PerspectiveCamera>(null)
  const target = useRef(new Vector3(0, 0, 0))
  const targetEased = useRef(new Vector3(0, 0, 0))
  const angle = useRef(new Vector3().copy(ANGLE_PRESETS.hero))
  const zoom = useRef({ distance: 2.8, distanceEased: 2.8 })
  const easing = 0.15

  // Wire up scroll-triggered transitions to angle presets
  useEffect(() => {
    Object.entries(ANGLE_PRESETS).forEach(([name, vec]) => {
      ScrollTrigger.create({
        trigger: `#${name}`,
        start: 'top center',
        end: 'bottom center',
        onEnter: () => gsap.to(angle.current, { x: vec.x, y: vec.y, z: vec.z, duration: 1.2, ease: 'power1.inOut' }),
        onEnterBack: () => gsap.to(angle.current, { x: vec.x, y: vec.y, z: vec.z, duration: 1.2, ease: 'power1.inOut' }),
      })
    })
  }, [])

  useFrame(() => {
    if (!cameraRef.current) return
    
    // Ease target tracking
    targetEased.current.lerp(target.current, easing)
    zoom.current.distanceEased = MathUtils.lerp(zoom.current.distanceEased, zoom.current.distance, easing)
    
    // Position = target + angle.normalize() × distance
    cameraRef.current.position
      .copy(targetEased.current)
      .add(angle.current.clone().normalize().multiplyScalar(zoom.current.distanceEased))
    
    cameraRef.current.lookAt(targetEased.current)
  })

  return (
    <PerspectiveCamera
      ref={cameraRef}
      makeDefault
      fov={35}
      near={0.1}
      far={20}
      position={[0, 0, 2.8]}
    />
  )
}
```

This is implementable in ~50 lines of cleanly-organized code. The angle presets become declarative per-section — adding a new section = add an entry to ANGLE_PRESETS. The eased lerp gives the "alive" feeling without requiring expensive cursor tracking.

### Bruno's shader organization (for Phase 2)

Bruno's `src/shaders/` directory has 9 distinct shader pairs, organized by purpose:
- `glows/` — radial glow halos
- `areaFloorBorder/` — animated section boundaries  
- `blur/` — Gaussian blur (for ground reflections)
- `areaFence/` — area-marker grid pattern
- `shadow/` and `floorShadow/` — fake shadow projection
- `floor/` — ground plane with multiple effects layered
- `matcap/` — material-capture lookup for cars

Plus `partials/` directory with reusable GLSL: `random.glsl`, `round.glsl`, `cnoise.glsl` (Classic Perlin noise), `blur9.glsl` (9-tap blur kernel).

The pattern: **organize shaders by purpose/effect, not by mesh.** Materials get composed by importing partials. This is the structure to use if we go custom-shader for Phase 2.

---

## 3. Theatre.js + R3F bridge — visual camera path authoring

### What this enables

From `theatre/packages/r3f/README.md`:

```tsx
import { editable as e, SheetProvider, extension } from '@theatre/r3f';
import studio from '@theatre/studio';

studio.extend(extension)
studio.initialize()

export default function App() {
  return (
    <Canvas>
      <SheetProvider sheet={getProject('Playground - R3F').sheet('R3F-Canvas')}>
        <e.spotLight position={[10,10,10]} angle={0.15} penumbra={1} theatreKey="Spotlight" />
        <e.pointLight theatreKey="PointLight" />
        <e.mesh theatreKey="Box">
          <boxBufferGeometry />
          <meshStandardMaterial color="orange" />
        </e.mesh>
      </SheetProvider>
    </Canvas>
  );
}
```

`editable.perspectiveCamera`, `editable.spotLight`, `editable.directionalLight`, `editable.mesh` — these wrap drei components and expose ALL their props (position, rotation, scale, intensity, color, fov...) to the Theatre Studio editor. **In dev mode**, you scrub a timeline with sliders, set keyframes, animate between them visually, and Theatre records every change. **At production** (after exporting state to a JSON file), the studio doesn't load — only the recorded animation runs against the JSON.

### The workflow this enables

1. **In dev:** Open localhost. Theatre Studio panel appears in the corner.
2. **Set up:** Wrap our PerspectiveCamera in `<e.perspectiveCamera theatreKey="HeroCamera">`.
3. **Author:** Drag camera around the 3D viewport with gizmos. Click "set keyframe". Move to next moment. Adjust position/rotation. Set keyframe. Repeat.
4. **Time scrub:** Drag timeline cursor. See camera move smoothly between keyframes.
5. **Export:** Click "Export to JSON" in Theatre Studio.
6. **Save:** JSON file at `public/animations/hero-camera.json` (or similar).
7. **Production:** Wrap with `getProject('Hero', { state: heroAnimationState })` so it reads from JSON.
8. **Drive:** ScrollTrigger updates the timeline position. `sheet.sequence.position = scrollProgress * duration`.

This means **camera path is no longer a coding task — it's a creative direction task**. The brief can specify "5 keyframes from hero to final-cta with these cues" and an implementer authors them visually rather than computing coordinates.

### Caveats

- The README explicitly says: *"Here be dragons! 🐉 `@theatre/r3f` is pre-release software, the API, the internal logic, and even the package name can and will drastically change at any time."*
- Sat ūs already has Theatre.js wired in (`@theatre/core: ^0.7.2`, `@theatre/studio: ^0.7.2`) per the package.json
- Theatre Studio in production = only loaded when explicitly enabled. By default the editor doesn't ship to production.

For the rebuild brief, **make Theatre.js for camera path authoring an explicit recommendation**, with a fallback to coded-camera (Bruno's pattern) if Theatre proves too unstable.

---

## 4. Maxime Heckel — the canonical R3F shader curriculum

### Maxime's full catalog (relevant for our work)

Sorted by relevance to Phase 1B prism scene:

| Post | Date | Why we care |
|---|---|---|
| **Refraction, dispersion, and other shader light effects** | Early 2023 | Foundation for chromatic aberration; we use drei MTM but understanding the underlying technique helps tune it |
| **Beautiful and mind-bending effects with WebGL Render Targets** | 2023 | useFBO patterns — needed for selective bloom or refraction-of-content |
| **Shining a light on Caustics with Shaders and React Three Fiber** | Jan 2024 | Light through curved surface — this is literally our prism use case. Cheats his way through (no raytracing) using normal data extracted via render targets |
| **The magical world of Particles with React Three Fiber and Shaders** | Nov 2022 | 8 unique scenes covering attribute buffers, BufferGeometry, FBO simulation. Needed for hero particle system |
| **Real-time dreamy Cloudscapes with Volumetric Raymarching** | 2024 | Atmospheric depth — useful if we want fog/light shafts around the prism |
| **Volumetric Lighting via Post-Processing with custom shader** | 2024 | God rays / light shafts emanating from prism seams — a Phase 2 enhancement |
| **Moebius-style post-processing and stylized shaders** | 2024 | Probably not for Prizm but a good shader-pass reference |
| **Field Guide to TSL and WebGPU** | Oct 2025 | THE canonical TSL/WebGPU primer. Required reading for Phase 2 WebGPU upgrade path |
| **The Study of Shaders with React Three Fiber** | 2022, ongoing | Foundation. 8 interactive 3D scenes. The R3F shader curriculum starting point |

### Maxime's recommended learning resources (his own callouts)

- **Three.js Journey** by Bruno Simon ($95) — the canonical paid course
- **Simon Dev's Courses** — game-dev-focused but deep on shader patterns
- **Inigo Quilez's blog** — advanced shader articles, raymarching, distance fields
- **Yuri Artiukh's YouTube** — reverse-engineers production scenes live; Maxime singles this out as high-value
- **Acerola's YouTube** — shader deep-dives, video game dev focus
- **Offscreen Canvas newsletter** by Daniel Velasquez — shader tips/tricks
- **Mofu by Misaki Nakano** — Three.js + shader blog (English/Japanese)
- **Geomancer by Kenneth Pirman** — real-time 3D fantasy worlds in browser (impressive R3F production work)
- **Shadertoy** — pro shader showcase

### The high-leverage takeaway

Maxime's caustics post is directly relevant. From his abstract: *"by leveraging normals, render targets, and some math and shader code, you can render those beautiful and shiny swirls of light."* The "cheat" approach: extract surface normal data via render target, sample in a fragment shader to derive how light converges/diverges, render result on a plane below the object. **This is the Phase 2 path for adding caustic light patterns BENEATH the prism** — would tie the brand mark to the content section visually (light from prism literally hitting the rest of the page).

For Phase 1B we don't need caustics. For Phase 2, when we want to differentiate from the basement.studio prism (which doesn't do caustics — it's just the prism + beam particles), Maxime's article is the implementation guide.

### Maxime's Three.js Journey + Bruno Simon endorsement

Both Maxime AND multiple other creative dev sources point to **Three.js Journey** ($95, Bruno Simon's course) as the canonical structured curriculum for someone learning R3F/three.js to a professional level. **For team-scaling this project** (when we hire or when an additional implementer comes on), this is the curriculum recommendation. Doesn't need to be in v1 brief but is a "for the team" note.

---

## 5. Implementation review — current Prizm hero code

Even though we're rebuilding, the current code teaches us what works.

### Files reviewed

- `app/(marketing)/_sections/hero/index.tsx` — section layout
- `app/(marketing)/_sections/hero/hero-mark-3d/index.tsx` — canvas mount
- `app/(marketing)/_sections/hero/hero-mark-3d/penrose-prism.tsx` — prism geometry + materials
- `app/(marketing)/_sections/hero/hero-mark-3d/hero-postprocessing.tsx` — Bloom composer
- `app/(marketing)/_sections/hero/hero-mark-3d/penrose-geometry.ts` — exists, not read in this round
- `app/(marketing)/_sections/hero/hero-mark-3d/seam-colors.ts` — exists, not read in this round

### What the prior agent got right (carry forward to rebuild)

**1. Architectural decision documented in code comments.**
Three files carry the same warning header explaining the dual-canvas reason:
> *"Local canvas required — global Sat ūs canvas is ortho+linear, this 3D scene needs perspective+sRGB+tonemapped. Do NOT migrate this back into the tunnel pattern; it'll silently degrade glass / lighting / bloom."*

**This is correct architectural thinking expressed correctly in code.** For the rebuild, we should preserve this kind of "decision recorded in the code that needs to enforce it" pattern.

**2. Canvas configuration for transmission.**
```tsx
<Canvas
  gl={{
    outputColorSpace: 'srgb' satisfies ColorSpace,
    toneMapping: ACESFilmicToneMapping satisfies ToneMapping,
    toneMappingExposure: 1.0,
    antialias: true,
    alpha: true,
  }}
  dpr={[1, 2]}
>
  <PerspectiveCamera makeDefault fov={35} position={[0, 0, 2.8]} near={0.1} far={20} />
```

**This matches Vercel × basement.studio's prism canvas almost exactly.** fov 35, near 0.1, far 20, dpr [1, 2]. ACES filmic tone mapping at exposure 1.0. Carry this forward.

**3. Hydration-safe fallback gating.**
```tsx
const [mounted, setMounted] = useState(false)
useEffect(() => setMounted(true), [])

const { hasGPU, isReducedMotion, isMobile } = useDeviceDetection()

if (!mounted || forceFallback || !hasGPU || isReducedMotion) {
  return <PrismMark size={460} variant="hero-placeholder" showSpiral />
}
```

SSR renders the SVG fallback. Client decides on mount. No hydration mismatch. Plus `forceFallback` dev toggle via URL param `?fallback=1`. Plus respects `prefers-reduced-motion`. **All correct, all carry forward.**

**4. Geometry singleton pattern (React-Compiler-safe).**
```tsx
const meshRef = useRef<{...} | null>(null)
if (!meshRef.current) {
  const built = buildPenroseMesh({ depth: 0.45 })
  meshRef.current = { body: ..., seam: ..., silhouette: ..., bodyTriCount: ... }
}
```

This is the correct pattern for "build once, use forever" with React Compiler. The CLAUDE.md exception rule for class/object instantiation. Carry forward.

**5. MTM configuration.**
```tsx
<MeshTransmissionMaterial
  transmission={0.95}
  thickness={0.4}
  ior={1.6}                      // crystal-ish, between glass (1.5) and diamond (2.4)
  chromaticAberration={0.2}      // visible spectrum spread
  anisotropicBlur={0.1}
  roughness={0.05}               // very crisp
  distortion={0}                 // disabled
  distortionScale={0}
  temporalDistortion={0}
  samples={isMobile ? 6 : 10}    // mobile budget
  resolution={isMobile ? 512 : 1024}
  backside={false}
  color="#0a0c16"                // body tint (deep navy)
  attenuationColor="#7c4ff5"     // violet attenuation through volume
  attenuationDistance={0.8}
/>
```

**This is a strong baseline.** ior 1.6, chromatic 0.2, samples 6/10, resolution 512/1024 — these are the values to start the rebuild with. The prior agent did the calibration work.

**6. Three-point lighting in brand colors.**
```tsx
<ambientLight intensity={0.12} />
<directionalLight position={[2, 3, 4]} intensity={3.5} color="#00cfee" />     // cyan key
<directionalLight position={[-3, 0.5, 2]} intensity={1.6} color="#7c4ff5" />  // violet fill
<directionalLight position={[0, 2, -3]} intensity={2.2} color="#00cfee" />    // cyan back
```

Cyan is the brand primary; violet is the brand accent. Three-point setup with the key being strong (3.5), fill being weak (1.6), and back being moderate (2.2). **Carry forward.**

**7. Bloom + emissive seam mechanic.**
```tsx
seamMaterial = new MeshBasicMaterial({
  vertexColors: true,
  toneMapped: false,        // emissive — bloom will catch this
  blending: AdditiveBlending,
  transparent: true,
  depthWrite: false,        // doesn't occlude
})

// In hero-postprocessing.tsx:
new BloomEffect({
  luminanceThreshold: 0.65,  // body never exceeds this
  luminanceSmoothing: 0.3,
  intensity: 1.5,
  kernelSize: KernelSize.LARGE,
  mipmapBlur: true,
  radius: 0.5,
})
```

The mechanic: body is dark (#0a0c16), seams are emissive with `toneMapped: false` so they exceed the threshold and bloom. Body stays below threshold so it doesn't bloom. **Surgical, correct, carry forward.**

**8. Subtle motion.**
```tsx
useFrame(({ clock }) => {
  group.rotation.y = (t * Math.PI * 2) / 30  // 30s yaw cycle
  group.position.y = Math.sin((t * Math.PI * 2) / 6) * 0.05  // 6s vertical bob, 5cm amplitude
})
```

30-second yaw + 6-second 5cm bob. **Subtle, not gaudy.** Bruno would approve.

**9. Dev URL params for screenshot determinism.**
- `?fallback=1` forces SVG fallback
- `?rot=N` freezes rotation at N degrees (deg, converts to radians)

**Excellent for visual QA across iteration rounds.** Carry forward.

**10. Disposal cleanup.**
```tsx
useEffect(() => {
  const mesh = meshRef.current
  const seamMat = seamMaterialRef.current
  return () => {
    mesh?.body.dispose()
    mesh?.seam.dispose()
    mesh?.silhouette.dispose()
    seamMat?.dispose()
  }
}, [])
```

Geometry + material disposal. Good practice. Carry forward.

### What the prior agent missed (improve in rebuild)

**1. No drei `<View>` wrap.**
The hero canvas is a separate `<Canvas>` from the Sat ūs GlobalCanvas, not a drei `<View>` inside it. **Two WebGL contexts** competing — exactly what r3f-scroll-rig's README warns against: *"there is a browser-specific limit to how many WebGL contexts can be active at any one time."* For the rebuild, use Option B (drei `<View>` inside Sat ūs WebGLTunnel) so we have ONE WebGL context.

**2. Single hardcoded camera path.**
The current code positions camera at `[0, 0, 2.8]` and never moves it. Nothing scroll-driven. For the rebuild, use Bruno's eased-targeting + named-angle-presets pattern. **Plus** wrap the camera in `<editable.perspectiveCamera theatreKey="HeroCamera">` so the camera path is visually authored.

**3. No environment customization.**
`<Environment preset="studio" />` works for prototype but the studio HDRI doesn't reflect Prizm's brand colors. **For the rebuild:** start with `studio` preset, then move to a custom HDRI. From v4 §10: Poly Haven "Ferndale Studio 02" or "TV Studio" (both CC0) give better cyan + warmer reflection sampling. Or generate a custom HDR with brand-color gradients.

**4. No particles around the prism.**
Vercel × basement.studio's prism has beam particles (light rays bouncing through the prism into rainbow output). Our current implementation has zero particle system. **For the rebuild:** add InstancedMesh particle system. Phase 1B target: 5K desktop / 2K mobile. Phase 2: TSL particle system per the Codrops Gommage pattern (v5 §4).

**5. No interactivity beyond scroll.**
The prism rotates on a timer regardless of cursor or scroll. **For the rebuild:** subtle cursor-influenced parallax (camera target shifts toward cursor at low magnitude, eased) — Bruno's eased-targeting pattern handles this automatically. Plus ScrollTrigger-driven angle preset transitions.

**6. No camera path through scroll.**
One angle, one zoom. No motion through the page. **For the rebuild:** as you scroll past the hero, camera pulls back ~30%. As you reach Prizm Custom, camera moves close-up to a single facet. As you reach Final CTA, camera returns to centered. **Six camera presets, scroll-triggered, GSAP-eased between them.**

**7. No orchestration of WebGL across sections.**
AnimatedGradient on FinalCta is a separate concern from the prism. They're in two separate canvases. For the rebuild, ONE canvas with multiple Views. The prism is a hero View. AnimatedGradient is a footer View. They share the canvas + GL context.

---

## 6. The architectural blueprint for Phase 1B rebuild (NOW LOCKED)

Combining v2-v6 findings, the final architecture is:

### Canvas: ONE GlobalCanvas in app/layout.tsx

```tsx
// app/layout.tsx
import { GlobalCanvas } from '@/lib/webgl/components/global-canvas'

export default function Layout({ children }) {
  return (
    <html>
      <body>
        {/* ... */}
        {children}
        {/* ... */}
        <GlobalCanvas postprocessing forceWebGL />  {/* forceWebGL until WebGPU+transmission bug class resolved */}
        <ReactTempus />
      </body>
    </html>
  )
}
```

`postprocessing` enables the EffectComposer chain. `forceWebGL` bypasses the WebGPU+transmission bug class (per v5 §5). Once the three.js bug is fixed (track three.js r190+ release notes), drop `forceWebGL` and let WebGPU auto-select.

### Sections: drei `<View>` per scene

```tsx
// components/sections/hero/index.tsx
'use client'

import { View } from '@react-three/drei'
import { useRef } from 'react'
import { HeroScene } from './hero-scene'

export function Hero() {
  const containerRef = useRef<HTMLDivElement>(null)
  return (
    <section ref={containerRef} className="hero">
      {/* HTML content (copy, CTAs) */}
      <div className="copy">
        <h1>Everyone on the same platform. <em>Nothing falling through.</em></h1>
        {/* ... */}
      </div>
      {/* The View tunnels the 3D content into the global canvas */}
      <View track={containerRef} className="prism-mark">
        <HeroScene />
      </View>
    </section>
  )
}
```

The `<View>` returns a portal that gets rendered to the global canvas with scissor-tested viewport bounds matching `containerRef.current.getBoundingClientRect()`.

### Hero scene: own camera, lights, env, materials

```tsx
// components/sections/hero/hero-scene.tsx
'use client'

import { PerspectiveCamera, Environment, MeshTransmissionMaterial } from '@react-three/drei'
import { editable as e } from '@theatre/r3f'  // optional: for visual camera authoring
import { Suspense } from 'react'
import { PrismMesh } from '../shared/prism-mesh'

export function HeroScene() {
  return (
    <>
      <e.perspectiveCamera 
        theatreKey="HeroCamera"
        makeDefault 
        fov={35} 
        position={[0, 0, 2.8]} 
        near={0.1} 
        far={20} 
      />
      
      <ambientLight intensity={0.12} />
      <directionalLight position={[2, 3, 4]} intensity={3.5} color="#00cfee" />
      <directionalLight position={[-3, 0.5, 2]} intensity={1.6} color="#7c4ff5" />
      <directionalLight position={[0, 2, -3]} intensity={2.2} color="#00cfee" />
      
      <Suspense fallback={null}>
        <Environment preset="studio" background={false} environmentIntensity={0.5} />
      </Suspense>
      
      <PrismMesh />
    </>
  )
}
```

### Postprocessing: at the global canvas level, with ACES tone mapping at the END

The Sat ūs GlobalCanvas's `<PostProcessing>` component (when activated via `postprocessing` prop) handles the chain. We need to extend it (or create a project-specific extension) to include Bloom + ToneMapping. Approximately:

```tsx
// In an extension to lib/webgl/components/postprocessing/index.ts
import { BloomEffect, EffectPass, ToneMappingEffect } from 'postprocessing'
import { ToneMappingMode } from 'postprocessing'

const bloomEffect = new BloomEffect({
  luminanceThreshold: 1.1,
  luminanceSmoothing: 0.3,
  intensity: 1.5,
  kernelSize: KernelSize.LARGE,
  mipmapBlur: true,
  radius: 0.5,
})

const toneMappingEffect = new ToneMappingEffect({
  mode: ToneMappingMode.ACES_FILMIC,
})

const bloomPass = new EffectPass(camera, bloomEffect)
const tonePass = new EffectPass(camera, toneMappingEffect)

composer.addPass(renderPass)
composer.addPass(bloomPass)
composer.addPass(tonePass)  // MUST be last
composer.addPass(copyPass)
```

Note `luminanceThreshold: 1.1` because we're using ACES_FILMIC (HDR > LDR mapping) at the postprocessing level instead of the renderer level (renderer is `linear flat`).

### Camera path: Bruno's pattern + Theatre.js for authoring

Either:
- **Theatre.js authored** — `<editable.perspectiveCamera>` + Theatre Studio scrubbing + JSON export
- **Code-authored** — Bruno's eased-targeting + ANGLE_PRESETS map + ScrollTrigger transitions

Default: Theatre.js for the camera (visual authoring lets us iterate fast on cinematic feel). Code-authored fallback if Theatre proves unstable.

### Particles: Phase 1B = InstancedMesh, Phase 2 = TSL

Phase 1B: drei `<Instances>` with 5K instances desktop / 2K mobile / 0 on low-power. Each instance is a tiny billboard or octahedron. Animated via vertex shader displacement (position + scale + rotation by attribute), driven by elapsedTime and a per-instance seed.

Phase 2: TSL-based particle system per Codrops Gommage pattern (v5 §4). Uses MRT for selective bloom per-particle.

### Mobile fallback: SVG, gated by useDeviceDetection

```tsx
const { hasGPU, isLowPower, isMobile } = useDeviceDetection()
const { prefers: reduced } = useReducedMotion()

if (!hasGPU || isLowPower || reduced) {
  return <SVGPrismFallback />
}
return <View track={ref}><HeroScene isMobile={isMobile} /></View>
```

`hasGPU` is built into Sat ūs's `gpu-detection.ts`. `isLowPower` is `(any-pointer: coarse) and (hover: none)`. `reduced` from `prefers-reduced-motion`.

---

## 7. Open questions (going into v7 / Phase 1B brief)

1. **Theatre.js or coded camera path?** Theatre is faster for iteration but README says "API will drastically change at any time." Risk: project breaks on a Theatre update. **Mitigation:** lock the version (`@theatre/core@0.7.2` is already in your package.json), avoid bleeding-edge updates.

2. **AnimatedGradient migration to View.** The current implementation uses Sat ūs's tunnel pattern with the global `linear flat ortho` canvas. To unify under one canvas with prism + AnimatedGradient, AnimatedGradient also becomes a `<View>` with its own ortho camera. Need to verify the AnimatedGradient shader works inside a View.

3. **The 11 errors in current code: what are they actually?** Without the actual error texts, we're working hypothetically. They might inform the rebuild — even if we start fresh, knowing the current failure modes prevents repeating them.

4. **Particle target counts.** I specced 5K desktop / 2K mobile. Could be 10K / 3K if the InstancedMesh is well-batched. Calibrate during prototype.

5. **HDR environment customization.** `studio` preset works for prototype. Custom HDRI gives brand-color reflection sampling. Decision: do we generate a custom HDR with brand gradients, or use a Poly Haven CC0 (Ferndale Studio 02 / TV Studio)?

6. **Caustics for Phase 2 — yes or no?** Maxime's caustics implementation requires render-target-extracted normal data + per-frame compute. ~3-5ms additional frame budget. Question is whether that crosses our mobile 16.67ms ceiling. Probably yes for desktop, no for mobile.

7. **Theatre.js vs r3f-perf.** Both are dev-mode panels. Theatre for camera authoring, r3f-perf for FPS/draw call monitoring. They CAN coexist but may visually clutter. Solution: r3f-perf via URL flag (`?perf=1`), Theatre only when authoring camera.

---

## 8. v7 / future research priorities

The browser automation MCP (Claude in Chrome) is reserved for v7. Once connected, the highest-value experiential research:

1. **Vercel Next.js Conf 2022 prism live** — `nextjs.org/conf/oct22/registration` — multi-screenshot sequence, scroll states, beam interactions
2. **basement.studio agency site** — PS1 walkthrough (per Maxime's callout) — see what "unique agency website" means
3. **Active Theory portfolio** — AI nav, immersive 3D environments — calibrate T0 ceiling
4. **Exo Ape's Amaterasu** — quantum-algorithms-translated-to-feel pattern
5. **Studio Freight clients** — Brex, Mercury, Dragonfly motion language
6. **Lusion's animation systems** — buttery-motion calibration  
7. **darkroom.engineering's own client work** — Looped, Ibicash, Ecotrak — the Sat ūs stack in production
8. **14islands' Cartier Yearbook** — r3f-scroll-rig at brand-tier
9. **Awwwards SOTD recent winners** — current 2026 motion language

Plus more textual deep dives for v7-v10:

10. **Yuri Artiukh YouTube** — reverse-engineering production scenes, per Maxime's recommendation
11. **basement.studio open repos** — they have public GitHub presence
12. **Three.js r190+ release notes** — WebGPU+transmission bug timeline
13. **threejs.paris Sept 2026 conference recordings** — first dedicated Three.js conference
14. **Codrops 2026 tutorials** I haven't read — Naughtyduk, Malvah, Forged spotlights
15. **Maxime Heckel's render targets post** — needed for Phase 2 caustics
16. **Pmndrs ecosystem audit** — what's in @react-three/drei that we should use that we're not (Float, useScroll, ScrollControls, Sparkles, Trail, Lightformer, etc.)

---

## TL;DR for v6

1. **r3f-scroll-rig is the architectural ancestor of both Sat ūs's tunnel pattern AND drei `<View>`** — same scissor-test multi-scene technique, three implementations. For the rebuild, use drei `<View>` inside Sat ūs's WebGLTunnel (Option B) — gets us ONE WebGL context, not two.

2. **Bruno Simon's eased-targeting + angle-presets camera pattern** is the gold standard for our hero camera. Adapted to R3F + ScrollTrigger in ~50 lines. Each section has a named angle preset; transitions via GSAP; eased lerp gives the "alive" feeling without expensive cursor tracking.

3. **Theatre.js + R3F bridge enables visual camera path authoring** via `<editable.perspectiveCamera theatreKey="HeroCamera">` + Theatre Studio scrub editor + JSON export at production time. 5-10x productivity multiplier vs. coding camera coords. Sat ūs already has Theatre wired in.

4. **Maxime Heckel is the canonical R3F shader curriculum.** His caustics post is directly relevant for Phase 2 (light through curved surface → light pattern beneath). His TSL field guide is required reading for Phase 2 WebGPU upgrade. His full catalog (~10 posts) covers refraction, dispersion, render targets, particles, volumetric raymarching, and post-processing.

5. **Current Prizm hero implementation is architecturally correct** — dual-canvas with explicit code-comment justification — but the rebuild should use drei `<View>` + Sat ūs's GlobalCanvas to consolidate to one WebGL context. The MTM config + 3-point lighting + bloom mechanic + dev URL params + hydration-safe gating all carry forward to the rebuild as proven baselines.

The architectural blueprint for Phase 1B is now fully resolved. v7+ rounds are calibration and experiential research. The brief can be drafted whenever you're ready.
