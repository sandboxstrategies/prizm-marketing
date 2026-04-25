import { Eyebrow } from '@/components/ui/eyebrow'
import s from './problem.module.css'

const CHIPS = [
  { label: 'CRM', x: 6, y: 8, rotate: -3 },
  { label: 'Proposal', x: 28, y: 32, rotate: 2 },
  { label: 'Funding', x: 55, y: 4, rotate: -1 },
  { label: 'Voice', x: 70, y: 50, rotate: 4 },
  { label: 'Payroll', x: 12, y: 62, rotate: -2 },
  { label: 'Integrator', x: 44, y: 76, rotate: 3 },
] as const

export function Problem() {
  return (
    <section className={s.root} id="problem">
      <div className={`${s.grid} dr-layout-grid`}>
        <div className={s.headerCol}>
          <Eyebrow accent="cobalt">The problem</Eyebrow>
          <h2 className={s.h2}>
            Six tools to move a kilowatt. This is why deals die.
          </h2>
        </div>

        {/* PHASE 1B: scroll-triggered convergence — chips collapse into the Penrose mark */}
        <div className={s.chipsCol} aria-hidden="true">
          {CHIPS.map((c) => (
            <span
              key={c.label}
              className={s.chip}
              style={{
                left: `${c.x}%`,
                top: `${c.y}%`,
                transform: `rotate(${c.rotate}deg)`,
              }}
            >
              {c.label}
            </span>
          ))}
        </div>

        <div className={s.bodyCol}>
          <p className={s.line}>Context-switching kills cycle time.</p>
          <p className={s.line}>Data drifts between systems.</p>
          <p className={s.line}>Reps can&apos;t see their own pipeline.</p>
          <p className={`${s.line} ${s.punchline}`}>
            You paid for software and got a second job.
          </p>
        </div>
      </div>
    </section>
  )
}
