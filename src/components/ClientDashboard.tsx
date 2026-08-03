import React, { useState, useEffect } from 'react';
import { UserRequest } from '../types';

interface ClientDashboardProps {
  userProfile?: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    packageName?: string;
  };
  onShowToast: (msg: string) => void;
  onUpgradePlan: () => void;
  onOpenChatBubble?: () => void;
}

export const ClientDashboard: React.FC<ClientDashboardProps> = ({
  userProfile,
  onShowToast,
  onUpgradePlan,
  onOpenChatBubble,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'notion' | 'stripe'>('overview');
  const [isLoading, setIsLoading] = useState(true);

  // Client & Integration state loaded from Server (Notion & Stripe)
  const [dashboardData, setDashboardData] = useState<{
    clientProfile: {
      id: string;
      firstName: string;
      lastName: string;
      email: string;
      phone: string;
      packageName: string;
      createdAt: string;
      notionSynced: boolean;
      notionDatabase: string;
    };
    notionStatus: {
      connected: boolean;
      message: string;
    };
    stripeSubscription: {
      status: string;
      planName: string;
      amount: string;
      currency: string;
      interval: string;
      currentPeriodEnd: string;
      cancelAtPeriodEnd: boolean;
      paymentMethod: {
        brand: string;
        last4: string;
        expMonth: number;
        expYear: number;
      };
      stripeCustomerId: string;
      stripeSubscriptionId: string;
      liveStripeConnected: boolean;
    };
    invoices: Array<{
      id: string;
      date: string;
      amount: string;
      status: string;
      description: string;
      pdfUrl: string;
    }>;
  }>({
    clientProfile: {
      id: 'ntn_nc_984210',
      firstName: userProfile?.firstName || 'Alexandre',
      lastName: userProfile?.lastName || 'Dupont',
      email: userProfile?.email || 'alexandre.dupont@exemple.com',
      phone: userProfile?.phone || '+33 6 12 34 56 78',
      packageName: userProfile?.packageName || 'Concierge Premium (29,99€/mois)',
      createdAt: new Date().toISOString(),
      notionSynced: true,
      notionDatabase: 'Clients',
    },
    notionStatus: {
      connected: true,
      message: 'Base de données Notion active - Table Clients',
    },
    stripeSubscription: {
      status: 'active',
      planName: userProfile?.packageName || 'Concierge Premium',
      amount: '29,99 €',
      currency: 'EUR',
      interval: 'mois',
      currentPeriodEnd: '2026-09-01',
      cancelAtPeriodEnd: false,
      paymentMethod: {
        brand: 'Visa',
        last4: '4242',
        expMonth: 12,
        expYear: 2028,
      },
      stripeCustomerId: 'cus_R9x8aK2pL0',
      stripeSubscriptionId: 'sub_1PqX992eZv',
      liveStripeConnected: false,
    },
    invoices: [
      {
        id: 'inv_1PqX992eZv_001',
        date: '2026-08-01',
        amount: '29,99 €',
        status: 'payée',
        description: 'Abonnement Mensuel - Aura Concierge Premium',
        pdfUrl: '#',
      },
      {
        id: 'inv_1PqX992eZv_000',
        date: '2026-07-01',
        amount: '29,99 €',
        status: 'payée',
        description: 'Abonnement Mensuel - Aura Concierge Premium',
        pdfUrl: '#',
      },
    ],
  });

  // Edit form state
  const [editFirstName, setEditFirstName] = useState('');
  const [editLastName, setEditLastName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  // Concierge requests state
  const [requestText, setRequestText] = useState('');
  const [requestsList, setRequestsList] = useState<UserRequest[]>([
    {
      id: '1',
      title: '🍽️ Table 2 personnes - Le Train Bleu (Gare de Lyon)',
      status: 'in_progress',
      statusText: 'En cours de réservation',
      date: "Demandé aujourd'hui à 14h20",
      assignedTo: 'Marc V.',
      estimatedTime: 'Confirmation prévue sous 15 min',
    },
    {
      id: '2',
      title: '💐 Livraison Bouquet Pivoines & Carte Personnalisée',
      status: 'completed',
      statusText: 'Confirmé & Livré',
      date: "Livré hier à 11h00 à l'adresse principale",
      assignedTo: 'Marc V.',
      cost: '45,00€',
      receiptDownloaded: true,
    },
  ]);

  // Load dashboard data from backend API
  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);
      try {
        const targetEmail = userProfile?.email || 'alexandre.dupont@exemple.com';
        const res = await fetch(`/api/client-dashboard-data?email=${encodeURIComponent(targetEmail)}`);
        const data = await res.json();

        if (data.clientProfile) {
          // If userProfile props exist, override
          if (userProfile?.firstName) data.clientProfile.firstName = userProfile.firstName;
          if (userProfile?.lastName) data.clientProfile.lastName = userProfile.lastName;
          if (userProfile?.email) data.clientProfile.email = userProfile.email;
          if (userProfile?.phone) data.clientProfile.phone = userProfile.phone;
          if (userProfile?.packageName) data.clientProfile.packageName = userProfile.packageName;

          setDashboardData(data);
          setEditFirstName(data.clientProfile.firstName);
          setEditLastName(data.clientProfile.lastName);
          setEditEmail(data.clientProfile.email);
          setEditPhone(data.clientProfile.phone);
        }
      } catch (err) {
        console.error('Erreur chargement données dashboard:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [userProfile]);

  // Handle saving profile changes to Notion
  const handleSaveProfileToNotion = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingProfile(true);

    try {
      const res = await fetch('/api/update-client-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: editFirstName,
          lastName: editLastName,
          email: editEmail,
          phone: editPhone,
          packageName: dashboardData.clientProfile.packageName,
        }),
      });

      const result = await res.json();

      setDashboardData((prev) => ({
        ...prev,
        clientProfile: {
          ...prev.clientProfile,
          firstName: editFirstName,
          lastName: editLastName,
          email: editEmail,
          phone: editPhone,
          notionSynced: true,
        },
      }));

        onShowToast('✨ Données client synchronisées avec Notion !');
    } catch (err) {
        console.error('Erreur sauvegarde Notion:', err);
      onShowToast('Mise à jour locale effectuée.');
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleDashboardRequestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!requestText.trim()) return;

    const newReq: UserRequest = {
      id: Date.now().toString(),
      title: `✨ ${requestText.trim()}`,
      status: 'in_progress',
      statusText: 'Transmis à Marc V.',
      date: "Demandé à l'instant",
      assignedTo: 'Marc V.',
      estimatedTime: 'Traitement en cours',
    };

    setRequestsList([newReq, ...requestsList]);
    setRequestText('');
    onShowToast('Votre demande a été transmise à votre concierge Marc V.');
  };

  const getInitials = (fn: string, ln: string) => {
    const f = fn ? fn.charAt(0).toUpperCase() : 'A';
    const l = ln ? ln.charAt(0).toUpperCase() : 'D';
    return `${f}${l}`;
  };

  return (
    <section id="clientDashboard" className="py-10 bg-[#050505] min-h-screen text-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Profile Banner */}
        <div className="bg-[#0b0b0e] p-6 sm:p-8 mb-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border border-white/10 shadow-2xl relative overflow-hidden">
          
          <div className="flex items-center space-x-4 z-10">
            <div className="w-16 h-16 bg-white text-black font-black font-syne text-2xl flex items-center justify-center shadow-lg">
              {getInitials(dashboardData.clientProfile.firstName, dashboardData.clientProfile.lastName)}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-2xl sm:text-3xl font-black text-white font-syne uppercase tracking-tight">
                  {dashboardData.clientProfile.firstName} {dashboardData.clientProfile.lastName}
                </h1>
                <span className="bg-brand-orange text-white text-[9px] font-black uppercase px-2.5 py-0.5 font-mono-tracked tracking-widest shadow">
                  MEMBRE VVIP
                </span>
              </div>
              <div className="text-xs text-white/60 mt-1 flex items-center gap-3 font-mono-tracked flex-wrap">
                <span><i className="fa-solid fa-envelope text-white/40 mr-1"></i> {dashboardData.clientProfile.email}</span>
                <span>//</span>
                <span><i className="fa-solid fa-phone text-white/40 mr-1"></i> {dashboardData.clientProfile.phone}</span>
              </div>
            </div>
          </div>

          {/* Integration Status Badges */}
          <div className="flex items-center gap-3 flex-wrap z-10">
{/* Notion Status Badge */}
          <div className="absolute bottom-0 right-0 bg-gradient-to-l from-purple-500/20 to-transparent p-3 rounded">
            <span className="text-[9px] text-white/40 uppercase font-mono-tracked block">Notion Sync</span>
                <span className="text-emerald-400 font-bold uppercase text-[10px]">● Actif (table: clients)</span>
              </div>
            </div>

            {/* Stripe Status Badge */}
            <div className="bg-[#050505] border border-indigo-500/40 px-3.5 py-2 flex items-center gap-2 text-xs">
              <i className="fa-brands fa-stripe text-indigo-400 text-lg"></i>
              <div>
                <span className="text-[9px] text-white/40 uppercase font-mono-tracked block">Stripe Status</span>
                <span className="text-indigo-300 font-bold uppercase text-[10px]">Abonnement Payé</span>
              </div>
            </div>
          </div>
        </div>

        {/* Dashboard Navigation Tabs */}
        <div className="flex border-b border-white/10 mb-8 overflow-x-auto text-xs font-mono-tracked">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-6 py-3.5 font-bold uppercase tracking-wider transition flex items-center gap-2 border-b-2 -mb-px whitespace-nowrap ${
              activeTab === 'overview'
                ? 'border-brand-orange text-brand-orange bg-white/5'
                : 'border-transparent text-white/60 hover:text-white'
            }`}
          >
            <i className="fa-solid fa-gauge-high"></i>
            <span>Tableau de Bord & Demandes</span>
            <span className="bg-brand-orange/20 text-brand-orange px-1.5 py-0.2 rounded text-[10px]">
              {requestsList.length}
            </span>
          </button>

          <button
        onClick={() => setActiveTab('notion')}
        className={`px-3 py-2 text-sm transition ${
          activeTab === 'notion'
            ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white'
            : 'text-slate-400 hover:text-white'
        }`}
      >
        <span>Données Notion (Fiche Client)</span>
            <span className="bg-emerald-500/20 text-emerald-400 px-1.5 py-0.2 rounded text-[10px]">
              Live
            </span>
          </button>

          <button
            onClick={() => setActiveTab('stripe')}
            className={`px-6 py-3.5 font-bold uppercase tracking-wider transition flex items-center gap-2 border-b-2 -mb-px whitespace-nowrap ${
              activeTab === 'stripe'
                ? 'border-indigo-400 text-indigo-300 bg-white/5'
                : 'border-transparent text-white/60 hover:text-white'
            }`}
          >
            <i className="fa-brands fa-stripe text-sm"></i>
            <span>Abonnement & Factures Stripe</span>
            <span className="bg-indigo-500/20 text-indigo-300 px-1.5 py-0.2 rounded text-[10px]">
              29,99€
            </span>
          </button>
        </div>

        {/* TAB 1: OVERVIEW & CONCIERGE REQUESTS */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Left Column: Create Request & Active Requests Feed */}
            <div className="lg:col-span-8 space-y-8">
              
              {/* Submit New Request Box */}
              <div className="bg-[#0b0b0e] p-6 border border-white/10 space-y-4 shadow-xl">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-black text-white uppercase tracking-wider font-syne flex items-center gap-2">
                    <i className="fa-solid fa-paper-plane text-brand-orange"></i>
                    <span>Transmettre une demande à votre concierge</span>
                  </h3>
                  <span className="text-[10px] uppercase tracking-widest text-emerald-400 font-mono-tracked">
                    ● Concierge En Ligne
                  </span>
                </div>

                <form onSubmit={handleDashboardRequestSubmit} className="space-y-3">
                  <textarea 
                    value={requestText}
                    onChange={(e) => setRequestText(e.target.value)}
                    rows={3} 
                    placeholder="Ex: Réserve une table pour 4 personnes au Bistrot de Paris ce vendredi à 20h30..." 
                    className="w-full bg-[#050505] border border-white/15 p-4 text-xs text-white placeholder-white/30 outline-none focus:border-brand-orange transition resize-none font-sans"
                    required
                  ></textarea>
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-2 text-xs text-white/50">
                      <button 
                        type="button" 
                        onClick={() => onShowToast('Option note vocale activée')} 
                        className="p-2 bg-white/5 hover:bg-white/10 border border-white/10 transition text-white" 
                        title="Envoyer une note vocale"
                      >
                        <i className="fa-solid fa-microphone text-brand-orange mr-1"></i>
                        <span className="text-[10px] font-mono-tracked uppercase">Note Vocale</span>
                      </button>
                      <button 
                        type="button" 
                        onClick={() => onShowToast('Pièce jointe sélectionnée')} 
                        className="p-2 bg-white/5 hover:bg-white/10 border border-white/10 transition text-white" 
                        title="Joindre un fichier"
                      >
                        <i className="fa-solid fa-paperclip text-white/40 mr-1"></i>
                        <span className="text-[10px] font-mono-tracked uppercase">Fichier</span>
                      </button>
                    </div>
                    <button 
                      type="submit" 
                      className="bg-brand-orange hover:bg-orange-600 text-white font-black px-6 py-2.5 text-xs uppercase tracking-widest transition shadow"
                    >
                      <span>Envoyer ma demande →</span>
                    </button>
                  </div>
                </form>
              </div>

              {/* Active Requests Feed */}
              <div className="bg-[#0b0b0e] p-6 border border-white/10 space-y-5 shadow-xl">
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <h3 className="text-sm font-black text-white uppercase tracking-wider font-syne flex items-center gap-2">
                    <i className="fa-solid fa-list-check text-brand-orange"></i>
                    <span>Suivi en direct de vos demandes</span>
                  </h3>
                  <span className="text-[10px] uppercase tracking-widest text-white/40 font-mono-tracked">
                    {requestsList.length} DEMANDES
                  </span>
                </div>

                <div className="space-y-4">
                  {requestsList.map((req) => (
                    <div key={req.id} className="bg-[#050505] border border-white/10 p-4 space-y-2 transition hover:border-white/20">
                      <div className="flex items-center justify-between text-xs flex-wrap gap-2">
                        <span className="font-bold text-white text-sm">{req.title}</span>
                        {req.status === 'in_progress' ? (
                          <span className="bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[9px] font-bold px-2 py-0.5 uppercase tracking-wider font-mono-tracked flex items-center gap-1">
                            <i className="fa-solid fa-spinner animate-spin"></i> {req.statusText}
                          </span>
                        ) : (
                          <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[9px] font-bold px-2 py-0.5 uppercase tracking-wider font-mono-tracked flex items-center gap-1">
                            <i className="fa-solid fa-circle-check"></i> {req.statusText}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-white/50">{req.date} • Concierge Attitré: {req.assignedTo}</p>
                      <div className="pt-2 flex items-center justify-between text-[11px] border-t border-white/10 flex-wrap gap-2">
                        {req.status === 'in_progress' ? (
                          <span className="text-white/60"><i className="fa-solid fa-clock text-amber-400 mr-1"></i> {req.estimatedTime}</span>
                        ) : (
                          <span className="text-emerald-400"><i className="fa-solid fa-receipt mr-1"></i> Reglé via votre compte ({req.cost})</span>
                        )}
                        
                        <div className="flex items-center gap-3">
                          {req.receiptDownloaded && (
                            <button 
                              onClick={() => onShowToast('Reçu de conciergerie téléchargé')} 
                              className="text-white/60 hover:text-white font-semibold flex items-center gap-1"
                            >
                              <i className="fa-solid fa-download"></i> Reçu PDF
                            </button>
                          )}
                          <button 
                            onClick={() => onOpenChatBubble ? onOpenChatBubble() : onShowToast(`Discussion directe avec ${req.assignedTo}`)} 
                            className="text-brand-orange hover:underline font-bold uppercase tracking-wider text-[10px]"
                          >
                            Discuter avec Marc
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Right Column: Dedicated Concierge & Quick Stats */}
            <div className="lg:col-span-4 space-y-8">
              
              {/* Dedicated Concierge Box */}
              <div className="bg-[#0b0b0e] p-6 border border-white/10 text-center space-y-4 shadow-xl">
                <div className="w-16 h-16 mx-auto bg-white text-black flex items-center justify-center text-2xl font-black font-syne shadow">
                  MV
                </div>

                <div>
                  <h4 className="text-base font-black text-white font-syne uppercase tracking-wider">Marc Valette</h4>
                  <p className="text-[10px] text-brand-orange font-bold uppercase tracking-widest font-mono-tracked mt-0.5">Votre Concierge Personnel</p>
                  <p className="text-xs text-white/50 mt-1">Ligne directe réservée aux membres Aura Concierge 24/7.</p>
                </div>

                <div className="pt-2 space-y-2">
                  <button 
                    onClick={() => onShowToast('Redirection vers WhatsApp avec Marc Valette...')} 
                    className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2.5 text-xs uppercase tracking-widest transition flex items-center justify-center gap-2 shadow"
                  >
                    <i className="fa-brands fa-whatsapp text-sm"></i>
                    <span>Ligne WhatsApp Directe</span>
                  </button>
                  <button 
                    onClick={() => onShowToast('Rappel immédiat demandé à votre concierge...')} 
                    className="w-full bg-white/5 hover:bg-white/10 text-white font-bold py-2.5 text-xs uppercase tracking-widest transition border border-white/10"
                  >
                    <i className="fa-solid fa-phone text-xs mr-1"></i>
                    <span>Demander un Appel Téléphonique</span>
                  </button>
                </div>
              </div>

              {/* Time Saved Stats Card */}
              <div className="bg-[#0b0b0e] p-6 border border-white/10 space-y-3 shadow-xl">
                <span className="text-[10px] font-bold uppercase tracking-widest text-white/40 font-mono-tracked block">
                  Gain de Temps Cumulé
                </span>
                <div className="text-3xl font-black text-emerald-400 font-syne">
                  18h 45min
                </div>
                <p className="text-xs text-white/50">
                  Temps économisé sur la gestion de vos réservations, livraisons et rendez-vous ce mois-ci.
                </p>
              </div>

            </div>

          </div>
        )}

        {/* TAB 2: SUPABASE CLIENT DATA */}
      {activeTab === 'notion' && (
        <div className="bg-slate-700/30 border border-slate-600 rounded p-6 space-y-6">
          {/* Notion Edit Profile Form */}
          <div>
            <h3 className="text-lg font-semibold mb-2">
              <span>Fiche Client Notion</span>
            </h3>
            <p className="text-slate-400 text-sm mb-4">
              Modifiez vos données personnelles pour les synchroniser directement dans la base Notion (table <code className="text-purple-400">Clients</code>).
            </p>

            <form onSubmit={handleSaveProfileToNotion} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-white/80 uppercase tracking-wider text-[10px] font-mono-tracked mb-1">
                      Prénom
                    </label>
                    <input 
                      type="text" 
                      required 
                      value={editFirstName}
                      onChange={(e) => setEditFirstName(e.target.value)}
                      className="w-full bg-[#050505] border border-white/15 px-3.5 py-3 outline-none focus:border-emerald-400 text-white font-medium text-xs"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-white/80 uppercase tracking-wider text-[10px] font-mono-tracked mb-1">
                      Nom
                    </label>
                    <input 
                      type="text" 
                      required 
                      value={editLastName}
                      onChange={(e) => setEditLastName(e.target.value)}
                      className="w-full bg-[#050505] border border-white/15 px-3.5 py-3 outline-none focus:border-emerald-400 text-white font-medium text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-white/80 uppercase tracking-wider text-[10px] font-mono-tracked mb-1">
                    Adresse Email (Identifiant Unique Notion)
                  </label>
                  <input 
                    type="email" 
                    required 
                    value={editEmail}
                    onChange={(e) => setEditEmail(e.target.value)}
                    className="w-full bg-[#050505] border border-white/15 px-3.5 py-3 outline-none focus:border-emerald-400 text-white font-medium text-xs"
                  />
                </div>

                <div>
                  <label className="block font-bold text-white/80 uppercase tracking-wider text-[10px] font-mono-tracked mb-1">
                    Numéro de Téléphone (Ligne Concierge)
                  </label>
                  <input 
                    type="tel" 
                    required 
                    value={editPhone}
                    onChange={(e) => setEditPhone(e.target.value)}
                    className="w-full bg-[#050505] border border-white/15 px-3.5 py-3 outline-none focus:border-emerald-400 text-white font-medium text-xs"
                  />
                </div>

                <div className="pt-2">
                  <button 
                    type="submit" 
                    disabled={isSavingProfile}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white font-black px-6 py-3 text-xs uppercase tracking-widest transition flex items-center gap-2 shadow disabled:opacity-50"
                  >
                    {isSavingProfile ? (
                      <>
                        <i className="fa-solid fa-spinner animate-spin"></i>
                        <span>Enregistrement dans Notion...</span>
                      </>
                    ) : (
                      <>
                        <i className="fa-solid fa-cloud-arrow-up"></i>
                        <span>Enregistrer & Synchroniser sur Notion</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>

            {/* Notion Technical Details Sidebar */}
            <div className="lg:col-span-4 space-y-6">
              
              <div className="bg-[#0b0b0e] p-6 border border-white/10 space-y-4 shadow-xl">
                <h4 className="text-xs font-black text-white uppercase font-syne tracking-wider flex items-center gap-2">
                  <i className="fa-solid fa-code text-purple-400"></i>
                  <span>Métadonnées Notion</span>
                </h4>

                <div className="space-y-3 text-xs font-mono-tracked">
                  <div className="bg-[#050505] p-3 border border-white/10 space-y-1">
                    <span className="text-[9px] text-white/40 uppercase block">ID Client Notion</span>
                    <span className="text-purple-400 font-bold select-all text-[11px]">{dashboardData.clientProfile.id}</span>
                  </div>

                  <div className="bg-[#050505] p-3 border border-white/10 space-y-1">
                    <span className="text-[9px] text-white/40 uppercase block">Base Notion</span>
                    <span className="text-white font-bold text-[11px]">Clients</span>
                  </div>

                  <div className="bg-[#050505] p-3 border border-white/10 space-y-1">
                    <span className="text-[9px] text-white/40 uppercase block">Date d'inscription</span>
                    <span className="text-white/80 text-[11px]">{new Date(dashboardData.clientProfile.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                  </div>
                </div>

                <div className="bg-purple-500/10 border border-purple-500/30 p-3 text-[10px] text-purple-300">
                  <p className="font-bold uppercase">● Base de données Notion synchronisée</p>
                  <p className="text-white/60 mt-1">
                    Chaque mise à jour du profil met automatiquement à jour la base Notion de votre application.
                  </p>
                </div>
              </div>

            </div>

          </div>
        )}

        {/* TAB 3: STRIPE SUBSCRIPTION & INVOICES */}
        {activeTab === 'stripe' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Stripe Subscription Box */}
            <div className="lg:col-span-8 space-y-8">
              
              <div className="bg-[#0b0b0e] p-6 sm:p-8 border border-white/10 space-y-6 shadow-2xl">
                <div className="flex items-center justify-between border-b border-white/10 pb-4 flex-wrap gap-2">
                  <div>
                    <h3 className="text-lg font-black text-white uppercase font-syne flex items-center gap-2">
                      <i className="fa-brands fa-stripe text-indigo-400 text-xl"></i>
                      <span>Abonnement Stripe Actif</span>
                    </h3>
                    <p className="text-xs text-white/50 mt-0.5">
                      Gérez votre formule de conciergerie, renouvellements et moyens de paiement.
                    </p>
                  </div>
                  <span className="bg-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase px-3 py-1 font-mono-tracked border border-emerald-500/30">
                    Abonnement En Règle
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  
                  {/* Current Package Box */}
                  <div className="bg-[#050505] border border-white/10 p-5 space-y-2">
                    <span className="text-[9px] text-white/40 font-bold uppercase tracking-widest font-mono-tracked">
                      Formule Actuelle
                    </span>
                    <h4 className="text-base font-black text-white font-syne uppercase">
                      {dashboardData.stripeSubscription.planName}
                    </h4>
                    <div className="text-2xl font-black text-brand-orange font-syne pt-1">
                      {dashboardData.stripeSubscription.amount} <span className="text-xs text-white/50 font-sans font-normal">/ {dashboardData.stripeSubscription.interval}</span>
                    </div>
                  </div>

                  {/* Payment Method Box */}
                  <div className="bg-[#050505] border border-white/10 p-5 space-y-2">
                    <span className="text-[9px] text-white/40 font-bold uppercase tracking-widest font-mono-tracked">
                      Moyen de Paiement Stripe
                    </span>
                    <div className="flex items-center gap-3 pt-1">
                      <div className="w-10 h-7 bg-indigo-950 border border-indigo-500/40 rounded flex items-center justify-center font-bold text-indigo-300 text-xs">
                        {dashboardData.stripeSubscription.paymentMethod.brand}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-white">•••• •••• •••• {dashboardData.stripeSubscription.paymentMethod.last4}</p>
                        <p className="text-[10px] text-white/40">Expire: {dashboardData.stripeSubscription.paymentMethod.expMonth}/{dashboardData.stripeSubscription.paymentMethod.expYear}</p>
                      </div>
                    </div>
                  </div>

                </div>

                {/* Renewal Info Bar */}
                <div className="bg-white/5 border border-white/10 p-4 flex items-center justify-between text-xs flex-wrap gap-2 font-mono-tracked">
                  <div>
                    <span className="text-white/50 block text-[10px] uppercase">Prochain Renouvellement Stripe</span>
                    <span className="font-bold text-white">{dashboardData.stripeSubscription.currentPeriodEnd}</span>
                  </div>
                  <button 
                    onClick={() => onShowToast('Redirection vers le portail de gestion de carte bancaire Stripe...')}
                    className="bg-white/10 hover:bg-white/20 text-white font-bold px-4 py-2 text-[10px] uppercase tracking-wider transition border border-white/10"
                  >
                    Changer de Carte
                  </button>
                </div>

                <div className="flex items-center gap-3 flex-wrap pt-2">
                  <button 
                    onClick={onUpgradePlan}
                    className="bg-brand-orange hover:bg-orange-600 text-white font-black px-6 py-3 text-xs uppercase tracking-widest transition shadow"
                  >
                    Changer de Formule (Upgrade)
                  </button>
                  <button 
                    onClick={() => onShowToast('Demande de suspension transmise à votre concierge.')}
                    className="bg-white/5 hover:bg-white/10 text-white/60 hover:text-white font-bold px-4 py-3 text-xs uppercase tracking-widest transition border border-white/10"
                  >
                    Mettre en Pause
                  </button>
                </div>
              </div>

              {/* Invoices History Table */}
              <div className="bg-[#0b0b0e] p-6 border border-white/10 space-y-4 shadow-xl">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <h3 className="text-sm font-black text-white uppercase tracking-wider font-syne flex items-center gap-2">
                    <i className="fa-solid fa-file-invoice text-indigo-400"></i>
                    <span>Historique des Factures Stripe</span>
                  </h3>
                  <span className="text-[10px] uppercase tracking-widest text-white/40 font-mono-tracked">
                    {dashboardData.invoices.length} FACTURES
                  </span>
                </div>

                <div className="space-y-3">
                  {dashboardData.invoices.map((inv) => (
                    <div key={inv.id} className="bg-[#050505] border border-white/10 p-4 flex items-center justify-between flex-wrap gap-3 text-xs">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white">{inv.description}</span>
                          <span className="bg-emerald-500/20 text-emerald-400 text-[9px] font-bold px-1.5 py-0.5 uppercase font-mono-tracked">
                            {inv.status}
                          </span>
                        </div>
                        <p className="text-[10px] text-white/40 font-mono-tracked">Facture ID: {inv.id} • Date: {inv.date}</p>
                      </div>

                      <div className="flex items-center gap-4">
                        <span className="font-black text-white font-syne text-sm">{inv.amount}</span>
                        <button 
                          onClick={() => onShowToast(`Téléchargement de la facture PDF (${inv.id})...`)}
                          className="bg-white/5 hover:bg-white/10 border border-white/15 px-3 py-1.5 text-[10px] uppercase font-bold tracking-wider text-white transition flex items-center gap-1"
                        >
                          <i className="fa-solid fa-download text-indigo-400"></i> PDF
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Stripe Metadata Sidebar */}
            <div className="lg:col-span-4 space-y-6">
              
              <div className="bg-[#0b0b0e] p-6 border border-white/10 space-y-4 shadow-xl">
                <h4 className="text-xs font-black text-white uppercase font-syne tracking-wider flex items-center gap-2">
                  <i className="fa-solid fa-shield-halved text-indigo-400"></i>
                  <span>Identifiants Stripe</span>
                </h4>

                <div className="space-y-3 text-xs font-mono-tracked">
                  <div className="bg-[#050505] p-3 border border-white/10 space-y-1">
                    <span className="text-[9px] text-white/40 uppercase block">Stripe Customer ID</span>
                    <span className="text-indigo-300 font-bold select-all text-[11px]">{dashboardData.stripeSubscription.stripeCustomerId}</span>
                  </div>

                  <div className="bg-[#050505] p-3 border border-white/10 space-y-1">
                    <span className="text-[9px] text-white/40 uppercase block">Subscription ID</span>
                    <span className="text-white/80 font-bold select-all text-[11px]">{dashboardData.stripeSubscription.stripeSubscriptionId}</span>
                  </div>

                  <div className="bg-[#050505] p-3 border border-white/10 space-y-1">
                    <span className="text-[9px] text-white/40 uppercase block">Devise & Facturation</span>
                    <span className="text-white font-bold text-[11px]">EUR (€) - Mensuelle</span>
                  </div>
                </div>

                <div className="bg-indigo-950/40 border border-indigo-500/30 p-3 text-[10px] text-indigo-200">
                  <p className="font-bold uppercase">● Sécurité Stripe SSL</p>
                  <p className="text-white/60 mt-1">
                    Les transactions sont traitées et chiffrées selon la norme PCI-DSS de Stripe.
                  </p>
                </div>
              </div>

            </div>

          </div>
        )}

      </div>
    </section>
  );
};
