const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

const priceIds: Record<string, string | undefined> = {
  premium: 'price_1U0TLbIhxtlG92jqh50EFdoB',
  vip: 'price_1U0TLbIhxtlG92jqIo0cXKHE',
}

function json(body: Record<string, unknown>, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })
}

Deno.serve(async (request) => {
  if (request.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })
  if (request.method !== 'POST') return json({ error: 'Méthode non autorisée.' }, 405)

  const secretKey = Deno.env.get('STRIPE_SECRET_KEY')
  if (!secretKey) return json({ error: 'La configuration Stripe est incomplète.' }, 500)

  try {
    const { plan } = await request.json() as { plan?: string }
    const priceId = plan ? priceIds[plan] : undefined
    if (!priceId) return json({ error: 'Formule Stripe inconnue.' }, 400)

    const origin = request.headers.get('origin') || 'https://landing-builder-html-esm6swh4.blinkpowered.com'
    const form = new URLSearchParams()
    form.set('mode', 'subscription')
    form.set('line_items[0][price]', priceId)
    form.set('line_items[0][quantity]', '1')
    form.set('success_url', `${origin}/?checkout=success`)
    form.set('cancel_url', `${origin}/#pricing`)
    form.set('allow_promotion_codes', 'true')
    form.set('billing_address_collection', 'auto')
    form.set(`subscription_data[metadata][plan]`, plan || '')

    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 10000)
    const stripeResponse = await fetch('https://api.stripe.com/v1/checkout/sessions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${secretKey}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: form,
      signal: controller.signal,
    }).finally(() => clearTimeout(timeout))

    const session = await stripeResponse.json() as { url?: string; error?: { message?: string } }
    if (!stripeResponse.ok || !session.url) {
      return json({ error: session.error?.message || 'Stripe n’a pas pu créer la session.' }, 502)
    }

    return json({ url: session.url })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Une erreur inattendue est survenue.'
    return json({ error: message }, 500)
  }
})
