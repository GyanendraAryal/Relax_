import * as settingsModel from '../models/settings.model.js';
import { cacheDel } from './cache.service.js';
import { uploadImage, deleteImage } from './upload.service.js';
import { ValidationError } from '../utils/errors.js';

// ── Numeric defaults for the 'about' settings key ──────────────────────────
const ABOUT_NUMERIC_DEFAULTS = {
  foundingYear:   2020,
  birthdaysCount: 1250,
  eventsCount:    450,
};

/**
 * Sanitize the `about` value before writing to the database.
 * Ensures numeric fields are stored as valid integers, never as empty
 * strings, null, or non-numeric strings.
 */
function sanitizeAbout(about = {}) {
  const sanitized = { ...about };
  for (const [field, defaultVal] of Object.entries(ABOUT_NUMERIC_DEFAULTS)) {
    const parsed = parseInt(sanitized[field], 10);
    sanitized[field] = Number.isFinite(parsed) ? parsed : defaultVal;
  }
  return sanitized;
}

/**
 * Normalise the `about` value when reading from the database.
 * Heals any corrupt rows that were written before sanitization was added.
 */
function normalizeAbout(about = {}) {
  return sanitizeAbout(about); // same logic — coerce & apply defaults
}

export async function getPublic() {
  const settings = await settingsModel.getPublicSettings();
  // Heal any corrupt 'about' data that exists in the DB before returning
  if (settings.about) {
    settings.about = normalizeAbout(settings.about);
  }
  return settings;
}

export async function getAll() {
  return settingsModel.findAll();
}

export async function updateBulk(data) {
  const results = [];
  for (let [key, value] of Object.entries(data)) {
    if (value !== undefined) {
      // Sanitize numeric fields in 'about' before persisting to the database
      if (key === 'about' && value && typeof value === 'object') {
        value = sanitizeAbout(value);
      }
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

export async function uploadStoryImage(file) {
  if (!file) {
    throw new ValidationError('No image file provided');
  }

  const row = await settingsModel.findByKey('story');
  const storyValue = row ? row.value : {};

  const uploaded = await uploadImage(file.buffer, 'relax-station/story');

  if (storyValue.cloudinary_public_id) {
    await deleteImage(storyValue.cloudinary_public_id);
  }


  const updatedStoryValue = {
    ...storyValue,
    backgroundImage: uploaded.url,
    cloudinary_public_id: uploaded.publicId,
  };

  const updatedSetting = await settingsModel.upsert('story', updatedStoryValue);
  await cacheDel('settings:*');

  return updatedSetting.value;
}

export async function deleteStoryImage() {
  const row = await settingsModel.findByKey('story');
  const storyValue = row ? row.value : {};

  if (storyValue.cloudinary_public_id) {
    await deleteImage(storyValue.cloudinary_public_id);
  }

  const updatedStoryValue = {
    ...storyValue,
    backgroundImage: '',
    cloudinary_public_id: null,
  };

  const updatedSetting = await settingsModel.upsert('story', updatedStoryValue);
  await cacheDel('settings:*');

  return updatedSetting.value;
}
