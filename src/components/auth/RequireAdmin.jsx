import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/auth.Context';

// Envuelve cualquier ruta que solo el ADMIN debe poder ver.
// Si no está logueado -> a login. Si está logueado pero no es admin -> al home.
export default function RequireAdmin({ children }) {
  const { user, loading, isAdmin } = useAuth();

  // Mientras restauramos la sesión (ver AuthContext), no decidimos nada todavía
  if (loading) {
    return <div className="text-center py-12">Cargando...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return children;
}