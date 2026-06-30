import { Link } from "react-router-dom";

function SidebarVendedor() {
  return (
    <aside className="w-64 min-h-screen bg-amber-600 text-white p-5">
      
      <h2 className="text-xl font-bold mb-6">
        Panel Vendedor
      </h2>

      <nav className="space-y-3 text-sm">

        <Link to="/vendedor" className="block hover:bg-amber-500 p-2 rounded">
          Dashboard
        </Link>

        <Link to="/vendedor/productos" className="block hover:bg-amber-500 p-2 rounded">
          Mis productos
        </Link>

        <Link to="/vendedor/ventas" className="block hover:bg-amber-500 p-2 rounded">
          Ventas
        </Link>

        <Link to="/vendedor/ordenes" className="block hover:bg-amber-500 p-2 rounded">
          Órdenes
        </Link>

        <Link to="/vendedor/estadisticas" className="block hover:bg-amber-500 p-2 rounded">
          Estadísticas
        </Link>

      </nav>

    </aside>
  );
}

export default SidebarVendedor;