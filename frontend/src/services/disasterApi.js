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

// Get all disasters
export const getDisasters = async (filters = {}) => {
  const params = new URLSearchParams(filters).toString();
  const response = await api.get(`/disasters${params ? '?' + params : ''}`);
  return response.data;
};

// Get single disaster
export const getDisaster = async (id) => {
  const response = await api.get(`/disasters/${id}`);
  return response.data;
};

// Create disaster
export const createDisaster = async (disasterData) => {
  const response = await api.post('/disasters', disasterData);
  return response.data;
};

// Update disaster
export const updateDisaster = async (id, disasterData) => {
  const response = await api.put(`/disasters/${id}`, disasterData);
  return response.data;
};

// Verify disaster (Admin only)
export const verifyDisaster = async (id, status) => {
  const response = await api.put(`/disasters/${id}/verify`, { status });
  return response.data;
};

// Get nearby disasters
export const getNearbyDisasters = async (latitude, longitude, maxDistance = 50000) => {
  const response = await api.get('/disasters/nearby', {
    params: { latitude, longitude, maxDistance },
  });
  return response.data;
};

export default api;

