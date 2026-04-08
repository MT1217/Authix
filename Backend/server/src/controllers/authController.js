import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
import { env } from '../config/env.js';

/**
 * Register a user inside the tenant resolved by tenantHandler (req.tenantId).
 * Isolation: email uniqueness is per-tenant via compound index { tenantId, email }.
 */
export async function signup(req, res) {
  try {
    const { email, password, role, name, expertise } = req.body;

    if (!email || !password || !role) {
      return res.status(400).json({ message: 'email, password, and role are required' });
    }

    if (!['admin', 'mentor', 'student'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role' });
    }

    // Require a display name for student accounts (and mentors too, for better UX).
    // This does not change login behavior; it only validates signup payloads.
    if ((role === 'student' || role === 'mentor') && (!name || !String(name).trim())) {
      return res.status(400).json({ message: 'name is required for this role' });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await User.create({
      tenantId: req.tenantId,
      email,
      passwordHash,
      role,
      profile: {
          name: name || '',
          expertise: expertise || ''
      }
    });

    const token = jwt.sign(
      {
        userId: user._id.toString(),
        role: user.role,
        tenantId: req.tenantId.toString(),
      },
      env.jwtSecret,
      { expiresIn: '12h' }
    );

    return res.status(201).json({
      token,
      role: user.role,
      name: user.profile?.name || '',
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: 'Email already registered for this tenant' });
    }
    return res.status(500).json({ message: 'Signup failed', error: error.message });
  }
}

/**
 * Authenticate within the current tenant only. Cross-tenant password spraying is useless
 * because the user row is always looked up with both email and req.tenantId.
 */
export async function login(req, res) {
  try {
    const { email, password } = req.body;
    // console.log(`om namah shivay`);

    if (!email || !password) {
      return res.status(400).json({ message: 'email and password required' });
    }

    const user = await User.findOne({ email: email.toLowerCase(), tenantId: req.tenantId });

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
        tenantId: req.tenantId.toString(),
      },
      env.jwtSecret,
      { expiresIn: '12h' }
    );

    return res.json({
      token,
      role: user.role,
      name: user.profile?.name || '',
    });
  } catch (error) {
    return res.status(500).json({ message: 'Login failed', error: error.message });
  }
}
