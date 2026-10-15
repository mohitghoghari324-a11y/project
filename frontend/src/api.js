import axios from 'axios';

const API = axios.create({
  baseURL: 'https://task-management-backend-i4i8.onrender.com',
});

// Request interceptor to add JWT token
API.interceptors.request.use((req) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) {
      req.headers.Authorization = `Bearer ${token}`;
    }
  }
  return req;
});

export default API;