import mongoose from 'mongoose';

/**
 * Tenant (organization) record — root of logical isolation.
 * Other collections store tenantId pointing here; middleware resolves the active tenant per request.
 */
const tenantSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    subdomain: { type: String, required: true, unique: true, index: true },
    branding: {
      logo: { type: String, default: '' },
      primaryColor: { type: String, default: '#3b82f6' },
    },
    /** Stripe Connect account ID for this organization — receives ~90% of charges after platform fee */
    stripeAccountId: { type: String, default: '' },
  },
  { timestamps: true }
);

export const Tenant = mongoose.model('Tenant', tenantSchema);
