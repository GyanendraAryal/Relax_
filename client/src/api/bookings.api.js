import api from './axios.js';

export const bookingsApi = {
  createBirthday: (data) => api.post('/bookings/birthday/public', data).then((r) => r.data.data),
  createEvent: (data) => api.post('/bookings/event/public', data).then((r) => r.data.data),
  listBirthdays: (params) => api.get('/bookings/birthday', { params }).then((r) => ({ items: r.data.data, meta: r.data.meta })),
  updateBirthday: (id, data) => api.patch(`/bookings/birthday/${id}`, data).then((r) => r.data.data),
  listEvents: (params) => api.get('/bookings/event', { params }).then((r) => ({ items: r.data.data, meta: r.data.meta })),
  updateEvent: (id, data) => api.patch(`/bookings/event/${id}`, data).then((r) => r.data.data),
};
