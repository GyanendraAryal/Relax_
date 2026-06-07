import api, { toFormData } from './axios.js';

export const galleryApi = {
   getPublic: () => api.get('/gallery/public').then((r) => {
    // If r.data.data exists, use it. Otherwise, fall back to the direct r.data array
    return r?.data?.data !== undefined ? r.data.data : r?.data;
  }),
  getAll: () => api.get('/gallery').then((r) => r.data.data),
  create: (data, file) => {
    const form = toFormData(data);
    if (file) form.append('image', file);
    return api.post('/gallery', form, { headers: { 'Content-Type': 'multipart/form-data' } }).then((r) => r.data.data);
  },
  update: (id, data, file) => {
    const form = toFormData(data);
    if (file) form.append('image', file);
    return api.put(`/gallery/${id}`, form, { headers: { 'Content-Type': 'multipart/form-data' } }).then((r) => r.data.data);
  },
  delete: (id) => api.delete(`/gallery/${id}`),
};
