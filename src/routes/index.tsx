import { createFileRoute } from '@tanstack/react-router'
import { Navbar } from '@/components/landing/Navbar'
import { Hero } from '@/components/landing/Hero'
import { HowItWorks } from '@/components/landing/HowItWorks'
import { Services } from '@/components/landing/Services'
import { Stats } from '@/components/landing/Stats'
import { Pricing } from '@/components/landing/Pricing'
import { Testimonial } from '@/components/landing/Testimonial'
import { CTAFinal } from '@/components/landing/CTAFinal'
import { Footer } from '@/components/landing/Footer'

export const Route = createFileRoute('/')({
  head: () => ({
    meta: [
      { title: 'AURA Concierge — Votre concierge personnel 24/7' },
      { name: 'description', content: 'AURA orchestre vos demandes en temps réel : voyages, gastronomie, shopping et intendance avec un concierge dédié.' },
    ],
  }),
  component: Home,
})

function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <HowItWorks />
      <Services />
      <Stats />
      <Pricing />
      <Testimonial />
      <CTAFinal />
      <Footer />
    </>
  )
}
