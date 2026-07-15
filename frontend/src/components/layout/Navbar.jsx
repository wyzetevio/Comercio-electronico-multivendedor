import { useState } from "react";
import { NavLink } from "react-router-dom";
import { Menu, X, Store } from "lucide-react";

import Boton from "../ui/Boton";
import NavbarSearch from "./NavbarSearch";
import NavbarLinks from "./NavbarLinks";
import NavbarUserMenu from "./NavbarUserMenu";
import CartIcon from "../cart/CartIcon";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

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
        className={`fixed top-0 right-0 z-50 h-full w-72 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out md:hidden flex flex-col ${
          menuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Cabecera del Sidebar Móvil */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <span className="text-xl font-bold text-slate-800">Menú</span>
          <Boton variant="ghost" onClick={() => setMenuOpen(false)}>
            <X size={24} />
          </Boton>
        </div>

        {/* Links y opciones apiladas */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <NavbarSearch />
          
          <div className="flex flex-col gap-4 text-lg">
            <NavbarLinks />
          </div>

          <div className="pt-4 border-t border-gray-100">
            <NavbarUserMenu />
          </div>
        </div>
      </div>
    </header>
  );
}

export default Navbar;