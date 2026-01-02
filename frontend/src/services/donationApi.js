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

// Donations
export const getDonations = async (filters = {}) => {
  const params = new URLSearchParams(filters).toString();
  const response = await api.get(`/donations${params ? '?' + params : ''}`);
  return response.data;
};

export const createDonation = async (donationData) => {
  const response = await api.post('/donations', donationData);
  return response.data;
};

export const updateDonationStatus = async (id, status, transactionId = null) => {
  const response = await api.put(`/donations/${id}/status`, { status, transactionId });
  return response.data;
};

export const getDonationStats = async () => {
  const response = await api.get('/donations/stats');
  return response.data;
};

// Donation Events
export const getDonationEvents = async (filters = {}) => {
  const params = new URLSearchParams(filters).toString();
  const response = await api.get(`/donation-events${params ? '?' + params : ''}`);
  return response.data;
};

export const getDonationEvent = async (id) => {
  const response = await api.get(`/donation-events/${id}`);
  return response.data;
};

export const createDonationEvent = async (eventData) => {
  const response = await api.post('/donation-events', eventData);
  return response.data;
};

export const updateDonationEvent = async (id, eventData) => {
  const response = await api.put(`/donation-events/${id}`, eventData);
  return response.data;
};

// Organizations
export const getOrganizations = async () => {
  const response = await api.get('/organizations');
  return response.data;
};

export default api;

