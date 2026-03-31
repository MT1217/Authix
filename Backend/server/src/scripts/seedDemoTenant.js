/**
 * Optional: creates a demo tenant with subdomain `platform-main` for local development.
 * Run: node src/scripts/seedDemoTenant.js
 * Requires MONGO_URI in .env (load via manual dotenv or set env var).
 */
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { Tenant } from '../models/Tenant.js';

dotenv.config({ path: '.env' });

const uri = process.env.MONGO_URI;
if (!uri) {
  console.error('MONGO_URI required');
  process.exit(1);
}

async function run() {
  await mongoose.connect(uri);
  await Tenant.findOneAndUpdate(
    { subdomain: 'platform-main' },
    {
      name: 'Authix Platform',
      subdomain: 'platform-main',
      branding: { logo: '', primaryColor: '#3b82f6' },
      stripeAccountId: '',
    },
    { upsert: true }
  );
  console.log('Seeded tenant: platform-main');
  await mongoose.disconnect();
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
