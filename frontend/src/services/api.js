import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response || error.message);
    return Promise.reject(error);
  }
);

export const vehicleService = {
  getAll: (params) => api.get('/vehicles', { params }),
  getById: (id) => api.get(`/vehicles/${id}`),
  create: (data) => api.post('/vehicles', data),
  update: (id, data) => api.put(`/vehicles/${id}`, data),
  delete: (id) => api.delete(`/vehicles/${id}`),
  getStats: () => api.get('/vehicles/stats/summary'),
};

export const sessionService = {
  getAll: (params) => api.get('/sessions', { params }),
  getById: (id) => api.get(`/sessions/${id}`),
  create: (data) => api.post('/sessions', data),
  addCycle: (id, data) => api.put(`/sessions/${id}/add-cycle`, data),
  recordDeparture: (id, data) => api.put(`/sessions/${id}/record-departure`, data),
  recordArrival: (id, data) => api.put(`/sessions/${id}/record-arrival`, data),
  getDailyStats: () => api.get('/sessions/stats/daily'),
};

export const dashboardService = {
  getOverview: () => api.get('/dashboard/overview'),
};

export const cycleService = {
  getBySession: (sessionId) => api.get(`/cycles/session/${sessionId}`),
};

export default api;
