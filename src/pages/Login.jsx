import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
        console.log("Intentando login con:", username); // LOG 1
        try {
          const result = await login(username, password);
          console.log("Login exitoso, datos recibidos:", result); // LOG 2
      
          console.log("Navegando a dashboard..."); // LOG 3
          navigate('/dashboard');
        } catch (error) {
          console.log("Error detectado en el catch:", error);
        }
  };


  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Vesta Login</h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Nombre de Usuario</label>
            <input 
                type="text" // Cambiado de email a text
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Contraseña</label>
            <input 
              type="password" 
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
        </div>

        <button type="submit" className="w-full mt-6 bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition">
          Entrar
        </button>
        <p className="mt-4 text-center text-sm text-gray-600"> 
            ¿No tienes cuenta? 
            <Link to="/register" className="text-blue-600 font-bold">Regístrate aquí</Link>
        </p>
      </form>
    </div>
  );
};

export default Login;

