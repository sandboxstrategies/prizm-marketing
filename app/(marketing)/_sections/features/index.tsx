import { Eyebrow } from '@/components/ui/eyebrow'
import s from './features.module.css'

type Accent = 'cyan' | 'cobalt' | 'violet' | 'magenta' | 'ember'

interface Block {
  accent: Accent
  eyebrow: string
  title: string
  body: string
}

const BLOCKS: Block[] = [
  {
    accent: 'cobalt',
    eyebrow: 'Pipeline',
    title: 'Pipeline health. Visible to everyone.',
    body: 'Every role sees their deals. Reps see their own. No more "who owns this?"',
  },
  {
    accent: 'ember',
    eyebrow: 'Commissions',
    title: 'Commissions reps can actually see.',
    body: 'EPC, redlines, adders, clawbacks, draws — visible to the rep in real time. Friday pay, Tuesday cutoff. Done.',
  },
  {
    accent: 'violet',
    eyebrow: 'Integrations',
    title: 'Integrations deeper than anyone else.',
    body: 'Palmetto. Salesforce. Albedo. JustCall. Pipe. Plus internal modules. Not surface-level. Not webhooks-as-data-payload.',
  },
  {
    accent: 'magenta',
    eyebrow: 'AI',
    title: 'Agents doing the grunt work.',
    body: "Drafting. Routing. Reconciling. Flagging. The work you shouldn't have to hire someone for.",
  },
  {
    accent: 'cyan',
    eyebrow: 'Field',
    title: 'The field, in your pocket.',
    body: 'Installers check in. Ops sees status. Everyone knows what’s on today and what ships tomorrow.',
  },
  {
    accent: 'ember',
    eyebrow: 'Data',
    title: 'The metrics that actually move money.',
    body: 'Cycle time by stage. Funder velocity. EPC variance. The numbers operators care about — not vanity dashboards.',
  },
]

export function Features() {
  return (
    <section className={s.root}>
      <div className={`${s.grid} dr-layout-grid`}>
        <div className={s.headerCol}>
          <Eyebrow accent="violet">The proof</Eyebrow>
          <h2 className={s.h2}>
            What &apos;one platform&apos; actually means.
          </h2>
        </div>

        <div className={s.blocks}>
          {BLOCKS.map((b, i) => {
            const reverse = i % 2 === 1
            return (
              <div
                key={b.eyebrow}
                className={`${s.block} ${reverse ? s.blockReverse : ''}`}
              >
                <div className={s.copy}>
                  <Eyebrow accent={b.accent}>{b.eyebrow}</Eyebrow>
                  <h3 className={s.title}>{b.title}</h3>
                  <p className={s.body}>{b.body}</p>
                </div>
                <div className={s.shotWrap}>
                  {/* PHASE 3: real screenshot of {b.eyebrow} */}
                  <div className={s.shot}>
                    <span className={s.shotLabel}>Product screenshot</span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
