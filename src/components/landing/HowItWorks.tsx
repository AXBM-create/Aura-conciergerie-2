import { motion } from 'framer-motion'
import { BriefcaseBusiness, Plane, ShoppingBag } from 'lucide-react'

const features = [
  { number: '01 // VOYAGE', icon: Plane, color: 'text-primary', title: 'Escapades Sur-Mesure', text: 'Vols privatifs, surclassements hôteliers négociés, itinéraires d\'exception et assistance francophone continue sur place.' },
  { number: '02 // SORTIES', icon: BriefcaseBusiness, color: 'text-amber-400', title: 'Gastronomie & Culture', text: 'Tables réservées dans les restaurants étoilés complets, carrés or pour concerts, soirées VIP et accès privés exclusifs.' },
  { number: '03 // INTENDANCE', icon: ShoppingBag, color: 'text-indigo-400', title: 'Shopping & Logistique', text: 'Trouvez des pièces de collection rares, des cadeaux d\'exception, orchestrez vos livraisons urgentes et démarches quotidiennes.' },
]

export function HowItWorks() {
  return (
    <section id="features" className="relative border-t border-white/10 bg-background py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="mx-auto mb-16 max-w-3xl space-y-4 text-center">
          <span className="font-mono-tracked text-[10px] text-white/40">Périmètre d&apos;Intervention</span>
          <h2 className="font-display text-4xl font-black uppercase tracking-tighter text-white sm:text-5xl">Services & Expertise <span className="text-stroke">24/7</span></h2>
          <p className="mx-auto max-w-xl text-sm leading-relaxed text-white/60 sm:text-base">De l&apos;imprévu de dernière minute aux expériences d&apos;exception, confiez chaque détail à votre concierge dédié.</p>
        </motion.div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {features.map(({ number, icon: Icon, color, title, text }, index) => (
            <motion.article key={title} initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.55, delay: index * 0.08 }} className="glass-card-hover group relative border border-white/10 bg-card p-8">
              <div className="mb-6 flex items-start justify-between"><div className="flex h-12 w-12 items-center justify-center border border-white/10 bg-white/5"><Icon size={21} className={color} /></div><span className="font-mono-tracked text-[10px] text-white/30">{number}</span></div>
              <h3 className="mb-3 font-display text-xl font-black uppercase tracking-tight text-white">{title}</h3>
              <p className="text-xs leading-relaxed text-white/60 sm:text-sm">{text}</p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}
