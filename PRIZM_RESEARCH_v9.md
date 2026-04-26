# Prizm Marketing Site — Research Findings v9 (Round 7: Immersive Garden + Pmndrs + Inigo + Lighthouse-WebGL + Yuri catalog)

**Compacted:** April 26, 2026 (continuation session, seventh deep round)
**Method:** Web research on Immersive Garden (PRIZM.md DNA reference), Pmndrs ecosystem audit beyond drei, Inigo Quilez positioning, Lighthouse-for-WebGL specifics + texture compression, Yuri Artiukh's complete Codrops catalog mapped to relevance.
**Combines with:** v2 (master) + v3-v8 (prior rounds) + this round.
**Why this exists:** v8 closed the architectural questions and diagnosed the 11 errors. This round closes the **aesthetic-DNA question** (Immersive Garden = premium institutional luxury, basement = dev-tool boldness, Prizm = both), maps the Pmndrs ecosystem beyond drei (we found 4 more relevant libraries), positions Inigo Quilez correctly (Phase 2/3 reference, not Phase 1B), gets concrete Lighthouse-WebGL patterns (defer 3D loading via IntersectionObserver, KTX2 preload), and builds Yuri Artiukh's catalog into a phase-2-ready effects library.

---

## ★ THE FIVE BIG FINDINGS THIS ROUND ★

**1. Immersive Garden's DNA is now characterized — and it explains the Prizm formula.** Paris-based studio. Clients: Louis Vuitton (Web3 NFT), Cartier (×4 — Watches & Wonders, End of Year, In Time, etc.), OMEGA, Dior, Longines, Saudi Arabia's Masar (urban planning), Orano (nuclear), Midwam, Prior Holdings, Chartogne-Taillet (Champagne house), Girard-Perregaux. **Pure luxury heritage + institutional gravitas.** They list "Sound design" as a separate service discipline. Awards: Awwwards SOTD + FWA SOTD + CSSDA SOTD on Louis Vuitton VIA. **PRIZM.md formula now clear:** basement.studio confidence (dev-tool boldness, Vercel/Cursor/Eleven Labs DNA) + Immersive Garden restraint (Cartier/LV institutional luxury) = something neither studio alone has. **Solar OS for serious operators with the visual weight of a luxury house.** That's "elite or the few" expressed as design philosophy.

**2. Pmndrs ecosystem has 4 more libraries we should consider beyond drei.** `@pmndrs/postprocessing` (raw, what Sat ūs already uses) and `@react-three/postprocessing` (React wrapper) are TWO separate packages — Sat ūs uses raw for performance. `pmndrs/leva` is the canonical dev-controls UI library — used in basement.studio's experiments to live-tune MTM params (perfect for our calibration phase). `pmndrs/maath` is a math utility library with easings, lerping, swizzle helpers. `pmndrs/use-gesture` for advanced pointer events. `pmndrs/detect-gpu` is what Sat ūs's `gpu-detection.ts` is built on. `pmndrs/three-stdlib` exposes three.js examples without importing from `three/examples` (cleaner imports).

**3. Inigo Quilez is the shader-mathematics master and Phase 2/3 reference, NOT Phase 1B.** Co-founded Shadertoy. *"Painting with Maths"* YouTube series. SDF / raymarching authority — his distance functions article is THE canonical reference. Author of 200+ articles + thousands of shaders. **For Phase 1B we don't need him** because drei MTM + Bloom + ACES handle our hero. **For Phase 2 (custom shaders, advanced effects):** iquilezles.org/articles/ is the math reference. His content is dense math, not implementation tutorials.

**4. Lighthouse mobile ≥90 with WebGL has a clear pattern.** From Utsubo's 100-tips guide (March 2026): **(a) Defer 3D loading via IntersectionObserver** — the canvas mounts only when scrolled into viewport. **(b) The LCP element must be DOM, not canvas** — our H1 + subhead loads first; canvas comes after. **(c) Preload critical assets** with `<link rel="preload" as="fetch" crossorigin>`. **(d) Use KTX2/Basis textures** — 80%+ size reduction vs PNG, compressed by GPU. **(e) Progressive enhancement** — show a low-resolution placeholder, swap high-resolution after load. PRIZM.md targets are achievable. The current implementation already gets (a) right via `dynamic(() => import(...))` with `{ ssr: false }`.

**5. Yuri Artiukh's catalog is a complete production-effect reverse-engineering library — fully mapped now.** ~30 Codrops tutorials, each with full source on his GitHub (199 repos), each reverse-engineering a SPECIFIC live website. Some directly relevant to Phase 2: **volumetric light rays from moonfall.oblio.io**, **glass effect from kentatoshikura.com**, **light effects from midwam.com**, **galaxy particles from viverse.com**, **3D glass portal with R3F + Gaussian Splatting**, **lava lamp gradient from Stripe**, **whirlwind dissolve effect**. All MIT-licensed with full demo source. **For Phase 2 specific effects, this is the implementation library.** Bookmark every tutorial title with original-site link.

---

## 1. Immersive Garden — the DNA reference

### Studio profile

- **Name:** Immersive Garden (immersive-g.com)
- **Location:** Paris, 14 avenue Claude Vellefaux, 75010
- **Tagline:** *"Transcend anything seen or felt before by crafting unparalleled experiences for ambitious brands."*
- **Self-description:** *"A global leader in groundbreaking digital design and strategy"*
- **Service disciplines:** Strategy & Concept, UX/UI, Art Direction, Motion Design, 3D, Development, **Sound design** (listed as a separate discipline)

### Their client roster (this is what positions them)

| Project | Client | Type |
|---|---|---|
| Louis Vuitton VIA | Louis Vuitton | Web3 NFT platform |
| David Whyte Experience | David Whyte | Poetry digital journey |
| Cartier End of Year 23 | Cartier | E-shop |
| Cartier in Time | Cartier | Web Experience (Jake Gyllenhaal) |
| Cartier Watches and Wonders 24 | Cartier | Web Experience |
| Chartogne Taillet | Champagne house | Web Experience |
| Dioriviera | Dior | 3D journey |
| Longines Spirit Zulu Time | Longines | Aviation pioneers |
| Masar Destination | Saudi Arabia | Urban planning |
| Midwam | Midwam | Corporate |
| OMEGA Space Sustainability | OMEGA | Corporate |
| Orano | Orano | Nuclear safety (interactive wireframes, gamified design) |
| Prior Holdings | Prior Holdings | Hospitality |
| Aten7 | Aten7 | Web Experience |
| Gleec | Gleec | Crypto corporate |
| Girard Perregaux Casquette | Girard-Perregaux | Limited Edition E-shop |
| Hatom | Hatom | Crypto platform |
| Artisans d'Idées | Artisans d'Idées | Art/history/storytelling |

**Pattern:** luxury heritage brands (Cartier, LV, OMEGA, Dior, Longines, Girard-Perregaux), institutional gravitas projects (Masar urban planning, Orano nuclear, OMEGA Space Sustainability), poetic/cultural projects (David Whyte, Artisans d'Idées). **NO dev tools, NO Web2 SaaS, NO unicorn hypergrowth brands.**

### Awards on a single project (Louis Vuitton VIA)

- Awwwards Site of the Day
- FWA Site of the Day
- CSSDA Site of the Day

A **triple sweep** on one project. That's institutional-prestige work tier.

### What this means for Prizm

PRIZM.md says: *"basement.studio's confidence + immersive-g.com's premium restraint."* Now we know what each contributes:

| Quality | Source | Manifestation |
|---|---|---|
| **Confidence** | basement.studio | Operator-direct copy. Bold typography. Brutal honesty. PS1-walkthrough on their own site. |
| **Premium restraint** | Immersive Garden | Quiet luxury feel. Slow motion. Generous whitespace. Photoreal 3D. Subtle, not loud. |
| **Together = Prizm** | Both | Operator-confident words + heritage-luxury 3D craft. *"Built by operators"* (basement DNA) inside *Cartier-grade visual restraint* (Immersive Garden DNA). |

**Concrete implications for the rebuild:**

1. **Motion is SLOW.** Immersive Garden's work breathes. 30-second yaw cycles (current), 6-second bobs — keep these or even slow down. Phase 2 maybe 45-second yaw.

2. **Color palette is RESTRAINED.** Cyan + violet + ember is correct (PRIZM.md tokens). But the AMOUNTS need restraint. Lightformer intensities probably lean lower than v7 §3 specced (4 → 2.5 for key, 2 → 1.5 for fill, etc).

3. **Chromatic aberration is SUBTLE.** v8 noted basement.studio uses 0.04, Prizm currently uses 0.2. **Immersive Garden would use 0.04-0.08, not 0.2.** The v9 calibration recommendation: try 0.06. Almost-imperceptible spectrum bleeding around the prism edges, not rainbow gimmick.

4. **IOR leans toward gem, not crystal-glass.** basement uses 1.14 (clearer). Immersive Garden's Cartier work would use higher IOR for jewelry-grade feel — 1.5-1.7. **Our 1.6 is right for "elite/few" positioning.** Don't lower to basement values. The Prizm IS a brand mark + a gem, not a tumbler.

5. **Sound design is a real discipline, deferred to Phase 2.** Immersive Garden lists it as a top-level service. For Prizm v1: zero audio. Phase 2: subtle ambient (Tone.js per PRIZM.md), authored by someone who understands restraint.

6. **Gatekeeper feel comes from camera distance, not cropping.** Immersive Garden's Cartier work tends to keep the subject in full view but USE the surrounding negative space and slow camera moves. PRIZM.md "Prizm Custom" section should NOT crop into a single facet aggressively (current Phase 2 idea). Instead: pull back, slow zoom, generous frame, "few are invited closer" feeling rather than "we're zoomed into the gold leaf."

### Anti-pattern callout

basement.studio's PS1-walkthrough is BOLD AND WEIRD. **Immersive Garden would never do that.** Cartier and Louis Vuitton would not allow it. **Prizm is closer to Immersive Garden in this dimension** — operator-direct copy yes, but the visual experience is sacred-and-restrained, not gimmicky-and-playful. **No PS1 walkthroughs. No 3D driving games. No glitch transitions for their own sake.** When in doubt: ask "would this fit on cartier.com or louisvuitton.com?" If no, reconsider.

---

## 2. Pmndrs ecosystem audit (beyond drei)

### Confirmed packages and Phase 1B/2 relevance

| Package | What it does | Phase 1B v1 | Phase 2 |
|---|---|---|---|
| **`@react-three/drei`** | 120 helper components | YES (already heavy use) | YES |
| **`@react-three/fiber`** | R3F core | YES (already in use) | YES |
| **`@pmndrs/postprocessing`** | RAW postprocessing library | YES (Sat ūs already uses) | YES |
| **`@react-three/postprocessing`** | React wrapper around above | Maybe — easier API | Maybe |
| **`pmndrs/leva`** | React-first dev controls UI | **YES — calibration phase** | NO (production removes) |
| **`pmndrs/maath`** | Math utils (easings, lerping, swizzle) | Maybe — easings useful | YES |
| **`pmndrs/use-gesture`** | Advanced pointer events (drag, pinch) | NO (no interaction in v1) | YES |
| **`pmndrs/detect-gpu`** | GPU capability tier detection | Already wrapped in Sat ūs's `gpu-detection.ts` | — |
| **`pmndrs/three-stdlib`** | three.js examples without import path | Maybe (cleaner imports) | YES |
| **`@react-three/a11y`** | A11y for R3F | NO (decorative canvas pattern works) | Maybe |
| **`@react-three/uikit`** | WebGL-rendered UI components | NO (we use HTML for content) | NO |
| **`@react-three/xr`** | VR/AR support | NO | NO |
| **`pmndrs/gltfjsx`** | Convert .glb → JSX components | NO (no GLB models) | Maybe |
| **`pmndrs/cannon-es`** + `use-cannon` | Physics (cannon-es) | NO (no physics) | Maybe Phase 2 chip-physics |
| **`pmndrs/react-three-rapier`** | Physics (Rapier — newer, faster) | NO | Maybe |
| **`pmndrs/zustand`** | State management | Already in Sat ūs (`zustand: ^5.0.11`) | YES |
| **`pmndrs/jotai`** | Atomic state management | Alternative to zustand | NO |
| **`pmndrs/valtio`** | Proxy state management | Alternative to zustand | NO |
| **`pmndrs/lamina`** | Layered material composition | Maybe Phase 2 for custom MTM-like materials | YES |
| **`pmndrs/react-three-csg`** | CSG operations (boolean geometry) | NO (Penrose has explicit math) | Maybe |
| **`pmndrs/react-three-flex`** | Flexbox in 3D | NO | NO |

### The big one: `pmndrs/leva` for calibration

During the rebuild, we'll be tuning ~15 parameters across MTM, Bloom, Lightformers, camera. **`leva` is the canonical dev-controls UI** that basement.studio uses in their experiments. Same UI pattern as PRIZM.md's Phase 1B implementation needs:

```tsx
import { useControls } from 'leva'

function PrismMesh() {
  const { ior, chromaticAberration, thickness, samples, resolution } = useControls('MTM', {
    ior: { value: 1.6, min: 1.0, max: 2.5, step: 0.01 },
    chromaticAberration: { value: 0.06, min: 0, max: 0.5, step: 0.01 },
    thickness: { value: 0.4, min: 0.1, max: 2, step: 0.05 },
    samples: { value: 10, min: 4, max: 32, step: 1 },
    resolution: { value: 1024, min: 256, max: 2048, step: 128 },
  })
  
  const { intensity: keyIntensity, color: keyColor } = useControls('KeyLight', {
    intensity: { value: 4, min: 0, max: 10, step: 0.1 },
    color: '#00cfee',
  })
  
  return (
    <MeshTransmissionMaterial
      ior={ior}
      chromaticAberration={chromaticAberration}
      thickness={thickness}
      samples={samples}
      resolution={resolution}
      // ... etc
    />
  )
}
```

leva renders a floating panel during dev, lets us scrub all values in real-time. **Production: leva controls auto-disable in production builds via Next.js process.env.NODE_ENV check, OR use the `<Leva hidden />` prop.**

This solves the calibration problem from v8 §2: instead of editing code + reloading to test ior 1.14 vs 1.6, drag a slider and see live.

### The `@react-three/postprocessing` decision

Sat ūs uses raw `postprocessing` directly. The R3F wrapper has cleaner JSX:

```tsx
// Raw (Sat ūs current pattern):
const composer = new EffectComposer(gl, { multisampling: 0, frameBufferType: HalfFloatType })
const bloom = new BloomEffect({ luminanceThreshold: 1.1, intensity: 1.5 })
composer.addPass(new RenderPass(scene, camera))
composer.addPass(new EffectPass(camera, bloom))

// React wrapper:
<EffectComposer disableNormalPass>
  <Bloom mipmapBlur luminanceThreshold={1.1} intensity={1.5} />
  <ToneMapping mode={ToneMappingMode.ACES_FILMIC} />
</EffectComposer>
```

**Recommendation for rebuild:** Use `@react-three/postprocessing` for our PRISM SCENE inside the View (cleaner JSX, easier to compose). Keep Sat ūs's raw `postprocessing` for the global canvas postprocessing chain. They can coexist.

### `pmndrs/maath` for cleaner code

```tsx
import { lerp, damp, dampE } from 'maath/easing'

// Replaces THREE.MathUtils.lerp + manual delta calc
useFrame((state, delta) => {
  damp(camera.position, 'x', target.x, 0.1, delta)  // frame-rate-independent
  damp(camera.position, 'y', target.y, 0.1, delta)
  dampE(camera.rotation, targetRot, 0.15, delta)  // for euler angles
})
```

Useful but small. Not blocking. Adopt during implementation if convenient.

### Pmndrs ecosystem verdict

For Phase 1B v1, **add 2 packages:**
- `@react-three/postprocessing` — cleaner JSX for hero scene effects
- `leva` — dev-time controls for calibration (auto-disabled in prod)

Everything else stays optional or deferred.

---

## 3. Inigo Quilez — positioning correctly

### Who he is

Spanish (San Sebastián / Donostia, Basque Country). **Co-founded Shadertoy** with Pol Jeremias. Worked at Pixar, Blizzard, NVIDIA, Adobe. Created the SDF distance functions catalog that the entire raymarching community references.

His content tone: deeply mathematical. *"Painting with Maths"* is the philosophy. He writes 5-page articles deriving formulas from first principles. He doesn't write tutorials in the "do this then that" sense — he writes derivations.

### What's at iquilezles.org/articles

Not a blog. A **reference manual.** ~80 articles on:

- Distance functions (3D and 2D primitives)
- Raymarching techniques
- Procedural noise
- Smooth minimum / smooth blend / smooth boolean operations
- Fog / atmospheric scattering
- Color spaces
- Gradient noise / Perlin noise / fBM
- Voronoi / Worley noise
- Iterated function systems (fractals)
- Camera math
- Procedural texturing
- Ambient occlusion / soft shadows for SDFs
- Penumbra shadows
- Painters algorithm vs raymarching tradeoffs

### Where his content lives

- **iquilezles.org** — articles (reference)
- **shadertoy.com/user/iq** — shader showcase (he has hundreds)
- **YouTube** — "Painting with Maths" video series (he records derivation walkthroughs)
- **GitHub** — minimal; most code is on Shadertoy
- **Patreon** — supporters get access to additional content

### Why he's NOT a Phase 1B reference

His content is RAW SHADERS, not R3F components. To use his work:
1. Read his article (math derivation)
2. Read the corresponding Shadertoy shader (GLSL fragment shader running on a fullscreen quad)
3. Adapt to three.js: create a `<shaderMaterial>` with his GLSL
4. Wire up uniforms: `iTime`, `iResolution`, `iMouse`

**For Phase 1B we don't write shaders.** drei MTM, drei Bloom, postprocessing ToneMapping are pre-built. We don't touch GLSL.

### When he becomes Phase 2/3 relevant

- **Custom procedural backgrounds** (replacing or augmenting Lightformer environment)
- **Custom volumetric effects** (fog, god rays specific to our scene)
- **Custom procedural textures** (procedural noise on prism surface as alternative to dirtness map)
- **Caustics from scratch** (alternative to drei `<Caustics>` if we want non-standard look)
- **Custom 2D shapes / signed distance fields** for UI elements

### Specific articles to bookmark for Phase 2

- `iquilezles.org/articles/distfunctions/` — 3D SDF primitives (Phase 2 if we add SDF rendering)
- `iquilezles.org/articles/distfunctions2d/` — 2D SDF primitives (Phase 2 for procedural UI)
- `iquilezles.org/articles/smin/` — smooth minimum operations (blending shapes)
- `iquilezles.org/articles/fog/` — atmospheric fog (Phase 2 atmospheric depth around prism)
- `iquilezles.org/articles/raymarchingdf/` — raymarching technique (Phase 2/3)
- `iquilezles.org/articles/palettes/` — procedural color palettes (Phase 2 for color scheme variations)

### Phase 2/3 reference, not Phase 1B

Add him to the team-knowledge resources list alongside Maxime Heckel, Yuri Artiukh, Bruno Simon. **Don't try to use his content for v1.**

---

## 4. Lighthouse-for-WebGL — concrete patterns

### The Lighthouse scoring mechanics

From Chrome's docs:
- **LCP score 99 = ~1,220ms** (top performers)
- **LCP score 90 = 8th percentile** of HTTPArchive data
- **LCP score 50 = 25th percentile**
- LCP weight in Lighthouse Performance score: 25% (largest single metric weight)
- Other Core Web Vitals: INP (interaction-to-next-paint) replaced FID in 2024, target <200ms; CLS <0.1

PRIZM.md targets:
- Mobile Lighthouse Performance ≥ 90 (achievable, 8th percentile)
- LCP ≤ 1.5s mobile (achievable, between 50 and 90 percentile target)
- CLS = 0 (perfect — only achievable with reserved layout space, no late-loading shifts)
- A11y ≥ 95 (handled in v8)

### The five rules for Lighthouse with WebGL

From Utsubo's "100 Three.js Tips That Actually Improve Performance (2026)":

**Rule 1: Defer 3D loading until visible**

```tsx
// Only mount the canvas when the section is visible
const observer = new IntersectionObserver((entries) => {
  if (entries[0].isIntersecting) {
    setShouldMount(true)
    observer.disconnect()
  }
})
observer.observe(canvasContainer)
```

For Prizm: the hero is above the fold, so the canvas IS visible on load. **But** subsequent sections with WebGL (problem section, prizm-custom, final-cta) should defer.

**Rule 2: The LCP element must be DOM, not canvas**

The largest above-the-fold element is the H1 + subhead in our hero. Canvas comes after.

```tsx
<section className="hero">
  {/* This renders first, becomes LCP */}
  <div className="copy">
    <p className="eyebrow">THE SOLAR OPERATING SYSTEM</p>
    <h1>Everyone on the same platform...</h1>
    <p className="subhead">Sales, ops, commissions...</p>
  </div>
  
  {/* This loads after — uses dynamic import with SSR off */}
  <Suspense fallback={<SVGPrismFallback />}>
    <View track={containerRef}>
      <DynamicallyImportedPrism />
    </View>
  </Suspense>
</section>
```

PRIZM.md already specifies this pattern. ✅

**Rule 3: Preload critical assets**

```html
<link rel="preload" href="/textures/dirtness.ktx2" as="fetch" crossorigin>
<link rel="preload" href="/fonts/geist-1a-variable.woff2" as="font" type="font/woff2" crossorigin>
```

Prizm assets to preload:
- Geist 1A variable font ✅ (already in PRIZM.md)
- Phase 2: any KTX2 textures we add (Maybe roughnessMap from v8 §2)

**Rule 4: KTX2 / Basis Universal texture compression**

PNG: ~1MB for 2048×2048 with mipmaps  
WebP: ~600KB  
**KTX2 / Basis: ~80-100KB** (8-12x smaller)

Plus KTX2 textures can be uploaded directly to GPU without CPU decoding step — **faster initial render.**

For Prizm v1: **probably not needed** (no custom textures yet). For Phase 2 if we add roughnessMap: ALL textures should be KTX2.

How: use `@gltf-transform/cli` or similar to convert PNG → KTX2 at build time:
```bash
npx gltf-transform basisu input.png output.ktx2 --etc1s
```

drei has `<Ktx2>` component / `useKTX2()` hook for loading.

**Rule 5: Progressive enhancement**

Show a low-resolution placeholder, swap high-resolution after load. For Prizm: SVG fallback IS the low-resolution placeholder. Canvas swaps in after mount (current implementation does this).

```tsx
const [mounted, setMounted] = useState(false)
useEffect(() => setMounted(true), [])

if (!mounted) return <SVGPrismFallback />  // SSR + first paint
return <View><WebGLPrism /></View>  // After hydration
```

### Lab vs Field data

**Lab (Lighthouse):** Simulated test, controlled device, controlled connection. What CI tests against.

**Field (Real users):** Actual device + network of visitors. What Google ranks on.

For Prizm v1: **test against Lab Lighthouse mobile ≥ 90.** Once shipped, monitor field data via Vercel Analytics (already in PRIZM.md stack).

### CLS = 0 specifically

CLS happens when content shifts after paint. Common causes:
1. Web fonts swap in (FOUT) → use `font-display: optional` or `swap` with reserved metrics
2. Images load without dimensions → always set `width` and `height` (next/image handles)
3. Async content insertion → reserve layout space
4. Late JS modifying DOM → reserve space, animate INTO position

For Prizm hero: **the SVG fallback and the WebGL canvas must occupy the same layout space.** When canvas mounts, it slots into that reserved space. No shift.

```css
.prism-container {
  width: 460px;
  height: 460px;
  /* Reserved size - same for SVG and canvas */
}
```

### Mobile LCP target deep-dive

PRIZM.md target: 1.5s mobile.

LCP = Time from navigation start to when the largest visible element finishes rendering.

For Prizm hero: largest element is the H1 + subhead. To hit 1.5s on mobile:
- TTFB (server response) < 600ms (Vercel Edge handles this)
- HTML parsing + CSS-blocking < 300ms
- Font load < 400ms (use font-display: optional, preload variable font WOFF2)
- H1 paint < 200ms after parsing

Total ≈ 1500ms. Achievable. Canvas mounting is OUTSIDE this critical path because it's deferred via dynamic import.

### Concrete Prizm Lighthouse plan

1. Hero copy renders SSR (Next.js App Router default) → fast first paint
2. SVG fallback renders inline → no separate request
3. WebGL canvas dynamic-imports after mount → not in critical path
4. Reserved layout space for prism container → CLS = 0
5. Geist font preloaded with `font-display: swap` → no FOUT shift
6. No images above-the-fold (hero is text + WebGL) → no image-LCP issue
7. Vercel Edge caching → low TTFB
8. Lighthouse mobile target: Performance ≥ 90 ✅

This is achievable as specced. The current implementation likely already does most of this.

---

## 5. Yuri Artiukh — the complete Phase 2 effects library

### His positioning (now formally locked)

| Resource | Author | When |
|---|---|---|
| Three.js Journey | Bruno Simon | Foundation (paid course) |
| iquilezles.org | Inigo Quilez | Mathematical reference |
| blog.maximeheckel.com | Maxime Heckel | R3F shader theory |
| **Codrops + GitHub** | **Yuri Artiukh** | **Production reverse-engineering — implementation library** |

### His complete Codrops catalog (from the search results)

Numbered chronologically. Bold = directly relevant to Prizm Phase 2:

1. **Volumetric Light Rays** — fragment shaders. Reverse-engineers `moonfall.oblio.io`. Phase 2: god rays through prism.
2. **Galaxy made of particles from Viverse** — particle galaxy system.
3. Infinite image slider (tismes.com) — not relevant.
4. Infinite distorted slider (Yuto Takahashi) — PixiJS. Not relevant.
5. Sunflowers tank scene (Polycam photogrammetry) — not relevant.
6. Liquid-like effect (PixiJS website) — Three.js port. Phase 2 if we want liquid distortion.
7. **3D glass portal with R3F + Gaussian Splatting** — Phase 2: Prizm Custom gatekeeper visual.
8. **Glass effect from Kenta Toshikura** — postprocessing. **Phase 1B/2: direct calibration reference for our prism's glass.** Live demo: kentatoshikura.com.
9. Reflective grid + energy wave (Crosswire) — Phase 2: floor reflection.
10. Twist and rotate text in 3D — Phase 3.
11. **Beautiful light effects (Midwam)** — postprocessing. Note: Midwam is an Immersive Garden client! Same DNA reference.
12. **Coding Kenta Toshikura's Glass Effect** (separate tutorial). Live source. Match for our glass aesthetic.
13. Whirlwind dissolving effect with tiny triangles — Phase 3 nice-to-have.
14. Lava lamp gradient from Stripe — Phase 2 alternative for FinalCta if we replace AnimatedGradient.
15. Text and image gallery (Design Embraced) — not relevant for our copy structure.
16. Checkerboard transition (Gleec) — note: Gleec is also an Immersive Garden client.
17. Wrap a texture on a 3D face — not relevant.
18. On-scroll reveal effects for images — not relevant.
19. Refraction with WebGL Render Targets — same Maxime-cited per-channel-IOR shader from basement-lab #47 (v8 §2). Phase 2.

(Plus more not surfaced in search — his Codrops author archive has the complete list.)

### His standard repo structure (from cloning UnrollingImages)

```
project-name/
├── README.md
├── package.json     ← deps: three + gsap + maybe dat.gui or three-orbit-controls
├── package-lock.json
├── index.html       ← entry point
├── css/
├── img/             ← assets
└── js/
    ├── app.js       ← main scene
    └── shaders/     ← GLSL fragment + vertex shaders
```

**Vanilla three.js + GSAP** (not R3F). Older patterns (uses `dat.gui` instead of leva). To use his work:

1. Clone the repo
2. Read the GLSL shaders
3. Port to R3F-style: `<shaderMaterial vertexShader={vert} fragmentShader={frag} uniforms={uniforms} />`
4. Wire up uniforms with `useFrame` to update per-frame

### Volumetric Light Rays tutorial — the Phase 2 god-rays implementation

Tutorial: tympanus.net/codrops/2022/06/27/volumetric-light-rays-with-three-js/  
Original: moonfall.oblio.io  
Streamed: June 19, 2022

For Phase 2 if we want light shafts EMANATING from the prism (or through it):
1. Watch the YouTube live stream (linked from Codrops)
2. Clone the gist setup: gist.github.com/akella/a19954c9ee42e3ae85b76d0e06977535
3. Adapt the fragment shader to our Lightformer-environment-driven scene

### Glass Effect (Kenta Toshikura) tutorial — Phase 1B/2 calibration reference

Tutorial: tympanus.net/codrops/2023/03/06/coding-kenta-toshikuras-glass-effect-with-three-js/  
Original: kentatoshikura.com  
Streamed: March 5, 2023

**This is the closest aesthetic prior art to our prism.** Watch this. The original site uses postprocessing (not MTM) for a specific glass-distortion effect. Worth seeing live:
- Visit kentatoshikura.com
- Watch how the glass interacts with the page
- Compare to our MTM approach
- Decide whether to switch (custom postprocessing shader) or keep (drei MTM)

**For Phase 1B v1: keep MTM (simpler, drei-supported).** For Phase 1B.5 if MTM doesn't deliver the right feel, watch this tutorial and consider porting.

### Yuri's verdict for our brief

**Add to brief as Phase 2 reference library, not Phase 1B.** When we want a specific effect Phase 2 onward:
1. Search his Codrops author archive for matching tutorial title
2. Read the live original site he reverse-engineered
3. Decide: does drei + raw postprocessing give us the same effect easier? Or do we need his custom shader?
4. If custom: clone his repo, port to R3F + Sat ūs

---

## 6. Updated Phase 1B blueprint — v9 deltas

Cumulative blueprint with v9 additions on top of v2-v8:

### MTM calibration — DNA-aligned target values

After v8 + v9 analysis:
- **basement.studio:** ior 1.14, chromatic 0.04 (subtle clear glass)
- **Immersive Garden DNA:** would use higher IOR, lower chromatic (subtle gem)
- **Current Prizm:** ior 1.6, chromatic 0.2 (aggressive)

**v9 recommendation:** Start at `ior: 1.5-1.6, chromatic: 0.06-0.08`. Higher IOR than basement (we ARE a gem, not just glass), much lower chromatic than current (subtle spectrum bleeding, not rainbow). **A/B with leva controls during calibration.**

### Add to package.json

```json
{
  "dependencies": {
    // existing deps
    "@react-three/postprocessing": "^3.0.0",  // cleaner JSX for hero effects
    "leva": "^0.10.0"  // dev controls (auto-hides in production)
  }
}
```

### Lighthouse-aware architecture

```tsx
// app/layout.tsx — uncha nged from v6
<GlobalCanvas postprocessing forceWebGL />

// app/(marketing)/_sections/hero/index.tsx
const PrismScene = dynamic(
  () => import('./prism-scene').then(m => m.PrismScene),
  { ssr: false, loading: () => <SVGPrismFallback /> }
)

export function Hero() {
  return (
    <section aria-labelledby="hero-h1" className="hero">
      <div className="copy">
        <p className="eyebrow">THE SOLAR OPERATING SYSTEM</p>
        <h1 id="hero-h1">Everyone on the same platform. <em>Nothing falling through.</em></h1>
        <p className="subhead">Sales, ops, commissions, integrations, and AI. One system. Built by operators.</p>
        <a href="https://cal.com/prizm-solar" className="cta-primary">Talk to the founder</a>
        <a href="#problem" className="cta-secondary">See how it works</a>
      </div>
      
      {/* Reserved layout space — CLS = 0 */}
      <div ref={containerRef} className="prism-container" aria-hidden="true" tabIndex={-1}>
        <PrismScene containerRef={containerRef} />
      </div>
    </section>
  )
}
```

### CSS: reserved layout space

```css
.prism-container {
  width: 460px;
  height: 460px;
  position: relative;
  /* Same dimensions for SVG and canvas — no shift */
}

@media (max-width: 768px) {
  .prism-container {
    width: 280px;
    height: 280px;
  }
}
```

### Dev calibration controls (v9 leva pattern)

```tsx
'use client'

import { useControls, Leva } from 'leva'

export function PrismScene({ containerRef }) {
  const mtmConfig = useControls('Prism MTM', {
    ior: { value: 1.55, min: 1.0, max: 2.5, step: 0.01 },
    chromaticAberration: { value: 0.07, min: 0, max: 0.5, step: 0.005 },
    thickness: { value: 0.4, min: 0.1, max: 2, step: 0.05 },
    samples: { value: 10, min: 4, max: 32, step: 1 },
    resolution: { value: 1024, min: 256, max: 2048, step: 128 },
    transmission: { value: 0.95, min: 0, max: 1, step: 0.01 },
    roughness: { value: 0.05, min: 0, max: 0.5, step: 0.01 },
    attenuationDistance: { value: 0.8, min: 0, max: 5, step: 0.1 },
    attenuationColor: '#7c4ff5',
  })
  
  const lightformerConfig = useControls('Lightformers', {
    keyIntensity: { value: 4, min: 0, max: 10, step: 0.1 },
    keyColor: '#00cfee',
    fillIntensity: { value: 2, min: 0, max: 10, step: 0.1 },
    fillColor: '#7c4ff5',
    backIntensity: { value: 2.5, min: 0, max: 10, step: 0.1 },
    floorIntensity: { value: 1.5, min: 0, max: 10, step: 0.1 },
    floorColor: '#ffaa44',
  })
  
  return (
    <>
      {/* Leva auto-shows in dev, hidden in production */}
      <Leva hidden={process.env.NODE_ENV === 'production'} />
      
      <View track={containerRef}>
        <PerspectiveCamera makeDefault fov={35} position={[0, 0, 2.8]} />
        
        <Environment frames={1} resolution={256}>
          <Lightformer form="rect" intensity={lightformerConfig.keyIntensity} color={lightformerConfig.keyColor} position={[3, 4, 4]} scale={[4, 5, 1]} target={[0, 0, 0]} />
          {/* ... etc ... */}
        </Environment>
        
        <Float speed={1} rotationIntensity={0.5} floatIntensity={0.3}>
          <PrismMesh>
            <MeshTransmissionMaterial {...mtmConfig} />
          </PrismMesh>
        </Float>
        
        <Sparkles count={80} scale={4} size={2} speed={0.3} color="#00cfee" opacity={0.6} />
      </View>
    </>
  )
}
```

This gives us live-tuning during calibration without leaving dev. **Strip the controls before final production deploy** by gating with `process.env.NODE_ENV` or feature flag.

### Phase 2 effects library bookmark

When we hit Phase 2 needing a specific effect, the priority lookup order:

1. Search drei components first (v7 audit)
2. Search Yuri Artiukh's catalog (v9 §5 — implementation reference)
3. Search Maxime Heckel's articles (v6 §4 — theory + R3F examples)
4. Search basement-laboratory experiments (v8 §2 — R3F-native examples)
5. If still nothing: write custom shader using Inigo Quilez's articles for math (v9 §3)

Most Phase 2 needs will be solved at step 1-3. Step 4-5 is rare.

### Aesthetic verdict from v9

**Prizm sits between basement.studio and Immersive Garden.** Operator-direct copy and bold confidence (basement). Quiet luxury motion and restrained color (Immersive Garden). 

**For motion calibration:**
- Yaw cycle: 30s (current) — keep, maybe slow to 45s for premium feel
- Bob cycle: 6s, 5cm amplitude — keep
- Camera transitions between sections: 1.2-1.8s with `power1.inOut` ease (Bruno's pattern)

**For chromatic intensity:**
- Lower than current 0.2 (rainbow gimmick territory)
- Higher than basement's 0.04 (too subtle, brand mark needs spectrum visibility)
- **Target: 0.06-0.08** (subtle spectrum bleeding, brand-recognizable)

**For Lightformer intensity:**
- Lower than v7 §3 specced (4 was too hot for premium feel)
- Target: key=2.5, fill=1.5, back=2.0, floor=1.0
- Restraint over drama

**The brand mark should feel like a Cartier piece in motion, not a Vercel demo.**

---

## 7. Open questions — going into Phase 1B brief

Carryforward from v8 + v9 deltas:

1. ~~Camera path~~: **Bruno v1, basement-bezier v1.5, Theatre v2+** ✅
2. ~~HDRI~~: **Lightformers** ✅
3. ~~Particles for v1~~: **Sparkles** ✅
4. ~~Eleven errors~~: **forceWebGL** ✅
5. **MTM calibration:** target ior 1.5-1.6, chromatic 0.06-0.08. **Use leva to A/B during implementation.** ⚠️ leva integration needed
6. ~~roughnessMap source~~: **Defer to Phase 2.** v1 ships without roughnessMap (simpler).
7. **AnimatedGradient on FinalCta:** keep or replace with shader-lab / Yuri-Stripe-gradient pattern? **PRIZM.md says use AnimatedGradient. Keep for v1.** Phase 2 candidate to replace.
8. **Caustics for Phase 2:** drei `<Caustics>` is N8Programs implementation. Test prototype, ~3-5ms frame budget. If fits mobile 16.67ms ceiling: Phase 2 v1 candidate.
9. **shader-lab Phase 2:** swap Lightformer for animated shader-lab composition? **Phase 2 stretch.**
10. ~~A11y library~~: **Skip for v1.** Decorative-canvas-with-aria-hidden pattern handles it. ✅

### NEW open questions from v9:

11. **Leva controls visibility flag:** auto-disable in production via env check, or always-hidden + dev keystroke to reveal? **Recommend: env check, no keystroke.**
12. **Lightformer intensity calibration:** current v7 spec was 4/2/2.5/1.5; v9 recommends 2.5/1.5/2/1. **A/B with leva during implementation.**
13. **Sound design for Phase 2:** Tone.js per PRIZM.md, but whose ear authors it? **Phase 2 owner — likely Knighthawk or commissioned designer. NOT v1 concern.**
14. **KTX2 textures Phase 2:** if we add roughnessMap, how do we generate KTX2 build-time? Bun script + gltf-transform? Webpack loader? **Phase 2 question, v1 doesn't need.**

---

## 8. v10+ research targets (carried)

From v8 + v9 carryover:

1. **Experiential round (Mac browser MCP)** — Vercel prism live, Active Theory, Exo Ape Amaterasu, Immersive Garden Cartier work, basement.studio PS1 walkthrough. **Critical for visual calibration.**
2. **r3f-perf vs Stats vs StatsGl** — production performance monitoring decision
3. **Specific Yuri Artiukh tutorials in detail** — especially Glass Effect (Kenta Toshikura) and Volumetric Light Rays
4. **Specific Maxime Heckel posts deep-dive** — caustics post for Phase 2
5. **Vercel Edge caching specifics** — for hitting our 1.5s mobile LCP target
6. **Three.js r190+ release notes if released** — track WebGPU+RawShaderMaterial migration in Sat ūs

---

## TL;DR for v9

Five findings:

1. **Immersive Garden's DNA = premium institutional luxury** (Cartier, LV, OMEGA, Dior). PRIZM.md formula: basement.studio confidence + Immersive Garden restraint = "operator-direct copy inside Cartier-grade visual restraint." Specifically: motion is SLOW, palette is RESTRAINED, chromatic is SUBTLE (0.06-0.08, not 0.2), the brand mark feels like a Cartier piece in motion.

2. **Pmndrs ecosystem audit** — 4 more libraries beyond drei matter. Add `@react-three/postprocessing` (cleaner JSX), `leva` (dev calibration controls, auto-hides in prod) to package.json. Maybe `pmndrs/maath` (easings). Skip the rest for v1.

3. **Inigo Quilez is Phase 2/3 reference, NOT Phase 1B.** Co-founded Shadertoy. Mathematical SDF master. Add to team-knowledge resources, but don't try to use his work for v1 (drei MTM + Bloom + ACES handle our hero, no custom shaders needed).

4. **Lighthouse-for-WebGL has 5 concrete rules.** (a) Defer 3D loading via IntersectionObserver. (b) LCP element is DOM not canvas. (c) Preload critical assets. (d) KTX2/Basis textures (Phase 2). (e) Progressive enhancement (SVG → canvas swap). PRIZM.md's mobile ≥90 + LCP ≤1.5s + CLS=0 is achievable.

5. **Yuri Artiukh's catalog is the complete production-effect reverse-engineering library.** ~30 Codrops tutorials, each reverse-engineering a specific live website. Full source on his GitHub. Phase 2 effects priority lookup: drei → Yuri → Maxime → basement-lab → Inigo Quilez (custom shader). Most Phase 2 needs solved by step 1-3.

The brief is genuinely ready to write. v10+ is experiential calibration (browser MCP on Mac) + miscellaneous calibration (perf monitoring, specific tutorials). The architectural and aesthetic questions are settled.
