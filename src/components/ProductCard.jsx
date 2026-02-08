import { useState, useEffect } from 'react';
import { Heart, ShoppingCart, Check, Loader2, MessageCircle, Send } from 'lucide-react';
import api from '../services/api';

export const ProductCard = ({ product }) => {
  const [isLiked, setIsLiked] = useState(product.is_liked_by_me);
  const [isInCart, setIsInCart] = useState(product.is_in_cart);
  const [loadingCart, setLoadingCart] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState("");

  const handleLike = async (e) => {
    e.preventDefault();
    const prev = isLiked;
    setIsLiked(!isLiked);
    try { await api.post(`/products/${product.id}/like`); } 
    catch (error) { setIsLiked(prev); }
  };

  const handleAddToCart = async (e) => {
    e.preventDefault();
    if (isInCart) return;
    setLoadingCart(true);
    try {
      await api.post(`/interactions/cart/${product.id}`);
      setIsInCart(true);
    } catch (error) { console.error(error); } 
    finally { setLoadingCart(false); }
  };

  const handleSendComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    try {
      await api.post(`/interactions/comment/${product.id}`, { content: commentText });
      alert("Comentario enviado");
      setCommentText("");
      setShowComments(false);
    } catch (error) { alert("Error al comentar"); }
  };

  return (
    <div className="bg-white rounded-3xl border p-4 group relative shadow-sm hover:shadow-md transition">
      <div className="relative overflow-hidden rounded-2xl aspect-square">
        <img src={product.image_url} alt={product.name} className="object-cover w-full h-full" />
        <button onClick={handleLike} className={`absolute top-2 right-2 p-2 rounded-full shadow-md transition ${isLiked ? 'bg-red-500 text-white' : 'bg-white/80 text-gray-500'}`}>
          <Heart size={18} fill={isLiked ? "currentColor" : "none"} />
        </button>
      </div>

      <div className="mt-3">
        <h3 className="font-bold text-gray-800 line-clamp-1">{product.title || product.name}</h3>
        <div className="flex justify-between items-center mt-2">
          <p className="text-xl font-black text-blue-600">${product.price}</p>
          <div className="flex gap-2">
            <button onClick={() => setShowComments(!showComments)} className="p-2 rounded-xl bg-gray-100 text-gray-600 hover:bg-gray-200">
              <MessageCircle size={20} />
            </button>
            <button onClick={handleAddToCart} disabled={loadingCart} className={`p-2 rounded-xl transition-all ${isInCart ? 'bg-green-100 text-green-600' : 'bg-gray-900 text-white hover:bg-blue-600'}`}>
              {loadingCart ? <Loader2 size={20} className="animate-spin" /> : isInCart ? <Check size={20} /> : <ShoppingCart size={20} />}
            </button>
          </div>
        </div>

        {showComments && (
          <form onSubmit={handleSendComment} className="mt-3 flex gap-2 animate-in fade-in zoom-in duration-200">
            <input 
              type="text" value={commentText} onChange={(e) => setCommentText(e.target.value)}
              placeholder="Escribe un comentario..." className="text-xs p-2 border rounded-lg flex-1 outline-none focus:border-blue-400"
            />
            <button type="submit" className="bg-blue-600 text-white p-2 rounded-lg"><Send size={14}/></button>
          </form>
        )}
      </div>
    </div>
  );
};

