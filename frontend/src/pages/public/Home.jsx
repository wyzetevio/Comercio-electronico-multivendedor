import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ShoppingBag, Truck, Shield } from "lucide-react";

import ProductoGrid from "../../components/product/ProductoGrid";
import FiltrosCatalogo from "../../components/product/FiltrosCatalogo";
import Spinner from "../../components/ui/Spinner";
import ErrorMessage from "../../components/common/ErrorMessage";
import { obtenerProductos } from "../../services/productoService";
import { obtenerCategorias } from "../../services/categoriaService";

function Home() {
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filtros, setFiltros] = useState({ search: "" });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productosData, categoriasData] = await Promise.all([
          obtenerProductos(),
          obtenerCategorias(),
        ]);
        setProductos(productosData);
        setCategorias(categoriasData);
      } catch {
        setError("Error al cargar el catálogo. Intente de nuevo más tarde.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const productosFiltrados = productos.filter((p) => {
    if (!filtros.search) return true;
    const term = filtros.search.toLowerCase();
    return (
      p.nombre?.toLowerCase().includes(term) ||
      p.descripcion?.toLowerCase().includes(term) ||
      p.categoria?.nombre?.toLowerCase().includes(term)
    );
  });

  if (error) {
    return (
      <main className="min-h-screen bg-gray-50">
        <ErrorMessage message={error} />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="bg-gradient-to-r from-violet-600 to-purple-700 text-white">
        <div className="mx-auto max-w-7xl px-6 py-16 text-center">
          <h1 className="text-4xl font-bold md:text-5xl">
            Bienvenido a Pochita Store
          </h1>
          <p className="mt-4 text-lg text-violet-100">
            Encuentra los mejores productos de múltiples vendedores en un solo
            lugar
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Link
              to="/register"
              className="rounded-lg bg-white px-6 py-3 font-medium text-violet-700 transition hover:bg-violet-50"
            >
              Crear cuenta
            </Link>
            <Link
              to="/register/vendedor"
              className="rounded-lg border border-white px-6 py-3 font-medium text-white transition hover:bg-white/10"
            >
              Vender con nosotros
            </Link>
          </div>
        </div>
      </section>

      {/* Beneficios */}
      <section className="border-b bg-white">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-6 py-12 md:grid-cols-3">
          <div className="flex items-center gap-4">
            <ShoppingBag className="h-8 w-8 text-violet-600" />
            <div>
              <h3 className="font-semibold text-gray-800">
                Variedad de productos
              </h3>
              <p className="text-sm text-gray-500">
                Miles de productos de diferentes categorías
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Truck className="h-8 w-8 text-violet-600" />
            <div>
              <h3 className="font-semibold text-gray-800">Envío seguro</h3>
              <p className="text-sm text-gray-500">
                Seguimiento en tiempo real de tus pedidos
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Shield className="h-8 w-8 text-violet-600" />
            <div>
              <h3 className="font-semibold text-gray-800">
                Compra protegida
              </h3>
              <p className="text-sm text-gray-500">
                Pago seguro y protección al comprador
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Categorías */}
      {categorias.length > 0 && (
        <section className="border-b bg-white">
          <div className="mx-auto max-w-7xl px-6 py-8">
            <h2 className="mb-4 text-xl font-bold text-gray-800">
              Categorías
            </h2>
            <div className="flex flex-wrap gap-3">
              {categorias.map((cat) => (
                <Link
                  key={cat.idCategoria}
                  to={`/?categoria=${cat.nombre}`}
                  className="rounded-full border border-gray-200 bg-gray-50 px-4 py-2 text-sm text-gray-600 transition hover:border-violet-300 hover:text-violet-700"
                >
                  {cat.nombre}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Catálogo */}
      <section className="mx-auto max-w-7xl px-6 py-8">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-800">
            Productos destacados
          </h2>
          <FiltrosCatalogo filtros={filtros} setFiltros={setFiltros} />
        </div>

        {loading ? (
          <Spinner size="h-12 w-12" />
        ) : (
          <ProductoGrid productos={productosFiltrados} />
        )}
      </section>
    </main>
  );
}

export default Home;
