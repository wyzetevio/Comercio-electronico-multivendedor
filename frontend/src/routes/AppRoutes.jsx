import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import Navbar from "../components/layout/Navbar";
import SidebarAdmin from "../components/layout/SidebarAdmin";
import SidebarVendedor from "../components/layout/SidebarVendedor";

import Home from "../pages/public/Home";
import Login from "../pages/public/Login";
import Registro from "../pages/public/Registro";
import RegistroVendedor from "../pages/public/RegistroVendedor";
import Detalle from "../pages/public/Detalle";

import Carrito from "../pages/customer/Carrito";
import Checkout from "../pages/customer/Checkout";
import MisPedidos from "../pages/customer/MisPedidos";
import Perfil from "../pages/customer/Perfil";

import DashboardVendedor from "../pages/seller/DashboardVendedor";
import DashboardVentas from "../pages/seller/DashboardVentas";
import DashboardProductos from "../pages/seller/DashboardProductos";

import DashboardAdmin from "../pages/admin/DashboardAdmin";
import DashboardModeracion from "../pages/admin/DashboardModeracion";
import DashboardLiquidaciones from "../pages/admin/DashboardLiquidaciones";

function VendedorLayout() {
  return (
    <div className="flex">
      <SidebarVendedor />
      <main className="flex-1 bg-gray-50 p-6 min-h-screen">
        <Outlet />
      </main>
    </div>
  );
}

function AdminLayout() {
  return (
    <div className="flex">
      <SidebarAdmin />
      <main className="flex-1 bg-gray-50 p-6 min-h-screen">
        <Outlet />
      </main>
    </div>
  );
}

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        {/* RUTAS PÚBLICAS */}
        <Route path="/" element={<Home />} />
        <Route path="/producto/:id" element={<Detalle />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Registro />} />
        <Route path="/register/vendedor" element={<RegistroVendedor />} />
        <Route path="/carrito" element={<Carrito />} />

        {/* RUTAS PROTEGIDAS PARA CLIENTE, VENDEDOR Y ADMIN */}
        <Route element={<ProtectedRoute allowedRoles={['CLIENTE', 'VENDEDOR', 'ADMIN']} />}>
          <Route path="/perfil" element={<Perfil />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/mis-pedidos" element={<MisPedidos />} />
        </Route>

        {/* RUTAS EXCLUSIVAS PARA VENDEDOR */}
        <Route element={<ProtectedRoute allowedRoles={['VENDEDOR']} />}>
          <Route element={<VendedorLayout />}>
            <Route path="/vendedor" element={<DashboardVendedor />} />
            <Route path="/vendedor/ventas" element={<DashboardVentas />} />
            <Route path="/vendedor/productos" element={<DashboardProductos />} />
          </Route>
        </Route>

        {/* RUTAS EXCLUSIVAS PARA ADMIN */}
        <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
          <Route element={<AdminLayout />}>
            <Route path="/admin" element={<DashboardAdmin />} />
            <Route path="/admin/moderacion" element={<DashboardModeracion />} />
            <Route path="/admin/liquidaciones" element={<DashboardLiquidaciones />} />
          </Route>
        </Route>

        {/* REDIRECCIÓN POR DEFECTO */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
