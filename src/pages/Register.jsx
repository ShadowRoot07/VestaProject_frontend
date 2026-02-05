import { useState } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [formData, setFormData] = useState({ username: '', password: '', email: '' });
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      // Llamada al endpoint exacto de tu imagen: /auth/register
      await api.post('/auth/register', formData);
      alert('¡Registro exitoso! Ya puedes loguearte.');
      navigate('/login');
    } catch (error) {
      console.error(error);
      alert('Error en el registro. Revisa los datos.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 p-4">
      <form onSubmit={handleRegister} className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
        <h2 className="text-2xl font-bold text-blue-600 mb-6 text-center">Únete a Vesta</h2>
        <div className="space-y-4">
          <input 
            type="text" 
            placeholder="Nombre de usuario" 
            className="w-full p-2 border rounded-lg"
            onChange={e => setFormData({...formData, username: e.target.value})} 
            required 
          />
          <input 
            type="email" 
            placeholder="Tu Email" 
            className="w-full p-2 border rounded-lg"
            onChange={e => setFormData({...formData, email: e.target.value})} 
            required 
          />
          <input 
            type="password" 
            placeholder="Contraseña" 
            className="w-full p-2 border rounded-lg"
            onChange={e => setFormData({...formData, password: e.target.value})} 
            required 
          />
        </div>
        <button className="w-full mt-6 bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition">
          Crear Cuenta
        </button>
      </form>
    </div>
  );
};

export default Register;

