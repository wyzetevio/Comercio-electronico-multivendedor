import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import Navbar from "../components/layout/Navbar";
import ProductoCard from "../components/product/ProductoCard";
import ProductoGrid from "../components/product/ProductoGrid";
import CartItem from "../components/cart/CartItem";
import CartSummary from "../components/cart/CartSummary";

const carritoMock = [
    {
        idCarritoItem: 1,
        idProducto: 1,
        nombreProducto: "Zapatilla Nike Air",
        precioUnitario: 120,
        cantidad: 2,
        imagen: "https://images.unsplash.com/photo-1606813902916-0c4b3c8d4c5a"
    },
    {
        idCarritoItem: 2,
        idProducto: 2,
        nombreProducto: "Polo Adidas",
        precioUnitario: 80,
        cantidad: 1,
        imagen: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab"
    }
];

const productoMock = {
    idProducto: 1,
    nombre: "Zapatilla Nike Air",
    descripcion: "Zapatilla deportiva",
    precio: 120,
    stock: 5,
    categoria: { nombre: "Calzado" },
    tienda: { nombreTienda: "Nike Store" },
    imagenes: ["https://images.unsplash.com/photo-1606813902916-0c4b3c8d4c5a"]
};

const productosMock = [
    productoMock
];

// Componentes temporales (Placeholders) para probar que las rutas y seguridad funcionan
const Home = () => (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-8 text-center">
        <h1 className="text-4xl font-bold text-blue-600">Home - Catálogo Principal</h1>
        <p className="mt-2 text-gray-600 mb-6">
            Probando ProductCard
        </p>

        <ProductoGrid
            productos={productosMock}
            loading={false}
            error={null}
        />
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

const Carrito = () => {
    return (
        <div className="min-h-screen bg-gray-50 p-8">
            
            <h1 className="text-3xl font-bold text-violet-600 mb-6">
                Carrito de Compras
            </h1>

            <div className="space-y-4">
                {carritoMock.map((item) => (
                    <CartItem key={item.idCarritoItem} item={item} />
                ))}
            </div>
            <div className="mt-6">
                <CartSummary />
            </div>
            

        </div>
    );
};

const AppRoutes = () => {
    return (
        <BrowserRouter>
        <Navbar />
            <Routes>
                {/* 1. RUTAS PÚBLICAS */}
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/carrito" element={<Carrito />} />

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
