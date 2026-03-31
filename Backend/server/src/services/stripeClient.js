import Stripe from 'stripe';
import { env } from '../config/env.js';

/** Single Stripe SDK instance — uses secret key from env */
export const stripe = new Stripe(env.stripeSecretKey || 'sk_test_placeholder');
