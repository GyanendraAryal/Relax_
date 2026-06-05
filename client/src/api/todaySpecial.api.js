import api, { toFormData } from './axios.js';

export const todaySpecialApi = {
  getToday: () => api.get('/today-specials/public/today').then((r) => r.data.data),
  getAll: () => api.get('/today-specials').then((r) => r.data.data),
  create: (data, file) => {
    const form = toFormData(data);
    if (file) form.append('image', file);
    return api.post('/today-specials', form, { headers: { 'Content-Type': 'multipart/form-data' } }).then((r) => r.data.data);
  },
  update: (id, data, file) => {
    const form = toFormData(data);
    if (file) form.append('image', file);
    return api.put(`/today-specials/${id}`, form, { headers: { 'Content-Type': 'multipart/form-data' } }).then((r) => r.data.data);
  },
  delete: (id) => api.delete(`/today-specials/${id}`),
};
