import { useState, useEffect } from 'react';
import api from '../services/api';
import { Modal } from '../components/Modal';
import { ShoppingCart, Heart, ShoppingBag, Wallet, ChevronRight, Loader2, X } from 'lucide-react';

export const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false); // Nuevo estado para no bloquear toda la pantalla
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

  const handleCheckout = async () => {
    try {
      setIsProcessing(true);
      // Ajustamos la ruta para que coincida con el router de interactions
      const response = await api.post('/interactions/checkout');
      alert(`¡Éxito! Gastaste $${response.data.total_paid}`);

      // Recargamos los datos para actualizar balance y vaciar carrito visualmente
      await fetchProfile();
      setActiveModal(null);
    } catch (error) {
      alert(error.response?.data?.detail || "Error al procesar la compra");
    } finally {
      setIsProcessing(false);
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <Loader2 className="animate-spin text-blue-600" size={40} />
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto pb-10">
      {/* Tarjeta de Usuario */}
      <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 text-center mb-8">
        <div className="w-24 h-24 bg-gradient-to-tr from-blue-600 to-blue-400 rounded-full mx-auto flex items-center justify-center text-white text-3xl font-black mb-4 shadow-lg">
          {profile?.username?.[0].toUpperCase()}
        </div>
        <h2 className="text-2xl font-black text-gray-800">{profile?.username}</h2>
        <p className="text-gray-500 mb-6">{profile?.email}</p>

        <div className="inline-flex items-center gap-3 bg-blue-50 text-blue-700 px-6 py-3 rounded-2xl font-bold">
          <Wallet size={20}/>
          <span className="text-lg">${profile?.balance.toFixed(2)}</span>
        </div>
      </div>

      {/* Menú de Opciones */}
      <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm">
        <MenuOption
          icon={ShoppingCart} title="Mi Carrito"
          count={profile?.cart_items?.length || 0}
          onClick={() => setActiveModal('cart')}
        />
        <MenuOption
          icon={Heart} title="Mis Corazones"
          count={profile?.liked_items?.length || 0}
          onClick={() => setActiveModal('likes')}
        />
        <MenuOption
          icon={ShoppingBag} title="Mis Compras"
          count={profile?.purchases_count || 0}
          onClick={() => setActiveModal('orders')}
        />
      </div>

      {/* Modal de Carrito */}
      <Modal
        isOpen={activeModal === 'cart'}
        onClose={() => setActiveModal(null)}
        title="Mi Carrito"
      >
        <div className="space-y-4">
          {profile?.cart_items && profile.cart_items.length > 0 ? (
            <>
              {profile.cart_items.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-2xl">
                  <div className="flex items-center gap-3">
                    <img src={item.image_url} className="w-12 h-12 rounded-lg object-cover" />
                    <div>
                      <p className="font-bold text-gray-800 text-sm">{item.name}</p>
                      <p className="text-blue-600 font-bold">${item.price}</p>
                    </div>
                  </div>
                  <button className="text-red-400 hover:text-red-600 p-2">
                    <X size={18} />
                  </button>
                </div>
              ))}
              <div className="pt-4 mt-2 border-t border-dashed">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-gray-500">Total a pagar:</span>
                  <span className="text-2xl font-black text-gray-900">
                    ${profile.cart_items.reduce((acc, item) => acc + item.price, 0).toFixed(2)}
                  </span>
                </div>
                <button
                  onClick={handleCheckout}
                  disabled={isProcessing}
                  className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold shadow-lg hover:bg-blue-700 transition disabled:bg-gray-400 flex justify-center items-center gap-2"
                >
                  {isProcessing ? <><Loader2 size={20} className="animate-spin" /> Procesando...</> : "Finalizar Compra"}
                </button>
              </div>
            </>
          ) : (
            <div className="text-center py-8 text-gray-400">Tu carrito está vacío 🛒</div>
          )}
        </div>
      </Modal>

      {/* Modal de Mis Compras */}
      <Modal
        isOpen={activeModal === 'orders'}
        onClose={() => setActiveModal(null)}
        title="Mis Compras"
      >
        <div className="space-y-3">
            {profile?.purchases_items && profile.purchases_items.length > 0 ? (
                profile.purchases_items.map((item, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 border rounded-2xl">
                        <img src={item.image_url} className="w-10 h-10 rounded-lg object-cover" />
                        <div>
                            <p className="font-bold text-sm text-gray-800">{item.name}</p>
                            <p className="text-xs text-green-600 font-bold">Comprado</p>
                        </div>
                    </div>
                ))
            ) : (
                <p className="text-center text-gray-500 py-4">Aún no has comprado nada. ¡Anímate! 🛍️</p>
            )}
        </div>
      </Modal>

      {/* Modal de Likes */}
      <Modal
        isOpen={activeModal === 'likes'}
        onClose={() => setActiveModal(null)}
        title="Productos Favoritos"
      >
        <p className="text-center text-gray-500 py-4">Aquí verás los productos que te hicieron feliz. ({profile?.liked_items?.length || 0})</p>
      </Modal>

    </div>
  );
};

const MenuOption = ({ icon: Icon, title, count, onClick }) => (
  <button
    onClick={onClick}
    className="w-full flex items-center justify-between p-5 hover:bg-gray-50 transition border-b border-gray-50 last:border-0"
  >
    <div className="flex items-center gap-4">
      <div className="p-3 bg-gray-100 text-gray-600 rounded-xl"><Icon size={22}/></div>
      <div className="text-left">
        <p className="font-bold text-gray-800">{title}</p>
        <p className="text-sm text-blue-600 font-medium">{count} elementos</p>
      </div>
    </div>
    <ChevronRight size={20} className="text-gray-300" />
  </button>
);

