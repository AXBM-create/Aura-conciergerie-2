import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { motion } from 'motion/react';

interface AuthModalProps {
  isOpen: boolean;
  type: 'login' | 'signup';
  packageName?: string;
  onClose: () => void;
  onSuccess: (data?: { firstName: string; lastName: string; email: string; phone: string; packageName?: string }) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  type,
  packageName,
  onClose,
  onSuccess,
}) => {
  const [mode, setMode] = useState<'login' | 'signup'>(type || 'signup');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('alexandre.dupont@exemple.com');
  const [phone, setPhone] = useState('+33 6 12 34 56 78');
  const [password, setPassword] = useState('••••••••');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccessState, setIsSuccessState] = useState(false);

  if (!isOpen) return null;

  const triggerConfetti = () => {
    confetti({
      particleCount: 90,
      spread: 75,
      origin: { y: 0.5 },
      colors: ['#ff6b00', '#10b981', '#ffffff', '#fbbf24', '#6366f1'],
    });

    setTimeout(() => {
      confetti({
        particleCount: 50,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#ff6b00', '#10b981', '#ffffff'],
      });
      confetti({
        particleCount: 50,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#ff6b00', '#10b981', '#ffffff'],
      });
    }, 250);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (mode === 'login' && !packageName) {
      // Direct login for existing members - sync with Supabase and grant dashboard access
      try {
        await fetch('/api/register-client', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            firstName: firstName || 'Membre',
            lastName: lastName || 'Aura',
            email,
            phone,
            packageName: 'Formule Existante',
          }),
        });
      } catch (e) {
        console.error("Erreur enregistrement Supabase login:", e);
      }

      setTimeout(() => {
        setIsLoading(false);
        onSuccess({ 
          firstName: firstName || 'Membre', 
          lastName: lastName || 'Aura', 
          email, 
          phone, 
          packageName 
        });
      }, 500);
      return;
    }

    let redirectUrl = '';

    try {
      if (mode === 'signup' || packageName) {
        // Submit registration data to backend for checkout session
        const response = await fetch('/api/create-checkout-session', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            firstName,
            lastName,
            email,
            phone,
            packageName: packageName || 'Concierge Premium (29,99€/mois)',
          }),
        });

        const data = await response.json();
        if (data.checkoutUrl) {
          redirectUrl = data.checkoutUrl;
        }
      }
      
      // Trigger festive confirmation sequence
      setIsSuccessState(true);
      triggerConfetti();

      // Pause briefly for user to experience the confirmation & confetti
      setTimeout(() => {
        if (redirectUrl) {
          window.location.href = redirectUrl;
        } else {
          onSuccess({ firstName, lastName, email, phone, packageName });
          setIsSuccessState(false);
        }
      }, 2000);

    } catch (err) {
      console.error('Subscription error:', err);
      setIsSuccessState(true);
      triggerConfetti();
      setTimeout(() => {
        onSuccess({ firstName, lastName, email, phone, packageName });
        setIsSuccessState(false);
      }, 1800);
    } finally {
      setIsLoading(false);
    }
  };

  const getModalTitle = () => {
    if (packageName) return `Abonnement ${packageName}`;
    return mode === 'login' ? 'Connexion Espace Client' : 'Inscription Club Aura Concierge';
  };

  const handleCloseModal = () => {
    setIsSuccessState(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#0b0b0e] border border-white/20 max-w-lg w-full p-6 sm:p-8 relative shadow-2xl my-8 overflow-hidden">
        
        {/* Close Button */}
        <button 
          onClick={handleCloseModal} 
          className="absolute top-4 right-4 text-white/40 hover:text-white p-2 transition z-20"
        >
          <i className="fa-solid fa-xmark text-lg"></i>
        </button>

        {isSuccessState ? (
          /* Success & Check Animation Overlay */
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="py-10 text-center flex flex-col items-center justify-center space-y-6"
          >
            {/* Animated Checkmark Circle */}
            <motion.div 
              initial={{ scale: 0, rotate: -45 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
              className="w-24 h-24 rounded-full bg-emerald-500/10 border-2 border-emerald-500 flex items-center justify-center relative shadow-[0_0_50px_rgba(16,185,129,0.4)]"
            >
              <svg 
                className="w-12 h-12 text-emerald-400" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <motion.path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth="3" 
                  d="M5 13l4 4L19 7"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                />
              </svg>
              <span className="absolute -top-1 -right-1 flex h-4 w-4">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500"></span>
              </span>
            </motion.div>

            <div className="space-y-2 max-w-sm">
              <h3 className="text-2xl font-black text-white font-syne uppercase tracking-tight">
                {firstName ? `Félicitations ${firstName} !` : 'Inscription Confirmée !'}
              </h3>
              <p className="text-xs text-white/70 leading-relaxed font-medium">
                Votre demande d'accès au Club Aura Concierge a bien été enregistrée avec succès.
              </p>
            </div>

            <div className="bg-white/5 border border-white/10 p-3.5 w-full rounded-lg text-left text-xs space-y-1 font-mono-tracked">
              <div className="flex items-center justify-between text-white/60">
                <span>Statut d'accès :</span>
                <span className="text-emerald-400 font-bold uppercase">● Actif & Sécurisé</span>
              </div>
              <div className="flex items-center justify-between text-white/60">
                <span>Formule choisie :</span>
                <span className="text-white font-bold">{packageName || 'Concierge Premium'}</span>
              </div>
            </div>

            {/* Loading / Redirecting Bar */}
            <div className="w-full space-y-2">
              <div className="flex items-center justify-between text-[10px] text-white/40 uppercase tracking-widest font-mono-tracked">
                <span>Redirection Espace Client...</span>
                <span>100%</span>
              </div>
              <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                <motion.div 
                  className="bg-brand-orange h-full"
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 1.8, ease: "easeInOut" }}
                />
              </div>
            </div>
          </motion.div>
        ) : (
          /* Normal Form UI */
          <>
            {/* Modal Header */}
            <div className="text-center mb-6">
              <div className="w-12 h-12 bg-white text-black font-black font-syne text-2xl flex items-center justify-center mx-auto mb-3 shadow-lg">
                A.
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-white font-syne uppercase tracking-tight">
                {getModalTitle()}
              </h3>
              <p className="text-[10px] text-white/50 uppercase tracking-widest font-mono-tracked mt-1 flex items-center justify-center gap-2">
                <span><i className="fa-solid fa-shield-check text-emerald-400"></i> Formulaire Sécurisé</span>
                <span>//</span>
                <span>Chiffrement SSL 256-bit</span>
              </p>
            </div>

            {/* Mode Switcher Tabs */}
            {!packageName && (
              <div className="flex border border-white/10 mb-6 text-xs font-mono-tracked">
                <button
                  type="button"
                  onClick={() => setMode('signup')}
                  className={`flex-1 py-2.5 font-bold uppercase tracking-wider transition ${
                    mode === 'signup' ? 'bg-white text-black' : 'text-white/60 hover:text-white bg-transparent'
                  }`}
                >
                  Inscription (Nouveau Membre)
                </button>
                <button
                  type="button"
                  onClick={() => setMode('login')}
                  className={`flex-1 py-2.5 font-bold uppercase tracking-wider transition ${
                    mode === 'login' ? 'bg-white text-black' : 'text-white/60 hover:text-white bg-transparent'
                  }`}
                >
                  Déjà Membre
                </button>
              </div>
            )}

            {/* Package Summary Badge */}
            {packageName && (
              <div className="bg-[#050505] border border-brand-orange/50 p-3 mb-6 flex items-center justify-between text-xs">
                <div>
                  <span className="text-[9px] text-white/50 uppercase tracking-widest font-mono-tracked block">Formule Sélectionnée</span>
                  <span className="font-black text-white font-syne uppercase text-sm">{packageName}</span>
                </div>
                <div className="text-right">
                  <span className="bg-brand-orange text-white text-[9px] font-black uppercase px-2 py-0.5 font-mono-tracked">
                    RENOUVELABLE
                  </span>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              
              {(mode === 'signup' || packageName) ? (
                <>
                  {/* Prénom & Nom */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-white/80 uppercase tracking-wider text-[10px] font-mono-tracked mb-1">
                        Prénom *
                      </label>
                      <input 
                        type="text" 
                        required 
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        placeholder="Alexandre" 
                        className="w-full bg-[#050505] border border-white/15 px-3.5 py-3 outline-none focus:border-brand-orange text-white font-medium text-xs placeholder-white/20"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-white/80 uppercase tracking-wider text-[10px] font-mono-tracked mb-1">
                        Nom *
                      </label>
                      <input 
                        type="text" 
                        required 
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        placeholder="Dupont" 
                        className="w-full bg-[#050505] border border-white/15 px-3.5 py-3 outline-none focus:border-brand-orange text-white font-medium text-xs placeholder-white/20"
                      />
                    </div>
                  </div>

                  {/* Adresse Email */}
                  <div>
                    <label className="block font-bold text-white/80 uppercase tracking-wider text-[10px] font-mono-tracked mb-1">
                      Adresse Email *
                    </label>
                    <input 
                      type="email" 
                      required 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="alexandre.dupont@exemple.com" 
                      className="w-full bg-[#050505] border border-white/15 px-3.5 py-3 outline-none focus:border-brand-orange text-white font-medium text-xs placeholder-white/20"
                    />
                  </div>

                  {/* Numéro de téléphone */}
                  <div>
                    <label className="block font-bold text-white/80 uppercase tracking-wider text-[10px] font-mono-tracked mb-1">
                      Numéro de Téléphone * (Ligne Concierge)
                    </label>
                    <input 
                      type="tel" 
                      required 
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+33 6 12 34 56 78" 
                      className="w-full bg-[#050505] border border-white/15 px-3.5 py-3 outline-none focus:border-brand-orange text-white font-medium text-xs placeholder-white/20"
                    />
                    <p className="text-[9px] text-white/40 mt-1">Utilisé par votre concierge pour le suivi par SMS & WhatsApp.</p>
                  </div>
                </>
              ) : (
                <>
                  {/* Login Fields */}
                  <div>
                    <label className="block font-bold text-white/80 uppercase tracking-wider text-[10px] font-mono-tracked mb-1">
                      Adresse Email
                    </label>
                    <input 
                      type="email" 
                      required 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="nom@exemple.com" 
                      className="w-full bg-[#050505] border border-white/15 px-3.5 py-3 outline-none focus:border-brand-orange text-white font-medium text-xs"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-white/80 uppercase tracking-wider text-[10px] font-mono-tracked mb-1">
                      Mot de passe
                    </label>
                    <input 
                      type="password" 
                      required 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••" 
                      className="w-full bg-[#050505] border border-white/15 px-3.5 py-3 outline-none focus:border-brand-orange text-white text-xs"
                    />
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-white/50 uppercase tracking-widest font-mono-tracked">
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input type="checkbox" defaultChecked className="rounded border-white/20 bg-black text-brand-orange focus:ring-brand-orange" />
                      <span>Mémoriser</span>
                    </label>
                    <a href="#" onClick={(e) => e.preventDefault()} className="text-brand-orange font-bold hover:underline">Mot de passe oublié ?</a>
                  </div>
                </>
              )}

              {/* Guarantee / Security Notice */}
              <div className="bg-white/5 border border-white/10 p-3 text-[10px] text-white/60 flex items-center gap-2 font-mono-tracked">
                <i className="fa-solid fa-user-shield text-emerald-400 text-base"></i>
                <div>
                  <p className="font-bold text-white uppercase">
                    {(mode === 'login' && !packageName) ? 'Espace Client Privé' : 'Paiement Sécurisé & Confidentiel'}
                  </p>
                  <p className="text-white/40">
                    {(mode === 'login' && !packageName)
                      ? 'Accès immédiat à votre tableau de bord et à votre concierge dédié.'
                      : 'Vos données sont chiffrées (SSL 256-bit). Redirection immédiate vers la confirmation.'}
                  </p>
                </div>
              </div>

              {/* Submit Button */}
              <button 
                type="submit" 
                disabled={isLoading}
                className="w-full bg-brand-orange hover:bg-orange-600 text-white font-black py-4 text-xs uppercase tracking-widest transition shadow-lg flex items-center justify-center gap-2 group disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <i className="fa-solid fa-spinner animate-spin"></i>
                    <span>
                      {(mode === 'login' && !packageName) ? 'Connexion en cours...' : 'Validation de votre inscription...'}
                    </span>
                  </>
                ) : (
                  <>
                    <span>
                      {(mode === 'login' && !packageName) ? 'Se Connecter à mon Espace Client' : 'Confirmer mon Inscription'}
                    </span>
                    <i className="fa-solid fa-arrow-right group-hover:translate-x-1 transition-transform"></i>
                  </>
                )}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};


