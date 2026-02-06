import { useState, useEffect } from 'react';
import { Heart, ShoppingCart, Check, Loader2 } from 'lucide-react';
import api from '../services/api';

export const ProductCard = ({ product }) => {
  // Usamos los valores que vienen del backend como estado inicial
  const [isLiked, setIsLiked] = useState(product.is_liked_by_me);
  const [isInCart, setIsInCart] = useState(product.is_in_cart);
  const [loadingCart, setLoadingCart] = useState(false);

  // Efecto para sincronizar si la prop 'product' cambia
  useEffect(() => {
    setIsLiked(product.is_liked_by_me);
    setIsInCart(product.is_in_cart);
  }, [product]);

  const handleLike = async (e) => {
    e.preventDefault();
    const previousState = isLiked;
    setIsLiked(!isLiked); // Optimistic UI
    try {
      // Usamos el nuevo endpoint /{id}/like
      await api.post(`/products/${product.id}/like`);
    } catch (error) {
      setIsLiked(previousState); // Revertimos si falla
    }
  };

  const handleAddToCart = async (e) => {
    e.preventDefault();
    if (isInCart) return; // Opcional: evitar duplicados visualmente
    setLoadingCart(true);
    try {
      await api.post(`/interactions/cart/${product.id}`);
      setIsInCart(true);
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingCart(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl border p-4 group relative">
      <div className="relative overflow-hidden rounded-2xl aspect-square">
        <img src={product.image_url} alt={product.name} className="object-cover w-full h-full" />
        <button 
          onClick={handleLike}
          className={`absolute top-2 right-2 p-2 rounded-full shadow-md transition ${
            isLiked ? 'bg-red-500 text-white' : 'bg-white/80 text-gray-500 hover:text-red-500'
          }`}
        >
          <Heart size={18} fill={isLiked ? "currentColor" : "none"} />
        </button>
      </div>

      <div className="mt-3">
        <h3 className="font-bold text-gray-800 line-clamp-1">{product.name}</h3>
        <div className="flex justify-between items-center mt-2">
          <p className="text-xl font-black text-blue-600">${product.price}</p>
          
          <button 
            onClick={handleAddToCart}
            disabled={loadingCart}
            className={`p-2 rounded-xl transition-all ${
              isInCart 
              ? 'bg-green-100 text-green-600' 
              : 'bg-gray-900 text-white hover:bg-blue-600'
            }`}
          >
            {loadingCart ? <Loader2 size={20} className="animate-spin" /> : 
             isInCart ? <Check size={20} /> : <ShoppingCart size={20} />}
          </button>
        </div>
      </div>
    </div>
  );
};

