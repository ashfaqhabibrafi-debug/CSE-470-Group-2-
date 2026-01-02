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

// Get all organizations (public, verified only)
export const getOrganizations = async () => {
  const response = await api.get('/organizations');
  return response.data;
};

// Get all organizations including unverified (Admin only)
export const getAllOrganizations = async () => {
  const response = await api.get('/organizations/all');
  return response.data;
};

// Get single organization
export const getOrganization = async (id) => {
  const response = await api.get(`/organizations/${id}`);
  return response.data;
};

// Create organization (Admin only)
export const createOrganization = async (organizationData) => {
  const response = await api.post('/organizations', organizationData);
  return response.data;
};

// Update organization (Admin only)
export const updateOrganization = async (id, organizationData) => {
  const response = await api.put(`/organizations/${id}`, organizationData);
  return response.data;
};

// Delete organization (Admin only)
export const deleteOrganization = async (id) => {
  const response = await api.delete(`/organizations/${id}`);
  return response.data;
};

export default api;
