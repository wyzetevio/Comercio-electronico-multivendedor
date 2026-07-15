import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet, useLocation } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import SidebarAdmin from "../components/layout/SidebarAdmin";
import SidebarVendedor from "../components/layout/SidebarVendedor";

import Home from "../pages/public/Home";
import Login from "../pages/public/Login";
import Registro from "../pages/public/Registro";
import RegistroVendedor from "../pages/public/RegistroVendedor";
import Detalle from "../pages/public/Detalle";
import AdminLogin from "../pages/public/AdminLogin";
import LoginVendedor from "../pages/public/LoginVendedor";
import Catalogo from "../pages/public/Catalogo";


import Carrito from "../pages/customer/Carrito";
import Checkout from "../pages/customer/Checkout";
import MisPedidos from "../pages/customer/MisPedidos";
import Perfil from "../pages/customer/Perfil";

import DashboardVendedor from "../pages/seller/DashboardVendedor";
import DashboardVentas from "../pages/seller/DashboardVentas";
import DashboardProductos from "../pages/seller/DashboardProductos";
import GestionPedidos from "../pages/seller/GestionPedidos";
import LiquidacionesVendedor from "../pages/seller/LiquidacionesVendedor";
import PerfilTienda from "../pages/seller/PerfilTienda";

import DashboardAdmin from "../pages/admin/DashboardAdmin";
import DashboardModeracion from "../pages/admin/DashboardModeracion";
import DashboardLiquidaciones from "../pages/admin/DashboardLiquidaciones";
import GestionCategorias from "../pages/admin/GestionCategorias";
import GestionPedidosAdmin from "../pages/admin/GestionPedidosAdmin";
import GestionClientes from "../pages/admin/GestionClientes";
import GestionCupones from "../pages/admin/GestionCupones";



function PublicLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

function VendedorLayout() {
  return (
    <div className="flex flex-col lg:flex-row relative">
      <SidebarVendedor />
      <main className="flex-1 bg-gray-50 p-4 sm:p-6 min-h-screen w-full min-w-0">
        <Outlet />
      </main>
    </div>
  );
}

function AdminLayout() {
  return (
    <div className="flex flex-col lg:flex-row relative">
      <SidebarAdmin />
      <main className="flex-1 bg-gray-50 p-4 sm:p-6 min-h-screen w-full min-w-0">
        <Outlet />
      </main>
    </div>
  );
}

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        {/* RUTA OCULTA DEL ADMIN */}
        <Route path="/admin-secure/login" element={<AdminLogin />} />

        {/* RUTA DE LOGIN DEL VENDEDOR */}
        <Route path="/vendedor/login" element={<LoginVendedor />} />

        {/* RUTAS PÚBLICAS Y DE CLIENTE CON NAVBAR Y FOOTER */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/catalogo" element={<Catalogo />} />
          <Route path="/producto/:id" element={<Detalle />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Registro />} />
          <Route path="/register/vendedor" element={<RegistroVendedor />} />
          <Route path="/carrito" element={<Carrito />} />

          <Route element={<ProtectedRoute allowedRoles={['CLIENTE', 'VENDEDOR', 'ADMIN']} />}>
            <Route path="/perfil" element={<Perfil />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/mis-pedidos" element={<MisPedidos />} />
          </Route>
        </Route>

        {/* RUTAS EXCLUSIVAS PARA VENDEDOR (SIN FOOTER) */}
        <Route element={<ProtectedRoute allowedRoles={['VENDEDOR']} />}>
          <Route element={<VendedorLayout />}>
            <Route path="/vendedor" element={<DashboardVendedor />} />
            <Route path="/vendedor/ventas" element={<DashboardVentas />} />
            <Route path="/vendedor/productos" element={<DashboardProductos />} />
            <Route path="/vendedor/ordenes" element={<GestionPedidos />} />
            <Route path="/vendedor/liquidaciones" element={<LiquidacionesVendedor />} />
            <Route path="/vendedor/perfil" element={<PerfilTienda />} />
          </Route>
        </Route>

        {/* RUTAS EXCLUSIVAS PARA ADMIN (SIN FOOTER) */}
        <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
          <Route element={<AdminLayout />}>
            <Route path="/admin" element={<DashboardAdmin />} />
            <Route path="/admin/moderacion" element={<DashboardModeracion />} />
            <Route path="/admin/pedidos" element={<GestionPedidosAdmin />} />
            <Route path="/admin/liquidaciones" element={<DashboardLiquidaciones />} />
            <Route path="/admin/categorias" element={<GestionCategorias />} />
            <Route path="/admin/clientes" element={<GestionClientes />} />
            <Route path="/admin/cupones" element={<GestionCupones />} />


          </Route>
        </Route>

        {/* REDIRECCIÓN POR DEFECTO */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
