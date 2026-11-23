import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 10000
});

// Interceptor to add JWT authorization bearer token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('phishguard_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response error handler
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear expired session if 401
      if (localStorage.getItem('phishguard_token')) {
        localStorage.removeItem('phishguard_token');
        localStorage.removeItem('phishguard_user');
      }
    }
    return Promise.reject(error);
  }
);

export const authApi = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getMe: () => api.get('/auth/me'),
  getDemoCredentials: () => api.get('/auth/demo-credentials')
};

export const scanApi = {
  analyzeUrl: (url) => api.post('/scans/analyze', { url }),
  getHistory: (params) => api.get('/scans/history', { params }),
  getScanById: (id) => api.get(`/scans/${id}`),
  deleteScan: (id) => api.delete(`/scans/${id}`),
  clearHistory: () => api.delete('/scans'),
  getAnalytics: () => api.get('/scans/analytics'),
  getExportCsvUrl: () => `${API_BASE_URL}/scans/export/csv`
};

export const systemApi = {
  getHealth: () => api.get('/system/health'),
  getModelInfo: () => api.get('/system/model-info')
};

export default api;
