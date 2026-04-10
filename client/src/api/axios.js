import axios from 'axios';

// In production (Vercel), use relative path /api
// In development, use local backend
const API_URL = import.meta.env.PROD ? '/api' : 'http://localhost:5002';

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
