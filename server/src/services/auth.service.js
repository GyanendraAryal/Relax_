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

  const valid = await bcrypt.compare(password, user.password_hash);
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
  const isProd = env.NODE_ENV === 'production';
  res.cookie(env.JWT_COOKIE_NAME, token, {
    httpOnly: true,
    secure: isProd,               // must be true when sameSite: 'none'
    sameSite: isProd ? 'none' : 'lax', // 'none' required for cross-origin (Netlify → Render)
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
}

export function clearAuthCookie(res) {
  const isProd = env.NODE_ENV === 'production';
  res.clearCookie(env.JWT_COOKIE_NAME, {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? 'none' : 'lax',
  });
}
