'use client'

import cn from 'clsx'
import { useEffect, useState } from 'react'
import { Link } from '@/components/ui/link'
import { PrismMark } from '@/components/ui/prism-mark'
import s from './header.module.css'

const SCROLL_THRESHOLD = 40

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => {
      setIsScrolled(window.scrollY > SCROLL_THRESHOLD)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className={cn(s.root, isScrolled && s.isScrolled)}>
      <Link href="/" className={s.brand} aria-label="Prizm — home">
        <PrismMark size={24} variant="nav" aria-hidden="true" />
        <span className={s.wordmark}>Prizm</span>
      </Link>

      <Link href="https://cal.com/prizm-solar" className={s.cta}>
        Talk to the founder
      </Link>
    </header>
  )
}
