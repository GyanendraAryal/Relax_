import * as menuModel from '../models/menu.model.js';
import { slugify } from '../utils/slugify.js';
import { NotFoundError, ConflictError } from '../utils/errors.js';
import { uploadImage, deleteImage } from './upload.service.js';
import { cacheDel } from './cache.service.js';

async function invalidateMenuCache() {
  await cacheDel('menu:*');
}

export async function getPublicMenu() {
  return menuModel.getMenuGrouped(true);
}

export async function getCategoriesWithItems() {
  const categoriesWithItems = await menuModel.getMenuGrouped(true);
  // Hide categories with zero active items
  return categoriesWithItems.filter((cat) => cat.items && cat.items.length > 0);
}


export async function listCategories(activeOnly = false) {
  return menuModel.findAllCategories({ activeOnly });
}

export async function createCategory(data) {
  const slug = data.slug || slugify(data.name);
  const existing = await menuModel.findCategoryBySlug(slug);
  if (existing) throw new ConflictError('Category slug already exists');
  const category = await menuModel.createCategory({ ...data, slug });
  await invalidateMenuCache();
  return category;
}

export async function updateCategory(id, data) {
  const category = await menuModel.findCategoryById(id);
  if (!category) throw new NotFoundError('Category not found');
  if (data.name && !data.slug) data.slug = slugify(data.name);
  const updated = await menuModel.updateCategory(id, data);
  await invalidateMenuCache();
  return updated;
}

export async function deleteCategory(id) {
  const deleted = await menuModel.deleteCategory(id);
  if (!deleted) throw new NotFoundError('Category not found');
  await invalidateMenuCache();
}

export async function listItems(filters) {
  return menuModel.findAllItems(filters);
}

export async function listItemsPaginated(filters) {
  return menuModel.findAllItemsPaginated(filters);
}


export async function getItem(id) {
  const item = await menuModel.findItemById(id);
  if (!item) throw new NotFoundError('Menu item not found');
  return item;
}

export async function createItem(data, file) {
  const slug = data.slug || slugify(data.name);
  const existing = await menuModel.findItemBySlug(slug);
  if (existing) throw new ConflictError('Menu item slug already exists');

  if (file) {
    const uploaded = await uploadImage(file.buffer, 'relax-station/menu');
    data.image_url = uploaded.url;
    data.cloudinary_public_id = uploaded.publicId;
  }

  const item = await menuModel.createItem({ ...data, slug });
  await invalidateMenuCache();
  return item;
}

export async function updateItem(id, data, file) {
  const item = await menuModel.findItemById(id);
  if (!item) throw new NotFoundError('Menu item not found');

  if (data.name && !data.slug) data.slug = slugify(data.name);

  if (file) {
    if (item.cloudinary_public_id) await deleteImage(item.cloudinary_public_id);
    const uploaded = await uploadImage(file.buffer, 'relax-station/menu');
    data.image_url = uploaded.url;
    data.cloudinary_public_id = uploaded.publicId;
  }

  const updated = await menuModel.updateItem(id, data);
  await invalidateMenuCache();
  return updated;
}

export async function deleteItem(id) {
  const item = await menuModel.findItemById(id);
  if (!item) throw new NotFoundError('Menu item not found');
  if (item.cloudinary_public_id) await deleteImage(item.cloudinary_public_id);
  await menuModel.deleteItem(id);
  await invalidateMenuCache();
}
