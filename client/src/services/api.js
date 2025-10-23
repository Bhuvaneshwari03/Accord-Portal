import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api',
});

// Request interceptor to add auth token
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token expiration
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
export const loginUser = async (credentials) => {
  return await axios.post('/auth/login', credentials);
};
export const registerUser = async (userData) => {
  return await axios.post('/auth/register', userData);
};
// Auth API calls
export const authAPI = {
  register: (data) => API.post('/auth/register', data),
  login: (data) => API.post('/auth/login', data),
  getProfile: () => API.get('/auth/profile'),
  updateProfile: (data) => API.put('/auth/profile', data),
  changePassword: (data) => API.put('/auth/change-password', data),
};

// Leave API calls
export const leaveAPI = {
  create: (data) => API.post('/leaves', data),
  getMyRequests: (params = {}) => API.get('/leaves/my-requests', { params }),
  getAllRequests: (params = {}) => API.get('/leaves', { params }),
  getById: (id) => API.get(`/leaves/${id}`),
  updateStatus: (id, data) => API.put(`/leaves/${id}/status`, data),
  delete: (id) => API.delete(`/leaves/${id}`),
  getStats: (params = {}) => API.get('/leaves/stats', { params }),
};

// Health check
export const healthCheck = () => axios.get('http://localhost:5000/health');

export default API;
