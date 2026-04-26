# Prizm Marketing Site — Research Findings v3 (Supplement to v2)

**Compacted:** April 25, 2026 (continuation session)
**Combines with:** PRIZM_CHAT_RECAP_v2.md (the master handoff)
**Purpose:** Capture deep research into darkroom's open source ecosystem, cutting-edge 2025-2026 tooling, and rest-of-site animation systems. Read v2 first; this is the technical addendum that should drive the Phase 1B brief.

---

## ★ TOP-OF-MIND CALLOUTS ★

Three things genuinely change strategy from v2:

**1. darkroom ships an installable Claude Code config (`cc-settings`).** One bash command installs 10 agents, 43 skills, and a dedicated `webgl` profile for "3D web (R3F, Three.js, GSAP)" — exactly Phase 1B. This is the same config darkroom themselves use. We were going to invent multi-agent orchestration; they already did. **Install BEFORE writing the Phase 1B brief.**

**2. WebGPU is now production-ready.** Three.js r171 (Sept 2025), Safari 26 supports it, ~95% browser coverage, automatic WebGL2 fallback. Compute shaders give 10–100× perf gains for particle systems. R3F v9 supports async `gl` prop. **This is a real Phase 1B decision point.** Recommendation: WebGPU + WebGL fallback. The "elite or the few" audience runs the hardware that benefits.

**3. The prior agent's "local hero canvas" decision should be re-examined.** The 14islands `r3f-scroll-rig` paradigm (which Sat ūs is built on) supports perspective + sRGB + ACESFilmic at the framework level. The prior agent's claim that the global canvas is "orthographic + linear + flat" and incompatible with 3D may be specific to how Sat ūs ships it, not a framework constraint. **Before adding a separate canvas, try reconfiguring the global one.** The 11 errors might be `forceSinglePass` / version mismatches, not architectural.

---

## 1. The full darkroom open-source ecosystem

darkroom.engineering is the dev-first creative studio (NOT Darkroom marketing agency). Built ibi.cash, looped.poly.ai, badomensofficial.com, dragonfly.xyz, deso.com, orderful.com, and more. 17 contributors, 13.6K cumulative GitHub stars, 196K weekly downloads across the OSS suite.

### The full library suite

| Lib | Size | Role | Why it matters for us |
|---|---|---|---|
| **Sat ūs** | (starter) | Next.js 16 + React 19 + Tailwind v4 + the rest pre-wired | Already what we're on |
| **Tempus** | ~1KB | Single RAF orchestrator with priority system | Eliminates "multiple RAF loops fighting" jank — the prior agent's foundational issue |
| **Lenis** | ~3KB | Smooth scroll engine | Already integrated; scroll-truth source |
| **Elastica** | ~5KB | Physics engine — AABB collisions, grid hash | **NEW finding.** Use for 6-chip convergence in Problem section |
| **Hamo** | ~2KB | Re-render-free hooks: `useRect`, `useWindowSize`, `useIntersectionObserver` | Critical for parallax math without React re-renders |
| **Omnes** | ~1KB | Universal package manager wrapper | Dev tooling only |
| **Aniso** | — | ASCII generator/customizer | Decorative, not core |
| **Revelo** | — | Text-reveal component (Framer-only) | Technique reference, not directly usable in Next.js |
| **cc-settings** | — | **Claude Code config: 10 agents, 43 skills, webgl profile** | **The biggest tooling win available** |
| **Specto** | — | Performance monitoring + macOS app | Worth installing for perf budget gating |
| **Theca** | — | Design asset management | Not core to us |
| **Nuntio** | — | CRM built with Resend | Not core to us |

### Tempus — the orchestration spine

This kills the "multiple RAFs fighting" problem the prior agent flagged but never solved. **Single RAF, priority-ordered:**

```js
import Tempus from 'tempus'

// Priority 100: Lenis runs first — scroll position must be authoritative
Tempus.add((time) => lenis.raf(time), 100)

// Priority 50: GSAP reads from updated scroll position
Tempus.add((time) => gsap.updateRoot(time / 1000), 50)
gsap.ticker.remove(gsap.updateRoot)
gsap.ticker.lagSmoothing(0)

// Priority 0: R3F renders last, after all state updates
// (need to set Canvas frameloop="never" and drive renderer manually)
Tempus.add((time, dt) => {
  // update scene state
  gl.render(scene, camera)
}, 0)

Tempus.start()
```

For Phase 1B, this means **the WebGL hero plugs into Tempus, not its own loop.** R3F's `<Canvas frameloop="never">` disables the internal RAF; we drive `gl.render()` from Tempus. Eliminates contention entirely. This is more invasive than the prior brief's approach but it's how Sat ūs is designed to work.

### Lenis + GSAP ScrollTrigger canonical integration

Already covered in v2, but verbatim for the brief:

```js
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
gsap.registerPlugin(ScrollTrigger)

const lenis = new Lenis({ autoRaf: false }) // Tempus drives it

lenis.on('scroll', ScrollTrigger.update)
```

**Known mobile perf gotcha** (from a Sat ūs maintainer's GitHub discussion): Lenis + GSAP + R3F caused FPS drops from 60 → 40 on mobile. Resolution: use `lenis` package (NOT the legacy `@studio-freight/lenis`), and drive everything through Tempus.

### Elastica — for the 6-chip Problem section

The prior brief described 6 tool chips converging into the Prizm mark. Elastica is purpose-built for this. AABB collision detection with grid hash for efficient broad-phase. React integration via `useElastica` + `useBody`. Configure with `restitution: 0.8` (slight energy loss on collision) and let the chips drift physically toward the center. It looks earned, not animated.

### Hamo — re-render-free measurement

Critical for parallax: any time you read `getBoundingClientRect()` in React, you risk triggering re-renders. Hamo's hooks use refs internally and never trigger React updates:

```js
import { useRect, useWindowSize, useIntersectionObserver } from 'hamo'

const [rectRef, rect] = useRect()
const { width, height } = useWindowSize()
```

Use everywhere the prior brief had `getBoundingClientRect()` calls.

---

## 2. cc-settings — the Claude Code orchestration layer

**Single biggest tooling upgrade available to us.**

Repo: `darkroomengineering/cc-settings`. v8.0 as of early 2026. 21 GitHub stars (small but real), TypeScript 95.3%.

### What it ships

- **`AGENTS.md`** — portable coding standards (~1,500 tokens). Cross-tool compatible (Codex, Cursor, Copilot, Windsurf, 20+ tools)
- **`CLAUDE.md`** — Claude-Code-specific config (~1,200 tokens, slim)
- **10 specialized agents** in `agents/`
- **43 auto-invocable skills** in `skills/`
- **5 workflow profiles** in `profiles/`:
  - `maestro` — full orchestration, delegate everything to agents
  - `nextjs` — Next.js App Router web apps
  - `react-native` — Expo mobile
  - `tauri` — Tauri desktop
  - **`webgl` — 3D web (R3F, Three.js, GSAP)** ← our Phase 1B profile
- **Path-conditioned rules** that load on-demand based on file type
- **27 hook events** for safety nets, statusline, etc.
- **Two-tier knowledge system**: `/learn store` for local memory, `/learn store --shared` for team-wide GitHub Project board persistence

### v8 design principle

Token efficiency. v7 loaded a 538-line monolithic CLAUDE.md into every agent spawn — ~5,000 tokens × 9 agents = ~45K tokens just for config. **v8 layers it**: base ~2,700 tokens, orchestration opt-in, rules contextual. A third of API spend was previously re-reading config; v8 fixes that.

### Install

**One command** (macOS/Linux):
```bash
bash <(curl -fsSL https://raw.githubusercontent.com/darkroomengineering/cc-settings/main/setup.sh)
```

**Windows (Knighthawk's machine):**
```powershell
.\setup.ps1
```

(Auto-installs Bun if missing. Restart Claude Code after.)

### Recommendation

**Install before writing the Phase 1B brief.** The `webgl` profile is built for our exact domain. Combine `maestro` + `webgl` profiles for Phase 1B sessions. The brief should reference specific cc-settings agents/skills by name, not invent its own.

---

## 3. WebGL vs WebGPU for the hero — real decision point

### What changed in 2025-2026

- **Three.js r171 (Sept 2025)**: zero-config WebGPU support. Just `import { WebGPURenderer } from 'three/webgpu'`.
- **Safari 26**: ships WebGPU support — closes the last major-browser gap. ~95% global coverage now.
- **Automatic WebGL2 fallback**: `forceWebGL: true` flag, or just don't pass — Three handles it.
- **TSL (Three Shader Language)**: node-based shader system that compiles to WGSL (WebGPU) AND GLSL (WebGL). Write once, run on both backends. Renderer-agnostic.
- **Compute shaders**: 10–100× perf gains on particle systems and physics. The single biggest perf delta over WebGL.
- **R3F v9**: async `gl` prop pattern:
  ```jsx
  <Canvas gl={async (props) => {
    const renderer = new WebGPURenderer(props as any)
    await renderer.init()
    return renderer
  }}>
  ```

### Implications for our perf budget

The prior brief's perf budget was based on WebGL constraints:
- 5,000 desktop / 2,000 mobile particles
- 6 mobile / 10 desktop transmission samples
- 8,000 total scene polys

**On WebGPU with compute shaders, these constraints relax dramatically.** Realistic WebGPU budget:
- 50,000+ particles even on mobile
- 16+ transmission samples without breaking 60fps on iPhone 14
- 30,000+ total polys

That headroom unlocks scene density — caustics + volumetric fog + flow-field particles + emissive seam glow + chromatic dispersion all running concurrently. This is what "70-85% of activetheory tier" actually requires.

### The R3F caveat

R3F's official position (early 2026): "does not yet fully support the WebGPU renderer... the Poimandres team is actively working on compatibility." Translation: it works (Maxime Heckel's Field Guide to TSL and WebGPU, Oct 2025, demonstrates this in production), but some drei components (especially older post-processing wrappers) may need TSL rewrites or fall back. This is a *real* friction point we should be aware of.

### Recommendation

**WebGPU primary, WebGL fallback automatic.** The `forceWebGL: true` escape hatch lets us debug deterministically. The "elite or the few" audience overwhelmingly runs hardware that benefits. Build the brief assuming WebGPU first.

If WebGPU + drei components creates blockers in the iteration loop, the brief should have an explicit fallback path: "If `MeshTransmissionMaterial` doesn't render correctly under WebGPU, fall back to WebGL for the prism material specifically while keeping particles on WebGPU compute."

---

## 4. Maxime Heckel — the canonical implementation triad

One author, consistent vocabulary, all R3F. The Phase 1B brief should cite these by URL and attribute techniques to specific posts. **Send Claude Code to read these directly via `web_fetch` before writing material code.**

| Post | Date | What it teaches | Where it applies |
|---|---|---|---|
| [The Study of Shaders with R3F](https://blog.maximeheckel.com/posts/the-study-of-shaders-with-react-three-fiber/) | 2022 | Foundation: vertex/fragment shaders in R3F, varyings, uniforms | Required reading before custom shader work |
| [Refraction, dispersion, and other shader light effects](https://blog.maximeheckel.com/posts/refraction-dispersion-and-other-shader-light-effects/) | 2023 | IOR, refract function, chromatic dispersion at the shader level (not via MTM) | The actual prism physics — more advanced than drei's MTM |
| [Real-time dreamy Cloudscapes with Volumetric Raymarching](https://blog.maximeheckel.com/posts/real-time-cloudscapes-with-volumetric-raymarching/) | (linked in his blog index) | Volumetric fog via raymarching | Hero scene's atmospheric depth |
| [The magical world of Particles with R3F and Shaders](https://blog.maximeheckel.com/posts/the-magical-world-of-particles-with-react-three-fiber-and-shaders/) | 2022 | Buffer geometries, FBO ping-pong, attribute particles | Hero particle system foundation |
| [Shining a light on Caustics](https://blog.maximeheckel.com/posts/caustics-in-webgl/) | Jan 2024 | **Render targets, normal-map-based caustics, real-time caustic rendering** | The signature "light through prism" effect |
| [The Art of Dithering and Retro Shading](https://blog.maximeheckel.com/posts/the-art-of-dithering-and-retro-shading-web/) | Aug 2024 | Custom post-processing passes via `pmndrs/postprocessing` | Important for our raw postprocessing pattern |
| [Moebius-style post-processing](https://blog.maximeheckel.com/posts/moebius-style-post-processing/) | Aug 2024 | Custom Effect API, normal recomputation after vertex displacement | Post-processing technique grammar |
| [Field Guide to TSL and WebGPU](https://blog.maximeheckel.com/posts/field-guide-to-tsl-and-webgpu/) | **Oct 2025** | **TSL syntax, WebGPU setup in R3F, compute shaders, custom post-processing on WebGPU** | **The bridge to our WebGPU path** |

### The triad for our hero specifically

1. **Refraction & dispersion** → the prism body's chromatic spectrum-splitting (more accurate than MTM's built-in chromaticAberration)
2. **Caustics** → the signature ribbons of light the prism casts, using normals + render targets
3. **Volumetric raymarching** → the atmospheric fog the prism sits inside

These three together reproduce the activetheory "light caught in water" feeling, but tuned to "light through prism, in motion" (concept A from v2).

---

## 5. drei `MeshTransmissionMaterial` — full param spec

Complete prop list (verified against drei master + drei-vanilla source):

| Prop | Type | Default | Our value | Notes |
|---|---|---|---|---|
| `transmission` | number | 1 | 1 | Reserved by Three; if `transmissionSampler: true`, set to 0 |
| `thickness` | number | 0 | **3.0–4.0** | Refraction depth — needs to be high for visible internal refraction |
| `backside` | boolean | false | **true** | Render the backside — necessary to see internal Robinson seams through glass |
| `backsideThickness` | number | 0 | **2.0–3.0** | Backside refraction depth |
| `roughness` | number | 0 | **0.02–0.05** | Lower = clearer glass |
| `chromaticAberration` | number | 0.03 | **0.06–0.12** | Spectrum-splitting intensity. Higher = more dramatic prism effect |
| `anisotropicBlur` | number | 0.1 | **0.4–0.8** | Directional blur — premium "expensive" glass quality |
| `anisotropy` | number | 0.1 | **0.6** | Material physical anisotropy (different from blur) |
| `distortion` | number | 0 | **0** | We want clean prism, not goopy |
| `distortionScale` | number | 0.5 | n/a | Only relevant if distortion > 0 |
| `temporalDistortion` | number | 0 | n/a | Only relevant if distortion > 0 |
| `samples` | number | 6 | **10 desktop / 6 mobile** | Refraction samples |
| `resolution` | number | (fullscreen) | **1024 desktop / 512 mobile** | Local FBO resolution. Lower = much faster |
| `backsideResolution` | number | (fullscreen) | **512 / 256** | Same logic for backfaces |
| `ior` | number | 1.5 | **1.45–1.5** | Real glass IOR. Higher = more dramatic refraction |
| `attenuationDistance` | number | Infinity | **2.0** | Light fades over this distance inside material |
| `attenuationColor` | color | white | subtle midnight | Tint applied as light traverses |
| `transmissionSampler` | boolean | false | **false** | If true, materials can't see other transmissive objects (we want them to) |
| `buffer` | Texture | null | (custom) | Pass shared FBO texture for multi-material economy |
| `forceSinglePass` | boolean | true | **false** | **CRITICAL — see issue #45 / 11 errors discussion** |
| `background` | Texture/Color | null | (HDR env) | Buffer scene background |

### The 11-errors mystery — likely culprit

drei issue #45 (Nov 2023) and issue #1628 (Aug 2023) both discuss `MeshTransmissionMaterial` failing with errors mentioning `RawShaderMaterial` and `NodeMaterial` incompatibilities — **same error class as our 11 errors.** Root causes documented:

- Three.js version mismatch with drei version
- `forceSinglePass: true` (the default in some versions) breaks the chromatic aberration / displacement features
- `MeshTransmissionMaterial` extends `MeshPhysicalMaterial`, which means upgrading three.js can break MTM if drei isn't bumped at the same time

**Diagnostic order for the 11 errors:**
1. Run `bun pm ls` and check `three`, `@react-three/fiber`, `@react-three/drei` versions. drei must match three's major version.
2. If we set `forceSinglePass: false` and the errors change/improve, that's the bug.
3. Only if both above fail is the prior agent's "local hero canvas" architecture actually needed.

---

## 6. The Sat ūs WebGL architecture — re-examined

The prior agent claimed Sat ūs's GlobalCanvas is "orthographic + linear + flat — purpose-built for fullscreen pixel-coordinated effects." This may be specific to Sat ūs's default config, but the underlying **`tunnel-rat` / `r3f-scroll-rig` paradigm fully supports perspective + 3D content.**

### How tunnel-rat / scroll-rig pattern works

- **One `<GlobalCanvas>`** at the layout level, persists across navigations
- **`tunnel-rat`** (pmndrs) provides "tunnels" — components anywhere in the tree can portal R3F content into the global canvas
- **`<UseCanvas>` / `useCanvas`** = the tunnel entry point
- **`<ScrollScene>`** automatically tracks DOM element bounding rects via Hamo, syncs WebGL mesh position/scale to match — pixels-perfect alignment between DOM and WebGL
- **One WebGL context** for the whole site = no context-creation overhead, no browser context-limit issues (most browsers cap at 16 active WebGL contexts)
- **Default R3F settings**: perspective camera 50° FoV, ACES Filmic tone mapping, sRGB output

The "orthographic + linear + flat" claim looks like it describes Sat ūs's explicit override for the default starter (which uses fullscreen gradient effects). **It is reconfigurable.**

### Implications for the prior agent's "local canvas" decision

Three options, in order of architectural cleanliness:

**Option A — Reconfigure global canvas (best if it works):**
- Update Sat ūs's GlobalCanvas to default perspective + sRGB + ACESFilmic
- The existing `AnimatedGradient` component (used in FinalCta) needs to be checked: does it require ortho/linear, or does it work with perspective/sRGB?
- If it works, we're back to one canvas, framework happy
- If it breaks, fall to Option B

**Option B — Mixed cameras in one canvas:**
- Keep the global canvas as-is
- The hero scene uses its own perspective camera via `makeDefault` only when in view
- The AnimatedGradient uses an orthographic camera when in view
- R3F supports multiple cameras — only one is "default" at a time
- Camera swaps tied to scroll position via Theatre.js / IntersectionObserver

**Option C — Local hero canvas (prior agent's choice):**
- Dedicated `<Canvas>` for the hero only
- Acknowledged downsides: extra WebGL context, fighting the framework, two postprocessing patterns to maintain
- Acknowledged upsides: clean separation, explicit `gl` config, can't break FinalCta

**Recommendation:** Try A first, fall to B if blocked. Only do C if both fail. The 11 errors are likely a version/param fix, not an architectural mandate.

---

## 7. Theatre.js + Lenis — the actual scroll-coupled camera pattern

The prior recap mentioned Theatre.js but didn't have the wiring. Here it is:

```jsx
import { getProject, val } from "@theatre/core"
import { SheetProvider, PerspectiveCamera, useCurrentSheet } from "@theatre/r3f"
import { useFrame } from "@react-three/fiber"
import Tempus from 'tempus'

// Studio is dev-only — gate it
if (process.env.NODE_ENV === 'development') {
  const studio = await import("@theatre/studio")
  const extension = await import("@theatre/r3f/dist/extension")
  studio.default.initialize()
  studio.default.extend(extension.default)
}

const sheet = getProject("Prizm Hero").sheet("HeroScene")

// Inside <Canvas>, wrap scene with SheetProvider:
<SheetProvider sheet={sheet}>
  <HeroScene />
</SheetProvider>

// Inside HeroScene component:
function HeroScene() {
  const sheet = useCurrentSheet()
  
  // Compute hero section's scroll progress 0-1 from Lenis
  // (don't use drei's ScrollControls — it's a competing scroll abstraction)
  useFrame(() => {
    const heroProgress = computeHeroScrollProgress() // 0-1 based on Lenis
    const sequenceLength = val(sheet.sequence.pointer.length)
    sheet.sequence.position = heroProgress * sequenceLength
  })
  
  return <PerspectiveCamera theatreKey="HeroCamera" makeDefault fov={35} />
}
```

### The "compute hero scroll progress" function

```js
// Use ScrollTrigger or a manual calculation
import { ScrollTrigger } from 'gsap/ScrollTrigger'

let heroProgress = 0
ScrollTrigger.create({
  trigger: heroSectionRef.current,
  start: "top top",
  end: "bottom top",
  onUpdate: (self) => { heroProgress = self.progress }, // 0 to 1
  scrub: false // we read progress manually each frame
})
```

### Critical gates

- **Studio import gated to dev**: `@theatre/r3f/dist/extension` (NOT `@theatre/r3f`) is the export to gate. Production bundle stays slim.
- **Each `theatreKey` must be unique per `SheetProvider`** — duplicate keys silently break the sheet.
- **The `editable.perspectiveCamera` from `@theatre/r3f`** is the camera type for sequencing; not the drei one.
- **`lookAt` prop** can be passed any object/ref; Theatre.js will track it both live and in the editor.

---

## 8. Rest-of-site animation systems

### GSAP 3.13+ baseline (NEW — was paid in 3.12)

**Webflow acquired GSAP in October 2024.** As of 3.13:
- **SplitText is FREE** (was Club GreenSock plugin)
- **`mask` property** auto-wraps in overflow:hidden — no more manual span wrapping for masked reveals
- `SplitText.create()` is the preferred API (over `new SplitText()`)
- All ScrollTrigger features remain free

### The canonical text reveal pattern (Prizm hero H1)

```jsx
import { useGSAP } from '@gsap/react' // modern hook with auto-cleanup
import gsap from 'gsap'
import { SplitText } from 'gsap/SplitText'
gsap.registerPlugin(SplitText)

function Title({ children, className }) {
  const ref = useRef(null)
  
  useGSAP(() => {
    const split = SplitText.create(ref.current, {
      type: 'lines, words',  // split into lines and words
      mask: 'lines',          // overflow:hidden wrapper per line
      smartWrap: true,        // handles edge cases
    })
    
    gsap.from(split.lines, {
      y: '100%',
      opacity: 0,
      ease: 'power3.out',
      duration: 1.2,
      stagger: 0.1,
      delay: 0.5,
    })
  }, { scope: ref })
  
  return <h1 className={cn("overflow-hidden", className)} ref={ref}>{children}</h1>
}
```

For the locked Prizm H1 — `Everyone on the same platform. <em>Nothing falling through.</em>` — this gives a clean masked-line reveal that respects the italic pivot word.

### Scroll-velocity-coupled effects

`ScrollTrigger.getVelocity()` returns pixels/second. Use it to make ambient elements feel scroll-reactive:

```js
useFrame(() => {
  const velocity = ScrollTrigger.getVelocity() // pixels/sec, can be negative
  const normalized = clamp(velocity / 1000, -1, 1) // -1 to 1
  
  // Examples:
  prismMesh.rotation.y += dt * (1 + normalized * 2)  // prism spins faster on fast scroll
  particleFlowfieldStrength = lerp(prev, 1 + Math.abs(normalized), 0.1)
})
```

Subtle, but the site feels alive without explicit triggers.

### Marquee patterns (if we add a partner/logos strip later)

GSAP's official `seamlessLoop` helper or `@andresclua/infinite-marquee-gsap` package both give the canonical pattern. For scroll-velocity coupling:

```js
const marquee = gsap.to(".marquee-track", {
  xPercent: -100,
  repeat: -1,
  duration: 20,
  ease: "linear"
})

// Reverse direction on scroll-up:
window.addEventListener("scroll", () => {
  const dir = scrollDirection() // 1 or -1
  gsap.to(marquee, { timeScale: dir, duration: 0.5 })
})
```

We don't currently have a marquee in the spec but flagging this in case logos / "operators we work with" gets added.

### Magnetic CTA (the one cursor effect worth doing)

Custom site-wide cursor: probably wrong call for B2B mobile-first audience (90% of traffic is mobile, custom cursors disable on touch, can feel pretentious).

**Targeted magnetic effect on the primary "Talk to the founder" CTA: defensible.** Pattern:

```jsx
function MagneticCTA({ children }) {
  const ref = useRef(null)
  
  useGSAP(() => {
    const xTo = gsap.quickTo(ref.current, "x", { duration: 0.4, ease: "power3" })
    const yTo = gsap.quickTo(ref.current, "y", { duration: 0.4, ease: "power3" })
    
    const onMove = (e) => {
      const rect = ref.current.getBoundingClientRect()
      const cx = rect.left + rect.width / 2
      const cy = rect.top + rect.height / 2
      const dx = e.clientX - cx
      const dy = e.clientY - cy
      const dist = Math.hypot(dx, dy)
      const threshold = 100
      
      if (dist < threshold) {
        const force = 1 - dist / threshold
        xTo(dx * force * 0.4)
        yTo(dy * force * 0.4)
      } else {
        xTo(0); yTo(0)
      }
    }
    
    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  })
  
  return <button ref={ref}>{children}</button>
}
```

`gsap.quickTo` is the canonical perf pattern — sets up mutable tweens once, called with new values. No tween churn.

### Element-level reveals (everywhere else)

For Pillars, Features, Prizm Custom blocks: simple `useGSAP` + `ScrollTrigger` reveal pattern, with stagger:

```jsx
useGSAP(() => {
  gsap.from(".feature-card", {
    y: 40,
    opacity: 0,
    duration: 0.8,
    stagger: 0.1,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: ".features-section",
      start: "top 80%",
      once: true,
    },
  })
}, { scope: containerRef })
```

`once: true` matters — re-firing on scroll-up feels janky on B2B sites.

### Page transitions — View Transitions API

**React 19.2 + Next.js 16 ship native `<ViewTransition>` integration as of March 2026.** Less critical for our single-page site, but useful for:
- The Cal.com modal open/close (smooth morph from CTA → embed)
- Any future Prizm Custom expansion ("Learn more" → expanded panel)
- 78% browser coverage (Firefox is the holdout, behind a flag)
- ~50KB bundle savings vs. Framer Motion

```js
// next.config.js
{ experimental: { viewTransition: true } }
```

```jsx
import { ViewTransition } from 'react'
<ViewTransition name={`product-${id}`}>
  <Card />
</ViewTransition>
```

Browser auto-animates position, size, opacity. No keyframes needed. Defer this to Phase 2.

### Ambient motion — what "subtle drift" looks like

For sections that aren't reveal moments (mid-Pillars, between Features blocks), some recommendations from research:

- **Scroll-coupled parallax on hero text** — subtle Y translation as user scrolls past hero (use `scrub: 1` for buttery smooth)
- **Slow rotation/drift on decorative elements** — Lottie/SVG icons rotating 0.5°/sec when in viewport, paused when off
- **Hover microinteractions on cards** — subtle 1.02 scale on hover, accent border pulse, NOT a complex transform
- **Cursor-tracking parallax for hero only** — 8-12px max displacement, lerped, only on desktop
- **Reduced-motion respect** — `@media (prefers-reduced-motion: reduce)` disables scroll/cursor parallax, keeps fades

---

## 9. Active Theory's Hydra — what we can/can't reproduce

Active Theory uses Hydra, their proprietary 12-year-old framework — **NOT** three.js + R3F. They explicitly outgrew Three.js mid-2018 for performance reasons.

### Reproducible techniques in modern R3F

Confirmed achievable in our stack (with WebGPU):

| Technique | Source | R3F equivalent |
|---|---|---|
| **GPGPU particle systems** (CPU spawn + GPU sim) | Active Theory case studies on Mira, Neon | TSL compute shaders + instancedArray buffers (Maxime Heckel's WebGPU field guide) |
| **WebWorker for non-render computation** | Geometry loading, dimension calc, particle gen, physics collisions | Native `Worker()` API or `comlink` library |
| **Reduced matrix math** | Static objects skip 256+ multiplications/frame | R3F's `frustumCulled`, `matrixAutoUpdate = false` |
| **Real-time post-processing** (chromatic aberration + DOF) | Active Theory's "Nuke" engine | `pmndrs/postprocessing` raw lib, custom passes |
| **Particle attraction/repulsion forces** | Hypnotic dance via attract/repel fields | Flow fields stored as 2D textures, particles read from them |

### NOT reproducible without their team

- 12 years of in-house tooling iteration
- 50+ designers/devs whose entire job is making this
- Hydra GUI (designer-friendly node editor, no code)

### The 70-85% reality

Honest landing zone: **70–85% of activetheory's polish.** That's still world-class for the solar industry — no solar SaaS has anything close. The gap is in artistic polish (which color, where camera lingers, particle drift speed) — those are decisions no library makes for you.

---

## 10. lygia — the multi-language shader library

`patriciogonzalezvivo/lygia`. Granular, cross-language (GLSL, HLSL, WGSL, Metal, CUDA), `#include`-based.

### Why it matters

- Pre-built reusable shader functions for noise, raymarching, color ops, SDF, lighting models, filters
- TSL support is "help wanted" but GLSL/WGSL are battle-tested
- Online resolver at `lygia.xyz/resolve.js` — paste shader source, get fully-resolved output
- Self-documented YAML headers in every function file

### Our use cases

- `lygia/generative/snoise.glsl` — simplex noise for fog/caustic distortion
- `lygia/space/ratio.glsl` — aspect ratio normalization
- `lygia/lighting/specular/cookTorrance.glsl` — PBR for prism surface
- `lygia/draw/circle.glsl` — for particle sprites
- `lygia/raymarch/*` — SDF + raymarching helpers for volumetric fog

For the brief: clone via `npx degit https://github.com/patriciogonzalezvivo/lygia.git lib/shaders/lygia` (without git history), then `#include` paths in custom shader source.

### Vite GLSL plugin

Required if using lygia in custom shaders inside Sat ūs:
```bash
bun add -D vite-plugin-glsl
```

Add to next config (Sat ūs uses Turbopack which has native GLSL support; vite-plugin-glsl is fallback for non-Turbopack).

---

## 11. The integrated Phase 1B brief structure

Based on all this research, the Phase 1B brief should have these sections in this order:

1. **Pre-flight checklist for Knighthawk** (before invoking Claude Code)
   - Install cc-settings (one bash command)
   - Verify three.js / @react-three/fiber / @react-three/drei versions match
   - Run `bun pm ls` and post the output
   - Try `forceSinglePass: false` on existing hero — does the 11-error count change?
   - Decide WebGL vs WebGPU
2. **Architecture decision tree** (re-examine the canvas question)
   - Try Option A (reconfigure global canvas) first
   - Fall to B (mixed cameras) if AnimatedGradient breaks
   - Only do C (local canvas) if both fail
3. **The Tempus orchestration spine** — wire all RAFs into one loop
4. **The hero scene proper** — concept (light through prism), camera path (journey), scroll length (medium ~1600px)
   - Reference Maxime Heckel's caustics post by URL
   - Reference his refraction/dispersion post
   - Reference his volumetric raymarching post
   - drei MTM full param spec from this doc
5. **Scroll-coupled choreography** — Theatre.js + Lenis pattern
6. **Mobile fallback** — three options from v2 (decision pending real device test)
7. **Rest-of-site animation system** — SplitText + ScrollTrigger + scroll-velocity reactivity
8. **Performance gating** — chrome-devtools-mcp captures every round, FPS floors documented
9. **Iteration loop protocol** — 5-round ceiling, screenshot capture, self-critique
10. **What "done" looks like** — explicit visual + perf acceptance criteria

The brief should be ~3,500-5,000 tokens total. Specific tool/file/shader URLs throughout. Each named tool verified to exist.

---

## 12. Bibliography for the brief

Send Claude Code to read these directly via `web_fetch` before writing material code.

### darkroom OSS
- https://oss.darkroom.engineering — overview
- https://oss.darkroom.engineering/tempus — RAF orchestration
- https://oss.darkroom.engineering/lenis — smooth scroll
- https://oss.darkroom.engineering/elastica — physics for chip convergence
- https://oss.darkroom.engineering/hamo — re-render-free hooks
- https://github.com/darkroomengineering/satus — starter we're on
- https://github.com/darkroomengineering/cc-settings — Claude Code config

### Maxime Heckel implementation triad
- https://blog.maximeheckel.com/posts/caustics-in-webgl/
- https://blog.maximeheckel.com/posts/refraction-dispersion-and-other-shader-light-effects/
- https://blog.maximeheckel.com/posts/the-magical-world-of-particles-with-react-three-fiber-and-shaders/
- https://blog.maximeheckel.com/posts/field-guide-to-tsl-and-webgpu/
- https://blog.maximeheckel.com/posts/the-art-of-dithering-and-retro-shading-web/

### React/R3F/Three docs
- https://drei.docs.pmnd.rs/shaders/mesh-transmission-material — MTM full spec
- https://r3f.docs.pmnd.rs/tutorials/v9-migration-guide — async gl prop pattern
- https://www.theatrejs.com/docs/0.5/getting-started/with-react-three-fiber — Theatre + R3F setup
- https://www.theatrejs.com/docs/latest/api/r3f — full R3F extension API
- https://github.com/14islands/r3f-scroll-rig — the GlobalCanvas/tunnel pattern Sat ūs derives from
- https://github.com/patriciogonzalezvivo/lygia — multi-language shader library

### GSAP / animation
- https://gsap.com/docs/v3/Plugins/ScrollTrigger/ — ScrollTrigger reference
- https://gsapify.com/gsap-splittext/ — SplitText 3.13 patterns
- https://github.com/darkroomengineering/lenis — Lenis + GSAP integration code

### Reference deconstruction
- https://activetheory.net (full client-render, inspect via DevTools at runtime)
- https://medium.com/active-theory/the-story-of-technology-built-at-active-theory-5d17ae0e3fb4 — their tech vocabulary
- https://www.darkroom.engineering/work — darkroom case studies for technique calibration

---

## 13. What's still open after this research

Things I didn't get to in this session that should be tackled before the brief is final:

1. **Read the actual Sat ūs `lib/webgl/components/canvas/index.tsx` source** — confirm the camera/tone-mapping config, validate the "ortho + linear + flat" claim. Try `web_fetch` of `raw.githubusercontent.com/darkroomengineering/satus/main/lib/webgl/...` paths or `git clone` the repo locally for direct read. Knighthawk could send the file directly.
2. **WebGPU + drei MTM compatibility check** — does `MeshTransmissionMaterial` actually work under WebGPU in early 2026? Maxime Heckel's post is from Oct 2025 and doesn't specifically test MTM. Worth a focused test.
3. **Audio decision** — defer to Phase 2 still recommended, but Tone.js is in stack if we change our minds.
4. **Loading reveal choreography** — 1–2 second "space forms around you" sequence. Spec this in the brief.
5. **Real-device perf test on Knighthawk's iPhone** — the validator. WebGL vs WebGPU decision finalizes here.

---

## 14. Quick wins available right now

Before any Phase 1B code is written, these would materially improve the project state:

1. **Knighthawk runs `cc-settings` install** (5 min) — gets us darkroom's 10 agents + 43 skills + webgl profile
2. **Diagnose the 11 errors** — run `bun pm ls`, post versions, try `forceSinglePass: false`. 80% chance this resolves without architectural changes.
3. **Push latest commits to GitHub** — the deploy URL on `prizm-marketing-85jghteub` is stale; `bunx vercel ls` gets the current one.
4. **Read this v3 supplement + v2 master into project memory** — both should persist for future Claude sessions in the project.

That's the research. Ready to write the brief whenever you are.
