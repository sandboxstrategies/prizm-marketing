# Prizm Marketing Site — Chat Compaction & Handoff

**Source chat:** `c92fbb5b-4818-492a-81bf-e15803eb061b`
**Compacted on:** April 25, 2026
**Purpose:** Pick up the build with zero context loss. Paste this into the next chat as the first message after a brief intro.

---

## 1. Project at a glance

**Prizm** is a full-lifecycle solar operating system — the first end-to-end platform covering sales, ops, install, funding, service, and customer care for solar installers. Replaces the 4–6 fragmented tools most installers run today (CRM + proposal tool + finance portals + phone system + payroll spreadsheets). Deep integrations with Palmetto, Albedo, JustCall, Salesforce, Pipe Solar. AI agents, MCP server, and constant new feature/integration velocity.

**Repo:** `~/Projects/prizm-marketing` (separate from the product app — do NOT touch the app repo)
**Domain:** prizm.solar
**Vercel project:** `prizm-marketing` under team `prizm-solar` (team_5WCsGKLIrCc5YFOCDLq6tUYV)
**Last known preview URL:** `https://prizm-marketing-85jghteub-prizm-solar.vercel.app/` (likely stale — see Open Issues)

**Corporate structure (state truthfully on the site):**
- **Sandbox Strategies** — Knighthawk's dev company. Sandbox builds and operates Prizm. Prizm is Sandbox's flagship product.
- **Flo Energy Solar** — Knighthawk's solar company, partial owner. Flo runs on Prizm; Flo is the proof case, not the parent.
- **Knighthawk's experience:** 10+ years operating in solar (sales, ops, permits, install, commissions, finance). Owned a previous solar company before Flo.
- Footer copyright: `© 2026 Sandbox Strategies.`

---

## 2. Positioning & voice (locked)

**Core line:** "The best operating system for solar sales and operations. Period."

**Voice:** Operator-confident, Hormozi-coded **without being cringe**. Direct. "Built by an operator who built the thing he wished existed" — not "marketer selling software." No fake urgency. No empty superlatives. No "revolutionary" or "game-changing." Earned through specifics.

**Three pillars (the why):**
1. **Efficiency and automation** — fastest, most streamlined path from contract to commission, with the machine doing the work
2. **Flexibility and velocity** — integrates with everything, new capabilities ship constantly, never blocked by what the software can't do
3. **Built by operators with real solar scar tissue** — every part reflects experience across sales, ops, permits, installs, commissions, finance

**Tier-1 positioning move — Prizm Custom:** dedicated dev capacity building to spec for high-value clients. Says "we're not take-it-or-leave-it SaaS, we're the platform AND the engineering team for serious operators." By invitation. Founder conversation required. No public qualification criteria.

**Single CTA:** "Talk to the founder" → `https://cal.com/prizm-solar`. No pricing shown. No demo signups. No waitlist.

**Primary buyer:** installer owner/operator. Secondary: ops director, sales manager, individual rep. Copy resonates across all four; primary conversion target is owner/operator.

---

## 3. Brand mark — the deep research that drove the decision

This was the single most important research in the chat. Don't lose it.

### The Penrose discovery chain

Started from Knighthawk's reference image: a Penrose impossible triangle (tribar) with ember/red glow on internal seams. Initial spec was the volumetric tribar.

Knighthawk surfaced two articles about **Penrose tilings** — a different concept than the impossible triangle. Roger Penrose invented BOTH:
- **Penrose impossible triangle (1958)** — optical illusion, three bars looping impossibly. Inspired by Escher.
- **Penrose tilings (1974)** — aperiodic tessellations using kite + dart (or two rhombuses) that cover an infinite plane without ever repeating, with "forbidden" 5-fold symmetry.

**Critical structural finding:** both concepts are built from **Robinson triangles** — two specific isosceles triangles whose proportions are the **golden ratio**. The kite is two Robinson triangles. The dart is two Robinson triangles. The thick rhomb is two Robinson triangles. The thin rhomb is two Robinson triangles. **Triangle is the atomic unit of both.**

### The killer finding — Penrose patterns are literally used in solar cells

Not symbolic. Verifiable peer-reviewed solar science:
- **2022 Cambridge study** — Penrose-quasi-random nanostructures on ultrathin GaAs solar cells lifted photocurrent **from 16.1 to 25.3 mA/cm² — a 57% improvement** over a planar reference.
- **UNSW Sydney School of Photovoltaic Engineering** — active research program on "high-symmetry nano-photonic quasi-crystals providing novel light management in silicon solar cells."
- **Fraunhofer ISE, Cambridge, University of Amsterdam** — multiple groups using Penrose-arranged nanostructures for isotropic light absorption.
- **Plasmonic gold dots** in Penrose patterns make solar coatings "more isotropic and polarisation insensitive."
- **2011 Nobel Prize in Chemistry** — Dan Shechtman, for discovering quasicrystals (physical Penrose-like atomic arrangements). Nobel committee specifically cited Penrose tiling.

**Why it matters:** periodic patterns absorb light only at specific resonant angles. Quasi-periodic Penrose patterns are isotropic — absorb light at every angle equally well. The brand mark line writes itself: *"Our mark uses the same Penrose pattern researchers use to make solar cells absorb 57% more light at every angle. Aperiodic structures handle every angle. Same with our platform."*

### The differentiation finding — Vercel owns "minimalist tech triangle"

Vercel's published doctrine: equilateral, pure black/white, no internal detail, "strength/stability/progress." Most-imitated developer brand. **Without the Penrose internal structure, we'd just be a Vercel clone.** Internal Robinson subdivision + spectrum colors + golden triangle silhouette is the differentiation.

### The geometric finding — golden triangle, not equilateral

**Golden triangle** (36° apex, 72° base, sides in φ:1:1 ratio) is sharper, more "prism-like," and feels like vertical motion (light *going somewhere*). Equilateral feels static (mountain at rest). For a brand called Prizm whose mark needs to feel like a prism: golden triangle wins. Also visually distinct from Vercel.

### Final mark direction (locked)

**Hybrid A+B direction approved:**
- **Silhouette:** golden triangle (36° apex, 72° base)
- **Internal structure:** Robinson triangle subdivision (3 levels of recursion baked into geometry)
- **Body:** crystalline glass via drei's `MeshTransmissionMaterial` — chromatic aberration, anisotropic blur, can "see" other transmissive objects
- **Internal seams:** separate emissive mesh layer — cyan apex fading to ember base (spectrum gradient)
- **Bloom:** UnrealBloomPass on the seam only (luminanceThreshold so the body doesn't bloom)
- **Apex axis-tilt: 8°** — like Earth's tilt. Gives rotation visual interest at every angle. No symmetric "logo on a turntable" feel.
- **Three render scales:**
  1. **Favicon/nav (24–32px):** flat 2D SVG, just the silhouette + central seam glow (cyan)
  2. **Footer (32–48px):** flat 2D SVG with prism-gradient seam
  3. **Hero (Phase 1B):** full volumetric WebGL — hand-coded R3F (Spline ruled out — wrong for math-defined geometry, material exports unreliable)

**Spectrum direction:** apex = cyan (brand-strong), base = ember (thermal "energy radiating up" feel, on-message for solar)

---

## 4. Tech stack (locked)

**Framework:** Satūs starter (Sat ūs in some quoted text — same thing) — opinionated Next.js framework with batteries included.

- **Next.js 16** (App Router, RSC where possible)
- **React 19** + **React Compiler** (Sat ūs rule: NO `useMemo`/`useCallback`/`React.memo` — Compiler handles it)
- **Tailwind v4** (CSS-first `@theme` directive, OKLCH colors)
- **Biome** for lint/format
- **Bun** as runtime/package manager
- **R3F** + **drei** + **postprocessing** + **@react-three/postprocessing** — already installed
- **Theatre.js** — for scroll-coupled camera choreography (already installed)
- **GSAP** — for non-3D motion (already installed)
- **Tone.js** — available for ambient audio (Phase 1B optional)
- **Geist** font (via next/font) + **Instrument Serif** (display) + **Inter** (body) — copy-of mentions of fonts vary across iterations; check PRIZM.md for final
- **Cal.com inline embed** for "Talk to the founder" CTA
- **Deploy:** Vercel (auto-deploys from `main`)

**Sat ūs internals worth knowing:**
- Design tokens generated via `bun run setup:styles` — three generators: `generate-root.ts`, `generate-tailwind.ts`, `generate-scale.ts`
- WebGL utilities live in `lib/webgl/utils/` — flowmap-sim.ts, fluid-sim.ts, noise utilities, shader fragments
- `components/effects/animated-gradient/` — already built and used in FinalCta
- `components/canvas/` — GlobalCanvas tunnel pattern (R3F shared canvas)
- `components/layout/wrapper/index.tsx` — has `webgl` prop that activates GlobalCanvas
- Convention: wrap, don't modify core `ui/` primitives (per BOUNDARIES.md)

**Tailwind v4 / OKLCH** is in use for the prism-gradient — interpolates correctly through hue rather than RGB.

---

## 5. MCPs & tools available to Claude Code

**Installed (per the chat):**
- `frontend-design` skill (deduplicate: keep `claude-plugins-official` version, disable `claude-code-plugins` version)
- `playwright` MCP (visual regression — keep on)
- `figma` MCP (auth pending — not blocking)
- `github` MCP (failed auth — fix via PAT in `~/.mcp.json`, scope to `sandboxstrategies/prizm-marketing`, perms: Contents/PRs/Issues read+write, Metadata read)
- `vercel` MCP (used once for deploy — can also be used for performance regression detection, log analysis, RUM data)
- `Context7` MCP (pull live docs for drei, three, postprocessing, Tailwind v4, Next.js 16, Theatre.js, Geist)
- `Magic (21st.dev)` MCP (generative UI — for variation iteration, not core composition)
- `Chrome DevTools` MCP (visual verification every round of WebGL work)
- `commit-commands` plugin

**Claude (this side, not Claude Code):**
- web_search, web_fetch (used heavily for the Penrose research; should be used for Phase 1B activetheory.net analysis)
- Extended thinking via "Ultra plan" — use for architectural design passes before any code

**Meta-lesson Claude wrote down:** treat the toolchain as a *living spec* every brief checks against — not a one-time audit. Each session brief should explicitly assign each MCP a job. Phase 0 toolchain assembly was nearly wasted because briefs didn't actually integrate it.

---

## 6. Visual system

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

## 7. Site structure & copy (locked)

Single-page site, 7 sections. Final copy is in `lib/copy.ts` and `PRIZM.md` in repo.

1. **Hero** — Prism mark + headline. Currently a static SVG `PrismMark` placeholder. Phase 1B replaces with WebGL volumetric scene.
2. **Problem** — "You run six tools to move a kilowatt." 6-chip convergence animation (CRM, Proposal, Funding, Voice, Payroll, Integrator) — chips converge to center, refract into Prizm mark. Currently static; needs GSAP timeline.
3. **Pillars** — three cards (one source of truth / efficiency / flexibility). Existing copy in repo.
4. **Features (six blocks)** — uses reusable `FeatureBlock` component. Highlights: AI agents/MCP, commission tracking, first-sync-only integrations model, mobile field crew, end-to-end coverage, custom-tailoring, automation rules, customer care/service. Some marked "coming."
5. **Prizm Custom** — gatekept tier callout. Slightly darker bg, 1px gradient border using `--prism-gradient`. CTA: "Talk to the founder". Subtext: "By invitation. Founder conversation required."
6. **Final CTA** — "The solar operating system. Period." → cal.com. Subtext: "30 minutes with Knighthawk. No decks. No demos you've seen before." Uses existing `AnimatedGradient` component.
7. **Footer** — Prism mark (32px, prism-gradient seam) + "Prizm" wordmark, "Talk to the founder" link, "© 2026 Sandbox Strategies", "Built by operators." (mono).

**Performance budget:** ≤1.2 MB total (excl. fonts ~150 KB). LCP ≤1.5s on 4G mobile. CLS = 0. Lighthouse mobile mins: Performance ≥90, A11y ≥95, Best Practices ≥95, SEO ≥95. (Session 1A actually hit A=100, BP=100, SEO=100.)

**Browser support:** Chrome 144+, Edge 144+, Safari 17.5+, Firefox 130+, Mobile Safari iOS 17+, Chrome Android 144+.

---

## 8. What's been completed

### Session 1A (foundation) — DONE
- Cleaned out `app/(examples)/`, replaced Sat ūs branding
- Design tokens via build pipeline (`bun run setup:styles`)
- Brand mark v1: 3 rounds of static SVG `PrismMark` (lib/hero-mark/round{N}/ contains screenshots)
- Nav, footer, all 7 sections built with final copy
- All CTAs wired to `https://cal.com/prizm-solar`
- Production build clean: 9 routes, 0 errors
- Lighthouse mobile: A=100, BP=100, SEO=100 (Performance excluded by tool that run)
- Committed (10 commits including session log)
- `lib/SESSION_LOG.md` is the running build log

### Phase 1A.5 / Phase 1 (volumetric brand mark) — IN PROGRESS, COMPLICATIONS
- Phase 0 research done (all in `/mnt/user-data/outputs/brand-mark-phase-0-plan.md` if persisted)
- Phase 1 brief written for Claude Code
- Multiple rounds of WebGL volumetric Penrose mark attempted
- **Then we hit the wall** — see Open Issues below

### Phase 1B (full spatial scene) — NOT STARTED, RESEARCH PHASE
- Decision direction explored: Fork A (level up the prism), Fork B (replace hero with continuous spatial scene), Fork C (whole site spatial). **Fork B is the chosen direction** — activetheory-tier hero only, conventional rest of site.
- Three concept candidates for the space (decision pending):
  - **(a) Light through prism, in motion** — refracted spectrum-split light drifting; particles as photons; caustics as light patterns. Tightest brand fit. Knighthawk's pick recommended by Claude.
  - **(b) Crystalline subspace** — inside of a crystal; facets, depth, internal reflections. Architectural, safer.
  - **(c) Stellar/cosmic** — particles as stars, cyan/violet nebula, prism as gravitational center. Most emotional, weakest brand fit.
- Reference to deconstruct: **activetheory.net** — volumetric light/caustics + flow-field particles + scroll-coupled camera (not just element movement). 70–85% of activetheory quality is the realistic target with this team — and that's world-class for the solar category.
- **Headline tool finding:** drei's `MeshTransmissionMaterial` (Codrops did the canonical deep-dive March 2025). Already in stack. This is the single most important component for premium glass.
- **Realistic scope for Phase 1B:** 2–4 sessions of Claude Code work, not 3 hours.
- **Mobile fallback non-negotiable** — 90% of traffic is mobile. Full spatial = desktop only. Mobile gets either rich-but-restrained (lower quality settings, simpler camera, no audio) or static cinematic still + slow rotation.

---

## 9. Where we are in the conversation — OPEN ISSUES

Conversation paused mid-debug, before the Phase 1B research pass started. Three things on the table:

**Issue 1 — Live site shows old version.**
URL `https://prizm-marketing-85jghteub-prizm-solar.vercel.app/` is a *specific deployment snapshot*, not latest. Possible causes ranked: (1) Vercel hasn't deployed latest commits, (2) push to GitHub didn't happen, (3) Vercel build failed silently, (4) hero scene committed but import not wired into `app/page.tsx`.

Diagnostic commands queued for Knighthawk to run in PowerShell (`~/Projects/prizm-marketing`):
```
git status
git log --oneline -10
git log origin/main --oneline -10
bunx vercel ls
```

**Issue 2 — 11 console errors on localhost (CRITICAL).**
Errors mention `three.nodematerial` and `rawshadermaterial not compatible`. Most likely culprit: existing `AnimatedGradient` (FinalCta) uses one shader system, new `MeshTransmissionMaterial` hero scene uses another — sharing a renderer and one is changing a global setting. Or: local hero canvas was set up with different `gl` config than what materials expect.

**This must be fixed before Phase 1B.** Phase 1B is *more* demanding on the renderer than current state. Building on broken foundation will compound.

Three diagnostic outcomes Claude was waiting on:
- (a) simple version mismatch (5 min fix)
- (b) local-canvas/global-canvas conflict — predicted (30 min fix, explicit renderer settings on local canvas)
- (c) deeper architectural conflict — Phase 1 hero introduced incompatibility with existing FinalCta gradient. Either revert hero work or rebuild FinalCta gradient on local canvas paradigm.

What Claude was waiting on:
1. `git log --oneline -20` output
2. Screenshot of all 11 console errors with full stack traces
3. Newest Vercel deployment URL from `bunx vercel ls`

**Issue 3 — GitHub MCP auth failed.**
Fix: paste fine-grained PAT into `~/.mcp.json` under the `github` entry's `env.GITHUB_PERSONAL_ACCESS_TOKEN`. Token scope: repo `sandboxstrategies/prizm-marketing`, perms: Contents read+write, PRs read+write, Issues read+write, Metadata read. Or skip — it's nice-to-have, not blocking for Phase 1B.

---

## 10. The path forward (when we resume)

The plan Claude laid out was:

**Step 1 — Stabilize.** Don't start Phase 1B research until the 11 errors are diagnosed and fixed. Phase 1B inherits whatever's broken now. Get diagnostic output, identify the error class (a/b/c above), fix.

**Step 2 — The proper Phase 1B research pass.** Claude committed to doing this *right* this time, not a cursory pass. Specifically:
1. Web fetch activetheory.net, inspect rendered code/scripts/shader sources where visible
2. Web search/fetch implementation references: Maxime Heckel's caustic blog posts, Bruno Simon's flow field particle tutorials, Codrops volumetric fog in R3F
3. Read Sat ūs's WebGL utilities source (`lib/webgl/utils/flowmaps/flowmap-sim.ts`, `lib/webgl/utils/fluid/fluid-sim.ts`, noise utilities, animated gradient material) to know what's already built
4. Pull Theatre.js documentation for studio API, playback model, R3F integration, scroll → timeline mapping
5. Audit which MCPs Claude Code currently has and explicitly assign each one a job in the Phase 1B brief

**Step 3 — Two artifacts come out of research:**
1. `TOOLCHAIN.md` for the project repo — living spec
2. Phase 1B Claude Code brief — specific tool/file/shader references throughout, exact polygon construction, exact material params, exact lighting, exact motion specs, exact perf budgets, scroll choreography keyframes, mobile fallback plan, audio plan if going there.

**Step 4 — Three decisions Knighthawk needs to make before brief is written:**
1. Visual concept of the space — (a) light through prism, (b) crystalline subspace, or (c) stellar/cosmic. Claude's pick: (a).
2. User's path through the space — where does the camera start, where does it end up, what does the user see when they land?
3. Audio yes/no — Tone.js available, ambient drone changing with scroll position. High-leverage but optional.

---

## 11. The meta-principles Knighthawk locked in (these matter for tone)

These are quotes/paraphrases of Knighthawk's stated principles that should govern future chats:

> "When you think you can't do something or it will take a long time you are often incorrect... assume there is a way to achieve whatever it is we want and when you think you have found the answer keep looking because there may be and often is a better one."

> "Yes to all you have free reign so don't settle. When you hit a roadblock your first thought is there is a way to achieve the highest quality outcome you just haven't found it yet."

Concrete behavioral commitments Claude made in response, that should carry forward:
- No settling. Multi-round iteration on critical components until "wow" is hit, even if it takes more sessions than planned.
- Toolchain as living spec, not a checkbox.
- Briefs name specific files/shaders/keyframes, not vague references.
- Research before brief. Brief before code.
- The mark is the highest-stakes single component on the site. Operators judge Prizm in 3 seconds. Most of that judgement lands on the mark.

---

## 12. Quick-reference paths

```
~/Projects/prizm-marketing/
  app/(marketing)/_sections/         # all 7 sections
    hero/index.tsx                   # currently using PrismMark placeholder
    hero/hero-mark-3d/               # Phase 1 WebGL component (broken — 11 errors)
  components/
    ui/prism-mark/index.tsx          # SVG mark — keep for small sizes
    effects/animated-gradient/       # used in FinalCta — possibly conflicting with hero
    layout/header|footer|wrapper/    # chrome — wrapper has webgl prop
    canvas/                          # GlobalCanvas tunnel pattern
  lib/
    styles/                          # design tokens, build pipeline
    webgl/utils/                     # flowmaps, fluid sim, noise, shader fragments
    hero-mark/round{N}/              # Phase 1 round screenshots/captures
    SESSION_LOG.md                   # running build log
    copy.ts                          # all body copy as constants
  PRIZM.md                           # project context (read first in every session)
  CLAUDE.md                          # Sat ūs framework conventions
  ARCHITECTURE.md, BOUNDARIES.md, COMPONENTS.md, PATTERNS.md
```

---

## 13. The single most important thing to know going in

**The brand mark research uncovered a verifiable, peer-reviewed scientific connection between Penrose patterns and solar cells (57% photocurrent improvement at every angle).** This is the brand's gravitational center. It's not poetic, it's literal. Don't lose it. The mark is a Penrose-derived prism not because it looks cool, but because Penrose patterns are how the most advanced solar cells actually work — and Prizm is the most advanced solar operating system. The geometry is the thesis.

When the rest of the site decisions get made (especially Phase 1B's spatial scene concept), check them against this thesis. Concept (a) "light through prism, in motion" wins because it visualizes the literal physics. Anything that drifts from that is drifting from the mark.
