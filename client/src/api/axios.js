import axios from 'axios';

// Use Render backend in production, local backend in development
const API_URL = window.location.hostname === 'localhost'
  ? 'http://localhost:5002/api'
  : 'https://future-fs-02-hi8b.onrender.com/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
