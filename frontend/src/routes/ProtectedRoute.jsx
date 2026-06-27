import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ allowedRoles }) => {
    const { user, loading } = useAuth();

    // 1. Mientras verifica si hay sesión en el localStorage, mostramos un spinner de carga
    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center bg-gray-100">
                <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
            </div>
        );
    }
    // 2. Si el usuario no existe (no está logueado), lo mandamos de regreso al Login
    if (!user) {
        return <Navigate to="/login" replace />;
    }

    // 3. El filtro clave: verificamos que su "rol" (tal cual viene de tu Usuario.java) esté permitido
    if (allowedRoles && !allowedRoles.includes(user.rol)) {
        // Si es un cliente queriendo entrar al dashboard de admin, lo rebotamos a la página principal
        return <Navigate to="/" replace />;
    }

    // 4. Si pasa todos los filtros de seguridad, renderizamos la vista que solicitó
    return <Outlet />;
};

export default ProtectedRoute;