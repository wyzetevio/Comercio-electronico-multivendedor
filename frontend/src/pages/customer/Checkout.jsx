import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { CreditCard, MapPin, Truck } from "lucide-react";

import Boton from "../../components/ui/Boton";
import Alerta from "../../components/ui/Alerta";
import EmptyState from "../../components/common/EmptyState";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import { realizarCheckout } from "../../services/ordenService";
import { registrarPago } from "../../services/pagoService";
import { formatearPrecio } from "../../utils/formatters";
import { esRequerido } from "../../utils/validators";

function Checkout() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { items, getCartTotal, clearCart } = useCart();

  const [direccion, setDireccion] = useState("");
  const [metodoPago, setMetodoPago] = useState("TARJETA");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (!user) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800">
            Inicia sesión para continuar
          </h1>
          <Boton className="mt-4" onClick={() => navigate("/login")}>
            Iniciar sesión
          </Boton>
        </div>
      </main>
    );
  }

  if (items.length === 0) {
    return (
      <main className="min-h-screen bg-gray-50 px-6 py-8">
        <EmptyState message="Tu carrito está vacío. Agrega productos antes de pagar." />
        <div className="mt-4 text-center">
          <Boton onClick={() => navigate("/")}>Ir al catálogo</Boton>
        </div>
      </main>
    );
  }

  const total = getCartTotal();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!esRequerido(direccion)) {
      setError("Ingrese una dirección de envío.");
      return;
    }

    setLoading(true);
    try {
      const orden = await realizarCheckout(user.idUsuario, direccion);
      await registrarPago(orden.idOrden, metodoPago);
      await clearCart();
      navigate("/mis-pedidos");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Error al procesar el pago. Intente de nuevo.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-4xl px-6 py-8">
        <Link
          to="/carrito"
          className="mb-4 flex items-center gap-2 text-sm text-gray-500 hover:text-violet-600"
        >
          ← Volver al carrito
        </Link>

        <h1 className="mb-8 text-2xl font-bold text-gray-800">Checkout</h1>

        {error && (
          <div className="mb-4">
            <Alerta message={error} type="error" />
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid gap-8 lg:grid-cols-3">
          {/* Datos de envío y pago */}
          <div className="space-y-6 lg:col-span-2">
            {/* Dirección */}
            <div className="rounded-xl bg-white p-6 shadow-sm">
              <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-gray-800">
                <MapPin size={20} className="text-violet-600" />
                Dirección de envío
              </h2>
              <textarea
                className="w-full rounded-lg border px-3 py-2 outline-none focus:border-violet-500"
                rows={3}
                placeholder="Ingrese su dirección completa"
                value={direccion}
                onChange={(e) => setDireccion(e.target.value)}
              />
            </div>

            {/* Método de pago */}
            <div className="rounded-xl bg-white p-6 shadow-sm">
              <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-gray-800">
                <CreditCard size={20} className="text-violet-600" />
                Método de pago
              </h2>
              <div className="space-y-3">
                {[
                  { value: "TARJETA", label: "Tarjeta de crédito/débito" },
                  { value: "YAPE", label: "Yape" },
                  { value: "PLIN", label: "Plin" },
                  { value: "TRANSFERENCIA", label: "Transferencia bancaria" },
                ].map((mp) => (
                  <label
                    key={mp.value}
                    className={`flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition ${
                      metodoPago === mp.value
                        ? "border-violet-500 bg-violet-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <input
                      type="radio"
                      name="metodoPago"
                      value={mp.value}
                      checked={metodoPago === mp.value}
                      onChange={(e) => setMetodoPago(e.target.value)}
                      className="text-violet-600"
                    />
                    <span className="font-medium text-gray-700">
                      {mp.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Resumen */}
          <div className="lg:col-span-1">
            <div className="rounded-xl bg-white p-6 shadow-sm">
              <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-gray-800">
                <Truck size={20} className="text-violet-600" />
                Resumen
              </h2>

              <div className="divide-y text-sm">
                {items.map((item) => (
                  <div
                    key={item.idCarritoItem || item.producto?.idProducto}
                    className="flex justify-between py-2"
                  >
                    <span className="text-gray-600">
                      {item.nombreProducto || item.producto?.nombre} x{" "}
                      {item.cantidad}
                    </span>
                    <span className="font-medium">
                      {formatearPrecio(
                        (item.precioUnitario || item.producto?.precio) *
                          item.cantidad,
                      )}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-4 flex justify-between border-t pt-4 text-lg font-bold">
                <span>Total</span>
                <span className="text-violet-600">
                  {formatearPrecio(total)}
                </span>
              </div>

              <Boton
                type="submit"
                disabled={loading}
                className="mt-6 w-full"
              >
                {loading ? "Procesando..." : "Confirmar y pagar"}
              </Boton>
            </div>
          </div>
        </form>
      </div>
    </main>
  );
}

export default Checkout;
