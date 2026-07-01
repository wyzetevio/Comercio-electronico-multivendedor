import { useState, useEffect } from "react";
import { DollarSign, CheckCircle, XCircle, Banknote } from "lucide-react";

import Boton from "../../components/ui/Boton";
import Badge from "../../components/ui/Badge";
import Modal from "../../components/ui/Modal";
import Spinner from "../../components/ui/Spinner";
import ErrorMessage from "../../components/common/ErrorMessage";
import { obtenerVendedores } from "../../services/vendedorService";
import {
  obtenerLiquidacionesVendedor,
  marcarLiquidacionPagada,
  rechazarLiquidacion,
} from "../../services/liquidacionService";
import {
  formatearPrecio,
  formatearFecha,
  formatearEstado,
} from "../../utils/formatters";

const estadoBadge = {
  PENDIENTE: "warning",
  PAGADA: "success",
  RECHAZADA: "danger",
};

function DashboardLiquidaciones() {
  const [liquidaciones, setLiquidaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [confirmModal, setConfirmModal] = useState({
    open: false,
    title: "",
    message: "",
    onConfirm: null,
  });

  const fetchLiquidaciones = async () => {
    try {
      const vendedoresData = await obtenerVendedores();

      const todas = [];
      for (const v of vendedoresData) {
        try {
          const liquidacionesVendedor = await obtenerLiquidacionesVendedor(
            v.idVendedor,
          );
          if (Array.isArray(liquidacionesVendedor)) {
            todas.push(
              ...liquidacionesVendedor.map((l) => ({
                ...l,
                vendedorNombre: v.usuario?.nombres || "—",
                tiendaNombre: v.tienda?.nombreTienda || "—",
              })),
            );
          }
        } catch {
          // Vendedor sin liquidaciones
        }
      }
      setLiquidaciones(todas);
    } catch {
      setError("Error al cargar las liquidaciones.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchLiquidaciones();
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const handleAction = async (idLiquidacion, accion) => {
    try {
      if (accion === "pagar") {
        await marcarLiquidacionPagada(idLiquidacion);
      } else if (accion === "rechazar") {
        await rechazarLiquidacion(idLiquidacion);
      }
      await fetchLiquidaciones();
    } catch {
      setError("Error al procesar la liquidación.");
    }
    setConfirmModal({ open: false, title: "", message: "", onConfirm: null });
  };

  if (loading) return <Spinner size="h-12 w-12" />;

  const pendientes = liquidaciones.filter(
    (l) => l.estado === "PENDIENTE",
  );
  const pagadas = liquidaciones.filter(
    (l) => l.estado === "PAGADA",
  );
  const totalPendiente = pendientes.reduce(
    (sum, l) => sum + (l.monto || 0),
    0,
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Banknote className="h-7 w-7 text-red-600" />
        <h1 className="text-2xl font-bold text-gray-800">Liquidaciones</h1>
      </div>

      {error && <ErrorMessage message={error} />}

      {/* Resumen */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-xl bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Pendientes</p>
              <p className="text-2xl font-bold text-gray-800">
                {pendientes.length}
              </p>
            </div>
            <DollarSign className="h-8 w-8 text-amber-500" />
          </div>
        </div>

        <div className="rounded-xl bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Monto pendiente</p>
              <p className="text-2xl font-bold text-gray-800">
                {formatearPrecio(totalPendiente)}
              </p>
            </div>
            <Banknote className="h-8 w-8 text-red-500" />
          </div>
        </div>

        <div className="rounded-xl bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Pagadas</p>
              <p className="text-2xl font-bold text-gray-800">
                {pagadas.length}
              </p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-500" />
          </div>
        </div>
      </div>

      {/* Tabla de liquidaciones */}
      <div className="overflow-hidden rounded-xl bg-white shadow-sm">
        <div className="border-b px-6 py-4">
          <h2 className="text-lg font-semibold text-gray-800">
            Historial de liquidaciones
          </h2>
        </div>

        {liquidaciones.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            No hay liquidaciones registradas.
          </div>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="px-6 py-3 font-medium">ID</th>
                <th className="px-6 py-3 font-medium">Vendedor</th>
                <th className="px-6 py-3 font-medium">Tienda</th>
                <th className="px-6 py-3 font-medium">Monto</th>
                <th className="px-6 py-3 font-medium">Fecha</th>
                <th className="px-6 py-3 font-medium">Estado</th>
                <th className="px-6 py-3 font-medium">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {liquidaciones.map((l) => (
                <tr key={l.idLiquidacion} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-800">
                    #{l.idLiquidacion}
                  </td>
                  <td className="px-6 py-4 text-gray-700">
                    {l.vendedorNombre}
                  </td>
                  <td className="px-6 py-4 text-gray-500">
                    {l.tiendaNombre}
                  </td>
                  <td className="px-6 py-4 font-semibold text-violet-600">
                    {formatearPrecio(l.monto)}
                  </td>
                  <td className="px-6 py-4 text-gray-500">
                    {formatearFecha(l.fechaCreacion)}
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant={estadoBadge[l.estado] || "gray"}>
                      {formatearEstado(l.estado)}
                    </Badge>
                  </td>
                  <td className="px-6 py-4">
                    {l.estado === "PENDIENTE" && (
                      <div className="flex gap-2">
                        <Boton
                          variant="primary"
                          size="sm"
                          onClick={() =>
                            setConfirmModal({
                              open: true,
                              title: "Marcar como pagada",
                              message: `¿Confirmar pago de ${formatearPrecio(l.monto)} a ${l.vendedorNombre}?`,
                              onConfirm: () =>
                                handleAction(l.idLiquidacion, "pagar"),
                            })
                          }
                        >
                          <CheckCircle size={14} className="mr-1" />
                          Pagar
                        </Boton>
                        <Boton
                          variant="danger"
                          size="sm"
                          onClick={() =>
                            setConfirmModal({
                              open: true,
                              title: "Rechazar liquidación",
                              message: `¿Rechazar la liquidación de ${formatearPrecio(l.monto)} a ${l.vendedorNombre}?`,
                              onConfirm: () =>
                                handleAction(l.idLiquidacion, "rechazar"),
                            })
                          }
                        >
                          <XCircle size={14} className="mr-1" />
                          Rechazar
                        </Boton>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal de confirmación */}
      <Modal
        isOpen={confirmModal.open}
        title={confirmModal.title}
        onClose={() =>
          setConfirmModal({
            open: false,
            title: "",
            message: "",
            onConfirm: null,
          })
        }
        onConfirm={confirmModal.onConfirm}
        confirmText="Confirmar"
      >
        <p className="text-gray-600">{confirmModal.message}</p>
      </Modal>
    </div>
  );
}

export default DashboardLiquidaciones;
