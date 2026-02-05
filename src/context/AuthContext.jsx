import { createContext, useState, useEffect, useContext } from 'react';
import api from '../services/api';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // Aquí podrías validar el token con tu endpoint /users/me
      setUser({ token }); 
    }
    setLoading(false);
  }, []);


    const login = async (username, password) => {
    try {
      // 1. Convertimos los datos a formato Form Data
      const params = new URLSearchParams();
      params.append('username', username);
      params.append('password', password);

      // 2. Enviamos los params en lugar del objeto JSON
      const response = await api.post('/auth/login', params, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });

      const { access_token } = response.data;
      localStorage.setItem('token', access_token);
      setUser({ token: access_token });
      
      return response.data;
    } catch (error) {
      // 3. ¡IMPORTANTE! Quitemos el alert para poder ver el error real en consola
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

