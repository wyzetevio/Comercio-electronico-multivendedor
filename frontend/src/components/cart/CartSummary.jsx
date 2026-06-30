import { useCart } from "../../context/CartContext";

function CartSummary({ total }) {
  return (
    <div className="p-4 border rounded-lg">
      <h2 className="font-bold">Resumen</h2>

      <p className="mt-2">
        Total: <strong>S/ {total}</strong>
      </p>
    </div>
  );
}

export default CartSummary;