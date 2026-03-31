import { Tenant } from '../models/Tenant.js';

/**
 * Admin-only: update tenant branding. Isolation: only req.tenant (same as header) is updated.
 */
export async function updateBranding(req, res) {
  try {
    const { logo, primaryColor } = req.body;

    const tenant = await Tenant.findById(req.tenantId);
    if (!tenant) {
      return res.status(404).json({ message: 'Tenant not found' });
    }

    if (logo !== undefined) tenant.branding.logo = logo;
    if (primaryColor !== undefined) tenant.branding.primaryColor = primaryColor;

    await tenant.save();

    return res.json({
      logo: tenant.branding.logo,
      primaryColor: tenant.branding.primaryColor,
    });
  } catch (error) {
    return res.status(500).json({ message: 'Branding update failed', error: error.message });
  }
}
