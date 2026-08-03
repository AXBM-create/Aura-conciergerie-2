import { motion } from 'framer-motion'

const stats = [
  { value: '< 2 min', label: 'Temps de première réponse' },
  { value: '24 / 7', label: 'Disponibilité, partout' },
  { value: '98 %', label: 'Demandes résolues le jour même' },
  { value: '12 400+', label: 'Membres actifs' },
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

export function Stats() {
  return (
    <section id="preuve" className="border-t border-white/10 py-24 bg-background">
      <div className="max-w-[1180px] mx-auto px-6 md:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-7 md:gap-8 text-center">
          {stats.map((stat, i) => (
            <FadeUp key={stat.label} delay={i * 0.1}>
              <div>
                <div className="font-[DM_Serif_Display] text-[clamp(34px,4.4vw,48px)] text-primary italic mb-1.5">
                  {stat.value}
                </div>
                <div className="text-[12px] text-muted-foreground tracking-wide">
                  {stat.label}
                </div>
              </div>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  )
}
