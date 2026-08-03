export type PaidPlan = 'premium' | 'vip'

type CheckoutResponse = { url?: string; error?: string }

export async function createCheckoutSession(plan: PaidPlan) {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
  if (!supabaseUrl) throw new Error('La configuration Stripe est indisponible.')

  const response = await fetch(`${supabaseUrl}/functions/v1/create-checkout-session`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ plan }),
  })
  const payload = await response.json() as CheckoutResponse

  if (!response.ok || !payload.url) {
    throw new Error(payload.error || 'Impossible d’ouvrir le paiement Stripe.')
  }

  return payload.url
}
