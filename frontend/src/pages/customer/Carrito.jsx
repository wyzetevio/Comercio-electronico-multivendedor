import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Trash2 } from "lucide-react";

import Boton from "../../components/ui/Boton";
import Spinner from "../../components/ui/Spinner";
import EmptyState from "../../components/common/EmptyState";
import CartItem from "../../components/cart/CartItem";
import CartSummary from "../../components/cart/CartSummary";
import { useCart } from "../../context/CartContext";

function Carrito() {
  const navigate = useNavigate();
  const { items, loading, clearCart, getCartTotal } = useCart();

  if (loading) return <Spinner size="h-12 w-12" />;

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-4xl px-6 py-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <Link
              to="/"
              className="mb-2 flex items-center gap-2 text-sm text-gray-500 hover:text-violet-600"
            >
              <ArrowLeft size={16} />
              Seguir comprando
            </Link>
            <h1 className="mt-2 text-2xl font-bold text-gray-800">
              Carrito de Compras
            </h1>
          </div>

          {items.length > 0 && (
            <Boton variant="ghost" onClick={clearCart}>
              <Trash2 size={18} className="mr-1" />
              Vaciar carrito
            </Boton>
          )}
        </div>

        {items.length === 0 ? (
          <div className="rounded-2xl bg-white p-12 shadow-sm">
            <EmptyState message="Tu carrito está vacío." />
            <div className="mt-4 text-center">
              <Boton onClick={() => navigate("/")}>
                Explorar productos
              </Boton>
            </div>
          </div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-3">
            <div className="space-y-3 lg:col-span-2">
              {items.map((item) => (
                <CartItem
                  key={item.idCarritoItem || item.producto?.idProducto}
                  item={item}
                />
              ))}
            </div>

            <div className="lg:col-span-1">
              <div className="rounded-xl bg-white p-6 shadow-sm">
                <CartSummary total={getCartTotal()} />
                <Boton
                  className="mt-4 w-full"
                  onClick={() => navigate("/checkout")}
                >
                  Ir a pagar
                </Boton>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

export default Carrito;
