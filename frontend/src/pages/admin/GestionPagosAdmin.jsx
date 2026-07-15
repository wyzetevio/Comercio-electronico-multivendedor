import { useState, useEffect } from "react";
import { CreditCard, CheckCircle, Clock } from "lucide-react";
import Boton from "../../components/ui/Boton";
import Badge from "../../components/ui/Badge";
import Spinner from "../../components/ui/Spinner";
import ErrorMessage from "../../components/common/ErrorMessage";
import { obtenerTodosLosPagos, aprobarPago } from "../../services/pagoService";
import { formatearPrecio, formatearFechaHora } from "../../utils/formatters";

function GestionPagosAdmin() {
  const [pagos, setPagos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPagos();
  }, []);

  const fetchPagos = async () => {
    setLoading(true);
    try {
      const data = await obtenerTodosLosPagos();
      // Ordenar por fecha descendente
      const ordenados = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setPagos(ordenados);
    } catch {
      setError("Error al cargar la lista de pagos.");
    } finally {
      setLoading(false);
    }
  };

  const handleAprobar = async (idPago) => {
    try {
      await aprobarPago(idPago);
      // Actualizar el estado local
      setPagos((prev) =>
        prev.map((pago) =>
          pago.idPago === idPago ? { ...pago, estado: "APROBADO" } : pago
        )
      );
    } catch {
      alert("Error al aprobar el pago");
    }
  };

  const getEstadoBadge = (estado) => {
    switch (estado) {
      case "PENDIENTE":
        return "warning";
      case "APROBADO":
        return "success";
      case "RECHAZADO":
        return "danger";
      case "REEMBOLSADO":
        return "gray";
      default:
        return "gray";
    }
  };

  if (loading) return <Spinner size="h-12 w-12" />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-3">
          <CreditCard className="text-red-600" /> Gestión de Pagos
        </h1>
        <Badge variant="primary" className="px-4 py-1.5 text-sm">
          {pagos.length} Pagos Registrados
        </Badge>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {pagos.length === 0 ? (
          <div className="p-12 text-center flex flex-col items-center">
            <Clock className="h-12 w-12 text-gray-300 mb-3" />
            <p className="text-gray-500 font-medium">No hay pagos registrados en el sistema.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-gray-50/50 text-gray-500 border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4 font-semibold">N° Pago / Orden</th>
                  <th className="px-6 py-4 font-semibold">Fecha</th>
                  <th className="px-6 py-4 font-semibold">Método</th>
                  <th className="px-6 py-4 font-semibold">Monto</th>
                  <th className="px-6 py-4 font-semibold">Estado</th>
                  <th className="px-6 py-4 font-semibold text-right">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {pagos.map((pago) => (
                  <tr key={pago.idPago} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 text-gray-900">
                      <div className="font-bold">Pago #{pago.idPago}</div>
                      <div className="text-xs text-gray-500">Orden #{pago.orden?.idOrden}</div>
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {formatearFechaHora(pago.createdAt)}
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-medium text-gray-700">{pago.metodoPago}</span>
                    </td>
                    <td className="px-6 py-4 font-bold text-green-600">
                      {formatearPrecio(pago.montoTotal)}
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={getEstadoBadge(pago.estado)} className="shadow-sm">
                        {pago.estado}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {pago.estado === "PENDIENTE" ? (
                        <Boton
                          className="bg-green-600 hover:bg-green-700 shadow-green-500/20 text-xs py-2 px-4"
                          onClick={() => handleAprobar(pago.idPago)}
                        >
                          <CheckCircle className="h-3 w-3 mr-1.5 inline" />
                          Aprobar
                        </Boton>
                      ) : (
                        <span className="text-gray-400 text-xs font-semibold">
                          Sin acción
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

export default GestionPagosAdmin;
