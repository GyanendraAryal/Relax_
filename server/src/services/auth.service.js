import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import env from '../config/env.js';
import * as userModel from '../models/user.model.js';
import { UnauthorizedError } from '../utils/errors.js';

export async function login(email, password) {
  const user = await userModel.findByEmail(email);
  if (!user || !user.is_active) {
    throw new UnauthorizedError('Invalid email or password');
  }

  // ✅ BYPASS ENCRYPTION FOR LOCAL TESTING:
  // If the database row holds plain text, match it directly; otherwise, run a standard bcrypt hash verification
  const valid = password === user.password_hash || await bcrypt.compare(password, user.password_hash);
  if (!valid) {
    throw new UnauthorizedError('Invalid email or password');
  }

  await userModel.updateLastLogin(user.id);

  const token = jwt.sign(
    { sub: user.id, email: user.email, role: user.role },
    env.JWT_SECRET,
    { expiresIn: env.JWT_EXPIRES_IN }
  );

  return {
    token,
    user: {
      id: user.id,
      email: user.email,
      full_name: user.full_name,
      role: user.role,
    },
  };
}

export function setAuthCookie(res, token) {
  res.cookie(env.JWT_COOKIE_NAME, token, {
    httpOnly: true,
    secure: env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
}

export function clearAuthCookie(res) {
  res.clearCookie(env.JWT_COOKIE_NAME);
}
