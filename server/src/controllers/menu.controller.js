import * as menuService from '../services/menu.service.js';
import { success, created, noContent, paginated } from '../utils/response.js';

export async function getPublicMenu(req, res, next) {
  try {
    const menu = await menuService.getPublicMenu();
    return success(res, menu);
  } catch (err) {
    next(err);
  }
}

export async function listCategories(req, res, next) {
  try {
    const categories = await menuService.listCategories(false);
    return success(res, categories);
  } catch (err) {
    next(err);
  }
}

export async function createCategory(req, res, next) {
  try {
    const category = await menuService.createCategory(req.body);
    return created(res, category);
  } catch (err) {
    next(err);
  }
}

export async function updateCategory(req, res, next) {
  try {
    const category = await menuService.updateCategory(req.params.id, req.body);
    return success(res, category);
  } catch (err) {
    next(err);
  }
}

export async function deleteCategory(req, res, next) {
  try {
    await menuService.deleteCategory(req.params.id);
    return noContent(res);
  } catch (err) {
    next(err);
  }
}

export async function listItems(req, res, next) {
  try {
    const items = await menuService.listItems({});
    return success(res, items);
  } catch (err) {
    next(err);
  }
}

export async function getItem(req, res, next) {
  try {
    const item = await menuService.getItem(req.params.id);
    return success(res, item);
  } catch (err) {
    next(err);
  }
}

export async function createItem(req, res, next) {
  try {
    const item = await menuService.createItem(req.body, req.file);
    return created(res, item);
  } catch (err) {
    next(err);
  }
}

export async function updateItem(req, res, next) {
  try {
    const item = await menuService.updateItem(req.params.id, req.body, req.file);
    return success(res, item);
  } catch (err) {
    next(err);
  }
}

export async function deleteItem(req, res, next) {
  try {
    await menuService.deleteItem(req.params.id);
    return noContent(res);
  } catch (err) {
    next(err);
  }
}
