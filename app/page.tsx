import {
  Navbar,
  Hero,
  About,
  WhoWeHelp,
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
      <HowWeHelp />
      <CTA />
      <Contact />
      <Footer />
    </main>
  )
}
