import { useState, useEffect } from "react";
import { PackageSearch, Truck, CheckCircle, Clock } from "lucide-react";

import Boton from "../../components/ui/Boton";
import Badge from "../../components/ui/Badge";
import Spinner from "../../components/ui/Spinner";
import ErrorMessage from "../../components/common/ErrorMessage";
import { useAuth } from "../../context/AuthContext";
import { useStore } from "../../context/StoreContext";
import { obtenerSubordenesTienda, actualizarEstadoSuborden } from "../../services/ordenService";
import { formatearPrecio, formatearFecha, formatearEstado } from "../../utils/formatters";

const estadoBadge = {
  PENDIENTE_PAGO: "warning",
  PAGADA: "primary",
  ENVIADA: "primary",
  EN_TRANSITO: "primary",
  ENTREGADA: "success",
  CANCELADA: "danger",
  COMPLETADA: "success",
};

function GestionPedidos() {
  const { user } = useAuth();
  const { tienda, loading: storeLoading } = useStore();
  const [ordenes, setOrdenes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrdenes = async () => {
      if (!tienda) return;
      try {
        const data = await obtenerSubordenesTienda(tienda.idTienda);
        setOrdenes(data);
      } catch {
        setError("Error al cargar la lista de pedidos.");
      } finally {
        setLoading(false);
      }
    };

    if (!storeLoading) fetchOrdenes();
  }, [tienda, storeLoading]);

  const procesarEnvio = async (idSuborden) => {
    try {
      await actualizarEstadoSuborden(idSuborden, "EN_TRANSITO");
      setOrdenes(prev =>
        prev.map(ord =>
          ord.idSuborden === idSuborden ? { ...ord, estado: "EN_TRANSITO" } : ord
        )
      );
    } catch (e) {
      console.error(e);
    }
  };

  const entregarPedido = async (idSuborden) => {
    try {
      await actualizarEstadoSuborden(idSuborden, "ENTREGADA");
      setOrdenes(prev =>
        prev.map(ord =>
          ord.idSuborden === idSuborden ? { ...ord, estado: "ENTREGADA" } : ord
        )
      );
    } catch (e) {
      console.error(e);
    }
  };

  if (storeLoading || loading) return <Spinner size="h-12 w-12" />;
  if (error) return <ErrorMessage message={error} />;

  if (!tienda) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-white rounded-2xl shadow-sm border border-gray-100">
        <PackageSearch className="h-16 w-16 text-gray-300 mb-4" />
        <h2 className="text-xl font-bold text-gray-800">Tienda no encontrada</h2>
        <p className="text-gray-500 mt-2">Crea tu tienda para poder recibir pedidos.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Gestión de Pedidos</h1>
        <Badge variant="primary" className="px-4 py-1.5 text-sm">
          {ordenes.length} Pedidos Totales
        </Badge>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {ordenes.length === 0 ? (
          <div className="p-12 text-center flex flex-col items-center">
            <Clock className="h-12 w-12 text-gray-300 mb-3" />
            <p className="text-gray-500 font-medium">Aún no has recibido ningún pedido.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-gray-50/50 text-gray-500 border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4 font-semibold">N° Orden</th>
                  <th className="px-6 py-4 font-semibold">Fecha de Compra</th>
                  <th className="px-6 py-4 font-semibold">Estado</th>
                  <th className="px-6 py-4 font-semibold">Total a Recibir</th>
                  <th className="px-6 py-4 font-semibold text-right">Acciones de Envío</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {ordenes.map((orden) => (
                  <tr key={orden.idSuborden} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 font-bold text-gray-900">
                      #{orden.idSuborden.toString().padStart(6, '0')}
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {formatearFecha(orden.createdAt)}
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={estadoBadge[orden.estado] || "gray"} className="shadow-sm">
                        {formatearEstado(orden.estado)}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 font-bold text-amber-600">
                      {formatearPrecio(orden.totalVendedor)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      {orden.estado === "PENDIENTE" || orden.estado === "PAGADA" ? (
                        <Boton
                          className="bg-amber-500 hover:bg-amber-600 shadow-amber-500/20 text-xs py-2 px-4"
                          onClick={() => procesarEnvio(orden.idSuborden)}
                        >
                          <Truck className="h-3 w-3 mr-1.5 inline" />
                          Despachar
                        </Boton>
                      ) : orden.estado === "EN_TRANSITO" ? (
                        <Boton
                          className="bg-blue-500 hover:bg-blue-600 shadow-blue-500/20 text-xs py-2 px-4"
                          onClick={() => entregarPedido(orden.idSuborden)}
                        >
                          <CheckCircle className="h-3 w-3 mr-1.5 inline" />
                          Marcar Entregado
                        </Boton>
                      ) : (
                        <span className="inline-flex items-center text-green-600 text-xs font-semibold bg-green-50 px-3 py-1.5 rounded-lg border border-green-100">
                          <CheckCircle className="h-3 w-3 mr-1.5 inline" /> Entregado
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default GestionPedidos;
