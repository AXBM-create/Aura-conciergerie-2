import { motion } from 'framer-motion'

export function Testimonial() {
  return (
    <section id="temoignage" className="border-t border-white/10 bg-background py-24">
      <div className="max-w-[1180px] mx-auto px-6 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7, ease: [0.21, 0.47, 0.32, 0.98] }}
          className="max-w-[760px] mx-auto text-center"
        >
          <div className="font-[DM_Serif_Display] text-[64px] text-primary/20 leading-none mb-2">
            &ldquo;
          </div>
          <p className="font-[Cormorant_Garamond] italic text-[clamp(22px,2.6vw,30px)] text-foreground leading-relaxed mb-7">
            J&apos;ai demandé une table introuvable à 19 h pour 20 h. AURA m&apos;a confirmé une réservation en quatre minutes — sans que j&apos;aie eu à passer un seul appel.
          </p>
          <div className="flex items-center justify-center gap-3">
            <div className="w-[38px] h-[38px] rounded-full bg-foreground flex items-center justify-center text-accent font-[Cormorant_Garamond] text-sm">
              M
            </div>
            <div className="text-left">
              <strong className="text-[13px] text-foreground block">Marianne L.</strong>
              <small className="text-[11.5px] text-muted-foreground">Membre Premium depuis 2025</small>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
