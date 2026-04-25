import cn from 'clsx'
import type { ComponentProps, ReactNode } from 'react'
import { Link } from '@/components/ui/link'
import s from './cta.module.css'

interface CtaProps extends Omit<ComponentProps<typeof Link>, 'children'> {
  variant: 'primary' | 'ghost'
  href: string
  children: ReactNode
}

export function Cta({
  variant,
  href,
  children,
  className,
  ...props
}: CtaProps) {
  return (
    <Link href={href} className={cn(s.root, s[variant], className)} {...props}>
      {children}
    </Link>
  )
}
