import { useState } from 'react'
import type { FormEvent } from 'react'
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { ArrowRight, CheckCircle2, Clock3, LogOut, MessageCircle, Send, ShieldCheck, Sparkles } from 'lucide-react'
import { blink } from '@/blink/client'
import { useAuth } from '@/lib/useAuth'

export const Route = createFileRoute('/dashboard-client')({
  head: () => ({
    meta: [
      { title: 'AURA — Dashboard client' },
      { name: 'description', content: 'Votre dashboard client AURA pour piloter vos demandes de conciergerie.' },
    ],
  }),
  component: ClientDashboard,
})

type DashboardUser = { displayName?: string; email?: string }

function ClientDashboard() {
  const { user, isLoading } = useAuth()
  const navigate = useNavigate()
  const [request, setRequest] = useState('')
  const [sent, setSent] = useState(false)
  const currentUser = user as DashboardUser | null

  if (isLoading) return <DashboardLoading />
  if (!user) return <DashboardLocked />

  const firstName = currentUser?.displayName?.split(' ')[0] || 'Membre'

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!request.trim()) return
    setSent(true)
    setRequest('')
  }

  const handleLogout = async () => {
    await blink.auth.signOut()
    navigate({ to: '/' })
  }

  return (
    <main className="min-h-screen bg-background text-white">
      <header className="border-b border-white/10 bg-background/90 backdrop-blur-xl">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link to="/" className="flex flex-col">
            <span className="font-mono-tracked text-[9px] text-white/40">Private Concierge 24/7</span>
            <span className="font-display text-2xl font-black italic tracking-tighter">AURA<span className="text-primary">.</span><span className="ml-2 border-l border-white/20 pl-2 font-sans text-[10px] font-bold not-italic uppercase tracking-widest text-white/40">Dashboard client</span></span>
          </Link>
          <button type="button" onClick={handleLogout} className="flex items-center gap-2 border border-white/15 px-3 py-2 font-mono-tracked text-[9px] text-white/55 transition hover:border-red-400/50 hover:text-red-300"><LogOut size={13} /> Déconnexion</button>
        </div>
      </header>

      <div className="aura-grid pointer-events-none fixed inset-0 opacity-60" />
      <div className="relative z-10 mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-16">
        <section className="mb-10 flex flex-col justify-between gap-6 border-b border-white/10 pb-10 md:flex-row md:items-end">
          <div>
            <span className="font-mono-tracked text-[10px] text-emerald-400">● SESSION ACTIVE // CONCIERGE EN LIGNE</span>
            <h1 className="mt-4 font-display text-4xl font-black uppercase tracking-tighter sm:text-6xl">Bonjour {firstName}<span className="text-primary">.</span></h1>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-white/55">Bienvenue dans votre dashboard client. Envoyez une demande et votre concierge vous répond en moins de 45 secondes.</p>
          </div>
          <div className="border border-white/10 bg-card px-5 py-4 md:min-w-56"><p className="font-mono-tracked text-[9px] text-white/35">STATUT DU COMPTE</p><p className="mt-2 flex items-center gap-2 text-sm font-bold text-white"><CheckCircle2 size={15} className="text-emerald-400" /> Membre AURA</p><p className="mt-1 truncate text-xs text-white/40">{currentUser?.email || 'Compte connecté'}</p></div>
        </section>

        <div className="grid gap-6 lg:grid-cols-[1.25fr_0.75fr]">
          <section className="border border-white/10 bg-card p-6 sm:p-8">
            <div className="mb-7 flex items-start justify-between gap-4"><div><p className="font-mono-tracked text-[10px] text-primary">01 // NOUVELLE DEMANDE</p><h2 className="mt-2 font-display text-2xl font-black uppercase">Que puis-je faire pour vous ?</h2></div><MessageCircle className="text-primary" size={22} /></div>
            {sent ? <div className="border border-emerald-400/25 bg-emerald-400/10 p-5"><CheckCircle2 className="mb-3 text-emerald-400" size={24} /><h3 className="font-display text-lg font-black uppercase">Demande transmise</h3><p className="mt-2 text-sm text-white/55">Votre concierge revient vers vous très rapidement.</p><button type="button" onClick={() => setSent(false)} className="mt-5 text-xs font-bold uppercase tracking-widest text-primary hover:text-accent">Envoyer une autre demande →</button></div> : <form onSubmit={handleSubmit}><label htmlFor="client-request" className="sr-only">Votre demande</label><textarea id="client-request" value={request} onChange={(event) => setRequest(event.target.value)} placeholder="Ex. Trouvez-moi une table pour deux ce soir à Paris..." className="min-h-40 w-full resize-y border border-white/15 bg-white/[0.03] p-4 text-sm leading-relaxed text-white outline-none transition placeholder:text-white/25 focus:border-primary/70" /><div className="mt-4 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center"><span className="font-mono-tracked text-[9px] text-white/30">Réponse humaine + IA // 24/7</span><button type="submit" disabled={!request.trim()} className="flex items-center gap-2 bg-primary px-5 py-3 text-xs font-black uppercase tracking-widest text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-40">Envoyer au concierge <Send size={14} /></button></div></form>}
          </section>

          <div className="space-y-6">
            <section className="border border-white/10 bg-card p-6"><p className="font-mono-tracked text-[10px] text-amber-400">02 // DISPONIBILITÉ</p><div className="mt-5 flex gap-4"><Clock3 className="shrink-0 text-amber-400" size={20} /><div><h2 className="font-display text-lg font-black uppercase">Votre concierge est prêt</h2><p className="mt-2 text-xs leading-relaxed text-white/50">Aucune demande active. Lancez une nouvelle mission depuis votre dashboard.</p></div></div></section>
            <section className="border border-white/10 bg-card p-6"><p className="font-mono-tracked text-[10px] text-indigo-300">03 // VOTRE FORMULE</p><div className="mt-5 flex gap-4"><Sparkles className="shrink-0 text-indigo-300" size={20} /><div><h2 className="font-display text-lg font-black uppercase">Accès AURA</h2><p className="mt-2 text-xs leading-relaxed text-white/50">Votre compte est prêt. Découvrez les formules disponibles pour activer plus de services.</p><a href="/#pricing" className="mt-4 inline-flex items-center gap-1 text-xs font-bold uppercase tracking-widest text-primary hover:text-accent">Voir les formules <ArrowRight size={13} /></a></div></div></section>
          </div>
        </div>
      </div>
    </main>
  )
}

function DashboardLoading() {
  return <main className="flex min-h-screen items-center justify-center bg-background"><div className="flex items-center gap-3 font-mono-tracked text-[10px] text-white/45"><span className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" /> CHARGEMENT DU DASHBOARD</div></main>
}

function DashboardLocked() {
  return <main className="flex min-h-screen items-center justify-center bg-background px-4 py-16"><div className="w-full max-w-md border border-white/15 bg-card p-8 text-center"><ShieldCheck className="mx-auto mb-5 text-primary" size={30} /><p className="font-mono-tracked text-[10px] text-primary">AURA // ACCÈS RESTREINT</p><h1 className="mt-3 font-display text-3xl font-black uppercase text-white">Dashboard privé<span className="text-primary">.</span></h1><p className="mt-3 text-sm leading-relaxed text-white/55">Connectez-vous pour accéder à votre dashboard client.</p><a href="/connexion?mode=login" className="mt-7 inline-flex items-center gap-2 bg-primary px-5 py-3 text-xs font-black uppercase tracking-widest text-white transition hover:bg-orange-600">Se connecter <ArrowRight size={14} /></a></div></main>
}
