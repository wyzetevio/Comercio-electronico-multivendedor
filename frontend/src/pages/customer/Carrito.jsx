import { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ChevronLeft,
  ShoppingCart,
  Tag,
  CreditCard,
  Truck,
  ShieldCheck,
  RefreshCw,
  Gift,
  Trash2,
  Zap,
  Heart,
  X
} from "lucide-react";

import Boton from "../../components/ui/Boton";
import Input from "../../components/ui/Input";
import Spinner from "../../components/ui/Spinner";
import CartItem from "../../components/cart/CartItem";
import { useCart } from "../../context/CartContext";
import { AuthContext } from "../../context/AuthContext";
import { obtenerProductos } from "../../services/productoService";
import { formatearPrecio } from "../../utils/formatters";

function Carrito() {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const { items, loading: cartLoading, clearCart, getCartTotal, cuponAplicado, aplicarCuponCodigo, removerCupon } = useCart();
  const [recommended, setRecommended] = useState([]);
  const [loadingRecommended, setLoadingRecommended] = useState(true);

  // Estados del cupón
  const [codigoCupon, setCodigoCupon] = useState("");
  const [validandoCupon, setValidandoCupon] = useState(false);
  const [errorCupon, setErrorCupon] = useState("");
  const [successCupon, setSuccessCupon] = useState("");

  useEffect(() => {
    const fetchRecommended = async () => {
      try {
        const data = await obtenerProductos();
        setRecommended(data.slice(0, 4));
      } catch (error) {
        console.error("Error fetching recommended products:", error);
      } finally {
        setLoadingRecommended(false);
      }
    };
    fetchRecommended();
  }, []);

  const handleContinuar = () => {
    if (!user) {
      navigate("/login", { state: { from: "/checkout" } });
    } else {
      navigate("/checkout");
    }
  };

  const handleAplicarCupon = async () => {
    if (!codigoCupon.trim()) return;
    setValidandoCupon(true);
    setErrorCupon("");
    setSuccessCupon("");

    const result = await aplicarCuponCodigo(codigoCupon.toUpperCase());

    if (result.success) {
      setSuccessCupon(result.message);
      setCodigoCupon("");
    } else {
      setErrorCupon(result.message);
    }
    setValidandoCupon(false);
  };

  const handleRemoverCupon = () => {
    removerCupon();
    setSuccessCupon("");
    setErrorCupon("");
  };

  if (cartLoading) return <Spinner size="h-12 w-12" />;

  const isEmpty = items.length === 0;

  // Calculos simulados basados en el diseño de Figma
  const subtotal = getCartTotal();

  // Simulamos un ahorro del 15% que cuadra con el CartItem
  const totalAhorrado = items.reduce((acc, item) => {
    const producto = item.producto || item;
    const precioNormal = (producto.precio || 0) * 1.15;
    const descuento = precioNormal - (producto.precio || 0);
    return acc + (descuento * item.cantidad);
  }, 0);

  // Calcular descuento del cupón si existe
  const descuentoCupon = cuponAplicado ? (subtotal * (cuponAplicado.descuentoPorcentaje / 100)) : 0;

  const total = subtotal - descuentoCupon; // Envío es gratis en la simulación

  // Stepper Header
  const renderStepper = () => (
    <div className="mx-auto mb-10 max-w-4xl rounded-2xl bg-white px-8 py-5 shadow-sm border border-gray-100 hidden md:flex items-center justify-between text-sm font-medium">
      <div className="flex items-center text-violet-600">
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-violet-600 text-white mr-2">1</span>
        Mi carrito
      </div>
      <div className="h-px w-16 bg-gray-200"></div>
      <div className="flex items-center text-gray-400">
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gray-100 text-gray-500 mr-2">2</span>
        Dirección
      </div>
      <div className="h-px w-16 bg-gray-200"></div>
      <div className="flex items-center text-gray-400">
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gray-100 text-gray-500 mr-2">3</span>
        Pago
      </div>
      <div className="h-px w-16 bg-gray-200"></div>
      <div className="flex items-center text-gray-400">
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gray-100 text-gray-500 mr-2">4</span>
        Confirmación
      </div>
    </div>
  );

  return (
    <main className="min-h-screen bg-[#F8F9FA] pb-16">
      <div className="mx-auto max-w-6xl px-6 py-8">

        <Link
          to="/catalogo"
          className="mb-6 inline-flex items-center text-sm font-medium text-gray-400 hover:text-violet-600 transition-colors"
        >
          <ChevronLeft size={16} className="mr-1" />
          Seguir comprando
        </Link>

        {renderStepper()}

        <div className="mb-6 flex items-end justify-between">
          <h1 className="text-3xl font-bold text-[#1A1F36] tracking-tight flex items-baseline gap-3">
            Mi Carrito
            {!isEmpty && <span className="text-lg font-medium text-gray-400">{items.length} items</span>}
          </h1>
          {!isEmpty && (
            <button
              onClick={clearCart}
              className="flex items-center gap-1 text-sm font-semibold text-red-400 hover:text-red-600 transition-colors"
            >
              <Trash2 size={16} /> Vaciar
            </button>
          )}
        </div>

        <div className="grid gap-6 lg:grid-cols-3 items-start">

          {/* PANEL IZQUIERDO: EMPTY STATE OR ITEMS */}
          <div className="lg:col-span-2">

            {isEmpty ? (
              <div className="flex min-h-[400px] flex-col items-center justify-center rounded-3xl bg-white p-12 shadow-sm border border-gray-100 text-center relative overflow-hidden">
                <div className="relative mb-8 flex h-32 w-32 items-center justify-center rounded-full bg-violet-50">
                  <ShoppingCart className="h-12 w-12 text-violet-300" strokeWidth={1.5} />
                  <div className="absolute top-4 left-4 h-2 w-2 rounded-full bg-violet-200"></div>
                  <div className="absolute bottom-6 right-2 h-3 w-3 rounded-full bg-violet-200"></div>
                  <div className="absolute top-10 -right-2 h-2 w-2 rounded-full bg-violet-200"></div>
                  <div className="absolute top-0 right-0 flex h-8 w-8 items-center justify-center rounded-full bg-violet-100 text-sm font-bold text-violet-600 border-4 border-white shadow-sm">
                    0
                  </div>
                </div>
                <h2 className="mb-3 text-2xl font-bold text-gray-900">Tu carrito está vacío</h2>
                <p className="mx-auto mb-8 max-w-sm text-gray-500">
                  Parece que todavía no has agregado ningún producto. ¡Explora nuestro catálogo y encuentra algo que te encante!
                </p>
                <div className="flex gap-4">
                  <Boton className="rounded-xl px-6 py-3 font-semibold shadow-md shadow-violet-500/20" onClick={() => navigate("/catalogo")}>
                    <ShoppingCart size={18} className="mr-2 inline" />
                    Explorar productos
                  </Boton>
                  <button className="rounded-xl border border-violet-200 px-6 py-3 font-semibold text-violet-600 transition-colors hover:bg-violet-50" onClick={() => navigate("/catalogo")}>
                    Ver ofertas
                  </button>
                </div>
              </div>
            ) : (
              <div>
                {/* Banner verde */}
                <div className="mb-6 flex items-center gap-3 rounded-2xl bg-green-50 px-6 py-4 border border-green-100">
                  <Truck className="text-green-600" size={20} />
                  <p className="font-medium text-green-700">
                    ¡Tienes <span className="font-bold">envío gratis</span> en algunos de tus productos!
                  </p>
                </div>

                {/* Lista de productos */}
                <div className="space-y-4">
                  {items.map((item) => (
                    <CartItem key={item.idCarritoItem || (item.producto && item.producto.idProducto)} item={item} />
                  ))}
                </div>
              </div>
            )}

          </div>

          {/* PANEL DERECHO: SIDEBAR */}
          <div className="lg:col-span-1 space-y-6">

            {/* Cupón (Activo si no está vacío) */}
            <div className="rounded-3xl bg-white p-6 shadow-sm border border-gray-100">
              <div className="mb-4 flex items-center gap-2 font-bold text-gray-900">
                <Tag className="text-violet-600" size={18} />
                Código de descuento
              </div>

              {cuponAplicado ? (
                <div className="flex items-center justify-between rounded-xl bg-violet-50 px-4 py-3 border border-violet-100">
                  <div className="flex items-center gap-2">
                    <Tag className="text-violet-500" size={16} />
                    <div>
                      <p className="text-sm font-bold text-violet-700">{cuponAplicado.codigo}</p>
                      <p className="text-xs text-violet-500">-{cuponAplicado.descuentoPorcentaje}% de descuento</p>
                    </div>
                  </div>
                  <button
                    onClick={handleRemoverCupon}
                    className="text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <X size={18} />
                  </button>
                </div>
              ) : (
                <>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Ej: POCHITA10"
                      disabled={isEmpty || validandoCupon}
                      value={codigoCupon}
                      onChange={(e) => setCodigoCupon(e.target.value)}
                      className={`rounded-xl ${isEmpty ? 'bg-gray-50 border-gray-100 text-gray-400' : 'bg-white border-gray-200'}`}
                    />
                    <button
                      disabled={isEmpty || validandoCupon}
                      onClick={handleAplicarCupon}
                      className={`rounded-xl px-5 font-semibold transition-colors ${isEmpty || validandoCupon ? 'bg-violet-100 text-violet-400 cursor-not-allowed' : 'bg-violet-100 text-violet-700 hover:bg-violet-200 cursor-pointer'}`}
                    >
                      {validandoCupon ? <Spinner size="h-5 w-5" /> : "Aplicar"}
                    </button>
                  </div>
                  {!isEmpty && !errorCupon && !successCupon && (
                    <p className="mt-2 text-xs text-gray-400">
                      Prueba: <span className="font-semibold text-violet-600">POCHITA10</span>
                    </p>
                  )}
                  {errorCupon && (
                    <p className="mt-2 text-xs font-semibold text-red-500">{errorCupon}</p>
                  )}
                  {successCupon && (
                    <p className="mt-2 text-xs font-semibold text-green-500">{successCupon}</p>
                  )}
                </>
              )}
            </div>

            {/* Resumen */}
            <div className="rounded-3xl bg-white p-6 shadow-sm border border-gray-100">
              <div className="mb-6 flex items-center gap-2 text-lg font-bold text-gray-900">
                <CreditCard className="text-violet-600" size={20} />
                Resumen de compra
              </div>

              {isEmpty ? (
                // Resumen Inactivo
                <>
                  <div className="space-y-4 mb-6">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Subtotal</span>
                      <div className="h-4 w-16 rounded bg-gray-100 animate-pulse"></div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Envío</span>
                      <div className="h-4 w-16 rounded bg-gray-100 animate-pulse"></div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Descuento</span>
                      <div className="h-4 w-16 rounded bg-gray-100 animate-pulse"></div>
                    </div>
                  </div>
                  <div className="mb-6 flex items-center justify-between border-t pt-4">
                    <span className="font-bold text-gray-400">Total</span>
                    <div className="h-6 w-24 rounded bg-gray-100 animate-pulse"></div>
                  </div>
                  <Boton className="w-full rounded-xl py-3 opacity-50 cursor-not-allowed bg-violet-300 hover:bg-violet-300">
                    Ir a pagar
                  </Boton>
                </>
              ) : (
                // Resumen Activo
                <>
                  <div className="space-y-4 mb-4 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500">Subtotal ({items.length} prod.)</span>
                      <span className="font-semibold text-gray-900">{formatearPrecio(subtotal)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1 text-gray-500"><Truck size={14} /> Envío</span>
                      <span className="font-bold text-green-500">Gratis</span>
                    </div>
                    {cuponAplicado && (
                      <div className="flex items-center justify-between text-red-500 font-semibold">
                        <span>Descuento ({cuponAplicado.descuentoPorcentaje}%)</span>
                        <span>-{formatearPrecio(descuentoCupon)}</span>
                      </div>
                    )}
                  </div>

                  <div className="mb-6 flex items-center justify-between rounded-xl bg-green-50 px-4 py-3 text-sm">
                    <span className="font-bold text-green-700">Total ahorrado</span>
                    <span className="font-bold text-green-700">{formatearPrecio(totalAhorrado)}</span>
                  </div>

                  <div className="mb-6 flex items-end justify-between border-t border-gray-100 pt-4">
                    <span className="text-lg font-bold text-gray-900">Total</span>
                    <div className="text-right">
                      <span className="block text-2xl font-extrabold text-violet-700">{formatearPrecio(total)}</span>
                      <span className="text-xs text-gray-400">Impuestos incluidos</span>
                    </div>
                  </div>

                  <Boton
                    className="w-full rounded-xl py-4 text-base shadow-md shadow-violet-500/20 flex justify-center items-center gap-2"
                    onClick={handleContinuar}
                  >
                    Continuar <ChevronLeft size={18} className="rotate-180" />
                  </Boton>
                </>
              )}
            </div>

            {/* Beneficios (Movidos al Sidebar según Figma Paso 2) */}
            <div className="space-y-3 px-2">
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <ShieldCheck size={16} className="text-violet-300" /> Compra 100% protegida
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <RefreshCw size={16} className="text-violet-300" /> Devolución gratis 30 días
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <Tag size={16} className="text-violet-300" /> Datos encriptados SSL
              </div>
            </div>

          </div>
        </div>

        {/* BENEFICIOS (Solo en Empty State) */}
        {isEmpty && (
          <div className="mt-12 mb-16 grid grid-cols-1 gap-6 md:grid-cols-3">
            <div className="flex items-center justify-center gap-4 rounded-2xl bg-white p-6 shadow-sm border border-gray-50 text-center md:flex-col md:text-left lg:flex-row">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-violet-50 text-violet-500">
                <Truck size={24} />
              </div>
              <div>
                <h4 className="font-bold text-gray-800">Envío gratis</h4>
                <p className="text-sm text-gray-400">En pedidos +S/199</p>
              </div>
            </div>
            <div className="flex items-center justify-center gap-4 rounded-2xl bg-white p-6 shadow-sm border border-gray-50 text-center md:flex-col md:text-left lg:flex-row">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-violet-50 text-violet-500">
                <ShieldCheck size={24} />
              </div>
              <div>
                <h4 className="font-bold text-gray-800">Pago seguro</h4>
                <p className="text-sm text-gray-400">100% protegido</p>
              </div>
            </div>
            <div className="flex items-center justify-center gap-4 rounded-2xl bg-white p-6 shadow-sm border border-gray-50 text-center md:flex-col md:text-left lg:flex-row">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-violet-50 text-violet-500">
                <RefreshCw size={24} />
              </div>
              <div>
                <h4 className="font-bold text-gray-800">Devoluciones</h4>
                <p className="text-sm text-gray-400">30 días gratis</p>
              </div>
            </div>
          </div>
        )}

        {/* RECOMENDACIONES */}
        <div className={`mb-6 flex items-center justify-between ${!isEmpty ? 'mt-12' : ''}`}>
          <h3 className="flex items-center gap-2 text-xl font-bold text-gray-900">
            {isEmpty ? (
              <Zap className="text-violet-500" fill="currentColor" />
            ) : (
              <Gift className="text-violet-500" />
            )}
            {isEmpty ? "Productos que te pueden gustar" : "También te puede interesar"}
          </h3>
          <Link to="/catalogo" className="text-sm font-medium text-violet-600 hover:underline">
            Ver todos &gt;
          </Link>
        </div>

        {loadingRecommended ? (
          <div className="flex justify-center p-12"><Spinner /></div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {recommended.map((p) => (
              <div key={p.idProducto} className="group relative flex flex-col rounded-2xl bg-white p-3 shadow-sm transition-all hover:shadow-md hover:-translate-y-1">
                <button className="absolute right-5 top-5 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-sm text-gray-400 hover:text-red-500 transition-colors">
                  <Heart size={16} />
                </button>
                <div className="relative mb-3 h-40 w-full overflow-hidden rounded-xl bg-gray-50">
                  <img
                    src={p.imagenPrincipal || "https://placehold.co/400?text=No+Image"}
                    alt={p.nombre}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="flex flex-1 flex-col">
                  <span className="mb-1 text-xs font-semibold text-violet-600">
                    {p.marca || p.categoria?.nombre || "Varios"}
                  </span>
                  <h4 className="mb-2 line-clamp-2 text-sm font-bold text-gray-800">
                    {p.nombre}
                  </h4>
                  <div className="mb-3 flex items-center gap-1 text-amber-400">
                    {'★★★★★'.split('').map((star, i) => (
                      <span key={i} className="text-xs">{star}</span>
                    ))}
                    <span className="ml-1 text-xs text-gray-400">4.8</span>
                  </div>
                  <div className="mt-auto flex items-end gap-2 mb-4">
                    <span className="text-xl font-extrabold text-violet-700">
                      {formatearPrecio(p.precio)}
                    </span>
                    <span className="mb-1 text-xs text-gray-400 line-through">
                      {formatearPrecio(p.precio * 1.15)}
                    </span>
                  </div>
                  <Boton className="w-full rounded-xl py-2.5 shadow-sm">
                    + Agregar
                  </Boton>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

export default Carrito;
