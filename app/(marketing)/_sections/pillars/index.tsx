import { Eyebrow } from '@/components/ui/eyebrow'
import { MetricDisplay } from '@/components/ui/metric-display'
import s from './pillars.module.css'

const PILLARS = [
  {
    accent: 'cyan',
    number: '01',
    title: 'Efficient. Automated. Set up to win.',
    body: 'Workflows that do the work. Automations that fire when they should. No rep rekeying anything.',
    metricLabel: 'Context switches',
    metricValue: '0',
  },
  {
    accent: 'violet',
    number: '02',
    title: 'Flexible. Fast. Never the blocker.',
    body: 'Deep integrations with everything you already run. New capabilities ship weekly. What you need next is already on our roadmap.',
    metricLabel: 'Release cadence',
    metricValue: 'Weekly',
  },
  {
    accent: 'ember',
    number: '03',
    title: 'Built by operators. Not by SaaS people.',
    body: "Every part of Prizm reflects someone's scar tissue. Sales. Ops. Permits. Installs. Commissions. Finance. We've owned the trucks. Closed the deals. Pulled the permits.",
    metricLabel: 'Years operating solar',
    metricValue: '10+',
  },
] as const

export function Pillars() {
  return (
    <section className={s.root}>
      <div className={`${s.grid} dr-layout-grid`}>
        <div className={s.headerCol}>
          <Eyebrow accent="cyan">The Prizm advantage</Eyebrow>
          <h2 className={s.h2}>Three reasons we win.</h2>
        </div>

        <div className={s.cardsCol}>
          {PILLARS.map((p) => (
            <article key={p.number} className={`${s.card} ${s[p.accent]}`}>
              <div className={s.cardHeader}>
                <span className={s.number}>{p.number}</span>
              </div>
              <h3 className={s.title}>{p.title}</h3>
              <p className={s.body}>{p.body}</p>
              <div className={s.metric}>
                <MetricDisplay
                  label={p.metricLabel}
                  value={p.metricValue}
                  size="lg"
                />
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
