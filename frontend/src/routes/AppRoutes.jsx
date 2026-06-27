import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';

// Componentes temporales (Placeholders) para probar que las rutas y seguridad funcionan
const Home = () => (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-8 text-center">
        <h1 className="text-4xl font-bold text-blue-600">Home - Catálogo Principal</h1>
        <p className="mt-2 text-gray-600">Esta es la página pública donde se listarán los productos.</p>
    </div>
);

const Login = () => (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-8 text-center">
        <h1 className="text-3xl font-bold text-gray-800">Login</h1>
        <p className="mt-2 text-gray-600">Pantalla pública para iniciar sesión.</p>
    </div>
);

const Register = () => (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-8 text-center">
        <h1 className="text-3xl font-bold text-gray-800">Registro</h1>

        <p className="mt-2 text-gray-600">Pantalla pública para registrar nuevos usuarios.</p>
    </div>
);

const UserProfile = () => (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-8 text-center">
        <h1 className="text-3xl font-bold text-green-600">Perfil de Usuario</h1>
        <p className="mt-2 text-gray-600">Ruta protegida para CLIENTE, VENDEDOR y ADMIN.</p>
    </div>
);

const AdminDashboard = () => (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-8 text-center">
        <h1 className="text-3xl font-bold text-red-600">Dashboard Administrador</h1>
        <p className="mt-2 text-gray-600">Ruta súper protegida exclusiva para ADMIN.</p>
    </div>
);

const VendedorDashboard = () => (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-8 text-center">
        <h1 className="text-3xl font-bold text-amber-600">Dashboard Vendedor</h1>
        <p className="mt-2 text-gray-600">Ruta protegida exclusiva para el VENDEDOR.</p>
    </div>
);

const AppRoutes = () => {
    return (
        <BrowserRouter>
            <Routes>
                {/* 1. RUTAS PÚBLICAS */}
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* 2. RUTAS PROTEGIDAS PARA CUALQUIER USUARIO LOGUEADO */}
                <Route element={<ProtectedRoute allowedRoles={['CLIENTE', 'VENDEDOR', 'ADMIN']} />}>
                    <Route path="/perfil" element={<UserProfile />} />
                </Route>

                {/* 3. RUTAS EXCLUSIVAS PARA ADMIN */}
                <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
                    <Route path="/admin" element={<AdminDashboard />} />
                </Route>

                {/* 4. RUTAS EXCLUSIVAS PARA VENDEDOR */}
                <Route element={<ProtectedRoute allowedRoles={['VENDEDOR']} />}>
                    <Route path="/vendedor" element={<VendedorDashboard />} />
                </Route>

                {/* 5. REDIRECCIÓN POR DEFECTO PARA CUALQUIER OTRA RUTA NO VÁLIDA */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </BrowserRouter>
    );
};

export default AppRoutes;
