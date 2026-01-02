import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const getAnnouncements = async (filters = {}) => {
  const params = new URLSearchParams(filters).toString();
  const response = await api.get(`/announcements${params ? '?' + params : ''}`);
  return response.data;
};

export const createAnnouncement = async (announcementData) => {
  const response = await api.post('/announcements', announcementData);
  return response.data;
};

export default api;

