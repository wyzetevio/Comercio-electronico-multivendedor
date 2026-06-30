import { useEffect, useRef, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { User, LogOut, ChevronDown } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

function NavbarUserMenu() {
  const { user, logout } = useAuth();

  const navigate = useNavigate();

  const [open, setOpen] = useState(false);

  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () =>
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  if (!user) {
    return (
      <div className="flex items-center gap-3">

        <NavLink
          to="/login"
          className="
            rounded-lg
            border
            border-violet-600
            px-4
            py-2
            text-violet-600
            transition
            hover:bg-violet-50
          "
        >
          Iniciar sesión
        </NavLink>

        <NavLink
          to="/register"
          className="
            rounded-lg
            bg-violet-600
            px-4
            py-2
            text-white
            transition
            hover:bg-violet-700
          "
        >
          Registrarse
        </NavLink>

      </div>
    );
  }

  return (
    <div
      className="relative"
      ref={menuRef}
    >
      <button
        onClick={() => setOpen(!open)}
        className="
          flex
          items-center
          gap-2
          rounded-lg
          px-2
          py-2
          transition
          hover:bg-gray-100
        "
      >
        <User
          size={20}
          className="text-violet-600"
        />

        <span className="font-medium">
          {user.nombres}
        </span>

        <ChevronDown size={18} />
      </button>

      {open && (
        <div
          className="
            absolute
            right-0
            mt-3
            w-52
            rounded-xl
            border
            bg-white
            shadow-lg
          "
        >
          <NavLink
            to="/perfil"
            className="block px-4 py-3 hover:bg-gray-100"
            onClick={() => setOpen(false)}
          >
            Mi perfil
          </NavLink>

          <button
            onClick={handleLogout}
            className="
              flex
              w-full
              items-center
              gap-2
              px-4
              py-3
              text-red-600
              hover:bg-gray-100
            "
          >
            <LogOut size={18} />
            Cerrar sesión
          </button>
        </div>
      )}
    </div>
  );
}

export default NavbarUserMenu;