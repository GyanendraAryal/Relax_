import * as settingsService from '../services/settings.service.js';
import { success } from '../utils/response.js';

export async function getPublic(req, res, next) {
  try {
    const settings = await settingsService.getPublic();
    return success(res, settings);
  } catch (err) {
    next(err);
  }
}

export async function getAll(req, res, next) {
  try {
    const settings = await settingsService.getAll();
    return success(res, settings);
  } catch (err) {
    next(err);
  }
}

export async function update(req, res, next) {
  try {
    const updated = await settingsService.updateBulk(req.body);
    return success(res, updated);
  } catch (err) {
    next(err);
  }
}

export async function uploadHeroImage(req, res, next) {
  try {
    const updatedHero = await settingsService.uploadHeroImage(req.file);
    return success(res, updatedHero);
  } catch (err) {
    next(err);
  }
}

export async function deleteHeroImage(req, res, next) {
  try {
    const updatedHero = await settingsService.deleteHeroImage();
    return success(res, updatedHero);
  } catch (err) {
    next(err);
  }
}
