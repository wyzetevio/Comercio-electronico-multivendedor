import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Store } from "lucide-react";

import Boton from "../../components/ui/Boton";
import Input from "../../components/ui/Input";
import Alerta from "../../components/ui/Alerta";
import { useAuth } from "../../context/AuthContext";
import { convertirEnVendedor } from "../../services/usuarioService";
import { crearTienda } from "../../services/tiendaService";
import { esRequerido, validarNombre, validarTelefono, validarDescripcion } from "../../utils/validators";

function RegistroVendedor() {
  const navigate = useNavigate();
  const { user, login } = useAuth();

  const [form, setForm] = useState({
    nombreTienda: "",
    descripcion: "",
    direccion: "",
    telefonoContacto: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (campo) => (e) => {
    setForm((prev) => ({ ...prev, [campo]: e.target.value }));
  };

  if (!user) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800">
            Debe iniciar sesión
          </h1>
          <p className="mt-2 text-gray-500">
            Para registrarse como vendedor, primero inicie sesión.
          </p>
          <Boton className="mt-4" onClick={() => navigate("/login")}>
            Ir a iniciar sesión
          </Boton>
        </div>
      </main>
    );
  }

  if (user.rol === "VENDEDOR") {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800">
            Ya eres vendedor
          </h1>
          <p className="mt-2 text-gray-500">
            Puedes gestionar tu tienda desde el panel de vendedor.
          </p>
          <Boton className="mt-4" onClick={() => navigate("/vendedor")}>
            Ir al panel
          </Boton>
        </div>
      </main>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!esRequerido(form.nombreTienda) || !validarNombre(form.nombreTienda)) {
      setError("El nombre de la tienda debe tener al menos 3 caracteres.");
      return;
    }
    if (!esRequerido(form.descripcion) || !validarDescripcion(form.descripcion)) {
      setError("La descripción debe tener al menos 10 caracteres.");
      return;
    }
    if (form.telefonoContacto && !validarTelefono(form.telefonoContacto)) {
      setError("El teléfono debe tener 9 dígitos.");
      return;
    }

    setLoading(true);
    try {
      const vendedor = await convertirEnVendedor(user.idUsuario);

      await crearTienda(vendedor.idVendedor, {
        nombreTienda: form.nombreTienda,
        descripcion: form.descripcion,
        direccion: form.direccion || undefined,
        telefonoContacto: form.telefonoContacto || undefined,
      });

      login({
        ...user,
        rol: "VENDEDOR",
      });

      setSuccess("¡Tienda creada exitosamente! Redirigiendo...");
      setTimeout(() => navigate("/vendedor"), 2000);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Error al crear la tienda. Intente de nuevo.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-amber-50 to-white px-4 py-8">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">
        <div className="mb-6 text-center">
          <Store className="mx-auto h-10 w-10 text-amber-600" />
          <h1 className="mt-2 text-2xl font-bold text-gray-800">
            Regístrate como Vendedor
          </h1>
          <p className="text-sm text-gray-500">
            Crea tu tienda y empieza a vender
          </p>
        </div>

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

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Nombre de la tienda
            </label>
            <Input
              placeholder="Mi Tienda"
              value={form.nombreTienda}
              onChange={handleChange("nombreTienda")}
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Descripción
            </label>
            <textarea
              className="w-full rounded-lg border px-3 py-2 outline-none focus:border-violet-500"
              rows={3}
              placeholder="Describe los productos que venderás..."
              value={form.descripcion}
              onChange={handleChange("descripcion")}
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Dirección (opcional)
            </label>
            <Input
              placeholder="Av. Comercio 456"
              value={form.direccion}
              onChange={handleChange("direccion")}
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Teléfono de contacto (opcional)
            </label>
            <Input
              type="tel"
              placeholder="999888777"
              value={form.telefonoContacto}
              onChange={handleChange("telefonoContacto")}
            />
          </div>

          <Boton type="submit" disabled={loading} className="w-full">
            {loading ? "Creando tienda..." : "Crear tienda"}
          </Boton>
        </form>
      </div>
    </main>
  );
}

export default RegistroVendedor;
