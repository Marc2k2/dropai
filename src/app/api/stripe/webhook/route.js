import Stripe from 'stripe';
import { createAdminClient } from '@/lib/supabase/admin';

export async function POST(request) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

  const planByPrice = () => ({
    [process.env.STRIPE_PRICE_STARTER]: 'starter',
    [process.env.STRIPE_PRICE_PRO]: 'pro',
    [process.env.STRIPE_PRICE_AGENCY]: 'agency',
  });

  const body = await request.text();
  const signature = request.headers.get('stripe-signature');

  let event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET);
  } catch {
    return Response.json({ error: 'Webhook signature invalid' }, { status: 400 });
  }

  const supabase = createAdminClient();

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        const userId = session.metadata?.user_id;
        if (!userId) break;

        const subscription = await stripe.subscriptions.retrieve(session.subscription);
        const priceId = subscription.items.data[0]?.price?.id;

        const { error } = await supabase
          .from('profiles')
          .update({
            plan: planByPrice()[priceId] ?? 'free',
            stripe_customer_id: session.customer,
            stripe_subscription_id: session.subscription,
          })
          .eq('id', userId);

        if (error) throw error;
        break;
      }

      case 'customer.subscription.updated': {
        const sub = event.data.object;
        const priceId = sub.items.data[0]?.price?.id;

        const { error } = await supabase
          .from('profiles')
          .update({ plan: planByPrice()[priceId] ?? 'free' })
          .eq('stripe_customer_id', sub.customer);

        if (error) throw error;
        break;
      }

      case 'customer.subscription.deleted': {
        const sub = event.data.object;

        const { error } = await supabase
          .from('profiles')
          .update({ plan: 'free', stripe_subscription_id: null })
          .eq('stripe_customer_id', sub.customer);

        if (error) throw error;
        break;
      }
    }
  } catch (err) {
    console.error('Webhook DB error:', err);
    return Response.json({ error: 'Internal error' }, { status: 500 });
  }

  return Response.json({ received: true });
}
