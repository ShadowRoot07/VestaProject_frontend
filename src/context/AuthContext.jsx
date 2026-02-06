import { createContext, useState, useEffect, useContext } from 'react';
import api from '../services/api';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
      const initAuth = () => {
        const token = localStorage.getItem('token');
        if (token) {
          // ShadowRoot07: Es vital poner el role aquí para que el 
          // ProtectedRoute de App.jsx te deje pasar.
          setUser({ token, role: 'user' }); 
        }
        setLoading(false);
      };
      initAuth();
    }, []);

  const login = async (username, password) => {
    try {
      const params = new URLSearchParams();
      params.append('username', username);
      params.append('password', password);

      const response = await api.post('/auth/login', params, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      });

      const { access_token } = response.data;
      localStorage.setItem('token', access_token);
      
      // Aquí también inyectamos el rol 'user'
      setUser({ token: access_token, role: 'user' });

      return response.data;
    } catch (error) {
      console.error("Error en login:", error.response?.data || error.message);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

