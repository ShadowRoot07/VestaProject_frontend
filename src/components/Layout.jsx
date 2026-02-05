import { Navbar } from './Navbar';

export const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      {/* pt-16 para PC para que el contenido no quede debajo de la navbar superior */}
      {/* pb-20 para Móvil para que el contenido no quede debajo de la navbar inferior */}
      <main className="pt-4 md:pt-20 pb-20 md:pb-4 px-4">
        <div className="max-w-6xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};

