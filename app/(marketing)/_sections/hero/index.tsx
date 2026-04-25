import { Cta } from '@/components/ui/cta'
import { Eyebrow } from '@/components/ui/eyebrow'
import { PrismMark } from '@/components/ui/prism-mark'
import s from './hero.module.css'

export function Hero() {
  return (
    <section className={s.root} id="top">
      <div className={s.bgGlow} aria-hidden="true" />

      <div className={`${s.grid} dr-layout-grid`}>
        <div className={s.copyCol}>
          <Eyebrow accent="cyan">The solar operating system</Eyebrow>
          <h1 className={s.h1}>
            Everyone on the same platform. <em>Nothing falling through.</em>
          </h1>
          <p className={s.subhead}>
            Sales, ops, commissions, integrations, and AI. One system. Built by
            operators.
          </p>
          <div className={s.ctas}>
            <Cta variant="primary" href="https://cal.com/prizm-solar">
              Talk to the founder
            </Cta>
            <Cta variant="ghost" href="#problem">
              See how it works
            </Cta>
          </div>
          <div className={s.belowFold}>
            <span className={s.arrow}>↓</span>
            <span>
              47 days NTP → install. The metric we built Prizm to fix.
            </span>
          </div>
        </div>

        <div className={s.markCol}>
          {/* PHASE 1B: replace with WebGL volumetric Penrose triangle scene using useWebGLElement + WebGLTunnel.In per PATTERNS.md §6 */}
          <div className={s.markFrame}>
            <div className={s.markGlow} aria-hidden="true" />
            <PrismMark
              size={460}
              variant="hero-placeholder"
              showSpiral
              style={{ width: '100%', height: 'auto' }}
              aria-hidden="true"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
