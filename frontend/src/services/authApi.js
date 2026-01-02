import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

// Register user
export const register = async (userData) => {
  const response = await axios.post(`${API_URL}/auth/register`, userData);
  return response.data;
};

// Login user
export const login = async (credentials) => {
  const response = await axios.post(`${API_URL}/auth/login`, credentials);
  return response.data;
};

// Get current user
export const getCurrentUser = async (token) => {
  const response = await axios.get(`${API_URL}/auth/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

