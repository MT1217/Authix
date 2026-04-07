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
  },
  { timestamps: true }
);

export const Tenant = mongoose.model('Tenant', tenantSchema);
