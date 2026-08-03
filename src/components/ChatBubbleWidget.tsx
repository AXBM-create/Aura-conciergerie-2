import React, { useState, useRef, useEffect } from 'react';

interface ChatItem {
  id: string;
  sender: 'user' | 'concierge';
  text: string;
  actionDone?: string;
  savedTime?: string;
}

interface ChatBubbleWidgetProps {
  isOpen: boolean;
  onToggle: () => void;
  onShowToast: (msg: string) => void;
}

// Extend Window interface for AssistLoop & global helpers
declare global {
  interface Window {
    openAuraConciergeChat?: () => void;
    AssistLoop?: any;
    AssistLoopConfig?: {
      appId?: string;
      customEndpoint?: string;
    };
  }
}

export const ChatBubbleWidget: React.FC<ChatBubbleWidgetProps> = ({
  isOpen,
  onToggle,
  onShowToast,
}) => {
  const [chatFeed, setChatFeed] = useState<ChatItem[]>([
    {
      id: '1',
      sender: 'concierge',
      text: 'Bonjour ! Je suis Aura, votre concierge personnel 24/7. Comment puis-je vous assister aujourd’hui ?',
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [activeTab, setActiveTab] = useState<'concierge' | 'assistloop_config'>('concierge');
  
  // AssistLoop Configuration State
  const [assistLoopAppId, setAssistLoopAppId] = useState<string>(() => {
    return localStorage.getItem('aura_assistloop_appid') || '';
  });
  const [isAssistLoopActive, setIsAssistLoopActive] = useState<boolean>(() => {
    return localStorage.getItem('aura_assistloop_active') === 'true';
  });

  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatFeed, isTyping, isOpen]);

  // Dynamically load AssistLoop script if configured
  useEffect(() => {
    if (isAssistLoopActive && assistLoopAppId) {
      const scriptId = 'assistloop-widget-script';
      if (!document.getElementById(scriptId)) {
        const script = document.createElement('script');
        script.id = scriptId;
        script.src = `https://cdn.assistloop.com/widget.js`;
        script.async = true;
        script.setAttribute('data-assistloop-id', assistLoopAppId);
        script.onload = () => {
          onShowToast('Widget AssistLoop chargé avec succès !');
          if (window.AssistLoop && typeof window.AssistLoop.init === 'function') {
            window.AssistLoop.init({ appId: assistLoopAppId });
          }
        };
        script.onerror = () => {
          console.warn('AssistLoop script unreachable or in test mode.');
        };
        document.body.appendChild(script);
      }
    }
  }, [isAssistLoopActive, assistLoopAppId]);

  const handleSendPrompt = async (promptText: string) => {
    if (!promptText.trim() || isTyping) return;

    const userMsgId = Date.now().toString();
    const newUserMsg: ChatItem = {
      id: userMsgId,
      sender: 'user',
      text: promptText,
    };

    setChatFeed((prev) => [...prev, newUserMsg]);
    setInputValue('');
    setIsTyping(true);

    try {
      const response = await fetch('/api/concierge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: promptText }),
      });

      const data = await response.json();

      setIsTyping(false);
      setChatFeed((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: 'concierge',
          text: data.reply || 'Votre concierge Aura a bien pris en charge votre demande.',
          actionDone: data.actionDone || 'Prise en charge Concierge & Confirmation',
          savedTime: data.savedTime || '20 min',
        },
      ]);
    } catch (err) {
      console.error(err);
      setIsTyping(false);
      setChatFeed((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: 'concierge',
          text: 'Demande enregistrée avec succès. Votre concierge dédié Marc Valette s’occupe immédiatement des réservations.',
          actionDone: 'Transmis au Concierge Dédié',
          savedTime: '25 min',
        },
      ]);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSendPrompt(inputValue);
  };

  const handleResetChat = () => {
    setChatFeed([
      {
        id: '1',
        sender: 'concierge',
        text: 'Bonjour ! Je suis Aura, votre concierge personnel 24/7. Comment puis-je vous assister aujourd’hui ?',
      },
    ]);
    onShowToast('Bulle de discussion réinitialisée.');
  };

  const handleSaveAssistLoopConfig = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('aura_assistloop_appid', assistLoopAppId);
    localStorage.setItem('aura_assistloop_active', isAssistLoopActive ? 'true' : 'false');
    onShowToast('Configuration AssistLoop enregistrée !');
    setActiveTab('concierge');
  };

  return (
    <>
      {/* Container anchor for external AssistLoop script injection */}
      <div id="assistloop-widget-container" className="hidden"></div>

      {/* Floating Chat Panel Window */}
      {isOpen && (
        <div 
          className="fixed bottom-24 right-4 sm:right-6 z-50 w-[92vw] sm:w-[420px] max-h-[640px] bg-[#0b0b0e] border border-white/20 shadow-2xl rounded-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-200"
          style={{ boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.9), 0 0 30px rgba(255, 107, 0, 0.15)' }}
        >
          {/* Header Bar */}
          <div className="bg-[#121217] border-b border-white/10 p-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-9 h-9 bg-white text-black font-black font-syne flex items-center justify-center text-sm shadow-md">
                  A.
                </div>
                <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 border-2 border-[#121217] rounded-full animate-pulse"></span>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-black text-white text-sm font-syne uppercase tracking-wider">Aura Concierge</h3>
                  {isAssistLoopActive && (
                    <span className="bg-orange-500/20 text-brand-orange border border-orange-500/30 text-[9px] font-bold px-1.5 py-0.5 rounded font-mono-tracked">
                      AssistLoop
                    </span>
                  )}
                </div>
                <p className="text-[10px] text-emerald-400 uppercase tracking-widest font-mono-tracked flex items-center gap-1">
                  <span>●</span> En Ligne 24/7
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-1">
              {/* Tab Selector Toggle */}
              <button
                onClick={() => setActiveTab(activeTab === 'concierge' ? 'assistloop_config' : 'concierge')}
                className={`p-2 text-xs transition border ${
                  activeTab === 'assistloop_config'
                    ? 'bg-brand-orange text-white border-brand-orange'
                    : 'bg-white/5 text-white/60 hover:text-white border-white/10'
                }`}
                title="Intégration & Configuration AssistLoop"
              >
                <i className="fa-solid fa-gear"></i>
              </button>

              <button
                onClick={handleResetChat}
                className="p-2 text-xs text-white/40 hover:text-white transition"
                title="Réinitialiser la discussion"
              >
                <i className="fa-solid fa-rotate-left"></i>
              </button>

              <button
                onClick={onToggle}
                className="p-2 text-xs text-white/50 hover:text-white transition"
                title="Fermer la bulle"
              >
                <i className="fa-solid fa-xmark text-sm"></i>
              </button>
            </div>
          </div>

          {/* Body Content depending on Active Tab */}
          {activeTab === 'assistloop_config' ? (
            /* AssistLoop Integration Panel */
            <div className="p-5 space-y-4 overflow-y-auto text-xs text-white/80 bg-[#07070a] flex-1">
              <div className="flex items-center gap-2 text-brand-orange font-bold uppercase tracking-widest text-[11px] font-mono-tracked">
                <i className="fa-solid fa-plug"></i>
                <span>Intégration AssistLoop</span>
              </div>

              <p className="text-xs text-white/60 leading-relaxed">
                Configurez l'intégration <strong>AssistLoop</strong> pour connecter directement votre propre widget de chat ou bot externe à la bulle Aura Concierge.
              </p>

              <form onSubmit={handleSaveAssistLoopConfig} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-white/60 font-mono-tracked mb-1">
                    ID App / Widget AssistLoop
                  </label>
                  <input
                    type="text"
                    value={assistLoopAppId}
                    onChange={(e) => setAssistLoopAppId(e.target.value)}
                    placeholder="Ex: al_live_982347102"
                    className="w-full bg-[#0d0d12] border border-white/15 p-2.5 text-xs text-white placeholder-white/20 outline-none focus:border-brand-orange"
                  />
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="enableAssistLoop"
                    checked={isAssistLoopActive}
                    onChange={(e) => setIsAssistLoopActive(e.target.checked)}
                    className="rounded border-white/20 bg-black text-brand-orange focus:ring-brand-orange"
                  />
                  <label htmlFor="enableAssistLoop" className="text-xs text-white/80 cursor-pointer font-medium">
                    Activer le mode AssistLoop sur la bulle
                  </label>
                </div>

                <div className="bg-white/5 border border-white/10 p-3 space-y-2 text-[10px] text-white/60 font-mono-tracked">
                  <div className="font-bold text-white uppercase">Exemple d'intégration Script :</div>
                  <pre className="bg-black/60 p-2 text-emerald-400 overflow-x-auto rounded border border-white/5 text-[9px]">
{`<script 
  src="https://cdn.assistloop.com/widget.js" 
  data-assistloop-id="${assistLoopAppId || 'VOTRE_ID'}" 
  async>
</script>`}
                  </pre>
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="submit"
                    className="flex-1 bg-brand-orange text-white font-black py-2.5 text-xs uppercase tracking-widest transition hover:bg-orange-600"
                  >
                    Enregistrer
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('concierge')}
                    className="bg-white/10 text-white font-bold px-4 py-2.5 text-xs uppercase tracking-widest hover:bg-white/20 transition"
                  >
                    Retour
                  </button>
                </div>
              </form>
            </div>
          ) : (
            /* Standard Concierge AI Chat Panel */
            <div className="flex-1 flex flex-col p-4 bg-[#07070a] overflow-hidden">
              
              {/* Quick Suggestions */}
              <div className="space-y-1.5 mb-3">
                <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/40 font-mono-tracked">Demandes Rapides :</span>
                <div className="flex flex-wrap gap-1.5">
                  <button
                    onClick={() => handleSendPrompt('Réserve une table cosy pour 2 vendredi soir')}
                    className="text-[11px] bg-white/5 hover:bg-white hover:text-black text-white/80 px-2.5 py-1 transition border border-white/10"
                  >
                    🍽️ Resto vendredi
                  </button>
                  <button
                    onClick={() => handleSendPrompt('Trouve un vol privé Nice - Paris demain')}
                    className="text-[11px] bg-white/5 hover:bg-white hover:text-black text-white/80 px-2.5 py-1 transition border border-white/10"
                  >
                    ✈️ Vol Nice-Paris
                  </button>
                  <button
                    onClick={() => handleSendPrompt('Livre un bouquet de fleurs d’exception')}
                    className="text-[11px] bg-white/5 hover:bg-white hover:text-black text-white/80 px-2.5 py-1 transition border border-white/10"
                  >
                    💐 Fleurs
                  </button>
                </div>
              </div>

              {/* Chat Feed */}
              <div
                ref={chatContainerRef}
                className="flex-1 min-h-[240px] max-h-[360px] overflow-y-auto space-y-3 p-3 bg-[#050505] border border-white/10 rounded-xl text-xs"
              >
                {chatFeed.map((msg) => (
                  <React.Fragment key={msg.id}>
                    {msg.sender === 'user' ? (
                      <div className="flex items-start justify-end space-x-2 my-1.5">
                        <div className="bg-white text-black p-3 font-medium text-xs shadow-sm max-w-[85%] rounded-lg">
                          {msg.text}
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-start space-x-2.5 my-1.5">
                        <div className="w-6 h-6 bg-brand-orange text-white font-bold flex items-center justify-center flex-shrink-0 text-[10px] mt-0.5">
                          <i className="fa-solid fa-sparkles"></i>
                        </div>
                        <div className="bg-white/10 p-3 border border-white/10 text-white text-xs leading-relaxed max-w-[85%] space-y-2 rounded-lg">
                          <p>{msg.text}</p>
                          {msg.actionDone && (
                            <div className="bg-white/5 border border-white/10 p-1.5 text-[9px] text-white/90 font-semibold flex items-center justify-between">
                              <span className="flex items-center gap-1"><i className="fa-solid fa-circle-check text-emerald-400"></i> {msg.actionDone}</span>
                              <span className="bg-brand-orange text-white px-1.5 py-0.5 font-bold uppercase tracking-wider text-[8px]">⏱️ +{msg.savedTime}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </React.Fragment>
                ))}

                {isTyping && (
                  <div className="my-2 text-xs text-brand-orange font-semibold flex items-center space-x-2">
                    <i className="fa-solid fa-compass animate-spin"></i>
                    <span className="animate-pulse">Aura traite votre demande en temps réel...</span>
                  </div>
                )}
              </div>

              {/* Chat Form Input */}
              <form onSubmit={handleFormSubmit} className="mt-3">
                <div className="bg-[#050505] border border-white/20 p-2 flex items-center space-x-2 shadow-lg">
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Écrivez votre demande à Aura..."
                    className="flex-1 bg-transparent text-xs text-white placeholder-white/30 outline-none px-2"
                    autoComplete="off"
                  />
                  <button
                    type="submit"
                    className="bg-white text-black font-black px-3.5 py-2 text-xs uppercase tracking-wider flex items-center gap-1.5 transition hover:bg-neutral-200"
                  >
                    <span>Envoyer</span>
                    <i className="fa-solid fa-paper-plane text-[9px]"></i>
                  </button>
                </div>
              </form>

              {/* Footer status */}
              <div className="mt-2.5 flex items-center justify-between text-[10px] text-white/40 font-mono-tracked">
                <span>⚡ Conciergerie Privée Aura</span>
                <span className="text-emerald-400 font-bold">Réponse &lt;45s</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Floating Chat Bubble Launcher Button */}
      <div className="fixed bottom-6 right-6 z-50 flex items-center space-x-3">
        {/* Tooltip hint when bubble is closed */}
        {!isOpen && (
          <div 
            onClick={onToggle}
            className="hidden sm:flex items-center space-x-2 bg-[#0b0b0e] text-white border border-white/20 px-3.5 py-2 text-xs font-bold font-syne uppercase tracking-wider shadow-2xl cursor-pointer hover:border-brand-orange transition rounded-xl"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Concierge En Ligne</span>
            <span className="text-brand-orange font-black">💬</span>
          </div>
        )}

        {/* The Trigger Floating Button */}
        <button
          onClick={onToggle}
          className="relative w-14 h-14 bg-brand-orange hover:bg-orange-600 text-white shadow-2xl flex items-center justify-center transition-all duration-300 transform hover:scale-105 active:scale-95 group rounded-full border-2 border-white/20"
          style={{ boxShadow: '0 12px 35px -5px rgba(255, 107, 0, 0.6)' }}
          title="Ouvrir la bulle de discussion Concierge"
        >
          {isOpen ? (
            <i className="fa-solid fa-xmark text-xl text-white"></i>
          ) : (
            <>
              <i className="fa-solid fa-comments text-xl text-white group-hover:rotate-12 transition-transform"></i>
              {/* Pulsing halo */}
              <span className="absolute -top-1 -right-1 flex h-4 w-4">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500 border-2 border-black text-[8px] font-black text-white items-center justify-center">1</span>
              </span>
            </>
          )}
        </button>
      </div>
    </>
  );
};
