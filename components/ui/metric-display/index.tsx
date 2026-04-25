import cn from 'clsx'
import type { ComponentProps } from 'react'
import s from './metric-display.module.css'

interface MetricDisplayProps extends Omit<ComponentProps<'div'>, 'children'> {
  label: string
  value: string
  unit?: string
  size?: 'sm' | 'lg'
}

export function MetricDisplay({
  label,
  value,
  unit,
  size = 'sm',
  className,
  ...props
}: MetricDisplayProps) {
  return (
    <div className={cn(s.root, className)} {...props}>
      <span className={s.label}>{label}</span>
      <span className={cn(s.value, s[size])}>
        {value}
        {unit && <span className={s.unit}>{unit}</span>}
      </span>
    </div>
  )
}
