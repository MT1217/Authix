import { Tenant } from '../models/Tenant.js';

/**
 * Public branding by subdomain query (no x-tenant-id) — used by marketing sites or local dev.
 * Does not expose stripeAccountId or internal IDs if you prefer; here we return safe fields only.
 */
export async function getPublicBranding(req, res) {
  try {
    const slug = req.query.tenant;

    if (!slug) {
      return res.status(400).json({ message: 'tenant query required' });
    }

    const tenant = await Tenant.findOne({ subdomain: String(slug).trim() });

    if (!tenant) {
      return res.status(404).json({ message: 'Tenant not found' });
    }

    return res.json({
      brandName: tenant.name,
      logoUrl: tenant.branding?.logo || '',
      primaryColor: tenant.branding?.primaryColor || '#3b82f6',
      backgroundColor: '#0f172a',
    });
  } catch (error) {
    return res.status(500).json({ message: 'Branding lookup failed', error: error.message });
  }
}
