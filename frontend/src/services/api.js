import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authService = {
  register: async (email, password, fullName) => {
    const response = await api.post('/auth/register', {
      email,
      password,
      full_name: fullName,
    });
    return response.data;
  },

  login: async (email, password) => {
    const response = await api.post('/auth/login', {
      email,
      password,
    });
    if (response.data.access_token) {
      localStorage.setItem('token', response.data.access_token);
    }
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('token');
  },

  getCurrentUser: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },
};

export const watermarkService = {
  embedWatermark: async (file, contentId) => {
    const formData = new FormData();
    formData.append('file', file);
    if (contentId) {
      formData.append('content_id', contentId);
    }

    const response = await api.post('/watermark/embed', formData, {
      responseType: 'blob',
    });

    return response.data;
  },

  detectWatermark: async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await api.post('/watermark/detect', formData);
    return response.data;
  },

  getHistory: async () => {
    const response = await api.get('/watermarks/history');
    return response.data;
  },
};

export default api;
