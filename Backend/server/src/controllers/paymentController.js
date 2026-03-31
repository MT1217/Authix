import { Content } from '../models/Content.js';
import { User } from '../models/User.js';
import { Transaction } from '../models/Transaction.js';
import { stripe } from '../services/stripeClient.js';
import { env } from '../config/env.js';

/**
 * Creates a Stripe Checkout Session (exposed at POST /payments/create-intent per product spec).
 *
 * 90/10 split using Connect:
 * - application_fee_amount = 10% of total → platform (Authix) keeps this portion
 * - transfer_data.destination = tenant's Connect account → receives the rest (~90%)
 *
 * Metadata carries tenant + student + content so the webhook can unlock content safely
 * within the correct tenant boundary.
 */
export async function createPaymentIntent(req, res) {
  try {
    const { contentId } = req.body;

    if (!contentId) {
      return res.status(400).json({ message: 'contentId is required' });
    }

    if (!req.tenant.stripeAccountId) {
      return res.status(400).json({ message: 'Tenant is not connected to Stripe' });
    }

    const content = await Content.findOne({ _id: contentId, tenantId: req.tenantId });

    if (!content) {
      return res.status(404).json({ message: 'Content not found in this tenant' });
    }

    const amount = content.priceCents;

    if (!amount || amount < 50) {
      return res.status(400).json({ message: 'Content must have a valid priceCents (min 50)' });
    }

    const platformFeeCents = Math.round(amount * 0.1);

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_intent_data: {
        application_fee_amount: platformFeeCents,
        transfer_data: {
          destination: req.tenant.stripeAccountId,
        },
      },
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: { name: content.title },
            unit_amount: amount,
          },
          quantity: 1,
        },
      ],
      metadata: {
        tenantId: req.tenantId.toString(),
        studentId: req.user.userId,
        contentId: content._id.toString(),
      },
      success_url: `${env.frontendUrl}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${env.frontendUrl}/dashboard`,
    });

    await Transaction.create({
      tenantId: req.tenantId,
      studentId: req.user.userId,
      contentId: content._id,
      amountCents: amount,
      platformFeeCents,
      stripeCheckoutSessionId: session.id,
      status: 'pending',
    });

    return res.json({ url: session.url, sessionId: session.id });
  } catch (error) {
    return res.status(500).json({ message: 'Payment session failed', error: error.message });
  }
}

/**
 * Stripe webhook — must use raw body for signature verification.
 * On checkout.session.completed, unlock content for the student within the same tenant.
 */
export async function handleStripeWebhook(req, res) {
  const signature = req.headers['stripe-signature'];

  if (!signature) {
    return res.status(400).send('Missing stripe-signature');
  }

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, signature, env.stripeWebhookSecret);
  } catch (err) {
    return res.status(400).send(`Webhook signature verification failed: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const { tenantId, studentId, contentId } = session.metadata || {};

    if (tenantId && studentId && contentId) {
      await User.findOneAndUpdate(
        { _id: studentId, tenantId },
        { $addToSet: { unlockedContentIds: contentId } }
      );

      await Transaction.findOneAndUpdate(
        { stripeCheckoutSessionId: session.id },
        { status: 'completed', stripePaymentIntentId: session.payment_intent || '' }
      );
    }
  }

  return res.json({ received: true });
}
