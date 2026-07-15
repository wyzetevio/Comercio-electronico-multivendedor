import { useState, useEffect } from "react";
import { Package, ChevronDown, ChevronUp, ShieldCheck, CheckCircle2, Clock } from "lucide-react";

import Badge from "../../components/ui/Badge";
import Spinner from "../../components/ui/Spinner";
import EmptyState from "../../components/common/EmptyState";
import ErrorMessage from "../../components/common/ErrorMessage";
import { useAuth } from "../../context/AuthContext";
import { obtenerOrdenesUsuario, obtenerDetallesOrden } from "../../services/ordenService";
import {
  formatearPrecio,
  formatearFechaHora,
  formatearEstado,
} from "../../utils/formatters";

// Componente para cargar los detalles (productos con imágenes) al expandir
const ListaProductosOrden = ({ idOrden, subordenesBackup }) => {
  const [detalles, setDetalles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetalles = async () => {
      try {
        const data = await obtenerDetallesOrden(idOrden);
        setDetalles(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error al cargar detalles", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDetalles();
  }, [idOrden]);

  if (loading) return <div className="py-4 text-center text-sm text-gray-500"><Spinner size="h-5 w-5" /> Cargando productos...</div>;

  if (detalles.length === 0) {
    // Fallback a subordenes si no hay detalles
    return (
      <div className="divide-y text-sm">
        {subordenesBackup?.map((sub, idx) => (
          <div key={idx} className="flex items-center justify-between py-2">
            <span className="text-gray-700">Suborden #{sub.idSuborden} - {sub.tienda?.nombreTienda}</span>
            <span className="text-gray-500">{formatearEstado(sub.estado)} — {formatearPrecio(sub.total)}</span>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="divide-y text-sm">
      {detalles.map((det, idx) => {
        const imgUrl = (det.producto?.imagenes && det.producto.imagenes.length > 0)
          ? det.producto.imagenes[0].url
          : (det.producto?.imagenPrincipal || "https://placehold.co/80?text=No+Image");

        return (
          <div key={det.idDetalle || idx} className="flex items-center justify-between py-3">
            <div className="flex items-center gap-3">
              <img src={imgUrl} alt={det.producto?.nombre} className="h-12 w-12 rounded-lg object-cover border" />
              <div>
                <p className="font-semibold text-gray-800">{det.producto?.nombre || "Producto"}</p>
                <p className="text-xs text-gray-500 line-clamp-1">{det.producto?.descripcionBreve || "Vendido por Pochita Store"}</p>
              </div>
            </div>
            <div className="text-right">
              <span className="font-bold text-gray-900 block">{formatearPrecio(det.precioUnitario || det.producto?.precio || 0)}</span>
              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">Cant: {det.cantidad || 1}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

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
                  <div className="border-t px-4 py-5 bg-gray-50/30">
                    
                    {/* Stepper de Estado */}
                    <div className="mb-8">
                      <h3 className="font-bold text-gray-900 mb-6 flex items-center gap-2 text-sm px-2">
                        <ShieldCheck className="text-violet-600" size={18} /> Estado del pedido
                      </h3>

                      <div className="relative pl-6 space-y-6">
                        {/* Línea conectora */}
                        <div className="absolute left-[31px] top-4 bottom-4 w-px bg-gray-200"></div>

                        {/* Paso 1: Confirmado */}
                        <div className={`relative flex items-start gap-4 ${orden.estadoGeneral === 'CANCELADA' ? 'opacity-50' : ''}`}>
                          <div className={`h-5 w-5 rounded-full ${orden.estadoGeneral !== 'CANCELADA' ? 'bg-violet-600 text-white shadow-md' : 'bg-gray-200 text-gray-400'} flex items-center justify-center shrink-0 z-10`}>
                            {orden.estadoGeneral !== 'CANCELADA' ? <CheckCircle2 size={12} /> : <span className="text-[10px] font-bold">1</span>}
                          </div>
                          <div className="-mt-1">
                            <p className={`font-bold text-sm ${orden.estadoGeneral !== 'CANCELADA' ? 'text-violet-700' : 'text-gray-500'}`}>Pedido confirmado</p>
                            <p className="text-xs text-gray-400 mt-0.5">{formatearFechaHora(orden.createdAt)}</p>
                          </div>
                        </div>

                        {/* Paso 2: En preparación */}
                        <div className={`relative flex items-start gap-4 ${['PENDIENTE', 'PENDIENTE_PAGO', 'CANCELADA'].includes(orden.estadoGeneral) ? 'opacity-50' : ''}`}>
                          <div className={`h-5 w-5 rounded-full ${!['PENDIENTE', 'PENDIENTE_PAGO', 'CANCELADA'].includes(orden.estadoGeneral) ? 'bg-violet-600 text-white shadow-md' : 'bg-gray-100 border-2 border-gray-200 text-gray-400'} flex items-center justify-center shrink-0 z-10`}>
                             {!['PENDIENTE', 'PENDIENTE_PAGO', 'CANCELADA'].includes(orden.estadoGeneral) ? <CheckCircle2 size={12} /> : <span className="text-[10px] font-bold">2</span>}
                          </div>
                          <div className="-mt-1">
                            <p className={`font-bold text-sm ${!['PENDIENTE', 'PENDIENTE_PAGO', 'CANCELADA'].includes(orden.estadoGeneral) ? 'text-violet-700' : 'text-gray-500'}`}>En preparación</p>
                            <p className="text-xs text-gray-400 mt-0.5">Vendedor alistando paquete</p>
                          </div>
                        </div>

                        {/* Paso 3: En camino */}
                        <div className={`relative flex items-start gap-4 ${['PENDIENTE', 'PENDIENTE_PAGO', 'PAGADA', 'EN_PREPARACION', 'CANCELADA'].includes(orden.estadoGeneral) ? 'opacity-50' : ''}`}>
                          <div className={`h-5 w-5 rounded-full ${!['PENDIENTE', 'PENDIENTE_PAGO', 'PAGADA', 'EN_PREPARACION', 'CANCELADA'].includes(orden.estadoGeneral) ? 'bg-violet-600 text-white shadow-md' : 'bg-gray-100 border-2 border-gray-200 text-gray-400'} flex items-center justify-center shrink-0 z-10`}>
                             {!['PENDIENTE', 'PENDIENTE_PAGO', 'PAGADA', 'EN_PREPARACION', 'CANCELADA'].includes(orden.estadoGeneral) ? <CheckCircle2 size={12} /> : <span className="text-[10px] font-bold">3</span>}
                          </div>
                          <div className="-mt-1">
                            <p className={`font-bold text-sm ${!['PENDIENTE', 'PENDIENTE_PAGO', 'PAGADA', 'EN_PREPARACION', 'CANCELADA'].includes(orden.estadoGeneral) ? 'text-violet-700' : 'text-gray-500'}`}>En camino</p>
                            <p className="text-xs text-gray-400 mt-0.5">En manos del transportista</p>
                          </div>
                        </div>

                        {/* Paso 4: Entregado */}
                        <div className={`relative flex items-start gap-4 ${!['ENTREGADA', 'COMPLETADA'].includes(orden.estadoGeneral) ? 'opacity-50' : ''}`}>
                          <div className={`h-5 w-5 rounded-full ${['ENTREGADA', 'COMPLETADA'].includes(orden.estadoGeneral) ? 'bg-[#1EC971] text-white shadow-md' : 'bg-gray-100 border-2 border-gray-200 text-gray-400'} flex items-center justify-center shrink-0 z-10`}>
                            {['ENTREGADA', 'COMPLETADA'].includes(orden.estadoGeneral) ? <CheckCircle2 size={12} /> : <span className="text-[10px] font-bold">4</span>}
                          </div>
                          <div className="-mt-1">
                            <p className={`font-bold text-sm ${['ENTREGADA', 'COMPLETADA'].includes(orden.estadoGeneral) ? 'text-[#1EC971]' : 'text-gray-500'}`}>Pedido entregado</p>
                            <p className="text-xs text-gray-400 mt-0.5">¡Gracias por tu compra!</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <h4 className="font-bold text-gray-900 mb-3 text-sm px-2 flex items-center gap-2"><Package size={16} className="text-gray-400"/> Productos incluidos</h4>

                    <ListaProductosOrden idOrden={orden.idOrden} subordenesBackup={orden.subordenes} />
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
