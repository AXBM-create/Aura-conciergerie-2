import { motion } from 'framer-motion'

const services = [
  { icon: '🍽️', title: 'Restaurants', desc: 'Réservations, tables de dernière minute, adresses sur-mesure selon vos goûts.' },
  { icon: '🚘', title: 'Transport', desc: 'Chauffeurs privés, navettes aéroport, location — organisés en quelques messages.' },
  { icon: '🏨', title: 'Séjours & hôtels', desc: 'Surclassements, demandes spéciales, prolongations négociées pour vous.' },
  { icon: '🎟️', title: 'Expériences', desc: 'Billets, accès privilégiés, activités locales que vous ne trouverez pas seul.' },
  { icon: '📦', title: 'Livraisons', desc: 'Courses, colis urgents, objets oubliés — récupérés et livrés où il faut.' },
  { icon: '🔧', title: 'Imprévus', desc: 'Une panne, une urgence du quotidien : un technicien dépêché rapidement.' },
  { icon: '🎁', title: 'Cadeaux & attentions', desc: 'Fleurs, surprises, attentions livrées pour une occasion qui compte.' },
  { icon: '💬', title: 'Conseil local', desc: 'Les recommandations d\'un habitant, pas d\'un guide touristique générique.' },
]

function FadeUp({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.55, delay, ease: [0.21, 0.47, 0.32, 0.98] }}
    >
      {children}
    </motion.div>
  )
}

export function Services() {
  return (
    <section id="services" className="py-24 bg-background">
      <div className="max-w-[1180px] mx-auto px-6 md:px-8">
        <FadeUp>
          <div className="mb-14">
            <span className="text-[11px] tracking-[2.5px] uppercase text-primary font-semibold mb-4 block">
              Le périmètre
            </span>
            <h2 className="font-[DM_Serif_Display] font-normal text-[clamp(30px,3.6vw,44px)] text-foreground leading-[1.18] max-w-[680px] mb-4">
              Tout ce qu&apos;un <em className="italic text-primary">bon concierge</em> sait gérer.
            </h2>
            <p className="text-[15.5px] text-muted-foreground max-w-[540px] leading-relaxed">
              Et tout ce que vous n&apos;avez pas le temps — ou l&apos;envie — d&apos;organiser vous-même.
            </p>
          </div>
        </FadeUp>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {services.map((svc, i) => (
            <FadeUp key={svc.title} delay={i * 0.05}>
              <div className="bg-card border border-border rounded-[22px] p-6 transition-all duration-200 shadow-sm hover:-translate-y-1 hover:shadow-md hover:border-gold-line">
                <div className="w-11 h-11 rounded-xl bg-gold-dim border border-gold-line flex items-center justify-center text-[19px] mb-4">
                  {svc.icon}
                </div>
                <h4 className="text-[14.5px] font-semibold text-foreground mb-1.5">{svc.title}</h4>
                <p className="text-[12.5px] text-muted-foreground leading-relaxed">{svc.desc}</p>
              </div>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  )
}
