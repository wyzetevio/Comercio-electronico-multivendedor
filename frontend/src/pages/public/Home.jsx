import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { ShoppingBag, Truck, Shield } from "lucide-react";

import ProductoGrid from "../../components/product/ProductoGrid";
import FiltrosCatalogo from "../../components/product/FiltrosCatalogo";
import Spinner from "../../components/ui/Spinner";
import ErrorMessage from "../../components/common/ErrorMessage";
import { obtenerProductos } from "../../services/productoService";
import { obtenerCategorias } from "../../services/categoriaService";
import { obtenerCuponesActivos } from "../../services/cuponService";
import { Tag } from "lucide-react";

function Home() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [cuponDestacado, setCuponDestacado] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [filtros, setFiltros] = useState({
    search: searchParams.get("search") || "",
    categoria: searchParams.get("categoria") || ""
  });

  // Sincronizar URL a estado de filtros
  useEffect(() => {
    setFiltros({
      search: searchParams.get("search") || "",
      categoria: searchParams.get("categoria") || "",
    });
  }, [searchParams]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productosData, categoriasData, cuponesData] = await Promise.all([
          obtenerProductos(),
          obtenerCategorias(),
          obtenerCuponesActivos().catch(() => []) // Catch error if fails to load coupons
        ]);
        setProductos(productosData);
        setCategorias(categoriasData);
        if (cuponesData && cuponesData.length > 0) {
          // Select the first active coupon (or the one with max discount)
          setCuponDestacado(cuponesData[0]);
        }
      } catch {
        setError("Error al cargar el catálogo. Intente de nuevo más tarde.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const productosFiltrados = productos.filter((p) => {
    let matchesSearch = true;
    let matchesCategoria = true;

    if (filtros.search) {
      const term = filtros.search.toLowerCase();
      matchesSearch =
        p.nombre?.toLowerCase().includes(term) ||
        p.descripcion?.toLowerCase().includes(term) ||
        p.categoria?.nombre?.toLowerCase().includes(term);
    }

    if (filtros.categoria) {
      matchesCategoria =
        p.categoria?.nombre?.toLowerCase() === filtros.categoria.toLowerCase();
    }

    return matchesSearch && matchesCategoria;
  });

  if (error) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center">
        <ErrorMessage message={error} />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col">
      {/* BANNER PROMOCIONAL ANIMADO */}
      {cuponDestacado && (
        <div className="relative overflow-hidden bg-gradient-to-r from-fuchsia-600 to-violet-600 text-white shadow-lg">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
          <div className="relative mx-auto flex max-w-7xl items-center justify-center px-4 py-3 sm:px-6 lg:px-8">
            <div className="flex animate-pulse items-center gap-2 rounded-full bg-white/20 px-3 py-1 text-sm font-semibold text-white backdrop-blur-md">
              <Tag className="h-4 w-4" />
              <span>OFERTA ESPECIAL</span>
            </div>
            <p className="ml-4 text-sm font-medium sm:text-base">
              ¡Aprovecha <span className="font-bold text-yellow-300">{cuponDestacado.descuentoPorcentaje}% de descuento</span>! Usa el código:
              <span className="mx-2 inline-block rounded-md bg-white px-2 py-1 text-lg font-black tracking-widest text-violet-700 shadow-sm transition-transform hover:scale-110 cursor-pointer" title="Copia este código y úsalo en el carrito">
                {cuponDestacado.codigo}
              </span>
            </p>
          </div>
        </div>
      )}

      {/* Hero Premium Redesignado */}
      <section className="relative overflow-hidden bg-[#3b0764] text-white py-20 lg:py-28">
        {/* Elementos decorativos de fondo (Mesh Gradient / Blur effect) */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
          <div className="absolute -top-[30%] -left-[10%] w-[50%] h-[100%] rounded-full bg-violet-600/40 blur-[100px]"></div>
          <div className="absolute top-[20%] -right-[10%] w-[50%] h-[100%] rounded-full bg-fuchsia-600/30 blur-[100px]"></div>
        </div>

        <div className="relative z-10 mx-auto max-w-5xl px-6 text-center">
          <h1 className="text-4xl font-extrabold tracking-tight md:text-6xl lg:text-7xl drop-shadow-sm">
            Encuentra lo que amas en <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-300 to-fuchsia-300">
              Pochita Store
            </span>
          </h1>
          <p className="mt-6 mx-auto max-w-2xl text-lg md:text-xl text-violet-100/90 font-medium">
            El marketplace líder para productos exclusivos de múltiples vendedores verificados. Compra con total seguridad y recibe en la puerta de tu casa.
          </p>
          <div className="mt-10 flex justify-center">
            <a
              href="#catalogo"
              className="group relative inline-flex items-center justify-center rounded-full bg-white px-8 py-3.5 text-base font-bold text-violet-900 transition-all duration-200 hover:bg-gray-100 hover:scale-105 hover:shadow-xl hover:shadow-violet-900/20 active:scale-95"
            >
              Comienza a explorar hoy
            </a>
          </div>
        </div>
      </section>

      {/* Beneficios */}
      <section className="bg-white border-b border-gray-100">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-6 py-14 md:grid-cols-3">
          <div className="flex flex-col items-center text-center gap-3 p-4 rounded-2xl hover:bg-violet-50/50 transition-colors duration-300">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-violet-100 text-violet-600">
              <ShoppingBag className="h-7 w-7" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 text-lg">
                Variedad de productos
              </h3>
              <p className="mt-1 text-sm text-gray-500 leading-relaxed">
                Descubre miles de artículos únicos de diferentes categorías y vendedores.
              </p>
            </div>
          </div>
          <div className="flex flex-col items-center text-center gap-3 p-4 rounded-2xl hover:bg-violet-50/50 transition-colors duration-300">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-violet-100 text-violet-600">
              <Truck className="h-7 w-7" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 text-lg">Envío seguro y rápido</h3>
              <p className="mt-1 text-sm text-gray-500 leading-relaxed">
                Seguimiento en tiempo real de tus pedidos hasta la puerta de tu casa.
              </p>
            </div>
          </div>
          <div className="flex flex-col items-center text-center gap-3 p-4 rounded-2xl hover:bg-violet-50/50 transition-colors duration-300">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-violet-100 text-violet-600">
              <Shield className="h-7 w-7" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 text-lg">
                Compra 100% protegida
              </h3>
              <p className="mt-1 text-sm text-gray-500 leading-relaxed">
                Pagos encriptados y garantía de reembolso si algo sale mal.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Categorías */}
      {categorias.length > 0 && (
        <section className="bg-gray-50">
          <div className="mx-auto max-w-7xl px-6 pt-12 pb-4">
            <h2 className="mb-6 text-2xl font-bold text-gray-900 tracking-tight">
              Explorar Categorías
            </h2>
            <div className="flex flex-wrap gap-3">
              {categorias.map((cat) => (
                <Link
                  key={cat.idCategoria}
                  to={`/?categoria=${cat.nombre}`}
                  className="rounded-full border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-600 transition-all duration-300 hover:border-violet-300 hover:bg-violet-50 hover:text-violet-700 hover:shadow-sm"
                >
                  {cat.nombre}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Catálogo */}
      <section id="catalogo" className="mx-auto max-w-7xl px-6 pb-20 pt-8 w-full flex-1 scroll-mt-24">
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
            Productos Destacados
          </h2>
          <FiltrosCatalogo filtros={filtros} setFiltros={setFiltros} />
        </div>

        {loading ? (
          <div className="py-20 flex justify-center">
            <Spinner size="h-12 w-12" />
          </div>
        ) : (
          <div className="space-y-10">
            {/* Solo pasamos los primeros 4 productos */}
            <ProductoGrid productos={productosFiltrados.slice(0, 4)} />

            {/* Botón para ver el catálogo completo */}
            <div className="flex justify-center pt-4">
              <Link
                to="/catalogo"
                className="inline-flex items-center justify-center rounded-full bg-violet-600 px-8 py-3 text-base font-bold text-white transition-all duration-200 hover:bg-violet-700 hover:scale-105 hover:shadow-lg active:scale-95"
              >
                Ver todos los productos
              </Link>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}

export default Home;
