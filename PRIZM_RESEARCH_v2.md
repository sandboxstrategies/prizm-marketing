# Prizm Marketing Site — Master Handoff (v2)

**Source chat:** `c92fbb5b-4818-492a-81bf-e15803eb061b`
**Compacted on:** April 25, 2026
**Combines:** conversation extraction + prior agent's design intelligence handoff
**Purpose:** The next agent picks up cold and loses nothing. Paste this in as message 1.

---

## ★ THE SINGLE MOST IMPORTANT FRAME ★

Knighthawk explicitly clarified mid-build: **"This isn't meant to be someone everyone uses. It's for the elite or the few."**

Prizm is gatekept, not mass-market. The site's job is to **filter and qualify**, not convert broad traffic. Operators who want a normal SaaS site should bounce. Operators who go *"holy shit, who built this?"* should book the call.

Every other decision flows from this. If the next agent reads only one line of this document, it's that one.

What it means concretely:
- Don't optimize for the median visitor. Optimize for the visitor who'd be impressed by activetheory.net.
- Time spent reading > clicks. A site slow to absorb but high-conviction beats a site that's fast and forgettable.
- The hero is a filter, not a funnel. It communicates "we are serious people who don't make compromises" before any copy is read.
- Restraint over spectacle. Gatekept brands signal through *what they don't do* more than what they do.

---

## 1. Project at a glance

**Prizm** — full-lifecycle solar operating system. First end-to-end platform covering sales, ops, install, funding, service, and customer care. Replaces the 4–6 fragmented tools most installers run today (CRM + proposal tool + finance portals + phone system + payroll spreadsheets). Deep integrations with Palmetto, Albedo, JustCall, Salesforce, Pipe Solar. AI agents, MCP server, constant new feature/integration velocity.

**Repo:** `~/Projects/prizm-marketing` (separate from the product app — do NOT touch the app repo)
**Domain:** prizm.solar
**Vercel project:** `prizm-marketing` under team `prizm-solar` (team_5WCsGKLIrCc5YFOCDLq6tUYV)
**Last known preview URL:** `https://prizm-marketing-85jghteub-prizm-solar.vercel.app/` (stale — see Open Issues)

**Corporate structure (state truthfully):**
- **Sandbox Strategies** — Knighthawk's dev company. Sandbox builds and operates Prizm. Prizm is Sandbox's flagship.
- **Flo Energy Solar** — Knighthawk's solar company, partial owner. Flo runs on Prizm. Proof case, not parent.
- **Knighthawk:** 10+ years operating in solar (sales, ops, permits, install, commissions, finance). Owned a previous solar company before Flo.
- Footer copyright: `© 2026 Sandbox Strategies.`

---

## 2. Positioning & voice

**Core line:** "The best operating system for solar sales and operations. Period."

**Voice:** Operator-confident, Hormozi-coded **without being cringe**. Direct. "Built by an operator who built the thing he wished existed" — not "marketer selling software." No fake urgency. No empty superlatives. Earned through specifics.

**Three pillars:**
1. **Efficiency and automation** — fastest path from contract to commission, machine doing the work
2. **Flexibility and velocity** — integrates with everything, new capabilities ship constantly, never blocked
3. **Built by operators with real solar scar tissue** — every part reflects experience across the lifecycle

**Tier-1 move — Prizm Custom:** dedicated dev capacity through Sandbox Strategies, building to spec for high-value clients. Says "we're not take-it-or-leave-it SaaS, we're the platform AND the engineering team." By invitation. Founder conversation required. No public qualification criteria.

**Single CTA:** "Talk to the founder" → `https://cal.com/prizm-solar`. No pricing. No demo signups. No waitlist.

**Primary buyer:** installer owner/operator. Secondary: ops director, sales manager, individual rep. Copy resonates across all four; primary conversion target is owner/operator.

### Banned vocabulary (locked from PRIZM.md)

unlock, empower, seamless, solution, leverage, robust, game-changing, revolutionize, cutting-edge, best-in-class, holistic, synergize, delight, "blow your mind", "you're welcome", end-to-end, all-in-one, single-source-of-truth.

---

## 3. Locked hero copy (do not paraphrase)

```
Eyebrow:    THE SOLAR OPERATING SYSTEM
H1:         Everyone on the same platform. <em>Nothing falling through.</em>
Subhead:    Sales, ops, commissions, integrations, and AI.
            One system. Built by operators.
Primary CTA:   Talk to the founder → cal.com/prizm-solar
Secondary CTA: See how it works → #problem
Below-fold:    47 days NTP → install. The metric we built Prizm to fix.
```

**Italics on the pivot word** — `<em>Nothing falling through.</em>` — uses Neue Machina Italic (Phase 3) or system italic fallback (current).

---

## 4. Brand mark — the deep research

This was the single most important research in the chat. The thesis. Don't lose it.

### The Penrose discovery chain

Started from Knighthawk's reference image: Penrose impossible triangle (tribar), ember/red glow on internal seams. Initial spec was the volumetric tribar.

Knighthawk surfaced two articles about **Penrose tilings** — distinct concept from the impossible triangle. Roger Penrose invented BOTH:
- **Penrose impossible triangle (1958)** — optical illusion, three bars looping impossibly. Inspired by Escher.
- **Penrose tilings (1974)** — aperiodic tessellations using kite + dart (or two rhombuses) covering an infinite plane without ever repeating, with "forbidden" 5-fold symmetry.

**Critical structural finding:** both are built from **Robinson triangles** — two specific isosceles triangles whose proportions are the **golden ratio**. Kite = two Robinson triangles. Dart = two. Thick rhomb = two. Thin rhomb = two. **Triangle is the atomic unit of both.**

### The killer finding — Penrose patterns are literally used in solar cells

Verifiable peer-reviewed solar science. NOT poetic.
- **2022 Cambridge study** — Penrose-quasi-random nanostructures on ultrathin GaAs solar cells lifted photocurrent **from 16.1 to 25.3 mA/cm² — a 57% improvement** over a planar reference.
- **UNSW Sydney School of Photovoltaic Engineering** — research program on "high-symmetry nano-photonic quasi-crystals providing novel light management in silicon solar cells."
- **Fraunhofer ISE, Cambridge, University of Amsterdam** — multiple groups using Penrose-arranged nanostructures for isotropic light absorption.
- **2011 Nobel Prize in Chemistry** — Dan Shechtman, for discovering quasicrystals (physical Penrose-like atomic arrangements). Nobel committee specifically cited Penrose tiling.

Periodic patterns absorb light only at specific resonant angles. Quasi-periodic Penrose patterns are isotropic — every angle. The brand mark line: *"Our mark uses the same Penrose pattern researchers use to make solar cells absorb 57% more light at every angle. Aperiodic structures handle every angle. Same with our platform."*

### The differentiation finding

Vercel owns "minimalist tech triangle." Equilateral, B/W, no internal detail, "strength/stability/progress." Most-imitated developer brand. **Without Penrose internal structure, Prizm = Vercel clone.** Robinson subdivision + spectrum colors + golden silhouette = differentiation.

### The geometric finding — golden triangle, not equilateral

Golden triangle (36° apex, 72° base, sides in φ:1:1 ratio) is sharper, more prism-like, feels like vertical motion. Equilateral feels static. For Prizm: golden triangle wins. Visually distinct from Vercel.

### Final mark direction (LOCKED)

Hybrid A+B:
- **Silhouette:** golden triangle (36° apex, 72° base)
- **Internal structure:** Robinson triangle subdivision — **3 levels of recursion baked into actual mesh geometry**, not a texture overlay. ~13–17 facets on the front face. Each facet a real 3D triangular plane.
- **Body:** crystalline glass via drei's `MeshTransmissionMaterial` — chromatic aberration, anisotropic blur, can "see" other transmissive objects
- **Internal seams:** separate emissive mesh layer
- **Spectrum:** **cyan apex → ember base** (locked). Cyan = brand primary. Ember at base reads thermally as "energy radiating up" — on-message for solar without being literal.
- **Bloom:** UnrealBloomPass on the seam ONLY (luminanceThreshold so body doesn't bloom)
- **Apex axis-tilt: 8°** — like Earth's tilt. Visual interest at every angle. No symmetric "logo on a turntable."
- **Three render scales:**
  1. Favicon/nav (24–32px) — flat 2D SVG, silhouette + central seam glow (cyan)
  2. Footer (32–48px) — flat 2D SVG with prism-gradient seam
  3. Hero (Phase 1B) — full volumetric WebGL, hand-coded R3F (Spline ruled out)

**The Penrose direction was earned through real strategic work in Phase 0. It ties to "impossibility made real," has narrative depth, is mathematically grounded, is unclaimed in tech branding. Don't trade earned meaning for surface novelty.**

---

## 5. Phase 1B — locked artistic decisions

User said "I like all of your picks." So locked:

### Fork: B (spatial cinematic hero, conventional rest)

- Hero becomes a 3D space the user *enters*, not a 3D logo in a box
- Scrolling moves the camera through the space
- Rest of site (Problem, Pillars, Features, Prizm Custom, Final CTA) stays conventional scrolling marketing
- The Penrose prism is one *object inside* this space, not the whole show

### Visual concept: Light through prism, in motion (Pick A)

The space is what light *becomes* after passing through a prism — refracted, spectrum-split, drifting. The Penrose prism is the source. Particles are photons. Caustics are light patterns the prism casts on invisible surfaces. Stays mathematically true to the "impossibility made real" brand thesis.

**NOT space/galaxy/cosmic.** User suggested it; pushed back; landed on light-through-prism instead. Galaxy is generic-tech-aesthetic and doesn't say anything about Prizm specifically. Light-through-prism IS the Prizm thesis rendered visually.

### User's path: The journey version

Camera starts far from the prism. Distant geometry, particles, fog. Scrolling pulls camera *toward* the prism. Apex moment: arrival at the prism, full presence revealed. Strongest narrative arc for first-time visitors. NOT the "reveal" version (camera starts inside) and NOT the "meditation" version (camera circles).

### Hero scroll length: Medium (~2 viewport heights, ~1600px)

Long enough to feel cinematic, short enough that operators who want to read the page get there. Not short (undersells), not long (overstays).

---

## 6. Materiality — the design north star

The trap: treating "activetheory-tier" as a checklist of techniques (particles, fog, caustics, scroll-coupled camera). That checklist produces AI slop.

What activetheory has is **belief** — the sense that what you're looking at is a real substance obeying physics. Eye believes the scene is a place, not a graphic.

The single highest-leverage word for this project: **MATERIALITY.** Whatever we build feels like it's made of *something*. Not "like glass" — actually behaves like glass. Not "with particles" — particles drifting in an actual medium that has volume.

Current hero fails this test because the body reads as opaque-emissive rather than translucent-with-depth. Eye stops at the surface instead of traveling into the object. **That's the gap to close in Phase 1B.**

---

## 7. Phase 1 failure modes — Knighthawk's verdict was "AI slop in a way"

Specific tells diagnosed and the parameter fixes for Phase 1B:

1. **Body and seams compete for attention.** Both at medium intensity. Neither wins. Premium 3D commits to one focal hierarchy.
2. **Bloom is doing the heavy lifting on "wow."** Mentally turn off bloom — underlying mark isn't strong enough. Bloom masks weakness rather than enhancing strength.
3. **Lighting is generic three-point.** No personality. Could be any logo. Lighting should *say* something — drama, restraint, mystery, precision. Currently just "lit."
4. **Color is overcommitted.** Cyan + violet + ember spectrum + bloom + emissive seams = too many things saying "look here" simultaneously. Premium brands restrict color, not expand.
5. **Body reads as bright-opaque-emissive instead of premium-glass-with-lit-interior.** Eye stops at surface.

**Specific parameter changes for Phase 1B:**
- Bloom intensity 1.2 → 0.7
- Bloom luminanceThreshold 0.7 → 0.85
- Seam emissive multipliers 1.5–2.0 → 1.0–1.2
- Body roughness 0.05 → 0.02
- Body transmission 0.95 → 0.85 (more material presence)
- Add subtle environment rotation so reflection highlights catch the front face at an angle

---

## 8. Architectural decisions (preserve these — hard-won)

### 8.1 Local hero canvas, NOT the Sat ūs global tunnel

Sat ūs global canvas is `orthographic + linear + flat` — purpose-built for fullscreen pixel-coordinated effects like FinalCta's AnimatedGradient. **Wrong** for a 3D prism, which needs `perspective + sRGB + ACESFilmic tone mapping`.

The fix: dedicated `<Canvas>` instance scoped to the hero's `markFrame` div. AnimatedGradient on FinalCta stays in the global canvas via tunnel, unchanged.

```jsx
<Canvas
  gl={{ 
    outputColorSpace: THREE.SRGBColorSpace,
    toneMapping: THREE.ACESFilmicToneMapping,
    toneMappingExposure: 1.0,
    antialias: true,
    alpha: true
  }}
  dpr={[1, 2]}
  camera={false}
>
  <PerspectiveCamera makeDefault fov={35} position={[0, 0, 4.5]} />
  ...
</Canvas>
```

**Header comment in hero scene file MUST explain why this canvas exists separately**, so future maintainers don't try to "fix" it back to the tunnel pattern.

### 8.2 Use raw `postprocessing` lib, NOT `@react-three/postprocessing`

Sat ūs already has a pattern using raw `postprocessing` inside `useFrame` loops (see `lib/webgl/components/postprocessing/index.ts`). Adding `@react-three/postprocessing` would conflict with the "no new deps" rule and create two divergent postprocessing patterns.

### 8.3 SVG fallback gate at the parent level, NEVER inside the WebGL component

If the WebGL component decides internally to fall back, the canvas briefly initializes before fallback kicks in — on low-end Android, that's enough to crash the context.

The gate logic must be in hero section's `index.tsx`:

```tsx
const showWebGLMark = !reducedMotion && gpuTier >= 2 && !lowEndDevice

return (
  <div className={s.markFrame}>
    {showWebGLMark
      ? <HeroMark3D />
      : <PrismMark variant="hero-placeholder" size={460} />
    }
  </div>
)
```

**Acceptance criteria:**
- `prefers-reduced-motion: reduce` → SVG fallback always
- `useDeviceDetection().gpuTier < 2` → SVG fallback
- iPhone SE 2nd gen and equivalent → SVG fallback
- Server-side render → SVG fallback (default during SSR)
- Everything else → WebGL
- `console.warn` once per session on fallback with the reason

---

## 9. Tech stack (locked)

**Framework:** Satūs starter (Sat ūs in some quoted text — same thing). Opinionated Next.js framework, batteries included.

- **Next.js 16** (App Router, RSC where possible)
- **React 19** + **React Compiler** (Sat ūs rule: NO `useMemo`/`useCallback`/`React.memo` — Compiler handles it)
- **Tailwind v4** (CSS-first `@theme` directive, OKLCH colors)
- **Biome** for lint/format
- **Bun** as runtime/package manager
- **R3F** + **drei** + raw **postprocessing** — already installed
- **Theatre.js** — scroll-coupled camera choreography (already installed)
- **GSAP** — non-3D motion (already installed)
- **Tone.js** — available for ambient audio (Phase 1B optional, recommend defer)
- **Geist** font (via next/font) + **Instrument Serif** (display) + **Inter** (body) + **Neue Machina** (Phase 3 italics)
- **Cal.com inline embed** for "Talk to the founder"
- **Deploy:** Vercel (auto-deploys from `main`)

**Sat ūs internals worth knowing:**
- Design tokens generated via `bun run setup:styles` — three generators: `generate-root.ts`, `generate-tailwind.ts`, `generate-scale.ts`
- WebGL utilities live in `lib/webgl/utils/`:
  - `lib/webgl/utils/flowmaps/flowmap-sim.ts` — already shipped flow field simulation. Foundation for particle system in Phase 1B.
  - `lib/webgl/utils/fluid/fluid-sim.ts` — fluid sim. Could drive caustic patterns or volumetric fog.
  - noise utilities, shader fragments
- `lib/webgl/shaders/` — Sat ūs's existing fragment shaders for noise, gradients, post-effects
- `lib/webgl/components/postprocessing/index.ts` — existing raw `postprocessing` pattern. Phase 1B follows this.
- `components/effects/animated-gradient/` — already built and used in FinalCta. Custom material extending MeshBasicMaterial with uniforms — apply same pattern for new custom materials.
- `components/canvas/` — GlobalCanvas tunnel pattern (R3F shared canvas)
- `components/layout/wrapper/index.tsx` — has `webgl` prop that activates GlobalCanvas
- Convention per BOUNDARIES.md: wrap, don't modify core `ui/` primitives

Tailwind v4 / OKLCH is in use for the prism-gradient — interpolates correctly through hue rather than RGB.

---

## 10. Tools, MCPs, skills available — and their assigned jobs

User correctly called out: "Phase 0 became a checkbox instead of a foundation." Toolchain assembled but not integrated into briefs. **Fix this for Phase 1B — toolchain as living spec, every brief checks against it, each tool gets an assigned job.**

### MCPs installed

| MCP | Status | Job |
|---|---|---|
| `Context7` | ✓ | Pull docs proactively in research pass *before* writing code: Sat ūs flowmap utilities, Theatre.js studio API, Lenis, Tempus, R3F r163, drei MeshTransmissionMaterial |
| `chrome-devtools-mcp` | ✓ | Capture perf trace + Lighthouse after every scene change. Block ship if FPS drops below 55 on M1. |
| `Magic (21st.dev)` | ✓ | ONLY for non-WebGL marketing sections (none currently planned for Phase 1B). Do NOT use for spatial scene work. |
| `Vercel` | ✓ | Deploy preview, capture real-user metrics |
| `claude-mem` | ✓ | Write structured session memories at end of each Claude Code session |
| `playwright` | ✓ | Visual regression — keep on |
| `figma` | auth pending | Not blocking |
| `github` | failed auth | Fix via PAT in `~/.mcp.json` under `github` entry's `env.GITHUB_PERSONAL_ACCESS_TOKEN`. Token scope: repo `sandboxstrategies/prizm-marketing`, perms: Contents/PRs/Issues read+write, Metadata read. Or skip — nice-to-have not blocking. |
| `commit-commands` | ✓ | Git workflow |

### Skills loaded (user-installed, Claude Code references)

- `r3f-best-practices` — *teaches `setState` in `useFrame` is the bug-killing rule*
- `core-3d-animation:react-three-fiber`
- `core-3d-animation:threejs-webgl`
- `core-3d-animation:gsap-scrolltrigger`
- `frontend-design` — for non-WebGL section refinement (deduplicate: keep `claude-plugins-official` version, disable `claude-code-plugins` version)
- `superpowers:executing-plans`
- `superpowers:verification-before-completion`

### Claude (this side, not Claude Code)

- `web_search`, `web_fetch` — used heavily for Penrose research; Phase 1B research pass should use them on activetheory.net rendered code, Maxime Heckel caustic posts, Bruno Simon flow field tutorials, Codrops volumetric fog
- Extended thinking via "Ultra plan" — use for architectural design pass before any code

---

## 11. Visual system

**Dark-only. No light mode. No theme toggle.**

| Token | Hex | Use |
|---|---|---|
| `bg-base` (`surface-base`) | `#0A0B14` | page background — near-black midnight |
| `bg-elevated` (`surface-raised`) | `#12141F` | cards, elevated surfaces |
| `surface-void` | (deeper than base) | Prizm Custom section bg |
| `border-subtle` (`surface-line`) | `rgba(255,255,255,0.06)` | hairlines, dividers |
| `text-primary` | `#F5F5F7` | headlines |
| `text-secondary` | `#8A8D9A` | body |
| `cobalt` | `#2B4AFF` | primary brand, gradient anchor |
| `indigo` | `#5B3FD9` | secondary brand, gradient anchor |
| `midnight` | `#1A1B3A` | deep brand surface |
| `ember` | `#E8A849` | accent ONLY — CTAs, $ figures, highlight lines. Use sparingly. |
| `cyan` (brand-strong) | `#00cfee` | apex of mark, seam glow at small sizes |

`--prism-gradient`: cyan → cobalt → violet → magenta → ember (used in seam at hero scale, in 1px borders for Prizm Custom block, in footer mark seam)

Editorial restraint > maximalist clutter. Operator credibility > designy choice. Fewer words; re-read every line and cut a word.

---

## 12. Site structure

Single-page site, 7 sections. Final copy in `lib/copy.ts` and `PRIZM.md`.

1. **Hero** — Prism mark + locked headline. Currently static SVG `PrismMark` placeholder. Phase 1B replaces with WebGL volumetric scene.
2. **Problem** — "You run six tools to move a kilowatt." 6-chip convergence animation (CRM, Proposal, Funding, Voice, Payroll, Integrator) — chips converge to center, refract into Prizm mark. Currently static; needs GSAP timeline.
3. **Pillars** — three cards (one source of truth / efficiency / flexibility).
4. **Features (six blocks)** — reusable `FeatureBlock`. AI agents/MCP, commission tracking, first-sync-only integrations model, mobile field crew, end-to-end coverage, custom-tailoring, automation rules, customer care/service. Some marked "coming."
5. **Prizm Custom** — gatekept tier callout. Slightly darker bg, 1px gradient border using `--prism-gradient`. CTA: "Talk to the founder". Subtext: "By invitation. Founder conversation required."
6. **Final CTA** — "The solar operating system. Period." → cal.com. Subtext: "30 minutes with Knighthawk. No decks. No demos you've seen before." Uses existing `AnimatedGradient`.
7. **Footer** — Prism mark (32px, prism-gradient seam) + "Prizm" wordmark, "Talk to the founder" link, "© 2026 Sandbox Strategies", "Built by operators." (mono).

---

## 13. Performance budget — non-negotiable

90% of traffic is mobile. Constraint everything else bends around.

| Constraint | Target |
|---|---|
| Total scene polys | < 8,000 triangles |
| Particle count | < 2,000 mobile / < 5,000 desktop |
| Transmission samples | 6 mobile / 10 desktop |
| Bloom render scale | 256px mobile / 512px desktop |
| Pixel ratio cap | 2.0 |
| Target framerate | 60fps iPhone 14 / desktop. 30fps min on low-end Android. |
| LCP impact | Hero text/CTA must render BEFORE WebGL scene loads. Defer the canvas. |
| iPhone SE 2nd gen | Goal: WebGL plays smoothly. Fallback: SVG if not. |
| LCP overall | ≤1.5s on 4G mobile |
| CLS | 0 |
| Total page weight | ≤1.2 MB excl. fonts (~150 KB) |
| Lighthouse mobile mins | Performance ≥90, A11y ≥95, BP ≥95, SEO ≥95 |

Session 1A actually hit A=100, BP=100, SEO=100 (Performance excluded by tool that run).

User's own phone test is the validation gate. Desktop emulation isn't enough.

**Browser support:** Chrome 144+, Edge 144+, Safari 17.5+, Firefox 130+, Mobile Safari iOS 17+, Chrome Android 144+.

---

## 14. What's been completed

### Session 1A (foundation) — DONE
- Cleaned out `app/(examples)/`, replaced Sat ūs branding
- Design tokens via build pipeline
- Brand mark v1: 3 rounds of static SVG `PrismMark` (`lib/hero-mark/round{N}/`)
- Nav, footer, all 7 sections built with final copy
- All CTAs wired to `https://cal.com/prizm-solar`
- Production build clean: 9 routes, 0 errors
- Lighthouse mobile: A=100, BP=100, SEO=100
- 10 commits including session log
- `lib/SESSION_LOG.md` is the running build log

### Phase 1A.5 / Phase 1 (volumetric brand mark) — IN PROGRESS, BROKEN
- Phase 0 research done (artifacts at `/mnt/user-data/outputs/brand-mark-phase-0-plan.md` if persisted)
- Phase 1 brief written for Claude Code
- Multiple WebGL volumetric Penrose mark rounds attempted
- **Hit the wall** — see Open Issues. Knighthawk's verdict: "AI slop in a way."

### Phase 1B (full spatial scene) — RESEARCH PHASE, NOT STARTED
- Fork B locked. Three artistic decisions locked (concept A, journey path, medium scroll length).
- Reference to deconstruct: **activetheory.net** — volumetric light/caustics + flow-field particles + scroll-coupled camera
- Headline tool finding: drei's `MeshTransmissionMaterial` (Codrops canonical deep-dive March 2025). Already in stack.
- Realistic scope: **2–4 sessions of Claude Code work**, not 3 hours. Multi-session.

---

## 15. OPEN ISSUES — must be addressed before Phase 1B

Conversation paused mid-debug, before Phase 1B research started.

### Issue 1 — Live site shows old version

URL `https://prizm-marketing-85jghteub-prizm-solar.vercel.app/` is a *specific deployment snapshot*, not latest.

Possible causes ranked: (1) Vercel hasn't deployed latest commits, (2) push to GitHub didn't happen, (3) Vercel build failed silently, (4) hero scene committed but import not wired into `app/page.tsx`.

Diagnostic commands queued for Knighthawk in PowerShell (`~/Projects/prizm-marketing`):
```powershell
git status
git log --oneline -10
git log origin/main --oneline -10
bunx vercel ls
```

### Issue 2 — 11 console errors on localhost (CRITICAL)

Errors mention `three.nodematerial` and `rawshadermaterial not compatible`.

Most likely culprit: existing `AnimatedGradient` (FinalCta) uses one shader system, new `MeshTransmissionMaterial` hero scene uses another — sharing renderer and one is changing a global setting. Or local hero canvas was set up with different `gl` config than what materials expect.

**This must be fixed before Phase 1B.** Phase 1B is *more* demanding on the renderer than current state. Building on broken foundation will compound.

Three diagnostic outcomes to identify:
- (a) simple version mismatch — 5 min fix
- (b) local-canvas/global-canvas conflict (predicted) — 30 min fix, explicit renderer settings on local canvas. **The architectural decision in §8.1 is the prevention pattern.**
- (c) deeper architectural conflict — Phase 1 hero introduced incompatibility with existing FinalCta gradient. Either revert hero work or rebuild FinalCta gradient on local canvas paradigm.

What we were waiting on:
1. `git log --oneline -20` output
2. Screenshot of all 11 console errors with full stack traces
3. Newest Vercel deployment URL from `bunx vercel ls`

### Issue 3 — GitHub MCP auth failed

Fix via PAT in `~/.mcp.json` under `github` entry's `env.GITHUB_PERSONAL_ACCESS_TOKEN`. Or skip — not blocking.

---

## 16. The path forward

**Step 1 — Stabilize.** Don't start Phase 1B research until 11 errors diagnosed and fixed. Phase 1B inherits whatever's broken now.

**Step 2 — Real Phase 1B research pass** (Claude committed: not cursory):
1. `web_fetch` activetheory.net, inspect rendered code/scripts/shader sources where visible
2. `web_search`/`web_fetch`: Maxime Heckel caustic shader posts, Bruno Simon flow field particle tutorials, Codrops volumetric fog in R3F
3. Read Sat ūs's actual `flowmap-sim.ts` and `fluid-sim.ts` source. Know what's already built.
4. Pull Theatre.js docs via Context7 — studio API, playback model, R3F integration, scroll → timeline mapping
5. Audit MCPs Claude Code currently has and explicitly assign each one a job in the Phase 1B brief
6. Decide volumetric fog approach (raymarching vs. billboards vs. fog primitive). Each has different cost.

**Step 3 — Two artifacts out of research:**
1. `TOOLCHAIN.md` for the project repo — living spec referenced from every brief going forward
2. Phase 1B Claude Code brief — long, specific tool/file/shader references throughout. Each named tool verified to exist before being referenced. Exact polygon construction, material params, lighting, motion specs, perf budgets, scroll choreography keyframes, mobile fallback plan.

**Step 4 — Pre-flight audit.** Have Claude Code verify TOOLCHAIN.md, verify each named tool/file exists, run `/plugin list` to confirm skill stack, confirm back to user what it has access to BEFORE building.

**Step 5 — Multi-session execution.** 3-5 hours of Claude Code time across multiple runs. claude-mem tracks architectural decisions across sessions.

**Step 6 — Iteration loop.** Same multi-round protocol as Phase 1: 6-angle screenshots + 10s video per round, save artifacts, self-critique. Three to five rounds normal. Hard ceiling at five — if not landing, ship best version and let user iterate directly.

---

## 17. Activetheory borrow / don't borrow

**Borrow:**
- Volumetric depth (you can see *into* the scene)
- Caustic light patterns (moving ribbons of light)
- Particles with flow fields underneath, not random drift
- Camera movement coupled to scroll, not element movement
- Materiality that responds to camera angle (chromatic aberration, env reflections, internal glow change as camera moves)
- Loading reveal where space *forms* around you (1–2 seconds, not pop-in)

**Don't borrow:**
- Their density of effects — for solar OS site, more restrained = more credible
- Their navigation paradigm (full-page spatial) — keep our scrolling marketing site
- Their ambient audio (defer to Phase 2, if at all)
- Their loading time (B2B marketing site can't afford 4-second reveal — ours has to be 1.5s max)

---

## 18. Honest scope reality (from prior agent)

Knighthawk + me writing briefs + Claude Code executing. Activetheory has 50+ people whose entire job is making this. **Realistic landing zone: 70–85% of activetheory tier with discipline.** Won't hit 100%. That's still **world-class for the solar industry category** — no solar SaaS has anything in this neighborhood.

70–85% accomplishes the gatekept-positioning job. **Don't chase 100% and miss.**

---

## 19. Open architectural questions for next agent

1. **Mobile experience strategy:**
   - (a) Same scene, lower quality settings (most ambitious)
   - (b) Static cinematic still + slow rotation video
   - (c) Full SVG mark (current fallback)
   
   Decision pending real device test on Knighthawk's actual phone (the validator).

2. **Audio direction:** Subtle ambient drone changing with scroll? Activetheory has audio. Gatekept brands often do. But B2B SaaS sites with audio risk feeling pretentious. **Recommend defer to Phase 2** unless user pushes for it.

3. **Loading state:** Spatial scenes can't pop in. Need 1–2 second reveal where space *forms*. Done well = magic. Done poorly = worst part of the site. High-stakes design moment needing explicit attention in the brief.

4. **The "what happens after the hero" transition:** When camera arrives at prism and scroll continues into Problem section — hard cut, fade, or camera continues past prism into the page? Affects entire hero choreography.

---

## 20. Meta-principles Knighthawk locked in (governs future chats)

> "When you think you can't do something or it will take a long time you are often incorrect... assume there is a way to achieve whatever it is we want and when you think you have found the answer keep looking because there may be and often is a better one."

> "Yes to all you have free reign so don't settle. When you hit a roadblock your first thought is there is a way to achieve the highest quality outcome you just haven't found it yet."

Concrete behavioral commitments that should carry forward:
- **No settling.** Multi-round iteration on critical components until "wow" is hit, even if it takes more sessions than planned.
- **Toolchain as living spec**, not a checkbox. Every brief checks against it.
- **Briefs name specific files/shaders/keyframes**, not vague references.
- **Research before brief. Brief before code.**
- The mark is the highest-stakes single component. Operators judge Prizm in 3 seconds. Most of that judgment lands on the mark.
- **Claude Code Ultra plan** for architectural design passes — extended thinking is genuinely worth it for Phase 1B-level complexity.

---

## 21. Quick-reference paths

```
~/Projects/prizm-marketing/
  app/(marketing)/_sections/         # all 7 sections
    hero/index.tsx                   # currently using PrismMark placeholder
    hero/hero-mark-3d/               # Phase 1 WebGL component (BROKEN — 11 errors)
  components/
    ui/prism-mark/index.tsx          # SVG mark — keep for small sizes + fallback
    effects/animated-gradient/       # used in FinalCta — possibly conflicting with hero
    layout/header|footer|wrapper/    # chrome — wrapper has webgl prop
    canvas/                          # GlobalCanvas tunnel pattern
  lib/
    styles/                          # design tokens, build pipeline
    webgl/utils/flowmaps/            # flowmap-sim.ts — ALREADY BUILT
    webgl/utils/fluid/               # fluid-sim.ts — ALREADY BUILT
    webgl/shaders/                   # noise, gradients, post-effects
    webgl/components/postprocessing/ # raw postprocessing pattern — follow this
    hero-mark/round{N}/              # Phase 1 round screenshots/captures
    SESSION_LOG.md                   # running build log
    copy.ts                          # all body copy as constants
  PRIZM.md                           # project context (read first in every session)
  CLAUDE.md                          # Sat ūs framework conventions
  ARCHITECTURE.md, BOUNDARIES.md, COMPONENTS.md, PATTERNS.md
  TOOLCHAIN.md                       # to be created in Phase 1B research pass
```

---

## ★ THE THESIS ★

The brand mark is a Penrose-derived prism not because it looks cool, but because **Penrose patterns are how the most advanced solar cells actually work** — and Prizm is the most advanced solar operating system. The geometry IS the thesis.

When Phase 1B's spatial scene decisions get made, check them against this thesis. Concept (a) "light through prism, in motion" wins because it visualizes the literal physics. Anything that drifts from that is drifting from the mark.

Combined with the "elite or the few" positioning: every choice optimizes for the operator who'd be impressed by activetheory.net. Restraint over spectacle. Materiality over checklist. Belief over decoration.
