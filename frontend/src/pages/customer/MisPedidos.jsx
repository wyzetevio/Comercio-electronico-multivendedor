import { useState, useEffect } from "react";
import { Package, ChevronDown, ChevronUp } from "lucide-react";

import Badge from "../../components/ui/Badge";
import Spinner from "../../components/ui/Spinner";
import EmptyState from "../../components/common/EmptyState";
import ErrorMessage from "../../components/common/ErrorMessage";
import { useAuth } from "../../context/AuthContext";
import { obtenerOrdenesUsuario } from "../../services/ordenService";
import {
  formatearPrecio,
  formatearFechaHora,
  formatearEstado,
} from "../../utils/formatters";

const estadoBadge = {
  PENDIENTE_PAGO: "warning",
  PAGADA: "primary",
  ENVIADA: "primary",
  EN_TRANSITO: "primary",
  ENTREGADA: "success",
  CANCELADA: "danger",
  COMPLETADA: "success",
};

function MisPedidos() {
  const { user } = useAuth();
  const [ordenes, setOrdenes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandida, setExpandida] = useState(null);

  useEffect(() => {
    const fetchOrdenes = async () => {
      try {
        const data = await obtenerOrdenesUsuario(user.idUsuario);
        setOrdenes(data);
      } catch {
        setError("Error al cargar tus pedidos.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrdenes();
  }, [user.idUsuario]);

  if (loading) return <Spinner size="h-12 w-12" />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-4xl px-6 py-8">
        <div className="mb-6 flex items-center gap-3">
          <Package className="h-7 w-7 text-violet-600" />
          <h1 className="text-2xl font-bold text-gray-800">Mis Pedidos</h1>
        </div>

        {ordenes.length === 0 ? (
          <div className="rounded-2xl bg-white p-12 shadow-sm">
            <EmptyState message="No tienes pedidos aún." />
          </div>
        ) : (
          <div className="space-y-4">
            {ordenes.map((orden) => (
              <div
                key={orden.idOrden}
                className="overflow-hidden rounded-xl bg-white shadow-sm"
              >
                {/* Cabecera */}
                <div
                  className="flex cursor-pointer items-center justify-between p-4 transition hover:bg-gray-50"
                  onClick={() =>
                    setExpandida(
                      expandida === orden.idOrden ? null : orden.idOrden,
                    )
                  }
                >
                  <div className="flex flex-wrap items-center gap-4">
                    <div>
                      <p className="text-sm text-gray-500">
                        Orden #{orden.idOrden}
                      </p>
                      <p className="text-xs text-gray-400">
                        {formatearFechaHora(orden.createdAt)}
                      </p>
                    </div>
                    <Badge
                      variant={
                        estadoBadge[orden.estadoGeneral] || "gray"
                      }
                    >
                      {formatearEstado(orden.estadoGeneral)}
                    </Badge>
                  </div>

                  <div className="flex items-center gap-4">
                    <span className="font-bold text-violet-600">
                      {formatearPrecio(orden.total)}
                    </span>
                    {expandida === orden.idOrden ? (
                      <ChevronUp size={20} />
                    ) : (
                      <ChevronDown size={20} />
                    )}
                  </div>
                </div>

                {/* Detalle expandible */}
                {expandida === orden.idOrden && (
                  <div className="border-t px-4 py-3">
                    {orden.items?.length > 0 ? (
                      <div className="divide-y text-sm">
                        {orden.items.map((item, idx) => (
                          <div
                            key={idx}
                            className="flex items-center justify-between py-2"
                          >
                            <div className="flex items-center gap-3">
                              {item.imagen && (
                                <img
                                  src={item.imagen}
                                  alt={item.nombreProducto}
                                  className="h-10 w-10 rounded object-cover"
                                />
                              )}
                              <span className="text-gray-700">
                                {item.nombreProducto}
                              </span>
                            </div>
                            <span className="text-gray-500">
                              {item.cantidad} x{" "}
                              {formatearPrecio(item.precioUnitario)}
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="divide-y text-sm">
                        {orden.subordenes?.map((sub, idx) => (
                          <div
                            key={idx}
                            className="flex items-center justify-between py-2"
                          >
                            <span className="text-gray-700">
                              Suborden #{sub.idSuborden} -{" "}
                              {sub.tienda?.nombreTienda}
                            </span>
                            <span className="text-gray-500">
                              {formatearEstado(sub.estado)} —{" "}
                              {formatearPrecio(sub.total)}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

export default MisPedidos;
