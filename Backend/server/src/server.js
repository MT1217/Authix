import cors from 'cors';
import express from 'express';
import { connectDb } from './config/db.js';
import { env } from './config/env.js';
import { tenantHandler } from './middleware/tenantHandler.js';
import { handleStripeWebhook } from './controllers/paymentController.js';
import { getPublicBranding } from './controllers/publicController.js';
import authRoutes from './routes/authRoutes.js';
import tenantRoutes from './routes/tenantRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import mentorRoutes from './routes/mentorRoutes.js';
import studentRoutes from './routes/studentRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';

const app = express();

/**
 * Stripe webhooks require the raw request body — register before express.json().
 * This route intentionally skips tenantHandler; trust is established via Stripe signature.
 */
app.post('/api/payments/webhook', express.raw({ type: 'application/json' }), handleStripeWebhook);

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => res.json({ status: 'ok' }));

/** Public branding by subdomain — no x-tenant-id required */
app.get('/api/public/branding', getPublicBranding);

/**
 * All JSON API routes below require a valid tenant header and an existing Tenants row.
 * That pins every document operation to one organization (logical isolation).
 */
const api = express.Router();
api.use(tenantHandler);

api.use('/auth', authRoutes);
api.use('/tenant', tenantRoutes);
api.use('/admin', adminRoutes);
api.use('/mentor', mentorRoutes);
api.use('/student', studentRoutes);
api.use('/payments', paymentRoutes);

app.use('/api', api);

async function start() {
  await connectDb();
  app.listen(env.port, () => {
    // eslint-disable-next-line no-console
    console.log(`Authix server running on port ${env.port}`);
  });
}

start().catch((error) => {
  // eslint-disable-next-line no-console
  console.error('Server startup failed', error);
  process.exit(1);
});
