import { Cta } from '@/components/ui/cta'
import { Eyebrow } from '@/components/ui/eyebrow'
import s from './prizm-custom.module.css'

export function PrizmCustom() {
  return (
    <section className={s.root}>
      <div className={`dr-layout-grid`}>
        <div className={s.frame}>
          <div className={s.inner}>
            <Eyebrow accent="violet">Prizm Custom</Eyebrow>
            <h2 className={s.h2}>
              For operators who need Prizm to do something nobody else can.
            </h2>
            <p className={s.body}>
              Select clients get dedicated engineering through Sandbox
              Strategies. Features built to your spec. Integrations we
              don&apos;t publicly list. A platform team that treats your
              operation like the one it&apos;s built for. Because it is.
            </p>
            <div className={s.ctaWrap}>
              <Cta variant="primary" href="https://cal.com/prizm-solar">
                Talk to the founder
              </Cta>
              <span className={s.subtext}>
                By invitation. Founder conversation required.
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
