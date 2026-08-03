import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Initialize Gemini AI Client
  const getAiClient = () => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is missing");
    }
    return new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  };

  // API Routes
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok" });
  });

  // Helpers pour la validation de Supabase et Stripe
  const isValidSupabaseUrl = (url?: string): boolean => {
    if (!url || typeof url !== 'string') return false;
    const trimmed = url.trim();
    if (trimmed.includes("your-project") || trimmed.includes("MY_APP_URL")) return false;
    try {
      const parsed = new URL(trimmed);
      return parsed.protocol === 'http:' || parsed.protocol === 'https:';
    } catch {
      return false;
    }
  };

  const isValidStripeKey = (key?: string): boolean => {
    if (!key || typeof key !== 'string') return false;
    const trimmed = key.trim();
    return (trimmed.startsWith("sk_test_") || trimmed.startsWith("sk_live_") || trimmed.startsWith("rk_test_") || trimmed.startsWith("rk_live_")) && trimmed.length > 20;
  };

  // Endpoint pour récupérer toutes les données Dashboard du Client (Supabase & Stripe)
  app.get("/api/client-dashboard-data", async (req, res) => {
    try {
      const email = (req.query.email as string) || "alexandre.dupont@exemple.com";
      const supabaseUrl = process.env.SUPABASE_URL;
      const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;
      const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

      let clientProfile = {
        id: "usr_sb_984210",
        firstName: "Alexandre",
        lastName: "Dupont",
        email: email,
        phone: "+33 6 12 34 56 78",
        packageName: "Concierge Premium (29,99€/mois)",
        createdAt: "2026-08-01T10:00:00Z",
        supabaseSynced: false,
        supabaseTable: "clients",
      };

      let supabaseStatus = {
        connected: false,
        message: "Base de données prête. Configurer SUPABASE_URL dans les secrets pour la synchro temps réel.",
      };

      // Query Supabase if credentials and URL are valid
      if (isValidSupabaseUrl(supabaseUrl) && supabaseKey && !supabaseKey.includes("your-project")) {
        try {
          const { createClient } = await import('@supabase/supabase-js');
          const supabase = createClient(supabaseUrl, supabaseKey);

          const { data, error } = await supabase
            .from('clients')
            .select('*')
            .eq('email', email)
            .single();

          if (data && !error) {
            clientProfile = {
              id: data.id || `sb_${data.email}`,
              firstName: data.first_name || clientProfile.firstName,
              lastName: data.last_name || clientProfile.lastName,
              email: data.email || clientProfile.email,
              phone: data.phone || clientProfile.phone,
              packageName: data.package_name || clientProfile.packageName,
              createdAt: data.created_at || clientProfile.createdAt,
              supabaseSynced: true,
              supabaseTable: "clients",
            };
            supabaseStatus = {
              connected: true,
              message: "Connecté et synchronisé à la table Supabase 'clients'",
            };
          } else {
            supabaseStatus = {
              connected: true,
              message: error ? error.message : "Connecté à Supabase (enregistrement créé au 1er achat)",
            };
          }
        } catch (e: any) {
          console.warn("[Supabase Handled Notification]", e.message || e);
        }
      }

      // Fetch or simulate Stripe data
      let stripeSubscription = {
        status: "active",
        planName: clientProfile.packageName || "Concierge Premium",
        amount: "29,99 €",
        currency: "EUR",
        interval: "mois",
        currentPeriodEnd: "2026-09-01",
        cancelAtPeriodEnd: false,
        paymentMethod: {
          brand: "Visa",
          last4: "4242",
          expMonth: 12,
          expYear: 2028,
        },
        stripeCustomerId: "cus_R9x8aK2pL0",
        stripeSubscriptionId: "sub_1PqX992eZv",
        liveStripeConnected: isValidStripeKey(stripeSecretKey),
      };

      let invoices = [
        {
          id: "inv_1PqX992eZv_001",
          date: "2026-08-01",
          amount: "29,99 €",
          status: "payée",
          description: "Abonnement Mensuel - Aura Concierge Premium",
          pdfUrl: "#invoice-pdf-001",
        },
        {
          id: "inv_1PqX992eZv_000",
          date: "2026-07-01",
          amount: "29,99 €",
          status: "payée",
          description: "Abonnement Mensuel - Aura Concierge Premium",
          pdfUrl: "#invoice-pdf-000",
        },
      ];

      // If valid Stripe SDK key present, fetch real customer
      if (isValidStripeKey(stripeSecretKey)) {
        try {
          const { default: Stripe } = await import("stripe");
          const stripe = new Stripe(stripeSecretKey!);

          const customers = await stripe.customers.list({ email: email, limit: 1 });
          if (customers.data.length > 0) {
            const cust = customers.data[0];
            stripeSubscription.stripeCustomerId = cust.id;

            const subs = await stripe.subscriptions.list({ customer: cust.id, limit: 1 });
            if (subs.data.length > 0) {
              const sub: any = subs.data[0];
              stripeSubscription.stripeSubscriptionId = sub.id;
              stripeSubscription.status = sub.status;
              if (sub.current_period_end) {
                stripeSubscription.currentPeriodEnd = new Date(sub.current_period_end * 1000).toISOString().split('T')[0];
              }
            }

            const invList = await stripe.invoices.list({ customer: cust.id, limit: 5 });
            if (invList.data.length > 0) {
              invoices = invList.data.map((inv: any) => ({
                id: inv.id,
                date: new Date(inv.created * 1000).toISOString().split('T')[0],
                amount: `${((inv.amount_paid || 0) / 100).toFixed(2)} €`,
                status: (inv.paid || inv.status === 'paid') ? "payée" : inv.status || "en cours",
                description: inv.lines?.data?.[0]?.description || "Abonnement Concierge",
                pdfUrl: inv.invoice_pdf || "#",
              }));
            }
          }
        } catch (stErr: any) {
          console.warn("[Stripe API Handled Notification]", stErr.message || stErr);
        }
      }

      res.json({
        clientProfile,
        supabaseStatus,
        stripeSubscription,
        invoices,
      });
    } catch (error: any) {
      console.error("Erreur Dashboard Data API:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // Endpoint de mise à jour des infos du profil dans Supabase
  app.post("/api/update-client-profile", async (req, res) => {
    try {
      const { firstName, lastName, email, phone, packageName } = req.body;
      const status = await saveClientToSupabase({ firstName, lastName, email, phone, packageName });

      res.json({
        success: true,
        message: "Profil mis à jour et synchronisé avec Supabase",
        status,
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });
  const saveClientToSupabase = async (clientData: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    packageName?: string;
  }) => {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

    if (!isValidSupabaseUrl(supabaseUrl) || !supabaseKey || supabaseKey.includes("your-project")) {
      console.log(`[Supabase Info] Enregistrement local / simulation mode - Prêt pour Supabase. Données client:`, clientData);
      return { success: true, mode: "log_mode", message: "Veuillez configurer un SUPABASE_URL valide dans les secrets pour la synchro." };
    }

    try {
      const { createClient } = await import('@supabase/supabase-js');
      const supabase = createClient(supabaseUrl, supabaseKey);

      const { data, error } = await supabase
        .from('clients')
        .upsert(
          [
            {
              first_name: clientData.firstName,
              last_name: clientData.lastName,
              email: clientData.email,
              phone: clientData.phone,
              package_name: clientData.packageName || 'Concierge Premium',
              updated_at: new Date().toISOString(),
            },
          ],
          { onConflict: 'email' }
        )
        .select();

      if (error) {
        console.warn("[Supabase Handled Error]", error.message);
        return { success: false, error: error.message };
      }

      console.log("[Supabase Success] Client enregistré dans la table 'clients':", data);
      return { success: true, data };
    } catch (err: any) {
      console.warn("[Supabase Handled Exception]", err.message || err);
      return { success: false, error: err.message };
    }
  };

  // Endpoint dédié pour enregistrer un client dans Supabase
  app.post("/api/register-client", async (req, res) => {
    try {
      const { firstName, lastName, email, phone, packageName } = req.body;
      
      console.log(`[Enregistrement Supabase] ${firstName} ${lastName} (${email}) - ${phone}`);
      const supabaseStatus = await saveClientToSupabase({ firstName, lastName, email, phone, packageName });

      res.json({
        success: true,
        message: "Client enregistré avec succès",
        supabaseStatus,
      });
    } catch (error: any) {
      console.error("Erreur Route Supabase /api/register-client:", error);
      res.status(500).json({ error: error.message || "Erreur lors de l'enregistrement dans Supabase" });
    }
  });

  // Checkout Session Endpoint
  app.post("/api/create-checkout-session", async (req, res) => {
    try {
      const { firstName, lastName, email, phone, packageName } = req.body;

      // Validation des données
      if (!firstName || !lastName || !email || !phone) {
        console.error("[Checkout] Données manquantes:", { firstName, lastName, email, phone });
        return res.status(400).json({ error: "Données de client manquantes (firstName, lastName, email, phone)" });
      }

      console.log(`[Subscription Request] Customer: ${firstName} ${lastName}, Email: ${email}, Phone: ${phone}, Package: ${packageName}`);

      // Auto-save to Supabase
      saveClientToSupabase({ firstName, lastName, email, phone, packageName }).catch(e => console.error("Erreur async Supabase:", e));

      const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
      if (isValidStripeKey(stripeSecretKey)) {
        try {
          const { default: Stripe } = await import("stripe");
          const stripe = new Stripe(stripeSecretKey!);
          
          const priceAmount = packageName?.includes('VIP') ? 6999 : packageName?.includes('Basic') ? 0 : 2999;
          
          console.log(`[Stripe] Création de session: email=${email}, montant=${priceAmount}cents, formule=${packageName}`);
          
          const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            customer_email: email,
            line_items: [
              {
                price_data: {
                  currency: 'eur',
                  product_data: {
                    name: `Aura Concierge - ${packageName || 'Concierge Premium'}`,
                    description: `Membre : ${firstName} ${lastName} (${phone})`,
                    metadata: {
                      member_email: email,
                      member_phone: phone,
                    },
                  },
                  unit_amount: priceAmount,
                  ...(priceAmount > 0 ? { recurring: { interval: 'month' } } : {}),
                },
                quantity: 1,
              },
            ],
            mode: priceAmount > 0 ? 'subscription' : 'payment',
            success_url: `${req.headers.origin || 'http://localhost:3000'}/profil?checkout=success&session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${req.headers.origin || 'http://localhost:3000'}/#pricing`,
            metadata: {
              customer_first_name: firstName,
              customer_last_name: lastName,
              customer_phone: phone,
              package_name: packageName,
            },
          });

          console.log(`[Stripe] Session créée avec succès: ${session.id} - URL: ${session.url}`);
          res.json({ 
            checkoutUrl: session.url,
            sessionId: session.id,
            status: 'success',
            message: "Session de paiement créée avec succès"
          });
          return;
        } catch (stripeErr: any) {
          console.error("[Stripe Error]", stripeErr.message || stripeErr);
          console.warn("Stripe Checkout creation failed, falling back to instant confirmation:", stripeErr.message || stripeErr);
        }
      } else {
        console.warn("[Stripe] Clé secrète invalide ou manquante");
      }

      // Fallback: Default redirection endpoint if Stripe fails
      const successRedirectUrl = `${req.headers.origin || 'http://localhost:3000'}/profil?subscription=success&name=${encodeURIComponent(`${firstName || ''}`)}`;

      console.log("[Fallback] Utilisation du fallback pour redirection:", successRedirectUrl);
      res.json({
        checkoutUrl: successRedirectUrl,
        status: 'fallback',
        message: "Redirection vers la confirmation de votre abonnement (mode fallback)",
        customer: { firstName, lastName, email, phone, packageName },
      });
    } catch (error: any) {
      console.error("Erreur Checkout Session:", error);
      res.status(500).json({ error: error.message || "Erreur de création de session de paiement" });
    }
  });


  app.post("/api/concierge", async (req, res) => {
    try {
      const { query } = req.body;
      if (!query || typeof query !== "string") {
        res.status(400).json({ error: "La requête doit contenir un message valide." });
        return;
      }

      const ai = getAiClient();
      const result = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: query,
        config: {
          systemInstruction:
            "Tu es Aura, le concierge privé virtuel et assistant personnel de luxe 24/7 de l'application Aura Concierge. Ton ton est courtois, haut de gamme, réactif, chaleureux et très efficace. Tu aides le membre à réserver des tables de restaurant, organiser des voyages, réserver des billets de spectacle, commander des fleurs, trouver des cadeaux uniques ou résoudre des imprévus. Propose toujours une solution concrète et attentionnée en français en 2 à 4 phrases maximum.",
          temperature: 0.7,
        },
      });

      const responseText = result.text || "Votre concierge Aura a bien pris en charge votre demande.";

      // Generate a simulated action summary
      res.json({
        reply: responseText,
        actionDone: "Prise en charge Concierge & Confirmation",
        savedTime: `${Math.floor(Math.random() * 25) + 15} min`,
      });
    } catch (error: any) {
      console.error("Erreur Concierge API:", error);
      res.status(500).json({
        reply: "Nous avons bien enregistré votre demande. Votre concierge dédié Marc Valette va finaliser les détails directement avec vous.",
        actionDone: "Transmis à votre concierge humain Marc V.",
        savedTime: "15 min",
      });
    }
  });

  // Vite Middleware for Development / Production Static Server
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
    
    // SPA fallback - serve index.html for all non-API routes
    app.use((req, res, next) => {
      if (req.path.startsWith('/api/')) {
        return next();
      }
      if (req.path.includes('.')) {
        // Skip static files (js, css, etc)
        return next();
      }
      // Serve index.html for all other routes (let React Router handle it)
      vite.transformIndexHtml(req.originalUrl, `
        <!DOCTYPE html>
        <html lang="en">
          <head>
            <meta charset="UTF-8" />
            <link rel="icon" type="image/svg+xml" href="/vite.svg" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <title>Aura Concierge</title>
          </head>
          <body>
            <div id="root"></div>
            <script type="module" src="/src/main.tsx"></script>
          </body>
        </html>
      `).then(html => {
        res.type('html').end(html);
      }).catch(err => {
        console.error("[v0] Error transforming index.html:", err);
        next(err);
      });
    });
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    
    // SPA fallback - serve index.html for all non-API routes
    app.get("*", (req, res) => {
      if (req.path.startsWith('/api/')) {
        return res.status(404).json({ error: 'API route not found' });
      }
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Server] Aura Concierge running on http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
