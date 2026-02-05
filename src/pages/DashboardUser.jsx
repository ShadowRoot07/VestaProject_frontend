import { useState, useEffect, useRef, useCallback } from 'react';
import { ProductCard } from '../components/ProductCard';

// Función para simular datos (ShadowRoot07, esto es solo para el test)
const generateMockProducts = (page) => {
  return Array.from({ length: 10 }, (_, i) => ({
    id: `prod-${page}-${i}`,
    name: `Producto Pro ${page}-${i}`,
    price: Math.floor(Math.random() * 500) + 10,
    description: "Diseño ergonómico y alta calidad para VestaProject. Disponible ahora.",
    category: "Electrónica",
    image: `https://picsum.photos/400/300?random=${page * 10 + i}`
  }));
};

export const DashboardUser = () => {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const loaderRef = useRef(null);

  // Usamos useCallback para que la función sea estable en el testing
  const fetchProducts = useCallback(async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    try {
      // Llamada real a tu endpoint de Render
      const response = await api.get(`/products?page=${page}&limit=10`);
      const newProducts = response.data;

      if (newProducts.length === 0) {
        setHasMore(false);
      } else {
        setProducts((prev) => {
          // Filtro de seguridad: Solo agregamos si el ID no existe ya en el estado
          const existingIds = new Set(prev.map(p => p.id));
          const uniqueNewProducts = newProducts.filter(p => !existingIds.has(p.id));
          return [...prev, ...uniqueNewProducts];
        });
        setPage((prev) => prev + 1);
      }
    } catch (error) {
      console.error("Error cargando productos reales:", error);
      setHasMore(false); // Detener el scroll si hay error
    } finally {
      setLoading(false);
    }
  }, [page, loading, hasMore]);



  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      // Si el div del final entra en pantalla Y no estamos cargando...
      if (entries[0].isIntersecting && hasMore && !loading) {
        fetchProducts();
      }
    }, { threshold: 0.1 }); // 0.1 para que detecte apenas asome el pie de página

    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }

    return () => {
      if (loaderRef.current) observer.unobserve(loaderRef.current);
    };
  }, [fetchProducts, hasMore, loading]);

  return (
    <div className="pb-20"> {/* Espacio extra para la Navbar móvil */}
      <h2 className="text-3xl font-black text-gray-800 mb-8 px-2">
        Vesta <span className="text-blue-600">Feed</span>
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {/* Este es el "anzuelo" para el Infinite Scroll */}
      <div ref={loaderRef} className="py-12 flex flex-col items-center">
        {loading && (
          <>
            <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-blue-600 border-gray-200"></div>
            <p className="mt-4 text-gray-500 font-medium">Buscando más tesoros...</p>
          </>
        )}
        {!hasMore && (
          <div className="bg-blue-50 p-4 rounded-xl">
             <p className="text-blue-600 font-bold">🎉 ¡Eso es todo por hoy!</p>
          </div>
        )}
      </div>
    </div>
  );
};

