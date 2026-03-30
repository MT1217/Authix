import Stripe from 'stripe';
import { env } from '../config/env.js';

const stripe = new Stripe(env.stripeSecretKey || 'sk_test_placeholder');

export async function createCheckoutSession({ courseTitle, amountInCents, mentorStripeAccountId }) {
  // 90/10 split: mentor receives 90%, platform keeps 10% as application fee.
  const applicationFeeAmount = Math.round(amountInCents * 0.1);

  return stripe.checkout.sessions.create({
    mode: 'payment',
    line_items: [
      {
        price_data: {
          currency: 'usd',
          product_data: { name: courseTitle },
          unit_amount: amountInCents,
        },
        quantity: 1,
      },
    ],
    payment_intent_data: {
      application_fee_amount: applicationFeeAmount,
      transfer_data: {
        destination: mentorStripeAccountId,
      },
    },
    success_url: 'http://localhost:3000/dashboard/student',
    cancel_url: 'http://localhost:3000/dashboard/student',
  });
}
