import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) return (
    <div className="flex justify-center items-center h-screen text-gray-400 font-medium">
      Verificando credenciales...
    </div>
  );

  // 1. Si no hay usuario logueado, a la calle (Login)
  if (!user) {
    return <Navigate to="/login" />;
  }

  // 2. Lógica para Admins:
  // Si la ruta pide rol 'admin' pero el usuario NO es admin, lo rebotamos al dashboard
  if (allowedRoles?.includes('admin') && !user.is_admin) {
    console.warn("Acceso denegado: Se requiere rol de administrador");
    return <Navigate to="/dashboard" />;
  }

  // 3. Si todo está en orden, lo dejamos pasar
  return children;
};

