import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { LogIn } from "lucide-react";

import Boton from "../../components/ui/Boton";
import Input from "../../components/ui/Input";
import Alerta from "../../components/ui/Alerta";
import { useAuth } from "../../context/AuthContext";
import { login as loginService } from "../../services/authService";

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password) {
      setError("Todos los campos son obligatorios.");
      return;
    }

    setLoading(true);
    try {
      const response = await loginService({ email, password });
      const rol = login(response);

      const rutas = {
        CLIENTE: "/",
        VENDEDOR: "/vendedor",
        ADMIN: "/admin",
      };

      navigate(rutas[rol] || "/");
    } catch (err) {
      setError(
        err.response?.data?.message || "Credenciales incorrectas. Intente de nuevo.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-violet-50 to-white px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">
        <div className="mb-6 text-center">
          <LogIn className="mx-auto h-10 w-10 text-violet-600" />
          <h1 className="mt-2 text-2xl font-bold text-gray-800">
            Iniciar Sesión
          </h1>
          <p className="text-sm text-gray-500">
            Ingrese sus credenciales para continuar
          </p>
        </div>

        {error && (
          <div className="mb-4">
            <Alerta message={error} type="error" />
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Correo electrónico
            </label>
            <Input
              type="email"
              placeholder="correo@ejemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Contraseña
            </label>
            <Input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <Boton type="submit" disabled={loading} className="w-full">
            {loading ? "Ingresando..." : "Iniciar sesión"}
          </Boton>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500">
          ¿No tienes cuenta?{" "}
          <Link
            to="/register"
            className="font-medium text-violet-600 hover:text-violet-700"
          >
            Regístrate
          </Link>
        </p>
      </div>
    </main>
  );
}

export default Login;
