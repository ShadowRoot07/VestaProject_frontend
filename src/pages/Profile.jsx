import { useState, useEffect } from 'react';
import api from '../services/api';
import { Modal } from '../components/Modal';
import {
  ShoppingCart, Heart, ShoppingBag, Wallet,
  ChevronRight, Loader2, X, ShieldCheck, Trash2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Profile = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeModal, setActiveModal] = useState(null);

  const fetchProfile = async () => {
    try {
      const response = await api.get('/users/me');
      setProfile(response.data);
    } catch (error) {
      console.error("Error al cargar perfil:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleRemoveFromCart = async (productId) => {
    try {
      // Llamada al backend para eliminar el item del carrito
      await api.delete(`/interactions/cart/${productId}`);
      
      // Actualización optimista del estado local
      setProfile({
        ...profile,
        cart_items: profile.cart_items.filter(item => item.id !== productId)
      });
    } catch (error) {
      alert("No se pudo eliminar el producto del carrito");
    }
  };

  const handleCheckout = async () => {
    try {
      setIsProcessing(true);
      const response = await api.post('/interactions/checkout');
      alert(`¡Compra exitosa! Total pagado: $${response.data.total_paid}`);
      await fetchProfile();
      setActiveModal(null);
    } catch (error) {
      alert(error.response?.data?.detail || "Saldo insuficiente o error en la compra");
    } finally {
      setIsProcessing(false);
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center h-screen bg-gray-50">
      <Loader2 className="animate-spin text-blue-600" size={48} />
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto px-4 pb-20 pt-6">
      {/* --- TARJETA DE USUARIO --- */}
      <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 text-center mb-8 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-blue-500"></div>
        <div className="w-24 h-24 bg-gradient-to-br from-blue-600 to-indigo-500 rounded-full mx-auto flex items-center justify-center text-white text-3xl font-black mb-4 shadow-xl ring-4 ring-blue-50">
          {profile?.username?.[0].toUpperCase()}
        </div>
        <h2 className="text-2xl font-black text-gray-800 tracking-tight">{profile?.username}</h2>
        <p className="text-gray-400 text-sm mb-6">{profile?.email}</p>

        <div className="inline-flex items-center gap-3 bg-blue-50 text-blue-700 px-8 py-3 rounded-2xl font-black border border-blue-100">
          <Wallet size={20}/>
          <span className="text-xl">${profile?.balance.toFixed(2)}</span>
        </div>
      </div>

      {/* --- MENÚ DE OPCIONES --- */}
      <div className="bg-white rounded-[2.5rem] border border-gray-100 overflow-hidden shadow-sm">
        <MenuOption
          icon={ShoppingCart} title="Mi Carrito"
          count={`${profile?.cart_items?.length || 0} items`}
          onClick={() => setActiveModal('cart')}
        />
        <MenuOption
          icon={Heart} title="Favoritos"
          count={`${profile?.liked_items?.length || 0} guardados`}
          onClick={() => setActiveModal('likes')}
        />
        <MenuOption
          icon={ShoppingBag} title="Historial de Compras"
          count={`${profile?.purchases_count || 0} pedidos`}
          onClick={() => setActiveModal('orders')}
        />

        {profile?.is_admin && (
          <MenuOption
            icon={ShieldCheck}
            title="Panel de Administrador"
            count="Acceso Maestro"
            onClick={() => navigate('/admin-dashboard')}
            isAdmin={true}
          />
        )}
      </div>

      {/* --- MODAL: CARRITO --- */}
      <Modal isOpen={activeModal === 'cart'} onClose={() => setActiveModal(null)} title="Mi Carrito 🛒">
        <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
          {profile?.cart_items && profile.cart_items.length > 0 ? (
            <>
              {profile.cart_items.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
                  <div className="flex items-center gap-4">
                    <img src={item.image_url} className="w-14 h-14 rounded-xl object-cover shadow-sm" alt={item.title} />
                    <div>
                      <p className="font-bold text-gray-800 text-sm line-clamp-1">{item.title || item.name}</p>
                      <p className="text-blue-600 font-black text-md">${item.price.toFixed(2)}</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => handleRemoveFromCart(item.id)}
                    className="text-gray-300 hover:text-red-500 p-2 transition-colors"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              ))}
              
              <div className="pt-6 mt-4 border-t border-dashed border-gray-200">
                <div className="flex justify-between items-center mb-6 px-2">
                  <span className="text-gray-500 font-medium">Total estimado:</span>
                  <span className="text-3xl font-black text-gray-900">
                    ${profile.cart_items.reduce((acc, item) => acc + item.price, 0).toFixed(2)}
                  </span>
                </div>
                <button
                  onClick={handleCheckout}
                  disabled={isProcessing}
                  className="w-full bg-blue-600 text-white py-5 rounded-2xl font-black shadow-lg shadow-blue-200 hover:bg-blue-700 transition disabled:bg-gray-300 flex justify-center items-center gap-3 uppercase tracking-wider"
                >
                  {isProcessing ? <><Loader2 size={22} className="animate-spin" /> Procesando...</> : "Confirmar y Pagar"}
                </button>
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <div className="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-300">
                <ShoppingCart size={32} />
              </div>
              <p className="text-gray-400 font-medium">Tu carrito está vacío</p>
            </div>
          )}
        </div>
      </Modal>

      {/* --- MODAL: HISTORIAL DE COMPRAS --- */}
      <Modal isOpen={activeModal === 'orders'} onClose={() => setActiveModal(null)} title="Mis Compras 🛍️">
        <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2">
            {profile?.purchases_items && profile.purchases_items.length > 0 ? (
                profile.purchases_items.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border border-gray-50 rounded-2xl bg-white shadow-sm">
                        <div className="flex items-center gap-4">
                            <div className="relative">
                              <img src={item.image_url} className="w-14 h-14 rounded-xl object-cover" alt={item.title} />
                              <div className="absolute -bottom-1 -right-1 bg-green-500 border-2 border-white w-4 h-4 rounded-full"></div>
                            </div>
                            <div>
                                <p className="font-bold text-sm text-gray-800 line-clamp-1">{item.title || item.name}</p>
                                <p className="text-blue-600 font-black text-sm">${item.price.toFixed(2)}</p>
                            </div>
                        </div>
                        <div className="text-right">
                          <span className="text-[10px] bg-green-50 text-green-600 px-3 py-1 rounded-full font-black uppercase">Recibido</span>
                        </div>
                    </div>
                ))
            ) : (
                <p className="text-center text-gray-400 py-10">Aún no has realizado ninguna compra.</p>
            )}
        </div>
      </Modal>

      {/* --- MODAL: LIKES --- */}
      <Modal isOpen={activeModal === 'likes'} onClose={() => setActiveModal(null)} title="Mis Favoritos ❤️">
        <div className="grid grid-cols-2 gap-3">
          {profile?.liked_items?.length > 0 ? (
            profile.liked_items.map(item => (
              <div key={item.id} className="p-2 border rounded-2xl text-center">
                <img src={item.image_url} className="w-full aspect-square object-cover rounded-xl mb-2" alt={item.title} />
                <p className="text-xs font-bold text-gray-700 truncate">{item.title || item.name}</p>
              </div>
            ))
          ) : (
            <p className="col-span-2 text-center text-gray-400 py-10">No tienes favoritos aún.</p>
          )}
        </div>
      </Modal>

    </div>
  );
};

const MenuOption = ({ icon: Icon, title, count, onClick, isAdmin = false }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center justify-between p-6 hover:bg-gray-50 transition border-b border-gray-50 last:border-0 group ${isAdmin ? 'bg-red-50/30' : ''}`}
  >
    <div className="flex items-center gap-5">
      <div className={`p-3.5 rounded-2xl transition-transform group-hover:scale-110 ${isAdmin ? 'bg-red-100 text-red-600 shadow-red-100 shadow-md' : 'bg-gray-100 text-gray-600'}`}>
        <Icon size={24}/>
      </div>
      <div className="text-left">
        <p className={`font-black tracking-tight ${isAdmin ? 'text-red-700' : 'text-gray-800'}`}>{title}</p>
        <p className={`text-xs font-bold ${isAdmin ? 'text-red-500' : 'text-blue-500'}`}>{count}</p>
      </div>
    </div>
    <ChevronRight size={20} className={`transition-transform group-hover:translate-x-1 ${isAdmin ? 'text-red-300' : 'text-gray-300'}`} />
  </button>
);

