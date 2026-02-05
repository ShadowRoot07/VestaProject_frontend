import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) return <p>Cargando seguridad...</p>;

  if (!user) {
    return <Navigate to="/login" />;
  }

  // Si especificamos roles y el rol del usuario no coincide
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" />; // Redirigir al home de usuario si no es admin
  }

  return children;
};

