import { ShoppingCart } from "lucide-react";
import { useCart } from "../../context/CartContext";

import Badge from "../ui/Badge";
import Boton from "../ui/Boton";

function ProductoCard({ producto }) {
  const { addToCart } = useCart();

  const stockConfig = {
    AVAILABLE: {
      text: "Disponible",
      variant: "success",
    },
    LOW_STOCK: {
      text: "Últimas unidades",
      variant: "warning",
    },
    OUT_OF_STOCK: {
      text: "Agotado",
      variant: "danger",
    },
  };

  const stock = stockConfig[producto.stockStatus];

  return (
    <div className="group overflow-hidden rounded-xl border bg-white shadow-sm transition hover:shadow-md">

      {/* Imagen */}
      <div className="relative h-48 w-full overflow-hidden bg-gray-100">
        <img
          src={producto.imagenPrincipal || "/placeholder.png"}
          alt={producto.nombre}
          className="h-full w-full object-cover transition group-hover:scale-105"
        />

        {/* Estado del stock */}
        <div className="absolute left-2 top-2">
          <Badge variant={stock?.variant}>
            {stock?.text}
          </Badge>
        </div>
      </div>

      {/* Contenido */}
      <div className="p-4">

        {/* Categoría + Tienda */}
        <div className="mb-1 flex justify-between text-xs text-gray-500">
          <span>{producto.categoria?.nombre}</span>
          <span>{producto.tienda?.nombreTienda}</span>
        </div>

        {/* Nombre */}
        <h3 className="line-clamp-2 text-sm font-semibold text-gray-800">
          {producto.nombre}
        </h3>

        {/* Descripción */}
        <p className="mt-1 line-clamp-2 text-xs text-gray-500">
          {producto.descripcion}
        </p>

        {/* Precio */}
        <div className="mt-3 text-lg font-bold text-violet-600">
          S/ {producto.precio}
        </div>

        {/* Botón */}
        <Boton
          onClick={() => addToCart(producto, 1)}
          disabled={producto.stockStatus === "OUT_OF_STOCK"}
          className="mt-3 flex w-full items-center justify-center gap-2"
        >
          <ShoppingCart size={18} />
          Agregar al carrito
        </Boton>

      </div>
    </div>
  );
}

export default ProductoCard;