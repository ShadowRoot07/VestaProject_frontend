import { useState } from 'react';
import { Heart, ShoppingCart, Loader2, Check } from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

export const ProductCard = ({ product }) => {
  const { user } = useAuth();
  
  // Verificamos si el ID del usuario actual está en la lista de favoritos del producto
  // Nota: Esto asume que el backend envía 'favorited_by' como lista de IDs o que manejas la persistencia localmente.
  const [isLiked, setIsLiked] = useState(product.is_liked_by_me || false);
  const [addingToCart, setAddingToCart] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleLike = async (e) => {
    e.preventDefault(); // Evita navegación si la card está dentro de un Link
    try {
      // Optimizamos la UI: cambiamos el estado antes de la petición (Optimistic UI)
      setIsLiked(!isLiked);
      await api.post(`/interactions/like/${product.id}`);
    } catch (error) {
      // Si falla, revertimos el cambio
      setIsLiked(isLiked);
      console.error("Error al procesar el like:", error);
    }
  };

  const handleAddToCart = async (e) => {
    e.preventDefault();
    setAddingToCart(true);
    try {
      await api.post(`/interactions/cart/${product.id}`);
      
      // Feedback visual de éxito
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2000);
    } catch (error) {
      console.error("Error al añadir al carrito:", error);
    } finally {
      setAddingToCart(false);
    }
  };

  return (
    <div className="group bg-white rounded-3xl border border-gray-100 p-3 hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-300 relative">
      
      {/* Imagen con Aspect Ratio controlado */}
      <div className="relative aspect-square overflow-hidden rounded-2xl bg-gray-50">
        <img 
          src={product.image_url || 'https://via.placeholder.com/300'} 
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        
        {/* Botón de Like Flotante */}
        <button 
          onClick={handleLike}
          className={`absolute top-3 right-3 p-2.5 rounded-full shadow-lg backdrop-blur-md transition-all ${
            isLiked 
            ? 'bg-red-500 text-white scale-110' 
            : 'bg-white/80 text-gray-400 hover:text-red-500 hover:scale-110'
          }`}
        >
          <Heart size={18} fill={isLiked ? "currentColor" : "none"} strokeWidth={2.5} />
        </button>
      </div>

      {/* Información del Producto */}
      <div className="mt-4 px-1 pb-2">
        <div className="flex justify-between items-start mb-1">
          <h3 className="font-bold text-gray-800 text-lg leading-tight line-clamp-1">
            {product.name}
          </h3>
        </div>
        
        <p className="text-sm text-gray-500 line-clamp-2 mb-3 h-10">
          {product.description || "Sin descripción disponible."}
        </p>

        <div className="flex items-center justify-between mt-auto">
          <div>
            <span className="text-xs text-blue-600 font-bold uppercase tracking-wider">Precio</span>
            <p className="text-2xl font-black text-gray-900">${product.price}</p>
          </div>

          {/* Botón de Carrito Dinámico */}
          <button 
            onClick={handleAddToCart}
            disabled={addingToCart}
            className={`flex items-center justify-center p-3 rounded-xl transition-all duration-300 ${
              showSuccess 
              ? 'bg-green-500 text-white w-12' 
              : 'bg-gray-900 text-white hover:bg-blue-600 active:scale-95 w-12'
            }`}
            title="Añadir al carrito"
          >
            {addingToCart ? (
              <Loader2 size={20} className="animate-spin" />
            ) : showSuccess ? (
              <Check size={20} />
            ) : (
              <ShoppingCart size={20} />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

