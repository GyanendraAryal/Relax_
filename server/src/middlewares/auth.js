import jwt from 'jsonwebtoken';
import env from '../config/env.js';
import { UnauthorizedError, ForbiddenError } from '../utils/errors.js';
import * as userModel from '../models/user.model.js';

export function authenticate(req, _res, next) {
  const token =
    req.cookies?.[env.JWT_COOKIE_NAME] ||
    (req.headers.authorization?.startsWith('Bearer ')
      ? req.headers.authorization.slice(7)
      : null);

  if (!token) {
    return next(new UnauthorizedError('Authentication required'));
  }

  try {
    const payload = jwt.verify(token, env.JWT_SECRET);
    req.user = { id: payload.sub, email: payload.email, role: payload.role };
    return next();
  } catch {
    return next(new UnauthorizedError('Invalid or expired token'));
  }
}

export async function attachUser(req, _res, next) {
  if (!req.user?.id) return next(new UnauthorizedError());
  const user = await userModel.findById(req.user.id);
  if (!user || !user.is_active) {
    return next(new ForbiddenError('Account inactive or not found'));
  }
  req.dbUser = user;
  return next();
}

export function requireRole(...roles) {
  return (req, _res, next) => {
    if (!req.user?.role || !roles.includes(req.user.role)) {
      return next(new ForbiddenError('Insufficient permissions'));
    }
    return next();
  };
}
