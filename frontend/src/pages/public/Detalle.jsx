import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ShoppingCart, Minus, Plus, ArrowLeft, Store } from "lucide-react";

import Boton from "../../components/ui/Boton";
import Badge from "../../components/ui/Badge";
import Spinner from "../../components/ui/Spinner";
import ErrorMessage from "../../components/common/ErrorMessage";
import { useCart } from "../../context/CartContext";
import { obtenerProducto } from "../../services/productoService";
import { formatearPrecio } from "../../utils/formatters";

function Detalle() {
  const { id } = useParams();
  const { addToCart } = useCart();

  const [producto, setProducto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cantidad, setCantidad] = useState(1);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    const fetchProducto = async () => {
      try {
        const data = await obtenerProducto(id);
        setProducto(data);
      } catch {
        setError("Error al cargar el producto.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducto();
  }, [id]);

  if (loading) return <Spinner size="h-16 w-16" />;
  if (error) return <ErrorMessage message={error} />;
  if (!producto) return <ErrorMessage message="Producto no encontrado" />;

  const stockConfig = {
    AVAILABLE: { text: "Disponible", variant: "success" },
    LOW_STOCK: { text: "Últimas unidades", variant: "warning" },
    OUT_OF_STOCK: { text: "Agotado", variant: "danger" },
  };

  const stock = stockConfig[producto.stockStatus] || stockConfig.AVAILABLE;
  const noStock = producto.stockStatus === "OUT_OF_STOCK" || producto.stock === 0;

  const handleAddToCart = () => {
    addToCart(producto, cantidad);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-6 py-8">
        {/* Breadcrumb */}
        <Link
          to="/"
          className="mb-6 flex items-center gap-2 text-sm text-gray-500 hover:text-violet-600"
        >
          <ArrowLeft size={16} />
          Volver al catálogo
        </Link>

        <div className="grid gap-8 md:grid-cols-2">
          {/* Imagen */}
          <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
            <img
              src={producto.imagenPrincipal || "/placeholder.png"}
              alt={producto.nombre}
              className="h-full w-full object-cover"
            />
          </div>

          {/* Información */}
          <div className="space-y-6">
            <div>
              <div className="mb-2 flex items-center gap-2">
                <Badge variant={stock.variant}>{stock.text}</Badge>
                {producto.categoria && (
                  <span className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-600">
                    {producto.categoria.nombre}
                  </span>
                )}
              </div>

              <h1 className="text-3xl font-bold text-gray-800">
                {producto.nombre}
              </h1>

              <div className="mt-2 flex items-center gap-2 text-sm text-gray-500">
                <Store size={16} />
                <span>{producto.tienda?.nombreTienda || "Tienda"}</span>
              </div>
            </div>

            <p className="leading-relaxed text-gray-600">
              {producto.descripcion}
            </p>

            <div className="text-4xl font-bold text-violet-600">
              {formatearPrecio(producto.precio)}
            </div>

            {producto.stock !== undefined && (
              <p className="text-sm text-gray-500">
                Stock disponible: {producto.stock} unidades
              </p>
            )}

            {/* Selector de cantidad */}
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-gray-700">
                Cantidad:
              </span>
              <div className="flex items-center gap-2">
                <Boton
                  variant="secondary"
                  onClick={() => setCantidad(Math.max(1, cantidad - 1))}
                  disabled={cantidad <= 1}
                >
                  <Minus size={16} />
                </Boton>
                <span className="w-10 text-center font-semibold">
                  {cantidad}
                </span>
                <Boton
                  variant="secondary"
                  onClick={() =>
                    setCantidad(
                      Math.min(
                        producto.stock || 999,
                        cantidad + 1,
                      ),
                    )
                  }
                  disabled={noStock || cantidad >= (producto.stock || 999)}
                >
                  <Plus size={16} />
                </Boton>
              </div>
            </div>

            {/* Botón agregar */}
            <Boton
              onClick={handleAddToCart}
              disabled={noStock}
              className="flex w-full items-center justify-center gap-2 py-3 text-lg md:w-auto md:px-10"
            >
              <ShoppingCart size={20} />
              {added
                ? "¡Agregado!"
                : noStock
                  ? "Agotado"
                  : "Agregar al carrito"}
            </Boton>
          </div>
        </div>
      </div>
    </main>
  );
}

export default Detalle;
