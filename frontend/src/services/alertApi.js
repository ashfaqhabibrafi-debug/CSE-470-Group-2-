import api from './api';

export const getAlerts = async (filters = {}) => {
  const params = new URLSearchParams(filters).toString();
  const response = await api.get(`/alerts${params ? '?' + params : ''}`);
  return response.data;
};

export const getMyAlerts = async () => {
  const response = await api.get('/alerts/my-alerts');
  return response.data;
};

export const getAlert = async (id) => {
  const response = await api.get(`/alerts/${id}`);
  return response.data;
};

export const createAlert = async (alertData) => {
  const response = await api.post('/alerts', alertData);
  return response.data;
};

export const createDisasterAlert = async (disasterId) => {
  const response = await api.post(`/alerts/disaster/${disasterId}`);
  return response.data;
};

export default api;

