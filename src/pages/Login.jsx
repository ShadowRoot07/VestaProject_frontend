import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Loader2, LogIn } from 'lucide-react';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true); // Iniciamos animación
    try {
      await login(username, password);
      navigate('/dashboard');
    } catch (error) {
      console.log("Error en login:", error);
      alert("Credenciales incorrectas");
    } finally {
      setIsLoading(false); // Detenemos animación
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-[2rem] shadow-xl w-full max-w-md border border-gray-100">
        <div className="flex justify-center mb-4 text-blue-600">
            <LogIn size={40} />
        </div>
        <h2 className="text-3xl font-black text-gray-800 mb-2 text-center tracking-tight">Vesta Login</h2>
        <p className="text-gray-400 text-center mb-8 text-sm font-medium">¡Qué bueno verte de nuevo!</p>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-gray-700 ml-1">Usuario</label>
            <input
                disabled={isLoading}
                type="text"
                className="mt-1 block w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all disabled:opacity-50"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 ml-1">Contraseña</label>
            <input
              disabled={isLoading}
              type="password"
              className="mt-1 block w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all disabled:opacity-50"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
        </div>

        <button 
          disabled={isLoading}
          type="submit" 
          className="w-full mt-8 bg-blue-600 text-white py-4 rounded-2xl font-black hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 flex justify-center items-center gap-2 disabled:bg-gray-400 disabled:shadow-none"
        >
          {isLoading ? (
            <><Loader2 className="animate-spin" size={20} /> Entrando...</>
          ) : (
            "Iniciar Sesión"
          )}
        </button>
        
        <p className="mt-6 text-center text-sm text-gray-500 font-medium">
            ¿No tienes cuenta?{' '}
            <Link to="/register" className="text-blue-600 font-black hover:underline">Regístrate</Link>
        </p>
      </form>
    </div>
  );
};

export default Login;

