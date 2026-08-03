import { useState } from 'react'
import type { FormEvent } from 'react'
import { ArrowRight, LoaderCircle, LockKeyhole, Mail, UserRound, X } from 'lucide-react'
import { blink } from '@/blink/client'

type AuthMode = 'login' | 'signup'

type AuthModalProps = {
  mode: AuthMode
  onModeChange: (mode: AuthMode) => void
  onClose: () => void
  onAuthenticated: () => void
}

export function AuthModal({ mode, onModeChange, onClose, onAuthenticated }: AuthModalProps) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const isSignup = mode === 'signup'

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError('')
    setSuccess('')

    if (!email || !password || (isSignup && !name)) {
      setError('Veuillez renseigner tous les champs requis.')
      return
    }

    setIsSubmitting(true)
    try {
      if (isSignup) {
        await blink.auth.signUp({ email, password, metadata: { displayName: name } })
        setSuccess('Votre compte est créé. Vérifiez votre adresse email pour l’activer.')
        setPassword('')
      } else {
        await blink.auth.signInWithEmail(email, password)
        onAuthenticated()
        onClose()
      }
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : 'Une erreur est survenue. Réessayez.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleGoogle = async () => {
    setError('')
    setIsSubmitting(true)
    try {
      await blink.auth.signInWithGoogle()
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : 'La connexion Google a échoué.')
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4 backdrop-blur-md" role="dialog" aria-modal="true" aria-labelledby="auth-title">
      <button className="absolute inset-0 cursor-default" onClick={onClose} aria-label="Fermer" />
      <div className="relative z-10 w-full max-w-md translate-y-6 border border-white/15 bg-[#0b0b0e] p-6 shadow-2xl sm:p-8">
        <button onClick={onClose} className="absolute right-4 top-4 p-2 text-white/40 transition hover:text-white" aria-label="Fermer la fenêtre">
          <X size={18} />
        </button>

        <div className="mb-8">
          <span className="font-mono-tracked text-[10px] text-primary">AURA // ACCÈS PRIVÉ</span>
          <h2 id="auth-title" className="mt-3 font-display text-3xl font-black uppercase tracking-tight text-white">
            {isSignup ? 'Rejoindre AURA' : 'Bon retour'}<span className="text-primary">.</span>
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-white/50">
            {isSignup ? 'Créez votre accès personnel à la conciergerie 24/7.' : 'Connectez-vous à votre espace client sécurisé.'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignup && <Field icon={UserRound} label="Nom complet" type="text" value={name} onChange={setName} placeholder="Alexandre Dupont" autoComplete="name" />}
          <Field icon={Mail} label="Adresse email" type="email" value={email} onChange={setEmail} placeholder="vous@exemple.com" autoComplete="email" />
          <Field icon={LockKeyhole} label="Mot de passe" type="password" value={password} onChange={setPassword} placeholder="8 caractères minimum" autoComplete={isSignup ? 'new-password' : 'current-password'} />

          {error && <p className="border border-red-400/30 bg-red-400/10 px-3 py-2 text-xs leading-relaxed text-red-300" role="alert">{error}</p>}
          {success && <p className="border border-emerald-400/30 bg-emerald-400/10 px-3 py-2 text-xs leading-relaxed text-emerald-300" role="status">{success}</p>}

          <button type="submit" disabled={isSubmitting} className="flex w-full items-center justify-center gap-2 bg-primary px-4 py-3.5 text-xs font-black uppercase tracking-widest text-white transition hover:bg-orange-600 disabled:cursor-wait disabled:opacity-60">
            {isSubmitting ? <LoaderCircle size={15} className="animate-spin" /> : <ArrowRight size={15} />}
            {isSignup ? 'Créer mon accès' : 'Se connecter'}
          </button>
        </form>

        <div className="my-5 flex items-center gap-3 text-[10px] uppercase tracking-widest text-white/25"><span className="h-px flex-1 bg-white/10" /> ou <span className="h-px flex-1 bg-white/10" /></div>
        <button type="button" onClick={handleGoogle} disabled={isSubmitting} className="w-full border border-white/15 px-4 py-3 text-xs font-bold uppercase tracking-widest text-white transition hover:border-white/35 disabled:opacity-50">
          Continuer avec Google
        </button>

        <p className="mt-6 text-center text-xs text-white/45">
          {isSignup ? 'Vous avez déjà un accès ?' : 'Pas encore membre ?'}{' '}
          <button type="button" onClick={() => { setError(''); setSuccess(''); onModeChange(isSignup ? 'login' : 'signup') }} className="font-bold text-primary hover:text-accent">
            {isSignup ? 'Se connecter' : 'Créer un compte'}
          </button>
        </p>
      </div>
    </div>
  )
}

function Field({ icon: Icon, label, type, value, onChange, placeholder, autoComplete }: { icon: typeof Mail; label: string; type: string; value: string; onChange: (value: string) => void; placeholder: string; autoComplete: string }) {
  return (
    <label className="block">
      <span className="mb-2 block font-mono-tracked text-[9px] text-white/45">{label}</span>
      <span className="flex items-center gap-3 border border-white/15 bg-white/[0.03] px-3.5 focus-within:border-primary/70">
        <Icon size={15} className="text-primary" />
        <input type={type} value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} autoComplete={autoComplete} className="min-w-0 flex-1 bg-transparent py-3 text-sm text-white outline-none placeholder:text-white/25" />
      </span>
    </label>
  )
}
