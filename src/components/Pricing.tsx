import React from 'react';

interface PricingProps {
  onSelectPackage: (pkgName: string) => void;
}

export const Pricing: React.FC<PricingProps> = ({ onSelectPackage }) => {
  return (
    <section id="pricing" className="py-24 bg-[#050505] relative border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
          <span className="text-[10px] uppercase tracking-[0.3em] font-mono-tracked text-white/40">
            Grille Tarifaire // 2026
          </span>
          <h2 className="text-4xl sm:text-5xl font-black text-white font-syne uppercase tracking-tighter">
            Formules d'Abonnement <span className="text-transparent text-stroke font-syne">Club</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          
          {/* Package 1 */}
          <div className="bg-[#0b0b0e] p-8 flex flex-col justify-between border border-white/10 relative group">
            <div>
              <div className="text-[10px] font-bold uppercase tracking-widest text-white/40 font-mono-tracked mb-2">Basic // 01</div>
              <h3 className="text-2xl font-black text-white font-syne uppercase">Découverte</h3>
              <div className="my-6 flex items-baseline gap-1">
                <span className="text-4xl sm:text-5xl font-black text-white font-syne">0€</span>
                <span className="text-white/40 text-xs font-mono-tracked"> / mois</span>
              </div>
              <ul className="space-y-3 text-xs text-white/70 mb-8 border-t border-white/10 pt-6">
                <li className="flex items-center gap-2.5"><span className="text-brand-orange">✓</span> 5 demandes de conciergerie / mois</li>
                <li className="flex items-center gap-2.5"><span className="text-brand-orange">✓</span> Recherche de voyages & restaurants</li>
              </ul>
            </div>
            <button 
              onClick={() => onSelectPackage('Basic')} 
              className="w-full bg-white/10 hover:bg-white hover:text-black text-white font-bold py-3.5 text-xs uppercase tracking-widest transition"
            >
              Commencer Gratuitement
            </button>
          </div>

          {/* Package 2 - Highlighted */}
          <div className="bg-[#0e0e12] p-8 flex flex-col justify-between border-2 border-brand-orange relative shadow-2xl scale-105 z-10">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-brand-orange text-white text-[9px] font-black uppercase tracking-[0.2em] px-4 py-1 shadow-md">
              ★ Recommandé
            </div>
            <div>
              <div className="text-[10px] font-bold uppercase tracking-widest text-brand-orange font-mono-tracked mb-2">Standard // 02</div>
              <h3 className="text-2xl font-black text-white font-syne uppercase">Concierge Premium</h3>
              <div className="my-6 flex items-baseline gap-1">
                <span className="text-4xl sm:text-5xl font-black text-white font-syne">29,99€</span>
                <span className="text-white/40 text-xs font-mono-tracked"> / mois</span>
              </div>
              <ul className="space-y-3 text-xs text-white/90 mb-8 border-t border-white/10 pt-6">
                <li className="flex items-center gap-2.5"><span className="text-brand-orange">✓</span> Demandes Illimitées 24/7</li>
                <li className="flex items-center gap-2.5"><span className="text-brand-orange">✓</span> Concierge Humain Dédié (Appels & Suivi)</li>
                <li className="flex items-center gap-2.5"><span className="text-brand-orange">✓</span> WhatsApp & Notes Vocales Directes</li>
              </ul>
            </div>
            <a 
              href="https://buy.stripe.com/test_aFa7sK9i2gf5gidbk62wU00" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="w-full gradient-btn-orange text-white font-bold py-3.5 rounded-2xl transition text-sm text-center block"
            >
              S'abonner (29,99€ / mois)
            </a>
          </div>

          {/* Package 3 */}
          <div className="bg-[#0b0b0e] p-8 flex flex-col justify-between border border-white/10 relative group">
            <div>
              <div className="text-[10px] font-bold uppercase tracking-widest text-white/40 font-mono-tracked mb-2">VIP // 03</div>
              <h3 className="text-2xl font-black text-white font-syne uppercase">VIP & Famille</h3>
              <div className="my-6 flex items-baseline gap-1">
                <span className="text-4xl sm:text-5xl font-black text-white font-syne">69,99€</span>
                <span className="text-white/40 text-xs font-mono-tracked"> / mois</span>
              </div>
              <ul className="space-y-3 text-xs text-white/70 mb-8 border-t border-white/10 pt-6">
                <li className="flex items-center gap-2.5"><span className="text-brand-orange">✓</span> Tout l'Abonnement Premium</li>
                <li className="flex items-center gap-2.5"><span className="text-brand-orange">✓</span> Concierge Humain Dédié Exclusif</li>
              </ul>
            </div>
            <button 
              onClick={() => onSelectPackage('Premium')} 
              className="w-full bg-white text-black hover:bg-neutral-200 font-black py-3.5 text-xs uppercase tracking-widest transition"
            >
              Rejoindre le Club VIP
            </button>
          </div>

        </div>
      </div>
    </section>
  );
};
