import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import { DashboardUser } from './pages/DashboardUser';
import { DashboardAdmin } from './pages/DashboardAdmin';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Layout } from './components/Layout';
import Register from './pages/Register.jsx';
import { Shop } from './pages/Shop';
import { Profile } from './pages/Profile';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Ruta para Usuarios normales */}
        <Route path="/dashboard" element={
            <ProtectedRoute>
                <Layout>
                    <DashboardUser />
                </Layout>
            </ProtectedRoute>
        } />

        {/* Ruta para el Panel de Administrador (Cambiamos el path para que coincida) */}
        <Route path="/admin-dashboard" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <Layout>
                <DashboardAdmin />
            </Layout>
          </ProtectedRoute>
        } />

        <Route path="/shop" element={
            <ProtectedRoute>
                <Layout><Shop /></Layout>
            </ProtectedRoute>
        } />

        <Route path="/profile" element={
            <ProtectedRoute>
                <Layout><Profile /></Layout>
            </ProtectedRoute>
        } />

        {/* Redirección por defecto */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

