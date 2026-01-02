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

// Get all users (Admin only)
export const getUsers = async (filters = {}) => {
  const params = new URLSearchParams(filters).toString();
  const response = await api.get(`/users${params ? '?' + params : ''}`);
  return response.data;
};

// Get all volunteers (for feedback and matching)
export const getVolunteers = async () => {
  const response = await api.get('/users/volunteers');
  return response.data;
};

// Get single user
export const getUser = async (id) => {
  const response = await api.get(`/users/${id}`);
  return response.data;
};

// Update user
export const updateUser = async (id, userData) => {
  const response = await api.put(`/users/${id}`, userData);
  return response.data;
};

// Delete user (Admin only)
export const deleteUser = async (id) => {
  const response = await api.delete(`/users/${id}`);
  return response.data;
};

export default api;

