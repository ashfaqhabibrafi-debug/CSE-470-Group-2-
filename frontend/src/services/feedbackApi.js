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

export const getFeedback = async (filters = {}) => {
  const params = new URLSearchParams(filters).toString();
  const response = await api.get(`/feedback${params ? '?' + params : ''}`);
  return response.data;
};

export const createFeedback = async (feedbackData) => {
  const response = await api.post('/feedback', feedbackData);
  return response.data;
};

export const getUserRating = async (userId) => {
  const response = await api.get(`/feedback/rating/${userId}`);
  return response.data;
};

export default api;

