import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';

/**
 * Verifies JWT and loads identity onto the request.
 * Payload must include tenantId to match the header-resolved tenant (see requireSameTenant).
 */
export function authenticate(req, res, next) {
  const header = req.header('authorization');
  const token = header?.startsWith('Bearer ') ? header.slice(7) : null;

  if (!token) {
    return res.status(401).json({ message: 'Authentication required' });
  }

  try {
    const payload = jwt.verify(token, env.jwtSecret);
    req.user = {
      userId: payload.userId,
      role: payload.role,
      tenantId: payload.tenantId,
    };
    return next();
  } catch {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
}

/**
 * Ensures the token's tenantId matches the tenant resolved by tenantHandler for this request.
 * Stops tokens issued for org A from being replayed against org B with a swapped header.
 */
export function requireSameTenant(req, res, next) {
  const tokenTenant = String(req.user.tenantId || '');
  const requestTenant = String(req.tenantId || '');

  if (tokenTenant !== requestTenant) {
    return res.status(403).json({ message: 'Token tenant does not match request tenant' });
  }
  return next();
}
