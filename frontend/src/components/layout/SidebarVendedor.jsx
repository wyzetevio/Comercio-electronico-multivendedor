import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Package, TrendingUp, ShoppingBag, Wallet, LogOut, Store, User, Menu, X } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

function SidebarVendedor() {
  const location = useLocation();
  const { logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const getLinkClass = (path) => {
    const isActive = location.pathname === path;
    return `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${isActive
        ? "bg-amber-100 text-amber-700 font-semibold shadow-sm"
        : "text-gray-600 hover:bg-amber-50 hover:text-amber-600"
      }`;
  };

  const handleLogout = () => {
    if (window.confirm("¿Estás seguro que deseas cerrar sesión?")) {
      logout();
    }
  };

  return (
    <>
      {/* Botón flotante para abrir en móvil */}
      <button
        className="lg:hidden fixed bottom-6 right-6 z-50 bg-amber-500 text-white p-3 rounded-full shadow-lg"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Overlay oscuro para móvil */}
      {isOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar contenedor */}
      <aside className={`fixed lg:sticky top-0 left-0 z-40 h-screen w-64 bg-white border-r border-gray-200 flex flex-col transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center">
            <span className="text-white font-bold text-sm">V</span>
          </div>
          Portal Vendedor
        </h2>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-2">
        <Link to="/" className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-gray-500 hover:bg-gray-50 hover:text-gray-800 border border-transparent hover:border-gray-200 mb-4">
          <Store size={20} />
          <span>Ver Tienda Pública</span>
        </Link>

        <Link to="/vendedor" className={getLinkClass("/vendedor")}>
          <LayoutDashboard size={20} />
          <span>Dashboard</span>
        </Link>

        <Link to="/vendedor/perfil" className={getLinkClass("/vendedor/perfil")}>
          <User size={20} />
          <span>Perfil de Tienda</span>
        </Link>

        <Link to="/vendedor/productos" className={getLinkClass("/vendedor/productos")}>
          <Package size={20} />
          <span>Mis Productos</span>
        </Link>

        <Link to="/vendedor/ventas" className={getLinkClass("/vendedor/ventas")}>
          <TrendingUp size={20} />
          <span>Ventas</span>
        </Link>

        <Link to="/vendedor/ordenes" className={getLinkClass("/vendedor/ordenes")}>
          <ShoppingBag size={20} />
          <span>Gestión de Órdenes</span>
        </Link>

        <Link to="/vendedor/liquidaciones" className={getLinkClass("/vendedor/liquidaciones")}>
          <Wallet size={20} />
          <span>Mis Liquidaciones</span>
        </Link>
      </nav>

      <div className="p-4 border-t border-gray-100 space-y-3">
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-red-600 hover:bg-red-50 font-semibold transition-colors"
        >
          <LogOut size={18} />
          Cerrar Sesión
        </button>
        <div className="bg-amber-50 rounded-xl p-4 text-center">
          <p className="text-xs text-amber-600 font-medium">Versión 1.0.0</p>
        </div>
      </div>
      </aside>
    </>
  );
}

export default SidebarVendedor;