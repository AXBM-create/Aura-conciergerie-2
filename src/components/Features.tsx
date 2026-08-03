import React from 'react';

export const Features: React.FC = () => {
  return (
    <section id="features" className="py-24 relative bg-[#050505] border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
          <span className="text-[10px] uppercase tracking-[0.3em] font-mono-tracked text-white/40">
            Périmètre d'Intervention
          </span>
          <h2 className="text-4xl sm:text-5xl font-black text-white font-syne uppercase tracking-tighter">
            Services & Expertise <span className="text-transparent text-stroke font-syne">24/7</span>
          </h2>
          <p className="text-white/60 text-sm sm:text-base leading-relaxed max-w-xl mx-auto">
            De l'imprévu de dernière minute aux expériences d'exception, confiez chaque détails à votre concierge dédié.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          
          {/* Card 1 */}
          <div className="bg-[#0b0b0e] border border-white/10 p-8 hover:border-brand-orange/50 transition-all duration-300 group relative">
            <div className="flex justify-between items-start mb-6">
              <div className="w-12 h-12 bg-white/5 border border-white/10 text-brand-orange flex items-center justify-center text-xl font-bold">
                <i className="fa-solid fa-plane-departure"></i>
              </div>
              <span className="text-[10px] uppercase tracking-widest text-white/30 font-mono-tracked">01 // VOYAGE</span>
            </div>
            <h3 className="text-xl font-black text-white font-syne uppercase tracking-tight mb-3">Escapades Sur-Mesure</h3>
            <p className="text-white/60 text-xs sm:text-sm leading-relaxed">
              Vols privatifs, surclassements hôteliers négociés, itinéraires d'exception et assistance francophone continue sur place.
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-[#0b0b0e] border border-white/10 p-8 hover:border-brand-orange/50 transition-all duration-300 group relative">
            <div className="flex justify-between items-start mb-6">
              <div className="w-12 h-12 bg-white/5 border border-white/10 text-amber-400 flex items-center justify-center text-xl font-bold">
                <i className="fa-solid fa-utensils"></i>
              </div>
              <span className="text-[10px] uppercase tracking-widest text-white/30 font-mono-tracked">02 // SORTIES</span>
            </div>
            <h3 className="text-xl font-black text-white font-syne uppercase tracking-tight mb-3">Gastronomie & Culture</h3>
            <p className="text-white/60 text-xs sm:text-sm leading-relaxed">
              Tables réservées dans les restaurants étoilés complets, carrés or pour concerts, soirées VIP et accès privés exclusifs.
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-[#0b0b0e] border border-white/10 p-8 hover:border-brand-orange/50 transition-all duration-300 group relative">
            <div className="flex justify-between items-start mb-6">
              <div className="w-12 h-12 bg-white/5 border border-white/10 text-indigo-400 flex items-center justify-center text-xl font-bold">
                <i className="fa-solid fa-bag-shopping"></i>
              </div>
              <span className="text-[10px] uppercase tracking-widest text-white/30 font-mono-tracked">03 // INTENDANCE</span>
            </div>
            <h3 className="text-xl font-black text-white font-syne uppercase tracking-tight mb-3">Shopping & Logistique</h3>
            <p className="text-white/60 text-xs sm:text-sm leading-relaxed">
              Trouvez des pièces de collection rares, des cadeaux d'exception, orchestrez vos livraisons urgentes et démarches quotidiennes.
            </p>
          </div>

        </div>
      </div>
    </section>
  );
};
