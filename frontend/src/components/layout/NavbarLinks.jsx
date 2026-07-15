import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function NavbarLinks() {
  const { user } = useAuth();

  const linkClass = ({ isActive }) =>
    isActive
      ? "font-medium text-violet-600"
      : "font-medium text-slate-700 transition hover:text-violet-600";

  return (
    <>
      <NavLink to="/" className={linkClass}>
        Inicio
      </NavLink>

      <NavLink to="/catalogo" className={linkClass}>
        Catálogo
      </NavLink>

      {user?.rol === "VENDEDOR" && (
        <NavLink to="/vendedor" className={linkClass}>
          Mi Tienda
        </NavLink>
      )}

      {user?.rol === "ADMIN" && (
        <NavLink to="/admin" className={linkClass}>
          Dashboard
        </NavLink>
      )}
    </>
  );
}

export default NavbarLinks;