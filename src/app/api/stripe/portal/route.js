import Stripe from 'stripe';
import { createClient } from '@/lib/supabase/server';

export async function POST(request) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const { data: profile } = await supabase
    .from('profiles')
    .select('stripe_customer_id')
    .eq('id', user.id)
    .single();

  if (!profile?.stripe_customer_id) {
    return Response.json({ error: 'No active subscription found' }, { status: 400 });
  }

  const origin = process.env.NEXT_PUBLIC_APP_URL ?? `https://${request.headers.get('host')}`;

  const session = await stripe.billingPortal.sessions.create({
    customer: profile.stripe_customer_id,
    return_url: `${origin}/settings`,
  });

  return Response.json({ url: session.url });
}
