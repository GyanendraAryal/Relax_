import * as galleryModel from '../models/gallery.model.js';
import { NotFoundError } from '../utils/errors.js';
import { uploadImage, deleteImage } from './upload.service.js';

export async function list(activeOnly = false) {
  return galleryModel.findAll({ activeOnly });
}

export async function getById(id) {
  const image = await galleryModel.findById(id);
  if (!image) throw new NotFoundError('Gallery image not found');
  return image;
}

export async function create(data, file) {
  if (file) {
    const uploaded = await uploadImage(file.buffer, 'relax-station/gallery');
    data.image_url = uploaded.url;
    data.cloudinary_public_id = uploaded.publicId;
  }
  if (!data.image_url) throw new Error('Image is required');
  return galleryModel.create(data);
}

export async function update(id, data, file) {
  const image = await galleryModel.findById(id);
  if (!image) throw new NotFoundError('Gallery image not found');

  if (file) {
    if (image.cloudinary_public_id) await deleteImage(image.cloudinary_public_id);
    const uploaded = await uploadImage(file.buffer, 'relax-station/gallery');
    data.image_url = uploaded.url;
    data.cloudinary_public_id = uploaded.publicId;
  }

  return galleryModel.update(id, data);
}

export async function remove(id) {
  const image = await galleryModel.findById(id);
  if (!image) throw new NotFoundError('Gallery image not found');
  if (image.cloudinary_public_id) await deleteImage(image.cloudinary_public_id);
  await galleryModel.remove(id);
}
