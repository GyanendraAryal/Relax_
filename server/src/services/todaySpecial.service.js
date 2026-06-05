import * as todaySpecialModel from '../models/todaySpecial.model.js';
import * as menuModel from '../models/menu.model.js';
import { NotFoundError } from '../utils/errors.js';
import { uploadImage, deleteImage } from './upload.service.js';

export async function getToday() {
  const today = new Date().toISOString().split('T')[0];
  return todaySpecialModel.findByDate(today);
}

export async function list() {
  return todaySpecialModel.findAll();
}

export async function getById(id) {
  const special = await todaySpecialModel.findById(id);
  if (!special) throw new NotFoundError("Today's special not found");
  return special;
}

export async function create(data, file) {
  const item = await menuModel.findItemById(data.menu_item_id);
  if (!item) throw new NotFoundError('Menu item not found');
  
  if (file) {
    const uploaded = await uploadImage(file.buffer, 'relax-station/specials');
    data.image_url = uploaded.url;
    data.cloudinary_public_id = uploaded.publicId;
  }
  
  return todaySpecialModel.create(data);
}

export async function update(id, data, file) {
  const special = await todaySpecialModel.findById(id);
  if (!special) throw new NotFoundError("Today's special not found");
  if (data.menu_item_id) {
    const item = await menuModel.findItemById(data.menu_item_id);
    if (!item) throw new NotFoundError('Menu item not found');
  }
  
  if (file) {
    if (special.cloudinary_public_id) {
      await deleteImage(special.cloudinary_public_id);
    }
    const uploaded = await uploadImage(file.buffer, 'relax-station/specials');
    data.image_url = uploaded.url;
    data.cloudinary_public_id = uploaded.publicId;
  }
  
  return todaySpecialModel.update(id, data);
}

export async function remove(id) {
  const special = await todaySpecialModel.findById(id);
  if (!special) throw new NotFoundError("Today's special not found");
  
  if (special.cloudinary_public_id) {
    await deleteImage(special.cloudinary_public_id);
  }
  
  const deleted = await todaySpecialModel.remove(id);
  if (!deleted) throw new NotFoundError("Today's special not found");
}
