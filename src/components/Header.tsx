import React from 'react';

interface HeaderProps {
  currentPath: string;
  isLoggedIn: boolean;
  onNavigate: (path: string) => void;
  onOpenAuthModal: (type: 'login' | 'signup', pkgName?: string) => void;
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentPath,
  isLoggedIn,
  onNavigate,
  onOpenAuthModal,
  onLogout,
}) => {
  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-[#050505]/90 border-b border-white/10 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Logo Bold Typography */}
        <a 
          href="/" 
          onClick={(e) => { e.preventDefault(); onNavigate('/'); }} 
          className="flex flex-col group"
        >
          <span className="text-[9px] uppercase tracking-[0.3em] text-white/40 font-mono-tracked">Private Concierge 24/7</span>
          <div className="flex items-center space-x-2 mt-0.5">
            <span className="font-black text-2xl tracking-tighter text-white font-syne italic">
              AURA<span className="text-brand-orange">.</span>
            </span>
            <span className="text-[10px] font-bold uppercase tracking-widest text-white/40 border-l border-white/20 pl-2">
              Studio
            </span>
          </div>
        </a>

        {/* Navigation Links with Bold Tracked Typography */}
        <nav className="hidden md:flex items-center space-x-10 text-[11px] uppercase tracking-[0.2em] font-bold text-white/60">
          <a 
            href="/" 
            onClick={(e) => { e.preventDefault(); onNavigate('/'); }} 
            className={`hover:text-white transition ${currentPath === '/' ? 'text-white underline underline-offset-8' : ''}`}
          >
            Accueil
          </a>
          <a 
            href="#features" 
            onClick={(e) => { e.preventDefault(); onNavigate('/#features'); }} 
            className="hover:text-white transition"
          >
            Services
          </a>
          <a 
            href="#pricing" 
            onClick={(e) => { e.preventDefault(); onNavigate('/#pricing'); }} 
            className="hover:text-white transition"
          >
            Abonnements
          </a>
          <a 
            href="/profil" 
            onClick={(e) => { e.preventDefault(); onNavigate('/profil'); }} 
            className={`text-brand-orange hover:text-amber-400 transition font-extrabold flex items-center gap-1.5 ${currentPath === '/profil' ? 'underline underline-offset-8' : ''}`}
          >
            <i className="fa-solid fa-gauge-high"></i> Espace Client
          </a>
        </nav>

        {/* Action Buttons */}
        <div className="flex items-center space-x-3">
          {!isLoggedIn ? (
            <button 
              onClick={() => onOpenAuthModal('login')} 
              className="hidden sm:inline-flex text-white/70 hover:text-white font-bold text-xs uppercase tracking-wider px-4 py-2.5 rounded-none border-l border-white/20 transition items-center gap-2"
            >
              <i className="fa-solid fa-right-to-bracket text-brand-orange"></i>
              <span>Connexion</span>
            </button>
          ) : (
            <button 
              onClick={onLogout} 
              className="text-white/50 hover:text-rose-400 font-bold text-[10px] uppercase tracking-wider px-3 py-2 border border-white/15 transition flex items-center gap-1.5"
            >
              <i className="fa-solid fa-power-off"></i>
              <span>Déconnexion</span>
            </button>
          )}

          <button 
            onClick={() => onOpenAuthModal('signup')} 
            className="bg-white text-black hover:bg-neutral-200 font-black text-xs uppercase tracking-widest px-5 py-2.5 transition flex items-center gap-2 shadow-lg"
          >
            <span>Club VIP</span>
            <span className="text-black text-xs">→</span>
          </button>
        </div>
      </div>
    </header>
  );
};
