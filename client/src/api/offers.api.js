import api, { toFormData } from './axios.js';

export const offersApi = {
  getPublic: () => api.get('/offers/public').then((r) => {
    return r?.data?.data !== undefined ? r.data.data : r?.data;
  }),

  getAll: () => api.get('/offers').then((r) => r.data.data),

  create: (data, file) => {
    // Always multipart on create since an image may be included
    const form = toFormData(data);
    if (file) form.append('image', file);
    return api.post('/offers', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }).then((r) => r.data.data);
  },

  update: (id, data, file) => {
    // Only use multipart when a new image file is being uploaded.
    // Otherwise send JSON so boolean/null values are preserved correctly
    // and don't get coerced to strings by FormData.
    if (file) {
      const form = toFormData(data);
      form.append('image', file);
      return api.put(`/offers/${id}`, form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      }).then((r) => r.data.data);
    }
    return api.put(`/offers/${id}`, data).then((r) => r.data.data);
  },

  delete: (id) => api.delete(`/offers/${id}`),
};
