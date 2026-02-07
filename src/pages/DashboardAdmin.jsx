import { useState, useEffect } from 'react';
import api from '../services/api';
import { 
  Users, Package, ShoppingCart, DollarSign, 
  Loader2, ArrowLeft, BarChart3 
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const DashboardAdmin = () => {
  // 1. ESTADOS: Definimos dónde guardaremos cada pieza de información
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [catReport, setCatReport] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // 2. CARGA PARALELA: Pedimos todo al mismo tiempo para ahorrar milisegundos
        const [statsRes, usersRes, reportRes] = await Promise.all([
          api.get('/admin/stats'),
          api.get('/admin/users'),
          api.get('/admin/reports/categories')
        ]);

        setStats(statsRes.data);
        setUsers(usersRes.data);
        setCatReport(reportRes.data);
      } catch (error) {
        console.error("Error al cargar el panel:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  if (loading) return (
    <div className="flex justify-center items-center h-screen">
      <Loader2 className="animate-spin text-red-600" size={48} />
    </div>
  );

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* --- ENCABEZADO --- */}
      <div className="max-w-6xl mx-auto mb-8">
        <Link to="/profile" className="text-gray-500 flex items-center gap-2 mb-4 hover:text-gray-800 transition">
          <ArrowLeft size={18} /> Volver a mi perfil
        </Link>
        <h1 className="text-3xl font-black text-gray-900">
          Panel de Control <span className="text-red-600">Admin</span> 🛡️
        </h1>
        <p className="text-gray-500">Gestión global de usuarios y métricas de venta</p>
      </div>

      {/* --- REJILLA DE ESTADÍSTICAS (STAT CARDS) --- */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <StatCard icon={Users} title="Usuarios" value={stats?.total_users} color="bg-blue-500" />
        <StatCard icon={Package} title="Productos" value={stats?.total_products} color="bg-purple-500" />
        <StatCard icon={ShoppingCart} title="Ventas" value={stats?.total_sales} color="bg-orange-500" />
        <StatCard icon={DollarSign} title="Ingresos" value={`$${stats?.total_revenue?.toFixed(2)}`} color="bg-green-500" />
      </div>

      {/* --- SECCIÓN DE TABLAS Y REPORTES --- */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* TABLA 1: GESTIÓN DE USUARIOS */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-6 text-gray-800">
            <Users size={20} className="text-blue-500" />
            <h2 className="font-bold text-lg">Usuarios Registrados</h2>
          </div>
          <div className="overflow-hidden rounded-2xl border border-gray-50">
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-50 text-gray-400 text-xs uppercase">
                <tr>
                  <th className="p-4">Username</th>
                  <th className="p-4">Saldo</th>
                  <th className="p-4">Estado</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {users.map((u) => (
                  <tr key={u.id} className="border-t border-gray-50 hover:bg-gray-50 transition">
                    <td className="p-4 font-bold text-gray-700">{u.username}</td>
                    <td className="p-4 text-green-600 font-bold">${u.balance.toFixed(2)}</td>
                    <td className="p-4">
                      {u.is_admin ? 
                        <span className="bg-red-100 text-red-600 px-2 py-1 rounded-lg text-xs font-bold">Admin</span> : 
                        <span className="bg-blue-100 text-blue-600 px-2 py-1 rounded-lg text-xs font-bold">User</span>
                      }
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* TABLA 2: CATEGORÍAS MÁS VENDIDAS */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-6 text-gray-800">
            <BarChart3 size={20} className="text-purple-500" />
            <h2 className="font-bold text-lg">Categorías Recurrentes</h2>
          </div>
          <div className="space-y-4">
            {catReport.length > 0 ? catReport.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-purple-50 rounded-2xl">
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 flex items-center justify-center bg-purple-600 text-white rounded-full text-xs font-bold">
                    #{index + 1}
                  </span>
                  <span className="font-bold text-purple-900">{item.category}</span>
                </div>
                <span className="bg-white px-4 py-1 rounded-full text-purple-600 font-black shadow-sm">
                  {item.sales} ventas
                </span>
              </div>
            )) : (
              <p className="text-center text-gray-400 py-10">Esperando primeras ventas...</p>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

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

