import { Link } from "react-router-dom";

function SidebarAdmin() {
  return (
    <aside className="w-64 min-h-screen bg-red-700 text-white p-5">
      
      <h2 className="text-xl font-bold mb-6">
        Admin Panel
      </h2>

      <nav className="space-y-3 text-sm">
        <Link to="/admin" className="block hover:bg-red-600 p-2 rounded">
          Dashboard
        </Link>

        <Link to="/admin/usuarios" className="block hover:bg-red-600 p-2 rounded">
          Usuarios
        </Link>

        <Link to="/admin/productos" className="block hover:bg-red-600 p-2 rounded">
          Productos
        </Link>

        <Link to="/admin/ordenes" className="block hover:bg-red-600 p-2 rounded">
          Órdenes
        </Link>

        <Link to="/admin/reportes" className="block hover:bg-red-600 p-2 rounded">
          Reportes
        </Link>
      </nav>

    </aside>
  );
}

export default SidebarAdmin;