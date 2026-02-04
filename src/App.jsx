function App() {
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="bg-white p-8 rounded-2xl shadow-2xl text-center">
        <h1 className="text-3xl font-bold text-blue-600 mb-4">
          VestaProject 🚀
        </h1>
        <p className="text-gray-600">
          Hola <span className="font-mono font-bold text-orange-500">ShadowRoot07</span>, 
          el frontend con Tailwind está listo.
        </p>
        <button className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
          Confirmar Conexión
        </button>
      </div>
    </div>
  )
}

export default App

