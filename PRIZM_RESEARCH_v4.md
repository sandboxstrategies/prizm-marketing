# Prizm Marketing Site — Research Findings v4 (Round 2 Deep Dive)

**Compacted:** April 25, 2026 (continuation session, second deep round)
**Combines with:** v2 (master strategic handoff) + v3 (first deep round)
**Why this exists:** v2 missed darkroom entirely; v3 missed the *direct prior art for our prism* and the *correct canvas architecture*. This round closes those gaps and several more. Reading order: v2 → v3 → v4.

---

## ★ THE THREE BREAKTHROUGHS ★

If you read nothing else in v4, read these three findings. They genuinely change Phase 1B strategy.

**1. Vercel + basement.studio shipped our exact prism in 2022.** The Next.js Conf 2022 registration page is a **literal interactive prism with light beams refracting into a rainbow.** Built by Paul Henschel (the R3F maintainer, now Vercel Design Engineer) and basement.studio. **Vercel published the complete code.** Custom `calculateRefractionAngle()` function, `<Beam>` component with `onRayOver/onRayMove/onRayOut` events, `<Rainbow>` from stacked shadertoy shaders, EffectComposer + Bloom + LUT + Screen Space Reflections, drei's `<PerformanceMonitor>` for adaptive quality. This is the pattern to copy and adapt — not invent from scratch.

**2. The canvas architecture debate has a clean industry-standard answer: drei `<View>`.** ToyFight published "One Canvas to Rule Them All" (Nov 2025) demonstrating a single `<Canvas>` at Layout level + `<View.Port />` placement + each 3D section wrapped in `<View>` that uses **WebGL's scissor method** to render in its container's bounds. Each View can have its own camera, lights, materials. Frame loop runs only when 3D visible (ScrollTrigger `onToggle`). The prior agent's "local hero canvas" architecture *and* the v3 reconfigure-global-canvas Option A *and* mixed-cameras Option B are all the wrong abstraction. **drei `<View>` is what we should use.**

**3. WebGPU + transmission has unsolved bugs as of Dec 2025.** A recent forum thread documents *exactly the same error class as our 11 errors* under WebGPU: `MeshTransmissionMaterial` style setup breaks when combined with any other render-target pipeline (drei `<Environment>`, postprocessing, extra RT passes). Depth thickness fails. Refraction samples garbage or goes black. **Implication: WebGL is the safer Phase 1B path, not WebGPU.** Vercel's prism shipped on WebGL. WebGPU is future enhancement, not current foundation.

---

## 1. Vercel × basement.studio — the canonical prism implementation

**URL:** https://vercel.com/blog/building-an-interactive-webgl-experience-in-next-js
**Live demo:** https://nextjs.org/conf/oct22/registration (still up)
**Authors:** Paul Henschel (@0xca0a, R3F maintainer) + Anthony Shew (Turborepo)
**Studio:** basement.studio (35-person Argentinian studio, Webby 2026 nominee for UntilLabs site)

### What they built

A user-controlled light beam bouncing off objects, hitting a triangular prism, refracting into a rainbow. The exact mood-board concept Knighthawk has for Prizm.

### Their tools (every one of these is in our Sat ūs stack)

- **react-three-fiber** with `<Canvas orthographic>` (note: orthographic, not perspective — this is what enables clean 2D-into-3D space mixing)
- **drei** — `<Center>`, `<Text3D>`, `<PerformanceMonitor>`
- **@react-three/postprocessing** — `<EffectComposer disableNormalPass>` with `<Bloom>` and `<LUT>`
- **`screen-space-reflections`** package — for raymarching reflections inside the prism (turned OFF on mobile)
- **postprocessing**'s `LUTCubeLoader` for color grading via `.cube` LUT files

### The components (all worth copying)

```jsx
// 1. The refraction physics
function calculateRefractionAngle(incidentAngle, glassIor = 2.5, airIor = 1.000293) {
  const theta = Math.asin((airIor * Math.sin(incidentAngle)) / glassIor) || 0
  return theta
}

// 2. <Beam> — bounces ray off objects, fires events
<Beam ref={boxreflect} bounce={10} far={20}>
  <Prism scale={.6} position={[0, -0.5, 0]} 
         onRayOver={rayOver} onRayOut={rayOut} onRayMove={rayMove} />
  <Box position={[-1.4, 1, 0]} rotation={[0, 0, Math.PI / 8]} />
  <Box position={[-2.4, -1, 0]} rotation={[0, 0, Math.PI / -4]} />
</Beam>

// 3. The rainbow from two stacked shadertoy shaders:
//    - alanzucconi: visible color spectrum (highly performant)
//    - Juliapoo: amorphous blob iridescence
<Rainbow ref={rainbow} startRadius={0} endRadius={0.5} fade={0} />

// 4. Light flare at intersection point
<Flare ref={flare} visible={isPrismHit} streak={[12.5, 20, 1]} />

// 5. Postprocessing stack
<EffectComposer disableNormalPass>
  <Bloom mipmapBlur levels={9} intensity={1.5} 
         luminanceThreshold={1} luminanceSmoothing={1} />
  <LUT lut={texture} />
</EffectComposer>

// 6. Adaptive performance
<PerformanceMonitor onDecline={() => setDpr(1.5)} onIncline={() => setDpr(2)}>
  <Scene />
  <Effects />
</PerformanceMonitor>
```

### Performance tricks worth memorizing

- `gl={{ antialias: false }}` — postprocessing handles AA, native AA wastes cycles
- `<Bloom mipmapBlur>` — mipmap-based bloom is *much* faster than gaussian
- Beam light = stretched 2D PNGs between contact points (cheaper than full 3D lines)
- Glow at intersection = scaled/rotated 2D PNG (cheaper than emissive geometry)
- screen-space-reflections **only on prism**, **off entirely for mobile**
- `<Canvas orthographic gl={{ antialias: false }} camera={{ zoom: 70 }}>` — orthographic camera with high zoom = clean compositional control

### The bridge to our brand thesis

Their idea: "What if a user could control a light source to reveal objects in a scene, and the light bounced off objects, hit a prism, and created a rainbow?"

Our idea: A prism representing the convergence of operational complexity into ordered light. Light beams = the six tools (CRM, Proposal, Funding, Voice, Payroll, Integrator) converging into the unified Prizm OS.

The metaphor *clicks*. Vercel's "make a rainbow appear" maps onto our "show convergence." We don't need to invent the visual language — we adapt theirs to our thesis.

---

## 2. drei `<View>` — the single-canvas architecture

**URL:** https://tympanus.net/codrops/2025/11/21/one-canvas-to-rule-them-all-how-ink-games-new-site-handles-complex-3d/
**Live site:** https://www.inkgames.com/
**Studio:** ToyFight® (Manchester UK)

### The pattern

```jsx
// In Layout.tsx — ONE canvas at the layout level
<Canvas>
  <View.Port />
  {/* Frame loop logic here */}
</Canvas>

// In each section that needs 3D
<View track={containerRef}>
  <PerspectiveCamera makeDefault fov={35} />
  <ambientLight />
  <PrismScene />
</View>
```

`<View>` uses WebGL's **scissor method** to render only in the bounds of `containerRef`. R3F tracks size/position. Each View can have its own camera, lights, environment, materials. One canvas, many independent 3D regions, one WebGL context.

### Frame loop optimization

```js
// ScrollTrigger on each section, track visibility
ScrollTrigger.create({
  trigger: sectionRef.current,
  onToggle: ({ isActive }) => setSectionVisible(isActive)
})

// In Canvas component, only run frame loop when:
// - any section visible OR resizing OR scrolling
<Canvas frameloop={shouldRender ? 'always' : 'never'}>
```

### Why this beats the prior agent's options

The prior agent gave us three options in v3:
- A: Reconfigure global canvas (assumed perspective + sRGB + ACESFilmic must be canvas-wide)
- B: Mixed cameras in one canvas (assumed only one camera at a time)
- C: Local hero canvas (extra context, fights framework)

**All three were wrong abstractions.** drei `<View>` solves the problem at the right layer:
- Each View is its own scene-graph subtree with independent camera/lights/env
- Multiple Views render simultaneously in different screen regions
- One WebGL context, one render loop, one performance monitor
- The "AnimatedGradient must stay orthographic + linear + flat" constraint resolves naturally — the gradient lives in a View configured for that, the prism lives in a View configured for perspective + sRGB + ACESFilmic

### Implications for our 7-section site

If we want 3D in multiple sections (which we should, per the v2 ambition):
- **Hero**: View 1 — perspective camera, the prism scene
- **Problem (chip convergence)**: View 2 — orthographic camera, Elastica-physics chips colliding
- **Pillars**: HTML/CSS only (no 3D)
- **Features**: View 3-8 (one per feature) — small 3D illustrations
- **Prizm Custom (gatekeeper)**: View 9 — close-up volumetric prism
- **Final CTA**: View 10 — same prism but smaller, calmer
- **Footer**: HTML/CSS only

That's 5–10 Views in one canvas. Performance budget remains intact because frame loop only runs when Views are visible.

### Companion drei tools the article uses

- **`<Mask>` + `useMask()` hook** — WebGL stencil buffer cuts parts of scene. Wrap card geometry in `<Mask>`, use `useMask()` to get stencil value, apply to materials. Lets you have 3D content visible only inside a card-shaped boundary.
- **Clipping planes** — for elements that visually *extend beyond* the card boundary. Render same model twice: once stencil-masked inside, once with clipping planes outside.
- **`<Billboard>`** — always faces camera, perfect for hero "background image with parallax" trick.
- **`gltfjsx` CLI** — converts a GLB/GLTF model into a JSX file with compressed/optimized geometry. Material props become dynamic. Critical for any custom 3D models we add.

---

## 3. Studio Freight — the design philosophy

**URL:** https://studiofreight.com/info
**Relationship to darkroom:** Studio Freight is darkroom's design partner. They were originally one entity, hence the legacy `@studio-freight/lenis` package name. They ship most darkroom projects together (Looped, GrowthLoop, Ecotrak, First Round PMF).

### Their tagline: "Brutal Elegance"

> "Brutal in our honesty and focus on what actually matters. Elegant in creating solutions as they should be — not more, not less."

This is exactly Knighthawk's "elite or the few" thesis from v2. It's the same idea, more crisply named.

### Their 8 principles (relevance to Prizm in parens)

1. **Design Everything** — every system is perfectly designed to get the results it gets
2. **Adopt New Realities** — learn, experiment, evolve as new tools emerge ("anything is possible")
3. **Use Your Headlights** — keep moving forward, navigate ambiguity
4. **Strive for Elegance** — "Time is precious for people with purpose. Be concise, lead with the main point" (this is *exactly* the locked Prizm copy ethic)
5. **Seek Out Shadows** — "we aren't afraid to pose a third way. Or fourth. Or fifth" (this is Knighthawk's "no settling, find the highest quality outcome you haven't found yet" — locked directive)
6. **Choose the Future** — "have the courage to be right before it's obvious"
7. **Rally Others On** — talk up to others, assume good intentions
8. **Make it Matter** — "we solve the potential, not the problem" — "build for what could be"

### Their client tier

Brex, Mercury, Dragonfly, RRE Ventures, Comet, Hyperbolic, Ben Mauro, La Marzocco, Easol, Lunchbox. **Mercury is the canonical fintech B2B comparison** — Knighthawk's competitor visual tier.

### Implications for the brief

- The Prizm voice ("operator-confident, Hormozi-coded without cringe") aligns with Brutal Elegance — same DNA.
- The locked banned-words list (unlock, empower, seamless, leverage…) is the "Strive for Elegance" principle in practice.
- The "no settling" directive is literally Studio Freight's "Seek Out Shadows" principle.
- We should explicitly cite "Brutal Elegance" in the brief as the design north star — it gives the principle a name.

---

## 4. ToyFight × INK Games — the full operational playbook

The ToyFight INK Games article (cited in §2) is more than the View architecture. It's a complete production playbook for the kind of site we're building.

### Their stack (compare to ours)

| ToyFight | Sat ūs / Prizm | Verdict |
|---|---|---|
| Next.js (ToyBox starter) | Next.js (Sat ūs starter) | Same |
| Styled Components | Tailwind v4 | Different — ours is fine |
| GSAP for animation | GSAP 3.13+ | Same |
| Lenis for smooth scroll | Lenis | Same |
| R3F + drei for WebGL | R3F + drei | Same |
| Strapi (self-hosted CMS) | Sanity / none | Different — we don't need a CMS for marketing site |

We are running essentially the same stack as ToyFight's award-winning INK Games site. The v3 stack was already correct; we just hadn't validated it with this evidence.

### Hybrid CSS-3D + WebGL trick

Not all "3D" sections need WebGL. ToyFight uses **CSS perspective + translation** for some "almost 3D" feels:
- Image rotates with cursor on desktop only (`gsap.matchMedia`)
- Wrapper rotation + inner image translation = cheap parallax
- No WebGL context needed

This is a valid Phase 1B technique for Pillars, Feature blocks, and Final CTA — sections where we want spatial feel without the WebGL cost.

### Portal cards technique (relevant to Prizm Custom section)

The Prizm Custom section was specced as "by invitation only." We could mimic ToyFight's portal cards:
- HTML text overlays the card
- Background image with parallax (`<Billboard>`)
- 3D prism elements visible inside card bounds (`<Mask>` + `useMask()`)
- 3D prism elements visible OUTSIDE card bounds (clipping planes)
- Cursor-driven rotation (subtle, desktop only via `gsap.matchMedia`)

That visual would *literally illustrate* "by invitation, peek behind the curtain." Worth speccing.

### Cursor handling

ToyFight wraps mouse-driven effects in `gsap.matchMedia`:
```js
gsap.matchMedia().add('(hover: hover) and (pointer: fine)', () => {
  // desktop-only cursor effects
})
```

This is the right way to gate the magnetic CTA we discussed in v3 — it disables on touch automatically.

---

## 5. The 14islands `r3f-scroll-rig` heritage (corrected understanding)

In v3 I wrote that Sat ūs's GlobalCanvas pattern is based on `tunnel-rat` and follows the 14islands `r3f-scroll-rig` paradigm. After deeper reading, that's correct — and the framework gives us more capability than v3 acknowledged:

### r3f-scroll-rig features we should use

```jsx
import { GlobalCanvas, SmoothScrollbar, useScrollRig } from '@14islands/r3f-scroll-rig'

// Layout level
<>
  <GlobalCanvas
    frameloop="demand"  // only render when requested
    globalRender={true}  // global render priority 1000
    scaleMultiplier={0.01}  // 1000px = 10 viewport units
  />
  <SmoothScrollbar />  // Lenis under the hood
  <Component />
</>

// In components
const { 
  isCanvasAvailable, 
  hasSmoothScrollbar, 
  scaleMultiplier, 
  reflow,           // recalc element positions
  preloadScene,     // request preload render
  requestRender,    // request global render this frame
  debug             // debug mode flag
} = useScrollRig()
```

### Why this matters

`r3f-scroll-rig` uses `frameloop="demand"` + `requestRender()` to **only render when 3D is in viewport**. Same pattern as ToyFight INK Games but built into the library. If Sat ūs is built on this paradigm (which it is), we get the frame-loop optimization for free.

### Other 14islands work worth knowing

- **Cartier Yearbook 2024** — Awwwards SOTD + FWA + Developer Award, multilingual immersive editorial
- **Neko (healthcare)** — Lovie Gold 2023, FWA SOTD, "rotoscoped mask to place particles on 3D surface"
- **USH stablecoin (MultiversX)** — recent fintech case study, our exact category
- **Breakthrough Energy** — Bill Gates' climate org, technical bar comparison
- **Blobmixer** — internal experiment, 4M views, "WebGL-based creative toy"
- **HeroKit** — their plugin/asset library for Framer/Webflow/Squarespace integration

Their portfolio is at https://www.14islands.com — strong reference for the "minimalist site, but every detail is WebGL" aesthetic that Prizm targets.

---

## 6. The Codrops Monolith composable architecture (re-emphasized)

v3 covered this but it's worth re-emphasizing because we now have *two* validated paths for our prism material:

**Path A — drei `MeshTransmissionMaterial`** (v3 spec, simpler):
- Single material with 20+ props
- Production-tested
- Likely fixable with `forceSinglePass: false` + version alignment
- Covered in v3 §5

**Path B — Composable shader modules** (Monolith pattern, more flexible):
- `<GBufferMaterial>` core with insertion points
- Stack `<MaterialModuleColor>`, `<MaterialModuleGradient>`, `<MaterialModuleNormal>`, `<MaterialModuleEmissive>` etc. as JSX children
- Each module is a small reusable shader fragment
- Better for hot-reload during development
- Required if we want truly bespoke prism shaders (caustic emission, Penrose-aware UV mapping, etc.)

For Phase 1B, **start with Path A (drei MTM)**. If we need finer control later, refactor to Path B. The Monolith team admits Path B "could be done differently today with TSL" — so this pattern is mostly relevant if we go bespoke shader, not if we use drei's built-ins.

---

## 7. WebGL vs WebGPU — calibration update from forum data

In v3 I leaned WebGPU primary. Forum data from late 2025 changes that.

### The Dec 2025 thread

A developer documented the *exact error class as our 11 errors* under WebGPU + TSL:
> "Custom MeshTransmissionMaterial style setup. As soon as I introduce another RT pipeline (drei `<Environment>`, postprocessing, extra RT passes), the transmission setup breaks. Depth thickness stops working and refraction looks like it is sampling garbage or goes black."

This is the same symptom class as our errors. The bug is in **WebGPU + transmission + multiple render targets together**. Each piece works alone; together they break.

### The implication

- **Vercel's prism (WebGL)**: shipped in production, no issues, used by millions of conf signups
- **Modern WebGPU + transmission**: known unsolved bugs as of late 2025

**Phase 1B path**: WebGL primary with drei MTM. WebGPU as future enhancement once the Three.js / drei ecosystem works through these issues.

### What we lose

- Compute shaders (50k+ particles on mobile vs 2k on WebGL)
- 10–100× perf gains on heavy GPGPU workloads
- TSL's renderer-agnostic shader code

### What we keep

- The Vercel prism is proof that WebGL is enough for our visual ambition
- Our perf budget (5k particles desktop, 2k mobile) is still ambitious by industry standard
- Stable, predictable, documented behavior

### When to revisit WebGPU

After Phase 1B ships. Once Three.js r190+ (or whenever the WebGPU + transmission issues are resolved), revisit as a perf upgrade for ambient particle systems specifically.

---

## 8. AI-for-3D landscape (April 2026 state)

This is genuinely useful for *iteration speed*, even if the prism mesh stays code-generated.

### The leaders

| Tool | Strength | Pricing | Format |
|---|---|---|---|
| **Meshy** | Best all-around, full pipeline (text→3D, PBR, auto-rig, 500+ animations) | Free 200 credits/mo, Pro $10/mo, Studio $30/mo | GLB, FBX, OBJ, STL, USDZ |
| **Tripo (Tripo3D)** | Sculpture-level v3.0, up to 2M polys, creative styling | 300 free credits, ~$12/mo | GLTF, GLB, OBJ, FBX (paid) |
| **Luma AI** | NeRF/Gaussian Splatting from real video | $1/scene | GLB or splat formats |
| **Spline AI** | Browser-based, designer-friendly | Free tier, paid | Web-native, GLB |
| **Rodin** | Highest quality, 10B params, 4K textures | Enterprise | GLB |
| **Hunyuan3D** | Tencent's tool, growing | Various | GLB |
| **Sloyd** | Slider-based parametric, fast iteration | Tiered | GLB, OBJ, Blender plugin |

### Where AI fits Phase 1B

**Not for the prism itself** — Penrose subdivision is mathematical, not artistic. Code-generated geometry will be more accurate than any AI generation.

**Possibly useful for:**
- Decorative ambient elements (crystalline shards, particle glyphs, supporting geometry)
- Reference visuals for Penrose-derived golden triangle constructions before building in code
- Testing variations quickly: "Penrose prism with sharper apex," "Penrose prism with internal Robinson fractures"
- Generating placeholder content during iteration (real art assets later)

**Not useful for:**
- Anything where mathematical precision matters
- Anything where the perf budget matters (most AI-generated meshes need cleanup before they're under our 8K poly target)

### 3D Gaussian Splatting (Spark 2.0 + Luma)

**Spark 2.0** (April 14, 2026, World Labs) — bleeding edge 3DGS for THREE.js. New since v1:
- Level-of-Detail streaming for huge scenes
- Multiple 3DGS objects in same scene
- Real-time editing and relighting
- Shader graph for dynamic splat effects (recolor, opacity, SDF clipping, animated transitions)
- 4DGS — animated splats
- Custom `.RAD` file format for streaming
- WebGL2 (universal, not WebGPU)

**Practical for Prizm?** Aspirational. The 20–200MB initial-load weight conflicts with our <1.2MB total budget. BUT — if we ever want photorealistic light-through-real-prism in the hero, capturing an actual prism with Luma's iPhone app and rendering it via Spark would be transformative. This is "tier-up after launch" territory, not Phase 1B.

---

## 9. Three.js Journey — the canonical learning resource

**URL:** https://threejs-journey.com
**Author:** Bruno Simon (former lead dev at Immersive Garden, French creative dev studio)
**Pricing:** ~$95 one-time, lifetime access
**Community:** 21k+ Discord members
**Total content:** 93+ hours of lessons

### What it covers

Beginning to advanced Three.js, R3F, shaders, post-processing, optimization, Theatre.js, **WebGPU + TSL** (newer chapters), GPGPU particles, particle/trails/VFX engines.

### Why it matters for Phase 1B

Bruno Simon is currently rebuilding the entire course for WebGPU + TSL (per his late-2025 Mux interview). His expertise is the most authoritative single source for the ecosystem state.

His personal portfolio (https://bruno-simon.com — the famous 3D car-driving site) uses **TSL for both WebGL and WebGPU** with full code on GitHub under MIT license. Worth referencing as a real-world TSL implementation.

### Recommendation

Knighthawk should consider buying the course for the WebGPU + TSL chapters specifically. $95 is trivial against the project budget; the Discord community is a real resource for blockers; the lessons answer questions Claude Code might guess wrong on.

---

## 10. Asset libraries — Poly Haven HDRIs

**URL:** https://polyhaven.com
**License:** CC0 (use anywhere, commercial OK, no attribution required)
**Categories:** Outdoor, indoor, studio, artificial light, skies, nature
**Resolutions:** Up to 24K, always unclipped

### For our prism specifically

The prism needs an environment map for refraction sampling. drei's `<Environment>` component takes:
- **Preset names**: "studio", "city", "sunset", "warehouse", "park", "forest", "apartment", "lobby", "night"
- **Files**: any HDR or EXR

For our brand colors (cobalt + ember + midnight), recommended HDRIs:
- **Ferndale Studio 02** — high-contrast indoor studio with blue/teal/red spotlights (matches our cobalt + ember spectrum)
- **TV Studio** — bright artificial lighting, cool blue fills, warm accents (matches our gradient direction)
- **poly_haven_studio** — soft natural daylight + downlights (cleaner option)

Or simpler: use drei's `<Environment preset="studio" />` for prototype, swap to custom HDRI in polish phase.

### Poly Haven other categories worth knowing

- **Textures**: 16k+ resolution, PBR-ready (diffuse, normal, roughness, displacement), CC0
- **3D Models**: free 3D models for product/architectural reference

For Phase 1B we mostly need HDRI; textures and models are speculative.

---

## 11. The full creative dev studio landscape (calibration tier)

Studios at our visual ambition tier, in rough order of relevance:

| Studio | Location | Strength | Reference for us |
|---|---|---|---|
| **darkroom.engineering** | Multiple | Sat ūs author, ibi.cash, looped.poly.ai | Direct toolchain match |
| **Studio Freight** | NYC | Brutal Elegance philosophy, Brex/Mercury/Dragonfly | Design partner pattern |
| **basement.studio** | Argentina | Vercel Ship, Webby 2026 nominee | Direct prism prior art |
| **14islands** | Stockholm/Reykjavík | r3f-scroll-rig author, Cartier Yearbook | Architectural pattern source |
| **ToyFight®** | Manchester UK | INK Games one-canvas pattern | Operational playbook |
| **Lusion** | (not specified) | Buttery motion, inventive interactions | Motion calibration |
| **Utsubo** | (not specified) | Engineering-led WebGPU/WebGL with perf budgets | Engineering rigor |
| **Active Theory** | LA | Hydra (proprietary), elite tier | Aspirational ceiling (70-85% reachable) |
| **Resn** | Wellington NZ | Listed on Lenis users page | (didn't research deeply) |
| **Locomotive** | Montreal | Made original Locomotive Scroll | (didn't research deeply) |
| **Immersive Garden** | France | Bruno Simon's former studio | (didn't research deeply) |
| **Exo Ape** | (not specified) | Codrops studio spotlight Feb 2026 | (didn't research deeply) |
| **Naughtyduk** | (not specified) | Codrops studio spotlight | (didn't research deeply) |

The first six in this list are all directly applicable to our project. The rest are useful for inspiration.

---

## 12. Postprocessing v3.0 critical changes

`@react-three/postprocessing` v3.0 (current as of 2026) has breaking changes from older tutorials:

```jsx
import { 
  EffectComposer, 
  ToneMapping, 
  Bloom, 
  LUT, 
  Vignette, 
  Noise 
} from '@react-three/postprocessing'
import { ToneMappingMode } from 'postprocessing'

// Set renderer tone mapping to NoToneMapping default
// Then handle it in postprocessing pipeline:
<EffectComposer disableNormalPass multisampling={8}>
  <Bloom mipmapBlur levels={9} intensity={1.5} 
         luminanceThreshold={1.1} luminanceSmoothing={1} />
  <LUT lut={cinematicCubeFile} />
  <Vignette eskil={false} offset={0.1} darkness={0.6} />
  <ToneMapping mode={ToneMappingMode.ACES_FILMIC} />  {/* MUST be last */}
</EffectComposer>
```

Key changes from v2 / older tutorials:
- `<ToneMapping>` MUST be at END (was at beginning)
- `disableNormalPass` for perf when no normal pass is needed
- `multisampling` attr on EffectComposer (default 8, lower to reduce cost)
- **SSR removed** — was unstable, has been removed entirely. Don't try to use it.
- Bloom `luminanceThreshold` should be 1.0+ when using ACES_FILMIC tone mapping (was 0.0 in old examples)

Our brief should specify v3.0 minimum.

---

## 13. The updated Phase 1B brief structure

Combining v2 + v3 + v4, here's the section order I'd recommend:

1. **Pre-flight checklist** (run before any code):
   - Install cc-settings (one bash command, see install fix at top of this doc)
   - Run `bun pm ls` and post three.js / @react-three/fiber / @react-three/drei versions
   - Check for `forceSinglePass` flag in current MTM usage
   - Read this v4 supplement
2. **The visual blueprint**: Vercel × basement.studio prism (this v4 §1, with code patterns)
3. **The architecture**: drei `<View>` single-canvas pattern (this v4 §2, ToyFight playbook)
4. **The renderer**: WebGL with drei MTM, NOT WebGPU (v4 §7)
5. **The orchestration spine**: Tempus + Lenis + GSAP (v3 §1, no change)
6. **The hero scene proper** (concept, camera path, scroll length, materials)
7. **Section choreography**: how Hero, Problem, Final CTA Views relate
8. **Mobile fallback**: SVG gate at parent level (v2 §4 has this)
9. **Postprocessing**: v3.0 stack with EffectComposer + Bloom + LUT + ACES_FILMIC ToneMapping
10. **Performance gating**: drei `<PerformanceMonitor>` adaptive dpr + view visibility frame loop
11. **The eleven errors playbook**: diagnostic ladder (v3 §5, no change)
12. **Iteration loop protocol**: 5 rounds, screenshot capture, self-critique
13. **Acceptance criteria**: Lighthouse ≥90 mobile, 60fps desktop / 45fps mobile floor (v4 §11 industry data)

The brief should be 4,000–5,500 tokens. Specific URLs and code patterns throughout. Should reference Vercel's prism case study explicitly as "the model to adapt."

---

## 14. Updated bibliography

Send Claude Code to read these directly via `web_fetch` BEFORE writing material code. Each one is 5–15 minutes of reading time, but the cumulative effect closes the gap between "vague creative ambition" and "specific implementable patterns."

### Priority 1 — direct prior art and architecture (must read)
- https://vercel.com/blog/building-an-interactive-webgl-experience-in-next-js — Vercel × basement.studio prism, complete code
- https://tympanus.net/codrops/2025/11/21/one-canvas-to-rule-them-all-how-ink-games-new-site-handles-complex-3d/ — drei `<View>` architecture
- https://drei.docs.pmnd.rs/portals/view — drei View component reference
- https://drei.docs.pmnd.rs/performances/performance-monitor — adaptive quality

### Priority 2 — composable shader patterns
- https://tympanus.net/codrops/2025/11/29/building-the-monolith-composable-rendering-systems-for-a-13-scene-webgl-epic/ — Monolith composable materials
- https://blog.maximeheckel.com/posts/refraction-dispersion-and-other-shader-light-effects/ — refraction/dispersion shader-level
- https://blog.maximeheckel.com/posts/caustics-in-webgl/ — caustics via render targets

### Priority 3 — orchestration and animation
- https://oss.darkroom.engineering/tempus — single RAF orchestration
- https://github.com/darkroomengineering/lenis — Lenis + GSAP integration
- https://gsap.com/docs/v3/Plugins/ScrollTrigger/ — ScrollTrigger reference
- https://gsapify.com/gsap-splittext/ — SplitText 3.13 patterns

### Priority 4 — design philosophy and reference studios
- https://studiofreight.com/info — Brutal Elegance principles
- https://darkroom.engineering/work — full darkroom portfolio
- https://www.14islands.com — 14islands portfolio
- https://www.basement.studio — basement.studio portfolio

### Priority 5 — runtime tools
- https://drei.docs.pmnd.rs/shaders/mesh-transmission-material — drei MTM full prop spec
- https://github.com/14islands/r3f-scroll-rig — scroll-rig API
- https://drei.docs.pmnd.rs/abstractions/mask — Mask component for stencil cuts
- https://drei.docs.pmnd.rs/abstractions/billboard — Billboard always-faces-camera

### Priority 6 — ecosystem state and learning
- https://threejs-journey.com — Bruno Simon course (consider buying for WebGPU + TSL chapters)
- https://discourse.threejs.org — three.js forum (search for transmission + WebGPU bugs)
- https://polyhaven.com/hdris — free CC0 HDRIs

---

## 15. What I'd still research, given more time

The user said keep going if I feel I have more to find. I genuinely think the marginal value drops sharply from here, but if the brief surfaces unanswered questions during Phase 1B, these are next:

1. **Source code reads** — Sat ūs's actual `lib/webgl/components/canvas/index.tsx`. Knighthawk could send this directly, or `git clone` and we read it.
2. **Locomotive Scroll deep dive** — Montreal studio, made the original locomotive-scroll. Their site is reportedly an animation reference.
3. **Resn deep dive** — Wellington NZ, listed by Lenis as a reference user. Hydra-tier work historically.
4. **Threejs.paris conference content** — Sept 10-11, 2026. The first dedicated three.js conference. May have valuable talks/case studies.
5. **Specto** (darkroom's perf monitoring tool) — mentioned in their OSS but not deeply researched.
6. **Theca** (darkroom's design asset management) — mentioned in their roadmap.
7. **Updated Codrops Studio Spotlights** — Exoape, Naughtyduk, Malvah, Forged each got individual spotlights I haven't read.
8. **The actual INK Games site code** — if open source.
9. **Active Theory Hydra source** — they hint at having open-sourced parts.
10. **Modern WebGPU bug timeline** — track when the transmission + RT pipeline issues get fixed.

If any of these become blockers during Phase 1B, signal and I'll dig.

---

## TL;DR for Phase 1B brief

The brief should center on three things this round added:

1. **Adapt Vercel's prism, don't invent.** Their code is open. The visual is already proven.
2. **drei `<View>` for the canvas architecture.** ToyFight INK Games is the playbook. One canvas, multiple Views, scissor renders.
3. **WebGL with drei MTM**, not WebGPU. Forum data confirms WebGPU + transmission has unsolved bugs as of Dec 2025.

Plus the v3 foundations (Tempus orchestration, Theatre.js choreography, GSAP 3.13 SplitText, Maxime Heckel triad).

That's a complete Phase 1B foundation. Ready to write the brief when you are.
