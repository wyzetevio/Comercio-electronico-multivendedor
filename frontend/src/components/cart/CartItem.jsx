import { useCart } from "../../context/CartContext";
import Boton from "../ui/Boton";

function CartItem({ item }) {
  const { updateQuantity, removeItem } = useCart();

  return (
    <div className="flex justify-between items-center border p-3 rounded-lg">

      {/* INFO PRODUCTO */}
      <div className="flex items-center gap-3">

        {/* imagen opcional */}
        {item.imagen && (
          <img
            src={item.imagen}
            alt={item.nombreProducto}
            className="w-14 h-14 object-cover rounded"
          />
        )}

        <div>
          <p className="font-medium">{item.nombreProducto}</p>
          <p className="text-sm text-gray-500">
            S/ {item.precioUnitario}
          </p>
        </div>
      </div>

      {/* CONTROLES */}
      <div className="flex items-center gap-2">

        <Boton
          variant="secondary"
          className="px-2 py-1"
          onClick={() =>
            updateQuantity(item.idCarritoItem, item.cantidad - 1)
          }
        >
          -
        </Boton>

        <span>{item.cantidad}</span>

        <Boton
          variant="secondary"
          className="px-2 py-1"
          onClick={() =>
            updateQuantity(item.idCarritoItem, item.cantidad + 1)
          }
        >
          +
        </Boton>

        <Boton
          variant="danger"
          className="px-2 py-1"
          onClick={() =>
            removeItem(item.idCarritoItem)
          }
        >
          🗑
        </Boton>

      </div>
    </div>
  );
}

export default CartItem;