import { useState, useEffect } from "react";
import { PackageSearch, CheckCircle, XCircle, Search, DollarSign, Eye, X } from "lucide-react";
import { obtenerTodasLasOrdenesAdmin, marcarOrdenPagada, completarOrden, cancelarOrden, obtenerDetallesOrden } from "../../services/ordenService";
import Spinner from "../../components/ui/Spinner";
import Boton from "../../components/ui/Boton";
import Badge from "../../components/ui/Badge";
import ErrorMessage from "../../components/common/ErrorMessage";

function GestionPedidosAdmin() {
  const [ordenes, setOrdenes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [busqueda, setBusqueda] = useState("");

  // Estado para el modal de detalles
  const [modalOpen, setModalOpen] = useState(false);
  const [ordenSeleccionada, setOrdenSeleccionada] = useState(null);
  const [detalles, setDetalles] = useState([]);
  const [loadingDetalles, setLoadingDetalles] = useState(false);

  const cargarOrdenes = async () => {
    setLoading(true);
    try {
      const data = await obtenerTodasLasOrdenesAdmin();
      setOrdenes(data);
    } catch (err) {
      setError("Error al cargar el historial de pedidos.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarOrdenes();
  }, []);

  const handleAccion = async (id, accion) => {
    if (!window.confirm(`¿Estás seguro que deseas ${accion} esta orden?`)) return;
    try {
      if (accion === "pagar") await marcarOrdenPagada(id);
      if (accion === "completar") await completarOrden(id);
      if (accion === "cancelar") await cancelarOrden(id);
      cargarOrdenes();
    } catch (err) {
      alert(`Hubo un error al ${accion} la orden.`);
    }
  };

  const verDetalles = async (orden) => {
    setOrdenSeleccionada(orden);
    setModalOpen(true);
    setLoadingDetalles(true);
    try {
      const data = await obtenerDetallesOrden(orden.idOrden);
      setDetalles(Array.isArray(data) ? data : []);
    } catch (err) {
      alert("No se pudieron cargar los detalles.");
    } finally {
      setLoadingDetalles(false);
    }
  };

  const ordenesFiltradas = ordenes.filter((o) => {
    const idMatch = o.idOrden.toString().includes(busqueda);
    const clienteMatch = o.usuario?.nombres?.toLowerCase().includes(busqueda.toLowerCase()) ||
      o.usuario?.apellidos?.toLowerCase().includes(busqueda.toLowerCase());
    return idMatch || clienteMatch;
  });

  if (loading) return <Spinner size="h-12 w-12" />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <PackageSearch className="h-7 w-7 text-red-600" />
          <h1 className="text-2xl font-bold text-gray-800">Historial Global de Pedidos</h1>
        </div>
      </div>

      <div className="rounded-xl bg-white p-6 shadow-sm">
        <div className="mb-6 flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por ID de orden o cliente..."
              className="w-full rounded-lg border border-gray-300 py-2.5 pl-10 pr-4 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </div>
          <Badge type="info">Total: {ordenesFiltradas.length} órdenes</Badge>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600 whitespace-nowrap">
            <thead className="bg-gray-50 text-gray-700">
              <tr>
                <th className="px-4 py-3 font-semibold">Orden #</th>
                <th className="px-4 py-3 font-semibold">Cliente</th>
                <th className="px-4 py-3 font-semibold">Fecha</th>
                <th className="px-4 py-3 font-semibold">Total</th>
                <th className="px-4 py-3 font-semibold">Estado</th>
                <th className="px-4 py-3 font-semibold text-right">Acciones Rápidas</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {ordenesFiltradas.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-4 py-8 text-center text-gray-500">
                    No se encontraron órdenes.
                  </td>
                </tr>
              ) : (
                ordenesFiltradas.map((orden) => (
                  <tr key={orden.idOrden} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-4 py-4 font-bold text-gray-900">#{orden.idOrden}</td>
                    <td className="px-4 py-4">
                      {orden.usuario ? `${orden.usuario.nombres} ${orden.usuario.apellidos}` : "Usuario Eliminado"}
                    </td>
                    <td className="px-4 py-4 text-gray-500">
                      {new Date(orden.createdAt).toLocaleString()}
                    </td>
                    <td className="px-4 py-4 font-medium text-gray-900">
                      S/ {orden.total.toFixed(2)}
                    </td>
                    <td className="px-4 py-4">
                      <Badge
                        type={
                          orden.estadoGeneral === "COMPLETADA" ? "success" :
                            orden.estadoGeneral === "CANCELADA" ? "error" :
                              orden.estadoGeneral === "PAGADA" ? "info" : "warning"
                        }
                      >
                        {orden.estadoGeneral}
                      </Badge>
                    </td>
                    <td className="px-4 py-4 flex justify-end gap-2">
                      <button
                        onClick={() => verDetalles(orden)}
                        className="p-1.5 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                        title="Ver Detalles"
                      >
                        <Eye size={20} />
                      </button>
                      {orden.estadoGeneral === "PENDIENTE" && (
                        <button
                          onClick={() => handleAccion(orden.idOrden, "pagar")}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Marcar Pagada"
                        >
                          <DollarSign size={20} />
                        </button>
                      )}
                      {(orden.estadoGeneral === "PENDIENTE" || orden.estadoGeneral === "PAGADA") && (
                        <>
                          <button
                            onClick={() => handleAccion(orden.idOrden, "cancelar")}
                            className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Cancelar Orden"
                          >
                            <XCircle size={20} />
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal de Detalles */}
      {modalOpen && ordenSeleccionada && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
            <div className="p-6 border-b flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-800">
                Detalles de Orden #{ordenSeleccionada.idOrden}
              </h2>
              <button
                onClick={() => setModalOpen(false)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 overflow-y-auto flex-1">
              <div className="mb-6 grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">Cliente</p>
                  <p className="font-semibold text-gray-900">{ordenSeleccionada.usuario?.nombres} {ordenSeleccionada.usuario?.apellidos}</p>
                </div>
                <div>
                  <p className="text-gray-500">Total de la Orden</p>
                  <p className="font-semibold text-red-600 text-lg">S/ {ordenSeleccionada.total.toFixed(2)}</p>
                </div>
              </div>

              <h3 className="font-semibold text-gray-700 mb-4 border-b pb-2">Productos Comprados</h3>

              {loadingDetalles ? (
                <div className="py-8 flex justify-center"><Spinner size="h-8 w-8" /></div>
              ) : detalles.length === 0 ? (
                <p className="text-center text-gray-500 py-4">No se encontraron detalles para esta orden.</p>
              ) : (
                <div className="space-y-4">
                  {detalles.map((det, idx) => (
                    <div key={det.idDetalle || idx} className="flex items-center gap-4 bg-gray-50 p-3 rounded-lg border border-gray-100 hover:shadow-sm transition-shadow">
                      <img
                        src={(det.producto?.imagenes && det.producto.imagenes.length > 0) ? det.producto.imagenes[0].url : (det.producto?.imagenPrincipal || "https://placehold.co/80?text=No+Image")}
                        alt={det.producto?.nombre || "Producto"}
                        className="w-16 h-16 object-cover rounded-md border bg-white"
                      />
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-800">{det.producto?.nombre || "Producto Desconocido"}</h4>
                        <p className="text-sm text-gray-500 line-clamp-1">{det.producto?.descripcionBreve || "Sin descripción"}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-gray-800">S/ {det.precioUnitario ? det.precioUnitario.toFixed(2) : "0.00"}</p>
                        <p className="text-sm text-gray-500 bg-gray-200 px-2 py-0.5 rounded-full inline-block mt-1">Cant: {det.cantidad || 1}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="p-4 border-t bg-gray-50 rounded-b-xl flex justify-end">
              <Boton onClick={() => setModalOpen(false)} variant="secondary">Cerrar Detalles</Boton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default GestionPedidosAdmin;
