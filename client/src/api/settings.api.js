import api from './axios.js';

export const settingsApi = {
  getPublic: () => api.get('/settings/public').then((r) => r.data.data),
  getAll: () => api.get('/settings').then((r) => r.data.data),
  update: (data) => api.put('/settings', data).then((r) => r.data.data),
  uploadHeroImage: (file) => {
    const form = new FormData();
    form.append('image', file);
    return api.post('/settings/hero-image', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }).then((r) => r.data.data);
  },
  deleteHeroImage: () => api.delete('/settings/hero-image').then((r) => r.data.data),
};
