import { useEffect } from 'react'
import { createFileRoute, Link, useNavigate, useSearch } from '@tanstack/react-router'
import { ArrowLeft } from 'lucide-react'
import { AuthPanel } from '@/components/landing/AuthPanel'
import { useAuth } from '@/lib/useAuth'

export const Route = createFileRoute('/connexion')({
  validateSearch: (search: Record<string, unknown>) => ({
    mode: search.mode === 'signup' ? 'signup' as const : 'login' as const,
  }),
  head: () => ({
    meta: [
      { title: 'AURA — Connexion et inscription' },
      { name: 'description', content: 'Accédez à votre espace client AURA ou créez votre compte de conciergerie privée.' },
    ],
  }),
  component: ConnectionPage,
})

function ConnectionPage() {
  const { mode } = useSearch({ from: '/connexion' })
  const navigate = useNavigate()
  const { user, isLoading } = useAuth()

  useEffect(() => {
    if (!isLoading && user) navigate({ to: '/espace-client', replace: true })
  }, [isLoading, navigate, user])

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-4 py-16 sm:px-6">
      <div className="aura-grid pointer-events-none absolute inset-0 opacity-80" />
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-[130px]" />

      <div className="absolute left-4 right-4 top-6 flex items-center justify-between sm:left-8 sm:right-8 sm:top-8">
        <Link to="/" className="font-display text-2xl font-black italic tracking-tighter text-white transition hover:text-primary">
          AURA<span className="text-primary">.</span>
        </Link>
        <Link to="/" className="flex items-center gap-2 font-mono-tracked text-[10px] text-white/45 transition hover:text-white">
          <ArrowLeft size={13} /> Retour à l’accueil
        </Link>
      </div>

      <div className="relative flex w-full flex-col items-center">
        <AuthPanel initialMode={mode} onAuthenticated={() => navigate({ to: '/' })} />
        <p className="mt-6 font-mono-tracked text-[9px] text-white/25">AURA PRIVATE CONCIERGE // SECURE ACCESS</p>
      </div>
    </main>
  )
}
