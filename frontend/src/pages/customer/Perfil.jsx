import { useState, useEffect } from "react";
import { User, Save } from "lucide-react";

import Boton from "../../components/ui/Boton";
import Input from "../../components/ui/Input";
import Alerta from "../../components/ui/Alerta";
import Spinner from "../../components/ui/Spinner";
import ErrorMessage from "../../components/common/ErrorMessage";
import { useAuth } from "../../context/AuthContext";
import { obtenerUsuario, actualizarUsuario } from "../../services/usuarioService";
import {
  esRequerido,
  validarNombre,
  validarEmail,
  validarTelefono,
} from "../../utils/validators";

function Perfil() {
  const { user, login } = useAuth();

  const [form, setForm] = useState({
    nombres: "",
    email: "",
    telefono: "",
    direccion: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
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
  }, [user.idUsuario]);

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
    if (form.telefono && !validarTelefono(form.telefono)) {
      setError("El teléfono debe tener 9 dígitos.");
      return;
    }

    setSaving(true);
    try {
      const updated = await actualizarUsuario(user.idUsuario, {
        nombres: form.nombres,
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
        err.response?.data?.message ||
          "Error al actualizar el perfil. Intente de nuevo.",
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Spinner size="h-12 w-12" />;
  if (error && !form.nombres) return <ErrorMessage message={error} />;

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-2xl px-6 py-8">
        <div className="mb-6 flex items-center gap-3">
          <User className="h-7 w-7 text-violet-600" />
          <h1 className="text-2xl font-bold text-gray-800">Mi Perfil</h1>
        </div>

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
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Dirección
              </label>
              <textarea
                className="w-full rounded-lg border px-3 py-2 outline-none focus:border-violet-500"
                rows={2}
                value={form.direccion}
                onChange={handleChange("direccion")}
              />
            </div>

            <Boton
              type="submit"
              disabled={saving}
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
