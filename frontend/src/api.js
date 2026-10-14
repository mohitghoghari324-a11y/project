import axios from 'axios';

const API = axios.create({
  baseURL: 'https://task-management-1-efzt.onrender.com', // Backend local URL (Deployment vakhte live URL muki devu)
});

// Request interceptor to add JWT token
API.interceptors.request.use((req) => {
  const token = localStorage.getItem('token');
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export default API;