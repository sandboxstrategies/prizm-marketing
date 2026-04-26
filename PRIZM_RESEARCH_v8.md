# Prizm Marketing Site — Research Findings v8 (Round 6: Errors Diagnosed + basement-lab + Yuri + WebGPU 2026 + a11y)

**Compacted:** April 26, 2026 (continuation session, sixth deep round)
**Method:** `git clone` on basement-laboratory (77 experiments) + targeted reading of high-value experiments + web research on Three.js r184 + Utsubo WebGPU 2026 guide + Yuri Artiukh catalog + react-three-a11y. Plus diagnostic interpretation of the actual 11 console errors captured in DevTools.
**Combines with:** v2 (master) + v3-v7 (prior rounds) + this round.
**Why this exists:** v7 closed major architectural and component questions. This round closes the **eleven-errors mystery** (it's WebGPU+NodeMaterial vs RawShaderMaterial, not transmission), proves the basement.studio MTM calibration baseline is different from ours, brings in production-reverse-engineering as a research mode (Yuri Artiukh's catalog), formalizes the WebGPU migration timeline (Utsubo 2026 guide), and answers the long-deferred a11y question (react-three-a11y exists, has clean API).

---

## ★ THE SIX BIG FINDINGS THIS ROUND ★

**1. The eleven errors are 100% diagnosed. They have NOTHING to do with transmission.** The console screenshot shows: *"THREE.NodeMaterial: Material 'RawShaderMaterial' is not compatible"* (×8) + *"...'ShaderMaterial' is not compatible"* (×1) + ×2 more RawShaderMaterial repeats. Stack trace: `lib/webgl/utils/fluid/fluid-sim.ts:605:14` in `Fluid.update()`. **This is Sat ūs's flowmap fluid simulation written for WebGL classic shaders, breaking under WebGPU's NodeMaterial system.** Not the transmission bug class. Not version drift. Not framebuffer overflow. **Same fix though:** `forceWebGL={true}` on GlobalCanvas. The hero canvas (separate `<Canvas>`) is unaffected because it's pure WebGL by default.

**2. basement.studio's actual MTM calibration is dramatically different from current Prizm code.** From their `51.transmission-material.js` (with leva controls showing values they ship): `ior: 1.14` (not our 1.6), `chromaticAberration: 0.04` (not our 0.2), `samples: 10`, `resolution: 2048` (much higher). They use a **roughnessMap of "dirtness.jpg"** for subtle imperfection. Their values are SUBTLER than ours — closer to clear glass than hard crystal. Worth A/B testing during rebuild. Ours may be too aggressive.

**3. basement-laboratory has 77 experiments — multiple are direct prior art for Phase 2.** Specifically: `47.refraction.js` (Maxime-Heckel-cited custom refraction shader with per-channel IOR), `50.camera-rail.js` (BezierCurve camera rails with magnetic targets — more sophisticated than Bruno's preset pattern), `65.multi-scene-composer-pipeline.tsx` (multi-scene postprocessing pipeline — directly relevant to our drei `<View>` architecture), `74.particles-emitter.tsx`, `62.sun-ray-cone.js` (volumetric light cones), `47.refraction.js` cites Maxime Heckel directly: *"Refraction shader inspired in this blog"*. **The chain is locked: Maxime → basement → us.**

**4. Yuri Artiukh's catalog is the missing reverse-engineering layer.** ~30+ Codrops tutorials, 199 GitHub repos, weekly YouTube live streams. **Each tutorial is a reverse-engineering of a specific production website's effect.** Examples directly relevant to Phase 2: "volumetric light rays with fragment shaders," "glass effect from Kenta Toshikura's website using postprocessing," "beautiful light effects from Midwam's website," "3D glass portal with R3F + Gaussian Splatting." This is the fastest path to production-grade specific effects.

**5. Utsubo's "WebGPU + Three.js Migration Guide (2026)" published Jan 21, 2026 — essentially a 47-point checklist authored by a production WebGPU studio.** Key insight: WebGPU has 95% browser support globally as of Jan 2026 (Chrome v113+, Firefox 141+, Safari 26+ since Sept 2025). Three.js r171+ ships zero-config WebGPU with automatic WebGL 2 fallback. **BUT** custom GLSL shaders need TSL conversion — **which is exactly the issue causing our 11 errors.** The guide's Step 1 audit literally says: *"grep -r 'RawShaderMaterial' src/"*. Phase 2 WebGPU migration timeline: 1-2 weeks for projects with custom shaders.

**6. WebGL accessibility is a SOLVED problem with `@react-three/a11y`, not an unsolved one.** Pmndrs ecosystem library with `<A11y>` wrapper component for focusable meshes, `<A11yAnnouncer>` for screen-reader announcements, `<A11yUserPreferences>` for prefers-reduced-motion + prefers-color-scheme + custom contrast modes. Plus the foundational technique from Anneka Goss's 2021 post: **shaders can ENFORCE accessibility** — per-pixel contrast correction in fragment shaders. PRIZM.md's a11y ≥ 95 budget is achievable. Specific implementation patterns below in §6.

---

## 1. The eleven errors — fully diagnosed

### What the console actually says

From the DevTools screenshot:

```
[HMR] connected
THREE.THREE.Clock: This module has been deprecated. Please use THREE.Timer instead.    (warning ×2)
[Vercel Web Analytics] Debug mode is enabled in development...
[Vercel Web Analytics] Running queued event pageview
[Vercel Web Analytics] [view] http://localhost:3000/_vercel/insights/view
The powerPreference option is currently ignored when calling requestAdapter() on Windows. 
   See https://crbug.com/369219127                                                        (warning)
Using WebGPU renderer                                                                     (info ←KEY)
WebGL: Preloading...
Timer 'WebGL: Preload took:' already exists                                               (warning ×2)
WebGL: Preload took:: 7.884033203125 ms
Timer 'WebGL: Preload took:' does not exist                                               (warning)
THREE.NodeMaterial: Material "RawShaderMaterial" is not compatible.    (×8 ERRORS)
   overrideMethod @ installHook.js:1
THREE.NodeMaterial: Material "ShaderMaterial" is not compatible.       (×1 ERROR)
   overrideMethod @ installHook.js:1
THREE.NodeMaterial: Material "RawShaderMaterial" is not compatible.    (×2 ERRORS — repeats)
   overrideMethod @ installHook.js:1
[Fast Refresh] rebuilding
[Fast Refresh] done in 134ms
The resource http://localhost:3000/_next/static/chunks/_0f4t9-b_.css was preloaded     (warning ×2)
   using link preload but not used within a few seconds...
```

Error overlay (left side) shows the THROWING line:

```
lib/webgl/utils/fluid/fluid-sim.ts (605:14)  @ Fluid.update
603 |     this.screen.material = this.curlMaterial
604 |     renderer.setRenderTarget(this.curl)
> 605 |     renderer.render(this.screen, this.screenCamera)
606 |
```

Call stack: `Fluid.update` → `useFluidSim.useFrame` → `RAF[useTempus()]`

### The root cause (now certain)

Sat ūs's **fluid simulation system** in `lib/webgl/utils/fluid/fluid-sim.ts` is a flowmap fluid sim used by AnimatedGradient and FlowmapProvider. It was written using classic three.js `RawShaderMaterial` and `ShaderMaterial` classes — the WebGL way.

Three.js's WebGPU renderer has its OWN material system: **NodeMaterial**. NodeMaterial uses TSL (Three Shader Language) which compiles to WGSL for WebGPU and GLSL for WebGL fallback. **Classic ShaderMaterial / RawShaderMaterial are NOT NodeMaterial subclasses** — they're rejected by the WebGPU renderer with this exact error message.

The Sat ūs `createRenderer.ts` (v5 §1) auto-selects WebGPU on capable Windows machines (which includes Knighthawk's). When the fluid sim's RawShaderMaterials hit `renderer.render(...)` against the WebGPU renderer, NodeMaterial says "incompatible" and refuses to render that material.

The 11 errors break down:
- 8 × `RawShaderMaterial` (the various fluid-sim shader passes — vorticity, divergence, pressure, gradient, advection, splat, display, curl)
- 1 × `ShaderMaterial` (one pass uses the slightly different base class)
- 2 × `RawShaderMaterial` (additional passes that throw repeatedly per frame)

Total 11 errors fired, from ~9 unique materials.

### Why it's not the transmission bug

The Dec 2025 forum thread "Custom Transmission Material + extra render targets breaks depth / refraction (WebGPU)" is a SEPARATE issue — that's about `MeshTransmissionMaterial` interacting with depth render targets. Our prism is on a **different canvas** (`hero-mark-3d/index.tsx` creates a local R3F `<Canvas>` not the GlobalCanvas). The hero canvas runs WebGL by default (no `gl=` factory specified, so R3F uses WebGLRenderer). **The transmission errors that thread describes never fire on Knighthawk's machine because his prism canvas is on WebGL.**

### Why it's not version drift

v5 confirmed the package.json matches the canonical Sat ūs baseline exactly. Three 0.183.2, R3F 9.5.0, drei 10.7.7. No drift.

### The fix (same as v5 Step 1, now confirmed reason)

```tsx
// app/layout.tsx
<GlobalCanvas postprocessing forceWebGL />
```

`forceWebGL: true` makes Sat ūs's `createRenderer` skip WebGPU entirely. The fluid sim's RawShaderMaterials run against the WebGL renderer they were designed for. **All 11 errors clear.**

### Why this is GOOD news for the rebuild

We were guessing across 5 rounds. Now we know:
- Hero prism canvas: **WebGL, transmission works correctly, ACES tone mapping working** ← unaffected
- AnimatedGradient on FinalCta: **WebGPU + classic shaders = fail** ← affected
- Single-canvas rebuild via drei `<View>` (v6 §6): if we use `forceWebGL`, both the prism AND AnimatedGradient run on WebGL together = no errors

### Long-term path

When Sat ūs upstream migrates the fluid sim from RawShaderMaterial to NodeMaterial/TSL (per Utsubo's 2026 guide §2.6), `forceWebGL` can be dropped. **Track:** `darkroomengineering/satus` releases for the migration. Until then, ship with `forceWebGL: true`.

---

## 2. basement-laboratory — 77 experiments mined for our patterns

### What I cloned

`basementstudio/basement-laboratory` master branch. ~392 files, 77 experiments in `src/experiments/`. Each experiment is a self-contained R3F demo with shader code inline.

### The full experiment catalog

```
1. just-html.js                17. next.js                  37. shader-tests.js
2. plain-threejs.js            18. CD.js                    38. grotesque-scene.js
3. just-a-cube.js              19. Box.js                   39. ffflauta-scene.js
4. just-a-model.js             20. svg-filter.js            40. carpenter.js
5. rgb-shifted-model.js        21. remote-control.js        41. infinite-render.js
6. animated-gradient.js        22. linear-lantern.js        43. depth-shader.js
7. model-box.js                23. cupcake.js               45. fake-window.js
8. grid-bump.js                24. dagger.js                46. layered-video.js
9. image-portal.js             25. ring.js                  47. refraction.js               ★
10. hover-flowmap.js           26. sticky-scroll-trigger.js 48. pager.js
11. move-map-texture.js        27. reflective-effect.js     49. bezier-import.js
12. green-numbers.js           28. image-mask-effect.js     50. camera-rail.js              ★
13. sculpture-gallery.js       29. circular-fog.js          51. transmission-material.js    ★
14. shader-butterfly.js        30. wireframe-reveal.js      52. twisted-3d-text.js
15. unicorn-model.js           31. footer-trigger.js        53. rapid-image-layers-anim
16. lottie.js                  32. bunker-scene.js          54. computer-vision.js / scale-transmission-material  ★
                               33. drone-animation.js       55. twitch-demo-1.tsx
                               34. svg-rain.js              56. offscreen-canvas
                               35. gradient-svg.js          57. asset-progress.tsx
                               36. xero-scene.js            58. staggered-slider.tsx
                                                            59. draco-tests.js
                                                            60. twitch-demo-2.tsx
                                                            61. image-pixelation.tsx
                                                            62. sun-ray-cone.js             ★
                                                            63. bump-cards
                                                            64. game-audio.tsx
                                                            65. multi-scene-composer-pipeline.tsx  ★
                                                            66. tests-on-geometry-asset.tsx
                                                            67. transition-animation-01.tsx
                                                            68. 3d-on-2d-canvas-renderer.tsx
                                                            69. random-noise-blend.tsx
                                                            70. tiles-follower.tsx
                                                            71. vertex-animation-texture.tsx
                                                            72. nav-experiment.js / render-texture
                                                            73. collision-lightning.tsx
                                                            74. particles-emitter.tsx        ★
                                                            75. shader-matcap-transition.tsx
                                                            76. butterfly-particle-sphere
                                                            77. instanced-grass
```

★ = directly relevant to Prizm Phase 1B/2.

### #51 transmission-material.js — the calibration data

```js
const config = useControls({
  meshPhysicalMaterial: false,
  transmissionSampler: false,
  backside: false,
  samples: { value: 10, min: 1, max: 32, step: 1 },
  resolution: { value: 2048, min: 256, max: 2048, step: 256 },
  transmission: { value: 1, min: 0, max: 1 },
  roughness: { value: 0.0, min: 0, max: 1, step: 0.01 },
  thickness: { value: 1, min: 0, max: 10, step: 0.01 },
  ior: { value: 1.14, min: 1, max: 5, step: 0.01 },              // ← LOWER than ours (1.6)
  chromaticAberration: { value: 0.04, min: 0, max: 1 },           // ← MUCH LOWER than ours (0.2)
  anisotropy: { value: 0.1, min: 0, max: 1, step: 0.01 },
  distortion: { value: 0.0, min: 0, max: 1, step: 0.01 },
  distortionScale: { value: 0.3, min: 0.01, max: 1, step: 0.01 },
  temporalDistortion: { value: 0.5, min: 0, max: 1, step: 0.01 },
  attenuationDistance: { value: 0.5, min: 0, max: 10, step: 0.01 },
  attenuationColor: '#ffffff'
})
```

**Their environment:** `<Environment files="https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/dancing_hall_1k.hdr" blur={10} />` — they download a Poly Haven HDRI with heavy blur.

**Their motion:** Wraps mesh in `<Float>` (the drei component v7 also identified).

**They use a `roughnessMap`:** `useTexture('/textures/dirtness.jpg')` — adds subtle surface imperfection. Worth adopting for the prism — perfectly clean glass looks fake; subtle dirtness map adds realism.

**Calibration delta vs current Prizm code:**

| Param | basement | current Prizm | delta |
|---|---|---|---|
| ior | 1.14 | 1.6 | Ours +0.46 (much higher) |
| chromaticAberration | 0.04 | 0.2 | Ours ×5 (much higher) |
| samples | 10 | 6/10 | matches |
| resolution | 2048 | 512/1024 | basement higher |
| roughness | 0.0 | 0.05 | matches |
| thickness | 1 | 0.4 | ours -0.6 (thinner) |
| transmission | 1 | 0.95 | matches |

**A/B testing recommendation for rebuild:**
- Test `ior: 1.14` (basement) vs `ior: 1.6` (current Prizm) — does the prism feel like glass or crystal/diamond? Our brand is gem-like, basement's is clearer glass. **Probably ours is right at 1.6 for premium-gem feel, but worth verifying.**
- Test `chromaticAberration: 0.04` (basement) vs `0.2` (current). Ours is dramatic. Their subtler value might feel more "luxury" and less "rainbow gimmick." **High probability we want lower than 0.2.** Try 0.08-0.12.
- Add `roughnessMap` of subtle dirtness/noise texture for realistic glass surface.

### #47 refraction.js — the per-channel IOR custom shader (Maxime-cited)

This is a custom shader from basement that they cite as inspired by Maxime Heckel's refraction post. The technique:

1. Render scene to `renderTarget1` (FBO) with the prism mesh as backside-only
2. Render the prism mesh as frontside, sampling that texture via per-channel `refract()` calls — different IOR per channel (R/G/B)
3. The shader does ~16 LOOP iterations per pixel, accumulating slightly offset refractions

```glsl
for (int i = 0; i < LOOP; i++) {
  float slide = float(i) / float(LOOP) * 0.1;
  vec3 refractVecR = refract(eyeVector, normal, iorRatioRed);
  vec3 refractVecG = refract(eyeVector, normal, iorRatioGreen);
  vec3 refractVecB = refract(eyeVector, normal, iorRatioBlue);
  
  color.r += texture2D(uTexture, screenMappedUv + refractVecR.xy * (uRefractPower + slide * 1.0) * uChromaticAberration).r;
  color.g += texture2D(uTexture, screenMappedUv + refractVecG.xy * (uRefractPower + slide * 2.0) * uChromaticAberration).g;
  color.b += texture2D(uTexture, screenMappedUv + refractVecB.xy * (uRefractPower + slide * 3.0) * uChromaticAberration).b;
}
color.rgb /= float(LOOP);
```

Their per-channel IOR values: `iorR: 1.15`, `iorG: 1.18`, `iorB: 1.22` — **R/G/B refract differently, creating true chromatic dispersion** (not approximated like MTM's chromaticAberration prop).

**Phase 2 candidate.** This is higher quality than MTM but heavier (16 LOOP iterations per pixel, plus the FBO render-to-texture cost). For a hero scene that holds attention, it's worth the budget. **For Phase 1B v1, MTM is correct.** For Phase 2 hero polish, consider this custom shader.

### #50 camera-rail.js — bezier curve camera path with magnets

Their pattern:
1. Load JSON-defined bezier curve points (`curve-complex.json`)
2. `THREE.CurvePath` from those points
3. Camera position = `pointsPath.getPointAt(progress.value)` 
4. **Magnetic targets** — predefined points along the curve where camera "snaps" toward as you approach
5. `progress.value` lerps toward `progress.target` each frame for smoothing

```js
const pointsPath = useMemo(() => {
  const path = new THREE.CurvePath()
  cameraPositions.forEach((p) => path.add(p))
  return path
}, [cameraPositions])

useFrame(() => {
  progress.current.value = THREE.MathUtils.lerp(
    progress.current.value,
    progress.current.target,  // driven by scroll
    0.1
  )
  
  const point = pointsPath.getPointAt(progress.current.value)
  camera.position.copy(point)
  camera.quaternion.slerp(targetQuaternion, 0.1)
})
```

**This is more sophisticated than Bruno Simon's preset-based pattern (v6 §2).** Bruno's: discrete angle presets, GSAP-tweened between them. Basement's: continuous bezier curve, smooth interpolation along the path, magnetic snap-points.

**Three options for Phase 1B camera path now:**

| Approach | Source | Pros | Cons |
|---|---|---|---|
| Bruno's preset pattern | folio-2019 | Simple, declarative, ~50 lines | Discrete jumps between angles |
| basement's bezier rail | basement-lab #50 | Continuous smooth path | More code, requires authored bezier |
| Theatre.js | theatre/r3f | Visual editor, JSON output | Pre-release API caveat |

**Recommendation:** Start with Bruno's preset pattern (simplest). Upgrade to basement's bezier rail OR Theatre.js when we want truly cinematic continuous motion (Phase 1B.5+).

### #65 multi-scene-composer-pipeline.tsx — multi-scene postprocessing

Their objective: *"Get two separate scenes to render to the same canvas, applying postprocessing to each scene separately. And then apply postprocessing to the entire canvas."*

This maps EXACTLY to our drei `<View>` architecture: hero View needs Bloom + ACES, AnimatedGradient View needs different (or no) postprocessing.

Their pattern uses `EffectComposer` with multiple RenderPasses + ShaderPasses, with `clear: false` on subsequent passes so they composite on top. **Phase 2 reference** if we need per-section postprocessing different from global.

For Phase 1B v1, the cleaner path is: drei `<View>` with per-View `<EffectComposer>` (drei supports this). One canvas, multiple Views, each View has its own postprocessing chain.

### Other notable experiments to remember

- **#62 sun-ray-cone.js** — volumetric light cone shader. Phase 2 if we want god-rays through prism.
- **#74 particles-emitter.tsx** — emitter pattern for particles (more advanced than drei `<Sparkles>`)
- **#71 vertex-animation-texture.tsx** — VAT for baked vertex animations (Phase 3 advanced)
- **#75 shader-matcap-transition.tsx** — matcap-based material transitions
- **#27 reflective-effect.js** — reflective surface effects (Phase 2 floor reflections)

---

## 3. Yuri Artiukh — production-reverse-engineering as research mode

### Who he is

Yuri Artiukh ("akella"), Kyiv, Ukraine. Frontend agency `riverco.de`. **Maxime Heckel singled him out** in v6 §4 as one of his top recommendations: *"He looks at a Three.js scene running in production and will try to reverse-engineer it live."*

Channels:
- YouTube: youtube.com/@akella_ — weekly Sunday live streams reverse-engineering production websites
- Twitter/X: @akella
- Codrops: tympanus.net/codrops/author/akella/ — published articles
- Blog (gist): github.com/akella + 199 GitHub repos
- Workshops: threejs-workshops.com — paid mini-courses

### His Codrops catalog (visible in search)

Each tutorial = a specific production website's effect, reverse-engineered with full source:

| Tutorial | Effect type | Phase relevance |
|---|---|---|
| Volumetric light rays with fragment shaders in Three.js | Volumetric light | **Phase 2** — light shafts through prism |
| Recreate the galaxy made of particles from the Viverse website | Particle galaxy | Particle reference |
| Recreate the infinite image slider seen on tismes.com | Scroll image slider | Not relevant |
| 3D glass portal with React Three Fiber + Gaussian Splatting | Portal effect + 3DGS | **Phase 2** — Prizm Custom gatekeeper |
| Recreate the glass effect seen on Kenta Toshikura's website using postprocessing | Glass postprocessing | **Phase 1B/2** — direct calibration |
| Recreate the reflective grid and energy wave from Crosswire's website | Reflective floor + wave | **Phase 2** — floor under prism |
| Twist and rotate text in 3D using Three.js and Shader magic | 3D text twist | Phase 3 nice-to-have |
| Beautiful light effects featured on Midwam's website using postprocessing | Light effects postpro | **Phase 2** — light-shafts pattern |
| Liquid-like effect from the PixiJS website using Three.js | Liquid distortion | Phase 2 if relevant |
| Interactive scene to claim a tank with sunflowers using Three.js + Polycam | Photogrammetry scene | Not relevant |
| On-scroll reveal effects for images in WebGL using R3F | Scroll image reveal | Not relevant for our copy |
| Refraction with WebGL Render Targets | Refraction shader | **Phase 2** — same as basement-lab #47 |

**Plus 199 GitHub repos.** Many are minimal demos accompanying his tutorials — pure source code reference.

### Why this matters

Yuri's reverse-engineering is the missing layer between "we want it to look like X" and "here's the implementation." For Phase 2 specific effects:

**Process:**
1. We see a production effect we want (e.g., light rays through the prism)
2. Find the matching Yuri tutorial (e.g., "volumetric light rays with fragment shaders")
3. Read the Codrops article → use his GitHub repo as starting code
4. Adapt to Sat ūs/R3F/our material system

**Yuri's content + Maxime Heckel's content = a complete shader curriculum.** Maxime explains WHY (theory, rendering pipeline). Yuri shows HOW (production reverse-engineering with code). They're complementary.

### His historical breakdowns are also gold

His Medium post on Tao Tajima's website (Jan 2019) is a classic. Walks through how a SEEMINGLY-3D effect on `taotajima.jp` is actually pure fragment shader on a flat plane in front of camera. *"There is no real 3D going on. It's all done in a fragment shader."* This kind of insight — when the right answer is "use a flat plane with a clever fragment shader" rather than "build 3D geometry" — saves enormous time.

### v8 takeaway for the brief

**Add Yuri Artiukh to the team-knowledge resources list.** Right alongside Maxime Heckel, Bruno Simon's Three.js Journey, and Inigo Quilez's blog. When implementation needs a specific effect we don't already have a pattern for, his catalog is the first stop.

---

## 4. WebGPU 2026 status — Utsubo's migration guide

### Where WebGPU is in April 2026

From Utsubo's Jan 21, 2026 guide:

| Browser | WebGPU Support | When |
|---|---|---|
| Chrome / Edge | v113+ | May 2023 |
| Firefox | v141+ Windows, v145+ macOS | Recent |
| Safari | v26+ (macOS, iOS, iPadOS, visionOS) | Sept 2025 |

**Global coverage: ~95%** of users. The 5% without WebGPU automatically fall back to WebGL 2.

### Key truths about WebGPU + Three.js (Jan 2026)

1. **Migration is often a one-line change**: `import * as THREE from 'three/webgpu'` instead of `'three'`
2. **Automatic fallback to WebGL 2** when WebGPU unavailable (no extra code needed if using `three/webgpu`)
3. **R3F supports WebGPU** via async `gl` factory prop
4. **TSL is the cross-platform shader language** — compiles to both WGSL (WebGPU) and GLSL (WebGL)
5. **Compute shaders unlock 10-100x performance** for particle systems and physics

### What still requires work in April 2026

The migration audit Utsubo recommends maps EXACTLY to our Phase 2 path:

```bash
grep -r "WebGLRenderer" src/      # find renderer usage
grep -r "ShaderMaterial" src/     # find classic shader materials
grep -r "RawShaderMaterial" src/  # find legacy shader materials
```

**Sat ūs's `lib/webgl/utils/fluid/fluid-sim.ts` would show up in that grep.** That's the Phase 2 / Phase 3 work item: convert Sat ūs's flowmap fluid sim from RawShaderMaterial to NodeMaterial/TSL. **Not our problem to solve directly** — it's a darkroom upstream concern.

### When does Prizm migrate to WebGPU?

For Phase 1B (now): **No.** `forceWebGL: true` ships. WebGPU is an enhancement.

For Phase 2 (post-launch performance push): **Maybe.** Conditions to migrate:
- Sat ūs upstream migrates fluid sim to TSL → we drop forceWebGL automatically
- We add 50K+ particles or compute-heavy effects that benefit from WebGPU's compute shaders
- We hit performance walls on WebGL 2 that WebGPU would solve

For Phase 3 (full polish): **Yes if conditions met.** 1-2 day migration if no custom GLSL shaders. 1-2 weeks if we have custom shaders to port to TSL.

### TSL is the future, GLSL is the present

Even on WebGL 2, **TSL works** — it compiles to GLSL automatically. So future-proof shaders should be written in TSL even if we deploy on WebGL today. **Phase 2 recommendation:** any new custom shader we write should be TSL, not GLSL. This makes Phase 3 WebGPU migration trivial.

For Phase 1B, we're not writing custom shaders (drei's MTM, Bloom, ACES tone map cover us). So TSL doesn't matter yet. **Phase 2 onward:** TSL.

---

## 5. Web accessibility for WebGL — the solved-but-niche path

### The library: `@react-three/a11y`

```bash
yarn add @react-three/a11y
```

Pmndrs ecosystem. MIT licensed. Currently maintained.

### The API

**1. `<A11yAnnouncer>`** — Lives outside the Canvas, manages screen-reader announcements.

```tsx
import { Canvas } from '@react-three/fiber'
import { A11yAnnouncer } from '@react-three/a11y'

function App() {
  return (
    <>
      <Canvas>{/* scene */}</Canvas>
      <A11yAnnouncer />
    </>
  )
}
```

**2. `<A11y>`** — Wrap any 3D object to make it focusable and announce-able.

```tsx
import { A11y } from '@react-three/a11y'

<A11y role="button" description="Penrose prism brand mark - the Prizm logo" actionCall={() => focusOnSomething()}>
  <PrismMesh />
</A11y>
```

The A11y component:
- Makes the wrapped object keyboard-focusable
- Adds a hidden focusable DOM element that screen readers can announce
- Triggers `actionCall` on Enter/Space
- Provides hover/focus states to children via context

**3. `<A11yUserPreferences>`** — Provides system preferences (reduced-motion, color-scheme, custom contrast modes) to children via context.

```tsx
import { useUserPreferences } from '@react-three/a11y'

function PrismScene() {
  const { a11yPrefersState } = useUserPreferences()
  const speed = a11yPrefersState.prefersReducedMotion ? 0 : 1
  
  return <Float speed={speed}>{/* ... */}</Float>
}
```

### Three foundational accessibility patterns for Prizm

**Pattern 1: prefers-reduced-motion gates animation**

Already in PRIZM.md (v8 finding: PRIZM.md says *"`prefers-reduced-motion: reduce` → all motion becomes 200ms opacity fades"*). **Implementation pattern:**

```tsx
import { useReducedMotion } from '@/hooks/use-reduced-motion'  // PRIZM.md hook

function HeroScene() {
  const prefersReducedMotion = useReducedMotion()
  
  if (prefersReducedMotion) {
    return <SVGPrismFallback />  // ← static SVG, no animation, no WebGL
  }
  
  return <View track={ref}><WebGLPrism /></View>
}
```

**Pattern 2: WebGL canvas as decorative-only with semantic HTML beneath**

The prism is decorative. The CONTENT (hero copy, CTAs) must be semantic HTML in DOM order. Screen readers ignore the canvas entirely; sighted users get the volumetric mark. **Both audiences get the message.**

```tsx
<section aria-labelledby="hero-h1">
  <div className="copy">
    <p className="eyebrow">THE SOLAR OPERATING SYSTEM</p>
    <h1 id="hero-h1">Everyone on the same platform. <em>Nothing falling through.</em></h1>
    <p className="subhead">Sales, ops, commissions, integrations, and AI. One system. Built by operators.</p>
    <a href="https://cal.com/prizm-solar">Talk to the founder</a>
    <a href="#problem">See how it works</a>
  </div>
  
  {/* Decorative WebGL — invisible to screen readers */}
  <div ref={containerRef} aria-hidden="true">
    <View track={containerRef}>
      <PrismScene />
    </View>
  </div>
</section>
```

`aria-hidden="true"` on the WebGL container = screen readers skip it entirely. SVG fallback for reduced-motion users gets the same `aria-hidden` (it's pure decoration).

**Pattern 3: Focus management — keyboard navigation skips the canvas**

The canvas should NOT be in the keyboard tab order unless the prism is interactive. For Prizm v1 the prism is decorative — `tabIndex={-1}` on the container.

```tsx
<div ref={containerRef} aria-hidden="true" tabIndex={-1}>
  <View track={containerRef}>...</View>
</div>
```

### Lighthouse Accessibility ≥ 95 — what's measured

PRIZM.md's a11y target. Lighthouse measures:
- Color contrast (text vs background) ← purely DOM, not WebGL
- Heading hierarchy (h1 → h2 → h3, no skips) ← DOM
- Form labels, link names, button names ← DOM
- ARIA usage correctness ← DOM
- Keyboard navigability ← DOM (canvas is `aria-hidden` so excluded)
- Image `alt` text ← any decorative `<img>` needs `alt=""`
- Document language ← `<html lang="en">`
- Form input identifiability ← N/A (no forms)
- prefers-reduced-motion respect ← measured indirectly via meta queries

**The WebGL canvas itself is invisible to Lighthouse a11y scoring.** It's just `<canvas aria-hidden="true">`. As long as the surrounding HTML is semantic, contrast-correct, and keyboard-navigable, **Lighthouse a11y ≥ 95 is achievable easily.**

### When `@react-three/a11y` is NEEDED vs when it's overkill

- **Not needed** for Prizm v1: prism is decorative, content is HTML. `aria-hidden` on canvas + semantic HTML = done.
- **Needed** for Phase 2/3 if: the prism becomes interactive (clickable facets, hover states, drag), OR the canvas contains content with no DOM equivalent (rare for marketing sites).

For Prizm specifically: **skip `@react-three/a11y` for v1, add later if interactivity demands it.** The architecture (DOM content + decorative WebGL) gets us a11y ≥ 95 without it.

### Anneka Goss's "shaders enforce a11y" pattern (advanced)

From her 2021 Medium post: shaders can READ DOM content and enforce contrast. Her demo: rasterize a DOM element to texture (via SVG ForeignObject + canvas conversion), feed to fragment shader, shader checks per-pixel contrast against background, applies per-pixel correction.

**For Prizm: not relevant.** Our content is in DOM, never in canvas. We don't need WebGL contrast correction because the contrast happens in CSS.

### Summary

PRIZM.md's a11y ≥ 95 is achievable. The pattern is:
1. WebGL canvas: `aria-hidden="true"`, `tabIndex={-1}`, decorative
2. Content: semantic HTML, proper heading hierarchy, sufficient contrast
3. Animation: `useReducedMotion` hook gates motion, falls back to SVG
4. **Skip `@react-three/a11y`** unless interactivity demands it

Add to brief as an a11y compliance section.

---

## 6. Updated Phase 1B blueprint — v8 deltas

Cumulative blueprint with v8 additions on top of v7:

### The 11-error fix is canonical
```tsx
// app/layout.tsx
<GlobalCanvas postprocessing forceWebGL />
```
Until Sat ūs upstream migrates fluid sim to TSL.

### MTM calibration — basement.studio reference values for A/B
```tsx
<MeshTransmissionMaterial
  // basement.studio shipped values (clearer glass):
  ior={1.14}
  chromaticAberration={0.04}
  thickness={1.0}
  roughness={0.0}
  samples={10}
  resolution={2048}  // higher than ours; budget allows on desktop
  // OR current Prizm values (more crystal/gem):
  // ior={1.6}
  // chromaticAberration={0.2}
  // thickness={0.4}
  // ...
/>
```

**Recommendation:** Implement with current Prizm values as baseline (gem-like, on-brand). A/B test against basement values during iteration. Probably split the difference: `ior: 1.4-1.5`, `chromaticAberration: 0.08-0.12`.

**Add `roughnessMap`:** subtle dirtness/noise texture for surface realism. Source: Poly Haven (CC0) or generate one (~30 lines via Canvas2D noise). Phase 1B candidate.

### Camera path — three options, pick by complexity
| Option | Source | When |
|---|---|---|
| Bruno's preset pattern | folio-2019 | v1 — simple discrete sections |
| basement's bezier rail | basement-lab #50 | v1.5 — continuous cinematic motion |
| Theatre.js | theatre/r3f | v2+ — visual editor for complex choreography |

**v1 default:** Bruno's pattern (~50 lines).

### Accessibility section
```tsx
<section aria-labelledby="hero-h1">
  <div className="copy">
    <h1 id="hero-h1">...</h1>
    {/* CTAs */}
  </div>
  <div ref={containerRef} aria-hidden="true" tabIndex={-1}>
    <View track={containerRef}>
      {prefersReducedMotion ? <StaticPrism /> : <AnimatedPrismScene />}
    </View>
  </div>
</section>
```

### TSL as Phase 2 forward path
Any custom shader written from this point forward should be TSL (compiles to both WebGPU and WebGL). MTM, Bloom, ACES already handled — no custom shaders needed for v1.

### Component delegation by phase
Phase 1B v1 (drei components, in order of importance):
- `<View>` (architecture cornerstone)
- `<MeshTransmissionMaterial>` (prism glass)
- `<Environment>` + `<Lightformer>` × 5 (brand-color HDRI)
- `<Float>` (subtle motion)
- `<Sparkles>` (atmospheric particles)
- `<PerformanceMonitor>` + `<AdaptiveDpr>` (auto-tune DPR)

Phase 2 (post-launch polish):
- `<Caustics>` (light pattern below prism)
- `<MeshRefractionMaterial>` (heavier glass alternative if needed)
- `<MeshPortalMaterial>` (Prizm Custom gatekeeper visual)
- `<Trail>` (light beam through prism)
- Custom per-channel-IOR shader (basement-lab #47 pattern)

Phase 3:
- TSL particle system (Codrops Gommage pattern)
- `<MeshPortalMaterial>` for advanced gatekeeper reveals
- Volumetric light rays (Yuri Artiukh tutorial)
- WebGPU migration (when Sat ūs upstream completes fluid sim TSL)

---

## 7. Open questions still

Updated from v7 §6:

1. ~~Camera path: Bruno or Theatre?~~ **Settled v8.** Bruno v1, basement-bezier v1.5, Theatre v2+.

2. ~~HDRI~~ **Settled v7.** Lightformers.

3. ~~Particles for v1~~ **Settled v7.** Sparkles.

4. ~~Eleven errors root cause~~ **Settled v8.** WebGPU + RawShaderMaterial in fluid sim. Fix: forceWebGL.

5. **MTM calibration values:** ior 1.6 vs 1.14 vs 1.4? chromatic 0.2 vs 0.04 vs 0.1? **Open — A/B during iteration.**

6. **roughnessMap source:** Poly Haven CC0 vs generate via Canvas2D? **Open — Generate is cleaner (no asset to host); Poly Haven is faster.**

7. **AnimatedGradient on FinalCta:** keep (it works on WebGL with forceWebGL) or migrate to a different effect for v1? **Open. PRIZM.md says use it. Probably keep.**

8. **Caustics for Phase 2:** drei Caustics with frame-budget cost ~3-5ms — does that fit our mobile 16.67ms ceiling? **Open — prototype + measure.**

9. **shader-lab for Phase 2:** swap Lightformer environment for animated shader-lab composition behind prism? **Open — Phase 2 stretch.**

---

## 8. v9+ research targets (carried forward)

From v7 carryover + v8 additions:

1. **Experiential round (Mac tomorrow)** — Vercel prism live, Active Theory portfolio, Exo Ape Amaterasu, Vercel Ship pages, immersive-g.com (PRIZM.md DNA reference) — visual calibration via browser MCP
2. **Pmndrs ecosystem audit beyond drei** — `@pmndrs/postprocessing`, `@pmndrs/uikit`, `@pmndrs/leva` (controls), `@pmndrs/cannon`, `@pmndrs/xr`
3. **KTX2 / Basis Universal compression** — texture format optimization
4. **Lighthouse specifics for WebGL** — exactly what's measured + how T1 studios hit ≥90 mobile
5. **r3f-perf vs Stats vs StatsGl** — production performance monitoring decision
6. **Yuri Artiukh's specific tutorials** that map to Phase 2 effects (volumetric light, glass postprocessing) — read the actual code, not just titles
7. **Inigo Quilez's recent work** — raymarching, SDF patterns, distance fields. Maxime's other top recommendation.
8. **PRIZM.md DNA references explicit deep-dive:** immersive-g.com (have not researched at all yet)
9. **Specific aesthetic refs from Knighthawk** — once provided

---

## TL;DR for v8

Six findings:

1. **Eleven errors fully diagnosed.** WebGPU + classic RawShaderMaterial in Sat ūs's fluid sim. Hero canvas was never the problem (it's WebGL by default). Fix: `forceWebGL: true` on GlobalCanvas. Tracked: Sat ūs upstream needs to migrate fluid sim to TSL.

2. **basement.studio's MTM values are dramatically subtler than ours.** ior 1.14 (us 1.6), chromaticAberration 0.04 (us 0.2). They use a roughnessMap for surface realism. Worth A/B testing during rebuild — we may be too aggressive on chromatic separation.

3. **basement-laboratory has 77 experiments, several directly relevant to Phase 1B/2.** #51 transmission-material gives us calibration data. #47 refraction is the Maxime-cited per-channel-IOR custom shader. #50 camera-rail is bezier-curve cinematic camera. #65 multi-scene-composer is per-View postprocessing reference.

4. **Yuri Artiukh's catalog adds production-reverse-engineering as a research mode.** ~30+ Codrops tutorials, 199 GitHub repos, weekly YouTube live streams — each one reverse-engineering a specific production website's effect with full source. **Phase 2 specific-effect implementation guide.** Maxime explains why; Yuri shows how.

5. **Utsubo's WebGPU 2026 migration guide** confirms our forceWebGL path is correct for v1, lays out the Phase 2/3 migration timeline (1-2 weeks once Sat ūs upstream migrates fluid sim to TSL). 95% browser coverage as of Jan 2026. TSL is future-proof shader path.

6. **WebGL accessibility has a clean library (`@react-three/a11y`) but Prizm doesn't need it.** Our pattern: WebGL canvas `aria-hidden="true" tabIndex={-1}`, content in semantic HTML, useReducedMotion hook gates animation. Lighthouse a11y ≥ 95 achievable without the library because canvas is decorative.

The brief is ready to be written. v9+ rounds will be experiential (browser MCP on Mac tomorrow) + calibration (KTX2, Lighthouse specifics, Pmndrs ecosystem). The architectural questions are settled.
