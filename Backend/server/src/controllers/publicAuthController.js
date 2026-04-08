import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import { Tenant } from '../models/Tenant.js';
import { User } from '../models/User.js';
import { env } from '../config/env.js';

async function resolveTenantByOrgId(orgId) {
  const raw = String(orgId || '').trim();
  if (!raw) return null;

  if (mongoose.Types.ObjectId.isValid(raw) && String(new mongoose.Types.ObjectId(raw)) === raw) {
    const tenantById = await Tenant.findById(raw);
    if (tenantById) return tenantById;
  }

  return Tenant.findOne({ subdomain: raw });
}

/**
 * Mentor login that requires an Organization ID (tenant selector) in the request body.
 *
 * Flow:
 * 1. Validate tenant exists by orgId (Tenant._id or subdomain).
 * 2. Find mentor user within that tenant (logical isolation).
 * 3. Verify password.
 * 4. Issue JWT that includes { userId, role, tenantId } for downstream checks.
 *
 * This route is intentionally PUBLIC and does NOT require x-tenant-id header,
 * because the tenant is selected via the Organization ID field.
 */
export async function mentorLogin(req, res) {
  try {
    const { orgId, email, password } = req.body;

    if (!orgId || !email || !password) {
      return res.status(400).json({ message: 'orgId, email, and password are required' });
    }

    const tenant = await resolveTenantByOrgId(orgId);
    if (!tenant) {
      return res.status(404).json({ message: 'Organization not found' });
    }

    const user = await User.findOne({
      tenantId: tenant._id,
      role: 'mentor',
      email: String(email).toLowerCase(),
    });

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      {
        userId: user._id.toString(),
        role: user.role,
        tenantId: tenant._id.toString(),
      },
      env.jwtSecret,
      { expiresIn: '12h' }
    );

    return res.json({
      token,
      role: user.role,
      name: user.profile?.name || '',
      tenantId: tenant._id.toString(),
      tenantSubdomain: tenant.subdomain,
    });
  } catch (error) {
    return res.status(500).json({ message: 'Mentor login failed', error: error.message });
  }
}

/**
 * First-time Mentor Onboarding (PUBLIC)
 *
 * Requires orgId once at account creation time to permanently bind
 * the mentor user to the target tenant.
 */
export async function mentorRegister(req, res) {
  try {
    const { orgId, email, password, name, expertise } = req.body;

    if (!orgId || !email || !password || !name) {
      return res.status(400).json({ message: 'orgId, email, password, and name are required' });
    }

    const tenant = await resolveTenantByOrgId(orgId);
    if (!tenant) {
      return res.status(404).json({ message: 'Organization not found' });
    }

    const normalizedEmail = normalizeEmail(email);
    const passwordHash = await bcrypt.hash(password, 10);

    const mentor = await User.create({
      tenantId: tenant._id,
      email: normalizedEmail,
      passwordHash,
      role: 'mentor',
      profile: {
        name: String(name).trim(),
        expertise: String(expertise || '').trim(),
      },
    });

    const token = jwt.sign(
      {
        userId: mentor._id.toString(),
        role: mentor.role,
        tenantId: tenant._id.toString(),
      },
      env.jwtSecret,
      { expiresIn: '12h' }
    );

    return res.status(201).json({
      token,
      role: mentor.role,
      name: mentor.profile?.name || '',
      tenantId: tenant._id.toString(),
      tenantSubdomain: tenant.subdomain,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: 'Email already registered for this tenant' });
    }
    return res.status(500).json({ message: 'Mentor registration failed', error: error.message });
  }
}

function normalizeEmail(email) {
  return String(email || '').trim().toLowerCase();
}

async function generateUniqueSubdomain() {
  // Short, stable, URL-safe slug that doesn't encode private data.
  // Example: org-k4p9x2nq
  for (let i = 0; i < 10; i += 1) {
    const suffix = crypto.randomBytes(4).toString('hex');
    const subdomain = `org-${suffix}`;
    // eslint-disable-next-line no-await-in-loop
    const exists = await Tenant.exists({ subdomain });
    if (!exists) return subdomain;
  }
  throw new Error('Failed to generate unique tenant subdomain');
}

/**
 * Initial Tenant Admin Registration (PUBLIC)
 *
 * Creates:
 * - a new Tenant (organization)
 * - an owner admin user within that tenant
 *
 * Returns:
 * - JWT including immutable tenantId (Tenant._id)
 * - tenantId and tenantSubdomain so the UI can persist org context
 *
 * This route is public by design: it bootstraps a new tenant without requiring x-tenant-id.
 */
export async function adminRegister(req, res) {
  try {
    const { email, ownerName, password } = req.body;

    const normalizedEmail = normalizeEmail(email);
    if (!normalizedEmail || !ownerName || !String(ownerName).trim() || !password) {
      return res.status(400).json({ message: 'email, ownerName, and password are required' });
    }

    const subdomain = await generateUniqueSubdomain();
    const tenantName = `${String(ownerName).trim()}'s Organization`;

    const passwordHash = await bcrypt.hash(password, 10);

    const tenant = await Tenant.create({
      name: tenantName,
      subdomain,
    });

    const adminUser = await User.create({
      tenantId: tenant._id,
      email: normalizedEmail,
      passwordHash,
      role: 'admin',
      profile: { name: String(ownerName).trim() },
    });

    const token = jwt.sign(
      {
        userId: adminUser._id.toString(),
        role: adminUser.role,
        tenantId: tenant._id.toString(),
      },
      env.jwtSecret,
      { expiresIn: '12h' }
    );

    return res.status(201).json({
      token,
      role: adminUser.role,
      name: adminUser.profile?.name || '',
      tenantId: tenant._id.toString(),
      tenantSubdomain: tenant.subdomain,
    });
  } catch (error) {
    // If tenant is created but user creation fails, we may leave an orphan tenant.
    // This is acceptable for now (rare); can be upgraded to a Mongo transaction later.
    if (error.code === 11000) {
      return res.status(409).json({ message: 'Email already registered for this tenant' });
    }
    return res.status(500).json({ message: 'Admin registration failed', error: error.message });
  }
}

