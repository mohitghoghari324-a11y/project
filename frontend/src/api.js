import axios from 'axios';

const API = axios.create({
  baseURL: 'https://project-1-dcl5.onrender.com/api', // Render ni live URL
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