import { useState, useEffect } from "react";
import { Wallet, ArrowUpRight, HandCoins, AlertCircle, RefreshCw, Clock } from "lucide-react";

import Boton from "../../components/ui/Boton";
import Badge from "../../components/ui/Badge";
import Spinner from "../../components/ui/Spinner";
import Alerta from "../../components/ui/Alerta";
import { useAuth } from "../../context/AuthContext";
import { useStore } from "../../context/StoreContext";
import { obtenerLiquidacionesVendedor, crearLiquidacion } from "../../services/liquidacionService";
import { formatearPrecio, formatearFecha } from "../../utils/formatters";

const estadoBadge = {
  PENDIENTE: "warning",
  PAGADA: "success",
  RECHAZADA: "danger",
};

function LiquidacionesVendedor() {
  const { user } = useAuth();
  const { tienda, loading: storeLoading } = useStore();
  const [liquidaciones, setLiquidaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [procesando, setProcesando] = useState(false);

  const fetchLiquidaciones = async () => {
    try {
      setLoading(true);
      const data = await obtenerLiquidacionesVendedor(tienda.vendedor.idVendedor);
      setLiquidaciones(data);
    } catch {
      setError("Error al cargar tus liquidaciones.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!storeLoading && tienda) {
      fetchLiquidaciones();
    } else {
      setLoading(false);
    }
  }, [tienda, storeLoading, user.idUsuario]);

  const solicitarPago = async () => {
    setError(null);
    setSuccess(null);
    setProcesando(true);
    try {
      await crearLiquidacion(tienda.idTienda);
      await fetchLiquidaciones();
      setSuccess("Solicitud de liquidación enviada al administrador exitosamente.");
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Error: No tienes ventas entregadas pendientes por liquidar o ya tienes una solicitud en proceso.");
      setTimeout(() => setError(null), 3000);
    } finally {
      setProcesando(false);
    }
  };

  if (storeLoading || loading) return <Spinner size="h-12 w-12" />;

  if (!tienda) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-white rounded-2xl shadow-sm border border-gray-100">
        <Wallet className="h-16 w-16 text-gray-300 mb-4" />
        <h2 className="text-xl font-bold text-gray-800">Tienda no encontrada</h2>
        <p className="text-gray-500 mt-2">Crea tu tienda para recibir tus pagos.</p>
      </div>
    );
  }

  const totalPagado = liquidaciones
    .filter(l => l.estadoPago === "PAGADA" || l.estadoPago === "PAGADO")
    .reduce((sum, l) => sum + (l.montoTotal || 0), 0);

  const totalPendiente = liquidaciones
    .filter(l => l.estadoPago === "PENDIENTE")
    .reduce((sum, l) => sum + (l.montoTotal || 0), 0);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Mis Liquidaciones</h1>
        <p className="text-gray-500 mt-1">Gestiona el retiro de tus ganancias hacia tu cuenta bancaria.</p>
      </div>

      {error && <Alerta message={error} type="error" />}
      {success && <Alerta message={success} type="success" />}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl p-6 text-white shadow-lg shadow-amber-500/20">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-white/20 rounded-xl">
              <HandCoins size={24} />
            </div>
            <span className="text-amber-100 text-sm font-medium">Ganancias Pagadas</span>
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight">{formatearPrecio(totalPagado)}</h2>
          <p className="text-amber-100 mt-2 text-sm flex items-center gap-1">
            <ArrowUpRight size={16} /> Total histórico transferido
          </p>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-gray-50 rounded-xl text-gray-500">
              <Clock size={24} />
            </div>
            <span className="text-gray-500 text-sm font-medium">Pagos en Proceso</span>
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight text-gray-900">{formatearPrecio(totalPendiente)}</h2>
          <p className="text-gray-500 mt-2 text-sm flex items-center gap-1">
            <AlertCircle size={16} /> Solicitudes pendientes de revisión
          </p>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm flex flex-col justify-center items-center text-center">
          <Wallet size={32} className="text-gray-300 mb-3" />
          <h3 className="text-gray-800 font-semibold mb-1">¿Tienes ventas nuevas?</h3>
          <p className="text-sm text-gray-500 mb-4">Solicita la liquidación de tu saldo disponible.</p>
          <Boton
            onClick={solicitarPago}
            disabled={procesando}
            className="w-full bg-amber-500 hover:bg-amber-600 text-white flex items-center justify-center gap-2"
          >
            {procesando ? <RefreshCw className="animate-spin" size={16} /> : <HandCoins size={16} />}
            Solicitar Pago
          </Boton>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
        <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center">
          <h3 className="font-bold text-gray-800">Historial de Solicitudes</h3>
        </div>

        {liquidaciones.length === 0 ? (
          <div className="p-10 text-center">
            <p className="text-gray-500">No hay liquidaciones registradas.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-gray-50/50 text-gray-500">
                <tr>
                  <th className="px-6 py-4 font-semibold">ID</th>
                  <th className="px-6 py-4 font-semibold">Fecha</th>
                  <th className="px-6 py-4 font-semibold">Estado</th>
                  <th className="px-6 py-4 font-semibold text-right">Monto Depositado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {liquidaciones.map((liq) => (
                  <tr key={liq.idLiquidacion} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 font-bold text-gray-900">
                      LIQ-{liq.idLiquidacion.toString().padStart(5, '0')}
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {formatearFecha(liq.createdAt)}
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={estadoBadge[liq.estadoPago] || "gray"}>
                        {liq.estadoPago}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 font-bold text-gray-900 text-right">
                      {formatearPrecio(liq.montoTotal)}
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

export default LiquidacionesVendedor;
