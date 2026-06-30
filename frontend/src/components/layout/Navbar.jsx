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
    <header className="sticky top-0 z-50 bg-white shadow-md">
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

      {/* Contenido menú móvil */}
      {menuOpen && (
        <div className="border-t bg-white px-6 py-4 md:hidden">
          <div className="space-y-4">
            <NavbarSearch mobile />
            <NavbarLinks mobile />
            <NavbarUserMenu mobile />
          </div>
        </div>
      )}
    </header>
  );
}

export default Navbar;