import { ShoppingCart, Heart } from 'lucide-react';

export const ProductCard = ({ product }) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden border border-gray-100">
      {/* Contenedor de Imagen */}
      <div className="relative h-48 bg-gray-200">
        <img 
          src={product.image || 'https://via.placeholder.com/300'} 
          alt={product.name}
          className="w-full h-full object-cover"
        />
        <button className="absolute top-3 right-3 p-2 bg-white/80 backdrop-blur-sm rounded-full text-gray-600 hover:text-red-500 transition">
          <Heart size={20} />
        </button>
      </div>

      {/* Detalles del Producto */}
      <div className="p-4">
        <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">
          {product.category || 'General'}
        </span>
        <h3 className="text-lg font-bold text-gray-800 truncate">{product.name}</h3>
        <p className="text-gray-500 text-sm mt-1 line-clamp-2">{product.description}</p>
        
        <div className="mt-4 flex items-center justify-between">
          <span className="text-xl font-black text-gray-900">${product.price}</span>
          <button className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2 text-sm font-medium">
            <ShoppingCart size={18} />
            <span>Añadir</span>
          </button>
        </div>
      </div>
    </div>
  );
};

