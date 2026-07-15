import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, ShieldCheck, CreditCard, Tags, LogOut, Store, Users, Ticket, PackageSearch, Menu, X } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

function SidebarAdmin() {
  const location = useLocation();
  const { logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const getLinkClass = (path) => {
    const isActive = location.pathname === path;
    return `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${isActive
      ? "bg-red-50 text-red-700 font-semibold shadow-sm"
      : "text-gray-600 hover:bg-gray-50 hover:text-red-600"
      }`;
  };

  const handleLogout = () => {
    if (window.confirm("¿Estás seguro que deseas cerrar sesión del portal administrativo?")) {
      logout();
    }
  };

  return (
    <>
      {/* Botón flotante para abrir en móvil */}
      <button
        className="lg:hidden fixed bottom-6 right-6 z-50 bg-red-600 text-white p-3 rounded-full shadow-lg"
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
          <div className="w-8 h-8 rounded-lg bg-red-600 flex items-center justify-center">
            <span className="text-white font-bold text-sm">A</span>
          </div>
          Admin Panel
        </h2>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-2">
        <Link to="/" className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-gray-500 hover:bg-gray-50 hover:text-gray-800 border border-transparent hover:border-gray-200 mb-4">
          <Store size={20} />
          <span>Ver Tienda Pública</span>
        </Link>

        <Link to="/admin" className={getLinkClass("/admin")}>
          <LayoutDashboard size={20} />
          <span>Dashboard</span>
        </Link>

        <Link to="/admin/clientes" className={getLinkClass("/admin/clientes")}>
          <Users size={20} />
          <span>Clientes</span>
        </Link>

        <Link to="/admin/cupones" className={getLinkClass("/admin/cupones")}>
          <Ticket size={20} />
          <span>Cupones</span>
        </Link>


        <Link to="/admin/moderacion" className={getLinkClass("/admin/moderacion")}>
          <ShieldCheck size={20} />
          <span>Moderación</span>
        </Link>

        <Link to="/admin/pedidos" className={getLinkClass("/admin/pedidos")}>
          <PackageSearch size={20} />
          <span>Historial de Pedidos</span>
        </Link>

        <Link to="/admin/liquidaciones" className={getLinkClass("/admin/liquidaciones")}>
          <CreditCard size={20} />
          <span>Liquidaciones</span>
        </Link>

        <Link to="/admin/categorias" className={getLinkClass("/admin/categorias")}>
          <Tags size={20} />
          <span>Categorías</span>
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
        <div className="bg-red-50 rounded-xl p-4 text-center">
          <p className="text-xs text-red-600 font-medium">Super Administrador</p>
        </div>
      </div>
      </aside>
    </>
  );
}

export default SidebarAdmin;