import { useState, useEffect } from 'react';
import api from '../services/api';
import { Users, Package, ShoppingCart, DollarSign, Loader2, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export const DashboardAdmin = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get('/admin/stats');
        setStats(response.data);
      } catch (error) {
        console.error("Error al cargar estadísticas:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return (
    <div className="flex justify-center items-center h-screen">
      <Loader2 className="animate-spin text-red-600" size={48} />
    </div>
  );

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Encabezado */}
      <div className="max-w-6xl mx-auto mb-8 flex items-center justify-between">
        <div>
          <Link to="/profile" className="text-gray-500 flex items-center gap-2 mb-2 hover:text-gray-800 transition">
            <ArrowLeft size={18} /> Volver a mi perfil
          </Link>
          <h1 className="text-3xl font-black text-gray-900">Panel de Control <span className="text-red-600">Admin</span> 🛡️</h1>
          <p className="text-gray-500">Resumen general de la plataforma Vesta</p>
        </div>
      </div>

      {/* Rejilla de Estadísticas */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          icon={Users} 
          title="Usuarios" 
          value={stats?.total_users} 
          color="bg-blue-500" 
        />
        <StatCard 
          icon={Package} 
          title="Productos" 
          value={stats?.total_products} 
          color="bg-purple-500" 
        />
        <StatCard 
          icon={ShoppingCart} 
          title="Ventas Totales" 
          value={stats?.total_sales} 
          color="bg-orange-500" 
        />
        <StatCard 
          icon={DollarSign} 
          title="Ingresos" 
          value={`$${stats?.total_revenue?.toFixed(2)}`} 
          color="bg-green-500" 
        />
      </div>

      {/* Próximamente: Lista de usuarios recientes o acciones rápidas */}
      <div className="max-w-6xl mx-auto mt-10 p-8 bg-white rounded-3xl border border-gray-100 shadow-sm text-center">
        <h3 className="text-lg font-bold text-gray-800">Próximos Bloques:</h3>
        <p className="text-gray-500 mt-2">Gestión de usuarios baneados y edición de inventario en tiempo real.</p>
      </div>
    </div>
  );
};

// Sub-componente para las tarjetas de estadísticas
const StatCard = ({ icon: Icon, title, value, color }) => (
  <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-5">
    <div className={`${color} p-4 rounded-2xl text-white shadow-lg`}>
      <Icon size={28} />
    </div>
    <div>
      <p className="text-sm font-medium text-gray-400 uppercase tracking-wider">{title}</p>
      <p className="text-2xl font-black text-gray-900">{value}</p>
    </div>
  </div>
);

