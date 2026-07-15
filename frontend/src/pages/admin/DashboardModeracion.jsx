import { useState, useEffect } from "react";
import {
  Shield,
  CheckCircle,
  XCircle,
  Users,
  Package,
} from "lucide-react";

import Boton from "../../components/ui/Boton";
import Badge from "../../components/ui/Badge";
import Modal from "../../components/ui/Modal";
import Spinner from "../../components/ui/Spinner";
import ErrorMessage from "../../components/common/ErrorMessage";
import { obtenerProductos } from "../../services/productoService";
import {
  obtenerVendedores,
  verificarVendedor,
  suspenderVendedor,
  activarVendedor,
} from "../../services/vendedorService";
import { activarProducto, desactivarProducto } from "../../services/productoService";
import { formatearPrecio } from "../../utils/formatters";

function DashboardModeracion() {
  const [vendedores, setVendedores] = useState([]);
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tab, setTab] = useState("productos");
  const [confirmModal, setConfirmModal] = useState({
    open: false,
    title: "",
    message: "",
    onConfirm: null,
  });

  const fetchData = async () => {
    try {
      const [vendedoresData, productosData] = await Promise.all([
        obtenerVendedores(),
        obtenerProductos(),
      ]);
      setVendedores(vendedoresData);
      setProductos(productosData);
    } catch {
      setError("Error al cargar los datos de moderación.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchData();
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const confirmAction = (title, message, onConfirm) => {
    setConfirmModal({ open: true, title, message, onConfirm });
  };

  const handleToggleProducto = async (producto) => {
    try {
      if (producto.estado !== false) {
        await desactivarProducto(producto.idProducto);
      } else {
        await activarProducto(producto.idProducto);
      }
      await fetchData();
    } catch {
      setError("Error al cambiar estado del producto.");
    }
    setConfirmModal({ open: false, title: "", message: "", onConfirm: null });
  };

  const handleVendedorAction = async (vendedor, accion) => {
    try {
      if (accion === "verificar") await verificarVendedor(vendedor.idVendedor);
      else if (accion === "suspender") await suspenderVendedor(vendedor.idVendedor);
      else if (accion === "activar") await activarVendedor(vendedor.idVendedor);
      await fetchData();
    } catch {
      setError("Error al actualizar el vendedor.");
    }
    setConfirmModal({ open: false, title: "", message: "", onConfirm: null });
  };

  if (loading) return <Spinner size="h-12 w-12" />;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Shield className="h-7 w-7 text-red-600" />
        <h1 className="text-2xl font-bold text-gray-800">Moderación</h1>
      </div>

      {error && <ErrorMessage message={error} />}

      {/* Tabs */}
      <div className="flex gap-2">
        <Boton
          variant={tab === "productos" ? "primary" : "secondary"}
          onClick={() => setTab("productos")}
          className="flex items-center gap-2"
        >
          <Package size={16} />
          Productos ({productos.length})
        </Boton>
        <Boton
          variant={tab === "vendedores" ? "primary" : "secondary"}
          onClick={() => setTab("vendedores")}
          className="flex items-center gap-2"
        >
          <Users size={16} />
          Vendedores ({vendedores.length})
        </Boton>
      </div>

      {/* Tabla de productos */}
      {tab === "productos" && (
        <div className="overflow-hidden rounded-xl bg-white shadow-sm">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="px-6 py-3 font-medium">Producto</th>
                <th className="px-6 py-3 font-medium">Tienda</th>
                <th className="px-6 py-3 font-medium">Precio</th>
                <th className="px-6 py-3 font-medium">Estado</th>
                <th className="px-6 py-3 font-medium">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {productos.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                    No hay productos registrados.
                  </td>
                </tr>
              ) : (
                productos.map((p) => (
                  <tr key={p.idProducto} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {p.imagenPrincipal && (
                          <img
                            src={p.imagenPrincipal}
                            alt={p.nombre}
                            className="h-10 w-10 rounded object-cover"
                          />
                        )}
                        <div>
                          <p className="font-medium text-gray-800">
                            {p.nombre}
                          </p>
                          <p className="text-xs text-gray-400">
                            {p.categoria?.nombre}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-500">
                      {p.tienda?.nombreTienda || "—"}
                    </td>
                    <td className="px-6 py-4 font-semibold text-violet-600">
                      {formatearPrecio(p.precio)}
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={p.estado !== false ? "success" : "gray"}>
                        {p.estado !== false ? "Activo" : "Inactivo"}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <Boton
                        variant={p.estado !== false ? "danger" : "primary"}
                        size="sm"
                        onClick={() => {
                          const accion = p.estado !== false ? "desactivar" : "activar";
                          confirmAction(
                            `${accion === "desactivar" ? "Desactivar" : "Activar"} producto`,
                            `¿Estás seguro de ${accion === "desactivar" ? "desactivar" : "activar"} "${p.nombre}"?`,
                            () => handleToggleProducto(p),
                          );
                        }}
                      >
                        {p.estado !== false ? "Desactivar" : "Activar"}
                      </Boton>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Tabla de vendedores */}
      {tab === "vendedores" && (
        <div className="overflow-hidden rounded-xl bg-white shadow-sm">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="px-6 py-3 font-medium">Vendedor</th>
                <th className="px-6 py-3 font-medium">Contacto</th>
                <th className="px-6 py-3 font-medium">Estado</th>
                <th className="px-6 py-3 font-medium">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {vendedores.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                    No hay vendedores registrados.
                  </td>
                </tr>
              ) : (
                vendedores.map((v) => (
                  <tr key={v.idVendedor} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-800">
                      {v.usuario?.nombres || "—"}
                    </td>
                    <td className="px-6 py-4 text-gray-500">
                      {v.usuario?.email || "—"}
                    </td>
                    <td className="px-6 py-4">
                      {v.estadoVerificacion ? (
                        <Badge variant="success">Verificado</Badge>
                      ) : v.activo === false ? (
                        <Badge variant="danger">Suspendido</Badge>
                      ) : (
                        <Badge variant="warning">Pendiente</Badge>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        {!v.estadoVerificacion && v.activo !== false && (
                          <Boton
                            variant="primary"
                            size="sm"
                            onClick={() =>
                              confirmAction(
                                "Verificar vendedor",
                                `¿Verificar a "${v.usuario?.nombres}" como vendedor?`,
                                () => handleVendedorAction(v, "verificar"),
                              )
                            }
                          >
                            <CheckCircle size={14} className="mr-1" />
                            Verificar
                          </Boton>
                        )}
                        {v.activo !== false && (
                          <Boton
                            variant="danger"
                            size="sm"
                            onClick={() =>
                              confirmAction(
                                "Suspender vendedor",
                                `¿Suspender a "${v.usuario?.nombres}"?`,
                                () => handleVendedorAction(v, "suspender"),
                              )
                            }
                          >
                            <XCircle size={14} className="mr-1" />
                            Suspender
                          </Boton>
                        )}
                        {v.activo === false && (
                          <Boton
                            variant="primary"
                            size="sm"
                            onClick={() =>
                              confirmAction(
                                "Activar vendedor",
                                `¿Activar a "${v.usuario?.nombres}" nuevamente?`,
                                () => handleVendedorAction(v, "activar"),
                              )
                            }
                          >
                            <CheckCircle size={14} className="mr-1" />
                            Activar
                          </Boton>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

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

export default DashboardModeracion;
