import axios from 'axios';

const api = axios.create({
  // Vite usa import.meta.env para acceder a las variables de entorno
  // Si no encuentra la variable VITE_API_URL, usará localhost por defecto
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
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

