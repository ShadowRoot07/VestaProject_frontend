import { useState, useEffect } from 'react';
import api from '../services/api';
import {
  Users, Package, ShoppingCart, DollarSign,
  Loader2, ArrowLeft, BarChart3, Plus, Trash2, X
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const DashboardAdmin = () => {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]); // Nuevo estado para inventario
  const [catReport, setCatReport] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Estados para el formulario
  const [showForm, setShowForm] = useState(false);
  const [newProd, setNewProd] = useState({ 
    title: '', price: '', description: '', category_id: 1, image_url: '' 
  });

  const fetchData = async () => {
    try {
      const [statsRes, usersRes, reportRes, prodRes] = await Promise.all([
        api.get('/admin/stats'),
        api.get('/admin/users'),
        api.get('/admin/reports/categories'),
        api.get('/products') // Traemos productos para el inventario
      ]);

      setStats(statsRes.data);
      setUsers(usersRes.data);
      setCatReport(reportRes.data);
      setProducts(prodRes.data);
    } catch (error) {
      console.error("Error al cargar el panel:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateProduct = async (e) => {
    e.preventDefault();
    try {
      await api.post('/products', newProd);
      alert("¡Producto creado!");
      setShowForm(false);
      setNewProd({ title: '', price: '', description: '', category_id: 1, image_url: '' });
      fetchData(); // Recargamos todo
    } catch (error) {
      alert("Error al crear producto");
    }
  };

  const handleDeleteProduct = async (id) => {
    if (window.confirm("¿Eliminar este producto permanentemente?")) {
      try {
        await api.delete(`/admin/products/${id}`);
        setProducts(products.filter(p => p.id !== id));
        alert("Producto eliminado");
      } catch (error) {
        alert("Error al eliminar");
      }
    }
  };

  const handleAddBalance = async (userId, currentUsername) => {
    const amount = prompt(`¿Cuánto saldo quieres añadir a ${currentUsername}?`);
    if (amount && !isNaN(amount) && parseFloat(amount) > 0) {
      try {
        await api.patch(`/admin/users/${userId}/add-balance?amount=${amount}`);
        setUsers(users.map(u => u.id === userId ? { ...u, balance: u.balance + parseFloat(amount) } : u));
        alert("¡Saldo actualizado!");
      } catch (error) {
        alert("Error al actualizar saldo");
      }
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center h-screen bg-gray-50">
      <Loader2 className="animate-spin text-red-600" size={48} />
    </div>
  );

  return (
    <div className="p-4 md:p-6 bg-gray-50 min-h-screen">
      {/* HEADER */}
      <div className="max-w-6xl mx-auto mb-8">
        <Link to="/profile" className="text-gray-500 flex items-center gap-2 mb-4 hover:text-gray-800 transition">
          <ArrowLeft size={18} /> Volver a mi perfil
        </Link>
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-black text-gray-900">Panel <span className="text-red-600">Admin</span> 🛡️</h1>
            <p className="text-gray-500 text-sm">Control total de Vesta Market</p>
          </div>
          <button 
            onClick={() => setShowForm(!showForm)}
            className={`${showForm ? 'bg-gray-200 text-gray-700' : 'bg-red-600 text-white'} px-4 py-2 rounded-2xl font-bold flex items-center gap-2 transition shadow-lg`}
          >
            {showForm ? <X size={18}/> : <Plus size={18}/>}
            {showForm ? "Cancelar" : "Nuevo Producto"}
          </button>
        </div>
      </div>

      {/* FORMULARIO CREACIÓN (Solo visible si showForm es true) */}
      {showForm && (
        <div className="max-w-6xl mx-auto mb-10 animate-in fade-in slide-in-from-top-4 duration-300">
          <form onSubmit={handleCreateProduct} className="bg-white p-6 rounded-3xl shadow-xl border border-red-100 grid grid-cols-1 md:grid-cols-3 gap-4">
            <h3 className="col-span-full font-bold text-gray-800 flex items-center gap-2">
              <Package className="text-red-500" size={20}/> Registrar Nuevo Item
            </h3>
            <input 
              type="text" placeholder="Título del producto" required
              className="p-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-red-500 outline-none"
              onChange={e => setNewProd({...newProd, title: e.target.value})}
            />
            <input 
              type="number" placeholder="Precio ($)" required
              className="p-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-red-500 outline-none"
              onChange={e => setNewProd({...newProd, price: parseFloat(e.target.value)})}
            />
            <input 
              type="number" placeholder="ID Categoría (ej: 1)" required
              className="p-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-red-500 outline-none"
              onChange={e => setNewProd({...newProd, category_id: parseInt(e.target.value)})}
            />
            <textarea 
              placeholder="Descripción corta..." required className="p-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-red-500 outline-none md:col-span-3 h-24"
              onChange={e => setNewProd({...newProd, description: e.target.value})}
            ></textarea>
            <button className="md:col-span-3 bg-red-600 text-white font-black py-3 rounded-2xl hover:bg-red-700 transition">
              PUBLICAR EN LA TIENDA
            </button>
          </form>
        </div>
      )}

      {/* STAT CARDS */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        <StatCard icon={Users} title="Usuarios" value={stats?.total_users} color="bg-blue-500" />
        <StatCard icon={Package} title="Productos" value={stats?.total_products} color="bg-purple-500" />
        <StatCard icon={ShoppingCart} title="Ventas" value={stats?.total_sales} color="bg-orange-500" />
        <StatCard icon={DollarSign} title="Ingresos" value={`$${stats?.total_revenue?.toFixed(2)}`} color="bg-green-500" />
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
        {/* TABLA USUARIOS */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
          <h2 className="font-bold text-lg mb-6 flex items-center gap-2"><Users size={20} className="text-blue-500"/> Usuarios</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left min-w-[400px]">
              <thead className="text-gray-400 text-xs uppercase italic">
                <tr><th className="p-4">User</th><th className="p-4">Saldo</th><th className="p-4 text-center">Cash</th></tr>
              </thead>
              <tbody className="text-sm">
                {users.map(u => (
                  <tr key={u.id} className="border-t border-gray-50 hover:bg-gray-50">
                    <td className="p-4 font-bold">{u.username}</td>
                    <td className="p-4 text-green-600 font-bold">${u.balance.toFixed(2)}</td>
                    <td className="p-4 text-center">
                      <button onClick={() => handleAddBalance(u.id, u.username)} className="bg-green-100 text-green-600 p-2 rounded-lg hover:bg-green-200 transition">
                        <Plus size={16}/>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* TABLA INVENTARIO (PRODUCTOS) */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
          <h2 className="font-bold text-lg mb-6 flex items-center gap-2"><Package size={20} className="text-purple-500"/> Inventario Global</h2>
          <div className="overflow-x-auto h-[300px] overflow-y-auto">
            <table className="w-full text-left min-w-[400px]">
              <thead className="text-gray-400 text-xs uppercase italic sticky top-0 bg-white">
                <tr><th className="p-4">Producto</th><th className="p-4">Precio</th><th className="p-4 text-center">Acción</th></tr>
              </thead>
              <tbody className="text-sm">
                {products.map(p => (
                  <tr key={p.id} className="border-t border-gray-50 hover:bg-gray-50">
                    <td className="p-4 font-medium text-gray-700 truncate max-w-[150px]">{p.title}</td>
                    <td className="p-4 font-black">${p.price.toFixed(2)}</td>
                    <td className="p-4 text-center">
                      <button onClick={() => handleDeleteProduct(p.id)} className="bg-red-50 text-red-500 p-2 rounded-lg hover:bg-red-100 transition">
                        <Trash2 size={16}/>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ icon: Icon, title, value, color }) => (
  <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4 hover:shadow-md transition">
    <div className={`${color} p-3 rounded-2xl text-white shadow-lg`}><Icon size={24} /></div>
    <div>
      <p className="text-[10px] font-medium text-gray-400 uppercase">{title}</p>
      <p className="text-xl font-black text-gray-900">{value ?? 0}</p>
    </div>
  </div>
);

