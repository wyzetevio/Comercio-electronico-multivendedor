import { useCart } from "../../context/CartContext";
import { Heart, Trash2, Truck, Plus, Minus, Flame } from "lucide-react";
import { formatearPrecio } from "../../utils/formatters";

function CartItem({ item }) {
  const { updateQuantity, removeItem } = useCart();

  // Asumiendo que el producto viene populado en `item.producto` o es el `item` mismo
  const producto = item.producto || item;

  // En el backend, el precio se guarda en item.precioUnitario
  const precioActual = item.precioUnitario || producto.precio || 0;

  // Buscar imagen en el CarritoItemDTO (item.imagen) o en la estructura anidada antigua
  const imgUrl = item.imagen || (producto.imagenes && producto.imagenes.length > 0
    ? producto.imagenes[0].url
    : producto.imagenPrincipal) || "https://placehold.co/400?text=No+Image";

  // Simulación de un precio sin descuento para coincidir con el diseño (15% más)
  const precioAnterior = precioActual * 1.15;
  const ahorro = precioAnterior - precioActual;
  const descuentoPorcentaje = precioAnterior > 0 ? Math.round(((precioAnterior - precioActual) / precioAnterior) * 100) : 0;

  const nombreF = item.nombreProducto || producto.nombre || "Producto";

  return (
    <div className="flex flex-col sm:flex-row gap-6 rounded-3xl bg-white p-4 shadow-sm border border-gray-100 mb-4 transition-all hover:shadow-md">

      {/* IMAGEN DEL PRODUCTO */}
      <div className="relative h-40 w-full sm:w-40 shrink-0 overflow-hidden rounded-2xl bg-gray-50">
        <div className="absolute top-2 left-2 z-10 rounded-lg bg-green-500 px-2 py-1 text-xs font-bold text-white">
          -{descuentoPorcentaje}%
        </div>
        <img
          src={imgUrl}
          alt={nombreF}
          className="h-full w-full object-cover"
        />
      </div>

      {/* DETALLES DEL PRODUCTO */}
      <div className="flex flex-1 flex-col justify-between">

        {/* Fila superior: Info y Precios */}
        <div className="flex flex-col md:flex-row justify-between items-start gap-4">
          <div className="space-y-1">
            <p className="text-xs font-semibold text-violet-600">
              {producto.marca || producto.categoria?.nombre || "Varios"}
            </p>
            <h3 className="text-lg font-bold text-gray-900 leading-tight">
              {nombreF}
            </h3>
            <p className="text-sm text-gray-400">
              {producto.descripcion ? producto.descripcion.substring(0, 60) + '...' : "Producto de alta calidad"}
            </p>
            <p className="text-sm text-gray-400">
              Vendido por <span className="font-semibold text-violet-600">{producto.tienda?.nombre || "Tienda Oficial"}</span>
            </p>
            <div className="mt-2 inline-flex items-center gap-1 rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-600">
              <Truck size={14} /> Envío gratis
            </div>
          </div>

          <div className="text-left md:text-right">
            <p className="text-2xl font-extrabold text-violet-700">
              {formatearPrecio(precioActual)}
            </p>
            <p className="text-sm text-gray-400 line-through">
              {formatearPrecio(precioAnterior)} c/u
            </p>
            <p className="text-sm font-semibold text-green-500">
              Ahorras {formatearPrecio(ahorro)}
            </p>
          </div>
        </div>

        {/* Fila inferior: Controles y Acciones */}
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between border-t border-gray-100 pt-4 gap-4">

          {/* Controles de cantidad */}
          <div className="flex items-center gap-4">
            <div className="flex h-10 items-center rounded-xl border border-gray-200 bg-white">
              <button
                className="flex h-full w-10 items-center justify-center text-gray-500 hover:text-violet-600 transition-colors disabled:opacity-50"
                onClick={() => updateQuantity(item.idCarritoItem || producto.idProducto, item.cantidad - 1)}
                disabled={item.cantidad <= 1}
              >
                <Minus size={16} />
              </button>
              <span className="flex h-full w-8 items-center justify-center font-semibold text-gray-900">
                {item.cantidad}
              </span>
              <button
                className="flex h-full w-10 items-center justify-center text-gray-500 hover:text-violet-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={() => updateQuantity(item.idCarritoItem || producto.idProducto, item.cantidad + 1)}
                disabled={item.cantidad >= (producto.stock || 999)}
              >
                <Plus size={16} />
              </button>
            </div>
            {producto.stock && producto.stock <= 5 && (
              <div className="flex items-center gap-1 text-xs font-bold text-orange-500">
                <Flame size={14} /> Solo {producto.stock} disp.
              </div>
            )}
          </div>

          {/* Acciones */}
          <div className="flex items-center gap-4">
            <button className="flex items-center gap-1 text-sm font-medium text-gray-400 hover:text-violet-600 transition-colors">
              <Heart size={16} /> Guardar
            </button>
            <button
              className="flex items-center gap-1 text-sm font-medium text-red-400 hover:text-red-600 transition-colors"
              onClick={() => removeItem(item.idCarritoItem || producto.idProducto)}
            >
              <Trash2 size={16} /> Eliminar
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}

export default CartItem;