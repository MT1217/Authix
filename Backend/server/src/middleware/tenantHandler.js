import mongoose from 'mongoose';
import { Tenant } from '../models/Tenant.js';

/**
 * Tenant Guard — enforces logical isolation before route handlers run.
 *
 * How multi-tenant isolation works here:
 * 1. The client sends `x-tenant-id` (subdomain slug OR MongoDB ObjectId string for the tenant).
 * 2. We resolve exactly one Tenant document. If none exists, the organization is unknown → 404.
 * 3. We attach `req.tenant` (full doc) and `req.tenantId` (ObjectId) so every downstream
 *    controller can scope queries as `{ tenantId: req.tenantId }`, preventing cross-org leakage.
 */
export async function tenantHandler(req, res, next) {
  try {
    const headerValue = req.header('x-tenant-id');

    if (!headerValue || !String(headerValue).trim()) {
      return res.status(400).json({ message: 'Missing x-tenant-id header' });
    }

    const raw = String(headerValue).trim();
    let tenant = null;

    if (mongoose.Types.ObjectId.isValid(raw) && String(new mongoose.Types.ObjectId(raw)) === raw) {
      tenant = await Tenant.findById(raw);
    }

    if (!tenant) {
      tenant = await Tenant.findOne({ subdomain: raw });
    }

    if (!tenant) {
      return res.status(404).json({ message: 'Tenant not found' });
    }

    req.tenant = tenant;
    req.tenantId = tenant._id;
    return next();
  } catch (error) {
    return res.status(500).json({ message: 'Tenant resolution failed', error: error.message });
  }
}
