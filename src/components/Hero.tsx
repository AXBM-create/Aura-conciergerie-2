import React from 'react';

interface HeroProps {
  onShowToast: (msg: string) => void;
  onNavigateToPricing: () => void;
  onOpenChatBubble?: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onShowToast, onNavigateToPricing, onOpenChatBubble }) => {
  return (
    <section id="hero" className="relative pt-12 pb-20 lg:pt-16 lg:pb-28 overflow-hidden flex flex-col items-center justify-center bg-[#050505]">
      
      {/* Subtle Grid Lines Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">

        {/* Centered High-Impact Hero Layout */}
        <div className="max-w-4xl mx-auto text-center space-y-8 flex flex-col items-center">
          
          <div className="inline-flex items-center space-x-2 bg-white/5 border border-white/10 px-4 py-1.5 rounded-full">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-[10px] uppercase tracking-[0.3em] font-mono-tracked text-white/70">
              Conciergerie Privée Aura // 24/7 Available
            </span>
          </div>

          <div className="relative">
            <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black text-white font-syne leading-[0.9] tracking-tighter uppercase">
              Votre Concierge<br />
              <span className="text-transparent text-stroke">Personnel.</span>
            </h1>
            <div className="hidden sm:block absolute -top-4 -right-4 rotate-6 bg-white text-black px-3.5 py-1 text-[10px] font-black uppercase tracking-widest shadow-xl">
              Garantie &lt;45s
            </div>
          </div>

          <p className="text-white/70 text-base sm:text-xl max-w-2xl leading-relaxed font-normal">
            Développé pour orchestrer vos exigences en <span className="text-white italic font-serif">temps réel</span>. Réservations d'exception, voyages sur-mesure, livraisons privées et intendance du quotidien.
          </p>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
            <button 
              onClick={() => {
                if (onOpenChatBubble) {
                  onOpenChatBubble();
                } else {
                  onShowToast('Ouvrez la bulle en bas à droite pour discuter.');
                }
              }}
              className="w-full sm:w-auto bg-white text-black hover:bg-neutral-200 font-black text-xs uppercase tracking-widest px-8 py-4 transition text-center shadow-xl flex items-center justify-center gap-3"
            >
              <i className="fa-solid fa-comments text-brand-orange text-sm"></i>
              <span>Lancer une demande en direct 💬</span>
            </button>
            
            <button 
              onClick={onNavigateToPricing}
              className="w-full sm:w-auto bg-transparent hover:bg-white/5 text-white font-bold text-xs uppercase tracking-widest px-8 py-4 transition border border-white/20 text-center flex items-center justify-center gap-2"
            >
              <span>Découvrir les Abonnements</span>
              <span className="text-white/40">→</span>
            </button>
          </div>

          {/* Key Feature Cards Grid */}
          <div className="pt-12 w-full grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
            <div className="bg-[#0b0b0e] border border-white/10 p-5 space-y-2 hover:border-white/20 transition">
              <div className="text-brand-orange text-lg">
                <i className="fa-solid fa-bolt"></i>
              </div>
              <h3 className="text-sm font-black text-white font-syne uppercase tracking-wider">Réponse Instantanée</h3>
              <p className="text-xs text-white/50 leading-relaxed">
                Prise en charge de vos requêtes en moins de 45 secondes par notre réseau de concierges.
              </p>
            </div>

            <div className="bg-[#0b0b0e] border border-white/10 p-5 space-y-2 hover:border-white/20 transition">
              <div className="text-brand-orange text-lg">
                <i className="fa-solid fa-user-tie"></i>
              </div>
              <h3 className="text-sm font-black text-white font-syne uppercase tracking-wider">Humain + Intelligences</h3>
              <p className="text-xs text-white/50 leading-relaxed">
                Concierge humain dédié assisté par le moteur Aura pour traiter vos demandes sur-mesure.
              </p>
            </div>

            <div className="bg-[#0b0b0e] border border-white/10 p-5 space-y-2 hover:border-white/20 transition">
              <div className="text-brand-orange text-lg">
                <i className="fa-solid fa-shield-halved"></i>
              </div>
              <h3 className="text-sm font-black text-white font-syne uppercase tracking-wider">Confidentialité Totale</h3>
              <p className="text-xs text-white/50 leading-relaxed">
                Canaux sécurisés 24/7 via WhatsApp, bulle de discussion et ligne directe réservée.
              </p>
            </div>
          </div>

          {/* Social Proof / Metadata Footer Bar */}
          <div className="pt-6 border-t border-white/10 w-full flex flex-wrap items-center justify-center gap-6 text-[10px] uppercase tracking-widest text-white/50 font-mono-tracked">
            <div className="flex items-center space-x-1 text-amber-400">
              <i className="fa-solid fa-star"></i>
              <i className="fa-solid fa-star"></i>
              <i className="fa-solid fa-star"></i>
              <i className="fa-solid fa-star"></i>
              <i className="fa-solid fa-star"></i>
              <span className="text-white font-bold ml-1">4.9/5</span>
            </div>
            <span>//</span>
            <span>+12,400 Membres</span>
            <span>//</span>
            <span className="text-emerald-400 font-bold flex items-center gap-1">
              ⏱ ~18h Économisées / Mois
            </span>
          </div>

        </div>

      </div>
    </section>
  );
};
