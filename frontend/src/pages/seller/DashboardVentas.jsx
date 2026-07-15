import { useState, useEffect } from "react";
import { DollarSign, TrendingUp, Package, CheckCircle } from "lucide-react";

import Boton from "../../components/ui/Boton";
import Badge from "../../components/ui/Badge";
import Spinner from "../../components/ui/Spinner";
import ErrorMessage from "../../components/common/ErrorMessage";
import { useAuth } from "../../context/AuthContext";
import { useStore } from "../../context/StoreContext";
import {
  obtenerSubordenesTienda,
  actualizarEstadoSuborden,
} from "../../services/ordenService";
import {
  formatearPrecio,
  formatearFecha,
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

function DashboardVentas() {
  const { user } = useAuth();
  const { tienda, loading: storeLoading } = useStore();
  const [ventas, setVentas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchVentas = async () => {
    try {
      const data = await obtenerSubordenesTienda(tienda.idTienda);
      const ordenesOrdenadas = data.sort((a, b) => b.idSuborden - a.idSuborden);
      setVentas(ordenesOrdenadas);
    } catch {
      setError("Error al cargar las ventas.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!storeLoading && tienda) fetchVentas();
  }, [tienda, storeLoading]);

  const handleActualizarEstado = async (idSuborden, nuevoEstado) => {
    if (!window.confirm(`¿Seguro que deseas marcar esta orden como ${nuevoEstado}?`)) return;
    try {
      await actualizarEstadoSuborden(idSuborden, nuevoEstado);
      fetchVentas(); // Recargar la tabla
    } catch (err) {
      alert("Hubo un error al actualizar el estado.");
    }
  };

  if (storeLoading || loading) return <Spinner size="h-12 w-12" />;
  if (error) return <ErrorMessage message={error} />;

  if (!tienda) {
    return (
      <div className="p-6 text-center">
        <h2 className="text-xl font-bold text-gray-800">
          No tienes una tienda registrada
        </h2>
        <p className="mt-2 text-gray-500">
          Crea tu tienda para empezar a vender.
        </p>
        <Boton className="mt-4" onClick={() => { }}>
          Crear tienda
        </Boton>
      </div>
    );
  }

  const completadas = ventas.filter(
    (s) => s.estado === "COMPLETADA" || s.estado === "ENTREGADA",
  );
  const totalVentas = completadas.reduce(
    (sum, s) => sum + (s.totalVendedor || 0),
    0,
  );
  const pendientes = ventas.filter(
    (s) =>
      s.estado === "PENDIENTE" ||
      s.estado === "PAGADA" ||
      s.estado === "ENVIADA" ||
      s.estado === "EN_TRANSITO",
  );

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">
        Dashboard de Ventas
      </h1>

      {/* Tarjetas de resumen */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <div className="rounded-xl bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total ventas</p>
              <p className="text-2xl font-bold text-gray-800">
                {formatearPrecio(totalVentas)}
              </p>
            </div>
            <DollarSign className="h-8 w-8 text-green-500" />
          </div>
        </div>

        <div className="rounded-xl bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Completadas</p>
              <p className="text-2xl font-bold text-gray-800">
                {completadas.length}
              </p>
            </div>
            <CheckCircle className="h-8 w-8 text-violet-500" />
          </div>
        </div>

        <div className="rounded-xl bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Pendientes</p>
              <p className="text-2xl font-bold text-gray-800">
                {pendientes.length}
              </p>
            </div>
            <TrendingUp className="h-8 w-8 text-amber-500" />
          </div>
        </div>

        <div className="rounded-xl bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total órdenes</p>
              <p className="text-2xl font-bold text-gray-800">
                {ventas.length}
              </p>
            </div>
            <Package className="h-8 w-8 text-blue-500" />
          </div>
        </div>
      </div>

      {/* Tabla de ventas */}
      <div className="rounded-xl bg-white shadow-sm">
        <div className="border-b px-6 py-4">
          <h2 className="text-lg font-semibold text-gray-800">
            Historial de ventas
          </h2>
        </div>

        {ventas.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            No hay ventas registradas aún.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-gray-50 text-gray-600">
                <tr>
                  <th className="px-6 py-3 font-medium">ID</th>
                  <th className="px-6 py-3 font-medium">Fecha</th>
                  <th className="px-6 py-3 font-medium">Estado</th>
                  <th className="px-6 py-3 font-medium">Total</th>
                  <th className="px-6 py-3 font-medium text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {ventas.map((orden) => (
                  <tr key={orden.idSuborden} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-800">
                      #{orden.idSuborden}
                    </td>
                    <td className="px-6 py-4 text-gray-500">
                      {formatearFecha(orden.createdAt)}
                    </td>
                    <td className="px-6 py-4">
                      <Badge
                        variant={
                          estadoBadge[orden.estado] || "gray"
                        }
                      >
                        {formatearEstado(orden.estado)}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 font-semibold text-violet-600">
                      {formatearPrecio(orden.totalVendedor)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      {['PAGADA', 'EN_PREPARACION'].includes(orden.estado) && (
                        <button
                          onClick={() => handleActualizarEstado(orden.idSuborden, 'ENVIADA')}
                          className="text-xs bg-violet-100 text-violet-700 px-3 py-1.5 rounded-lg hover:bg-violet-200 font-medium transition"
                        >
                          Marcar Enviado
                        </button>
                      )}
                      {['ENVIADA', 'EN_TRANSITO'].includes(orden.estado) && (
                        <button
                          onClick={() => handleActualizarEstado(orden.idSuborden, 'ENTREGADA')}
                          className="text-xs bg-green-100 text-green-700 px-3 py-1.5 rounded-lg hover:bg-green-200 font-medium transition"
                        >
                          Marcar Entregado
                        </button>
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

export default DashboardVentas;
