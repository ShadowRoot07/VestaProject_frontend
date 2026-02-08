import { useState, useEffect, useRef, useCallback } from 'react';
import { ProductCard } from '../components/ProductCard';
import api from '../services/api';

export const DashboardUser = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const loaderRef = useRef(null);

  const fetchProducts = useCallback(async () => {
    if (loading || !hasMore) return;
    setLoading(true);

    try {
      const response = await api.get('/products/');
      console.log("Datos de la DB:", response.data);

      if (!response.data || response.data.length === 0) {
        setHasMore(false);
      } else {
        setProducts(response.data);
        setHasMore(false); // Mantener en false hasta implementar paginación real en backend
      }
    } catch (error) {
      console.error("Error al cargar productos:", error.message);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  }, [loading, hasMore]);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMore && !loading) {
        fetchProducts();
      }
    }, { threshold: 0.1 });

    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }

    return () => {
      if (loaderRef.current) observer.unobserve(loaderRef.current);
    };
  }, [fetchProducts, hasMore, loading]);

  return (
    <div className="pb-20 max-w-7xl mx-auto px-4">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-black text-gray-800">
          Vesta <span className="text-blue-600">Feed</span>
        </h2>
        <div className="text-xs font-bold text-gray-400 uppercase tracking-widest bg-gray-100 px-3 py-1 rounded-full">
          {products.length} Productos
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      <div ref={loaderRef} className="py-12 flex flex-col items-center">
        {loading && (
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-blue-600 border-gray-200"></div>
            <p className="mt-4 text-gray-500 font-medium">Buscando tesoros...</p>
          </div>
        )}
        {!hasMore && products.length > 0 && (
          <div className="bg-blue-50 px-6 py-3 rounded-2xl border border-blue-100">
             <p className="text-blue-600 font-bold">🎉 ¡Has llegado al final del feed!</p>
          </div>
        )}
        {!loading && products.length === 0 && (
          <p className="text-gray-400">No hay productos disponibles en este momento.</p>
        )}
      </div>
    </div>
  );
};

