import express from "express";
import { createServer as createViteServer } from "vite";
import Stripe from "stripe";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(express.json());

  let stripeClient: Stripe | null = null;

  function getStripe(): Stripe {
    if (!stripeClient) {
      const key = process.env.STRIPE_SECRET_KEY;
      if (!key) {
        throw new Error('STRIPE_SECRET_KEY environment variable is required');
      }
      stripeClient = new Stripe(key, {
        apiVersion: '2026-03-25.dahlia',
      });
    }
    return stripeClient;
  }

  // API Routes
  app.post("/api/create-checkout-session", async (req, res) => {
    try {
      const stripe = getStripe();
      const { userId } = req.body;

      if (!userId) {
        return res.status(400).json({ error: "User ID is required" });
      }

      // Create a Checkout Session
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [
          {
            price_data: {
              currency: "usd",
              product_data: {
                name: "Reality Vault Premium",
                description: "Acceso anticipado a series antes de ser publicadas.",
                images: ["https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgE01Vz8lW86A8J8JXj227-s_9FbHGymo6JBszE2J2L1fzGFAd69o5UgyWZS55gtNZzL03Hh4oiMfLCArzZyBTVe4Fl0cbgEhAf9ey__c0BsgoCnqDuQrwfQItIzGbwUAfDKDUKGnfjeC1QBGM-eyGlXWup8w3oDtSoO3ltRzE8eWqIsaYBS4bySg-mAu4/s1684/REALITY%20VAULT%20LOGO.png"],
              },
              unit_amount: 499, // $4.99
            },
            quantity: 1,
          },
        ],
        mode: "payment", // Using payment for simplicity, could be subscription
        success_url: `${req.headers.origin}?payment=success&session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${req.headers.origin}?payment=cancelled`,
        metadata: {
          userId: userId,
        },
      });

      res.json({ id: session.id, url: session.url });
    } catch (error: any) {
      console.error("Stripe error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*all', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
