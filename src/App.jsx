import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import { DashboardUser } from './pages/DashboardUser';
import { DashboardAdmin } from './pages/DashboardAdmin';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Layout } from './components/Layout';
import Register from './pages/Register.jsx';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Ruta para Usuarios y Admins */}
        <Route path="/dashboard" element={
            <ProtectedRoute> {/* Quita el allowedRoles por ahora */}
                <Layout>
                    <DashboardUser />
                </Layout>
            </ProtectedRoute>
        } />  

        {/* Ruta SOLO para Admins */}
        <Route path="/admin" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <Layout>
                <DashboardAdmin />
            </Layout>
          </ProtectedRoute>
        } />

        {/* Redirección por defecto: Si no existe la ruta, al login */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

