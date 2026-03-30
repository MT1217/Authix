import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
import { env } from '../config/env.js';

export async function signup(req, res) {
  const { name, email, password, role } = req.body;
  const passwordHash = await bcrypt.hash(password, 10);

  const user = await User.create({
    tenantId: req.tenantId,
    name,
    email,
    passwordHash,
    role,
    mfaEnabled: role === 'admin',
  });

  return res.status(201).json({ id: user._id, role: user.role });
}

export async function login(req, res) {
  const { email, password } = req.body;
  const user = await User.findOne({ email, tenantId: req.tenantId });
  if (!user) return res.status(401).json({ message: 'Invalid credentials' });

  const matched = await bcrypt.compare(password, user.passwordHash);
  if (!matched) return res.status(401).json({ message: 'Invalid credentials' });

  const token = jwt.sign({ userId: user._id, role: user.role, tenantId: user.tenantId }, env.jwtSecret, {
    expiresIn: '1d',
  });

  return res.json({ token, role: user.role });
}
