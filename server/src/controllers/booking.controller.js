import * as bookingService from '../services/booking.service.js';
import { success, created, paginated } from '../utils/response.js';

export async function createBirthday(req, res, next) {
  try {
    const request = await bookingService.createBirthday(req.body);
    return created(res, request);
  } catch (err) {
    next(err);
  }
}

export async function listBirthdays(req, res, next) {
  try {
    const { items, total, page, limit } = await bookingService.listBirthdays(req.query);
    return paginated(res, items, { page, limit, total });
  } catch (err) {
    next(err);
  }
}

export async function updateBirthday(req, res, next) {
  try {
    const updated = await bookingService.updateBirthday(req.params.id, req.body);
    return success(res, updated);
  } catch (err) {
    next(err);
  }
}

export async function createEvent(req, res, next) {
  try {
    const request = await bookingService.createEvent(req.body);
    return created(res, request);
  } catch (err) {
    next(err);
  }
}

export async function listEvents(req, res, next) {
  try {
    const { items, total, page, limit } = await bookingService.listEvents(req.query);
    return paginated(res, items, { page, limit, total });
  } catch (err) {
    next(err);
  }
}

export async function updateEvent(req, res, next) {
  try {
    const updated = await bookingService.updateEvent(req.params.id, req.body);
    return success(res, updated);
  } catch (err) {
    next(err);
  }
}
