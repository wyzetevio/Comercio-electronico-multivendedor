import { useState, useEffect } from "react";
import { Tags, Plus, Edit2, Trash2, Save, X } from "lucide-react";

import Boton from "../../components/ui/Boton";
import Input from "../../components/ui/Input";
import Spinner from "../../components/ui/Spinner";
import Alerta from "../../components/ui/Alerta";
import {
  obtenerCategorias,
  crearCategoria,
  actualizarCategoria,
  desactivarCategoria,
} from "../../services/categoriaService";

function GestionCategorias() {
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [editando, setEditando] = useState(null);
  const [form, setForm] = useState({ nombre: "", descripcion: "" });
  const [isCreando, setIsCreando] = useState(false);

  const fetchCategorias = async () => {
    try {
      const data = await obtenerCategorias();
      setCategorias(data);
    } catch {
      setError("Error al cargar las categorías.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategorias();
  }, []);

  const handleChange = (campo) => (e) => {
    setForm((prev) => ({ ...prev, [campo]: e.target.value }));
  };

  const handleGuardar = async () => {
    setError("");
    setSuccess("");
    if (!form.nombre.trim() || !form.descripcion.trim()) {
      setError("El nombre y la descripción son obligatorios.");
      return;
    }

    try {
      if (isCreando) {
        await crearCategoria({ nombre: form.nombre, descripcion: form.descripcion });
        setSuccess("Categoría creada exitosamente.");
      } else if (editando) {
        await actualizarCategoria(editando.idCategoria, {
          nombre: form.nombre,
          descripcion: form.descripcion,
        });
        setSuccess("Categoría actualizada.");
      }
      setEditando(null);
      setIsCreando(false);
      setForm({ nombre: "", descripcion: "" });
      fetchCategorias();
    } catch (err) {
      setError(err.response?.data?.message || "Error al guardar la categoría.");
    }
  };

  const handleDesactivar = async (id) => {
    try {
      await desactivarCategoria(id);
      setSuccess("Categoría desactivada exitosamente.");
      fetchCategorias();
    } catch {
      setError("Error al desactivar la categoría.");
    }
  };

  const iniciarEdicion = (cat) => {
    setEditando(cat);
    setIsCreando(false);
    setForm({ nombre: cat.nombre, descripcion: cat.descripcion });
  };

  const iniciarCreacion = () => {
    setIsCreando(true);
    setEditando(null);
    setForm({ nombre: "", descripcion: "" });
  };

  const cancelarFormulario = () => {
    setIsCreando(false);
    setEditando(null);
    setForm({ nombre: "", descripcion: "" });
    setError("");
  };

  if (loading) return <Spinner size="h-12 w-12" />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
            <Tags className="text-red-600" />
            Gestión de Categorías
          </h1>
          <p className="text-gray-500 mt-1">
            Crea o modifica las categorías disponibles para el catálogo.
          </p>
        </div>
        {!isCreando && !editando && (
          <Boton
            className="bg-red-600 hover:bg-red-700 text-white flex items-center gap-2"
            onClick={iniciarCreacion}
          >
            <Plus size={18} /> Nueva Categoría
          </Boton>
        )}
      </div>

      {error && <Alerta message={error} type="error" />}
      {success && <Alerta message={success} type="success" />}

      {(isCreando || editando) && (
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-red-100 mb-8 animate-in fade-in slide-in-from-top-4">
          <h3 className="text-lg font-bold text-gray-800 mb-4">
            {isCreando ? "Crear Nueva Categoría" : "Editar Categoría"}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre de Categoría
              </label>
              <Input
                placeholder="Ej. Electrónica"
                value={form.nombre}
                onChange={handleChange("nombre")}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Descripción
              </label>
              <Input
                placeholder="Descripción breve..."
                value={form.descripcion}
                onChange={handleChange("descripcion")}
              />
            </div>
          </div>
          <div className="flex gap-3 justify-end">
            <Boton
              variant="outline"
              className="flex items-center gap-2"
              onClick={cancelarFormulario}
            >
              <X size={16} /> Cancelar
            </Boton>
            <Boton
              className="bg-red-600 hover:bg-red-700 text-white flex items-center gap-2"
              onClick={handleGuardar}
            >
              <Save size={16} /> Guardar
            </Boton>
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-gray-50/80 text-gray-600 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 font-semibold">ID</th>
                <th className="px-6 py-4 font-semibold">Nombre</th>
                <th className="px-6 py-4 font-semibold">Descripción</th>
                <th className="px-6 py-4 font-semibold text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {categorias.map((cat) => (
                <tr key={cat.idCategoria} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 font-semibold text-gray-500">
                    #{cat.idCategoria}
                  </td>
                  <td className="px-6 py-4 font-bold text-gray-900">
                    {cat.nombre}
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    {cat.descripcion}
                  </td>
                  <td className="px-6 py-4 flex justify-end gap-2">
                    <button
                      onClick={() => iniciarEdicion(cat)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Editar"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button
                      onClick={() => handleDesactivar(cat.idCategoria)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Desactivar/Eliminar"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
              {categorias.length === 0 && (
                <tr>
                  <td colSpan="4" className="text-center py-10 text-gray-500">
                    No hay categorías registradas.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default GestionCategorias;
