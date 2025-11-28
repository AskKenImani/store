import axios from 'axios';

// Set up Axios instance
const API_URL = process.env.REACT_APP_API_URL;
const API = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach JWT to every request (if available in localStorage)
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Auth Services
export const loginUser = async (data) => {
  const response = await API.post('/auth/login', data);
  return response;
};

export const registerUser = async (data) => {
  const response = await API.post('/auth/signup', data);
  return response;
};

export const getUserProfile = async () => {
  const response = await API.get('/auth/me');
  return response;
};

export const logoutUser = () => {
  localStorage.removeItem('auth_token');
  localStorage.removeItem('role');
  localStorage.removeItem('user_name');
  localStorage.removeItem('user_id');
};

// Product Services
export const getProducts = async () => {
  const response = await API.get('/products');
  return response;
};

export const getProduct = async (id) => {
  const response = await API.get(`/products/${id}`);
  return response;
};

export const createProduct = async (data) => {
  const response = await API.post('/products/add', data);
  return response;
};

export const updateProduct = async (id, data) => {
  const response = await API.put(`/products/${id}`, data);
  return response;
};

export const deleteProduct = async (id) => {
  const response = await API.delete(`/products/${id}`);
  return response;
};

// Review Services
export const getReviewsByProduct = async (productId) => {
  const response = await API.get(`/reviews/${productId}`);
  return response;
};

export const createReview = async (data) => {
  const response = await API.post('/reviews', data);
  return response;
};

// Order Services
export const createOrder = async (data) => {
  const response = await API.post('/orders', data);
  return response;
};

export const getOrders = async () => {
  const response = await API.get('/orders');
  return response;
};

// Payment Services (Paystack Integration)
export const initiatePayment = async (amount, orderId, email) => {
  const response = await API.post('/payments/pay', { amount, orderId, email });
  return response;
};

export const verifyPayment = async (reference) => {
  const response = await API.post('/payments/verify', { reference });
  return response;
};

export default API;
