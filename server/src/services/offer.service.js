import * as offerModel from '../models/offer.model.js';
import { slugify } from '../utils/slugify.js';
import { NotFoundError, ConflictError } from '../utils/errors.js';
import { uploadImage, deleteImage } from './upload.service.js';

export async function list(activeOnly = false) {
  return offerModel.findAll({ activeOnly });
}

export async function getById(id) {
  const offer = await offerModel.findById(id);
  if (!offer) throw new NotFoundError('Offer not found');
  return offer;
}

export async function create(data, file) {
  const slug = data.slug || slugify(data.title);
  const existing = await offerModel.findBySlug(slug);
  if (existing) throw new ConflictError('Offer slug already exists');

  if (file) {
    const uploaded = await uploadImage(file.buffer, 'relax-station/offers');
    data.image_url = uploaded.url;
    data.cloudinary_public_id = uploaded.publicId;
  }

  return offerModel.create({ ...data, slug });
}

export async function update(id, data, file) {
  const offer = await offerModel.findById(id);
  if (!offer) throw new NotFoundError('Offer not found');

  if (data.title && !data.slug) data.slug = slugify(data.title);

  if (file) {
    if (offer.cloudinary_public_id) await deleteImage(offer.cloudinary_public_id);
    const uploaded = await uploadImage(file.buffer, 'relax-station/offers');
    data.image_url = uploaded.url;
    data.cloudinary_public_id = uploaded.publicId;
  }

  return offerModel.update(id, data);
}

export async function remove(id) {
  const offer = await offerModel.findById(id);
  if (!offer) throw new NotFoundError('Offer not found');
  if (offer.cloudinary_public_id) await deleteImage(offer.cloudinary_public_id);
  await offerModel.remove(id);
}
