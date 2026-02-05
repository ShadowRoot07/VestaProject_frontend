import axios from 'axios';

const api = axios.create({
  // Reemplaza esto con tu URL de Render cuando la tengas a mano
  baseURL: 'https://vestaproject-backend.onrender.com',
});

// Interceptor para añadir el token automáticamente a cada petición
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;

