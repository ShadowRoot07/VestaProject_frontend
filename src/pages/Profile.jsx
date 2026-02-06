import { useAuth } from '../context/AuthContext';

export const Profile = () => {
  const { user } = useAuth();
  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold">Mi Perfil</h2>
      <p className="mt-2 text-gray-600">Usuario: <span className="font-mono">{user?.token?.substring(0, 10)}...</span></p>
    </div>
  );
};

