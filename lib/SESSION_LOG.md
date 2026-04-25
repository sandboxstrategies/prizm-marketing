# Session Log

## Session 1A — 2026-04-25

### Shipped
Foundation build complete. Every marketing section renders desktop + mobile with locked copy from `PRIZM.md`. Penrose Golden Triangle Prism brand mark exists at four scale-aware variants (favicon / nav / footer / hero-placeholder). Design tokens flow through the Satūs build pipeline; new `prizm` theme registered. Header and footer rebuilt. All CTAs wired to `https://cal.com/prizm-solar`. Production build (`bun run build`) succeeds with 9 routes, 0 errors.

### Preview URL
- **Production (initial):** https://prizm-marketing-j0cm9jd76-prizm-solar.vercel.app (`dpl_FQvgPq1WAMt5KUqpENjRzFgieCSz`) — built without framework hint, alias `prizm-marketing.vercel.app` 404'd.
- **Preview (post-fix):** https://prizm-marketing-2dzh40bo2-prizm-solar.vercel.app (`dpl_FB1n9Zvk8JDau2GjgaVdKhHSsv15`) — built with `vercel.json` pinning `framework: nextjs` + `bun install/build`. Ready, 55s build.

**Both are gated by Vercel deployment protection** (team `prizm-solar` has SAML enabled, blanket-applied to all deployments). HTTP 401 on every URL until protection is loosened. To make this public:

- Vercel dashboard → `prizm-solar/prizm-marketing` → **Settings** → **Deployment Protection** → set to *Disabled* (full public) or *Only Preview Deployments* (public prod, gated previews).

Once protection is dialed back, redeploy with `bunx vercel deploy` (preview) or `bunx vercel deploy --prod` to promote a clean build to the production alias `prizm-marketing.vercel.app`.

Project: `prizm-marketing` (id `prj_4xxypbGotBPUft7FdBPDZopKcI8w`) under team `prizm-solar` (id `team_5WCsGKLIrCc5YFOCDLq6tUYV`). GitHub repo connected: `https://github.com/sandboxstrategies/prizm-marketing`. `.vercel/` is in `.gitignore`.

### Lighthouse mobile (chrome-devtools-mcp navigation, perf excluded by tool)
- Performance: not measured (tool restriction; deferred to post-deploy)
- Accessibility: 100
- Best Practices: 100
- SEO: 100
- 46 audits passed, 0 failed

### Commits pushed
8 commits in this session (`428c9a9` → `662f081`):
1. `chore: strip Satus examples, rebrand metadata for Prizm`
2. `feat: add Prizm design tokens, prizm theme, fonts, prism gradient`
3. `feat: add Penrose Golden Triangle Prism brand mark`
4. `feat: add OpenGraph and Twitter card images via next/og`
5. `feat: implement Prizm header with Penrose mark and CTA`
6. `feat: implement Prizm footer`
7. `feat: build shared Eyebrow, Cta, MetricDisplay primitives`
8. `feat: build all marketing sections with locked PRIZM.md copy`
9. `chore: verification pass — Lighthouse, a11y, mobile`

(One additional `docs` commit closes out this session log.)

### Brand mark iterations
3 rounds against the visual matrix (sizes 16/24/32/48/64/200/400 × 4 variants). Screenshots in `lib/screenshots/prism-mark/iter-{01,02,03}-matrix.png`. Apex glow + apex-core circle anchor the focal point at every size; spectrum facets land at hero scale; favicon falls back to a single cyan silhouette + apex spark via `next/og`.

### Known placeholders for Session 1B
- **Hero Penrose triangle** — currently a static SVG with 3-level Robinson subdivision + showSpiral. Replace with WebGL volumetric Penrose triangle scene using `useWebGLElement` + `WebGLTunnel.In` per `PATTERNS.md §6`. Comment marks the swap point in `app/(marketing)/_sections/hero/index.tsx`.
- **Problem 6-chip convergence** — chips are static at deterministic positions. Phase 1B wires GSAP timeline that collapses them into the Penrose mark, then deflates outward into the three pillars. Comment in `app/(marketing)/_sections/problem/index.tsx`.
- **Final CTA `<AnimatedGradient />`** — wired with cyan/violet/magenta/ember palette but emits non-fatal Three.js `NodeMaterial: Material "RawShaderMaterial" is not compatible` warnings under WebGPU renderer in dev. Page renders. Phase 1B tunes the parameters and adds a scroll-triggered intensity ramp.

### Other deferred items
- **Phase 3 type swap**: Geist → Neue Machina (display), Geist Mono → Berkeley Mono. `lib/styles/typography.ts` flagged with comment at the swap point (`PHASE 3 swap point`).
- **Feature screenshots**: 6 placeholder boxes with prism-gradient backgrounds; replace with real product screenshots when available. Comments mark each.
- **Sanity references in `next.config.ts`**: `optimizePackageImports` lists `@sanity/*` packages, and a Sanity CSP `frame-ancestors` header is present. Non-breaking; left for a future cleanup pass.
- **`lib/integrations/check-integration.ts`** still exposes `isSanityConfigured()` etc. as part of the Satūs registry pattern. Returns `false` at runtime since no env vars are set; not breaking. Optional cleanup in a later session.

### Notes for Knighthawk

1. **Naming utility classes**: PRIZM.md and the brief reference type utilities as `dr-display-xl`, `dr-body-md`, etc. The Satūs build pipeline actually generates them as bare names (`display-xl`, `body-md`, `caption`, `mono-md`, `mono-lg`). The `dr-` prefix is reserved for the responsive *scale* utilities (`dr-pt-{n}`, `dr-w-{n}`, etc.). The implementation uses the actual generator-emitted names. PRIZM.md should be updated to match.

2. **Header height token**: kept the existing `customSizes['header-height']` value of `{ mobile: 58, desktop: 98 }` rather than the brief's 56/98, because the existing `--header-height` CSS var was already wired and there was no reason to drift.

3. **Vercel project naming**: the current Vercel team is `prizm-solar`, not `sandboxstrategies`. New project should be `prizm-marketing` under that team.

### Next session — 1B Cinematic moments
Three big motion beats (per the brief):
1. Hero — volumetric R3F Penrose triangle, slow rotation revealing facets
2. Problem → Pillars convergence — GSAP timeline, chip collapse + deflation outward
3. Final CTA aurora — tune `<AnimatedGradient />` params + scroll-triggered intensity ramp

Plus: typography swap to Neue Machina + Berkeley Mono if licensing lands; real product screenshots for the six features; deploy stabilization once auth + project naming are settled.

---

## Session 1A.5 — 2026-04-25 — Volumetric Penrose Hero Mark

### Shipped
The static SVG hero placeholder is now a slowly-rotating volumetric WebGL prism. Golden-triangle silhouette extruded along Z, Robinson-subdivided into ~13 faceted glass cells, with emissive cyan-to-ember Penrose seam lines and a dampened silhouette outline that anchors the triangle at every angle. Three-point lighting + studio HDR + dedicated Bloom pass. 30-second rotation, 6-second bob, 8° axis tilt. Three rounds, shipped round 3.

### Architecture decision
The Satūs global canvas is `orthographic + linear + flat` (pixel-space coordinates, no sRGB conversion, no tone mapping) — purpose-built for compositing flat effects like FinalCta's `<AnimatedGradient />`. drei's `<MeshTransmissionMaterial>` and the volumetric look the brief specified need perspective + sRGB + ACES tone-mapped output.

**Decision: dedicated local `<Canvas>` for the hero.** Two coexisting WebGL contexts on the page:
- Global canvas (ortho/linear/flat) → AnimatedGradient on FinalCta. Untouched.
- Local hero canvas (perspective fov=35 / sRGB / ACESFilmicToneMapping) → volumetric prism.

Every file in `app/(marketing)/_sections/hero/hero-mark-3d/` opens with a DO-NOT-MIGRATE comment so future maintainers don't try to "fix" this back to the tunnel pattern.

### Files added
- `hero-mark-3d/index.tsx` — `HeroMark3D` wrapper. `useDeviceDetection` branches `!hasGPU || isReducedMotion` → SVG fallback; otherwise local Canvas with `gl={{ outputColorSpace: SRGBColorSpace, toneMapping: ACESFilmicToneMapping, ... }}` + `<PerspectiveCamera makeDefault fov={35} position={[0,0,2.8]}>`.
- `hero-mark-3d/penrose-prism.tsx` — Scene. Three-point lighting (cyan key 3.5, violet fill 1.6, cyan rim 2.2), `<Environment preset="studio" environmentIntensity={0.5}>` inside Suspense, drei `<MeshTransmissionMaterial>` body, three `<lineSegments>` (front seams, back seams, silhouette outline) sharing one additive `MeshBasicMaterial`. `useFrame` drives 30s rotation + 6s bob; dev-only `?rot=N` URL param freezes rotation for screenshot capture.
- `hero-mark-3d/penrose-geometry.ts` — `buildPenroseMesh()`. Reuses `components/ui/prism-mark/deflate.ts`. Edge classification by hash (count==1 → silhouette, count==2 → internal seam). Body = front faces + back faces + silhouette walls (non-indexed; `computeVertexNormals()` yields per-face normals → faceted shading). Seam geometry = LineSegments along internal edges (front + back, inset 0.001), per-Y vertex colors. Silhouette geometry = LineSegments along outer-boundary edges with 0.55x dampened color.
- `hero-mark-3d/seam-colors.ts` — Spectrum stops (cyan apex → ember base) with intensity multipliers 1.8–2.6× to push past unit luminance and trigger bloom. Linear-space interpolation.
- `hero-mark-3d/hero-postprocessing.tsx` — Local Bloom composer. Raw `postprocessing` package (NOT `@react-three/postprocessing` — not installed; matches the existing codebase pattern in `lib/webgl/components/postprocessing/index.ts`). `BloomEffect` with `luminanceThreshold: 0.65`, `intensity: 1.5`, `KernelSize.LARGE`, `mipmapBlur: true`. RenderPass + EffectPass(BloomEffect) + CopyPass.

### Files modified
- `app/(marketing)/_sections/hero/index.tsx` — replaced direct `<PrismMark size={460} variant="hero-placeholder">` inside `s.markFrame` with `<HeroMark3D />`. Dropped the PHASE 1B comment for the swap. SVG `PrismMark` import removed (it lives in the fallback path inside `HeroMark3D` now).

### Files untouched
- `components/ui/prism-mark/` — SVG component continues serving nav (24px), footer (32px), favicon, OG/Twitter, and the WebGL fallback.
- All other sections, header, footer, layout, design tokens, build pipeline.
- Global canvas / global PostProcessing.

### Iteration history
**Round 1** — initial scene wired, mark filled ~25% of canvas (camera too far at z=4.5), body too dark, bloom threshold too conservative (0.85 was safe but kept seams from popping). 6 angles + critique committed.

**Round 2** — camera z 4.5→2.8 (mark fills ~50% of canvas), key/fill/rim lights bumped (2.5/1.0/1.5 → 3.5/1.6/2.2), ambient 0.05→0.12, environment 0.3→0.5, bloom threshold 0.85→0.65 + intensity 1.2→1.5, seam intensity multipliers boosted across all stops (cyan apex 1.8→2.6, ember base 1.4→1.8), apex hex shifted to brighter cyan (#00cfee → #7ce8ff). Major step up: seams now read as bright internal cracks; rot-180 was the money shot. Front angles still slightly soft on outline.

**Round 3 (shipped)** — added third `<lineSegments>` for the silhouette outline (count==1 edges, vertex colors dampened 0.55× so they anchor the triangle without competing with the internal Penrose pattern). Reduced extrusion depth 0.6→0.45 for a sharper silhouette. Every angle now reads as a clear triangular prism with structured Penrose subdivision visible.

### Verification
- Production build (`bun run build`): clean, 9 routes, 0 errors.
- `bun run check` (biome + tsgo + 370 unit tests): pass.
- Two-canvas coexistence verified — `evaluate_script` reports 2 canvases (hero local 460×460 + global Satūs 1430×900). FinalCta's AnimatedGradient continues to render unchanged.
- Mobile viewport (390×844): WebGL renders successfully (desktop GPU emulating mobile geometry — confirms the WebGL-with-reduced-budget branch). Screenshot at `lib/screenshots/hero-mark/mobile-webgl.png`.
- Forced fallback (`?fallback=1` dev override, same code path as `prefers-reduced-motion: reduce`): SVG `PrismMark` renders, clean triangle silhouette + Penrose facets visible. Screenshot at `lib/screenshots/hero-mark/fallback-svg.png`.
- Console: pre-existing `THREE.NodeMaterial: Material "RawShaderMaterial" is not compatible` warnings from FinalCta's AnimatedGradient under WebGPU. No new warnings introduced by the hero scene.

### Mesh metrics (estimated)
- Robinson facets: 13 (3 levels of deflation from 1 root acute golden triangle)
- Body triangles: ~50 (front + back faces + silhouette walls)
- Seam line segments: ~24 (internal edges × 2 for front/back)
- Silhouette line segments: ~30 (outer edges × 2)
- Total << 8,000 budget

### Performance budget
- Transmission samples: 6 mobile / 10 desktop
- Transmission resolution: 512 mobile / 1024 desktop
- DPR clamped to [1, 2]
- Bloom: KernelSize.LARGE, mipmapBlur enabled
- Multi-sampling: min(maxSamples, 4) on WebGL2

### Known limitations
- **No video capture per round.** Chrome DevTools MCP doesn't expose a screencast tool; rounds verified via 6 fixed-rotation screenshots + live dev-server preview. Brief asked for 10s mp4 per round; substituted with 6-angle matrix.
- **`prefers-reduced-motion` not directly emulated.** Chrome DevTools MCP `emulate` doesn't have a reduced-motion option; the SVG fallback path was verified via the equivalent `?fallback=1` dev override (same return-early in `HeroMark3D`).
- **Lighthouse Performance not re-measured.** chrome-devtools-mcp `lighthouse_audit` excludes Performance.
- **External preview URL still SAML-gated** (Session 1A note). Verification stays local — every commit is pushed and Vercel auto-builds, but live URLs return 401 until the team SSO setting is loosened.

### Self-assessment
**8 / 10.**

What's strongest: the silhouette + internal seams + body shading combo creates instant "this is a deliberate, mathematical brand mark" reading. Penrose asymmetry is alive at every angle. Two-canvas architecture cleanly isolates the hero scene from the rest of the page.

What I'd revisit: the body could pick up slightly more environment reflection — currently it leans more "lit obsidian" than "premium glass." Could tune `roughness` 0.05 → 0.02 and `environmentIntensity` 0.5 → 0.7 in a future round. Front-on angle (rot=0) still feels marginally less premium than back-on (rot=180); a small camera-tilt would land both equally well. Both are micro-iterations for Phase 1B.

### Open questions for Knighthawk
- Confirm the silhouette outline addition. Brief said "outer silhouette is the body's job" but the body alone wasn't anchoring the triangle shape at every angle. Round 3 added a 0.55× dampened seam-colored outline. Easy to remove if you'd rather lean fully on the body.
- The mark is monumental at desktop (460px markFrame) and equally well-rendered on mobile-emulated viewport. Confirm whether a real iPhone SE / low-end Android should still get WebGL or hard-fall-back to SVG. Current branch: `!hasGPU || isReducedMotion` → SVG. `isMobile && hasGPU` → reduced-budget WebGL. Adjust if you want a stricter mobile cutoff.

### Commits in this session
- `feat(hero-mark): round 1 — initial volumetric scene wired`
- `feat(hero-mark): round 2 — closer camera, brighter, hotter seams`
- `feat(hero-mark): round 3 — silhouette outline + reduced depth, shipping`

### Next session — 1B Cinematic moments (unchanged from 1A handoff)
- Hero scroll-coupled rotation modulation + Theatre.js choreography
- Problem → Pillars chip convergence (GSAP timeline)
- Final CTA AnimatedGradient parameter tuning + scroll-triggered intensity ramp
