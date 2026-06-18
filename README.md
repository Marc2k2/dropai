# DropAI

All-in-one AI toolkit for dropshippers. Replace Minea + Jasper + AdCreative (€119+/mês) with one tool at €19/mês.

## Tools

- **Copy Generator** — Headlines, product descriptions, bullet points, Meta ads, abandoned cart emails
- **Ad Script Creator** — 3 UGC scripts per product (TikTok / Instagram Reels) with hook, body, CTA, and camera notes
- **Product Analyzer** — Verdict, virgin angle, saturation score, target person, TikTok hook, risk assessment
- **Competitor Spy** — Positioning analysis, weak points, market gaps, differentiation angles

## Stack

- **Frontend** — Next.js 14 (App Router) + Tailwind CSS
- **Auth + DB** — Supabase (email/password auth, usage tracking, plan management)
- **AI** — Claude API (`claude-sonnet-4-6`) via Anthropic SDK
- **Payments** — Stripe (Checkout + Customer Portal + webhooks)
- **Deploy** — Vercel

## Setup

1. Clone and install:
   ```bash
   npm install
   ```

2. Copy env file and fill in your keys:
   ```bash
   cp .env.local.example .env.local
   ```

3. Run the SQL schema in your Supabase SQL editor (see `.env.local.example` for instructions).

4. Start dev server:
   ```bash
   npm run dev
   ```

## Pricing

| Plan | Price | Generations |
|------|-------|-------------|
| Starter | €19/mês | 100/month |
| Pro | €49/mês | Unlimited |
| Agency | €149/mês | Unlimited + multi-workspace |
