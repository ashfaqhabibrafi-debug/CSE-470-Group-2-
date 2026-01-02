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

// Get all help requests
export const getHelpRequests = async (filters = {}) => {
  const params = new URLSearchParams(filters).toString();
  const response = await api.get(`/help-requests${params ? '?' + params : ''}`);
  return response.data;
};

// Get single help request
export const getHelpRequest = async (id) => {
  const response = await api.get(`/help-requests/${id}`);
  return response.data;
};

// Create help request
export const createHelpRequest = async (requestData) => {
  const response = await api.post('/help-requests', requestData);
  return response.data;
};

// Match volunteer to help request
export const matchHelpRequest = async (id) => {
  const response = await api.put(`/help-requests/${id}/match`);
  return response.data;
};

// Update help request status
export const updateHelpRequestStatus = async (id, status) => {
  const response = await api.put(`/help-requests/${id}/status`, { status });
  return response.data;
};

// Verify help request (Admin only)
export const verifyHelpRequest = async (id, status) => {
  const response = await api.put(`/help-requests/${id}/verify`, { status });
  return response.data;
};

// Get nearby help requests
export const getNearbyHelpRequests = async (latitude, longitude, maxDistance = 50000) => {
  const response = await api.get('/help-requests/nearby', {
    params: { latitude, longitude, maxDistance },
  });
  return response.data;
};

export default api;
