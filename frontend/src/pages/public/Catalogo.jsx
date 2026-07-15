import { useState, useEffect, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { LayoutGrid, List, Search, Star, Heart, Check, X, Filter, ChevronLeft, ChevronRight, Truck, ShieldCheck, RefreshCw, Headphones } from 'lucide-react';
import { obtenerProductos } from '../../services/productoService';
import api from '../../utils/api';
import { useCart } from '../../hooks/useCart';
import Boton from '../../components/ui/Boton';
import Input from '../../components/ui/Input';

function Catalogo() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialSearch = searchParams.get('search') || '';

  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);

  // Estados para filtros
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [selectedCategoria, setSelectedCategoria] = useState('Todas');
  const [selectedMarcas, setSelectedMarcas] = useState([]);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [sortBy, setSortBy] = useState('relevante');
  const [viewMode, setViewMode] = useState('grid');

  // Nuevos estados para los toggles y paginación
  const [soloEnvioGratis, setSoloEnvioGratis] = useState(false);
  const [soloEnStock, setSoloEnStock] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  const { addToCart } = useCart();

  useEffect(() => {
    setSearchTerm(searchParams.get('search') || '');
  }, [searchParams]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [prodsRes, catsRes] = await Promise.all([
          obtenerProductos(),
          api.get('/categorias').then(res => res.data)
        ]);

        // Filtramos solo los activos (la propiedad en producto es 'estado')
        setProductos(prodsRes.filter(p => p.estado));
        setCategorias([{ nombre: 'Todas', idCategoria: 0 }, ...catsRes]);
      } catch (err) {
        console.error("Error cargando catálogo", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Extraer marcas únicas
  const marcasDisponibles = useMemo(() => {
    const m = new Set(productos.filter(p => p.marca).map(p => p.marca));
    return Array.from(m).filter(Boolean); // Remover nulls
  }, [productos]);

  const handleMarcaChange = (marca) => {
    setSelectedMarcas(prev =>
      prev.includes(marca) ? prev.filter(m => m !== marca) : [...prev, marca]
    );
    setCurrentPage(1); // Reset page on filter
  };

  // Filtrado y Ordenamiento
  const productosFiltrados = useMemo(() => {
    let result = [...productos];

    if (searchTerm) {
      const lowerSearch = searchTerm.toLowerCase();
      result = result.filter(p =>
        p.nombre.toLowerCase().includes(lowerSearch) ||
        (p.descripcion && p.descripcion.toLowerCase().includes(lowerSearch)) ||
        (p.marca && p.marca.toLowerCase().includes(lowerSearch))
      );
    }

    if (selectedCategoria !== 'Todas') {
      result = result.filter(p => p.categoria?.nombre === selectedCategoria);
    }

    if (selectedMarcas.length > 0) {
      result = result.filter(p => p.marca && selectedMarcas.includes(p.marca));
    }

    if (minPrice !== '') result = result.filter(p => p.precio >= parseFloat(minPrice));
    if (maxPrice !== '') result = result.filter(p => p.precio <= parseFloat(maxPrice));

    if (soloEnStock) result = result.filter(p => p.stock > 0);

    // El filtro de envío gratis puede ser simulado por precio > 2000 por ahora
    if (soloEnvioGratis) result = result.filter(p => p.precio > 2000);

    switch (sortBy) {
      case 'precioAsc': result.sort((a, b) => a.precio - b.precio); break;
      case 'precioDesc': result.sort((a, b) => b.precio - a.precio); break;
      default: break;
    }

    return result;
  }, [productos, searchTerm, selectedCategoria, selectedMarcas, minPrice, maxPrice, sortBy, soloEnvioGratis, soloEnStock]);

  // Paginación
  const totalPages = Math.ceil(productosFiltrados.length / itemsPerPage);
  const currentProductos = productosFiltrados.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const updateUrlParams = (newSearchTerm) => {
    if (newSearchTerm) setSearchParams({ search: newSearchTerm });
    else setSearchParams({});
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setSelectedCategoria('Todas');
    setSelectedMarcas([]);
    setMinPrice('');
    setMaxPrice('');
    setSortBy('relevante');
    setSoloEnvioGratis(false);
    setSoloEnStock(false);
    setCurrentPage(1);
  };

  // Cuenta filtros activos
  const activeFiltersCount = (selectedCategoria !== 'Todas' ? 1 : 0) +
    selectedMarcas.length + (minPrice ? 1 : 0) + (maxPrice ? 1 : 0) +
    (soloEnvioGratis ? 1 : 0) + (soloEnStock ? 1 : 0);

  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      {/* Navbar secundario (Píldoras de Categorías) */}
      <div className="bg-white border-b border-gray-200 sticky top-20 z-40">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center gap-4 overflow-x-auto no-scrollbar">
          {categorias.map(cat => (
            <button
              key={cat.idCategoria || cat.nombre}
              onClick={() => setSelectedCategoria(cat.nombre)}
              className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-colors ${selectedCategoria === cat.nombre
                ? 'bg-violet-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
            >
              {cat.nombre}
            </button>
          ))}
        </div>
      </div>

      {/* Banner Promocional */}
      <div className="bg-gradient-to-r from-violet-600 to-fuchsia-600">
        <div className="max-w-7xl mx-auto px-6 py-10 flex flex-col sm:flex-row items-center justify-between">
          <div>
            <div className="text-yellow-300 font-bold text-sm mb-2 flex items-center gap-1">
              <span>⚡</span> OFERTA ESPECIAL
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-2">
              Hasta 30% OFF en Tecnología
            </h1>
            <p className="text-violet-100">Por tiempo limitado · Envío gratis en pedidos sobre S/ 199</p>
          </div>
          <button
            onClick={() => {
              setSelectedCategoria('Tecnología');
              window.scrollTo({ top: 300, behavior: 'smooth' });
            }}
            className="mt-6 sm:mt-0 bg-white text-violet-700 hover:bg-violet-50 font-bold px-8 py-3 rounded-full shadow-lg transition-all hover:scale-105 active:scale-95"
          >
            Ver ofertas
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 pt-6 flex gap-8">

        {/* SIDEBAR DE FILTROS (Izquierda) */}
        <aside className="w-64 hidden lg:block shrink-0">
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 sticky top-40">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold flex items-center gap-2 text-gray-800">
                <Filter size={20} className="text-violet-500" /> Filtros
              </h2>
              {(selectedCategoria !== 'Todas' || selectedMarcas.length > 0 || minPrice || maxPrice) && (
                <button onClick={clearFilters} className="text-xs text-violet-600 hover:underline">Limpiar</button>
              )}
            </div>

            {/* Filtro por Categorías */}
            <div className="mb-8">
              <h3 className="font-bold text-sm text-gray-800 mb-4 uppercase tracking-wider">Categorías</h3>
              <ul className="space-y-2">
                {categorias.map(cat => {
                  const count = cat.nombre === 'Todas' ? productos.length : productos.filter(p => p.categoria?.nombre === cat.nombre).length;
                  return (
                    <li key={cat.nombre}>
                      <button
                        onClick={() => setSelectedCategoria(cat.nombre)}
                        className={`w-full flex items-center justify-between text-sm py-1 transition-colors ${selectedCategoria === cat.nombre ? 'text-violet-600 font-semibold' : 'text-gray-600 hover:text-gray-900'
                          }`}
                      >
                        {cat.nombre}
                        <span className={`text-xs px-2 py-0.5 rounded-full ${selectedCategoria === cat.nombre ? 'bg-violet-100 text-violet-700' : 'bg-gray-100 text-gray-500'
                          }`}>
                          {count}
                        </span>
                      </button>
                    </li>
                  )
                })}
              </ul>
            </div>

            {/* Filtro por Precio */}
            <div className="mb-8">
              <h3 className="font-bold text-sm text-gray-800 mb-4 uppercase tracking-wider">Precio</h3>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  placeholder="Mín"
                  value={minPrice}
                  onChange={e => setMinPrice(e.target.value)}
                  className="text-sm px-2 py-1.5"
                />
                <span className="text-gray-400">-</span>
                <Input
                  type="number"
                  placeholder="Máx"
                  value={maxPrice}
                  onChange={e => setMaxPrice(e.target.value)}
                  className="text-sm px-2 py-1.5"
                />
              </div>
            </div>

            {/* Filtro por Marca */}
            {marcasDisponibles.length > 0 && (
              <div>
                <h3 className="font-bold text-sm text-gray-800 mb-4 uppercase tracking-wider">Marca</h3>
                <ul className="space-y-2 max-h-48 overflow-y-auto custom-scrollbar">
                  {marcasDisponibles.map(marca => (
                    <li key={marca}>
                      <label className="flex items-center gap-3 cursor-pointer group">
                        <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${selectedMarcas.includes(marca) ? 'bg-violet-600 border-violet-600' : 'border-gray-300 group-hover:border-violet-400'
                          }`}>
                          {selectedMarcas.includes(marca) && <Check size={12} className="text-white" />}
                        </div>
                        <span className={`text-sm ${selectedMarcas.includes(marca) ? 'text-gray-900 font-medium' : 'text-gray-600'}`}>
                          {marca}
                        </span>
                      </label>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {/* Filtros Adicionales (Toggles) */}
            <div className="mt-8 pt-6 border-t border-gray-100">
              <h3 className="font-bold text-sm text-gray-800 mb-4 uppercase tracking-wider">Más Filtros</h3>
              <div className="space-y-4">
                <label className="flex items-center justify-between cursor-pointer">
                  <span className="text-sm text-gray-600">Solo envío gratis</span>
                  <div className="relative">
                    <input type="checkbox" className="sr-only" checked={soloEnvioGratis} onChange={(e) => { setSoloEnvioGratis(e.target.checked); setCurrentPage(1); }} />
                    <div className={`block w-10 h-6 rounded-full transition-colors ${soloEnvioGratis ? 'bg-violet-600' : 'bg-gray-300'}`}></div>
                    <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${soloEnvioGratis ? 'transform translate-x-4' : ''}`}></div>
                  </div>
                </label>
                <label className="flex items-center justify-between cursor-pointer">
                  <span className="text-sm text-gray-600">Solo en stock</span>
                  <div className="relative">
                    <input type="checkbox" className="sr-only" checked={soloEnStock} onChange={(e) => { setSoloEnStock(e.target.checked); setCurrentPage(1); }} />
                    <div className={`block w-10 h-6 rounded-full transition-colors ${soloEnStock ? 'bg-violet-600' : 'bg-gray-300'}`}></div>
                    <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${soloEnStock ? 'transform translate-x-4' : ''}`}></div>
                  </div>
                </label>
              </div>
            </div>

            {/* Botón de limpiar filtros general */}
            {activeFiltersCount > 0 && (
              <div className="mt-8 pt-6 border-t border-gray-100">
                <button
                  onClick={clearFilters}
                  className="w-full py-2.5 px-4 border border-violet-200 rounded-xl text-violet-600 font-semibold text-sm hover:bg-violet-50 transition-colors flex items-center justify-center gap-2"
                >
                  <X size={16} /> Limpiar filtros ({activeFiltersCount})
                </button>
              </div>
            )}
          </div>
        </aside>

        {/* ÁREA PRINCIPAL (Centro/Derecha) */}
        <div className="flex-1 min-w-0">

          {/* Barra superior de herramientas */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
            <div className="text-gray-600">
              <span className="font-bold text-gray-900">{productosFiltrados.length}</span> productos encontrados
            </div>

            <div className="flex flex-wrap items-center justify-end gap-3">
              {/* Buscador interno */}
              <div className="relative flex-grow sm:flex-grow-0">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar en catálogo..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    updateUrlParams(e.target.value);
                  }}
                  className="pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-full text-sm focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 w-full sm:w-48"
                />
                {searchTerm && (
                  <button onClick={() => { setSearchTerm(''); updateUrlParams(''); }} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    <X size={14} />
                  </button>
                )}
              </div>

              {/* Selector de Orden */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-white border border-gray-200 text-gray-700 text-sm rounded-full px-4 py-2 focus:outline-none focus:border-violet-500"
              >
                <option value="relevante">Más relevante</option>
                <option value="precioAsc">Menor a mayor precio</option>
                <option value="precioDesc">Mayor a menor precio</option>
              </select>

              {/* Toggle de Vista */}
              <div className="bg-white border border-gray-200 rounded-full p-1 flex items-center">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-1.5 rounded-full transition-colors ${viewMode === 'grid' ? 'bg-violet-100 text-violet-600' : 'text-gray-400 hover:text-gray-600'}`}
                >
                  <LayoutGrid size={18} />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-1.5 rounded-full transition-colors ${viewMode === 'list' ? 'bg-violet-100 text-violet-600' : 'text-gray-400 hover:text-gray-600'}`}
                >
                  <List size={18} />
                </button>
              </div>
            </div>
          </div>

          {/* Grilla / Lista de Productos */}
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="w-10 h-10 border-4 border-violet-200 border-t-violet-600 rounded-full animate-spin"></div>
            </div>
          ) : productosFiltrados.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-gray-100">
              <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search size={32} className="text-gray-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">No encontramos productos</h3>
              <p className="text-gray-500 mb-6">Intenta ajustando los filtros o buscando con otros términos.</p>
              <Boton onClick={clearFilters} variant="outline">Limpiar todos los filtros</Boton>
            </div>
          ) : (
            <div className={
              viewMode === 'grid'
                ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                : "flex flex-col gap-4"
            }>
              {currentProductos.map(producto => {
                const imgUrl = (producto.imagenes && producto.imagenes.length > 0)
                  ? producto.imagenes[0].url
                  : producto.imagenPrincipal || null;

                return (
                  <div key={producto.idProducto} className={`bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-gray-100 group ${viewMode === 'list' ? 'flex flex-row' : 'flex flex-col'}`}>

                    {/* Contenedor de Imagen */}
                    <div className={`relative bg-gray-50 flex-shrink-0 ${viewMode === 'list' ? 'w-32 sm:w-64 border-r border-gray-100' : 'w-full aspect-[4/3]'}`}>
                      {imgUrl ? (
                        <img src={imgUrl} alt={producto.nombre} className="w-full h-full object-cover mix-blend-multiply p-4" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400 font-medium">Sin Imagen</div>
                      )}

                      {/* Etiquetas Superiores */}
                      <div className="absolute top-3 left-3 flex flex-col gap-2">
                        {producto.stock > 0 && producto.stock <= 5 && (
                          <span className="bg-orange-100 text-orange-700 text-xs font-bold px-2.5 py-1 rounded-full">Últimas unidades</span>
                        )}
                        {/* Ejemplo de etiqueta simulada */}
                        {producto.precio > 2000 && (
                          <span className="bg-violet-100 text-violet-700 text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
                            <span>⚡</span> Más vendido
                          </span>
                        )}
                      </div>

                      {/* Envío gratis simulado */}
                      <div className="absolute bottom-3 left-3 bg-green-100 text-green-700 text-xs font-bold px-2 py-0.5 rounded flex items-center gap-1">
                        <span></span> Envío gratis
                      </div>

                      {/* Corazón (Estético) */}
                      <button className="absolute top-3 right-3 p-1.5 bg-white/80 backdrop-blur rounded-full text-gray-400 hover:text-red-500 hover:bg-white transition-colors">
                        <Heart size={18} />
                      </button>
                    </div>

                    {/* Contenido del Producto */}
                    <div className={`flex flex-col flex-1 p-5 ${viewMode === 'list' ? 'justify-between' : ''}`}>
                      <div className={viewMode === 'list' ? 'flex justify-between gap-6' : ''}>
                        <div className={viewMode === 'list' ? 'flex-1' : ''}>
                          <div className="flex items-center gap-2 mb-1.5">
                            <span className="text-xs font-semibold text-violet-600 uppercase tracking-wider">
                              {producto.marca || producto.categoria?.nombre || 'GENERAL'}
                            </span>
                            <span className="text-gray-300">•</span>
                            <span className="text-xs text-gray-500 truncate">{producto.tienda?.nombreTienda || 'Vendedor Anónimo'}</span>
                          </div>

                          <Link to={`/producto/${producto.idProducto}`} className="block">
                            <h3 className="font-bold text-gray-900 leading-tight mb-2 hover:text-violet-600 transition-colors line-clamp-2">
                              {producto.nombre}
                            </h3>
                          </Link>

                          {/* Estrellas estéticas */}
                          <div className="flex items-center gap-1 mb-3">
                            {[1, 2, 3, 4, 5].map(i => (
                              <Star key={i} size={14} className={i <= 4 ? "fill-yellow-400 text-yellow-400" : "fill-gray-200 text-gray-200"} />
                            ))}
                            <span className="text-xs text-gray-500 ml-1">(120)</span>
                          </div>

                          {viewMode === 'list' && (
                            <p className="text-sm text-gray-500 line-clamp-2 mb-4">
                              {producto.descripcion}
                            </p>
                          )}
                        </div>

                        {/* Bloque Precio y Botón (Alineación depende de la vista) */}
                        <div className={viewMode === 'list' ? 'flex flex-col items-end shrink-0 w-40' : 'mt-auto pt-4 border-t border-gray-100'}>
                          <div className={`mb-4 ${viewMode === 'list' ? 'text-right' : ''}`}>
                            <div className="flex items-end gap-2">
                              <span className="text-2xl font-black text-gray-900">S/ {producto.precio}</span>
                              {producto.precio > 500 && (
                                <span className="bg-green-100 text-green-700 font-bold text-xs px-1.5 py-0.5 rounded mb-1.5">-10%</span>
                              )}
                            </div>
                            {producto.precio > 500 && (
                              <span className="text-xs text-gray-400 line-through">S/ {(producto.precio * 1.1).toFixed(2)}</span>
                            )}
                          </div>

                          <Boton
                            onClick={() => addToCart(producto, 1)}
                            disabled={producto.stock <= 0}
                            className={`flex items-center justify-center gap-2 font-bold ${viewMode === 'list' ? 'w-full' : 'w-full'}`}
                            variant={producto.stock <= 0 ? 'secondary' : 'primary'}
                          >
                            {producto.stock <= 0 ? 'Agotado' : 'Agregar al carrito'}
                          </Boton>
                        </div>
                      </div>
                    </div>

                  </div>
                );
              })}
            </div>
          )}

          {/* Paginación */}
          {totalPages > 1 && (
            <div className="mt-12 flex justify-center items-center gap-2">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:hover:bg-white"
              >
                <ChevronLeft size={20} />
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => {
                // Mostrar solo páginas cercanas o primera/última
                if (
                  page === 1 ||
                  page === totalPages ||
                  (page >= currentPage - 1 && page <= currentPage + 1)
                ) {
                  return (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`w-10 h-10 rounded-full font-medium text-sm transition-colors ${currentPage === page
                        ? 'bg-violet-600 text-white border-violet-600'
                        : 'border border-gray-200 text-gray-600 hover:bg-gray-50'
                        }`}
                    >
                      {page}
                    </button>
                  );
                } else if (
                  page === currentPage - 2 ||
                  page === currentPage + 2
                ) {
                  return <span key={page} className="text-gray-400">...</span>;
                }
                return null;
              })}

              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:hover:bg-white"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Banner Informativo Inferior */}
      <div className="max-w-7xl mx-auto px-6 mt-16 pt-12 border-t border-gray-200">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-violet-100 text-violet-600 flex items-center justify-center shrink-0">
              <Truck size={24} />
            </div>
            <div>
              <h4 className="font-bold text-gray-900">Envío rápido</h4>
              <p className="text-sm text-gray-500 mt-1">Entrega en 24-48h a todo el país</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-violet-100 text-violet-600 flex items-center justify-center shrink-0">
              <ShieldCheck size={24} />
            </div>
            <div>
              <h4 className="font-bold text-gray-900">Compra segura</h4>
              <p className="text-sm text-gray-500 mt-1">Pagos 100% protegidos y encriptados</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-violet-100 text-violet-600 flex items-center justify-center shrink-0">
              <RefreshCw size={24} />
            </div>
            <div>
              <h4 className="font-bold text-gray-900">Devoluciones</h4>
              <p className="text-sm text-gray-500 mt-1">30 días de garantía sin preguntas</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-violet-100 text-violet-600 flex items-center justify-center shrink-0">
              <Headphones size={24} />
            </div>
            <div>
              <h4 className="font-bold text-gray-900">Soporte 24/7</h4>
              <p className="text-sm text-gray-500 mt-1">Siempre disponibles para ayudarte</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Catalogo;
