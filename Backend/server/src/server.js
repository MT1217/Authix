import cors from 'cors';
import express from 'express';
import { connectDb } from './config/db.js';
import { env } from './config/env.js';
import { tenantHandler } from './middleware/tenantHandler.js';
import { getPublicBranding } from './controllers/publicController.js';
import authRoutes from './routes/authRoutes.js';
import tenantRoutes from './routes/tenantRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import mentorRoutes from './routes/mentorRoutes.js';
import studentRoutes from './routes/studentRoutes.js';

const app = express();

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
