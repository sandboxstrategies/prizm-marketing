import { Link } from '@/components/ui/link'
import { PrismMark } from '@/components/ui/prism-mark'
import s from './footer.module.css'

export function Footer() {
  return (
    <footer className={s.root}>
      <div className={s.brand}>
        <PrismMark size={32} variant="footer" aria-hidden="true" />
        <span className={s.wordmark}>Prizm</span>
      </div>

      <div className={s.right}>
        <Link href="https://cal.com/prizm-solar" className={s.founderLink}>
          Talk to the founder
        </Link>
        <span className={s.copyright}>
          © 2026 Sandbox Strategies. Prizm is operated by Sandbox Strategies in
          partnership with Flo Energy Solar.
        </span>
        <span className={s.tagline}>Built by operators.</span>
      </div>
    </footer>
  )
}
