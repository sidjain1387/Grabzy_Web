import axios from 'axios';

const API_with_auth = axios.create({
  baseURL: 'http://localhost:3000/api',
});

// Add a request interceptor to include the token
API_with_auth.interceptors.request.use((config) => {
  const token = localStorage.getItem('token'); // or wherever you store your token
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default API_with_auth;
