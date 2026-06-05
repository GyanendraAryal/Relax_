import * as todaySpecialService from '../services/todaySpecial.service.js';
import { success, created, noContent } from '../utils/response.js';

export async function getToday(req, res, next) {
  try {
    const specials = await todaySpecialService.getToday();
    return success(res, specials);
  } catch (err) {
    next(err);
  }
}

export async function list(req, res, next) {
  try {
    const specials = await todaySpecialService.list();
    return success(res, specials);
  } catch (err) {
    next(err);
  }
}

export async function create(req, res, next) {
  try {
    const special = await todaySpecialService.create(req.body, req.file);
    return created(res, special);
  } catch (err) {
    next(err);
  }
}

export async function update(req, res, next) {
  try {
    const special = await todaySpecialService.update(req.params.id, req.body, req.file);
    return success(res, special);
  } catch (err) {
    next(err);
  }
}

export async function remove(req, res, next) {
  try {
    await todaySpecialService.remove(req.params.id);
    return noContent(res);
  } catch (err) {
    next(err);
  }
}
