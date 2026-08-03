import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#050505] text-white py-16 border-t border-white/10 font-mono-tracked">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 pb-12 border-b border-white/10">
          <div>
            <span className="font-black text-3xl font-syne text-white uppercase tracking-tighter">
              AURA<span className="text-brand-orange">.</span>
            </span>
            <p className="text-[10px] text-white/40 uppercase tracking-[0.3em] mt-1">
              Private Concierge 24/7 // Paris • London • New York • Dubai
            </p>
          </div>
          <div className="flex items-center space-x-8 text-[10px] uppercase tracking-widest text-white/60">
            <a href="/" className="hover:text-white transition">Accueil</a>
            <a href="#features" className="hover:text-white transition">Services</a>
            <a href="#pricing" className="hover:text-white transition">Club</a>
            <a href="#" onClick={(e) => e.preventDefault()} className="hover:text-white transition">Confidentialité</a>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-[10px] uppercase tracking-widest text-white/40 gap-4">
          <div>© 2026 AURA CONCIERGE. ALL RIGHTS RESERVED.</div>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>STATUS: 100% OPERATIONAL // 24/7 NETWORK</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
