import {
  Navbar,
  Hero,
  About,
  WhoWeHelp,
  SwissHolding,
  HowWeHelp,
  CTA,
  Contact,
  Footer,
} from '@/components'

export default function Home() {
  return (
    <main>
      <Navbar />
      <Hero />
      <About />
      <WhoWeHelp />
      <SwissHolding />
      <HowWeHelp />
      <Contact />
      <CTA />
      <Footer />
    </main>
  )
}
