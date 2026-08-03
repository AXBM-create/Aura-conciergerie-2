import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { useState } from 'react'
import { AuthModal } from './AuthModal'

export function CTAFinal() {
  const [authMode, setAuthMode] = useState<'login' | 'signup' | null>(null)
  const scrollTo = (href: string) => {
    const el = document.querySelector(href)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section id="cta-final" className="relative overflow-hidden border-t border-white/10 bg-background py-28">
      <div className="absolute top-[-40%] left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-[radial-gradient(circle,rgba(184,151,90,0.12)_0%,transparent_65%)] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.7, ease: [0.21, 0.47, 0.32, 0.98] }}
        className="max-w-[1180px] mx-auto px-6 md:px-8 text-center relative z-10"
      >
        <h2 className="font-[DM_Serif_Display] font-normal text-[clamp(32px,4.4vw,50px)] text-white leading-[1.15] mb-4">
          Le compte à rebours a commencé. <em className="italic text-accent">Soyez parmi les premiers.</em>
        </h2>
        <p className="text-[15.5px] text-muted-foreground mb-9 max-w-[480px] mx-auto">
          Aucune carte bancaire requise pour réserver votre place. Votre forfait sera activé automatiquement dès l&apos;ouverture.
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <button
            onClick={() => setAuthMode('signup')}
            className="bg-primary text-white border-none rounded-2xl px-8 py-4 text-[14.5px] font-bold tracking-wide cursor-pointer transition-all duration-200 hover:bg-accent hover:-translate-y-0.5 hover:shadow-[0_14px_36px_rgba(184,151,90,0.28)]"
          >
            Réserver mon accès
          </button>
          <button
            onClick={() => scrollTo('#features')}
            className="bg-transparent text-white border border-white/20 rounded-2xl px-7 py-4 text-[14.5px] font-medium cursor-pointer flex items-center gap-2 transition-all duration-200 hover:border-gold-line hover:text-accent"
          >
            En savoir plus
            <ArrowRight size={14} />
          </button>
        </div>
      </motion.div>
      {authMode && (
        <AuthModal
          mode={authMode}
          onModeChange={setAuthMode}
          onClose={() => setAuthMode(null)}
          onAuthenticated={() => setAuthMode(null)}
        />
      )}
    </section>
  )
}
