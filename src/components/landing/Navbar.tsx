import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Gauge, Menu, X } from 'lucide-react'
import { useAuth } from '@/lib/useAuth'

const links = [
  { href: '#hero', label: 'Accueil' },
  { href: '#features', label: 'Services' },
  { href: '#pricing', label: 'Abonnements' },
]

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const { user } = useAuth()

  const scrollTo = (href: string) => {
    setMobileOpen(false)
    const target = document.querySelector(href)
    target?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-background/90 backdrop-blur-xl">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <button onClick={() => scrollTo('#hero')} className="group flex flex-col text-left" aria-label="Retour à l'accueil">
          <span className="font-mono-tracked text-[9px] text-white/40">Private Concierge 24/7</span>
          <span className="mt-0.5 font-display text-2xl font-black italic tracking-tighter text-white">
            AURA<span className="text-primary">.</span>
            <span className="ml-2 border-l border-white/20 pl-2 font-sans text-[10px] font-bold not-italic uppercase tracking-widest text-white/40">Studio</span>
          </span>
        </button>

        <nav className="hidden items-center gap-10 text-[11px] font-bold uppercase tracking-[0.2em] text-white/60 md:flex">
          {links.map((link) => (
            <button key={link.href} onClick={() => scrollTo(link.href)} className="transition hover:text-white">
              {link.label}
            </button>
          ))}
          <a href="/espace-client" className="flex items-center gap-1.5 text-primary transition hover:text-accent">
            <Gauge size={13} /> Espace Client
          </a>
        </nav>

        <div className="hidden items-center gap-3 sm:flex">
          <a href="/connexion?mode=login" className="border border-white/15 px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-white/50 transition hover:border-primary hover:text-primary">
            {user ? 'Compte actif' : 'Connexion'}
          </a>
          <a href="/connexion?mode=signup" className="bg-white px-5 py-2.5 text-xs font-black uppercase tracking-widest text-black transition hover:bg-neutral-200">
            Club VIP <span className="ml-1">→</span>
          </a>
        </div>

        <button className="p-2 text-white md:hidden" onClick={() => setMobileOpen((open) => !open)} aria-label="Ouvrir le menu">
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="border-t border-white/10 bg-background md:hidden">
            <nav className="flex flex-col gap-2 px-5 py-5 text-left text-xs font-bold uppercase tracking-[0.18em] text-white/70">
              {links.map((link) => <button key={link.href} onClick={() => scrollTo(link.href)} className="py-2 text-left hover:text-white">{link.label}</button>)}
              <a href="/espace-client" onClick={() => setMobileOpen(false)} className="py-2 text-left text-primary">Espace Client</a>
              <a href="/connexion?mode=signup" onClick={() => setMobileOpen(false)} className="mt-2 bg-white px-4 py-3 text-left text-black">Rejoindre le Club VIP →</a>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

    </header>
  )
}
