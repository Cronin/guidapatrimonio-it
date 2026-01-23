import {
  Navbar,
  Hero,
  About,
  WhoWeHelp,
  HowWeHelp,
  Testimonials,
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
      <Testimonials />
      <CTA />
      <Contact />
      <Footer />
    </main>
  )
}
