export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-background py-16 text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-8 border-b border-white/10 pb-12 md:flex-row">
          <div>
            <span className="font-display text-3xl font-black uppercase tracking-tighter">AURA<span className="text-primary">.</span></span>
            <p className="mt-1 font-mono-tracked text-[10px] text-white/40">Private Concierge 24/7 // Paris · London · New York · Dubai</p>
          </div>
          <div className="flex items-center gap-8 font-mono-tracked text-[10px] text-white/60">
            <a href="#hero" className="transition hover:text-white">Accueil</a>
            <a href="#features" className="transition hover:text-white">Services</a>
            <a href="#pricing" className="transition hover:text-white">Club</a>
            <a href="#" onClick={(event) => event.preventDefault()} className="transition hover:text-white">Confidentialité</a>
          </div>
        </div>
        <div className="flex flex-col items-center justify-between gap-4 pt-8 font-mono-tracked text-[10px] text-white/40 sm:flex-row">
          <div>© 2026 AURA CONCIERGE. ALL RIGHTS RESERVED.</div>
          <div className="flex items-center gap-2"><span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" /> STATUS: 100% OPERATIONAL // 24/7 NETWORK</div>
        </div>
      </div>
    </footer>
  )
}
