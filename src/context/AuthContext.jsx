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

    const login = async (username, password) => { // Cambiado de email a username
    // Ajustado al endpoint de tu Swagger
    const response = await api.post('/auth/login', { username, password }); 
    const { access_token } = response.data;

    localStorage.setItem('token', access_token);
    
    // Tip: Si tu API devuelve el rol, guárdalo aquí también
    // setUser({ token: access_token, role: response.data.role }); 
    setUser({ token: access_token });
    
    return response.data;
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

