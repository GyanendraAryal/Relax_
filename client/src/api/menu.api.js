import api, { toFormData } from './axios.js';

export const menuApi = {
  getPublic: () => api.get('/menu/public').then((r) => r.data.data),
  getCategoriesWithItems: () => api.get('/menu/categories-with-items').then((r) => r.data.data),
  getCategories: () => api.get('/menu/categories').then((r) => r.data.data),
  createCategory: (data) => api.post('/menu/categories', data).then((r) => r.data.data),
  updateCategory: (id, data) => api.put(`/menu/categories/${id}`, data).then((r) => r.data.data),
  deleteCategory: (id) => api.delete(`/menu/categories/${id}`),
  getItems: (params) => api.get('/menu-items', { params }).then((r) => r.data),
  getAllItems: () => api.get('/menu-items', { params: { limit: 1000 } }).then((r) => r.data.data),
  createItem: (data, file) => {
    if (file) {
      const form = toFormData(data);
      form.append('image', file);
      return api.post('/menu-items', form, { headers: { 'Content-Type': 'multipart/form-data' } }).then((r) => r.data.data);
    }
    return api.post('/menu-items', data).then((r) => r.data.data);
  },
  updateItem: (id, data, file) => {
    if (file) {
      const form = toFormData(data);
      form.append('image', file);
      return api.put(`/menu-items/${id}`, form, { headers: { 'Content-Type': 'multipart/form-data' } }).then((r) => r.data.data);
    }
    return api.put(`/menu-items/${id}`, data).then((r) => r.data.data);
  },
  deleteItem: (id) => api.delete(`/menu-items/${id}`),
};

