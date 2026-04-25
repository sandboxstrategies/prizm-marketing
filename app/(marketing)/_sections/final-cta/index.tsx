import cn from 'clsx'
import { AnimatedGradient } from '@/components/effects/animated-gradient'
import { Cta } from '@/components/ui/cta'
import s from './final-cta.module.css'

export function FinalCta() {
  return (
    <section className={s.root}>
      {/* PHASE 1B: tune AnimatedGradient parameters and add scroll-triggered intensity ramp */}
      <AnimatedGradient
        className={cn(s.gradient)}
        colors={[
          '#0a0c16',
          '#00cfee',
          '#7c4ff5',
          '#ff5c8a',
          '#ffaa44',
          '#0a0c16',
        ]}
        radial
        flowmap
        amplitude={1.2}
        frequency={0.4}
        speed={0.4}
      />
      <div className={s.dim} aria-hidden="true" />

      <div className={s.inner}>
        <h2 className={s.h2}>The solar operating system. Period.</h2>
        <Cta variant="primary" href="https://cal.com/prizm-solar">
          Talk to the founder
        </Cta>
        <p className={s.subtext}>
          30 minutes with Knighthawk. Real questions only.
        </p>
      </div>
    </section>
  )
}
