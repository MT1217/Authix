export function checkTenant(req, res, next) {
  const tenantId = req.header('x-tenant-id');

  if (!tenantId) {
    return res.status(400).json({ message: 'x-tenant-id header is required' });
  }

  req.tenantId = tenantId;
  return next();
}
