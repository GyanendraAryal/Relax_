import * as galleryService from '../services/gallery.service.js';
import { success, created, noContent } from '../utils/response.js';

export async function listPublic(req, res, next) {
  try {
    const images = await galleryService.list(true);
    return success(res, images);
  } catch (err) {
    next(err);
  }
}

export async function listAdmin(req, res, next) {
  try {
    const images = await galleryService.list(false);
    return success(res, images);
  } catch (err) {
    next(err);
  }
}

export async function create(req, res, next) {
  try {
    const image = await galleryService.create(req.body, req.file);
    return created(res, image);
  } catch (err) {
    next(err);
  }
}

export async function update(req, res, next) {
  try {
    const image = await galleryService.update(req.params.id, req.body, req.file);
    return success(res, image);
  } catch (err) {
    next(err);
  }
}

export async function remove(req, res, next) {
  try {
    await galleryService.remove(req.params.id);
    return noContent(res);
  } catch (err) {
    next(err);
  }
}
