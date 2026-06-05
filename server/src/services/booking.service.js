import * as bookingModel from '../models/booking.model.js';
import { NotFoundError } from '../utils/errors.js';

export async function listBirthdays(query) {
  const { page, limit, status } = query;
  const offset = (page - 1) * limit;
  const [items, total] = await Promise.all([
    bookingModel.findBirthdayRequests({ status, limit, offset }),
    bookingModel.countBirthdayRequests(status),
  ]);
  return { items, total, page, limit };
}

export async function createBirthday(data) {
  return bookingModel.createBirthday(data);
}

export async function updateBirthday(id, data) {
  const updated = await bookingModel.updateBirthday(id, data);
  if (!updated) throw new NotFoundError('Birthday request not found');
  return updated;
}

export async function listEvents(query) {
  const { page, limit, status } = query;
  const offset = (page - 1) * limit;
  const [items, total] = await Promise.all([
    bookingModel.findEventRequests({ status, limit, offset }),
    bookingModel.countEventRequests(status),
  ]);
  return { items, total, page, limit };
}

export async function createEvent(data) {
  return bookingModel.createEvent(data);
}

export async function updateEvent(id, data) {
  const updated = await bookingModel.updateEvent(id, data);
  if (!updated) throw new NotFoundError('Event request not found');
  return updated;
}
