import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { UserPlus } from "lucide-react";

import Boton from "../../components/ui/Boton";
import Input from "../../components/ui/Input";
import Alerta from "../../components/ui/Alerta";
import { registrarCliente } from "../../services/usuarioService";
import {
  esRequerido,
  validarEmail,
  validarPassword,
  confirmarPassword,
  validarNombre,
} from "../../utils/validators";

function Registro() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    nombres: "",
    email: "",
    password: "",
    confirmarPassword: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (campo) => (e) => {
    setForm((prev) => ({ ...prev, [campo]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!esRequerido(form.nombres) || !validarNombre(form.nombres)) {
      setError("El nombre debe tener al menos 3 caracteres.");
      return;
    }
    if (!validarEmail(form.email)) {
      setError("Ingrese un correo electrónico válido.");
      return;
    }
    if (!validarPassword(form.password)) {
      setError("La contraseña debe tener al menos 8 caracteres.");
      return;
    }
    if (!confirmarPassword(form.password, form.confirmarPassword)) {
      setError("Las contraseñas no coinciden.");
      return;
    }
    setLoading(true);
    try {
      await registrarCliente({
        nombres: form.nombres,
        apellidos: "",
        email: form.email,
        password: form.password,
      });

      setSuccess("Registro exitoso. Redirigiendo al inicio de sesión...");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Error al registrar. Intente de nuevo.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-violet-50 to-white px-4 py-8">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">
        <div className="mb-6 text-center">
          <UserPlus className="mx-auto h-10 w-10 text-violet-600" />
          <h1 className="mt-2 text-2xl font-bold text-gray-800">
            Crear Cuenta
          </h1>
          <p className="text-sm text-gray-500">
            Regístrese como cliente para empezar a comprar
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
              Nombres completos
            </label>
            <Input
              placeholder="Juan Pérez"
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
              placeholder="correo@ejemplo.com"
              value={form.email}
              onChange={handleChange("email")}
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Contraseña
            </label>
            <Input
              type="password"
              placeholder="Mínimo 8 caracteres"
              value={form.password}
              onChange={handleChange("password")}
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Confirmar contraseña
            </label>
            <Input
              type="password"
              placeholder="Repita la contraseña"
              value={form.confirmarPassword}
              onChange={handleChange("confirmarPassword")}
            />
          </div>

          <Boton type="submit" disabled={loading} className="w-full">
            {loading ? "Registrando..." : "Crear cuenta"}
          </Boton>
        </form>

        <div className="mt-6 space-y-2 text-center text-sm text-gray-500">
          <p>
            ¿Ya tienes cuenta?{" "}
            <Link
              to="/login"
              className="font-medium text-violet-600 hover:text-violet-700"
            >
              Inicia sesión
            </Link>
          </p>
          <p>
            ¿Quieres vender?{" "}
            <Link
              to="/register/vendedor"
              className="font-medium text-violet-600 hover:text-violet-700"
            >
              Regístrate como vendedor
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}

export default Registro;
