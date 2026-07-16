import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Menu, X, Store, Home, LayoutGrid, ShoppingCart, Package, User, LogOut } from "lucide-react";

import Boton from "../ui/Boton";
import NavbarSearch from "./NavbarSearch";
import NavbarLinks from "./NavbarLinks";
import NavbarUserMenu from "./NavbarUserMenu";
import CartIcon from "../cart/CartIcon";

import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const { getCartCount } = useCart();
  const navigate = useNavigate();
  const cartCount = getCartCount();

  const handleLogout = () => {
    if (window.confirm("¿Estás seguro que deseas cerrar sesión?")) {
      logout();
      setMenuOpen(false);
      navigate("/", { replace: true });
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white shadow-md print:hidden">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">

        {/* Logo */}
        <NavLink
          to="/"
          className="flex items-center gap-2"
        >
          <Store
            size={30}
            className="text-violet-600"
          />

          <span className="text-xl font-bold text-slate-800">
            Pochita Store
          </span>
        </NavLink>

        {/* Buscador */}
        <NavbarSearch />

        {/* Navegación escritorio */}
        <div className="hidden items-center gap-6 md:flex">
          <NavbarLinks />
          <CartIcon />
          <NavbarUserMenu />
        </div>

        {/* Menú móvil */}
        <Boton
          variant="ghost"
          className="md:hidden"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
        >
          {menuOpen ? <X size={28} /> : <Menu size={28} />}
        </Boton>

      </div>

      {/* Contenido menú móvil (Sidebar) */}
      {/* Overlay oscuro */}
      {menuOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 md:hidden" 
          onClick={() => setMenuOpen(false)}
        />
      )}
      
      {/* Drawer */}
      <div 
        className={`fixed top-0 right-0 z-50 h-full w-80 max-w-[85vw] bg-white shadow-2xl transform transition-transform duration-300 ease-in-out md:hidden flex flex-col ${
          menuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Cabecera del Sidebar Móvil */}
        <div className="flex items-center justify-between p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-600 text-white font-bold text-xl">
              P
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-900 leading-tight">Pochita Store</h2>
              <p className="text-xs text-gray-500">Tu tienda de tecnología</p>
            </div>
          </div>
          <button onClick={() => setMenuOpen(false)} className="text-gray-400 hover:text-gray-600">
            <X size={24} />
          </button>
        </div>

        {/* Tarjeta de Usuario */}
        <div className="px-6 mb-4">
          <div className="flex items-center gap-3 rounded-2xl border border-gray-100 p-3 shadow-sm cursor-pointer hover:bg-gray-50 transition-colors"
               onClick={() => {
                 setMenuOpen(false);
                 if (user) {
                   navigate("/perfil");
                 } else {
                   navigate("/login");
                 }
               }}
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-violet-50 text-violet-600">
              <User size={20} />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-gray-900">{user ? `Hola, ${user.nombres.split(' ')[0]}` : "Hola, Visitante"}</h3>
              <p className="text-xs text-violet-600">{user ? "Ver perfil" : "Inicia sesión o regístrate"}</p>
            </div>
            <span className="text-gray-400">›</span>
          </div>
        </div>

        {/* Links */}
        <div className="flex-1 overflow-y-auto px-4 py-2 space-y-1">
          <NavLink
            to="/"
            onClick={() => setMenuOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
                isActive ? "bg-violet-50 text-violet-600" : "text-gray-700 hover:bg-gray-50"
              }`
            }
          >
            <Home size={20} />
            Inicio
          </NavLink>

          <NavLink
            to="/catalogo"
            onClick={() => setMenuOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
                isActive ? "bg-violet-50 text-violet-600" : "text-gray-700 hover:bg-gray-50"
              }`
            }
          >
            <LayoutGrid size={20} />
            Catálogo
          </NavLink>

          <NavLink
            to="/carrito"
            onClick={() => setMenuOpen(false)}
            className={({ isActive }) =>
              `flex items-center justify-between rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
                isActive ? "bg-violet-50 text-violet-600" : "text-gray-700 hover:bg-gray-50"
              }`
            }
          >
            <div className="flex items-center gap-3">
              <ShoppingCart size={20} />
              Carrito
            </div>
            {cartCount > 0 && (
              <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-violet-600 px-1.5 text-xs font-semibold text-white">
                {cartCount > 99 ? "99+" : cartCount}
              </span>
            )}
          </NavLink>

          {user && user.rol === "CLIENTE" && (
            <NavLink
              to="/mis-pedidos"
              onClick={() => setMenuOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
                  isActive ? "bg-violet-50 text-violet-600" : "text-gray-700 hover:bg-gray-50"
                }`
              }
            >
              <Package size={20} />
              Mis pedidos
            </NavLink>
          )}

          {user && (
            <NavLink
              to="/perfil"
              onClick={() => setMenuOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
                  isActive ? "bg-violet-50 text-violet-600" : "text-gray-700 hover:bg-gray-50"
                }`
              }
            >
              <User size={20} />
              Mi cuenta
            </NavLink>
          )}
        </div>

        {/* Footer del Drawer */}
        {user && (
          <div className="border-t border-gray-100 p-4">
            <button
              onClick={handleLogout}
              className="flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
            >
              <LogOut size={20} />
              Cerrar sesión
            </button>
          </div>
        )}
      </div>
    </header>
  );
}

export default Navbar;