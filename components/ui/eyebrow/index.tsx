import cn from 'clsx'
import type { ComponentProps, ReactNode } from 'react'
import s from './eyebrow.module.css'

type Accent = 'cyan' | 'cobalt' | 'violet' | 'magenta' | 'ember'

interface EyebrowProps extends Omit<ComponentProps<'div'>, 'children'> {
  accent: Accent
  children: ReactNode
}

export function Eyebrow({
  accent,
  children,
  className,
  ...props
}: EyebrowProps) {
  return (
    <div className={cn(s.root, s[accent], className)} {...props}>
      <span className={s.rule} aria-hidden="true" />
      <span className={s.label}>{children}</span>
    </div>
  )
}
