import { useState } from 'react';
import api from '../services/api';
import { useNavigate, Link } from 'react-router-dom';
import { Loader2, UserPlus } from 'lucide-react';

const Register = () => {
  const [formData, setFormData] = useState({ username: '', password: '', email: '' });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await api.post('/auth/register', formData);
      alert('¡Registro exitoso! Ya puedes loguearte.');
      navigate('/login');
    } catch (error) {
      console.error(error);
      alert('Error en el registro. Es posible que el usuario ya exista.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 p-4">
      <form onSubmit={handleRegister} className="bg-white p-10 rounded-[2.5rem] shadow-2xl w-full max-w-md">
        <div className="flex justify-center mb-4 text-blue-500">
            <UserPlus size={48} />
        </div>
        <h2 className="text-3xl font-black text-gray-800 mb-2 text-center tracking-tighter">Únete a Vesta</h2>
        <p className="text-gray-400 text-center mb-8 text-sm">Crea tu cuenta para empezar a comprar.</p>

        <div className="space-y-4">
          <input
            disabled={isLoading}
            type="text"
            placeholder="Nombre de usuario"
            className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all disabled:opacity-50"
            onChange={e => setFormData({...formData, username: e.target.value})}
            required
          />
          <input
            disabled={isLoading}
            type="email"
            placeholder="Tu Email"
            className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all disabled:opacity-50"
            onChange={e => setFormData({...formData, email: e.target.value})}
            required
          />
          <input
            disabled={isLoading}
            type="password"
            placeholder="Contraseña"
            className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all disabled:opacity-50"
            onChange={e => setFormData({...formData, password: e.target.value})}
            required
          />
        </div>

        <button 
          disabled={isLoading}
          className="w-full mt-8 bg-blue-600 text-white py-4 rounded-2xl font-black hover:bg-blue-700 transition-all shadow-xl shadow-blue-900/20 flex justify-center items-center gap-2 disabled:bg-gray-300 disabled:shadow-none"
        >
          {isLoading ? (
            <><Loader2 className="animate-spin" size={20} /> Creando...</>
          ) : (
            "Crear Cuenta"
          )}
        </button>

        <p className="mt-6 text-center text-sm text-gray-500 font-medium">
            ¿Ya eres miembro?{' '}
            <Link to="/login" className="text-blue-600 font-black hover:underline">Entra aquí</Link>
        </p>
      </form>
    </div>
  );
};

export default Register;

