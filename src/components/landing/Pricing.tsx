import { motion } from 'framer-motion'
import { Check, Star } from 'lucide-react'

const plans = [
  { label: 'Basic // 01', name: 'Découverte', price: '0€', features: ['5 demandes de conciergerie / mois', 'Recherche de voyages & restaurants'], button: 'Commencer gratuitement' },
  { label: 'Standard // 02', name: 'Concierge Premium', price: '29,99€', featured: true, features: ['Demandes illimitées 24/7', 'Concierge humain dédié (appels & suivi)', 'WhatsApp & notes vocales directes'], button: "S'abonner (29,99€ / mois)" },
  { label: 'VIP // 03', name: 'VIP & Famille', price: '69,99€', features: ["Tout l'abonnement Premium", 'Concierge humain dédié exclusif'], button: 'Rejoindre le Club VIP' },
]

export function Pricing() {
  return (
    <section id="pricing" className="relative border-t border-white/10 bg-background py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="mx-auto mb-16 max-w-3xl space-y-4 text-center">
          <span className="font-mono-tracked text-[10px] text-white/40">Grille Tarifaire // 2026</span>
          <h2 className="font-display text-4xl font-black uppercase tracking-tighter text-white sm:text-5xl">Formules d&apos;Abonnement <span className="text-stroke">Club</span></h2>
        </motion.div>

        <div className="grid grid-cols-1 items-stretch gap-8 md:grid-cols-3">
          {plans.map((plan, index) => (
            <motion.article key={plan.name} initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.55, delay: index * 0.08 }} className={`relative flex flex-col justify-between border p-8 ${plan.featured ? 'z-10 border-2 border-primary bg-[#0e0e12] shadow-2xl md:scale-105' : 'border-white/10 bg-card'}`}>
              {plan.featured && <span className="absolute -top-3 left-1/2 flex -translate-x-1/2 items-center gap-1 bg-primary px-4 py-1 text-[9px] font-black uppercase tracking-[0.2em] text-white"><Star size={10} fill="currentColor" /> Recommandé</span>}
              <div>
                <div className={`font-mono-tracked mb-2 text-[10px] font-bold ${plan.featured ? 'text-primary' : 'text-white/40'}`}>{plan.label}</div>
                <h3 className="font-display text-2xl font-black uppercase text-white">{plan.name}</h3>
                <div className="my-6 flex items-baseline gap-1"><span className="font-display text-4xl font-black text-white sm:text-5xl">{plan.price}</span><span className="font-mono-tracked text-xs text-white/40">/ mois</span></div>
                <ul className="mb-8 space-y-3 border-t border-white/10 pt-6 text-xs text-white/75">
                  {plan.features.map((feature) => <li key={feature} className="flex items-center gap-2.5"><Check size={14} className="text-primary" />{feature}</li>)}
                </ul>
              </div>
              <a href="/connexion?mode=signup" className={`flex w-full items-center justify-center py-3.5 text-xs font-bold uppercase tracking-widest transition ${plan.featured ? 'rounded-2xl bg-primary text-white hover:bg-orange-600' : 'bg-white/10 text-white hover:bg-white hover:text-black'}`}>{plan.button}</a>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}