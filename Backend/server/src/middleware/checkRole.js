/**
 * RBAC helper — allow only specific roles after authenticate + requireSameTenant.
 * Controllers still MUST filter by tenantId on every database read/write.
 */
export function checkRole(...allowedRoles) {
  return function roleMiddleware(req, res, next) {
    if (!req.user?.role) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Insufficient permissions for this role' });
    }

    return next();
  };
}
