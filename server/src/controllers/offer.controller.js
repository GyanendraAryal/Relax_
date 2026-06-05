import * as offerService from '../services/offer.service.js';
import { success, created, noContent } from '../utils/response.js';

export async function listPublic(req, res, next) {
  try {
    const offers = await offerService.list(true);
    return success(res, offers);
  } catch (err) {
    next(err);
  }
}

export async function listAdmin(req, res, next) {
  try {
    const offers = await offerService.list(false);
    return success(res, offers);
  } catch (err) {
    next(err);
  }
}

export async function getOne(req, res, next) {
  try {
    const offer = await offerService.getById(req.params.id);
    return success(res, offer);
  } catch (err) {
    next(err);
  }
}

export async function create(req, res, next) {
  try {
    const offer = await offerService.create(req.body, req.file);
    return created(res, offer);
  } catch (err) {
    next(err);
  }
}

export async function update(req, res, next) {
  try {
    const offer = await offerService.update(req.params.id, req.body, req.file);
    return success(res, offer);
  } catch (err) {
    next(err);
  }
}

export async function remove(req, res, next) {
  try {
    await offerService.remove(req.params.id);
    return noContent(res);
  } catch (err) {
    next(err);
  }
}
