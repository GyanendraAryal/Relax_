import * as authService from '../services/auth.service.js';
import { success } from '../utils/response.js';

export async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    const result = await authService.login(email, password);
    authService.setAuthCookie(res, result.token);
    return success(res, { user: result.user, token: result.token });
  } catch (err) {
    next(err);
  }
}

export async function logout(req, res) {
  authService.clearAuthCookie(res);
  return success(res, { message: 'Logged out' });
}

export async function me(req, res) {
  return success(res, {
    id: req.dbUser.id,
    email: req.dbUser.email,
    full_name: req.dbUser.full_name,
    role: req.dbUser.role,
  });
}
