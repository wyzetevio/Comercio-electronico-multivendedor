import { useState, useEffect } from "react";
import { Plus, Pencil, ToggleLeft, ToggleRight } from "lucide-react";

import Boton from "../../components/ui/Boton";
import Badge from "../../components/ui/Badge";
import Modal from "../../components/ui/Modal";
import Input from "../../components/ui/Input";
import Alerta from "../../components/ui/Alerta";
import Spinner from "../../components/ui/Spinner";
import EmptyState from "../../components/common/EmptyState";
import ErrorMessage from "../../components/common/ErrorMessage";
import { useStore } from "../../context/StoreContext";
import {
  obtenerProductosTienda,
  crearProducto,
  actualizarProducto,
  desactivarProducto,
  activarProducto,
} from "../../services/productoService";
import { obtenerCategorias } from "../../services/categoriaService";
import { formatearPrecio } from "../../utils/formatters";
import {
  esRequerido,
  validarNombre,
  validarDescripcion,
  validarPrecio,
  validarStock,
} from "../../utils/validators";

const stockBadge = {
  AVAILABLE: { text: "Disponible", variant: "success" },
  LOW_STOCK: { text: "Poco stock", variant: "warning" },
  OUT_OF_STOCK: { text: "Agotado", variant: "danger" },
};

function DashboardProductos() {
  const { tienda, loading: storeLoading } = useStore();
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editando, setEditando] = useState(null);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");

  const [form, setForm] = useState({
    nombre: "",
    descripcion: "",
    marca: "",
    precio: "",
    stock: "",
    idCategoria: "",
    imagenPrincipal: "",
  });

  const resetForm = () => {
    setForm({
      nombre: "",
      descripcion: "",
      marca: "",
      precio: "",
      stock: "",
      idCategoria: "",
      imagenPrincipal: "",
    });
    setEditando(null);
    setFormError("");
  };

  const openCreate = () => {
    resetForm();
    setModalOpen(true);
  };

  const openEdit = (producto) => {
    setForm({
      nombre: producto.nombre || "",
      descripcion: producto.descripcion || "",
      marca: producto.marca || "",
      precio: producto.precio?.toString() || "",
      stock: producto.stock?.toString() || "",
      idCategoria: producto.categoria?.idCategoria?.toString() || "",
      imagenPrincipal: producto.imagenPrincipal || "",
    });
    setEditando(producto);
    setModalOpen(true);
  };

  const fetchProductos = async () => {
    if (!tienda?.idTienda) {
      setLoading(false);
      return;
    }
    try {
      const [productosData, categoriasData] = await Promise.all([
        obtenerProductosTienda(tienda.idTienda, true),
        obtenerCategorias(),
      ]);
      setProductos(productosData);
      setCategorias(categoriasData);
    } catch {
      setError("Error al cargar los productos.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!storeLoading) fetchProductos();
    }, 0);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tienda, storeLoading]);

  const handleChange = (campo) => (e) => {
    setForm((prev) => ({ ...prev, [campo]: e.target.value }));
  };

  const handleSave = async () => {
    setFormError("");

    if (!esRequerido(form.nombre) || !validarNombre(form.nombre)) {
      setFormError("El nombre debe tener al menos 3 caracteres.");
      return;
    }
    if (!esRequerido(form.descripcion) || !validarDescripcion(form.descripcion)) {
      setFormError("La descripción debe tener al menos 10 caracteres.");
      return;
    }
    if (!validarPrecio(form.precio)) {
      setFormError("Ingrese un precio válido mayor a 0.");
      return;
    }
    if (!validarStock(form.stock)) {
      setFormError("El stock debe ser un número entero no negativo.");
      return;
    }
    if (!form.idCategoria) {
      setFormError("Seleccione una categoría.");
      return;
    }

    setSaving(true);
    try {
      const payload = {
        nombre: form.nombre,
        descripcion: form.descripcion,
        marca: form.marca,
        precio: Number(form.precio),
        stock: Number(form.stock),
        imagenPrincipal: form.imagenPrincipal || undefined,
      };
      if (editando) {
        await actualizarProducto(editando.idProducto, form.idCategoria, payload);
      } else {
        await crearProducto(
          tienda.idTienda,
          Number(form.idCategoria),
          payload,
        );
      }

      setModalOpen(false);
      resetForm();
      await fetchProductos();
    } catch (err) {
      setFormError(
        err.response?.data?.message || "Error al guardar el producto.",
      );
    } finally {
      setSaving(false);
    }
  };

  const handleToggle = async (producto) => {
    try {
      if (producto.estado === false) {
        await activarProducto(producto.idProducto);
      } else {
        await desactivarProducto(producto.idProducto);
      }
      await fetchProductos();
    } catch {
      setError("Error al cambiar el estado del producto.");
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
          Crea tu tienda para empezar a gestionar productos.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Mis Productos</h1>
        <Boton onClick={openCreate} className="flex items-center gap-2">
          <Plus size={18} />
          Nuevo producto
        </Boton>
      </div>

      {productos.length === 0 ? (
        <div className="rounded-xl bg-white p-12 shadow-sm">
          <EmptyState message="No tienes productos registrados." />
          <div className="mt-4 text-center">
            <Boton onClick={openCreate}>Crear primer producto</Boton>
          </div>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl bg-white shadow-sm">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="px-6 py-3 font-medium">Producto</th>
                <th className="px-6 py-3 font-medium">Categoría</th>
                <th className="px-6 py-3 font-medium">Stock</th>
                <th className="px-6 py-3 font-medium">Precio</th>
                <th className="px-6 py-3 font-medium">Estado</th>
                <th className="px-6 py-3 font-medium">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {productos.map((p) => {
                const badge =
                  stockBadge[p.stockStatus] || stockBadge.AVAILABLE;
                return (
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
                        <span className="font-medium text-gray-800">
                          {p.nombre}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-500">
                      {p.categoria?.nombre || "—"}
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={badge.variant}>
                        {badge.text} ({p.stock})
                      </Badge>
                    </td>
                    <td className="px-6 py-4 font-semibold text-violet-600">
                      {formatearPrecio(p.precio)}
                    </td>
                    <td className="px-6 py-4">
                      <Badge
                        variant={p.estado !== false ? "success" : "gray"}
                      >
                        {p.estado !== false ? "Activo" : "Inactivo"}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Boton
                          variant="ghost"
                          onClick={() => openEdit(p)}
                          title="Editar"
                        >
                          <Pencil size={16} />
                        </Boton>
                        <Boton
                          variant="ghost"
                          onClick={() => handleToggle(p)}
                          title={
                            p.estado !== false
                              ? "Desactivar"
                              : "Activar"
                          }
                        >
                          {p.estado !== false ? (
                            <ToggleRight
                              size={18}
                              className="text-green-600"
                            />
                          ) : (
                            <ToggleLeft
                              size={18}
                              className="text-gray-400"
                            />
                          )}
                        </Boton>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal crear/editar producto */}
      <Modal
        isOpen={modalOpen}
        title={editando ? "Editar producto" : "Nuevo producto"}
        onClose={() => {
          setModalOpen(false);
          resetForm();
        }}
        onConfirm={handleSave}
        confirmText={saving ? "Guardando..." : "Guardar"}
      >
        {formError && (
          <div className="mb-4">
            <Alerta message={formError} type="error" />
          </div>
        )}
        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Nombre del producto
            </label>
            <Input
              value={form.nombre}
              onChange={handleChange("nombre")}
              placeholder="Nombre del producto"
            />
          </div>
          {/* AÑADE ESTE NUEVO BLOQUE COMPLETO AQUÍ: */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Marca del producto
            </label>
            <Input
              value={form.marca}
              onChange={handleChange("marca")}
              placeholder="Ej. Apple, Samsung, HP (opcional)"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Descripción
            </label>
            <textarea
              className="w-full rounded-lg border px-3 py-2 outline-none focus:border-violet-500"
              rows={3}
              value={form.descripcion}
              onChange={handleChange("descripcion")}
              placeholder="Descripción del producto"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Precio (S/)
              </label>
              <Input
                type="number"
                step="0.01"
                min="0"
                value={form.precio}
                onChange={handleChange("precio")}
                placeholder="0.00"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Stock
              </label>
              <Input
                type="number"
                min="0"
                value={form.stock}
                onChange={handleChange("stock")}
                placeholder="0"
              />
            </div>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Categoría
            </label>
            <select
              className="w-full rounded-lg border px-3 py-2 outline-none focus:border-violet-500"
              value={form.idCategoria}
              onChange={handleChange("idCategoria")}
            >
              <option value="">Seleccione una categoría</option>
              {categorias.map((cat) => (
                <option key={cat.idCategoria} value={cat.idCategoria}>
                  {cat.nombre}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              URL de imagen (opcional)
            </label>
            <Input
              value={form.imagenPrincipal}
              onChange={handleChange("imagenPrincipal")}
              placeholder="https://..."
            />
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default DashboardProductos;
