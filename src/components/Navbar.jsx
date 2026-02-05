import { Home, ShoppingBag, User, Settings, LogOut } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const Navbar = () => {
  const { user, logout } = useAuth();

  const navLinks = [
    { name: 'Inicio', path: '/dashboard', icon: <Home size={24} /> },
    { name: 'Tienda', path: '/shop', icon: <ShoppingBag size={24} /> },
    { name: 'Perfil', path: '/profile', icon: <User size={24} /> },
  ];

  // Si es admin, añadimos el link de ajustes
  if (user?.role === 'admin') {
    navLinks.push({ name: 'Admin', path: '/admin', icon: <Settings size={24} /> });
  }

  return (
    <>
      {/* --- MENÚ PARA PC (Barra Superior) --- */}
      <nav className="hidden md:flex fixed top-0 w-full bg-white border-b border-gray-200 h-16 items-center justify-between px-8 z-50">
        <div className="text-xl font-bold text-blue-600">VestaProject</div>
        <div className="flex gap-8">
          {navLinks.map((link) => (
            <Link key={link.name} to={link.path} className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition">
              {link.icon}
              <span className="font-medium">{link.name}</span>
            </Link>
          ))}
          <button onClick={logout} className="text-red-500 hover:text-red-700 flex items-center gap-1">
            <LogOut size={20} /> Salir
          </button>
        </div>
      </nav>

      {/* --- MENÚ PARA MÓVIL (Barra Inferior) --- */}
      <nav className="md:hidden fixed bottom-0 w-full bg-white border-t border-gray-200 h-16 flex items-center justify-around pb-2 z-50">
        {navLinks.map((link) => (
          <Link key={link.name} to={link.path} className="flex flex-col items-center text-gray-500 active:text-blue-600">
            {link.icon}
            <span className="text-[10px] mt-1">{link.name}</span>
          </Link>
        ))}
        <button onClick={logout} className="flex flex-col items-center text-red-400">
          <LogOut size={24} />
          <span className="text-[10px] mt-1">Salir</span>
        </button>
      </nav>
    </>
  );
};

