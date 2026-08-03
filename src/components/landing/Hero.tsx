import { motion } from 'framer-motion'
import { ArrowRight, Bolt, MessageCircle, ShieldCheck, UserRound } from 'lucide-react'
import { useState } from 'react'
import { AuthModal } from './AuthModal'

const proofCards = [
  { icon: Bolt, title: 'Réponse Instantanée', text: 'Prise en charge de vos requêtes en moins de 45 secondes par notre réseau de concierges.' },
  { icon: UserRound, title: 'Humain + Intelligence', text: 'Concierge humain dédié assisté par le moteur Aura pour traiter vos demandes sur-mesure.' },
  { icon: ShieldCheck, title: 'Confidentialité Totale', text: 'Canaux sécurisés 24/7 via WhatsApp, bulle de discussion et ligne directe réservée.' },
]

export function Hero() {
  const [authMode, setAuthMode] = useState<'login' | 'signup' | null>(null)
  const scrollTo = (href: string) => document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' })

  return (
    <section id="hero" className="relative flex min-h-[calc(100vh-80px)] flex-col items-center justify-center overflow-hidden bg-background py-16 lg:py-24">
      <div className="aura-grid pointer-events-none absolute inset-0 opacity-80" />
      <div className="pointer-events-none absolute left-1/2 top-1/3 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-primary/10 blur-[130px]" />

      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="mx-auto flex max-w-4xl flex-col items-center space-y-8 text-center">
          <div className="gradient-badge inline-flex items-center gap-2 rounded-full px-4 py-1.5">
            <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
            <span className="font-mono-tracked text-[10px] text-white/70">Conciergerie Privée AURA // 24/7 Available</span>
          </div>

          <div className="relative">
            <h1 className="font-display text-5xl font-black uppercase leading-[0.9] tracking-tighter text-white sm:text-7xl lg:text-8xl">
              Votre Concierge<br />
              <span className="text-stroke">Personnel.</span>
            </h1>
            <span className="absolute -right-4 -top-5 hidden rotate-6 bg-white px-3.5 py-1 text-[10px] font-black uppercase tracking-widest text-black shadow-xl sm:block">Garantie &lt;45s</span>
          </div>

          <p className="max-w-2xl text-base leading-relaxed text-white/70 sm:text-xl">
            Développé pour orchestrer vos exigences en <em className="font-serif text-white">temps réel</em>. Réservations d&apos;exception, voyages sur-mesure, livraisons privées et intendance du quotidien.
          </p>

          <div className="flex w-full flex-col items-center justify-center gap-4 pt-2 sm:w-auto sm:flex-row">
            <button onClick={() => setAuthMode('signup')} className="flex w-full items-center justify-center gap-3 bg-white px-8 py-4 text-xs font-black uppercase tracking-widest text-black shadow-xl transition hover:bg-neutral-200 sm:w-auto">
              <MessageCircle size={15} className="text-primary" /> Réserver une demande
            </button>
            <button onClick={() => scrollTo('#pricing')} className="flex w-full items-center justify-center gap-2 border border-white/20 bg-transparent px-8 py-4 text-xs font-bold uppercase tracking-widest text-white transition hover:bg-white/5 sm:w-auto">
              Découvrir les abonnements <ArrowRight size={14} className="text-white/40" />
            </button>
          </div>

          <div id="client" className="grid w-full grid-cols-1 gap-4 pt-10 text-left md:grid-cols-3">
            {proofCards.map(({ icon: Icon, title, text }) => (
              <div key={title} className="glass-card-hover border border-white/10 bg-card p-5 transition">
                <Icon size={21} className="mb-4 text-primary" />
                <h3 className="mb-2 font-display text-sm font-black uppercase tracking-wider text-white">{title}</h3>
                <p className="text-xs leading-relaxed text-white/50">{text}</p>
              </div>
            ))}
          </div>

          <div className="flex w-full flex-wrap items-center justify-center gap-5 border-t border-white/10 pt-6 font-mono-tracked text-[10px] text-white/50">
            <span className="text-amber-400">★★★★★ <strong className="ml-1 text-white">4.9/5</strong></span>
            <span>//</span><span>+12 400 membres</span><span>//</span><span className="font-bold text-emerald-400">~18h économisées / mois</span>
          </div>
        </motion.div>
      </div>
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
