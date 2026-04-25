import { Wrapper } from '@/components/layout/wrapper'
import { Features } from './(marketing)/_sections/features'
import { FinalCta } from './(marketing)/_sections/final-cta'
import { Hero } from './(marketing)/_sections/hero'
import { Pillars } from './(marketing)/_sections/pillars'
import { PrizmCustom } from './(marketing)/_sections/prizm-custom'
import { Problem } from './(marketing)/_sections/problem'

export default function Home() {
  return (
    <Wrapper theme="prizm" webgl>
      <Hero />
      <Problem />
      <Pillars />
      <Features />
      <PrizmCustom />
      <FinalCta />
    </Wrapper>
  )
}
