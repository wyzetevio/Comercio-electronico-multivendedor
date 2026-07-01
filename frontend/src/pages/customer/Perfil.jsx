import { useState, useEffect } from "react";
import { User, Save, Lock } from "lucide-react";

import Boton from "../../components/ui/Boton";
import Input from "../../components/ui/Input";
import Alerta from "../../components/ui/Alerta";
import Spinner from "../../components/ui/Spinner";
import { useAuth } from "../../context/AuthContext";
import { obtenerUsuario, actualizarUsuario } from "../../services/usuarioService";
import {
  esRequerido,
  validarNombre,
  validarEmail,
} from "../../utils/validators";

function Perfil() {
  const { user, login } = useAuth();
  const isAdmin = user?.rol === "ADMIN";

  const [form, setForm] = useState({
    nombres: user?.nombres || "",
    email: user?.email || "",
    telefono: "",
    direccion: "",
  });

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isAdmin) {
        setForm({
          nombres: user?.nombres || "",
          email: user?.email || "",
          telefono: "",
          direccion: "",
        });
        return;
      }

      const fetchUser = async () => {
        setLoading(true);
        try {
          const data = await obtenerUsuario(user.idUsuario);
          setForm({
            nombres: data.nombres || "",
            email: data.email || "",
            telefono: data.telefono || "",
            direccion: data.direccion || "",
          });
        } catch {
          setError("Error al cargar los datos del perfil.");
        } finally {
          setLoading(false);
        }
      };

      fetchUser();
    }, 0);
    return () => clearTimeout(timer);
  }, [user, isAdmin]);

  const handleChange = (campo) => (e) => {
    setForm((prev) => ({ ...prev, [campo]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess("");

    if (!esRequerido(form.nombres) || !validarNombre(form.nombres)) {
      setError("El nombre debe tener al menos 3 caracteres.");
      return;
    }
    if (!validarEmail(form.email)) {
      setError("Ingrese un correo electrónico válido.");
      return;
    }

    setSaving(true);
    try {
      const updated = await actualizarUsuario(user.idUsuario, {
        nombres: form.nombres,
        apellidos: "",
        email: form.email,
        telefono: form.telefono || undefined,
        direccion: form.direccion || undefined,
      });

      login({
        ...user,
        nombres: updated.nombres || form.nombres,
        email: updated.email || form.email,
      });

      setSuccess("Perfil actualizado exitosamente.");
    } catch (err) {
      setError(
        err.response?.status === 403
          ? "No tienes permisos para editar el perfil. Contacta a un administrador."
          : err.response?.data?.message || "Error al actualizar el perfil.",
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Spinner size="h-12 w-12" />;

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-2xl px-6 py-8">
        <div className="mb-6 flex items-center gap-3">
          <User className="h-7 w-7 text-violet-600" />
          <h1 className="text-2xl font-bold text-gray-800">Mi Perfil</h1>
        </div>

        {!isAdmin && (
          <div className="mb-6 rounded-lg border border-amber-200 bg-amber-50 p-4">
            <div className="flex items-start gap-3">
              <Lock size={20} className="mt-0.5 text-amber-600" />
              <div>
                <p className="font-medium text-amber-800">
                  Edición restringida
                </p>
                <p className="mt-1 text-sm text-amber-700">
                  La gestión de perfiles está disponible solo para
                  administradores. Para actualizar tus datos, contacta con el
                  equipo de soporte.
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="rounded-xl bg-white p-8 shadow-sm">
          {error && (
            <div className="mb-4">
              <Alerta message={error} type="error" />
            </div>
          )}
          {success && (
            <div className="mb-4">
              <Alerta message={success} type="success" />
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Nombres completos
              </label>
              <Input
                value={form.nombres}
                onChange={handleChange("nombres")}
                disabled={!isAdmin}
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Correo electrónico
              </label>
              <Input
                type="email"
                value={form.email}
                onChange={handleChange("email")}
                disabled={!isAdmin}
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Teléfono
              </label>
              <Input
                type="tel"
                value={form.telefono}
                onChange={handleChange("telefono")}
                placeholder="999888777"
                disabled={!isAdmin}
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Dirección
              </label>
              <textarea
                className="w-full rounded-lg border px-3 py-2 outline-none focus:border-violet-500 disabled:bg-gray-100"
                rows={2}
                value={form.direccion}
                onChange={handleChange("direccion")}
                disabled={!isAdmin}
              />
            </div>

            <Boton
              type="submit"
              disabled={saving || !isAdmin}
              className="flex w-full items-center justify-center gap-2"
            >
              <Save size={18} />
              {saving ? "Guardando..." : "Guardar cambios"}
            </Boton>
          </form>
        </div>
      </div>
    </main>
  );
}

export default Perfil;
