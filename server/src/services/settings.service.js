import * as settingsModel from '../models/settings.model.js';
import { cacheDel } from './cache.service.js';
import { uploadImage, deleteImage } from './upload.service.js';
import { ValidationError } from '../utils/errors.js';

export async function getPublic() {
  return settingsModel.getPublicSettings();
}

export async function getAll() {
  return settingsModel.findAll();
}

export async function updateBulk(data) {
  const results = [];
  for (const [key, value] of Object.entries(data)) {
    if (value !== undefined) {
      results.push(await settingsModel.upsert(key, value));
    }
  }
  await cacheDel('settings:*');
  return results;
}

export async function uploadHeroImage(file) {
  if (!file) {
    throw new ValidationError('No image file provided');
  }

  // Get current settings
  const row = await settingsModel.findByKey('hero');
  const heroValue = row ? row.value : {};

  // Upload new image
  const uploaded = await uploadImage(file.buffer, 'relax-station/settings');

  // Delete old image if it exists
  if (heroValue.cloudinary_public_id) {
    await deleteImage(heroValue.cloudinary_public_id);
  }

  // Update hero settings
  const updatedHeroValue = {
    ...heroValue,
    backgroundImage: uploaded.url,
    cloudinary_public_id: uploaded.publicId,
  };

  const updatedSetting = await settingsModel.upsert('hero', updatedHeroValue);
  await cacheDel('settings:*');

  return updatedSetting.value;
}

export async function deleteHeroImage() {
  // Get current settings
  const row = await settingsModel.findByKey('hero');
  const heroValue = row ? row.value : {};

  // Delete image if it exists
  if (heroValue.cloudinary_public_id) {
    await deleteImage(heroValue.cloudinary_public_id);
  }

  // Clear image fields
  const updatedHeroValue = {
    ...heroValue,
    backgroundImage: '',
    cloudinary_public_id: null,
  };

  const updatedSetting = await settingsModel.upsert('hero', updatedHeroValue);
  await cacheDel('settings:*');

  return updatedSetting.value;
}
