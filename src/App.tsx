import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { Features } from './components/Features';
import { Pricing } from './components/Pricing';
import { AuthModal } from './components/AuthModal';
import { ClientDashboard } from './components/ClientDashboard';
import { Toast } from './components/Toast';
import { Footer } from './components/Footer';
import { ChatBubbleWidget } from './components/ChatBubbleWidget';

export default function App() {
  const [currentPath, setCurrentPath] = useState<string>('/profil');
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(true);
  const [authModalOpen, setAuthModalOpen] = useState<boolean>(false);
  const [authModalType, setAuthModalType] = useState<'login' | 'signup'>('login');
  const [selectedPackage, setSelectedPackage] = useState<string | undefined>(undefined);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isChatBubbleOpen, setIsChatBubbleOpen] = useState<boolean>(false);
  const [currentUserProfile, setCurrentUserProfile] = useState<{
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    packageName?: string;
  } | undefined>(undefined);

  // Sync state with popstate and expose window trigger
  useEffect(() => {
    window.openAuraConciergeChat = () => setIsChatBubbleOpen(true);

    const checkSuccessUrl = () => {
      const searchParams = new URLSearchParams(window.location.search);
      if (searchParams.get('checkout') === 'success' || searchParams.get('subscription') === 'success') {
        setIsLoggedIn(true);
        setCurrentPath('/profil');
        confetti({
          particleCount: 120,
          spread: 85,
          origin: { y: 0.4 },
          colors: ['#ff6b00', '#10b981', '#ffffff', '#fbbf24', '#6366f1'],
        });
        showToast("🎉 Félicitations ! Votre abonnement est activé. Votre Concierge Dédié est en ligne.");
      }
    };

    checkSuccessUrl();

    const handlePopState = () => {
      const path = window.location.pathname;
      setCurrentPath(path);
      if (path === '/profil' || path === '/dashboard') {
        setIsLoggedIn(true);
      }
    };

    window.addEventListener('popstate', handlePopState);
    if (window.location.pathname === '/profil' || window.location.pathname === '/dashboard') {
      setIsLoggedIn(true);
    }

    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const handleNavigate = (path: string) => {
    if (path.includes('#')) {
      const targetId = path.split('#')[1];
      if (currentPath === '/profil') {
        setCurrentPath('/');
        window.history.pushState(null, '', '/');
        setTimeout(() => {
          const el = document.getElementById(targetId);
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      } else {
        const el = document.getElementById(targetId);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }
      return;
    }

    setCurrentPath(path);
    window.history.pushState(null, '', path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenAuthModal = (type: 'login' | 'signup', pkgName?: string) => {
    setAuthModalType(type);
    setSelectedPackage(pkgName);
    setAuthModalOpen(true);
  };

  const handleCloseAuthModal = () => {
    setAuthModalOpen(false);
  };

  const handleAuthSuccess = (userData?: { firstName: string; lastName: string; email: string; phone: string; packageName?: string }) => {
    setAuthModalOpen(false);
    setIsLoggedIn(true);
    if (userData) {
      setCurrentUserProfile(userData);
    }
    handleNavigate('/profil');
    
    // Celebrate with confetti
    confetti({
      particleCount: 100,
      spread: 80,
      origin: { y: 0.5 },
      colors: ['#ff6b00', '#10b981', '#ffffff', '#fbbf24'],
    });

    const nameStr = userData?.firstName ? ` ${userData.firstName}` : '';
    showToast(`Bienvenue${nameStr} ! Acces instantane a votre Espace Client.`);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    handleNavigate('/');
    showToast("Vous avez été déconnecté de votre Espace Client.");
  };

  const handleSelectPackage = (pkgName: string) => {
    handleOpenAuthModal('signup', pkgName);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col font-sans">
      <Header 
        currentPath={currentPath}
        isLoggedIn={isLoggedIn}
        onNavigate={handleNavigate}
        onOpenAuthModal={handleOpenAuthModal}
        onLogout={handleLogout}
      />

      <main className="flex-1">
        {currentPath === '/profil' || currentPath === '/dashboard' ? (
          <ClientDashboard 
            userProfile={currentUserProfile}
            onShowToast={showToast}
            onUpgradePlan={() => handleOpenAuthModal('signup', 'VIP & Famille')}
            onOpenChatBubble={() => setIsChatBubbleOpen(true)}
          />
        ) : (
          <>
            <Hero 
              onShowToast={showToast}
              onNavigateToPricing={() => handleNavigate('#pricing')}
              onOpenChatBubble={() => setIsChatBubbleOpen(true)}
            />
            <Features />
            <Pricing onSelectPackage={handleSelectPackage} />
          </>
        )}
      </main>

      <Footer />

      <ChatBubbleWidget 
        isOpen={isChatBubbleOpen}
        onToggle={() => setIsChatBubbleOpen(!isChatBubbleOpen)}
        onShowToast={showToast}
      />

      <AuthModal 
        isOpen={authModalOpen}
        type={authModalType}
        packageName={selectedPackage}
        onClose={handleCloseAuthModal}
        onSuccess={handleAuthSuccess}
      />

      <Toast message={toastMessage} />
    </div>
  );
}
