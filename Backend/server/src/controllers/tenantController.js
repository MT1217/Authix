/**
 * Returns branding for the tenant already validated by tenantHandler.
 * Safe for frontend to call with x-tenant-id — no secrets included.
 */
export function getTenantSettings(req, res) {
  const { tenant } = req;

  return res.json({
    name: tenant.name,
    subdomain: tenant.subdomain,
    logo: tenant.branding?.logo || '',
    logoUrl: tenant.branding?.logo || '',
    primaryColor: tenant.branding?.primaryColor || '#3b82f6',
    brandName: tenant.name,
  });
}
